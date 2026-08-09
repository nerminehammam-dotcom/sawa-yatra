import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ROOT } from "./palette";

/**
 * Guards on what the browser is asked to download.
 *
 * `sizes` is the single most consequential attribute on an image and the
 * easiest to get quietly wrong, because a wrong value costs nothing visible —
 * the picture still looks right, it is just three times heavier than it needed
 * to be.
 *
 * The specific trap here: every content container on the site is capped at
 * --content-max, 1440px. A `sizes` of "58vw" is correct up to that width and
 * wrong above it, because the element stops growing and the request does not.
 * On a 2560px monitor the browser asks for 1485px and is served the 1920
 * rendition for an element that is 835px wide.
 *
 * Measured on the real files: 1920 AVIF is around 280 KB where 1024 is 97 KB.
 */

const CONTENT_MAX = 1440;

function components(): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".tsx")) found.push(full);
    }
  };
  walk(path.join(ROOT, "app"));
  walk(path.join(ROOT, "components"));
  return found;
}

interface SizesUse {
  file: string;
  value: string;
}

function sizesAttributes(): SizesUse[] {
  const uses: SizesUse[] = [];
  for (const file of components()) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/sizes=(?:\{)?"([^"]+)"/g)) {
      uses.push({ file: path.relative(ROOT, file), value: match[1]! });
    }
  }
  return uses;
}

describe("image sizes attributes", () => {
  const uses = sizesAttributes();

  it("finds attributes to check", () => {
    expect(uses.length).toBeGreaterThan(15);
  });

  it("never leaves a viewport-relative width uncapped above the container maximum", () => {
    const offenders = uses
      .filter((use) => {
        const last = use.value.split(",").pop()!.trim();
        // A bare NNvw as the final value means "at any width above the last
        // media condition", which above 1440px asks for more than the element
        // can ever be. 100vw is exempt: those images are genuinely full bleed.
        const bare = /^(\d+(?:\.\d+)?)vw$/.exec(last);
        if (!bare) return false;
        if (bare[1] === "100") return false;
        // Also exempt when the preceding conditions are min-width based, where
        // the trailing value is the small-screen fallback rather than the
        // large-screen one.
        return !/\(min-width:/.test(use.value);
      })
      .map((use) => `${use.file} — ${use.value}`);

    expect(
      offenders,
      `Every content container is capped at ${CONTENT_MAX}px, so a trailing\n` +
        "viewport-relative width over-fetches on any wider screen. End the value\n" +
        `with a fixed length instead: "(max-width: ${CONTENT_MAX}px) 58vw, 835px".\n\n  ` +
        offenders.join("\n  "),
    ).toEqual([]);
  });

  it("caps at a width the container can actually reach", () => {
    // A cap larger than the container is not a cap. Catches a copy-paste that
    // keeps the vw figure but pastes the wrong pixel value beside it.
    const wrong: string[] = [];
    for (const use of uses) {
      const match = /\(max-width:\s*1440px\)\s*(\d+(?:\.\d+)?)vw,\s*(\d+)px\s*$/.exec(use.value);
      if (!match) continue;
      const expected = Math.round((CONTENT_MAX * Number.parseFloat(match[1]!)) / 100);
      const declared = Number.parseInt(match[2]!, 10);
      if (Math.abs(declared - expected) > 2) {
        wrong.push(`${use.file} — ${match[1]}vw of ${CONTENT_MAX} is ${expected}px, not ${declared}px`);
      }
    }
    expect(wrong, wrong.join("\n  ")).toEqual([]);
  });
});

describe("continuous integration", () => {
  it("exists, and runs the checks that catch the defects found here", () => {
    // Five illegal colour pairings, seventeen wrong alt strings and twenty-one
    // grid tracks that would scroll a phone sideways were all found by these
    // checks. A suite nobody runs is a suite that stops being true.
    const workflow = readFileSync(path.join(ROOT, ".github/workflows/ci.yml"), "utf8");
    for (const step of ["npm run lint", "npm run typecheck", "npm run test:unit", "npm run build"]) {
      expect(workflow, `CI does not run ${step}`).toContain(step);
    }
    expect(workflow).toContain("tools/audit/check-site.py");
    expect(workflow).toContain("node-version-file: .nvmrc");
  });

  it("pins one Node version rather than three", () => {
    const nvmrc = readFileSync(path.join(ROOT, ".nvmrc"), "utf8").trim();
    expect(nvmrc).toMatch(/^\d+$/);

    const engines = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8")).engines.node;
    const major = Number.parseInt(nvmrc, 10);
    const [, floor] = /">=?(\d+)/.exec(`"${engines}`) ?? [];
    expect(
      Number.parseInt(floor ?? "0", 10),
      `.nvmrc says ${major} but package.json engines says ${engines}`,
    ).toBeLessThanOrEqual(major);
  });
});
