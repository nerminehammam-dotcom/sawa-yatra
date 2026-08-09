/** Area E — §7 pricing shape: bands, eight states, §7.7 order, upgrades. */
import { describe, expect, it } from "vitest";

import {
  bandForGroupSize,
  computeLadder,
  emptyLadder,
  FLOOR_PRICE_TOKEN,
  GROUP_CEILING,
  ladderAfterUpgrade,
  PRICE_BANDS,
  resolveCancellation,
  resolveLockDate,
  type LadderPolicy,
} from "@/lib/journeys/pricing";
import {
  canMarkAnotherWindow,
  createFormingPolicy,
  shouldIssueQuorumCall,
  tallyApprovalVote,
  toDemandMap,
} from "@/lib/journeys/forming";

// Test fixtures only — these numbers never reach a surface.
const policy: LadderPolicy = { minGroup: 6, lockDays: 60 };
const departure = new Date("2028-02-01T00:00:00Z");
const wellBefore = new Date("2027-06-01T00:00:00Z");
const afterLock = new Date("2028-01-15T00:00:00Z");

function ladderAt(travellers: number, now = wellBefore, extra = {}) {
  return computeLadder({ travellers, departureDate: departure, now, ...extra }, policy);
}

describe("§7.3 bands", () => {
  it("six bands, ceiling twelve, prices are tokens", () => {
    expect(PRICE_BANDS).toHaveLength(6);
    expect(GROUP_CEILING).toBe(12);
    for (const band of PRICE_BANDS) {
      expect(band.priceToken).toMatch(/^PRICE_T[1-6]$/);
    }
    expect(FLOOR_PRICE_TOKEN).toBe("PRICE_T6");
  });

  it("maps group size to band per the table", () => {
    expect(bandForGroupSize(0)).toBeNull();
    expect(bandForGroupSize(1)?.band).toBe(1);
    expect(bandForGroupSize(3)?.band).toBe(2);
    expect(bandForGroupSize(5)?.band).toBe(3);
    expect(bandForGroupSize(7)?.band).toBe(4);
    expect(bandForGroupSize(9)?.band).toBe(5);
    expect(bandForGroupSize(12)?.band).toBe(6);
    expect(() => bandForGroupSize(13)).toThrow(/ceiling/i);
  });
});

describe("§7.5 — all eight ladder states", () => {
  it("empty", () => expect(ladderAt(0).state).toBe("empty"));
  it("below minimum", () => expect(ladderAt(3).state).toBe("below-minimum"));
  it("at minimum", () => expect(ladderAt(6).state).toBe("at-minimum"));
  it("mid-band", () => expect(ladderAt(8).state).toBe("mid-band"));
  it("final band", () => expect(ladderAt(11).state).toBe("final-band"));
  it("locked", () => expect(ladderAt(8, afterLock).state).toBe("locked"));
  it("closed", () =>
    expect(ladderAt(8, wellBefore, { closed: true }).state).toBe("closed"));
  it("cancelled", () =>
    expect(ladderAt(3, wellBefore, { cancelled: true }).state).toBe("cancelled"));

  it("tells the member what joining does — next band and joiners to it", () => {
    const view = ladderAt(6);
    expect(view.currentBand?.band).toBe(4);
    expect(view.nextBand?.band).toBe(5);
    expect(view.joinersToNextBand).toBe(2);
  });

  it("emptyLadder needs no numeric policy — honest pre-launch state", () => {
    expect(emptyLadder().state).toBe("empty");
    expect(emptyLadder().currentBand).toBeNull();
  });
});

