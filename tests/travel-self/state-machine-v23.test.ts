import { describe, expect, it } from "vitest";

import { AXES, PASSIONS, TIME_TOGETHER } from "@/content/travel-self/travel-self-model";
import {
  INITIAL_TRAVEL_SELF_STATE,
  isQuestionnaireComplete,
  isStepAnswered,
  shouldPersistTravelSelfTransition,
  travelSelfReducer,
  type TravelSelfState,
} from "@/lib/travel-self/state-machine";

function answerThroughStepEight(): TravelSelfState {
  let state = travelSelfReducer(INITIAL_TRAVEL_SELF_STATE, { type: "start" });

  for (const axis of AXES) {
    state = travelSelfReducer(state, {
      type: "answer-axis",
      axis: axis.key,
      value: 3,
    });
    state = travelSelfReducer(state, { type: "next" });
  }

  state = travelSelfReducer(state, {
    type: "answer-time-together",
    value: TIME_TOGETHER[0],
  });
  state = travelSelfReducer(state, { type: "next" });

  for (const passion of PASSIONS.slice(0, 3)) {
    state = travelSelfReducer(state, {
      type: "toggle-passion",
      value: passion.name,
    });
  }
  state = travelSelfReducer(state, { type: "next" });
  state = travelSelfReducer(state, {
    type: "answer-lead",
    value: PASSIONS[0]!.name,
  });

  return state;
}

describe("Travel Self v2.3 state machine", () => {
  it("starts at the first question and cannot advance without an answer", () => {
    const started = travelSelfReducer(INITIAL_TRAVEL_SELF_STATE, { type: "start" });

    expect(started.stage).toBe("questionnaire");
    expect(started.step).toBe(1);
    expect(travelSelfReducer(started, { type: "next" })).toBe(started);
  });

  it("advances through all eight completed steps and reveals the result", () => {
    const answered = answerThroughStepEight();

    expect(answered.step).toBe(8);
    expect(isStepAnswered(answered)).toBe(true);
    expect(isQuestionnaireComplete(answered)).toBe(true);

    const result = travelSelfReducer(answered, { type: "next" });
    expect(result.stage).toBe("result");
    expect(result.answers).toEqual(answered.answers);
  });

  it("retains answers while moving back through the questionnaire", () => {
    let state = travelSelfReducer(INITIAL_TRAVEL_SELF_STATE, { type: "start" });
    state = travelSelfReducer(state, {
      type: "answer-axis",
      axis: AXES[0].key,
      value: 6,
    });
    state = travelSelfReducer(state, { type: "next" });
    state = travelSelfReducer(state, { type: "back" });

    expect(state.step).toBe(1);
    expect(state.answers.positions[AXES[0].key]).toBe(6);
  });

  it("refuses a fourth passion and clears the lead when its passion is removed", () => {
    let state = answerThroughStepEight();
    const originalPassions = state.answers.passions;

    state = travelSelfReducer(state, {
      type: "toggle-passion",
      value: PASSIONS[3]!.name,
    });
    expect(state.answers.passions).toEqual(originalPassions);

    state = travelSelfReducer(state, {
      type: "toggle-passion",
      value: PASSIONS[0]!.name,
    });
    expect(state.answers.lead).toBeNull();
    expect(state.answers.passions).toHaveLength(2);
  });

  it("reopens a completed result without losing any answers", () => {
    const result = travelSelfReducer(answerThroughStepEight(), { type: "next" });
    const edited = travelSelfReducer(result, { type: "edit" });

    expect(edited.stage).toBe("questionnaire");
    expect(edited.step).toBe(1);
    expect(edited.answers).toEqual(result.answers);
  });

  it("marks answer and navigation transitions for persistence", () => {
    const started = travelSelfReducer(INITIAL_TRAVEL_SELF_STATE, { type: "start" });
    const answered = travelSelfReducer(started, {
      type: "answer-axis",
      axis: AXES[0].key,
      value: 1,
    });

    expect(
      shouldPersistTravelSelfTransition(started, answered, {
        type: "answer-axis",
        axis: AXES[0].key,
        value: 1,
      }),
    ).toBe(true);
    expect(
      shouldPersistTravelSelfTransition(answered, INITIAL_TRAVEL_SELF_STATE, {
        type: "reset",
      }),
    ).toBe(false);
  });
});
