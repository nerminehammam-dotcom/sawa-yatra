/**
 * Area D tests — signals (spec §6.2, §6.8, §6.9).
 *
 * Locked rules under test: budgets cap volume and force withdrawal before a
 * further send; withdrawal is silent; cool-down applies to both kinds; a
 * standing match requires both directions plus shared context and consumes
 * no live budget; nothing discloses a one-sided standing signal; no
 * acceptance-rate tracking exists; the signals API carries no age field.
 *
 * The policy numbers below are TEST FIXTURES, local to this file. In the
 * app the SignalPolicy values come from content/spec-tokens.ts (the
 * LIVE_SIGNALS, STANDING_SIGNALS, STANDING_MONTHS and COOLDOWN_DAYS tokens,
 * currently unfilled).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import * as signals from "@/lib/membership/signals";
import {
  DuplicateSignalError,
  SignalBudgetExceededError,
  SignalCooldownError,
  emptySignalBook,
  isStandingSignalActive,
  ownStandingSignalsDueForRenewal,
  remainingLiveBudget,
  resolveLiveMatch,
  resolveStandingMatch,
  sendLiveSignal,
  sendStandingSignal,
  withdrawLiveSignal,
  withdrawStandingSignal,
  type SignalBook,
  type SignalPolicy,
} from "@/lib/membership/signals";

const policy: SignalPolicy = {
  liveBudget: 3,
  standingBudget: 10,
  standingExpiryMonths: 12,
  cooldownDays: 30,
};

const T0 = new Date(Date.UTC(2026, 0, 1));
const daysLater = (days: number) =>
  new Date(T0.getTime() + days * 24 * 60 * 60 * 1000);

describe("live signals — §6.2 budget", () => {
  it("binds every live signal to a journey and stays within budget", () => {
    let book = emptySignalBook("me");
    book = sendLiveSignal(book, policy, { toMemberId: "a", journeyId: "j1" }, T0);
    book = sendLiveSignal(book, policy, { toMemberId: "b", journeyId: "j1" }, T0);
    expect(book.live.every((s) => s.journeyId === "j1")).toBe(true);
    expect(remainingLiveBudget(book, policy)).toBe(1);
  });

  it("at budget, sending throws — one must withdraw first", () => {
    let book = emptySignalBook("me");
    for (const target of ["a", "b", "c"]) {
      book = sendLiveSignal(book, policy, { toMemberId: target, journeyId: "j1" }, T0);
    }
    expect(() =>
      sendLiveSignal(book, policy, { toMemberId: "d", journeyId: "j1" }, T0),
    ).toThrow(SignalBudgetExceededError);

    book = withdrawLiveSignal(book, "a", "j1", T0);
    expect(() =>
      sendLiveSignal(book, policy, { toMemberId: "d", journeyId: "j1" }, T0),
    ).not.toThrow();
  });

  it("rejects a duplicate live signal", () => {
    const book = sendLiveSignal(
      emptySignalBook("me"),
      policy,
      { toMemberId: "a", journeyId: "j1" },
      T0,
    );
    expect(() =>
      sendLiveSignal(book, policy, { toMemberId: "a", journeyId: "j1" }, T0),
    ).toThrow(DuplicateSignalError);
  });

  it("withdrawal is silent — the result is a book, with no notification of any kind", () => {
    let book = sendLiveSignal(
      emptySignalBook("me"),
      policy,
      { toMemberId: "a", journeyId: "j1" },
      T0,
    );
    book = withdrawLiveSignal(book, "a", "j1", T0);
    expect(Object.keys(book).sort()).toEqual(
      ["live", "lookingAt", "memberId", "standing", "withdrawn"].sort(),
    );
    expect(JSON.stringify(book)).not.toMatch(/notif|event|alert|told/i);
  });
});

describe("cool-down — §6.8, both kinds", () => {
  it("blocks re-sending a withdrawn live signal to the same member before cooldownDays", () => {
    let book = sendLiveSignal(
      emptySignalBook("me"),
      policy,
      { toMemberId: "a", journeyId: "j1" },
      T0,
    );
    book = withdrawLiveSignal(book, "a", "j1", T0);
    expect(() =>
      sendLiveSignal(book, policy, { toMemberId: "a", journeyId: "j1" }, daysLater(29)),
    ).toThrow(SignalCooldownError);
    expect(() =>
      sendLiveSignal(book, policy, { toMemberId: "a", journeyId: "j1" }, daysLater(31)),
    ).not.toThrow();
  });

  it("blocks re-sending a withdrawn standing signal to the same member before cooldownDays", () => {
    let book = sendStandingSignal(emptySignalBook("me"), policy, "a", T0);
    book = withdrawStandingSignal(book, "a", T0);
    expect(() => sendStandingSignal(book, policy, "a", daysLater(29))).toThrow(
      SignalCooldownError,
    );
    expect(() =>
      sendStandingSignal(book, policy, "a", daysLater(31)),
    ).not.toThrow();
  });

  it("cool-down toward one member does not touch another", () => {
    let book = sendLiveSignal(
      emptySignalBook("me"),
      policy,
      { toMemberId: "a", journeyId: "j1" },
      T0,
    );
    book = withdrawLiveSignal(book, "a", "j1", T0);
    expect(() =>
      sendLiveSignal(book, policy, { toMemberId: "b", journeyId: "j1" }, daysLater(1)),
    ).not.toThrow();
  });
});

describe("standing signals — §6.2 shortlist", () => {
  it("enforces the standing budget", () => {
    let book = emptySignalBook("me");
    for (let index = 0; index < policy.standingBudget; index += 1) {
      book = sendStandingSignal(book, policy, `member-${index}`, T0);
    }
    expect(() => sendStandingSignal(book, policy, "one-more", T0)).toThrow(
      SignalBudgetExceededError,
    );
  });

  it("expires per policy, with a quiet renewal prompt on the member's own view only", () => {
    const book = sendStandingSignal(emptySignalBook("me"), policy, "a", T0);
    const signal = book.standing[0];
    expect(signal).toBeDefined();
    if (signal === undefined) return;
    expect(isStandingSignalActive(signal, policy, daysLater(300))).toBe(true);
    expect(isStandingSignalActive(signal, policy, daysLater(400))).toBe(false);
    expect(ownStandingSignalsDueForRenewal(book, policy, daysLater(400))).toHaveLength(1);
  });
});

describe("matches — the only visibility a signal ever gains", () => {
  const shared = { kind: "journey", journeyId: "j1" } as const;

  function looking(book: SignalBook, ...ids: string[]): SignalBook {
    return { ...book, lookingAt: ids };
  }

  it("live: one-sided produces nothing", () => {
    const a = sendLiveSignal(
      emptySignalBook("a"),
      policy,
      { toMemberId: "b", journeyId: "j1" },
      T0,
    );
    expect(resolveLiveMatch(a, emptySignalBook("b"), "j1", T0)).toBeNull();
  });

  it("live: mutual on the same journey notifies both, simultaneously", () => {
    const a = sendLiveSignal(
      emptySignalBook("a"),
      policy,
      { toMemberId: "b", journeyId: "j1" },
      T0,
    );
    const b = sendLiveSignal(
      emptySignalBook("b"),
      policy,
      { toMemberId: "a", journeyId: "j1" },
      T0,
    );
    const match = resolveLiveMatch(a, b, "j1", T0);
    expect(match).not.toBeNull();
    expect(match?.revealStage).toBe(1);
    const [first, second] = match?.notifications ?? [];
    expect(first?.at.getTime()).toBe(second?.at.getTime());
    expect(first?.simultaneous).toBe(true);
    expect(second?.simultaneous).toBe(true);
    // different journeys: no match
    expect(resolveLiveMatch(a, b, "j2", T0)).toBeNull();
  });

  it("standing: requires BOTH directions AND shared context", () => {
    const aOneSided = looking(
      sendStandingSignal(emptySignalBook("a"), policy, "b", T0),
      "j1",
    );
    const bEmpty = looking(emptySignalBook("b"), "j1");
    expect(resolveStandingMatch(aOneSided, bEmpty, shared, policy, T0)).toBeNull();

    const bMutualNotLooking = sendStandingSignal(emptySignalBook("b"), policy, "a", T0);
    expect(
      resolveStandingMatch(aOneSided, bMutualNotLooking, shared, policy, T0),
    ).toBeNull();

    const bMutualLooking = looking(bMutualNotLooking, "j1");
    const match = resolveStandingMatch(aOneSided, bMutualLooking, shared, policy, T0);
    expect(match).not.toBeNull();
    expect(match?.revealStage).toBe(1);
    expect(match?.notifications).toHaveLength(2);
  });

  it("standing: an expired signal cannot match", () => {
    const a = looking(sendStandingSignal(emptySignalBook("a"), policy, "b", T0), "j1");
    const b = looking(sendStandingSignal(emptySignalBook("b"), policy, "a", T0), "j1");
    expect(resolveStandingMatch(a, b, shared, policy, daysLater(400))).toBeNull();
  });

  it("standing match does not consume live budget", () => {
    const a = looking(sendStandingSignal(emptySignalBook("a"), policy, "b", T0), "j1");
    const b = looking(sendStandingSignal(emptySignalBook("b"), policy, "a", T0), "j1");
    const match = resolveStandingMatch(a, b, shared, policy, T0);
    expect(match?.consumesLiveBudget).toBe(false);
    // The books are untouched — full live budget still available to both.
    expect(remainingLiveBudget(a, policy)).toBe(policy.liveBudget);
    expect(remainingLiveBudget(b, policy)).toBe(policy.liveBudget);
  });
});

describe("locked absences — §6.2, §6.9, rule 4.4", () => {
  it("exports nothing matching /acceptance|throttl/ — deliberately not built (§6.9)", () => {
    for (const exportName of Object.keys(signals)) {
      expect(exportName).not.toMatch(/acceptance|throttl/i);
    }
  });

  it("exports nothing that could disclose another member's one-sided standing state", () => {
    for (const exportName of Object.keys(signals)) {
      expect(exportName).not.toMatch(/heldOn|incoming|received|admirer|pending|whoSignal/i);
    }
  });

  it("the signals API never references the age field in any form (rule 4.4)", () => {
    const source = readFileSync(
      join(process.cwd(), "lib/membership/signals.ts"),
      "utf8",
    );
    expect(source).not.toMatch(/bracket/i);
  });
});
