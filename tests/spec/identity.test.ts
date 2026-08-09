/**
 * Area D tests — identity (spec §3, rules 4.1–4.4).
 *
 * Locked rules under test: DOB never surfaces and is unreachable in any
 * serialized output (4.2); brackets are exactly the seven of rule 4.3,
 * derived one-way; the bracket is displayed, never operative (4.4).
 *
 * Fixture numbers below are test-local; no §13 value is involved in this
 * module — identity carries no parametric behaviour.
 */
import { describe, expect, it } from "vitest";

import * as identity from "@/lib/membership/identity";
import {
  AGE_BRACKETS,
  assertBracketNotOperative,
  assertNoHiddenFields,
  deriveAgeBracket,
  exportMember,
  serializeMemberForApi,
  toPassport,
  type HiddenProfile,
  type PassportSource,
} from "@/lib/membership/identity";

const NOW = new Date(Date.UTC(2026, 7, 8));

const profile: HiddenProfile = {
  memberId: "m-001",
  legalName: "Amelia Example Hartley",
  dateOfBirth: new Date(Date.UTC(1979, 2, 14)),
  email: "hidden@example.com",
  mobile: "+20 100 000 0000",
  socialAnchor: "https://social.example/amelia",
  sponsoringMemberId: "m-000",
};

const source: PassportSource = {
  archetypeIconId: "icon-cartographer",
  archetypeName: "The Cartographer",
  keywords: ["patient", "map-minded", "early riser", "listens"],
  reading: {
    axes: [
      { axis: "pace", text: "Slow mornings, long afternoons." },
      { axis: "company", text: "Small tables over big rooms." },
      { axis: "planning", text: "A route, loosely held." },
      { axis: "comfort", text: "Simple beds, good boots." },
      { axis: "curiosity", text: "Asks the second question." },
    ],
    description: "Steady on a long road; keeps the group's memory.",
  },
  openSpace: {
    visibility: "members",
    entries: [
      { kind: "note", content: "I collect old railway maps." },
      { kind: "photograph", content: "photo-ref-1" },
    ],
  },
};

describe("age brackets — rules 4.2, 4.3", () => {
  it("defines exactly the seven brackets of rule 4.3, in order", () => {
    expect(AGE_BRACKETS).toEqual([
      "20s",
      "30s",
      "40s",
      "50s",
      "60s",
      "70s",
      "80+",
    ]);
  });

  it("derives the bracket from a date of birth", () => {
    expect(deriveAgeBracket(new Date(Date.UTC(2001, 0, 1)), NOW)).toBe("20s");
    expect(deriveAgeBracket(new Date(Date.UTC(1979, 2, 14)), NOW)).toBe("40s");
    expect(deriveAgeBracket(new Date(Date.UTC(1950, 0, 1)), NOW)).toBe("70s");
  });

  it("handles decade boundaries by whole years, birthday-exact", () => {
    // Turns 30 the day before NOW → "30s"; turns 30 the day after → "20s".
    expect(deriveAgeBracket(new Date(Date.UTC(1996, 7, 7)), NOW)).toBe("30s");
    expect(deriveAgeBracket(new Date(Date.UTC(1996, 7, 9)), NOW)).toBe("20s");
  });

  it("caps the top bracket as open-ended 80+", () => {
    expect(deriveAgeBracket(new Date(Date.UTC(1946, 0, 1)), NOW)).toBe("80+");
    expect(deriveAgeBracket(new Date(Date.UTC(1930, 0, 1)), NOW)).toBe("80+");
  });

  it("refuses ages below the lowest bracket rather than inventing one", () => {
    expect(() => deriveAgeBracket(new Date(Date.UTC(2010, 0, 1)), NOW)).toThrow(
      RangeError,
    );
  });

  it("refuses a future date of birth", () => {
    expect(() => deriveAgeBracket(new Date(Date.UTC(2030, 0, 1)), NOW)).toThrow(
      RangeError,
    );
  });

  it("is one-way: the module exports no route back to a date of birth", () => {
    for (const exportName of Object.keys(identity)) {
      expect(exportName).not.toMatch(/dob|birth|legalname|reverse|invert/i);
    }
  });
});

