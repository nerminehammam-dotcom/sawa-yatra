/**
 * Spec tokens — the single route for every monetary/parametric value in the
 * Membership, Identity, Access & Pricing spec v3.1 (§13 placeholder register).
 *
 * HARD CONSTRAINTS (build command §1.1):
 * - No numeric literal may ever stand in for a token. Not "for now", not as a
 *   default, not in a fixture that leaks to a surface.
 * - Every token here is UNFILLED (`value: null`) until the named owner signs
 *   it off. The "recommended" notes in the spec are guidance for a human
 *   signer, not values — they are deliberately not encoded here.
 * - An unfilled token renders a visible `{{TOKEN}}` marker in development and
 *   THROWS in production, so it fails the production build for any
 *   prerendered surface it reaches. Nothing ships with an unfilled token;
 *   nothing ships with a token replaced by a guess.
 *
 * Filling a token happens in exactly one way: the owner recorded below signs
 * off a value, and it is written here as a display string (e.g. a formatted
 * price). `scripts/guard-spec-tokens.mjs` enforces that no other file carries
 * a value in a token's place.
 */

export const SPEC_TOKEN_NAMES = [
  // §7 pricing
  "PRICE_T1",
  "PRICE_T2",
  "PRICE_T3",
  "PRICE_T4",
  "PRICE_T5",
  "PRICE_T6",
  "PRICE_ROUNDING",
  "PRICE_ENVELOPE",
  "MIN_GROUP",
  "LOCK_DAYS",
  "CANCELLATION_TERMS",
  "SHORTFALL_HOLDER",
  "REBAND_NOTICE",
  "REPLACEMENT_DEADLINE",
  "SUBSTITUTION_NOTICE",
  "ROSTER_NAME_POLICY",
  "UPGRADE_NAME",
  "UPGRADE_PRICE",
  "SINGLE_SUPPLEMENT",
  // §8 money
  "JOINING_FEE",
  "SERVICE_CHARGE",
  "HOUSEHOLD_FEE",
  // §2.4 health metric
  "PARTNER_SHARE_TARGET",
  "PARTNER_SHARE_DATE",
  // §5, §6 membership & signals
  "INVITES_PER_MEMBER",
  "LIVE_SIGNALS",
  "STANDING_SIGNALS",
  "STANDING_MONTHS",
  "CONSIDERING_MAX",
  "WINDOW_GRANULARITY",
  "QUORUM_TRIGGER",
  "COOLDOWN_DAYS",
  // §10, §11
  "LAPSE_MONTHS",
  "REVIEW_SLA",
] as const;

export type SpecTokenName = (typeof SPEC_TOKEN_NAMES)[number];

export type SpecTokenOwner =
  | "[SIGN-OFF]"
  | "[SIGN-OFF], post-operator"
  | "Nermine";

export interface SpecTokenDefinition {
  /** §13 meaning, verbatim in spirit. */
  readonly meaning: string;
  /** Who fills it. [SIGN-OFF] values are commercial decisions not yet made. */
  readonly owner: SpecTokenOwner;
  /** Spec section(s) the token belongs to. */
  readonly spec: string;
  /**
   * The signed-off display value, or null while unfilled.
   * A string, never a number: a filled token is a formatted representation
   * ("£—", "60 days", "three"), and the type forbids a bare numeric literal.
   */
  readonly value: string | null;
}

export const SPEC_TOKENS: Readonly<
  Record<SpecTokenName, SpecTokenDefinition>
