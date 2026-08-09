/**
 * Area A tests — token scaffolding (build command §3.A; spec §13, §11.2).
 *
 * NOTE: vitest.config.ts was removed in the repo cleanup and has not been
 * recreated (build command §0.3 forbids restoring deleted files without
 * sign-off). These tests are written and type-checked but cannot execute
 * until a fresh test config is approved. The same guarantees are enforced
 * today by `node scripts/guard-spec-tokens.mjs`, which runs standalone.
 */
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  SPEC_TOKENS,
  SPEC_TOKEN_MARKER_PATTERN,
  SPEC_TOKEN_NAMES,
  specToken,
  unfilledSpecTokens,
} from "@/content/spec-tokens";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("§13 register", () => {
  it("defines all 34 tokens of the placeholder register", () => {
    expect(SPEC_TOKEN_NAMES).toHaveLength(34);
    for (const name of SPEC_TOKEN_NAMES) {
      expect(SPEC_TOKENS[name]).toBeDefined();
      expect(SPEC_TOKENS[name].owner).toBeTruthy();
      expect(SPEC_TOKENS[name].spec).toMatch(/§/);
    }
  });

  it("never stores a numeric value — signed-off display strings or null only", () => {
    for (const name of SPEC_TOKEN_NAMES) {
      const value: string | null = SPEC_TOKENS[name].value;
      expect(typeof value === "string" || value === null).toBe(true);
    }
  });
});

describe("specToken() — §1.1 unfilled behaviour", () => {
  it("renders a visible {{TOKEN}} marker in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    for (const name of unfilledSpecTokens()) {
      const rendered = specToken(name);
      expect(rendered).toBe(`{{${name}}}`);
      expect(rendered).toMatch(SPEC_TOKEN_MARKER_PATTERN);
    }
  });

  it("throws in production so an unfilled token fails the build", () => {
    vi.stubEnv("NODE_ENV", "production");
    for (const name of unfilledSpecTokens()) {
      expect(() => specToken(name)).toThrowError(/Unfilled spec token/);
    }
  });
});

describe("static guard (numeric literals, stray markers, pending-review isolation)", () => {
  it("scripts/guard-spec-tokens.mjs passes", () => {
    // The guard is the enforcement; this test pins it into the suite so a
    // future violation fails `npm test`, not only the standalone script.
    expect(() =>
      execFileSync(
        process.execPath,
        [join(__dirname, "..", "..", "scripts", "guard-spec-tokens.mjs")],
        { stdio: "pipe" },
      ),
    ).not.toThrow();
  });
});
