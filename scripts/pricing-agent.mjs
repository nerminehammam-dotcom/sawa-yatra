#!/usr/bin/env node
/**
 * Pricing agent CLI — spec v3.1 §11.2.
 *
 * Usage:
 *   node scripts/pricing-agent.mjs <input.json> [--demo]
 *
 * The input file carries the operator data AND the injected policy — the
 * rounding unit and plausibility envelope are the §13 values PRICE_ROUNDING
 * and PRICE_ENVELOPE, owned by sign-off, so this script never defaults them
 * and never hardcodes them:
 *
 *   {
 *     "inputs": {
 *       "section": "section-4-cusco-uyuni",
 *       "operatorFixedCost": <number>,
 *       "perHeadCost": <number>,
 *       "durationDays": <number>,
 *       "inclusions": ["..."],
 *       "currency": "USD",
 *       "operatorFloor": <number, optional>,
 *       "operatorCeiling": <number, optional>
 *     },
 *     "policy": {
 *       "roundingUnit": <number>,
 *       "envelope": { "min": <number>, "max": <number> }
 *     }
 *   }
 *
 * On success it writes pending-review/<section>-<date>.json with the inputs,
 * the six bands, the per-band derivation, the standing framing, and
 * status "awaiting-sign-off". With --demo it writes
 * pending-review/DEMO-fixture-not-a-price.json with status "demo-fixture".
 *
 * It writes to pending-review/ ONLY — the app never reads that directory —
 * and it NEVER edits content/spec-tokens.ts. A human commits signed-off
 * values into the token register; this file is the audit trail of the
 * derivation, not a data source.
 *
 * The derivation logic mirrors lib/agents/pricing-agent.ts. It is duplicated
 * here as small pure functions so the script runs standalone under node with
 * no build step; the vitest suite pins both to the same behaviour.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PENDING_REVIEW_DIR = join(ROOT, "pending-review");

/** Standing framing — included verbatim in every output payload (§11.2). */
const PRICING_AGENT_FRAMING =
  "These are round figures for shape and review only. They are not prices, not quotes, and not commitments. No output of this agent may reach a member-facing surface.";

/** §7.3 band shape — structural, identical everywhere. */
const BAND_SHAPE = [
  { band: 1, groupSize: "1 traveller", representativeSize: 1 },
  { band: 2, groupSize: "2–3", representativeSize: 3 },
  { band: 3, groupSize: "4–5", representativeSize: 5 },
  { band: 4, groupSize: "6–7", representativeSize: 7 },
  { band: 5, groupSize: "8–9", representativeSize: 9 },
  { band: 6, groupSize: "10–12", representativeSize: 12 },
];

/** Mandatory rounding to the injected unit — never cosmetic. */
function roundToUnit(value, unit) {
  return Math.round(value / unit) * unit;
}

