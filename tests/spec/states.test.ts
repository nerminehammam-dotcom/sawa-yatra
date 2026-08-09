/**
 * Area H tests — member states (spec §10).
 *
 * Locked rules under test: all nine states; the transition table including
 * the three reverse transitions; Removed terminal; per-state capability and
 * passport-visibility rules; Lapsed excluded from any forming roster and
 * from the demand map; lapse threshold policy-injected.
 *
 * The lapseMonths number below is a TEST FIXTURE, local to this file. In
 * the app the value comes from the LAPSE_MONTHS token in
 * content/spec-tokens.ts (currently unfilled).
 */
import { describe, expect, it } from "vitest";

import {
  InvalidTransitionError,
  MEMBER_STATES,
  PASSPORT_VISIBILITY,
  REMOVED_IS_TERMINAL,
  STATE_CAPABILITIES,
  TRANSITIONS,
  isCountedInDemandMap,
  isEligibleForFormingRoster,
  reEnterAfterRemoval,
  shouldLapse,
  transitionMember,
  type MemberEvent,
  type MemberState,
  type StatePolicy,
} from "@/lib/membership/states";

const ALL_EVENTS: readonly MemberEvent[] = [
  "invitation",
  "registration",
  "verification",
  "conversationOpened",
  "checkoutCompleted",
  "journeyTravelled",
  "inactivityLapse",
  "signIn",
  "cancellation",
  "conversationWithdrawn",
  "removal",
];

describe("the nine states — §10", () => {
  it("defines exactly the nine states, in table order", () => {
    expect(MEMBER_STATES).toEqual([
      "visitor",
      "invited",
      "registered",
      "verified",
      "inConversation",
      "committed",
      "travelled",
      "lapsed",
      "removed",
    ]);
  });

  it("every state has capability and passport-visibility rules", () => {
    for (const state of MEMBER_STATES) {
      expect(STATE_CAPABILITIES[state]).toBeDefined();
      expect(PASSPORT_VISIBILITY[state]).toBeDefined();
    }
  });
});

describe("forward transitions — §10 'entered from'", () => {
  it("walks the forward chain", () => {
    expect(transitionMember("visitor", "invitation").to).toBe("invited");
    expect(transitionMember("invited", "registration").to).toBe("registered");
    expect(transitionMember("registered", "verification").to).toBe("verified");
    expect(transitionMember("verified", "conversationOpened").to).toBe(
      "inConversation",
    );
    expect(transitionMember("inConversation", "checkoutCompleted").to).toBe(
      "committed",
    );
    expect(transitionMember("committed", "journeyTravelled").to).toBe(
      "travelled",
    );
  });

  it("Verified → Lapsed on inactivity, silently", () => {
    const rule = transitionMember("verified", "inactivityLapse");
    expect(rule.to).toBe("lapsed");
    expect(rule.silent).toBe(true);
  });

  it("rejects transitions the table does not contain", () => {
    expect(() => transitionMember("visitor", "checkoutCompleted")).toThrow(
      InvalidTransitionError,
    );
    expect(() => transitionMember("registered", "conversationOpened")).toThrow(
      InvalidTransitionError,
    );
  });
});

describe("reverse transitions — §10", () => {
  it("Lapsed → Verified on sign-in: silent, budgets restored", () => {
    const rule = transitionMember("lapsed", "signIn");
    expect(rule.to).toBe("verified");
    expect(rule.silent).toBe(true);
    expect(rule.restoresSignalBudgets).toBe(true);
  });

  it("Committed → Verified on cancellation", () => {
    const rule = transitionMember("committed", "cancellation");
    expect(rule.to).toBe("verified");
  });

  it("InConversation → Verified on withdrawal: silent, no notification to the other", () => {
    const rule = transitionMember("inConversation", "conversationWithdrawn");
    expect(rule.to).toBe("verified");
    expect(rule.silent).toBe(true);
    expect(rule.notifiesOtherParty).toBe(false);
  });
});

