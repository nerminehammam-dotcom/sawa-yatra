import { describe, expect, it } from "vitest";

import { AXES, type AxisPosition, type AxisPositions } from "@/content/travel-self/axes";
import { FAMILIES, FAMILY_KEYS } from "@/content/travel-self/families";
import { PASSION_IDS, type PassionId } from "@/content/travel-self/passions";
import { bendLine, familyKey, motivationLine, readoutFor, stingLine } from "@/lib/travel-self/engine";

function positions(values: Partial<AxisPositions> = {}): AxisPositions {
  return { pace: 1, planning: 1, social: 1, rhythm: 1, comfort: 1, ...values };
}

function combinations<T>(items: readonly T[], size: number): T[][] {
  if (size === 0) return [[]];
  return items.flatMap((item, index) =>
    combinations(items.slice(index + 1), size - 1).map((rest) => [item, ...rest]),
  );
}

describe("Travel Self v2 engine", () => {
  it("resolves all sixteen typed family keys with lower-case four-word readouts", () => {
    expect(FAMILY_KEYS).toHaveLength(16);
    for (const key of FAMILY_KEYS) {
      expect(FAMILIES[key]).toBeDefined();
      expect(readoutFor(key).split(" · ")).toHaveLength(4);
      expect(readoutFor(key)).toBe(readoutFor(key).toLowerCase());
    }
  });

  it("lands all 1,296 naming-axis combinations on a real family", () => {
    const values: AxisPosition[] = [1, 2, 3, 4, 5, 6];
    let checked = 0;
    for (const pace of values) for (const planning of values)
      for (const social of values) for (const rhythm of values) {
        expect(FAMILIES[familyKey(positions({ pace, planning, social, rhythm }))]).toBeDefined();
        checked += 1;
      }
    expect(checked).toBe(1296);
  });

  it("resolves all 286 passion combinations", () => {
    const sets = combinations(PASSION_IDS, 3) as [PassionId, PassionId, PassionId][];
    expect(sets).toHaveLength(286);
    for (const set of sets) expect(motivationLine(set)).toBeTruthy();
  });

  it("covers every bend case", () => {
    expect(bendLine(positions())).toBe("Nothing. You are firmly placed on all five.");
    expect(bendLine(positions({ rhythm: 3 }))).toBe("Rhythm.");
    expect(bendLine(positions({ rhythm: 3, pace: 4, comfort: 3 }))).toBe("Rhythm, Pace, Comfort.");
    expect(bendLine(positions({ rhythm: 3, pace: 4, comfort: 3, planning: 4 }))).toBe("You adapt across most of a journey; social energy is the preference you hold to.");
    expect(bendLine(positions({ rhythm: 3, pace: 4, comfort: 3, planning: 4, social: 3 }))).toBe("You adapt across all five, which makes you easier to travel with than most and harder to place.");
  });

  it("uses every firm pole and the all-bends sting", () => {
    for (const axis of AXES) {
      expect(stingLine(positions({ [axis.id]: 1 }))).toBeTruthy();
      const otherBends = Object.fromEntries(AXES.filter((item) => item.id !== axis.id).map((item) => [item.id, 3]));
      expect(stingLine(positions({ ...otherBends, [axis.id]: 1 }))).toBe(axis.feel.left);
      expect(stingLine(positions({ ...otherBends, [axis.id]: 2 }))).toBe(axis.feel.left);
      expect(stingLine(positions({ ...otherBends, [axis.id]: 5 }))).toBe(axis.feel.right);
      expect(stingLine(positions({ ...otherBends, [axis.id]: 6 }))).toBe(axis.feel.right);
    }
    expect(stingLine(positions({ pace: 3, planning: 4, social: 3, rhythm: 4, comfort: 3 }))).toBe("the group looks to you for a preference, and you do not have a strong one to give.");
  });

  it("derives the Astronomer example without a special case", () => {
    const answer = positions({ pace: 2, planning: 5, social: 2, rhythm: 5, comfort: 4 });
    expect(familyKey(answer)).toBe("LRLR");
    expect(FAMILIES[familyKey(answer)].name).toBe("The Astronomer");
    expect(bendLine(answer)).toBe("Comfort.");
    expect(stingLine(answer)).toBe("the group wants to be up at six and decide the day over breakfast.");
  });
});
