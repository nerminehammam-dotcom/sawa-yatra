/**
 * Laddered pricing — spec v3.1 §7.
 *
 * Format only: every figure is a token. This module carries the SHAPE of the
 * ladder (bands, states, lock/cancel/replace order) and never a monetary
 * value. Prices resolve through content/spec-tokens.ts alone; parametric
 * values (minimum group, lock days) arrive as injected policy carried from
 * their unfilled tokens.
 */
import type { SpecTokenName } from "@/content/spec-tokens";

/**
 * §7.3 — six bands, same shape everywhere so a member learns to read it
 * once. The group-size ranges are the spec's own table structure; the prices
 * are tokens. Ceiling twelve.
 */
export const PRICE_BANDS = [
  { band: 1, minSize: 1, maxSize: 1, priceToken: "PRICE_T1" },
  { band: 2, minSize: 2, maxSize: 3, priceToken: "PRICE_T2" },
  { band: 3, minSize: 4, maxSize: 5, priceToken: "PRICE_T3" },
  { band: 4, minSize: 6, maxSize: 7, priceToken: "PRICE_T4" },
  { band: 5, minSize: 8, maxSize: 9, priceToken: "PRICE_T5" },
  { band: 6, minSize: 10, maxSize: 12, priceToken: "PRICE_T6" },
] as const satisfies readonly {
  band: number;
  minSize: number;
  maxSize: number;
  priceToken: SpecTokenName;
}[];

export type PriceBand = (typeof PRICE_BANDS)[number];

export const GROUP_CEILING = 12;

/** The floor the headline quotes from (§7.4): band 6. */
export const FLOOR_PRICE_TOKEN: SpecTokenName = "PRICE_T6";

export function bandForGroupSize(travellers: number): PriceBand | null {
  if (!Number.isInteger(travellers) || travellers < 1) return null;
  if (travellers > GROUP_CEILING) {
    throw new Error(`Group ceiling is ${GROUP_CEILING} (§7.3).`);
  }
  return (
    PRICE_BANDS.find(
      (band) => travellers >= band.minSize && travellers <= band.maxSize,
    ) ?? null
  );
}

/**
 * Ladder policy — carriers of the unfilled MIN_GROUP and LOCK_DAYS tokens.
 * The app must construct this from spec tokens; tests may inject fixtures.
 * No defaults exist on purpose.
 */
export interface LadderPolicy {
  readonly minGroup: number;
  readonly lockDays: number;
}

/** §7.5 — the eight required states. All of them, no afterthoughts. */
export type LadderState =
  | "empty"
  | "below-minimum"
  | "at-minimum"
  | "mid-band"
  | "final-band"
  | "locked"
  | "closed"
  | "cancelled";

export interface LadderInput {
  readonly travellers: number;
  readonly departureDate: Date;
  readonly now: Date;
  /** Sales closed (departed / manifest closed). */
  readonly closed?: boolean;
  /** Section cancelled (e.g. below minimum at lock — §7.7). */
  readonly cancelled?: boolean;
}

export interface LadderView {
  readonly state: LadderState;
  readonly travellers: number;
  /** null when empty. */
  readonly currentBand: PriceBand | null;
  /** The next band down the ladder, if any travellers could still reach it. */
  readonly nextBand: PriceBand | null;
  /** How many more travellers move everyone to the next band. */
  readonly joinersToNextBand: number | null;
  /** Whether the price has settled (§7.7 lock date). */
  readonly priceSettled: boolean;
}

export function isPastLockDate(
  departureDate: Date,
  now: Date,
  policy: LadderPolicy,
): boolean {
  const lockMs =
    departureDate.getTime() - policy.lockDays * 24 * 60 * 60 * 1000;
  return now.getTime() >= lockMs;
}

export function computeLadder(
  input: LadderInput,
  policy: LadderPolicy,
): LadderView {
  const { travellers } = input;
  const currentBand = bandForGroupSize(travellers);
  const locked = isPastLockDate(input.departureDate, input.now, policy);
  const nextBand =
    currentBand !== null
      ? (PRICE_BANDS.find((band) => band.band === currentBand.band + 1) ?? null)
      : null;
  const joinersToNextBand = nextBand
    ? nextBand.minSize - travellers
    : null;

  let state: LadderState;
  if (input.cancelled) state = "cancelled";
  else if (input.closed) state = "closed";
  else if (locked) state = "locked";
  else if (travellers === 0) state = "empty";
  else if (travellers < policy.minGroup) state = "below-minimum";
  else if (travellers === policy.minGroup) state = "at-minimum";
  else if (currentBand?.band === 6) state = "final-band";
  else state = "mid-band";

  return {
    state,
    travellers,
    currentBand,
    nextBand,
    joinersToNextBand,
    priceSettled: state === "locked" || state === "closed",
  };
}

