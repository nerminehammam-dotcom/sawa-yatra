/**
 * Interest signals — spec v3.1 §6.2, §6.8, §6.9.
 *
 * Two kinds of signal:
 * - Live — "Ask to travel together." Bound to a specific journey. On mutual,
 *   both are notified immediately.
 * - Standing — "I'd travel with you." Bound to a person, no calendar. Held in
 *   the member's own shortlist, visible to nobody, never notified in either
 *   direction. Converts to a match only when BOTH members hold standing
 *   interest in each other AND both are looking at the same journey or
 *   window.
 *
 * All parametric behaviour (budgets, expiry, cool-down) is injected via
 * SignalPolicy. In the app those values come from content/spec-tokens.ts —
 * the LIVE_SIGNALS, STANDING_SIGNALS, STANDING_MONTHS and COOLDOWN_DAYS
 * tokens, currently unfilled. No default exists here; a policy without a
 * signed-off value cannot be constructed by this module.
 *
 * Locked (§6.2): nothing in this module discloses a one-sided standing
 * signal. No function returns the standing state another member holds; the
 * only match-producing functions require both directions. And no part of
 * this API accepts or carries any age field (rule 4.4) — interest signals
 * never reference it, and the pool is never orderable by it.
 *
 * Deliberately not built (§6.9): acceptance-rate throttling of any kind. The
 * budgets already cap volume; restricting members whose signals are rarely
 * reciprocated would punish people for being less popular. No export of this
 * module tracks, computes or gates on reciprocation rates.
 */

// ---------------------------------------------------------------------------
// Policy — injected, never defaulted.
// ---------------------------------------------------------------------------

/**
 * Values arrive from the §13 register (content/spec-tokens.ts): liveBudget
 * per the LIVE_SIGNALS token, standingBudget per the STANDING_SIGNALS token,
 * standingExpiryMonths per the STANDING_MONTHS token, cooldownDays per the
 * COOLDOWN_DAYS token.
 */
export interface SignalPolicy {
  readonly liveBudget: number;
  readonly standingBudget: number;
  readonly standingExpiryMonths: number;
  readonly cooldownDays: number;
}

export type SignalKind = "live" | "standing";

// ---------------------------------------------------------------------------
// Signal shapes
// ---------------------------------------------------------------------------

/** Live signal — bound to a specific journey the member is committing attention to. */
export interface LiveSignal {
  readonly kind: "live";
  readonly fromMemberId: string;
  readonly toMemberId: string;
  readonly journeyId: string;
  readonly sentAt: Date;
}

/** Standing signal — bound to a person, no calendar. A shortlist, not a stream. */
export interface StandingSignal {
  readonly kind: "standing";
  readonly fromMemberId: string;
  readonly toMemberId: string;
  readonly heldSince: Date;
}

/** A withdrawal, remembered only to enforce the cool-down (§6.8). */
export interface WithdrawnSignalRecord {
  readonly kind: SignalKind;
  readonly toMemberId: string;
  readonly withdrawnAt: Date;
}

/**
 * One member's own signal book. Everything in it is that member's own view —
 * their live signals, their own shortlist, their own withdrawal history, and
 * the journeys/windows they are currently looking at. Nothing here describes
 * what anyone else holds.
 */
export interface SignalBook {
  readonly memberId: string;
  readonly live: readonly LiveSignal[];
  readonly standing: readonly StandingSignal[];
  readonly withdrawn: readonly WithdrawnSignalRecord[];
  /** Ids of journeys or windows this member is currently looking at (§6.2). */
  readonly lookingAt: readonly string[];
}

