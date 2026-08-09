#!/usr/bin/env node
/**
 * Spec-token guard — build command §3.A, spec v3.1 §13.
 *
 * Enforces, statically and without a test runner:
 *  1. Every §13 token exists in content/spec-tokens.ts, and no token's value
 *     is a bare numeric literal (unfilled `null`, or a signed-off string).
 *  2. No bare numeric literal stands on a price/fee/parametric key anywhere
 *     in app/, components/, content/, lib/.
 *  3. No hardcoded `{{TOKEN}}` marker outside content/spec-tokens.ts —
 *     every token routes through specToken().
 *  4. Nothing in the app imports from pending-review/ (the pricing agent's
 *     sink is write-only from the app's point of view — §11.2).
 *
 * Exit 0 = clean. Exit 1 = violation (each printed with file:line).
 * Runs standalone: `node scripts/guard-spec-tokens.mjs`
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The §13 register. Kept in sync with the spec table, not with the module. */
const REGISTER = [
  "PRICE_T1", "PRICE_T2", "PRICE_T3", "PRICE_T4", "PRICE_T5", "PRICE_T6",
  "PRICE_ROUNDING", "PRICE_ENVELOPE", "MIN_GROUP", "LOCK_DAYS",
  "CANCELLATION_TERMS", "SHORTFALL_HOLDER", "REBAND_NOTICE",
  "REPLACEMENT_DEADLINE", "SUBSTITUTION_NOTICE", "ROSTER_NAME_POLICY",
  "UPGRADE_NAME", "UPGRADE_PRICE", "SINGLE_SUPPLEMENT",
  "JOINING_FEE", "SERVICE_CHARGE", "HOUSEHOLD_FEE",
  "PARTNER_SHARE_TARGET", "PARTNER_SHARE_DATE",
  "INVITES_PER_MEMBER", "LIVE_SIGNALS", "STANDING_SIGNALS", "STANDING_MONTHS",
  "CONSIDERING_MAX", "WINDOW_GRANULARITY", "QUORUM_TRIGGER", "COOLDOWN_DAYS",
  "LAPSE_MONTHS", "REVIEW_SLA",
];

const SCANNED_DIRS = ["app", "components", "content", "lib"];
const TOKEN_MODULE = join("content", "spec-tokens.ts");
const EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".js", ".jsx", ".mjs"]);
const SKIP_DIRS = new Set(["node_modules", "todelete", ".next"]);

/**
 * Keys that name a §13-governed value. A bare number after one of these is a
 * token replaced by a guess. Factual, non-§13 numerics (durationDays,
 * sectionNumber, image sizes …) are intentionally not listed.
 */
const VALUE_KEY_PATTERN = new RegExp(
  "\\b(" +
    [
      "price(?!Label\\b)\\w*", "fee\\w*", "charge\\w*", "supplement\\w*",
      "deposit\\w*", "budget\\w*", "joiningFee", "serviceCharge",
      "householdFee", "minGroup", "lockDays", "quorum\\w*", "invites\\w*",
      "liveSignals", "standingSignals", "standingMonths", "cooldown\\w*",
      "consideringMax", "lapseMonths", "reviewSla",
    ].join("|") +
    ")\\s*[:=]\\s*['\"`]?\\d",
  "i",
);

const TOKEN_MARKER = /\{\{[A-Z][A-Z0-9_]*\}\}/;
const PENDING_REVIEW_IMPORT =
  /(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"][^'"]*pending-review/;

const violations = [];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(entry.slice(entry.lastIndexOf(".")))) yield full;
  }
}

// ---- 1. The token module itself -------------------------------------------
const modulePath = join(ROOT, TOKEN_MODULE);
let moduleSource = "";
try {
  moduleSource = readFileSync(modulePath, "utf8");
} catch {
  violations.push(`${TOKEN_MODULE}: missing — the single token route must exist.`);
}

if (moduleSource) {
  for (const name of REGISTER) {
    if (!new RegExp(`(?:"${name}"|\\b${name}\\s*:)`).test(moduleSource)) {
      violations.push(`${TOKEN_MODULE}: §13 token ${name} is not defined.`);
    }
  }
  // A token's value must never be a bare number.
  for (const match of moduleSource.matchAll(/value\s*:\s*([\d.]+)/g)) {
    violations.push(
      `${TOKEN_MODULE}: token value is a bare numeric literal (${match[1]}) — values are signed-off display strings or null.`,
    );
  }
}

// ---- 2–4. Surface scan -----------------------------------------------------
for (const dir of SCANNED_DIRS) {
  let base;
  try {
    base = statSync(join(ROOT, dir));
  } catch {
    continue;
  }
  if (!base.isDirectory()) continue;

  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    if (rel === TOKEN_MODULE) continue;
    if (/\.(test|spec)\.[a-z]+$/.test(rel)) continue;

    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const at = `${rel}:${i + 1}`;
      if (VALUE_KEY_PATTERN.test(line)) {
        violations.push(
          `${at}: bare numeric literal on a §13-governed key — route it through content/spec-tokens.ts. » ${line.trim()}`,
        );
      }
      if (TOKEN_MARKER.test(line)) {
        violations.push(
          `${at}: hardcoded {{TOKEN}} marker — only specToken() may emit markers. » ${line.trim()}`,
        );
      }
      if (PENDING_REVIEW_IMPORT.test(line)) {
        violations.push(
          `${at}: import from pending-review/ — pricing-agent output must never reach the app (§11.2). » ${line.trim()}`,
        );
      }
    });
  }
}

if (violations.length > 0) {
  console.error(`Spec-token guard: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}
console.log(
  `Spec-token guard: clean. ${REGISTER.length} §13 tokens registered; no bare values, no stray markers, pending-review/ isolated.`,
);
