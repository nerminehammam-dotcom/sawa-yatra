import { describe, expect, it } from "vitest";

import {
  ARCHETYPES,
  ARCHETYPE_BY_SIGNATURE,
  BEND_FIVE,
  BEND_FOUR,
  FAMILY_LINE,
  FRICTION,
  FRICTION_ALL_FLEXIBLE,
  NO_BENDS,
  PASSIONS,
  SPREAD_LINE,
  TIME_TOGETHER,
  signatureFor,
  type Axis,
  type Pole,
} from "@/content/travel-self/travel-self-model";
import {
  bendLineV23,
  frictionLineV23,
  motivationLineV23,
  scoreTravelSelfV23,
  type CompletePositions,
} from "@/lib/travel-self/scoring-v23";
import type { TravelSelfAnswers } from "@/lib/travel-self/state-machine";

function positions(
  values: Partial<Record<Axis, Pole>> = {},
): CompletePositions {
  return {
    pace: 1,
    planning: 1,
    social: 1,
    rhythm: 1,
    comfort: 1,
    ...values,
  };
}

function answers(
  values: Partial<TravelSelfAnswers> = {},
): TravelSelfAnswers {
  return {
    positions: positions(),
    timeTogether: TIME_TOGETHER[0],
    passions: ["Food", "Design", "Nature"],
    lead: "Food",
    ...values,
  };
}

function combinations<T>(items: readonly T[], size: number): T[][] {
  if (size === 0) return [[]];
  return items.flatMap((item, index) =>
    combinations(items.slice(index + 1), size - 1).map((rest) => [item, ...rest]),
  );
}

describe("Travel Self v2.3 scoring", () => {
  it("resolves all sixteen signatures through the locked signature map", () => {
    const values: Pole[] = [1, 6];
    const names = new Set<string>();

    for (const pace of values) for (const planning of values)
      for (const social of values) for (const rhythm of values) {
        const candidate = positions({ pace, planning, social, rhythm });
        const signature = signatureFor(candidate);
        const expectedName = ARCHETYPE_BY_SIGNATURE[signature];
        const result = scoreTravelSelfV23(answers({ positions: candidate }));

        expect(expectedName).toBeDefined();
        expect(result?.name).toBe(expectedName);
        expect(result?.readout).toBe(
          ARCHETYPES.find((archetype) => archetype.name === expectedName)?.readout,
        );
        names.add(result?.name ?? "");
      }

    expect(names).toHaveLength(16);
  });

  it("covers all 286 unordered passion combinations", () => {
    const passionNames = PASSIONS.map((passion) => passion.name);
    const sets = combinations(passionNames, 3) as [string, string, string][];

    expect(sets).toHaveLength(286);
    for (const set of sets) {
      expect(motivationLineV23(set)).toBeTruthy();
      expect(motivationLineV23([set[2], set[0], set[1]])).toBe(
        motivationLineV23(set),
      );
    }
  });

  it("uses the dominant family or the matching three-family spread", () => {
    expect(motivationLineV23(["Food", "Festivals", "Nature"])).toBe(
      FAMILY_LINE.Table,
    );
    expect(motivationLineV23(["Food", "Design", "Nature"])).toBe(
      SPREAD_LINE["Made+Table+Wild"],
    );
  });

  it("covers zero through five bends in passport order", () => {
    expect(bendLineV23(positions())).toBe(NO_BENDS);
    expect(bendLineV23(positions({ rhythm: 3 }))).toBe("Rhythm.");
    expect(bendLineV23(positions({ rhythm: 3, pace: 4, comfort: 3 }))).toBe(
      "Rhythm, Pace, Comfort.",
    );
    expect(bendLineV23(positions({
      rhythm: 3,
      pace: 4,
      comfort: 3,
      planning: 4,
    }))).toBe(BEND_FOUR("social energy"));
    expect(bendLineV23(positions({
      rhythm: 3,
      pace: 4,
      comfort: 3,
      planning: 4,
      social: 3,
    }))).toBe(BEND_FIVE);
  });

  it("walks the locked friction order and excludes comfort", () => {
    expect(frictionLineV23(positions({ rhythm: 6 }))).toBe(
      FRICTION["rhythm|Night-Owl"],
    );
    expect(frictionLineV23(positions({ rhythm: 3, pace: 6 }))).toBe(
      FRICTION["pace|Full-Tilt"],
    );
    expect(frictionLineV23(positions({
      rhythm: 3,
      pace: 4,
      planning: 3,
      social: 4,
      comfort: 1,
    }))).toBe(FRICTION_ALL_FLEXIBLE);
  });

  it("returns null until every answer and the lead are valid", () => {
    expect(scoreTravelSelfV23(answers({ positions: { pace: 1 } }))).toBeNull();
    expect(scoreTravelSelfV23(answers({ timeTogether: null }))).toBeNull();
    expect(scoreTravelSelfV23(answers({ passions: ["Food", "Design"] }))).toBeNull();
    expect(scoreTravelSelfV23(answers({ lead: "Water" }))).toBeNull();
  });

  it("derives a complete passport-ready result without a special case", () => {
    const result = scoreTravelSelfV23(answers({
      positions: positions({
        pace: 2,
        planning: 5,
        social: 2,
        rhythm: 5,
        comfort: 4,
      }),
      timeTogether: TIME_TOGETHER[1],
      passions: ["Food", "Design", "Culture"],
      lead: "Design",
    }));

    expect(result).toMatchObject({
      name: "The Astronomer",
      readout: "unhurried · charted · quiet · night-led",
      travelFor: FAMILY_LINE.Made,
      comfort: "Considered",
      timeTogether: TIME_TOGETHER[1],
      bendOn: "Comfort.",
      feelItWhen: FRICTION["rhythm|Night-Owl"],
      lead: "Design",
    });
  });
});
