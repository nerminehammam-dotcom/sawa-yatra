import {
  AXES,
  PASSIONS,
  TIME_TOGETHER,
  type Axis,
  type Pole,
} from "@/content/travel-self/travel-self-model";

export type TravelSelfStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type TravelSelfStage = "intro" | "questionnaire" | "result";
export type TimeTogether = (typeof TIME_TOGETHER)[number];
export type PassionName = (typeof PASSIONS)[number]["name"];

export interface TravelSelfAnswers {
  readonly positions: Partial<Record<Axis, Pole>>;
  readonly timeTogether: TimeTogether | null;
  readonly passions: readonly PassionName[];
  readonly lead: PassionName | null;
}

export interface TravelSelfState {
  readonly stage: TravelSelfStage;
  readonly step: TravelSelfStep;
  readonly answers: TravelSelfAnswers;
}

export type TravelSelfAction =
  | { readonly type: "start" }
  | { readonly type: "answer-axis"; readonly axis: Axis; readonly value: Pole }
  | { readonly type: "answer-time-together"; readonly value: TimeTogether }
  | { readonly type: "toggle-passion"; readonly value: PassionName }
  | { readonly type: "answer-lead"; readonly value: PassionName }
  | { readonly type: "next" }
  | { readonly type: "back" }
  | { readonly type: "edit" }
  | { readonly type: "reset" };

export const INITIAL_TRAVEL_SELF_STATE: TravelSelfState = {
  stage: "intro",
  step: 1,
  answers: {
    positions: {},
    timeTogether: null,
    passions: [],
    lead: null,
  },
};

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const POLES = [1, 2, 3, 4, 5, 6] as const;
const AXIS_KEYS = AXES.map((axis) => axis.key) as readonly Axis[];
const PASSION_NAMES = PASSIONS.map((passion) => passion.name);

export function isTravelSelfStep(value: unknown): value is TravelSelfStep {
  return typeof value === "number" && STEPS.includes(value as TravelSelfStep);
}

export function isPole(value: unknown): value is Pole {
  return typeof value === "number" && POLES.includes(value as Pole);
}

export function isAxis(value: unknown): value is Axis {
  return typeof value === "string" && AXIS_KEYS.includes(value as Axis);
}

export function isTimeTogether(value: unknown): value is TimeTogether {
  return typeof value === "string" && TIME_TOGETHER.includes(value as TimeTogether);
}

export function isPassionName(value: unknown): value is PassionName {
  return typeof value === "string" && PASSION_NAMES.includes(value);
}

function axisForStep(step: TravelSelfStep): Axis | null {
  if (step > 5) return null;
  return AXES[step - 1]?.key ?? null;
}

export function isStepAnswered(state: TravelSelfState, step = state.step): boolean {
  const axis = axisForStep(step);
  if (axis) return state.answers.positions[axis] !== undefined;
  if (step === 6) return state.answers.timeTogether !== null;
  if (step === 7) return state.answers.passions.length === 3;
  return Boolean(
    state.answers.lead && state.answers.passions.includes(state.answers.lead),
  );
}

export function isQuestionnaireComplete(state: TravelSelfState): boolean {
  return STEPS.every((step) => isStepAnswered(state, step));
}

export function hasCompletedPriorSteps(
  state: TravelSelfState,
  step = state.step,
): boolean {
  return STEPS.filter((candidate) => candidate < step).every((candidate) =>
    isStepAnswered(state, candidate),
  );
}

function withAnswers(
  state: TravelSelfState,
  answers: TravelSelfAnswers,
): TravelSelfState {
  return { ...state, answers };
}

export function travelSelfReducer(
  state: TravelSelfState,
  action: TravelSelfAction,
): TravelSelfState {
  switch (action.type) {
    case "start":
      return state.stage === "intro"
        ? { ...state, stage: "questionnaire" }
        : state;

    case "answer-axis":
      return withAnswers(state, {
        ...state.answers,
        positions: {
          ...state.answers.positions,
          [action.axis]: action.value,
        },
      });

    case "answer-time-together":
      return withAnswers(state, {
        ...state.answers,
        timeTogether: action.value,
      });

    case "toggle-passion": {
      const selected = state.answers.passions.includes(action.value);
      if (!selected && state.answers.passions.length === 3) return state;

      const passions = selected
        ? state.answers.passions.filter((passion) => passion !== action.value)
        : [...state.answers.passions, action.value];
      const lead =
        state.answers.lead && passions.includes(state.answers.lead)
          ? state.answers.lead
          : null;

      return withAnswers(state, { ...state.answers, passions, lead });
    }

    case "answer-lead":
      if (!state.answers.passions.includes(action.value)) return state;
      return withAnswers(state, { ...state.answers, lead: action.value });

    case "next":
      if (state.stage !== "questionnaire" || !isStepAnswered(state)) return state;
      if (state.step === 8) {
        return isQuestionnaireComplete(state)
          ? { ...state, stage: "result" }
          : state;
      }
      return {
        ...state,
        step: (state.step + 1) as TravelSelfStep,
      };

    case "back":
      if (state.stage !== "questionnaire") return state;
      if (state.step === 1) return { ...state, stage: "intro" };
      return {
        ...state,
        step: (state.step - 1) as TravelSelfStep,
      };

    case "edit":
      return state.stage === "result"
        ? { ...state, stage: "questionnaire", step: 1 }
        : state;

    case "reset":
      return INITIAL_TRAVEL_SELF_STATE;
  }
}

export function shouldPersistTravelSelfTransition(
  previous: TravelSelfState,
  next: TravelSelfState,
  action: TravelSelfAction,
): boolean {
  if (previous === next || action.type === "reset") return false;
  return next.stage !== "intro" || action.type === "back";
}
