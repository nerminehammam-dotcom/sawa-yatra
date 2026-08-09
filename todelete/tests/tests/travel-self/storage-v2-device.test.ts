import { beforeEach, describe, expect, it, vi } from "vitest";

import { type AxisPositions } from "@/content/travel-self/axes";
import {
  ONE_YEAR_MS,
  TRAVEL_SELF_STORAGE_KEY,
  TRAVEL_SELF_STORAGE_VERSION,
  annualPromptDue,
  parseStoredTravelSelf,
  readStoredTravelSelf,
  resetTravelSelfMemoryForTests,
  writeStoredTravelSelf,
  type StoredTravelSelf,
} from "@/lib/travel-self/storage";

const positions: AxisPositions = { pace: 2, planning: 5, social: 2, rhythm: 5, comfort: 4 };
const record: StoredTravelSelf = {
  version: TRAVEL_SELF_STORAGE_VERSION,
  positions,
  timeTogether: "Some of it",
  passions: ["design", "culture", "water"],
  lead: "design",
  updatedAt: 1_000,
};

describe("device-held Travel Self storage", () => {
  beforeEach(() => resetTravelSelfMemoryForTests());

  it("stores raw answers only under one key", () => {
    const storage = { getItem: vi.fn(), setItem: vi.fn() };
    writeStoredTravelSelf(record, storage);
    expect(storage.setItem).toHaveBeenCalledOnce();
    expect(storage.setItem.mock.calls[0]?.[0]).toBe(TRAVEL_SELF_STORAGE_KEY);
    expect(JSON.parse(storage.setItem.mock.calls[0]?.[1] as string)).toEqual(record);
  });

  it("degrades to memory when localStorage throws", () => {
    const blocked = {
      getItem: vi.fn(() => { throw new Error("blocked"); }),
      setItem: vi.fn(() => { throw new Error("blocked"); }),
    };
    expect(() => writeStoredTravelSelf(record, blocked)).not.toThrow();
    expect(readStoredTravelSelf(blocked)).toEqual(record);
  });

  it("rejects malformed, duplicated, or derived snapshots", () => {
    expect(parseStoredTravelSelf("not json")).toBeNull();
    expect(parseStoredTravelSelf(JSON.stringify({ ...record, passions: ["design", "design", "water"] }))).toBeNull();
    expect(parseStoredTravelSelf(JSON.stringify({ ...record, positions: { ...positions, pace: 7 } }))).toBeNull();
  });

  it("shows and suppresses the annual prompt by the settled intervals", () => {
    expect(annualPromptDue(record, record.updatedAt + ONE_YEAR_MS - 1)).toBe(false);
    expect(annualPromptDue(record, record.updatedAt + ONE_YEAR_MS + 1)).toBe(true);
    const dismissed = { ...record, annualDismissedAt: record.updatedAt + ONE_YEAR_MS };
    expect(annualPromptDue(dismissed, dismissed.annualDismissedAt + ONE_YEAR_MS - 1)).toBe(false);
  });
});
