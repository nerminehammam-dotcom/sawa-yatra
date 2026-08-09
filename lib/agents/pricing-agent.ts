/**
 * Pricing agent — spec v3.1 §11.2.
 *
 * Purpose: produce INDICATIVE ROUND FIGURES for the six bands of a section
 * (§7.3 shape) from operator cost inputs, so the ladder can be designed,
 * tested and reviewed before final commercial terms exist.
 *
 * Walls, in order of importance:
 *
 * - Output is written to pending-review/ ONLY. The app never imports it; the
 *   build reads spec tokens (content/spec-tokens.ts), never agent output. A
 *   price is a contractual representation — a hallucinated band someone
 *   books against is a commitment that must be honoured.
 * - Nothing in this module returns a member-facing render string. Figures
 *   are plain numbers inside a reviewer payload; the only "rendering" is
 *   `renderPendingReviewFile`, which produces a pending-review/ file for a
 *   human reviewer.
 * - Parametric behaviour is policy-injected. The rounding unit and the
 *   plausibility envelope are the §13 values PRICE_ROUNDING and
 *   PRICE_ENVELOPE, owned by sign-off; no numeric literal here stands in for
 *   either. Callers pass a `PricingPolicy`.
 * - Sanity rails run before any human sees output: a failing derivation is a
 *   typed rejection, never a payload.
 * - Rounding is mandatory, not cosmetic (§11.2): a figure ending in 7 looks
 *   calculated; a round one announces itself as provisional.
 */

/* -------------------------------------------------------------------------
 * Framing — the standing instruction, included in every output payload.
 * ---------------------------------------------------------------------- */

export const PRICING_AGENT_FRAMING =
  "These are round figures for shape and review only. They are not prices, not quotes, and not commitments. No output of this agent may reach a member-facing surface." as const;

/* -------------------------------------------------------------------------
 * Inputs and policy.
 * ---------------------------------------------------------------------- */

/** §11.2 inputs — operator cost data plus anything the agreement fixes. */
export interface PricingAgentInputs {
  /** Section identifier, e.g. "section-4-cusco-uyuni". Used for the filename. */
  readonly section: string;
  /** Operator fixed cost for the whole section (vehicle, guide, permits, host). */
  readonly operatorFixedCost: number;
  /** Operator cost per traveller. */
  readonly perHeadCost: number;
  /** Section duration in days — reviewer context, not an arithmetic input. */
  readonly durationDays: number;
  /** What the operator cost covers — reviewer context. */
  readonly inclusions: readonly string[];
  /** ISO 4217 code, e.g. "USD". A label on numbers, never a formatter. */
  readonly currency: string;
  /** Known floor from the operator agreement, if any. */
  readonly operatorFloor?: number;
  /** Known ceiling from the operator agreement, if any. */
  readonly operatorCeiling?: number;
}

/**
 * Injected policy. `roundingUnit` carries PRICE_ROUNDING and `envelope`
 * carries PRICE_ENVELOPE (§13) once signed off; until then callers supply
 * review-time values from the operator conversation. Never defaulted here.
 */
export interface PricingPolicy {
  readonly roundingUnit: number;
  readonly envelope: {
    readonly min: number;
    readonly max: number;
  };
}

/* -------------------------------------------------------------------------
 * The band shape — §7.3, structural, identical everywhere.
 * ---------------------------------------------------------------------- */

export type BandNumber = 1 | 2 | 3 | 4 | 5 | 6;

interface BandShape {
  readonly band: BandNumber;
  /** §7.3 group-size label. */
  readonly groupSize: string;
  /** Divisor for the fixed cost: the top of the band, the figure if it fills. */
  readonly representativeSize: number;
}

/** §7.3 — six bands, ceiling twelve. Structure, not a §13 value. */
const BAND_SHAPE: readonly [
  BandShape,
  BandShape,
  BandShape,
  BandShape,
  BandShape,
  BandShape,
] = [
  { band: 1, groupSize: "1 traveller", representativeSize: 1 },
  { band: 2, groupSize: "2–3", representativeSize: 3 },
  { band: 3, groupSize: "4–5", representativeSize: 5 },
  { band: 4, groupSize: "6–7", representativeSize: 7 },
  { band: 5, groupSize: "8–9", representativeSize: 9 },
  { band: 6, groupSize: "10–12", representativeSize: 12 },
];

/** One band with its full arithmetic trail — the point of the output (§11.2). */
export interface BandDerivation {
  readonly band: BandNumber;
  readonly groupSize: string;
  readonly representativeSize: number;
  /** operatorFixedCost / representativeSize */
  readonly fixedShare: number;
  /** perHeadCost, restated per band so each row reconciles alone. */
  readonly perHead: number;
  /** fixedShare + perHead, unrounded. */
  readonly rawPerPerson: number;
  /** rawPerPerson rounded to policy.roundingUnit — the indicative figure. */
  readonly indicativeRoundFigure: number;
  /** Human-checkable trail, e.g. "6000 / 3 + 400 = 2400 → 2400". */
  readonly arithmetic: string;
}

