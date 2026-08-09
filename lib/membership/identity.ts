/**
 * Travel-self identity — spec v3.1 §3, rules 4.1–4.4.
 *
 * Two objects, one door between them:
 * - The hidden profile (§3.1): collected at joining, never displayed, never
 *   partially displayed.
 * - The Travel Self Passport (§3.2): the only identity inside the club.
 *
 * The one-way door is deriveAgeBracket (rule 4.2): a date of birth enters, an
 * age bracket leaves, and nothing in this module — or anywhere member-visible —
 * can reconstruct the date. toPassport is the only producer of member-visible
 * identity: Passport is a branded type, so it cannot be assembled by hand
 * against the door.
 *
 * Rule 4.4 lives here too: the age bracket is displayed, never operative. No
 * filter/sort/matching/query type in this codebase may carry a bracket key;
 * BracketNeverOperative<T> enforces it at the type level and
 * assertBracketNotOperative at runtime.
 */

// ---------------------------------------------------------------------------
// The hidden profile (§3.1) — never displayed, never partially displayed.
// ---------------------------------------------------------------------------

export interface HiddenProfile {
  readonly memberId: string;
  /** Identity, booking, insurance. Public at stage 3 — checkout only (§6.7). */
  readonly legalName: string;
  /** Eligibility, insurance, bracket derivation. Never public — rule 4.2. */
  readonly dateOfBirth: Date;
  /** Account, contact. Never public. */
  readonly email: string;
  /** Account recovery, on-route contact. Never public. */
  readonly mobile: string;
  /**
   * Social or equivalent anchor, confirmed strictly factually by the sponsor:
   * "this account belongs to this person" — never an assessment of content.
   */
  readonly socialAnchor: string | null;
  /** Accountability chain (§5.3). Null only for a house-door invitation. */
  readonly sponsoringMemberId: string | null;
}

// ---------------------------------------------------------------------------
// Age brackets (rules 4.2, 4.3)
// ---------------------------------------------------------------------------

/** Rule 4.3 — the brackets, exactly. Derived, never member-editable. */
export const AGE_BRACKETS = [
  "20s",
  "30s",
  "40s",
  "50s",
  "60s",
  "70s",
  "80+",
] as const;

export type AgeBracket = (typeof AGE_BRACKETS)[number];

/**
 * Bracket width in years. Derivable structure of the bracket labels
 * themselves ("20s", "30s", …), not a §13 spec value.
 */
const DECADE_YEARS = 10;

function wholeYearsBetween(dateOfBirth: Date, now: Date): number {
  let age = now.getUTCFullYear() - dateOfBirth.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - dateOfBirth.getUTCMonth();
  if (
    monthDelta < 0 ||
    (monthDelta === 0 && now.getUTCDate() < dateOfBirth.getUTCDate())
  ) {
    age -= 1;
  }
  return age;
}

/**
 * The ONE-WAY door (rule 4.2). DOB → bracket; no inverse exists anywhere in
 * the data model, and no export of this module carries a date of birth.
 *
 * Bracket lower bounds are parsed from the labels themselves — the labels are
 * the source of truth, not a parallel table of numbers.
 */
export function deriveAgeBracket(dateOfBirth: Date, now: Date): AgeBracket {
  if (Number.isNaN(dateOfBirth.getTime()) || Number.isNaN(now.getTime())) {
    throw new RangeError("deriveAgeBracket requires valid dates.");
  }
  if (dateOfBirth.getTime() > now.getTime()) {
    throw new RangeError("Date of birth lies in the future.");
  }
  const age = wholeYearsBetween(dateOfBirth, now);
  for (const bracket of AGE_BRACKETS) {
    const lowerBound = Number.parseInt(bracket, 10);
    const openEnded = bracket.endsWith("+");
    if (age >= lowerBound && (openEnded || age < lowerBound + DECADE_YEARS)) {
      return bracket;
    }
  }
  // Below the lowest bracket. Eligibility is a hidden-profile concern (§3.1)
  // resolved before any passport exists; a bracket is never invented for it.
  throw new RangeError(
    "Age falls below the lowest bracket — eligibility is checked before a passport is issued (§3.1).",
  );
}