describe("§7.7 — replacement, then fee-holds-price, then lock", () => {
  const fullReplacement = {
    replacementIsVerifiedMember: true,
    replacementPassedIdentityCheck: true,
    groupNotified: true,
    beforeReplacementDeadline: true,
  };

  it("a valid replacement moves nobody's price and changes no group size", () => {
    const outcome = resolveCancellation(fullReplacement, ladderAt(8));
    expect(outcome.kind).toBe("replacement");
    if (outcome.kind === "replacement") {
      expect(outcome.groupSizeChanges).toBe(false);
      expect(outcome.priceMoves).toBe(false);
      expect(outcome.noticeToken).toBe("SUBSTITUTION_NOTICE");
    }
  });

  it("a seat is never handed to an unvetted friend", () => {
    const outcome = resolveCancellation(
      { ...fullReplacement, replacementIsVerifiedMember: false },
      ladderAt(8),
    );
    expect(outcome.kind).toBe("fee-holds-price");
  });

  it("replacement must pass the checkout identity check unchanged", () => {
    const outcome = resolveCancellation(
      { ...fullReplacement, replacementPassedIdentityCheck: false },
      ladderAt(8),
    );
    expect(outcome.kind).toBe("fee-holds-price");
  });

  it("no replacement → the fee is applied FIRST to holding the price; shortfall stays a [SIGN-OFF] token", () => {
    const outcome = resolveCancellation(null, ladderAt(8));
    expect(outcome.kind).toBe("fee-holds-price");
    if (outcome.kind === "fee-holds-price") {
      expect(outcome.feeAppliedFirstToHoldPrice).toBe(true);
      expect(outcome.shortfallToken).toBe("SHORTFALL_HOLDER");
      expect(outcome.rebandNoticeToken).toBe("REBAND_NOTICE");
    }
  });

  it("after the lock date: forfeit, no re-banding, nobody's price moves", () => {
    const outcome = resolveCancellation(fullReplacement, ladderAt(8, afterLock));
    expect(outcome.kind).toBe("after-lock");
    if (outcome.kind === "after-lock") expect(outcome.priceMoves).toBe(false);
  });

  it("below minimum at lock: does not run, full refund, decided AT the lock date", () => {
    const result = resolveLockDate(ladderAt(3, afterLock), policy);
    expect(result).toEqual({ runs: false, fullRefund: true, decidedAtLockDate: true });
    expect(resolveLockDate(ladderAt(8, afterLock), policy).runs).toBe(true);
  });
});

describe("§7.8 — upgrades never move anyone's band", () => {
  it("the ladder is unchanged by any upgrade, by construction", () => {
    const before = ladderAt(8);
    expect(ladderAfterUpgrade(before)).toBe(before);
  });
});

describe("§6.3–6.6 — forming tools", () => {
  const formingPolicy = createFormingPolicy({
    quorumTrigger: 8,
    minGroup: 6,
    consideringMax: 3,
  });

  it("QUORUM_TRIGGER must sit above MIN_GROUP", () => {
    expect(() =>
      createFormingPolicy({ quorumTrigger: 6, minGroup: 6, consideringMax: 3 }),
    ).toThrow(/above/i);
  });

  it("windows are capped at the considering maximum", () => {
    expect(canMarkAnotherWindow(2, formingPolicy)).toBe(true);
    expect(canMarkAnotherWindow(3, formingPolicy)).toBe(false);
  });

  it("the demand map is density only — entries cannot carry a member", () => {
    const map = toDemandMap([
      {
        title: "Section 4",
        route: "Cusco to Uyuni",
        windows: [
          { id: "w1", label: "Southern autumn", consideringCount: 11, proposedByMember: false },
          { id: "w2", label: "Southern spring", consideringCount: 3, proposedByMember: true },
        ],
      },
    ]);
    expect(map).toHaveLength(2);
    for (const entry of map) {
      expect(Object.keys(entry).sort()).toEqual([
        "consideringCount",
        "sectionRoute",
        "sectionTitle",
        "windowLabel",
      ]);
    }
  });

  it("quorum call fires at the trigger, and approval voting finds widest coverage", () => {
    expect(
      shouldIssueQuorumCall(
        { id: "w", label: "Southern autumn", consideringCount: 8, proposedByMember: false },
        formingPolicy,
      ),
    ).toBe(true);

    const result = tallyApprovalVote(
      [
        { id: "d1", label: "Mar 3", operatorFeasible: true },
        { id: "d2", label: "Mar 17", operatorFeasible: true },
        { id: "d3", label: "Apr 2", operatorFeasible: true },
      ],
      [
        { memberId: "a", approvedDateIds: ["d1", "d2"] },
        { memberId: "b", approvedDateIds: ["d2"] },
        { memberId: "c", approvedDateIds: ["d2", "d3"] },
        { memberId: "d", approvedDateIds: ["d1"] },
      ],
    );
    expect(result?.winningDateId).toBe("d2");
    expect(result?.approvals).toBe(3);
    // Whoever's dates did not survive stays in the window for the next call.
    expect(result?.remainInWindow).toEqual(["d"]);
    expect(result?.movesJourneyTo).toBe("fixed");
  });
});
