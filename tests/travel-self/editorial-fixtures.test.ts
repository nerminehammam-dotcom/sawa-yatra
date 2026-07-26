import { describe, expect, it } from "vitest";

import {
  TRAVEL_SELF_QUESTIONS,
  readTravelSelf,
  type AxisDirection,
  type AxisId,
  type PassionSelection,
  type TravelSelfAnswers,
} from "@/content/travel-self/travel-self-model";

function answersFor(
  directions: Partial<Record<AxisId, AxisDirection>> = {},
): TravelSelfAnswers {
  return Object.fromEntries(
    TRAVEL_SELF_QUESTIONS.map((question) => {
      const direction = directions[question.axis] ?? "negative";
      const value = direction === "negative" ? -1 : 1;
      const selected = question.options.find((option) => option.value === value);
      if (!selected) throw new Error(`Missing ${direction} fixture option`);
      return [question.id, selected.id];
    }),
  );
}

/**
 * Provisional editorial fixtures only. These protect the current draft from
 * accidental code changes, but must be revised when questions, centroids,
 * names, or Route Product Lead profiles change.
 */
describe("provisional Travel Self editorial fixtures", () => {
  it("pins an all-negative Food profile", () => {
    const passions: PassionSelection = {
      primary: "food",
      secondary: null,
      also: ["art"],
    };
    const result = readTravelSelf(answersFor(), passions);

    expect(result.axes).toEqual({
      rhythm: -1,
      discovery: -1,
      socialEnergy: -1,
      clock: -1,
      threshold: -1,
      focus: -1,
    });
    expect(result.name).toBe("The Hidden Epicurean");
    expect(result.recommendedSections.map((item) => item.sectionId)).toEqual([
      "06",
      "03",
      "02",
    ]);
  });

  it("pins an all-positive Nature profile", () => {
    const passions: PassionSelection = {
      primary: "nature",
      secondary: null,
      also: [],
    };
    const result = readTravelSelf(
      answersFor(
        Object.fromEntries(
          [
            "rhythm",
            "discovery",
            "socialEnergy",
            "clock",
            "threshold",
            "focus",
          ].map((axis) => [axis, "positive"]),
        ) as Record<AxisId, AxisDirection>,
      ),
      passions,
    );

    expect(result.axes).toEqual({
      rhythm: 1,
      discovery: 1,
      socialEnergy: 1,
      clock: 1,
      threshold: 1,
      focus: 1,
    });
    expect(result.name).toBe("The Full-Stride Listener");
    expect(result.recommendedSections.map((item) => item.sectionId)).toEqual([
      "01",
      "07",
      "05",
    ]);
  });
});
