import {
  TRAVEL_SELF_MODEL_VERSION,
  TRAVEL_SELF_QUESTIONS,
  TRAVEL_SELF_STORAGE_KEY,
  hasCompleteAnswers,
  isPassionId,
  isValidQuestionAnswer,
  validatePassionSelection,
  type PassionId,
  type PassionSelection,
} from "@/content/travel-self/travel-self-model";

export type TravelSelfStage = "intro" | "question" | "passions" | "reveal";

export interface StoredTravelSelfState {
  readonly version: typeof TRAVEL_SELF_MODEL_VERSION;
  readonly stage: TravelSelfStage;
  readonly questionIndex: number;
  readonly answers: Record<string, string>;
  readonly selectedPassions: PassionId[];
  readonly primary: PassionId | null;
  readonly secondary: PassionId | null;
}

export const EMPTY_TRAVEL_SELF_STATE: StoredTravelSelfState = {
  version: TRAVEL_SELF_MODEL_VERSION,
  stage: "intro",
  questionIndex: 0,
  answers: {},
  selectedPassions: [],
  primary: null,
  secondary: null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStage(value: unknown): value is TravelSelfStage {
  return (
    value === "intro" ||
    value === "question" ||
    value === "passions" ||
    value === "reveal"
  );
}

function validAnswers(value: unknown): Record<string, string> | null {
  if (!isRecord(value)) return null;
  const answers: Record<string, string> = {};

  for (const [questionId, optionId] of Object.entries(value)) {
    if (
      typeof optionId !== "string" ||
      !isValidQuestionAnswer(questionId, optionId)
    ) {
      return null;
    }
    answers[questionId] = optionId;
  }

  return answers;
}

function validSelectedPassions(value: unknown): PassionId[] | null {
  if (!Array.isArray(value) || value.length > 4) return null;
  if (!value.every(isPassionId)) return null;
  const unique = [...new Set(value)];
  return unique.length === value.length ? unique : null;
}

function progressIsConsistent(
  stage: TravelSelfStage,
  questionIndex: number,
  answers: Record<string, string>,
  selection: PassionSelection | null,
): boolean {
  if (stage === "intro") return questionIndex === 0;

  if (stage === "question") {
    return TRAVEL_SELF_QUESTIONS.slice(0, questionIndex).every(
      (question) => answers[question.id],
    );
  }

  if (!hasCompleteAnswers(answers)) return false;
  if (stage === "passions") return true;
  return Boolean(selection && validatePassionSelection(selection).length === 0);
}

export function parseTravelSelfSession(raw: string): StoredTravelSelfState | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return null;
    if (value.version !== TRAVEL_SELF_MODEL_VERSION) return null;
    if (!isStage(value.stage)) return null;
    if (
      !Number.isInteger(value.questionIndex) ||
      typeof value.questionIndex !== "number" ||
      value.questionIndex < 0 ||
      value.questionIndex >= TRAVEL_SELF_QUESTIONS.length
    ) {
      return null;
    }

    const answers = validAnswers(value.answers);
    const selectedPassions = validSelectedPassions(value.selectedPassions);
    if (!answers || !selectedPassions) return null;

    const primary = value.primary === null ? null : value.primary;
    const secondary = value.secondary === null ? null : value.secondary;
    if (primary !== null && !isPassionId(primary)) return null;
    if (secondary !== null && !isPassionId(secondary)) return null;
    if (primary && !selectedPassions.includes(primary)) return null;
    if (secondary && !selectedPassions.includes(secondary)) return null;
    if (primary && secondary === primary) return null;

    const selection = primary
      ? {
          primary,
          secondary,
          also: selectedPassions.filter(
            (passionId) => passionId !== primary && passionId !== secondary,
          ),
        }
      : null;

    if (!progressIsConsistent(value.stage, value.questionIndex, answers, selection)) {
      return null;
    }

    return {
      version: TRAVEL_SELF_MODEL_VERSION,
      stage: value.stage,
      questionIndex: value.questionIndex,
      answers,
      selectedPassions,
      primary,
      secondary,
    };
  } catch {
    return null;
  }
}

export function readTravelSelfSession(
  storage: Pick<Storage, "getItem" | "removeItem">,
): StoredTravelSelfState | null {
  const raw = storage.getItem(TRAVEL_SELF_STORAGE_KEY);
  if (!raw) return null;
  const parsed = parseTravelSelfSession(raw);
  if (!parsed) storage.removeItem(TRAVEL_SELF_STORAGE_KEY);
  return parsed;
}

export function writeTravelSelfSession(
  storage: Pick<Storage, "setItem">,
  state: StoredTravelSelfState,
) {
  storage.setItem(TRAVEL_SELF_STORAGE_KEY, JSON.stringify(state));
}

export function clearTravelSelfSession(
  storage: Pick<Storage, "removeItem">,
) {
  storage.removeItem(TRAVEL_SELF_STORAGE_KEY);
}
