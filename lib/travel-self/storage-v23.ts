import {
  INITIAL_TRAVEL_SELF_STATE,
  hasCompletedPriorSteps,
  isAxis,
  isPassionName,
  isPole,
  isQuestionnaireComplete,
  isTimeTogether,
  isTravelSelfStep,
  type PassionName,
  type TravelSelfState,
} from "@/lib/travel-self/state-machine";
import type { Axis, Pole } from "@/content/travel-self/travel-self-model";

export const TRAVEL_SELF_STORAGE_VERSION = 3 as const;
export const TRAVEL_SELF_STORAGE_KEY = "sawayatra.travelSelf.v2.3";

interface StoredTravelSelfEnvelope {
  readonly version: typeof TRAVEL_SELF_STORAGE_VERSION;
  readonly savedAt: number;
  readonly state: TravelSelfState;
}

export interface TravelSelfStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface TravelSelfLoadResult {
  readonly state: TravelSelfState;
  readonly storageAvailable: boolean;
}

let memoryFallback: TravelSelfState | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePositions(value: unknown): Partial<Record<Axis, Pole>> | null {
  if (!isRecord(value)) return null;
  const positions: Partial<Record<Axis, Pole>> = {};

  for (const [axis, pole] of Object.entries(value)) {
    if (!isAxis(axis) || !isPole(pole)) return null;
    positions[axis] = pole;
  }

  return positions;
}

function parsePassions(value: unknown): PassionName[] | null {
  if (!Array.isArray(value) || value.length > 3) return null;
  if (!value.every(isPassionName)) return null;
  if (new Set(value).size !== value.length) return null;
  return [...value];
}

function parseState(value: unknown): TravelSelfState | null {
  if (!isRecord(value)) return null;
  if (
    value.stage !== "intro" &&
    value.stage !== "questionnaire" &&
    value.stage !== "result"
  ) {
    return null;
  }
  if (!isTravelSelfStep(value.step) || !isRecord(value.answers)) return null;

  const positions = parsePositions(value.answers.positions);
  const passions = parsePassions(value.answers.passions);
  if (!positions || !passions) return null;

  const timeTogether =
    value.answers.timeTogether === null
      ? null
      : isTimeTogether(value.answers.timeTogether)
        ? value.answers.timeTogether
        : undefined;
  if (timeTogether === undefined) return null;

  const lead =
    value.answers.lead === null
      ? null
      : isPassionName(value.answers.lead)
        ? value.answers.lead
        : undefined;
  if (lead === undefined || (lead !== null && !passions.includes(lead))) return null;

  const state: TravelSelfState = {
    stage: value.stage,
    step: value.step,
    answers: { positions, timeTogether, passions, lead },
  };

  if (state.stage === "questionnaire" && !hasCompletedPriorSteps(state)) return null;
  if (state.stage === "result" && !isQuestionnaireComplete(state)) return null;
  return state;
}

export function parseStoredTravelSelf(raw: string | null): TravelSelfState | null {
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== TRAVEL_SELF_STORAGE_VERSION) return null;
    if (typeof value.savedAt !== "number" || !Number.isFinite(value.savedAt)) return null;
    return parseState(value.state);
  } catch {
    return null;
  }
}

function storageWorks(storage: TravelSelfStorage | null | undefined): storage is TravelSelfStorage {
  if (!storage) return false;
  const probeKey = `${TRAVEL_SELF_STORAGE_KEY}.probe`;

  try {
    storage.setItem(probeKey, probeKey);
    storage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export function loadTravelSelfState(
  storage?: TravelSelfStorage | null,
): TravelSelfLoadResult {
  if (!storageWorks(storage)) {
    return {
      state: memoryFallback ?? INITIAL_TRAVEL_SELF_STATE,
      storageAvailable: false,
    };
  }

  try {
    const parsed = parseStoredTravelSelf(storage.getItem(TRAVEL_SELF_STORAGE_KEY));
    if (parsed) memoryFallback = parsed;
    return {
      state: parsed ?? memoryFallback ?? INITIAL_TRAVEL_SELF_STATE,
      storageAvailable: true,
    };
  } catch {
    return {
      state: memoryFallback ?? INITIAL_TRAVEL_SELF_STATE,
      storageAvailable: false,
    };
  }
}

export function saveTravelSelfState(
  state: TravelSelfState,
  storage?: TravelSelfStorage | null,
  now = Date.now(),
): boolean {
  memoryFallback = state;
  if (!storageWorks(storage)) return false;

  const envelope: StoredTravelSelfEnvelope = {
    version: TRAVEL_SELF_STORAGE_VERSION,
    savedAt: now,
    state,
  };

  try {
    storage.setItem(TRAVEL_SELF_STORAGE_KEY, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}

export function clearTravelSelfState(storage?: TravelSelfStorage | null): boolean {
  memoryFallback = null;
  if (!storageWorks(storage)) return false;

  try {
    storage.removeItem(TRAVEL_SELF_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function resetTravelSelfStorageForTests(): void {
  memoryFallback = null;
}
