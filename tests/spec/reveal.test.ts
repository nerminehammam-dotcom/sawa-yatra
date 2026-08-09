/**
 * Area D tests — the graduated reveal (spec §6.7, rules 4.7, 4.8).
 *
 * Locked rules under test: stage 2 opens photograph and first name only;
 * nothing is asked of a member before checkout (no payment or document key
 * on stage-1/2 transition inputs); the reveal is symmetric and logged with
 * identical timestamps; the identity check record retains no image.
 */
import { describe, expect, it } from "vitest";

import {
  toPassport,
  type HiddenProfile,
  type PassportSource,
} from "@/lib/membership/identity";
import {
  REVEAL_REQUIRES_NOTHING_BEFORE_CHECKOUT,
  advanceReveal,
  stageOneOpens,
  stageThreeOpens,
  stageTwoOpens,
  verifyIdentity,
  type RevealPair,
  type StageOneTrigger,
  type StageTwoTrigger,
} from "@/lib/membership/reveal";

const NOW = new Date(Date.UTC(2026, 7, 8, 12, 0, 0));
const pair: RevealPair = { memberA: "m-a", memberB: "m-b" };

const profile: HiddenProfile = {
  memberId: "m-a",
  legalName: "Amelia Example Hartley",
  dateOfBirth: new Date(Date.UTC(1979, 2, 14)),
  email: "hidden@example.com",
  mobile: "+20 100 000 0000",
  socialAnchor: null,
  sponsoringMemberId: null,
};

const source: PassportSource = {
  archetypeIconId: "icon-cartographer",
  archetypeName: "The Cartographer",
  keywords: ["patient", "map-minded", "early riser", "listens"],
  reading: {
    axes: [
      { axis: "pace", text: "a" },
      { axis: "company", text: "b" },
      { axis: "planning", text: "c" },
      { axis: "comfort", text: "d" },
      { axis: "curiosity", text: "e" },
    ],
    description: "Steady on a long road.",
  },
  openSpace: { visibility: "members", entries: [] },
};

describe("rule 4.7 — nothing before checkout", () => {
  it("exports the checkable fact", () => {
    expect(REVEAL_REQUIRES_NOTHING_BEFORE_CHECKOUT).toBe(true);
  });

  it("stage-1 and stage-2 transition inputs contain no payment or document key", () => {
    const stageOne: StageOneTrigger = { kind: "mutual-interest", via: "standing" };
    const stageTwo: StageTwoTrigger = { kind: "commitment", journeyId: "j1" };
    for (const trigger of [stageOne, stageTwo]) {
      for (const key of Object.keys(trigger)) {
        expect(key).not.toMatch(
          /deposit|payment|fee|hold|money|charge|document|identity|scan/i,
        );
      }
    }
  });
});

describe("what opens at each stage — §6.7", () => {
  it("stage 1: first name, message channel, passport in full", () => {
    const passport = toPassport(profile, source, NOW);
    const opens = stageOneOpens("Amelia", "channel-1", passport);
    expect(Object.keys(opens).sort()).toEqual(
      ["firstName", "fullPassport", "messageChannelId"].sort(),
    );
  });

  it("stage 2: photograph and first name — NOTHING more", () => {
    const opens = stageTwoOpens("photo-ref", "Amelia");
    expect(Object.keys(opens).sort()).toEqual(["firstName", "photograph"]);
    expect(JSON.stringify(opens)).not.toMatch(/surname|familyName|lastName|legalName/i);
    expect(Object.isFrozen(opens)).toBe(true);
  });

  it("stage 3: legal name to Sawayatra alone, identity check, roster policy by token reference", () => {
    const opens = stageThreeOpens();
    expect(opens.legalNameToSawayatra).toBe(true);
    expect(opens.identityCheck).toBe(true);
    // Unfilled and sign-off-owned: a token reference, never a guessed value.
    expect(opens.rosterNamePolicy).toEqual({ token: "ROSTER_NAME_POLICY" });
  });
});

describe("symmetric, logged advancement — §6.7", () => {
  it("returns events for BOTH members with identical timestamps", () => {
    const advancement = advanceReveal(
      pair,
      { kind: "mutual-interest", via: "live" },
      NOW,
    );
    expect(advancement.stage).toBe(1);
    const [eventA, eventB] = advancement.events;
    expect(eventA.at.getTime()).toBe(eventB.at.getTime());
    expect(eventA.memberId).toBe("m-a");
    expect(eventA.sawMemberId).toBe("m-b");
    expect(eventB.memberId).toBe("m-b");
    expect(eventB.sawMemberId).toBe("m-a");
  });

  it("each sees that the other saw them, at every stage", () => {
    const stages = [
      advanceReveal(pair, { kind: "mutual-interest", via: "standing" }, NOW),
      advanceReveal(pair, { kind: "commitment", journeyId: "j1" }, NOW),
      advanceReveal(
        pair,
        {
          kind: "checkout",
          journeyId: "j1",
          identityCheck: { passed: true, date: NOW, verifier: "v-1" },
        },
        NOW,
      ),
    ];
    expect(stages.map((advancement) => advancement.stage)).toEqual([1, 2, 3]);
    for (const advancement of stages) {
      for (const event of advancement.events) {
        expect(event.seenByOther).toBe(true);
      }
    }
  });
});

describe("rule 4.8 — verified and destroyed, zero retention", () => {
  it("verifyIdentity records pass/fail, date, verifier — and never the image", () => {
    const imageRef = { opaque: "image-handle-123" };
    const destroyed: unknown[] = [];
    const record = verifyIdentity(
      { memberId: "m-a", verifier: "clerk-7", imageRef },
      () => true,
      (ref) => destroyed.push(ref),
      NOW,
    );
    expect(record.passed).toBe(true);
    expect(record.verifier).toBe("clerk-7");
    expect(record.date).toBe(NOW);
    expect(Object.keys(record).sort()).toEqual(["date", "passed", "verifier"]);
    expect(JSON.stringify(record)).not.toContain("image-handle-123");
    expect(destroyed).toEqual([imageRef]);
  });

  it("destroys the image even when inspection throws", () => {
    const destroyed: unknown[] = [];
    expect(() =>
      verifyIdentity(
        { memberId: "m-a", verifier: "clerk-7", imageRef: "ref-x" },
        () => {
          throw new Error("unreadable document");
        },
        (ref) => destroyed.push(ref),
        NOW,
      ),
    ).toThrow("unreadable document");
    expect(destroyed).toEqual(["ref-x"]);
  });

  it("records a failed check without retaining anything extra", () => {
    const record = verifyIdentity(
      { memberId: "m-a", verifier: "clerk-7", imageRef: "ref-y" },
      () => false,
      () => undefined,
      NOW,
    );
    expect(record.passed).toBe(false);
    expect(Object.keys(record).sort()).toEqual(["date", "passed", "verifier"]);
  });
});
