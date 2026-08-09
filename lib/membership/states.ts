/**
 * Member states — spec v3.1 §10. Nine states, a transition table with
 * reverse transitions, and per-state capability and passport-visibility
 * rules.
 *
 * The lapse threshold is policy-injected: in the app it comes from the
 * LAPSE_MONTHS token in content/spec-tokens.ts (currently unfilled). No
 * literal stands in for it here.
 *
 * Lapsed passports stay visible but marked "not currently travelling", and
 * are excluded from any forming roster and from the demand map — leaving
 * them counted would inflate the pool, waste other members' scarce signals,
 * and corrupt the quorum trigger.
 */

// ---------------------------------------------------------------------------
// The nine states
// ---------------------------------------------------------------------------

export const MEMBER_STATES = [
  "visitor",
  "invited",
  "registered",
  "verified",
  "inConversation",
  "committed",
  "travelled",
  "lapsed",
  "removed",
] as const;

export type MemberState = (typeof MEMBER_STATES)[number];

// ---------------------------------------------------------------------------
// Policy — injected, never defaulted.
// ---------------------------------------------------------------------------

/** lapseMonths arrives from the LAPSE_MONTHS token (§13). */
export interface StatePolicy {
  readonly lapseMonths: number;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

/** Verified → Lapsed after the policy's inactivity threshold. */
export function shouldLapse(
  lastActiveAt: Date,
  now: Date,
  policy: StatePolicy,
): boolean {
  return now.getTime() >= addMonths(lastActiveAt, policy.lapseMonths).getTime();
}

// ---------------------------------------------------------------------------
// Transition table (§10), including reverse transitions.
// ---------------------------------------------------------------------------

export type MemberEvent =
  | "invitation"
  | "registration"
  | "verification"
  | "conversationOpened"
  | "checkoutCompleted"
  | "journeyTravelled"
  | "inactivityLapse"
  | "signIn"
  | "cancellation"
  | "conversationWithdrawn"
  | "removal";

export interface TransitionRule {
  readonly from: MemberState;
  readonly to: MemberState;
  readonly on: MemberEvent;
  /** Silent transitions produce no announcement to the member or anyone else. */
  readonly silent: boolean;
  /** Whether the other party to a conversation is told. §10: withdrawal — no. */
  readonly notifiesOtherParty: boolean;
  /** Lapsed → Verified restores signal budgets (§10). */
  readonly restoresSignalBudgets: boolean;
  readonly note?: string;
}

const NON_REMOVED_STATES = MEMBER_STATES.filter(
  (state): state is Exclude<MemberState, "removed"> => state !== "removed",
);

/** Removal may be entered from any state (§10) — and from nowhere back out. */
const REMOVAL_RULES: readonly TransitionRule[] = NON_REMOVED_STATES.map(
  (from) => ({
    from,
    to: "removed" as const,
    on: "removal" as const,
    silent: false,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
    note: "Requires a written reason from a documented list of grounds, with a stated appeal route to a named human (§5.4).",
  }),
);

export const TRANSITIONS: readonly TransitionRule[] = [
  {
    from: "visitor",
    to: "invited",
    on: "invitation",
    silent: false,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
  },
  {
    from: "invited",
    to: "registered",
    on: "registration",
    silent: false,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
  },
  {
    from: "registered",
    to: "verified",
    on: "verification",
    silent: false,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
  },
  {
    from: "verified",
    to: "inConversation",
    on: "conversationOpened",
    silent: false,
    notifiesOtherParty: true,
    restoresSignalBudgets: false,
  },
  {
    from: "inConversation",
    to: "committed",
    on: "checkoutCompleted",
    silent: false,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
    note: "Checkout + identity check (§10); the identity document is verified and destroyed (4.8).",
  },
  {
    from: "committed",
    to: "travelled",
    on: "journeyTravelled",
    silent: false,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
    note: "Stamp added.",
  },
  {
    from: "verified",
    to: "lapsed",
    on: "inactivityLapse",
    silent: true,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
    note: "After the inactivity threshold per the LAPSE_MONTHS token, policy-injected via shouldLapse.",
  },
  // ---- Reverse transitions (§10) ----
  {
    from: "lapsed",
    to: "verified",
    on: "signIn",
    silent: true,
    notifiesOtherParty: false,
    restoresSignalBudgets: true,
    note: "Any sign-in, silently; standing signals renewable if within the STANDING_MONTHS token window.",
  },
  {
    from: "committed",
    to: "verified",
    on: "cancellation",
    silent: false,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
    note: "§7.7 applies — replacement preferred, then the cancellation fee holds the group's price.",
  },
  {
    from: "inConversation",
    to: "verified",
    on: "conversationWithdrawn",
    silent: true,
    notifiesOtherParty: false,
    restoresSignalBudgets: false,
    note: "Withdrawal by either party, silently, with no notification to the other.",
  },
  ...REMOVAL_RULES,
];

/** Removed is terminal: no transition leaves it. */
export const REMOVED_IS_TERMINAL = true as const;

export class InvalidTransitionError extends Error {
  constructor(state: MemberState, event: MemberEvent) {
    super(
      state === "removed"
        ? `Removed is terminal (§10): no event leaves it. Re-entry requires a fresh invitation and is at Sawayatra's discretion.`
        : `No §10 transition from "${state}" on "${event}".`,
    );
    this.name = "InvalidTransitionError";
  }
}

export function transitionMember(
  state: MemberState,
  event: MemberEvent,
): TransitionRule {
  const rule = TRANSITIONS.find(
    (candidate) => candidate.from === state && candidate.on === event,
  );
  if (rule === undefined) {
    throw new InvalidTransitionError(state, event);
  }
  return rule;
}

/**
 * The one route back after removal (§10): a fresh invitation, at Sawayatra's
 * discretion, beginning a new membership at Invited. Not a transition out of
 * Removed — the removed record stays terminal.
 */
export function reEnterAfterRemoval(grant: {
  readonly freshInvitation: true;
  readonly atSawayatrasDiscretion: true;
}): Extract<MemberState, "invited"> {
  void grant;
  return "invited";
}

// ---------------------------------------------------------------------------
// Per-state capabilities and passport visibility (§10 table)
// ---------------------------------------------------------------------------

export interface StateCapabilities {
  readonly browsePublicSite: boolean;
  readonly takeQuestionnairePrivately: boolean;
  readonly register: boolean;
  readonly fullMemberSurface: boolean;
  readonly holdSignals: boolean;
  readonly markWindows: boolean;
  readonly message: boolean;
  readonly sectionMembership: boolean;
  readonly readOnly: boolean;
}

export interface PassportVisibilityRule {
  /** §10: for a Visitor no passport exists at all. */
  readonly exists: boolean;
  readonly visibleToMembers: boolean;
  /** Committed — visible in the roster context. */
  readonly rosterContext: boolean;
  /** Lapsed — visible but marked "not currently travelling". */
  readonly markedNotCurrentlyTravelling: boolean;
  /** Removed — open space deleted, passport not visible. */
  readonly openSpaceDeleted: boolean;
}

const NO_CAPABILITIES: StateCapabilities = {
  browsePublicSite: false,
  takeQuestionnairePrivately: false,
  register: false,
  fullMemberSurface: false,
  holdSignals: false,
  markWindows: false,
  message: false,
  sectionMembership: false,
  readOnly: false,
};

/**
 * Active member capabilities are cumulative from Verified upward: the §10
 * "Can do" column names what each state adds, not what it takes away — a
 * member in conversation has not lost the member surface.
 */
const ACTIVE_MEMBER_CAPABILITIES: StateCapabilities = {
  ...NO_CAPABILITIES,
  browsePublicSite: true,
  takeQuestionnairePrivately: true,
  fullMemberSurface: true,
  holdSignals: true,
  markWindows: true,
};

export const STATE_CAPABILITIES: Record<MemberState, StateCapabilities> = {
  visitor: {
    ...NO_CAPABILITIES,
    browsePublicSite: true,
    takeQuestionnairePrivately: true,
  },
  invited: {
    ...NO_CAPABILITIES,
    browsePublicSite: true,
    takeQuestionnairePrivately: true,
    register: true,
  },
  registered: {
    // Nothing member-facing (§10).
    ...NO_CAPABILITIES,
    browsePublicSite: true,
  },
  verified: ACTIVE_MEMBER_CAPABILITIES,
  inConversation: {
    ...ACTIVE_MEMBER_CAPABILITIES,
    message: true,
  },
  committed: {
    ...ACTIVE_MEMBER_CAPABILITIES,
    message: true,
    sectionMembership: true,
  },
  travelled: {
    ...ACTIVE_MEMBER_CAPABILITIES,
    message: true,
    sectionMembership: true,
  },
  lapsed: {
    // Read-only; cannot signal (§10).
    ...NO_CAPABILITIES,
    browsePublicSite: true,
    readOnly: true,
  },
  removed: NO_CAPABILITIES,
};

export const PASSPORT_VISIBILITY: Record<MemberState, PassportVisibilityRule> =
  {
    visitor: {
      exists: false,
      visibleToMembers: false,
      rosterContext: false,
      markedNotCurrentlyTravelling: false,
      openSpaceDeleted: false,
    },
    invited: {
      exists: false,
      visibleToMembers: false,
      rosterContext: false,
      markedNotCurrentlyTravelling: false,
      openSpaceDeleted: false,
    },
    registered: {
      // Hidden profile collected at joining (§3.1); nothing visible yet.
      exists: true,
      visibleToMembers: false,
      rosterContext: false,
      markedNotCurrentlyTravelling: false,
      openSpaceDeleted: false,
    },
    verified: {
      exists: true,
      visibleToMembers: true,
      rosterContext: false,
      markedNotCurrentlyTravelling: false,
      openSpaceDeleted: false,
    },
    inConversation: {
      exists: true,
      visibleToMembers: true,
      rosterContext: false,
      markedNotCurrentlyTravelling: false,
      openSpaceDeleted: false,
    },
    committed: {
      exists: true,
      visibleToMembers: true,
      rosterContext: true,
      markedNotCurrentlyTravelling: false,
      openSpaceDeleted: false,
    },
    travelled: {
      exists: true,
      visibleToMembers: true,
      rosterContext: false,
      markedNotCurrentlyTravelling: false,
      openSpaceDeleted: false,
    },
    lapsed: {
      exists: true,
      visibleToMembers: true,
      rosterContext: false,
      markedNotCurrentlyTravelling: true,
      openSpaceDeleted: false,
    },
    removed: {
      exists: true,
      visibleToMembers: false,
      rosterContext: false,
      markedNotCurrentlyTravelling: false,
      openSpaceDeleted: true,
    },
  };

// ---------------------------------------------------------------------------
// Forming rosters and the demand map (§10) — Lapsed is excluded.
// ---------------------------------------------------------------------------

const ACTIVE_STATES: readonly MemberState[] = [
  "verified",
  "inConversation",
  "committed",
  "travelled",
];

/**
 * False for Lapsed and for everything below Verified. A lapsed member in a
 * forming roster would waste other members' scarce signals.
 */
export function isEligibleForFormingRoster(state: MemberState): boolean {
  return ACTIVE_STATES.includes(state);
}

/**
 * False for Lapsed and for everything below Verified. A lapsed member
 * counted in the demand map would inflate the pool and corrupt the quorum
 * trigger.
 */
export function isCountedInDemandMap(state: MemberState): boolean {
  return ACTIVE_STATES.includes(state);
}
