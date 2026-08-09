import { describe, expect, it } from "vitest";

import { AA_LARGE, AA_NORMAL, usedPairs, type BaseColour } from "./palette";

/**
 * The rule the comment in styles/tokens.css asks for, enforced.
 *
 * pink-on-olive at 1.88 shipped to production once because nothing recorded
 * that it was illegal. Recording it in a comment was the first fix. This is the
 * second: any rule that paints itself a colour on a background now has to clear
 * a threshold, or the build fails.
 *
 * WHAT THIS CAN AND CANNOT SEE — stated plainly, because a check whose limits
 * are hidden is worse than no check.
 *
 *   It sees   a single CSS rule that sets both `color` and `background` from
 *             palette tokens. That is the shape of the bug that shipped.
 *   It misses text that inherits its colour from an ancestor and sits on a
 *             background painted somewhere else. Resolving that needs the
 *             cascade, which needs a browser, which this suite does not have.
 *
 * So a green run here is not a claim that the whole site passes WCAG. It is a
 * claim that no stylesheet declares an illegal pairing on itself.
 */

/**
 * Pairings that clear 3:1 but not 4.5:1, and are allowed anyway because the
 * text is genuinely large.
 *
 * Adding to this list should feel like a decision. Each entry needs the reason
 * and the size, because "large text" is 24px, or 18.66px at 700 weight, and
 * nothing smaller.
 */
const LARGE_TEXT_ONLY: ReadonlyArray<{
  foreground: BaseColour;
  background: BaseColour;
  because: string;
}> = [
  // Deliberately empty. Nothing on the site currently needs it — the two
  // large-text-only pairings in live use, signal-text on pink and signal-text
  // on sun, are set on the Travel Self heading through separate rules and so
  // are invisible to this scan. If a future rule needs one, add it here with
  // the font size that justifies it rather than lowering the threshold.
];

function allowed(foreground: BaseColour, background: BaseColour) {
  return LARGE_TEXT_ONLY.find(
    (entry) => entry.foreground === foreground && entry.background === background,
  );
}

describe("colour pairings declared in the stylesheets", () => {
  const pairs = usedPairs();

  it("finds pairs to check at all", () => {
    // A guard on the scanner itself. If a refactor moved the stylesheets or
    // changed how colours are written, this test would otherwise pass by
    // examining nothing at all.
    expect(pairs.length).toBeGreaterThan(50);
  });

  it("never declares a pairing that fails both thresholds", () => {
    const failures = pairs
      .filter((pair) => pair.ratio < AA_LARGE)
      .map(
        (pair) =>
          `${pair.ratio.toFixed(2)}:1  ${pair.foreground} on ${pair.background}  ` +
          `(${pair.colourToken} on ${pair.backgroundToken})\n      ${pair.file}\n      ${pair.selector}`,
      );

    expect(
      failures,
      "These rules set a colour pairing that fails WCAG at any text size.\n" +
        "Check the table at the top of styles/tokens.css before choosing a replacement.\n\n  " +
        failures.join("\n\n  "),
    ).toEqual([]);
  });

  it("only uses a large-text-only pairing where that has been argued for", () => {
    const unjustified = pairs
      .filter((pair) => pair.ratio >= AA_LARGE && pair.ratio < AA_NORMAL)
      .filter((pair) => !allowed(pair.foreground, pair.background))
      .map(
        (pair) =>
          `${pair.ratio.toFixed(2)}:1  ${pair.foreground} on ${pair.background}\n` +
          `      ${pair.file}\n      ${pair.selector}`,
      );

    expect(
      unjustified,
      "These pairings clear 3:1 but not 4.5:1, so they are only legal on text of\n" +
        "24px, or 18.66px at 700 weight. Either pick a stronger pairing, or add an\n" +
        "entry to LARGE_TEXT_ONLY in this file stating the size that justifies it.\n\n  " +
        unjustified.join("\n\n  "),
    ).toEqual([]);
  });

  it("does not carry stale entries in the allowlist", () => {
    // An exemption that no longer describes anything real is a small lie in the
    // codebase. If a rule gets fixed, its exemption should go with it.
    const live = new Set(pairs.map((pair) => `${pair.foreground}/${pair.background}`));
    const stale = LARGE_TEXT_ONLY.filter(
      (entry) => !live.has(`${entry.foreground}/${entry.background}`),
    ).map((entry) => `${entry.foreground} on ${entry.background} — ${entry.because}`);

    expect(stale, `no rule uses these any more, so remove them:\n  ${stale.join("\n  ")}`).toEqual(
      [],
    );
  });
});