export function emptySignalBook(memberId: string): SignalBook {
  return { memberId, live: [], standing: [], withdrawn: [], lookingAt: [] };
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/** At budget: to send another, one must be withdrawn (§6.2). */
export class SignalBudgetExceededError extends Error {
  constructor(kind: SignalKind) {
    super(
      `${kind} signal budget is fully held — withdraw one to send another (§6.2).`,
    );
    this.name = "SignalBudgetExceededError";
  }
}

/** §6.8 — a withdrawn signal cannot be re-sent to the same member yet. */
export class SignalCooldownError extends Error {
  constructor(kind: SignalKind) {
    super(
      `A withdrawn ${kind} signal cannot be re-sent to this member until the cool-down elapses (§6.8, per the COOLDOWN_DAYS token).`,
    );
    this.name = "SignalCooldownError";
  }
}

export class DuplicateSignalError extends Error {
  constructor(kind: SignalKind) {
    super(`This ${kind} signal is already held.`);
    this.name = "DuplicateSignalError";
  }
}

// ---------------------------------------------------------------------------
// Time helpers — factual arithmetic; the counts come from the policy.
// ---------------------------------------------------------------------------

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

/**
 * §6.8 — cool-down applies to both kinds, per kind and per recipient.
 * (Resolved conservatively: withdrawing a live signal starts a live
 * cool-down toward that member; a standing withdrawal a standing one.)
 */
function inCooldown(
  book: SignalBook,
  kind: SignalKind,
  toMemberId: string,
  policy: SignalPolicy,
  now: Date,
): boolean {
  return book.withdrawn.some(
    (record) =>
      record.kind === kind &&
      record.toMemberId === toMemberId &&
      now.getTime() <
        addDays(record.withdrawnAt, policy.cooldownDays).getTime(),
  );
}

// ---------------------------------------------------------------------------
// Live signals
// ---------------------------------------------------------------------------

export function sendLiveSignal(
  book: SignalBook,
  policy: SignalPolicy,
  target: { readonly toMemberId: string; readonly journeyId: string },
  now: Date,
): SignalBook {
  if (
    book.live.some(
      (signal) =>
        signal.toMemberId === target.toMemberId &&
        signal.journeyId === target.journeyId,
    )
  ) {
    throw new DuplicateSignalError("live");
  }
  if (inCooldown(book, "live", target.toMemberId, policy, now)) {
    throw new SignalCooldownError("live");
  }
  if (book.live.length >= policy.liveBudget) {
    throw new SignalBudgetExceededError("live");
  }
  return {
    ...book,
    live: [
      ...book.live,
      {
        kind: "live",
        fromMemberId: book.memberId,
        toMemberId: target.toMemberId,
        journeyId: target.journeyId,
        sentAt: now,
      },
    ],
  };
}

/**
 * Withdrawal is silent (§6.2, §6.8): the return value is the updated book
 * and nothing else — no event, no notification, nothing addressed to the
 * other member exists to be delivered.
 */
export function withdrawLiveSignal(
  book: SignalBook,
  toMemberId: string,
  journeyId: string,
  now: Date,
): SignalBook {
  const remaining = book.live.filter(
    (signal) =>
      !(signal.toMemberId === toMemberId && signal.journeyId === journeyId),
  );
  if (remaining.length === book.live.length) return book;
  return {
    ...book,
    live: remaining,
    withdrawn: [
      ...book.withdrawn,
      { kind: "live", toMemberId, withdrawnAt: now },
    ],
  };
}

// ---------------------------------------------------------------------------
// Standing signals — the member's own shortlist. Visible to nobody.
// ---------------------------------------------------------------------------

export function sendStandingSignal(
  book: SignalBook,
  policy: SignalPolicy,
  toMemberId: string,
  now: Date,
): SignalBook {
  if (book.standing.some((signal) => signal.toMemberId === toMemberId)) {
    throw new DuplicateSignalError("standing");
  }
  if (inCooldown(book, "standing", toMemberId, policy, now)) {
    throw new SignalCooldownError("standing");
  }
  if (book.standing.length >= policy.standingBudget) {
    throw new SignalBudgetExceededError("standing");
  }
  return {
    ...book,
    standing: [
      ...book.standing,
      { kind: "standing", fromMemberId: book.memberId, toMemberId, heldSince: now },
    ],
  };
}

/** Withdrawal is silent at every stage (§6.2). Updated book, nothing else. */
export function withdrawStandingSignal(
  book: SignalBook,
  toMemberId: string,
  now: Date,
): SignalBook {
  const remaining = book.standing.filter(
    (signal) => signal.toMemberId !== toMemberId,
  );
  if (remaining.length === book.standing.length) return book;
  return {
    ...book,
    standing: remaining,
    withdrawn: [
      ...book.withdrawn,
      { kind: "standing", toMemberId, withdrawnAt: now },
    ],
  };
}

/** Expiry per the STANDING_MONTHS token (§6.2). */
export function isStandingSignalActive(
  signal: StandingSignal,
  policy: SignalPolicy,
  now: Date,
): boolean {
  return (
    now.getTime() <
    addMonths(signal.heldSince, policy.standingExpiryMonths).getTime()
  );
}

/**
 * The member's OWN expired shortlist entries, for the quiet prompt to renew
 * (§6.2). Own view only — this says nothing about anyone else's shortlist.
 */
export function ownStandingSignalsDueForRenewal(
  book: SignalBook,
  policy: SignalPolicy,
  now: Date,
): readonly StandingSignal[] {
  return book.standing.filter(
    (signal) => !isStandingSignalActive(signal, policy, now),
  );
}

/** Renewing re-dates a held standing signal. Silent, own shortlist only. */
export function renewStandingSignal(
  book: SignalBook,
  toMemberId: string,
  now: Date,
): SignalBook {
  return {
    ...book,
    standing: book.standing.map((signal) =>
      signal.toMemberId === toMemberId ? { ...signal, heldSince: now } : signal,
    ),
  };
}

// ---------------------------------------------------------------------------
// Matches — the only places a signal ever becomes visible to its recipient.
// Both require both directions; a one-sided signal is disclosed to nobody.
// ---------------------------------------------------------------------------

/** Both members, told at the same instant. */
export interface MatchNotification {
  readonly memberId: string;
  readonly otherMemberId: string;
  readonly at: Date;
  readonly simultaneous: true;
}

export interface LiveMutualMatch {
  readonly kind: "live";
  readonly memberIds: readonly [string, string];
  readonly journeyId: string;
  /** On mutual, both are notified immediately (§6.2). */
  readonly notifications: readonly [MatchNotification, MatchNotification];
  /** The reveal begins at stage one (§6.7). */
  readonly revealStage: 1;
}

/** §6.2 — both are looking at the same journey, or the same window. */
export type SharedTravelContext =
  | { readonly kind: "journey"; readonly journeyId: string }
  | { readonly kind: "window"; readonly windowId: string };

export interface StandingMutualMatch {
  readonly kind: "standing";
  readonly memberIds: readonly [string, string];
  readonly sharedContext: SharedTravelContext;
  /** At that instant both are told, simultaneously (§6.2). */
  readonly notifications: readonly [MatchNotification, MatchNotification];
  readonly revealStage: 1;
  /** A standing match does not consume live budget. It arrives unbidden. */
  readonly consumesLiveBudget: false;
}

function simultaneousNotifications(
  memberA: string,
  memberB: string,
  now: Date,
): readonly [MatchNotification, MatchNotification] {
  return [
    { memberId: memberA, otherMemberId: memberB, at: now, simultaneous: true },
    { memberId: memberB, otherMemberId: memberA, at: now, simultaneous: true },
  ];
}

/**
 * Mutual live interest on the same journey. Requires BOTH directions; a
 * one-sided live signal produces nothing and notifies nobody.
 */
export function resolveLiveMatch(
  a: SignalBook,
  b: SignalBook,
  journeyId: string,
  now: Date,
): LiveMutualMatch | null {
  const aToB = a.live.some(
    (signal) =>
      signal.toMemberId === b.memberId && signal.journeyId === journeyId,
  );
  const bToA = b.live.some(
    (signal) =>
      signal.toMemberId === a.memberId && signal.journeyId === journeyId,
  );
  if (!aToB || !bToA) return null;
  return {
    kind: "live",
    memberIds: [a.memberId, b.memberId],
    journeyId,
    notifications: simultaneousNotifications(a.memberId, b.memberId, now),
    revealStage: 1,
  };
}

/**
 * The ONLY function that ever turns standing interest into anything visible.
 * It requires all three legs at once (§6.2): a holds standing interest in b,
 * b holds standing interest in a, and both are looking at the same journey
 * or window. Anything less returns null — and null is indistinguishable
 * between "no signal", "one signal" and "two signals without overlap", which
 * is exactly the point: no disclosure of a one-sided standing signal, of one
 * being held on you, or of a standing pair awaiting overlap.
 */
export function resolveStandingMatch(
  a: SignalBook,
  b: SignalBook,
  sharedJourneyOrWindow: SharedTravelContext,
  policy: SignalPolicy,
  now: Date,
): StandingMutualMatch | null {
  const contextId =
    sharedJourneyOrWindow.kind === "journey"
      ? sharedJourneyOrWindow.journeyId
      : sharedJourneyOrWindow.windowId;
  const bothLooking =
    a.lookingAt.includes(contextId) && b.lookingAt.includes(contextId);
  const aToB = a.standing.some(
    (signal) =>
      signal.toMemberId === b.memberId &&
      isStandingSignalActive(signal, policy, now),
  );
  const bToA = b.standing.some(
    (signal) =>
      signal.toMemberId === a.memberId &&
      isStandingSignalActive(signal, policy, now),
  );
  if (!bothLooking || !aToB || !bToA) return null;
  return {
    kind: "standing",
    memberIds: [a.memberId, b.memberId],
    sharedContext: sharedJourneyOrWindow,
    notifications: simultaneousNotifications(a.memberId, b.memberId, now),
    revealStage: 1,
    consumesLiveBudget: false,
  };
}

/** Live budget headroom — the member's own view of their own book. */
export function remainingLiveBudget(
  book: SignalBook,
  policy: SignalPolicy,
): number {
  return Math.max(0, policy.liveBudget - book.live.length);
}

/** Standing (shortlist) headroom — own view of own book. */
export function remainingStandingBudget(
  book: SignalBook,
  policy: SignalPolicy,
): number {
  return Math.max(0, policy.standingBudget - book.standing.length);
}