describe("removal — §10, §5.4", () => {
  it("may be entered from any non-removed state", () => {
    for (const state of MEMBER_STATES) {
      if (state === "removed") continue;
      expect(transitionMember(state, "removal").to).toBe("removed");
    }
  });

  it("Removed is terminal: no event leaves it", () => {
    expect(REMOVED_IS_TERMINAL).toBe(true);
    expect(TRANSITIONS.some((rule) => rule.from === "removed")).toBe(false);
    for (const event of ALL_EVENTS) {
      expect(() => transitionMember("removed", event)).toThrow(
        InvalidTransitionError,
      );
    }
  });

  it("re-entry happens only by fresh invitation, beginning again at Invited", () => {
    expect(
      reEnterAfterRemoval({ freshInvitation: true, atSawayatrasDiscretion: true }),
    ).toBe("invited");
  });
});

describe("per-state capabilities and passport visibility — §10 table", () => {
  it("Visitor: browse and questionnaire only; no passport exists", () => {
    const caps = STATE_CAPABILITIES.visitor;
    expect(caps.browsePublicSite).toBe(true);
    expect(caps.takeQuestionnairePrivately).toBe(true);
    expect(caps.holdSignals).toBe(false);
    expect(PASSPORT_VISIBILITY.visitor.exists).toBe(false);
  });

  it("Registered: nothing member-facing; passport not visible", () => {
    expect(STATE_CAPABILITIES.registered.fullMemberSurface).toBe(false);
    expect(PASSPORT_VISIBILITY.registered.visibleToMembers).toBe(false);
  });

  it("Verified: full member surface, signals, windows; passport visible", () => {
    const caps = STATE_CAPABILITIES.verified;
    expect(caps.fullMemberSurface).toBe(true);
    expect(caps.holdSignals).toBe(true);
    expect(caps.markWindows).toBe(true);
    expect(PASSPORT_VISIBILITY.verified.visibleToMembers).toBe(true);
  });

  it("Committed: section membership; passport visible in roster", () => {
    expect(STATE_CAPABILITIES.committed.sectionMembership).toBe(true);
    expect(PASSPORT_VISIBILITY.committed.rosterContext).toBe(true);
  });

  it("Lapsed: read-only, cannot signal; passport visible but marked", () => {
    const caps = STATE_CAPABILITIES.lapsed;
    expect(caps.readOnly).toBe(true);
    expect(caps.holdSignals).toBe(false);
    expect(caps.markWindows).toBe(false);
    expect(caps.message).toBe(false);
    const visibility = PASSPORT_VISIBILITY.lapsed;
    expect(visibility.visibleToMembers).toBe(true);
    expect(visibility.markedNotCurrentlyTravelling).toBe(true);
  });

  it("Removed: nothing; open space deleted, passport not visible", () => {
    const caps = STATE_CAPABILITIES.removed;
    for (const value of Object.values(caps)) {
      expect(value).toBe(false);
    }
    const visibility = PASSPORT_VISIBILITY.removed;
    expect(visibility.visibleToMembers).toBe(false);
    expect(visibility.openSpaceDeleted).toBe(true);
  });
});

describe("Lapsed exclusion — §10", () => {
  const excluded: readonly MemberState[] = [
    "visitor",
    "invited",
    "registered",
    "lapsed",
    "removed",
  ];
  const included: readonly MemberState[] = [
    "verified",
    "inConversation",
    "committed",
    "travelled",
  ];

  it("Lapsed and everything below Verified are excluded from forming rosters", () => {
    for (const state of excluded) {
      expect(isEligibleForFormingRoster(state)).toBe(false);
    }
    for (const state of included) {
      expect(isEligibleForFormingRoster(state)).toBe(true);
    }
  });

  it("Lapsed and everything below Verified are excluded from the demand map", () => {
    for (const state of excluded) {
      expect(isCountedInDemandMap(state)).toBe(false);
    }
    for (const state of included) {
      expect(isCountedInDemandMap(state)).toBe(true);
    }
  });
});

describe("lapse threshold — policy-injected, never a literal", () => {
  // TEST FIXTURE — in the app this comes from the LAPSE_MONTHS token.
  const policy: StatePolicy = { lapseMonths: 6 };
  const lastActive = new Date(Date.UTC(2026, 0, 15));

  it("does not lapse before the threshold", () => {
    expect(shouldLapse(lastActive, new Date(Date.UTC(2026, 5, 14)), policy)).toBe(
      false,
    );
  });

  it("lapses at and after the threshold", () => {
    expect(shouldLapse(lastActive, new Date(Date.UTC(2026, 6, 15)), policy)).toBe(
      true,
    );
    expect(shouldLapse(lastActive, new Date(Date.UTC(2027, 0, 1)), policy)).toBe(
      true,
    );
  });
});