describe("toPassport — the only producer of member-visible identity", () => {
  const passport = toPassport(profile, source, NOW);

  it("derives the bracket through the one-way door", () => {
    expect(passport.face.ageBracket).toBe("40s");
  });

  it("carries face, reading and open space — and no hidden-profile field", () => {
    expect(passport.face.keywords).toHaveLength(4);
    expect(passport.reading.axes).toHaveLength(5);
    expect(passport.openSpace.visibility).toBe("members");
    const keys = [
      ...Object.keys(passport),
      ...Object.keys(passport.face),
      ...Object.keys(passport.reading),
      ...Object.keys(passport.openSpace),
    ];
    for (const key of keys) {
      expect(key).not.toMatch(/dob|birth|legalName|email|mobile|social|sponsor/i);
    }
  });

  it("compile-time proofs hold at runtime too", () => {
    expect(identity.PASSPORT_HAS_NO_HIDDEN_KEYS).toBe(true);
    expect(identity.PASSPORT_FACE_HAS_NO_HIDDEN_KEYS).toBe(true);
    expect(identity.PASSPORT_READING_HAS_NO_HIDDEN_KEYS).toBe(true);
    expect(identity.OPEN_SPACE_HAS_NO_HIDDEN_KEYS).toBe(true);
    expect(identity.SERIALIZED_MEMBER_HAS_NO_HIDDEN_KEYS).toBe(true);
  });
});

describe("serialization — DOB unreachable in any serialized output (4.2, §12)", () => {
  const passport = toPassport(profile, source, NOW);

  it("serializeMemberForApi output contains no DOB, legal name or contact detail", () => {
    const json = JSON.stringify(serializeMemberForApi(passport));
    expect(json).not.toMatch(/dateOfBirth|dob|birth|legalName/i);
    expect(json).not.toContain(profile.legalName);
    expect(json).not.toContain(profile.email);
    expect(json).not.toContain(profile.mobile);
    expect(json).not.toContain("1979");
  });

  it("exportMember gives the same structural guarantee", () => {
    const json = JSON.stringify(exportMember(passport));
    expect(json).not.toMatch(/dateOfBirth|dob|birth|legalName/i);
  });

  it("assertNoHiddenFields passes a clean serialized member", () => {
    expect(() =>
      assertNoHiddenFields(JSON.parse(JSON.stringify(serializeMemberForApi(passport)))),
    ).not.toThrow();
  });

  it("assertNoHiddenFields catches DOB-like and legal-name keys at any depth", () => {
    expect(() => assertNoHiddenFields({ dob: "1979-03-14" })).toThrow(/4\.2/);
    expect(() => assertNoHiddenFields({ dateOfBirth: "1979-03-14" })).toThrow();
    expect(() => assertNoHiddenFields({ date_of_birth: "1979-03-14" })).toThrow();
    expect(() => assertNoHiddenFields({ birthYear: 1979 })).toThrow();
    expect(() => assertNoHiddenFields({ legalName: "A. Hartley" })).toThrow();
    expect(() =>
      assertNoHiddenFields({ member: { profile: { legal_name: "A" } } }),
    ).toThrow();
    expect(() =>
      assertNoHiddenFields({ roster: [{ ok: true }, { dob: "x" }] }),
    ).toThrow();
  });

  it("assertNoHiddenFields ignores harmless keys and primitives", () => {
    expect(() =>
      assertNoHiddenFields({ memberId: "m-1", firstName: "Amelia", page: 2 }),
    ).not.toThrow();
    expect(() => assertNoHiddenFields("just a string")).not.toThrow();
    expect(() => assertNoHiddenFields(null)).not.toThrow();
  });
});

describe("rule 4.4 — the bracket is never operative", () => {
  it("exports the forbidden query-key list", () => {
    expect(identity.BRACKET_FORBIDDEN_QUERY_KEYS).toEqual([
      "ageBracket",
      "bracket",
      "age",
    ]);
  });

  it("rejects any query params that would make the bracket operative", () => {
    expect(() => assertBracketNotOperative({ ageBracket: "40s" })).toThrow(
      /4\.4/,
    );
    expect(() => assertBracketNotOperative({ bracket: "40s" })).toThrow();
    expect(() => assertBracketNotOperative({ age: "40" })).toThrow();
    expect(() => assertBracketNotOperative({ AGE_BRACKET: "40s" })).toThrow();
    expect(() => assertBracketNotOperative({ sortByBracket: "asc" })).toThrow();
  });

  it("accepts ordinary query params — including ones merely containing 'age'", () => {
    expect(() =>
      assertBracketNotOperative({ journeyId: "j-1", page: "2", message: "hi" }),
    ).not.toThrow();
  });
});
