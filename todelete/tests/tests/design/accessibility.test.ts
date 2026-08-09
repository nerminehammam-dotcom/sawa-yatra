import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ROOT } from "./palette";

/**
 * Guards on the two accessibility contracts that live in app/globals.css: one
 * focus ring for everything, and one reduced-motion block for everything.
 *
 * Both are written with `:where()` or `*`, which is deliberate — a component
 * should be able to override them without reaching for !important. The price of
 * that is that a component can also silently destroy them, and nothing in a
 * build would notice. These tests notice.
 *
 * What they cannot do is tell you the site is accessible. They check that the
 * contracts are intact and that nothing declares its way out of them. Whether a
 * ring is actually visible against a photograph, whether a reading order makes
 * sense, whether the alt text is true — those need a browser and a person.
 */

const GLOBALS = path.join(ROOT, "app/globals.css");

function stylesheets(): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".css")) found.push(full);
    }
  };
  walk(path.join(ROOT, "app"));
  walk(path.join(ROOT, "components"));
  return found;
}

interface Rule {
  file: string;
  selector: string;
  body: string;
}

function rules(): Rule[] {
  const all: Rule[] = [];
  for (const file of stylesheets()) {
    const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const block of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const [, selector, body] = block;
      if (!selector || !body) continue;
      all.push({
        file: path.relative(ROOT, file),
        selector: selector.trim().replace(/\s+/g, " "),
        body,
      });
    }
  }
  return all;
}

const REMOVES_OUTLINE = /(?:^|;)\s*outline\s*:\s*(none|0)\s*(?:;|$)/;

describe("the focus ring contract", () => {
  const globals = readFileSync(GLOBALS, "utf8");

  it("is declared once, globally, at zero specificity", () => {
    expect(globals).toContain(":focus-visible {");
    expect(globals).toContain("outline: 3px solid var(--focus-ring, currentColor)");
    // :where() is what lets a component override without !important.
    expect(globals).toMatch(/:where\([\s\S]*?\):focus-visible/);
  });

  it("covers the elements the site actually makes focusable", () => {
    // Roving-tabindex widgets in the Travel Self questionnaire, and skip
    // targets, are focusable without being a link or a button.
    for (const selector of [
      "a[href]",
      "button",
      "input",
      "select",
      "textarea",
      "summary",
      '[tabindex]:not([tabindex="-1"])',
    ]) {
      expect(globals, `${selector} is not covered by the global focus rule`).toContain(selector);
    }
  });

  it("is never destroyed by a component", () => {
    const offenders = rules()
      .filter((rule) => rule.selector.includes(":focus-visible") && REMOVES_OUTLINE.test(rule.body))
      .map((rule) => `${rule.file} — ${rule.selector}`);

    expect(
      offenders,
      "These rules remove the outline on :focus-visible, which is the state a\n" +
        "keyboard user is in. If a component needs a different ring, set\n" +
        "--focus-ring or override outline-color, never outline: none.\n\n  " +
        offenders.join("\n  "),
    ).toEqual([]);
  });

  it("is only suppressed on :focus, and only where something replaces it", () => {
    // `outline: none` on plain :focus is legitimate and used deliberately here:
    // headings given tabIndex={-1} are focused in code to move a screen reader,
    // and a ring on a heading nobody tabbed to is noise. It is only acceptable
    // when the selector cannot be reached by tabbing, or when a :focus-visible
    // rule for the same selector puts the ring back.
    const all = rules();
    const suppressions = all.filter(
      (rule) =>
        rule.selector.includes(":focus") &&
        !rule.selector.includes(":focus-visible") &&
        REMOVES_OUTLINE.test(rule.body),
    );

    const unexplained = suppressions
      .filter((rule) => {
        const base = rule.selector.replace(/:focus\b/g, "");
        const restored = all.some(
          (other) =>
            other.file === rule.file &&
            other.selector.includes(":focus-visible") &&
            other.selector.replace(/:focus-visible\b/g, "") === base,
        );
        // A heading is only ever focused in code, so it needs no ring at all.
        const isHeading = /\bh[1-6]\b/.test(base);
        return !restored && !isHeading;
      })
      .map((rule) => `${rule.file} — ${rule.selector}`);

    expect(
      unexplained,
      "These rules suppress the focus outline on an element a keyboard user can\n" +
        "reach, and nothing puts it back. Either add a matching :focus-visible\n" +
        "rule, or delete the suppression.\n\n  " +
        unexplained.join("\n  "),
    ).toEqual([]);
  });
});

describe("the reduced-motion contract", () => {
  const globals = readFileSync(GLOBALS, "utf8");

  it("is declared globally and cannot be overridden by a component", () => {
    const block = globals.slice(globals.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(block).toContain("animation-duration: 0.01ms !important");
    expect(block).toContain("transition-duration: 0.01ms !important");
    expect(block).toContain("scroll-behavior: auto !important");
    // The universal selector, so a component cannot opt out by being specific.
    expect(block).toMatch(/\*,\s*\*::before,\s*\*::after/);
  });
});

describe("small screens", () => {
  it("has no grid track that cannot fit a 320px phone", () => {
    // minmax(min(24rem, 100%), …) is the safe form: the track keeps its
    // intended minimum where there is room and collapses to the container
    // below that. A bare minmax(24rem, …) forces a horizontal scrollbar on an
    // iPhone SE. Twenty-one of these were fixed on 6 August 2026.
    const offenders: string[] = [];
    for (const rule of rules()) {
      for (const match of rule.body.matchAll(/minmax\(\s*(?!min\()(\d+(?:\.\d+)?)(rem|px)/g)) {
        const px = Number.parseFloat(match[1]!) * (match[2] === "rem" ? 16 : 1);
        if (px > 320) {
          offenders.push(`${rule.file} — ${rule.selector} — minmax(${match[1]}${match[2]}, …)`);
        }
      }
    }

    expect(
      offenders,
      "These grid tracks demand more width than a small phone has, so the page\n" +
        "will scroll sideways. Wrap the minimum: minmax(min(24rem, 100%), …).\n\n  " +
        offenders.join("\n  "),
    ).toEqual([]);
  });

  it("has no fixed width wider than a phone outside the map canvas", () => {
    const offenders: string[] = [];
    for (const rule of rules()) {
      if (rule.selector.includes("mapCanvas")) continue;
      for (const match of rule.body.matchAll(
        /(?:^|;)\s*(min-width|width)\s*:\s*(\d+(?:\.\d+)?)(rem|px)\s*(?:;|$)/g,
      )) {
        const px = Number.parseFloat(match[2]!) * (match[3] === "rem" ? 16 : 1);
        if (px > 320) offenders.push(`${rule.file} — ${rule.selector} — ${match[1]}: ${match[2]}${match[3]}`);
      }
    }

    expect(
      offenders,
      "A fixed width wider than 320px will scroll a small phone sideways.\n" +
        "The only exception is .mapCanvas, which is panned inside a clipped\n" +
        "container on purpose.\n\n  " +
        offenders.join("\n  "),
    ).toEqual([]);
  });
});
