import { AXIS_IDS, type AxisPosition, type AxisPositions } from "@/content/travel-self/axes";
import { PASSION_IDS, type PassionId } from "@/content/travel-self/passions";

export const TRAVEL_SELF_STORAGE_KEY = "sawayatra.travelSelf";
export const TRAVEL_SELF_STORAGE_VERSION = 2 as const;
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const TIME_TOGETHER_OPTIONS = [
  "Most of the day",
  "Some of it",
  "Meals and evenings",
] as const;
export type TimeTogether = (typeof TIME_TOGETHER_OPTIONS)[number];

export interface StoredTravelSelf {
  readonly version: typeof TRAVEL_SELF_STORAGE_VERSION;
  readonly positions: AxisPositions;
  readonly timeTogether: TimeTogether;
  readonly passions: readonly [PassionId, PassionId, PassionId];
  readonly lead: PassionId;
  readonly updatedAt: number;
  readonly annualDismissedAt?: number;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

let memoryFallback: StoredTravelSelf | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAxisPosition(value: unknown): value is AxisPosition {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 6;
}

function isPassionId(value: unknown): value is PassionId {
  return typeof value === "string" && PASSION_IDS.includes(value as PassionId);
}

export function parseStoredTravelSelf(raw: string | null): StoredTravelSelf | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== TRAVEL_SELF_STORAGE_VERSION) return null;
    if (!isRecord(value.positions)) return null;
    const storedPositions = value.positions;
    if (!AXIS_IDS.every((axis) => isAxisPosition(storedPositions[axis]))) return null;
    if (!TIME_TOGETHER_OPTIONS.includes(value.timeTogether as TimeTogether)) return null;
    if (!Array.isArray(value.passions) || value.passions.length !== 3) return null;
    if (!value.passions.every(isPassionId) || new Set(value.passions).size !== 3) return null;
    if (!isPassionId(value.lead) || !value.passions.includes(value.lead)) return null;
    if (typeof value.updatedAt !== "number" || !Number.isFinite(value.updatedAt)) return null;
    if (value.annualDismissedAt !== undefined &&
      (typeof value.annualDismissedAt !== "number" || !Number.isFinite(value.annualDismissedAt))) return null;

    return {
      version: TRAVEL_SELF_STORAGE_VERSION,
      positions: value.positions as unknown as AxisPositions,
      timeTogether: value.timeTogether as TimeTogether,
      passions: value.passions as unknown as [PassionId, PassionId, PassionId],
      lead: value.lead,
      updatedAt: value.updatedAt,
      ...(value.annualDismissedAt === undefined ? {} : { annualDismissedAt: value.annualDismissedAt }),
    };
  } catch {
    return null;
  }
}

export function readStoredTravelSelf(storage?: StorageLike | null): StoredTravelSelf | null {
  if (storage) {
    try {
      const parsed = parseStoredTravelSelf(storage.getItem(TRAVEL_SELF_STORAGE_KEY));
      if (parsed) memoryFallback = parsed;
      return parsed ?? memoryFallback;
    } catch {
      return memoryFallback;
    }
  }
  return memoryFallback;
}

export function writeStoredTravelSelf(value: StoredTravelSelf, storage?: StorageLike | null): void {
  memoryFallback = value;
  if (!storage) return;
  try {
    storage.setItem(TRAVEL_SELF_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // The in-memory copy keeps the current page usable when storage is blocked.
  }
}

export function annualPromptDue(value: StoredTravelSelf, now = Date.now()): boolean {
  if (now - value.updatedAt < ONE_YEAR_MS) return false;
  if (value.annualDismissedAt && now - value.annualDismissedAt < ONE_YEAR_MS) return false;
  return true;
}

export function resetTravelSelfMemoryForTests(): void {
  memoryFallback = null;
}
