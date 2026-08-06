import { readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ROOT } from "./palette";

/**
 * Guards on the section share cards.
 *
 * Every page already had an Open Graph image before this — but it was the same
 * image on all thirty-six, so a link to Silver & Bone and a link to the home
 * page arrived in a message looking identical. Each section now composes its
 * own card from its own opening photograph.
 *
 * Two things can silently undo that, and neither would fail a build:
 *   - putting `images` back into the openGraph object in generateMetadata,
 *     which beats the file convention and pins every section to one card again
 *   - the font files going missing or being replaced with woff2, which satori
 *     cannot read, so the card would render in a system sans
 */

const OG_ROUTE = path.join(ROOT, "app/(public)/departures/[slug]/opengraph-image.tsx");
const JOURNEY_PAGE = path.join(ROOT, "app/(public)/departures/[slug]/page.tsx");
const OG_FONTS = path.join(ROOT, "tools/typography/og");

describe("the section share cards", () => {
  it("exist, at the ratio every platform crops least badly", () => {
    const source = readFileSync(OG_ROUTE, "utf8");
    expect(source).toContain("export const size = { width: 1200, height: 630 }");
    expect(source).toContain("export const contentType = \"image/png\"");
  });

  it("use the section's own photograph, not a shared asset", () => {
    const source = readFileSync(OG_ROUTE, "utf8");
    expect(source).toContain("getAndeanCaravanGallery");
    expect(source).not.toContain("defaultSocialAssetId");
  });

  it("is not overridden by an images key in the page metadata", () => {
    // The failure mode this exists for: spreading the shared openGraph object
    // back in reintroduces `images`, an explicit images value beats the file
    // convention, and all ten sections silently share one card again.
    const source = readFileSync(JOURNEY_PAGE, "utf8");
    const block = source.slice(source.indexOf("openGraph: {"), source.indexOf("twitter: {"));
    expect(block).not.toContain("...baseMetadata.openGraph");
    expect(block).not.toContain("images");
  });

  it("has fonts satori can actually read", () => {
    // satori supports ttf, otf and woff. It does not support woff2, and it
    // does not support variable fonts, so these are static instances cut from
    // the same master the site ships.
    for (const name of ["fraunces-og-400.ttf", "fraunces-og-500.ttf"]) {
      const file = path.join(OG_FONTS, name);
      const size = statSync(file).size;
      expect(size, `${name} is missing or empty`).toBeGreaterThan(5_000);
      expect(size, `${name} is larger than a static instance should be`).toBeLessThan(60_000);

      // The first four bytes of a TrueType file. A woff2 would start "wOF2".
      const header = readFileSync(file).subarray(0, 4);
      expect([...header], `${name} is not a TrueType file`).toEqual([0x00, 0x01, 0x00, 0x00]);
    }
  });

  it("does not try to draw a glyph Fraunces has never had", () => {
    // The route strings use → between towns and Fraunces has no arrow. On the
    // site that falls back to Georgia; in a share card there is no fallback and
    // it renders as a hole, so the card substitutes en dashes.
    const source = readFileSync(OG_ROUTE, "utf8");
    expect(source).toMatch(/replace\(\/\\s\*→\\s\*\/g/);
  });
});