export type SixBandDerivations = readonly [
  BandDerivation,
  BandDerivation,
  BandDerivation,
  BandDerivation,
  BandDerivation,
  BandDerivation,
];

/* -------------------------------------------------------------------------
 * Output: a pending-review payload, or a typed rejection nobody sees.
 * ---------------------------------------------------------------------- */

export interface PendingReviewPayload {
  readonly rejected: false;
  /** The standing framing, verbatim, in every payload a human reads. */
  readonly framing: typeof PRICING_AGENT_FRAMING;
  readonly inputs: PricingAgentInputs;
  readonly bands: SixBandDerivations;
  /** A proposal until sign-off commits values into content/spec-tokens.ts. */
  readonly status: "awaiting-sign-off";
  /** ISO instant of derivation. */
  readonly generatedAt: string;
}

export type PricingRejectionReason =
  | "bands-not-monotonically-decreasing"
  | "band-outside-envelope"
  | "band6-below-operator-floor"
  | "band1-above-operator-ceiling"
  | "derivation-does-not-reconcile";

/** Rejected before a human sees it (§11.2 sanity rails). Never written out. */
export interface PricingAgentRejection {
  readonly rejected: true;
  readonly reason: PricingRejectionReason;
  readonly detail: string;
}

export type PricingAgentResult = PendingReviewPayload | PricingAgentRejection;

/* -------------------------------------------------------------------------
 * Derivation.
 * ---------------------------------------------------------------------- */

function assertValidPolicy(policy: PricingPolicy): void {
  if (!Number.isFinite(policy.roundingUnit) || policy.roundingUnit <= 0) {
    throw new Error(
      "PricingPolicy.roundingUnit must be a positive number — it carries PRICE_ROUNDING and is never defaulted.",
    );
  }
  if (
    !Number.isFinite(policy.envelope.min) ||
    !Number.isFinite(policy.envelope.max) ||
    policy.envelope.min >= policy.envelope.max
  ) {
    throw new Error(
      "PricingPolicy.envelope must satisfy min < max — it carries PRICE_ENVELOPE and is never defaulted.",
    );
  }
}

function assertValidInputs(inputs: PricingAgentInputs): void {
  if (!Number.isFinite(inputs.operatorFixedCost) || inputs.operatorFixedCost < 0) {
    throw new Error("operatorFixedCost must be a non-negative number.");
  }
  if (!Number.isFinite(inputs.perHeadCost) || inputs.perHeadCost < 0) {
    throw new Error("perHeadCost must be a non-negative number.");
  }
  if (inputs.section.trim() === "") {
    throw new Error("section is required — it names the pending-review file.");
  }
}

/** Mandatory rounding to the policy unit — never cosmetic (§11.2). */
export function roundToUnit(value: number, unit: number): number {
  return Math.round(value / unit) * unit;
}

function deriveBand(
  shape: BandShape,
  inputs: PricingAgentInputs,
  policy: PricingPolicy,
): BandDerivation {
  const fixedShare = inputs.operatorFixedCost / shape.representativeSize;
  const rawPerPerson = fixedShare + inputs.perHeadCost;
  const indicativeRoundFigure = roundToUnit(rawPerPerson, policy.roundingUnit);
  return {
    band: shape.band,
    groupSize: shape.groupSize,
    representativeSize: shape.representativeSize,
    fixedShare,
    perHead: inputs.perHeadCost,
    rawPerPerson,
    indicativeRoundFigure,
    arithmetic:
      `${inputs.operatorFixedCost} / ${shape.representativeSize} + ` +
      `${inputs.perHeadCost} = ${rawPerPerson} → rounds to ` +
      `${indicativeRoundFigure} (unit ${policy.roundingUnit}, ${inputs.currency})`,
  };
}

/** Reconciliation tolerance for floating-point restatement, not a spec value. */
const RECONCILE_EPSILON = 1e-6;

/**
 * §11.2 — "the derivation does not reconcile to the inputs" rail. Recomputes
 * every band from the inputs and compares. Exported so a reviewer's tooling
 * (and the tests) can re-run it against a stored payload.
 */
export function derivationReconciles(
  bands: SixBandDerivations,
  inputs: PricingAgentInputs,
  policy: PricingPolicy,
): boolean {
  return BAND_SHAPE.every((shape, index) => {
    const band = bands[index];
    if (band === undefined || band.band !== shape.band) return false;
    const expected = deriveBand(shape, inputs, policy);
    return (
      band.representativeSize === expected.representativeSize &&
      Math.abs(band.fixedShare - expected.fixedShare) < RECONCILE_EPSILON &&
      Math.abs(band.perHead - expected.perHead) < RECONCILE_EPSILON &&
      Math.abs(band.rawPerPerson - expected.rawPerPerson) < RECONCILE_EPSILON &&
      band.indicativeRoundFigure === expected.indicativeRoundFigure
    );
  });
}

