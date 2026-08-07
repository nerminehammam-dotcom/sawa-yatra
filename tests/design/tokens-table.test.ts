import { describe, expect, it } from "vitest";

import {
  AA_LARGE,
  AA_NORMAL,
  BASE_COLOURS,
  contrast,
  documentedMatrix,
  markFor,
  paletteByHex,
  resolvedTokens,
  round2,
} from "./palette";

/**
 * The contrast table in styles/tokens.css is the most useful thing in this
 * codebase and it was, until now, a comment. A comment drifts: someone nudges
 * a hex value, the table stays as it was, and the next person trusts a number
 * that stopped being true months ago.
 *
 * These tests make the table a contract in both directions. It cannot be wrong
 * about the colours, and the colours cannot change without the table changing
 * with them.
 */
describe("the documented contrast table", () => {
  it("describes exactly the colours the brief defines", () => {
    const tokens = resolvedTokens();
    for (const colour of BASE_COLOURS) {
      expect(tokens.get(`--${colour}`), `--${colour} must be a literal hex`).toMatch(
        /^#[0-9a-f]{6}$/i,
      );
    }

    // Nine distinct colours. If two tokens ever resolve to the same hex the
    // system has quietly become an eight-colour system with a spare name.
    const distinct = new Set(BASE_COLOURS.map((c) => tokens.get(`--${c}`)!.toLowerCase()));
    expect(distinct.size).toBe(BASE_COLOURS.length);
  });

  it("is complete: every pair of colours appears in it", () => {
    const cells = documentedMatrix();
    const seen = new Set(cells.map((cell) => `${cell.row}/${cell.column}`));

    for (const row of BASE_COLOURS) {
      for (const column of BASE_COLOURS) {
        if (row === column) continue;
        expect(seen.has(`${row}/${column}`), `${row} on ${column} is missing from the table`).toBe(
          true,
        );
      }
    }
    // 8 x 8 minus the 8 diagonal "--" cells.
    expect(cells).toHaveLength(BASE_COLOURS.length * (BASE_COLOURS.length - 1));
  });

  it("states the true ratio and the true verdict for every pair", () => {
    const tokens = resolvedTokens();
    const wrong: string[] = [];

    for (const cell of documentedMatrix()) {
      const actual = round2(
        contrast(tokens.get(`--${cell.row}`)!, tokens.get(`--${cell.column}`)!),
      );
      const mark = markFor(actual);

      // 0.011 rather than 0.01, so a value sitting exactly on a rounding
      // boundary does not fail on floating-point noise.
      if (Math.abs(actual - cell.ratio) > 0.011 || mark !== cell.mark) {
        wrong.push(
          `${cell.row} on ${cell.column}: table says ${cell.ratio}${cell.mark}, ` +
            `the colours say ${actual}${mark}`,
        );
      }
    }

    expect(
      wrong,
      `styles/tokens.css is out of date. Correct these cells:\n  ${wrong.join("\n  ")}`,
    ).toEqual([]);
  });

  it("is symmetrical, because contrast is", () => {
    const byPair = new Map(
      documentedMatrix().map((cell) => [`${cell.row}/${cell.column}`, cell.ratio]),
    );
    for (const [key, ratio] of byPair) {
      const [row, column] = key.split("/");
      expect(byPair.get(`${column}/${row}`), `${key} and its mirror disagree`).toBe(ratio);
    }
  });

  it("still records the two pairings that keep being reached for", () => {
    // Both are large-text-only, both are in live use on the Travel Self
    // opening, and both are one bad decision away from being used on body copy.
    const cells = documentedMatrix();
    const find = (row: string, column: string) =>
      cells.find((cell) => cell.row === row && cell.column === column);

    expect(find("signal-text", "pink")).toMatchObject({ ratio: 3.51, mark: "L" });
    expect(find("signal-text", "sun")).toMatchObject({ ratio: 3.37, mark: "L" });
  });

  it("pins down exactly which colours may carry body text on which", () => {
    // The whole system, stated as the one thing a designer needs at the moment
    // of choosing: for each colour, what may it legally sit on at normal size.
    // Written out in full rather than as a rule of thumb, because the rule of
    // thumb in the comment was subtly wrong — clay is safe against nothing at
    // all, and paper takes signal-text as well as ink.
    const tokens = resolvedTokens();
    const safeAgainst = (colour: string) =>
      BASE_COLOURS.filter(
        (other) =>
          other !== colour &&
          contrast(tokens.get(`--${colour}`)!, tokens.get(`--${other}`)!) >= AA_NORMAL,
      );

    expect(Object.fromEntries(BASE_COLOURS.map((c) => [c, safeAgainst(c)]))).toEqual({
      paper: ["ink", "signal-text"],
      ink: ["paper", "signal", "sun", "olive", "pink", "blue"],
      signal: ["ink"],
      "signal-text": ["paper"],
      clay: [],
      sun: ["ink"],
      olive: ["ink"],
      pink: ["ink"],
      blue: ["ink"],
    });

    // The two traps this table exists to stop. Both look plausible.
    expect(round2(contrast(tokens.get("--ink")!, tokens.get("--signal-text")!))).toBeLessThan(
      AA_LARGE,
    );
    expect(round2(contrast(tokens.get("--ink")!, tokens.get("--clay")!))).toBeLessThan(AA_NORMAL);
  });

  it("keeps the status colours legible on paper", () => {
    // tokens.css states that only ink, signal-text and clay clear 3:1 against
    // paper, and that this is why `warning` shares ink with `info`.
    const tokens = resolvedTokens();
    const paper = tokens.get("--paper")!;
    const clearing = BASE_COLOURS.filter(
      (colour) => contrast(tokens.get(`--${colour}`)!, paper) >= AA_LARGE,
    );
    expect(clearing.sort()).toEqual(["clay", "ink", "signal-text"]);
  });

  it("maps every alias back to one of the nine", () => {
    // --terracotta, --dusty-blue, --brick and friends exist for compatibility.
    // Each must still land on a colour in the system, not drift off on its own.
    const byHex = paletteByHex();
    const strays: string[] = [];
    for (const [name, hex] of resolvedTokens()) {
      if (!byHex.has(hex.toLowerCase())) strays.push(`${name}: ${hex}`);
    }
    expect(strays, `these colour tokens are outside the seven-colour system:\n  ${strays.join("\n  ")}`)
      .toEqual([]);
  });
});
