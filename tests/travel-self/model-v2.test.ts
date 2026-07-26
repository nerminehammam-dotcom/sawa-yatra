import { describe, expect, it } from "vitest";

import {
  AXIS_COVERAGE,
  AXIS_IDS,
  MIN_POLE,
  PASSION_BY_ID,
  PASSION_WEIGHTS,
  SECTIONS,
  TRAVEL_SELF_QUESTIONS,
  blendedCentroid,
  calculateResiduals,
  confidenceFor,
  hasCompleteAnswers,
  passionRelevance,
  readTravelSelf,
  recommendSection,
  recommendSections,
  resolveDisplayName,
  resolveResidualPole,
  scoreAxes,
  validatePassionSelection,
  type AxisDirection,
  type AxisId,
  type AxisVector,
  type PassionId,
  type PassionSelection,
  type TravelSection,
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
      if (!selected) throw new Error(`No ${direction} option for ${question.id}`);
      return [question.id, selected.id];
    }),
  );
}

const foodOnly: PassionSelection = {
  primary: "food",
  secondary: null,
  also: [],
};

function sectionWithPassions(
  passionFit: TravelSection["passionFit"],
): TravelSection {
  return { ...SECTIONS[0], id: "fixture", passionFit };
}

describe("Travel Self v2 engine", () => {
  it("scores and normalises positive and negative answer loading", () => {
    const answers = answersFor({
      rhythm: "positive",
      discovery: "negative",
      socialEnergy: "positive",
      clock: "negative",
      threshold: "positive",
      focus: "negative",
    });
    const { axes, evidence } = scoreAxes(answers);

    expect(axes).toEqual({
      rhythm: 1,
      discovery: -1,
      socialEnergy: 1,
      clock: -1,
      threshold: 1,
      focus: -1,
    });
    expect(evidence).toEqual({
      rhythm: 3,
      discovery: 3,
      socialEnergy: 3,
      clock: 2,
      threshold: 3,
      focus: 2,
    });
  });

  it("rejects incomplete answers at the public model boundary", () => {
    expect(hasCompleteAnswers({})).toBe(false);
    expect(() => readTravelSelf({}, foodOnly)).toThrow(/one valid answer/u);
  });

  it("derives thin-axis coverage from the question bank", () => {
    expect(AXIS_COVERAGE.clock).toMatchObject({
      itemCount: 2,
      negativeLoads: 2,
      positiveLoads: 2,
      canSingleItemFlipPole: true,
      thin: true,
    });
    expect(AXIS_COVERAGE.focus.thin).toBe(true);
    expect(AXIS_COVERAGE.rhythm.thin).toBe(false);
  });

  it("breaks equal residual ties by the stable axis order", () => {
    const zero = Object.fromEntries(AXIS_IDS.map((axis) => [axis, 0])) as AxisVector;
    const centroid = { ...zero, rhythm: -0.5, discovery: -0.5 };
    const residuals = calculateResiduals(zero, centroid);

    expect(residuals[0]).toMatchObject({ axis: "rhythm", magnitude: 0.5 });
    expect(residuals[1]).toMatchObject({ axis: "discovery", magnitude: 0.5 });
  });

  it("uses the bare noun when no residual clears MIN_POLE", () => {
    expect(MIN_POLE).toBe(0.2);
    expect(
      resolveResidualPole([
        { axis: "focus", value: 0.1999, magnitude: 0.1999 },
      ]),
    ).toEqual({ winningAxis: null, direction: null });
    expect(resolveDisplayName("food", null, null)).toEqual({
      name: "The Epicurean",
      noun: "Epicurean",
      modifier: null,
    });
  });

  it("blends primary and secondary centroids at the named weights", () => {
    const selection: PassionSelection = {
      primary: "food",
      secondary: "nature",
      also: ["art"],
    };
    const centroid = blendedCentroid(selection);
    const expectedRhythm =
      (PASSION_BY_ID.food.centroid.rhythm * PASSION_WEIGHTS.primary +
        PASSION_BY_ID.nature.centroid.rhythm * PASSION_WEIGHTS.secondary) /
      (PASSION_WEIGHTS.primary + PASSION_WEIGHTS.secondary);

    expect(centroid.rhythm).toBeCloseTo(expectedRhythm, 4);
    expect(centroid).toEqual(
      blendedCentroid({ ...selection, also: ["music", "wildlife"] }),
    );
  });

  it("supports one passion and enforces all passion invariants", () => {
    expect(validatePassionSelection(foodOnly)).toEqual([]);
    expect(
      validatePassionSelection({
        primary: "food",
        secondary: "food",
        also: [],
      }),
    ).toContain("Primary and secondary passions must be different.");
    expect(
      validatePassionSelection({
        primary: "food",
        secondary: null,
        also: ["food"],
      }),
    ).toContain("Each selected passion may appear only once.");
    expect(
      validatePassionSelection({
        primary: "food",
        secondary: "nature",
        also: ["art", "music", "craft"],
      }),
    ).toContain("Choose no more than four passions.");
    expect(
      validatePassionSelection({
        primary: "invented" as PassionId,
        secondary: null,
        also: [],
      }),
    ).toContain("Every passion must use a recognised passion ID.");
  });

  it("pins the provisional confidence formula", () => {
    const axes: AxisVector = {
      rhythm: 0.6,
      discovery: 0,
      socialEnergy: 0,
      clock: 0,
      threshold: 0,
      focus: 0,
    };
    const confidence = confidenceFor(
      [
        { axis: "rhythm", value: 0.6, magnitude: 0.6 },
        { axis: "discovery", value: 0.3, magnitude: 0.3 },
      ],
      axes,
    );

    expect(confidence).toBe(0.75);
  });

  it("applies curated names and safely suppresses a combination", () => {
    expect(resolveDisplayName("food", "socialEnergy", "negative").name).toBe(
      "The Hidden Epicurean",
    );
    expect(resolveDisplayName("architecture", "threshold", "positive")).toEqual({
      name: "The Pilgrim",
      noun: "Pilgrim",
      modifier: null,
    });
  });

  it("renormalises sparse passion data across only available signals", () => {
    const both = sectionWithPassions({ food: 3, nature: 0 });
    const primaryOnly = sectionWithPassions({ food: 3 });
    const secondaryOnly = sectionWithPassions({ nature: 3 });
    const none = sectionWithPassions({});
    const selection: PassionSelection = {
      primary: "food",
      secondary: "nature",
      also: [],
    };
    const axes = SECTIONS[0].profile;

    expect(passionRelevance(both, selection)).toBeCloseTo(2 / 3, 4);
    expect(passionRelevance(primaryOnly, selection)).toBe(1);
    expect(passionRelevance(secondaryOnly, selection)).toBe(1);
    expect(passionRelevance(none, selection)).toBeNull();

    const noPassion = recommendSection(none, axes, selection);
    expect(noPassion.fit).toBe(noPassion.experientialFit);
    expect(noPassion.passionSignalAvailable).toBe(false);
    expect(noPassion.sectionId).toBe("fixture");
  });

  it("sorts sections deterministically and keeps operational data out of ranking", () => {
    const axes = answersFor({ rhythm: "positive", threshold: "positive" });
    const profile = scoreAxes(axes).axes;
    const first = recommendSections(profile, foodOnly);
    const second = recommendSections(profile, foodOnly);

    expect(first).toEqual(second);
    expect(first).toHaveLength(3);
    expect(first.map((item) => item.sectionId)).toEqual(
      [...first]
        .sort(
          (left, right) =>
            right.fit - left.fit || left.sectionId.localeCompare(right.sectionId),
        )
        .map((item) => item.sectionId),
    );

    const base = sectionWithPassions({});
    const operationalVariant: TravelSection = {
      ...base,
      operational: { ...base.operational, exertion: 3, peakAltitudeM: 5000 },
    };
    expect(recommendSection(base, profile, foodOnly).fit).toBe(
      recommendSection(operationalVariant, profile, foodOnly).fit,
    );
  });

  it("returns stable IDs and deterministic complete results", () => {
    const answers = answersFor();
    const first = readTravelSelf(answers, foodOnly);
    const second = readTravelSelf(answers, foodOnly);

    expect(first).toEqual(second);
    expect(first.id).toMatch(/^food:/u);
    expect(first.noun).toBe("Epicurean");
  });
});