> = {
  PRICE_T1: {
    meaning: "Per-person price, band 1 (1 traveller)",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.3",
    value: null,
  },
  PRICE_T2: {
    meaning: "Per-person price, band 2 (2–3)",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.3",
    value: null,
  },
  PRICE_T3: {
    meaning: "Per-person price, band 3 (4–5)",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.3",
    value: null,
  },
  PRICE_T4: {
    meaning: "Per-person price, band 4 (6–7)",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.3",
    value: null,
  },
  PRICE_T5: {
    meaning: "Per-person price, band 5 (8–9)",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.3",
    value: null,
  },
  PRICE_T6: {
    meaning: "Per-person price, band 6 (10–12) — the 'from' floor",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.3, §7.4",
    value: null,
  },
  PRICE_ROUNDING: {
    meaning: "Rounding unit for pricing-agent output",
    owner: "[SIGN-OFF]",
    spec: "§11.2",
    value: null,
  },
  PRICE_ENVELOPE: {
    meaning: "Plausibility bounds, pricing-agent sanity rail",
    owner: "[SIGN-OFF]",
    spec: "§11.2",
    value: null,
  },
  MIN_GROUP: {
    meaning: "Minimum viable group per section; below it the section does not run",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.3, §7.7",
    value: null,
  },
  LOCK_DAYS: {
    meaning: "Price settles this many days before departure",
    owner: "[SIGN-OFF]",
    spec: "§7.7",
    value: null,
  },
  CANCELLATION_TERMS: {
    meaning: "Cancellation and replacement terms, before and after lock",
    owner: "[SIGN-OFF]",
    spec: "§7.7",
    value: null,
  },
  SHORTFALL_HOLDER: {
    meaning:
      "Who bears a cancellation shortfall — Sawayatra, or the group re-bands",
    owner: "[SIGN-OFF]",
    spec: "§7.7",
    value: null,
  },
  REBAND_NOTICE: {
    meaning: "Notice and penalty-free withdrawal if the group re-bands",
    owner: "[SIGN-OFF]",
    spec: "§7.7",
    value: null,
  },
  REPLACEMENT_DEADLINE: {
    meaning: "Last point a seat may be transferred (at or before lock)",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.7",
    value: null,
  },
  SUBSTITUTION_NOTICE: {
    meaning: "Window for the group to raise a substitution with the host",
    owner: "Nermine",
    spec: "§7.7",
    value: null,
  },
  ROSTER_NAME_POLICY: {
    meaning: "Whether co-travellers see legal names at checkout",
    owner: "[SIGN-OFF]",
    spec: "§6.7",
    value: null,
  },
  UPGRADE_NAME: {
    meaning: "Accommodation upgrade — plain description, not a marketing tier",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.8",
    value: null,
  },
  UPGRADE_PRICE: {
    meaning: "Accommodation upgrade price, per person per section",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.8",
    value: null,
  },
  SINGLE_SUPPLEMENT: {
    meaning: "Single occupancy, named on the section page, never a hidden supplement",
    owner: "[SIGN-OFF], post-operator",
    spec: "§7.8",
    value: null,
  },
  JOINING_FEE: {
    meaning: "One time, at membership, fully credited against the first booked section",
    owner: "[SIGN-OFF]",
    spec: "§8.1",
    value: null,
  },
  SERVICE_CHARGE: {
    meaning: "Group formation service charge — flat, per person per section, its own line",
    owner: "[SIGN-OFF]",
    spec: "§8.2",
    value: null,
  },
  HOUSEHOLD_FEE: {
    meaning: "Optional recurring Household tier",
    owner: "[SIGN-OFF]",
    spec: "§8.3",
    value: null,
  },
  PARTNER_SHARE_TARGET: {
    meaning: "Health metric — partner-seeded share of live journeys to fall below this",
    owner: "[SIGN-OFF]",
    spec: "§2.4",
    value: null,
  },
  PARTNER_SHARE_DATE: {
    meaning: "Date by which the partner-share target is met",
    owner: "[SIGN-OFF]",
    spec: "§2.4",
    value: null,
  },
  INVITES_PER_MEMBER: {
    meaning: "Invitations per member in the founding period",
    owner: "Nermine",
    spec: "§5.2",
    value: null,
  },
  LIVE_SIGNALS: {
    meaning: "Concurrent live signals held at once",
    owner: "Nermine",
    spec: "§6.2",
    value: null,
  },
  STANDING_SIGNALS: {
    meaning: "Standing-signal shortlist size",
    owner: "Nermine",
    spec: "§6.2",
    value: null,
  },
  STANDING_MONTHS: {
    meaning: "Standing signal expiry",
    owner: "Nermine",
    spec: "§6.2, §10",
    value: null,
  },
  CONSIDERING_MAX: {
    meaning: "Windows a member may mark at once",
    owner: "Nermine",
    spec: "§6.3",
    value: null,
  },
  WINDOW_GRANULARITY: {
    meaning: "Window granularity — season, month, or six-week block",
    owner: "Nermine",
    spec: "§6.3",
    value: null,
  },
  QUORUM_TRIGGER: {
    meaning: "Quorum-call threshold — must sit above MIN_GROUP",
    owner: "Nermine",
    spec: "§6.5",
    value: null,
  },
  COOLDOWN_DAYS: {
    meaning: "Days before a withdrawn signal may be re-sent to the same member",
    owner: "Nermine",
    spec: "§6.8",
    value: null,
  },
  LAPSE_MONTHS: {
    meaning: "Inactivity threshold, Verified → Lapsed",
    owner: "Nermine",
    spec: "§10",
    value: null,
  },
  REVIEW_SLA: {
    meaning: "Moderation queue service level; an unreviewed flag expires and content stands",
    owner: "Nermine",
    spec: "§11.3",
    value: null,
  },
};