// ---------------------------------------------------------------------------
// The Travel Self Passport (§3.2)
// ---------------------------------------------------------------------------

/**
 * Part one — the face. The unit that appears in a roster, a card, a section
 * page, a share.
 */
export interface PassportFace {
  readonly archetypeIconId: string;
  readonly archetypeName: string;
  /** Exactly four keywords. */
  readonly keywords: readonly [string, string, string, string];
  /** Rule 4.3 — displayed. Rule 4.4 — never operative. */
  readonly ageBracket: AgeBracket;
}

/** One of the five questionnaire-derived axes, in the introductory register. */
export interface PassportAxisReading {
  readonly axis: string;
  readonly text: string;
}

/** Part two — the reading. Opens on click. */
export interface PassportReading {
  readonly axes: readonly [
    PassportAxisReading,
    PassportAxisReading,
    PassportAxisReading,
    PassportAxisReading,
    PassportAxisReading,
  ];
  /** The archetype description — what this traveller is like on a long road. */
  readonly description: string;
}

export type OpenSpaceEntryKind = "photograph" | "note";

export interface OpenSpaceEntry {
  readonly kind: OpenSpaceEntryKind;
  readonly content: string;
}

/**
 * Part three — the open space. Member-authored, fully public to members
 * (rule 4.5): anonymity inside Sawayatra is member-elective, and the club
 * enforces the option of it, never the fact. Visibility never widens past
 * members (rule 4.1 — browse-only until membership).
 */
export interface PassportOpenSpace {
  readonly visibility: "members";
  readonly entries: readonly OpenSpaceEntry[];
}

declare const passportBrand: unique symbol;

/**
 * The passport — the only identity inside the club. Branded: only toPassport
 * can produce one, so every member-visible identity has passed the one-way
 * door and structurally cannot carry a date of birth, legal name, email,
 * mobile, social anchor or sponsor.
 */
export interface Passport {
  readonly [passportBrand]: true;
  readonly memberId: string;
  readonly face: PassportFace;
  readonly reading: PassportReading;
  readonly openSpace: PassportOpenSpace;
}

// ---------------------------------------------------------------------------
// Type-level proof that member-visible shapes carry no hidden-profile field.
// If anyone ever adds such a key, these constants stop compiling.
// ---------------------------------------------------------------------------

type ForbiddenHiddenKey =
  | "legalName"
  | "dateOfBirth"
  | "dob"
  | "birthDate"
  | "email"
  | "mobile"
  | "socialAnchor"
  | "sponsoringMemberId";

/** Resolves to `true` only when T carries none of the hidden-profile keys. */
export type AssertFreeOfHiddenKeys<T> =
  Extract<keyof T, ForbiddenHiddenKey> extends never ? true : never;

export const PASSPORT_HAS_NO_HIDDEN_KEYS: AssertFreeOfHiddenKeys<Passport> =
  true;
export const PASSPORT_FACE_HAS_NO_HIDDEN_KEYS: AssertFreeOfHiddenKeys<PassportFace> =
  true;
export const PASSPORT_READING_HAS_NO_HIDDEN_KEYS: AssertFreeOfHiddenKeys<PassportReading> =
  true;
export const OPEN_SPACE_HAS_NO_HIDDEN_KEYS: AssertFreeOfHiddenKeys<PassportOpenSpace> =
  true;

// ---------------------------------------------------------------------------
// toPassport — the ONLY producer of member-visible identity.
// ---------------------------------------------------------------------------

/** Questionnaire-derived material for the passport. Carries no hidden field. */
export interface PassportSource {
  readonly archetypeIconId: string;
  readonly archetypeName: string;
  readonly keywords: readonly [string, string, string, string];
  readonly reading: PassportReading;
  readonly openSpace: PassportOpenSpace;
}

/**
 * Takes the hidden profile, keeps only what the club may see, and derives the
 * bracket through the one-way door. Nothing else on the profile crosses.
 */
