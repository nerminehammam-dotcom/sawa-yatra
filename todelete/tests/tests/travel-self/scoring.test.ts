import { describe, expect, it } from "vitest";

import { scoreTravelSelf } from "@/lib/travel-self";
import type { ArchetypeId, QuizQuestion } from "@/lib/types";

function question(
  id: string,
  scores: readonly [
    Partial<Record<ArchetypeId, number>>,
    Partial<Record<ArchetypeId, number>>,
  ],
): QuizQuestion {
  return {
    id,
    prompt: id,
    options: [
      {
        id: `${id}-a`,
        label: "A",
        scores: scores[0],
        scoreStatus: "DRAFT",
        scoreNote: "demo",
        contentStatus: "DRAFT",
      },
      {
        id: `${id}-b`,
        label: "B",
        scores: scores[1],
        scoreStatus: "DRAFT",
        scoreNote: "demo",
        contentStatus: "DRAFT",
      },
      {
        id: `${id}-c`,
        label: "C",
        scores: { "night-owl": 1 },
        scoreStatus: "DRAFT",
        scoreNote: "demo",
        contentStatus: "DRAFT",
      },
      {
        id: `${id}-d`,
        label: "D",
        scores: { "food-led": 1 },
        scoreStatus: "DRAFT",
        scoreNote: "demo",
        contentStatus: "DRAFT",
      },
    ],
    contentStatus: "DRAFT",
  };
}

describe("scoreTravelSelf", () => {
  it("returns the highest-scoring archetype", () => {
    const questions = [
      question("q1", [{ "slow-wanderer": 3 }, { "food-led": 1 }]),
    ];

    expect(scoreTravelSelf(questions, { q1: "q1-a" }, [])).toBe(
      "slow-wanderer",
    );
  });

  it("uses the final questions to resolve an overall tie", () => {
    const questions = [
      question("q1", [{ "slow-wanderer": 2 }, {}]),
      question("q2", [{ "food-led": 1 }, {}]),
      question("q5", [{ "food-led": 1 }, { "slow-wanderer": 1 }]),
    ];

    expect(
      scoreTravelSelf(
        questions,
        { q1: "q1-a", q2: "q2-a", q5: "q5-a" },
        ["q5"],
      ),
    ).toBe("food-led");
  });

  it("falls back to deterministic alphabetical archetype ids", () => {
    const questions = [
      question("q1", [{ "slow-wanderer": 1, "food-led": 1 }, {}]),
    ];

    expect(scoreTravelSelf(questions, { q1: "q1-a" }, ["q1"])).toBe(
      "food-led",
    );
  });

  it("returns null when there are no valid answers", () => {
    expect(scoreTravelSelf([], {}, [])).toBeNull();
  });
});