/**
 * §11.2 sanity rails, run before any human sees output. Returns the first
 * failing rail as a typed rejection, or null when all rails pass. Exported
 * for the tests and for re-checking stored payloads.
 */
export function checkSanityRails(
  bands: SixBandDerivations,
  inputs: PricingAgentInputs,
  policy: PricingPolicy,
): PricingAgentRejection | null {
  // Rail 1 — bands monotonically decreasing: band 1 the highest per-person
  // figure, band 6 the lowest, strictly, after rounding.
  for (let i = 1; i < bands.length; i += 1) {
    const previous = bands[i - 1];
    const current = bands[i];
    if (previous === undefined || current === undefined) {
      return {
        rejected: true,
        reason: "derivation-does-not-reconcile",
        detail: "Fewer than six bands derived.",
      };
    }
    if (current.indicativeRoundFigure >= previous.indicativeRoundFigure) {
      return {
        rejected: true,
        reason: "bands-not-monotonically-decreasing",
        detail:
          `Band ${current.band} (${current.indicativeRoundFigure}) is not below ` +
          `band ${previous.band} (${previous.indicativeRoundFigure}). ` +
          "The rounding unit may be too coarse for these inputs.",
      };
    }
  }

  // Rail 2 — every band inside the plausibility envelope.
  for (const band of bands) {
    if (
      band.indicativeRoundFigure < policy.envelope.min ||
      band.indicativeRoundFigure > policy.envelope.max
    ) {
      return {
        rejected: true,
        reason: "band-outside-envelope",
        detail:
          `Band ${band.band} (${band.indicativeRoundFigure}) falls outside the ` +
          `plausibility envelope ${policy.envelope.min}–${policy.envelope.max}.`,
      };
    }
  }

  // Rail 3 — band 6 never below the operator's stated floor.
  const bandSix = bands[bands.length - 1];
  if (
    bandSix !== undefined &&
    inputs.operatorFloor !== undefined &&
    bandSix.indicativeRoundFigure < inputs.operatorFloor
  ) {
    return {
      rejected: true,
      reason: "band6-below-operator-floor",
      detail:
        `Band 6 (${bandSix.indicativeRoundFigure}) is below the operator floor ` +
        `(${inputs.operatorFloor}).`,
    };
  }

  // Rail 3a — symmetric guard on a stated ceiling, same agreement clause.
  const bandOne = bands[0];
  if (
    bandOne !== undefined &&
    inputs.operatorCeiling !== undefined &&
    bandOne.indicativeRoundFigure > inputs.operatorCeiling
  ) {
    return {
      rejected: true,
      reason: "band1-above-operator-ceiling",
      detail:
        `Band 1 (${bandOne.indicativeRoundFigure}) is above the operator ceiling ` +
        `(${inputs.operatorCeiling}).`,
    };
  }

  // Rail 4 — the derivation reconciles to the inputs.
  if (!derivationReconciles(bands, inputs, policy)) {
    return {
      rejected: true,
      reason: "derivation-does-not-reconcile",
      detail:
        "Recomputing the bands from the inputs did not reproduce the stated figures.",
    };
  }

  return null;
}

/**
 * Derive the six indicative band figures plus the full arithmetic trail.
 * Returns a pending-review payload, or a typed rejection the human never
 * sees. Never throws on rail failure — throwing is reserved for malformed
 * policy/inputs (programmer error).
 */
export function deriveBands(
  inputs: PricingAgentInputs,
  policy: PricingPolicy,
  generatedAt: Date = new Date(),
): PricingAgentResult {
  assertValidPolicy(policy);
  assertValidInputs(inputs);

  const bands = BAND_SHAPE.map((shape) =>
    deriveBand(shape, inputs, policy),
  ) as unknown as SixBandDerivations;

  const rejection = checkSanityRails(bands, inputs, policy);
  if (rejection !== null) return rejection;

  return {
    rejected: false,
    framing: PRICING_AGENT_FRAMING,
    inputs,
    bands,
    status: "awaiting-sign-off",
    generatedAt: generatedAt.toISOString(),
  };
}

/* -------------------------------------------------------------------------
 * The single write path: pending-review/ only.
 * ---------------------------------------------------------------------- */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The only rendering this agent has: a file for pending-review/. The type
 * accepts a payload, never a rejection, and nothing here (or anywhere in
 * this module) produces a member-display string of a band price.
 */
export function renderPendingReviewFile(payload: PendingReviewPayload): {
  readonly filename: string;
  readonly contents: string;
} {
  const date = payload.generatedAt.slice(0, "YYYY-MM-DD".length);
  return {
    filename: `${slugify(payload.inputs.section)}-${date}.json`,
    contents: `${JSON.stringify(payload, null, 2)}\n`,
  };
}
