import { describe, expect, it, vi } from "vitest";

import {
  TRAVEL_SELF_MODEL_VERSION,
  TRAVEL_SELF_QUESTIONS,
  TRAVEL_SELF_STORAGE_KEY,
} from "@/content/travel-self/travel-self-model";
import {
  parseTravelSelfSession,
  readTravelSelfSession,
  type StoredTravelSelfState,
} from "@/lib/travel-self-session";

function firstAnswer(questionIndex: number) {
  const question = TRAVEL_SELF_QUESTIONS[questionIndex];
  if (!question) throw new Error("Missing fixture question");
  return [question.id, question.options[0].id] as const;
}

function completeAnswers() {
  return Object.fromEntries(
    TRAVEL_SELF_QUESTIONS.map((_, index) => firstAnswer(index)),
  );
}

const baseState: StoredTravelSelfState = {
  version: TRAVEL_SELF_MODEL_VERSION,
  stage: "intro",
  questionIndex: 0,
  answers: {},
  selectedPassions: [],
  primary: null,
  secondary: null,
};

describe("Travel Self v2 session recovery", () => {
  it("uses the exact v2 storage key", () => {
    expect(TRAVEL_SELF_STORAGE_KEY).toBe("sawayatra.travel-self.v2");
  });

  it("restores sequential in-progress question state", () => {
    const state: StoredTravelSelfState = {
      ...baseState,
      stage: "question",
      questionIndex: 1,
      answers: Object.fromEntries([firstAnswer(0)]),
    };
    expect(parseTravelSelfSession(JSON.stringify(state))).toEqual(state);
  });

  it("restores a complete reveal with valid passion roles", () => {
    const state: StoredTravelSelfState = {
      ...baseState,
      stage: "reveal",
      questionIndex: TRAVEL_SELF_QUESTIONS.length - 1,
      answers: completeAnswers(),
      selectedPassions: ["food", "nature", "art"],
      primary: "food",
      secondary: "nature",
    };
    expect(parseTravelSelfSession(JSON.stringify(state))).toEqual(state);
  });

  it.each([
    "not json",
    JSON.stringify({ ...baseState, version: 1 }),
    JSON.stringify({ ...baseState, questionIndex: -1 }),
    JSON.stringify({ ...baseState, answers: { invented: "answer" } }),
    JSON.stringify({ ...baseState, selectedPassions: ["food", "food"] }),
    JSON.stringify({
      ...baseState,
      stage: "reveal",
      selectedPassions: ["food"],
      primary: "food",
    }),
  ])("rejects malformed or inconsistent payload %s", (raw) => {
    expect(parseTravelSelfSession(raw)).toBeNull();
  });

  it("clears an invalid v2 payload and returns no state", () => {
    const storage = {
      getItem: vi.fn(() => "not json"),
      removeItem: vi.fn(),
    };
    expect(readTravelSelfSession(storage)).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith(TRAVEL_SELF_STORAGE_KEY);
  });
});