/**
 * The honest pre-launch ladder: no travellers yet, no policy needed. Used by
 * surfaces before membership opens (and before MIN_GROUP / LOCK_DAYS are
 * signed off, when no numeric policy can exist).
 */
export function emptyLadder(): LadderView {
  return {
    state: "empty",
    travellers: 0,
    currentBand: null,
    nextBand: null,
    joinersToNextBand: null,
    priceSettled: false,
  };
}

// ---------------------------------------------------------------------------
// §7.7 — lock date, cancellation, and replacement. Three mechanisms, in order
// of preference: replacement, then the cancellation fee, then the lock date.
// ---------------------------------------------------------------------------

export interface ReplacementRequest {
  /** Must be an existing verified member — never an unvetted friend. */
  readonly replacementIsVerifiedMember: boolean;
  /** Must pass the checkout identity check unchanged (4.7 order preserved). */
  readonly replacementPassedIdentityCheck: boolean;
  /** Remaining travellers are notified, with the SUBSTITUTION_NOTICE window. */
  readonly groupNotified: boolean;
  /** Replacement closes at REPLACEMENT_DEADLINE, at or before lock. */
  readonly beforeReplacementDeadline: boolean;
}

export type CancellationOutcome =
  | {
      readonly kind: "replacement";
      /** Group size unchanged; nobody's price moves. */
      readonly groupSizeChanges: false;
      readonly priceMoves: false;
      readonly noticeToken: "SUBSTITUTION_NOTICE";
      readonly recoveryToken: "CANCELLATION_TERMS";
    }
  | {
      readonly kind: "fee-holds-price";
      /** The forfeited fee is applied FIRST to holding the remaining price. */
      readonly feeAppliedFirstToHoldPrice: true;
      readonly termsToken: "CANCELLATION_TERMS";
      /** Any shortfall is borne per the unfilled SHORTFALL_HOLDER decision. */
      readonly shortfallToken: "SHORTFALL_HOLDER";
      readonly rebandNoticeToken: "REBAND_NOTICE";
    }
  | {
      readonly kind: "after-lock";
      /** No re-banding, no replacement; nobody else's price moves. */
      readonly priceMoves: false;
      readonly forfeitToken: "CANCELLATION_TERMS";
    };

export function resolveCancellation(
  request: ReplacementRequest | null,
  ladder: LadderView,
): CancellationOutcome {
  if (ladder.priceSettled) {
    return { kind: "after-lock", priceMoves: false, forfeitToken: "CANCELLATION_TERMS" };
  }
  if (
    request &&
    request.replacementIsVerifiedMember &&
    request.replacementPassedIdentityCheck &&
    request.groupNotified &&
    request.beforeReplacementDeadline
  ) {
    return {
      kind: "replacement",
      groupSizeChanges: false,
      priceMoves: false,
      noticeToken: "SUBSTITUTION_NOTICE",
      recoveryToken: "CANCELLATION_TERMS",
    };
  }
  return {
    kind: "fee-holds-price",
    feeAppliedFirstToHoldPrice: true,
    termsToken: "CANCELLATION_TERMS",
    shortfallToken: "SHORTFALL_HOLDER",
    rebandNoticeToken: "REBAND_NOTICE",
  };
}

/**
 * §7.7 — below minimum at the lock date: the section does not run, everything
 * paid to Sawayatra is refunded in full, and the decision is made and
 * communicated AT the lock date, not later.
 */
export function resolveLockDate(
  ladder: LadderView,
  policy: LadderPolicy,
): { runs: boolean; fullRefund: boolean; decidedAtLockDate: true } {
  const runs = ladder.travellers >= policy.minGroup;
  return { runs, fullRefund: !runs, decidedAtLockDate: true };
}

// ---------------------------------------------------------------------------
// §7.8 — upgrades. Separate, beneath the ladder, never folded into the base
// price. Locked: an upgrade never affects another member's band or price.
// ---------------------------------------------------------------------------

export interface UpgradeSelection {
  readonly memberId: string;
  readonly upgradeToken: "UPGRADE_PRICE";
  readonly singleOccupancy: boolean;
}

/**
 * Upgrades never touch the ladder: this function is the only coupling point
 * and it returns the ladder view unchanged, by construction.
 */
export function ladderAfterUpgrade(ladder: LadderView): LadderView {
  return ladder;
}