export function toPassport(
  profile: HiddenProfile,
  source: PassportSource,
  now: Date,
): Passport {
  const passport = {
    memberId: profile.memberId,
    face: {
      archetypeIconId: source.archetypeIconId,
      archetypeName: source.archetypeName,
      keywords: source.keywords,
      ageBracket: deriveAgeBracket(profile.dateOfBirth, now),
    },
    reading: source.reading,
    openSpace: source.openSpace,
  };
  return Object.freeze(passport) as Passport;
}

// ---------------------------------------------------------------------------
// Serialization — shapes that structurally cannot contain DOB or legal name.
// ---------------------------------------------------------------------------

/**
 * The member as any API surface or export may carry them. Built from a
 * Passport only — the hidden profile is not even accepted as input, so a
 * date of birth or legal name has no route into the output (§12: no export,
 * admin view or API response can reconstruct a date of birth).
 */
export interface SerializedMember {
  readonly memberId: string;
  readonly face: PassportFace;
  readonly reading: PassportReading;
  readonly openSpace: PassportOpenSpace;
}

export const SERIALIZED_MEMBER_HAS_NO_HIDDEN_KEYS: AssertFreeOfHiddenKeys<SerializedMember> =
  true;

export function serializeMemberForApi(passport: Passport): SerializedMember {
  const serialized: SerializedMember = {
    memberId: passport.memberId,
    face: passport.face,
    reading: passport.reading,
    openSpace: passport.openSpace,
  };
  // Belt and braces: the type already forbids hidden keys; the runtime scan
  // catches a hidden field smuggled through a cast.
  assertNoHiddenFields(serialized);
  return serialized;
}

/** A member data export. Same structural guarantee as the API shape. */
export function exportMember(passport: Passport): SerializedMember {
  return serializeMemberForApi(passport);
}

/** Lowercases and strips separators so "date_of_birth" ≡ "dateOfBirth". */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const FORBIDDEN_SERIALIZED_KEY = /^dob$|dateofbirth|birth|legalname/;

/**
 * Runtime assertion for tests and API layers (rule 4.2, §12): deep-scans a
 * serialized object and throws on any key resembling a date of birth
 * ("dob", "dateOfBirth", anything containing "birth") or a legal name.
 */
export function assertNoHiddenFields(json: unknown): void {
  const seen = new Set<object>();
  const visit = (node: unknown, path: string): void => {
    if (node === null || typeof node !== "object") return;
    if (seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, `${path}[${index}]`));
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (FORBIDDEN_SERIALIZED_KEY.test(normalizeKey(key))) {
        throw new Error(
          `Hidden-profile field "${key}" found at "${path || "(root)"}" in a serialized member shape — rule 4.2: date of birth and legal name never surface.`,
        );
      }
      visit(value, path === "" ? key : `${path}.${key}`);
    }
  };
  visit(json, "");
}

// ---------------------------------------------------------------------------
// Rule 4.4 — the bracket is displayed, never operative.
// ---------------------------------------------------------------------------

/**
 * Keys that would make the bracket operative in a query. Not a filter, sort
 * key, matching input, facet, search parameter or API query field. Making the
 * bracket filterable amends the spec; it is not a feature request.
 */
export const BRACKET_FORBIDDEN_QUERY_KEYS = [
  "ageBracket",
  "bracket",
  "age",
] as const;

/**
 * Type-level note (rule 4.4): every filter/sort/matching/query input type in
 * the codebase should pass through this alias. A type carrying an operative
 * bracket key collapses to `never` and refuses to compile at the use site.
 */
export type BracketNeverOperative<T> =
  Extract<keyof T, (typeof BRACKET_FORBIDDEN_QUERY_KEYS)[number]> extends never
    ? T
    : never;

/**
 * Runtime guard for query/filter params arriving from outside the type
 * system (URL search params, JSON bodies). Throws if any key would make the
 * age bracket operative.
 */
export function assertBracketNotOperative(
  params: Record<string, unknown>,
): void {
  for (const key of Object.keys(params)) {
    const normalized = normalizeKey(key);
    if (
      normalized === "age" ||
      normalized === "agebracket" ||
      normalized.includes("bracket")
    ) {
      throw new Error(
        `Query key "${key}" would make the age bracket operative — rule 4.4: displayed, never a filter, sort, matching input or query field.`,
      );
    }
  }
}
