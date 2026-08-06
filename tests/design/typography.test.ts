import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ROOT } from "./palette";

/**
 * Guards on the subsetted fonts.
 *
 * The shipped files no longer contain everything Fraunces can do — the roman
 * has had the SOFT and WONK axes removed, the italic has SOFT capped at 40, and
 * both are cut down to a fixed character set. Each of those is safe today and
 * each becomes unsafe the moment someone writes a rule or a place name that
 * needs what was removed.
 *
 * These tests are the tripwires. They cannot open a woff2 — that needs a font
 * library this suite does not have — so they check the two things that can be
 * checked from source: that no stylesheet asks the roman for an axis it no
 * longer has, and that no content string uses a character outside the subset.
 *
 * Regenerating after a change: python3 tools/typography/build-fonts.py
 */

const FONT_DIRECTORY = path.join(ROOT, "public/assets/fonts");

/** Mirrors UNICODES in tools/typography/build-fonts.py. Keep the two in step. */
const SUBSET = [
  [0x0020, 0x007e],
  [0x00a0, 0x00a0], [0x00a1, 0x00a1], [0x00bf, 0x00bf],
  [0x00a9, 0x00a9], [0x00ae, 0x00ae], [0x2122, 0x2122],
  [0x00aa, 0x00aa], [0x00ba, 0x00ba], [0x00b0, 0x00b0],
  [0x00b7, 0x00b7], [0x2022, 0x2022],
  [0x00c0, 0x00ff],
  [0x0152, 0x0153],
  [0x2013, 0x2014],
  [0x2018, 0x2019], [0x201c, 0x201d],
  [0x2026, 0x2026],
  [0x2039, 0x203a],
  [0x2044, 0x2044],
  [0x20ac, 0x20ac], [0x00a3, 0x00a3],
  [0x2212, 0x2212],
] as const;

/**
 * Characters the site deliberately renders in the fallback face. The arrows
 * were never in Fraunces — the master has no glyph for them either — so they
 * have always been Georgia, and subsetting did not change that.
 */
const FALLBACK_BY_DESIGN = new Set(["→", "←", "↔", "↗", "↓", "↑", "─", "✓", "×"]);

function inSubset(character: string): boolean {
  const code = character.codePointAt(0) ?? 0;
  return SUBSET.some(([low, high]) => code >= low && code <= high);
}

function walk(directory: string, extensions: string[]): string[] {
  const found: string[] = [];
  const step = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) step(full);
      else if (extensions.some((extension) => entry.endsWith(extension))) found.push(full);
    }
  };
  step(directory);
  return found;
}

describe("the subsetted Fraunces files", () => {
  it("ships both faces, and neither has grown back to the master size", () => {
    const sizes = Object.fromEntries(
      readdirSync(FONT_DIRECTORY).map((name) => [
        name,
        statSync(path.join(FONT_DIRECTORY, name)).size,
      ]),
    );

    expect(Object.keys(sizes).sort()).toEqual([
      "fraunces-italic.woff2",
      "fraunces-normal.woff2",
    ]);

    // The masters are 121,016 and 149,720. If a shipped file ever approaches
    // those, the subsetting step has been skipped or reverted.
    expect(sizes["fraunces-normal.woff2"]).toBeLessThan(80_000);
    expect(sizes["fraunces-italic.woff2"]).toBeLessThan(140_000);
    expect(
      sizes["fraunces-normal.woff2"]! + sizes["fraunces-italic.woff2"]!,
    ).toBeLessThan(200_000);
  });

  it("never asks the roman face for an axis it no longer carries", () => {
    // SOFT and WONK exist only in the italic file. A rule that sets either
    // without also setting font-style: italic is asking for a swash the roman
    // cannot draw, and will silently get nothing.
    const offenders: string[] = [];

    for (const file of walk(path.join(ROOT, "app"), [".css"]).concat(
      walk(path.join(ROOT, "components"), [".css"]),
    )) {
      const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      for (const block of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const [, selector, body] = block;
        if (!selector || !body) continue;
        if (!/"(SOFT|WONK)"/.test(body)) continue;
        if (!/font-style\s*:\s*italic/.test(body)) {
          offenders.push(`${path.relative(ROOT, file)} — ${selector.trim()}`);
        }
      }
    }

    expect(
      offenders,
      "These rules set SOFT or WONK without font-style: italic. Those axes were\n" +
        "removed from the roman file, so the rule will do nothing. Either add\n" +
        "font-style: italic, or restore the axes in tools/typography/build-fonts.py.\n\n  " +
        offenders.join("\n  "),
    ).toEqual([]);
  });

  it("never writes a character the shipped fonts cannot draw", () => {
    const missing = new Map<string, string[]>();

    for (const file of walk(path.join(ROOT, "content"), [".ts"])) {
      const source = readFileSync(file, "utf8");
      // Only the contents of quoted strings; identifiers and comments are not
      // rendered to anybody.
      for (const literal of source.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`/g)) {
        for (const character of literal[1] ?? literal[2] ?? "") {
          if (character.codePointAt(0)! < 32) continue;
          if (inSubset(character) || FALLBACK_BY_DESIGN.has(character)) continue;
          const where = missing.get(character) ?? [];
          const relative = path.relative(ROOT, file);
          if (!where.includes(relative)) where.push(relative);
          missing.set(character, where);
        }
      }
    }

    const report = [...missing].map(
      ([character, files]) =>
        `${character} (U+${character.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}) in ${files.join(", ")}`,
    );

    expect(
      report,
      "These characters are in the content but outside the font subset, so they\n" +
        "will render in Georgia and look wrong beside everything around them.\n" +
        "Either replace them, or add the codepoint to UNICODES in\n" +
        "tools/typography/build-fonts.py and to SUBSET in this file, then rerun\n" +
        "the build script.\n\n  " +
        report.join("\n  "),
    ).toEqual([]);
  });

  it("still preloads both faces under their real names", () => {
    // A preload pointing at a filename that no longer exists is worse than no
    // preload: the browser fetches nothing and the console fills with warnings.
    const layout = readFileSync(path.join(ROOT, "app/layout.tsx"), "utf8");
    const globals = readFileSync(path.join(ROOT, "app/globals.css"), "utf8");

    for (const name of ["fraunces-normal.woff2", "fraunces-italic.woff2"]) {
      expect(layout, `${name} is not preloaded`).toContain(`/assets/fonts/${name}`);
      expect(globals, `${name} has no @font-face`).toContain(`/assets/fonts/${name}`);
    }
    // Comments stripped first: the note above the @font-face rules explains why
    // the -variations keyword was dropped, and naming it is not using it.
    const declarations = globals.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(declarations).not.toContain("woff2-variations");
    expect(layout).not.toContain("fraunces-latin-full");
  });
});