/** Matches a rendered unfilled-token marker, for tests and e2e sweeps. */
export const SPEC_TOKEN_MARKER_PATTERN = /\{\{[A-Z][A-Z0-9_]*\}\}/;

/**
 * The only way a spec value reaches a surface.
 *
 * - Filled token → its signed-off display string.
 * - Unfilled token in development → a visible `{{NAME}}` marker.
 * - Unfilled token in production → throws, which fails `next build` for any
 *   prerendered surface (spec §13: nothing ships with an unfilled token).
 */
export function specToken(name: SpecTokenName): string {
  const token = SPEC_TOKENS[name];
  if (token.value !== null) {
    return token.value;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Unfilled spec token {{${name}}} reached output. ` +
        `Owner: ${token.owner} (${token.spec}). ` +
        "Nothing ships with an unfilled token; nothing ships with a guess.",
    );
  }
  return `{{${name}}}`;
}

/** Every token still awaiting its owner's value — the standing blocker list. */
export function unfilledSpecTokens(): readonly SpecTokenName[] {
  return SPEC_TOKEN_NAMES.filter((name) => SPEC_TOKENS[name].value === null);
}

/**
 * True when every named token has a signed-off value. Surfaces that render
 * tokens gate on this in production: in development they render with visible
 * markers for design review; in production they are withheld entirely until
 * sign-off, so the build never emits an unfilled token and the rest of the
 * site stays shippable. ("Nothing ships with an unfilled token" — §13.)
 */
export function specTokensFilled(names: readonly SpecTokenName[]): boolean {
  return names.every((name) => SPEC_TOKENS[name].value !== null);
}

/**
 * Convenience gate for the §7 pricing surfaces. Includes the §7.8 upgrade
 * tokens because the upgrade panel renders inside the same block — the gate
 * must cover every token the block emits, or a partial sign-off would fail
 * the production build.
 */
export const PRICING_SURFACE_TOKENS: readonly SpecTokenName[] = [
  "PRICE_T1",
  "PRICE_T2",
  "PRICE_T3",
  "PRICE_T4",
  "PRICE_T5",
  "PRICE_T6",
  "MIN_GROUP",
  "LOCK_DAYS",
  "UPGRADE_NAME",
  "UPGRADE_PRICE",
  "SINGLE_SUPPLEMENT",
];