function deriveBand(shape, inputs, policy) {
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

/** §11.2 sanity rails — first failure wins; a human never sees a rejection. */
function checkSanityRails(bands, inputs, policy) {
  for (let i = 1; i < bands.length; i += 1) {
    if (bands[i].indicativeRoundFigure >= bands[i - 1].indicativeRoundFigure) {
      return {
        reason: "bands-not-monotonically-decreasing",
        detail: `Band ${bands[i].band} is not below band ${bands[i - 1].band}.`,
      };
    }
  }
  for (const band of bands) {
    if (
      band.indicativeRoundFigure < policy.envelope.min ||
      band.indicativeRoundFigure > policy.envelope.max
    ) {
      return {
        reason: "band-outside-envelope",
        detail: `Band ${band.band} (${band.indicativeRoundFigure}) is outside ${policy.envelope.min}–${policy.envelope.max}.`,
      };
    }
  }
  const bandSix = bands[bands.length - 1];
  if (
    inputs.operatorFloor !== undefined &&
    bandSix.indicativeRoundFigure < inputs.operatorFloor
  ) {
    return {
      reason: "band6-below-operator-floor",
      detail: `Band 6 (${bandSix.indicativeRoundFigure}) is below the operator floor (${inputs.operatorFloor}).`,
    };
  }
  if (
    inputs.operatorCeiling !== undefined &&
    bands[0].indicativeRoundFigure > inputs.operatorCeiling
  ) {
    return {
      reason: "band1-above-operator-ceiling",
      detail: `Band 1 (${bands[0].indicativeRoundFigure}) is above the operator ceiling (${inputs.operatorCeiling}).`,
    };
  }
  // Reconciliation: recompute every band from the inputs and compare.
  const epsilon = 1e-6;
  const reconciles = BAND_SHAPE.every((shape, index) => {
    const band = bands[index];
    const expected = deriveBand(shape, inputs, policy);
    return (
      band.band === expected.band &&
      Math.abs(band.rawPerPerson - expected.rawPerPerson) < epsilon &&
      band.indicativeRoundFigure === expected.indicativeRoundFigure
    );
  });
  if (!reconciles) {
    return {
      reason: "derivation-does-not-reconcile",
      detail: "Recomputing the bands from the inputs did not reproduce the figures.",
    };
  }
  return null;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fail(message) {
  console.error(`pricing-agent: ${message}`);
  process.exit(1);
}

// ---- CLI -------------------------------------------------------------------

const args = process.argv.slice(2);
const demo = args.includes("--demo");
const inputPath = args.find((arg) => !arg.startsWith("--"));

if (inputPath === undefined) {
  fail("usage: node scripts/pricing-agent.mjs <input.json> [--demo]");
}

let parsed;
try {
  parsed = JSON.parse(readFileSync(inputPath, "utf8"));
} catch (error) {
  fail(`could not read input file: ${error.message}`);
}

const { inputs, policy } = parsed;

if (inputs === undefined || policy === undefined) {
  fail('input file must carry both "inputs" and "policy".');
}
if (
  typeof policy.roundingUnit !== "number" ||
  !Number.isFinite(policy.roundingUnit) ||
  policy.roundingUnit <= 0
) {
  fail(
    "policy.roundingUnit must be a positive number — it carries PRICE_ROUNDING and is never defaulted.",
  );
}
if (
  policy.envelope === undefined ||
  typeof policy.envelope.min !== "number" ||
  typeof policy.envelope.max !== "number" ||
  policy.envelope.min >= policy.envelope.max
) {
  fail(
    "policy.envelope must satisfy min < max — it carries PRICE_ENVELOPE and is never defaulted.",
  );
}
if (
  typeof inputs.section !== "string" ||
  inputs.section.trim() === "" ||
  typeof inputs.operatorFixedCost !== "number" ||
  typeof inputs.perHeadCost !== "number"
) {
  fail("inputs must carry section, operatorFixedCost and perHeadCost.");
}

const bands = BAND_SHAPE.map((shape) => deriveBand(shape, inputs, policy));

const rejection = checkSanityRails(bands, inputs, policy);
if (rejection !== null) {
  // Rejected before a human sees it (§11.2). Nothing is written.
  fail(`output REJECTED (${rejection.reason}): ${rejection.detail}`);
}

const generatedAt = new Date().toISOString();
const payload = {
  framing: PRICING_AGENT_FRAMING,
  status: demo ? "demo-fixture" : "awaiting-sign-off",
  generatedAt,
  inputs,
  bands,
};

const filename = demo
  ? "DEMO-fixture-not-a-price.json"
  : `${slugify(inputs.section)}-${generatedAt.slice(0, "YYYY-MM-DD".length)}.json`;

mkdirSync(PENDING_REVIEW_DIR, { recursive: true });
writeFileSync(join(PENDING_REVIEW_DIR, filename), `${JSON.stringify(payload, null, 2)}\n`);

console.log(PRICING_AGENT_FRAMING);
console.log(`\nWrote pending-review/${filename} (status: ${payload.status}).`);
console.log(
  "A human commits signed-off values into content/spec-tokens.ts; this file is the audit trail, not a data source.",
);
