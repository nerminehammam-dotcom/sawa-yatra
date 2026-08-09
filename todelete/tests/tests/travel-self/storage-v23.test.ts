import { beforeEach, describe, expect, it } from "vitest";

import { AXES } from "@/content/travel-self/travel-self-model";
import {
  INITIAL_TRAVEL_SELF_STATE,
  travelSelfReducer,
} from "@/lib/travel-self/state-machine";
import {
  TRAVEL_SELF_STORAGE_KEY,
  clearTravelSelfState,
  loadTravelSelfState,
  parseStoredTravelSelf,
  resetTravelSelfStorageForTests,
  saveTravelSelfState,
  type TravelSelfStorage,
} from "@/lib/travel-self/storage-v23";

class MemoryStorage implements TravelSelfStorage {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

class BlockedStorage extends MemoryStorage {
  override setItem(): void {
    throw new Error("blocked");
  }
}

describe("Travel Self v2.3 browser storage", () => {
  beforeEach(() => resetTravelSelfStorageForTests());

  it("saves and restores the current questionnaire step and answers", () => {
    const storage = new MemoryStorage();
    let state = travelSelfReducer(INITIAL_TRAVEL_SELF_STATE, { type: "start" });
    state = travelSelfReducer(state, {
      type: "answer-axis",
      axis: AXES[0].key,
      value: 2,
    });
    state = travelSelfReducer(state, { type: "next" });

    expect(saveTravelSelfState(state, storage, 123)).toBe(true);
    expect(loadTravelSelfState(storage)).toEqual({
      state,
      storageAvailable: true,
    });
  });

  it("keeps the current visit usable when browser storage is unavailable", () => {
    const storage = new BlockedStorage();
    const state = travelSelfReducer(INITIAL_TRAVEL_SELF_STATE, { type: "start" });

    expect(saveTravelSelfState(state, storage, 123)).toBe(false);
    expect(loadTravelSelfState(storage)).toEqual({
      state,
      storageAvailable: false,
    });
  });

  it("rejects malformed records instead of restoring impossible progress", () => {
    const raw = JSON.stringify({
      version: 3,
      savedAt: 123,
      state: {
        stage: "result",
        step: 8,
        answers: {
          positions: {},
          timeTogether: null,
          passions: [],
          lead: null,
        },
      },
    });

    expect(parseStoredTravelSelf(raw)).toBeNull();
  });

  it("clears both the durable record and in-memory fallback", () => {
    const storage = new MemoryStorage();
    const state = travelSelfReducer(INITIAL_TRAVEL_SELF_STATE, { type: "start" });
    saveTravelSelfState(state, storage, 123);

    expect(clearTravelSelfState(storage)).toBe(true);
    expect(storage.getItem(TRAVEL_SELF_STORAGE_KEY)).toBeNull();
    expect(loadTravelSelfState(storage).state).toEqual(INITIAL_TRAVEL_SELF_STATE);
  });
});
