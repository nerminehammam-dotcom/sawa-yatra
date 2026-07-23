import { webcrypto } from "node:crypto";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitMockForm } from "@/lib/forms/client";

const validSignInInterest = {
  email: "traveller@example.com",
};

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear() {
      entries.clear();
    },
    getItem(key) {
      return entries.get(key) ?? null;
    },
    key(index) {
      return Array.from(entries.keys())[index] ?? null;
    },
    removeItem(key) {
      entries.delete(key);
    },
    setItem(key, value) {
      entries.set(key, value);
    },
  };
}

describe("mock form browser client", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createMemoryStorage(),
    });
    vi.stubGlobal("crypto", webcrypto);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("stores no raw form value and detects a duplicate before a second request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        mode: "development-mock",
        kind: "sign-in-interest",
        sent: false,
        storedOnServer: false,
        message: "Development mock received the member-access interest.",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const firstResult = await submitMockForm(
      "sign-in-interest",
      validSignInInterest,
    );
    const storedReceipt = window.localStorage.getItem(
      "sawayatra:r1:mock-form-receipts",
    );
    const secondResult = await submitMockForm(
      "sign-in-interest",
      validSignInInterest,
    );

    expect(firstResult.status).toBe("success");
    expect(storedReceipt).not.toContain(validSignInInterest.email);
    expect(secondResult.status).toBe("duplicate");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns a visible network-error state without writing a receipt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await submitMockForm(
      "sign-in-interest",
      validSignInInterest,
    );

    expect(result.status).toBe("network-error");
    expect(window.localStorage.length).toBe(0);
  });
});
