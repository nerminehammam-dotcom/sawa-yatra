#!/usr/bin/env node
/**
 * Masters in, web files out. Nothing else.
 *
 * The masters are Nermine's own exports — TIFFs and PNGs between 12 MB and
 * 867 MB, already cropped by her to their own frames. Their aspect ratios run
 * from 0.92 to 1.94, which is the whole reason this script never crops: every
 * one of those frames is a decision that has already been made.
 *
 * WHAT THIS SCRIPT WILL NEVER DO
 *   - write to, move, rename or delete anything inside a master folder
 *   - crop, rotate, straighten or change the aspect ratio of a photograph
 *   - use entropy, face or "smart" cropping of any kind
 *   - convert colour beyond the sRGB profile the web requires
 *
 * WHY 2000px
 *   next.config.ts sets deviceSizes with a maximum of 1920. Next.js will never
 *   request a wider rendition than that, so 2000 on the long edge is the
 *   smallest source that never limits what a visitor can be served. Anything
 *   larger is weight in the repository that no browser will ever see.
 *
 * WHY JPEG AND NOT AVIF/WEBP HERE
 *   next.config.ts already sets formats to avif and webp, so Next negotiates
 *   and generates those per request from whatever source it is given. Shipping
 *   them from this script as well would duplicate the work and the bytes.
 *
 * Usage
 *   node tools/photography/build-derivatives.mjs            # dry run, prints the plan
 *   node tools/photography/build-derivatives.mjs --write    # actually writes
 *   node tools/photography/build-derivatives.mjs --write --force   # ignore the cache
 */

import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

// Normally the repository this file sits in. SAWAYATRA_ROOT exists so the
// script can be run from a machine that has a working sharp binary against a
// checkout that does not — which is how it was tested.
const ROOT = process.env.SAWAYATRA_ROOT
  ? path.resolve(process.env.SAWAYATRA_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MANIFEST = path.join(ROOT, "tools/photography/photographs.json");
const CACHE = path.join(ROOT, "tools/photography/.derivative-cache.json");
const OUT_ROOT = path.join(ROOT, "public/assets/images");

const LONG_EDGE = 2000;
const QUALITY = 82;

// Measured, not assumed. 4:4:4 and 4:2:0 were compared on the four most
// detail-critical photographs on the site — the Atacama star fields, a
// Patagonian sky gradient, a dense Lima street frame and the altiplano.
// SSIM across R, G and B: 0.8693 vs 0.8688 on the star field, 0.9533 vs 0.9530
// on Lima. Mean per-channel error differed by 0.01 of 255. 4:2:0 costs nothing
// visible on photographs and saves 6 to 10 per cent, so it is what ships.
// The comparison crops are in audit/quality-proof/.
const CHROMA = "4:2:0";

const write = process.argv.includes("--write");
const force = process.argv.includes("--force");

/** Fingerprint a master by size and mtime, so an unchanged file is skipped. */
async function fingerprint(file) {
  const s = await stat(file);
  return createHash("sha1").update(`${s.size}:${s.mtimeMs}:${LONG_EDGE}:${QUALITY}`).digest("hex");
}

function bytes(n) {
  return n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
}

async function main() {
  if (!existsSync(MANIFEST)) {
    console.error(`No manifest at ${path.relative(ROOT, MANIFEST)}.`);
    console.error("Run tools/photography/scan-masters.py first to generate one.");
    process.exit(1);
  }

  const photographs = JSON.parse(await readFile(MANIFEST, "utf8"));
  const cache = existsSync(CACHE) && !force
    ? JSON.parse(await readFile(CACHE, "utf8"))
    : {};

  let written = 0, skipped = 0, missing = 0, before = 0, after = 0;
  const nextCache = {};

  for (const photo of photographs) {
    const master = path.join(ROOT, photo.master);
    const out = path.join(OUT_ROOT, photo.out);

    if (!existsSync(master)) {
      console.warn(`  MISSING MASTER  ${photo.master}`);
      missing += 1;
      continue;
    }

    const fp = await fingerprint(master);
    nextCache[photo.out] = fp;

    if (cache[photo.out] === fp && existsSync(out)) {
      skipped += 1;
      continue;
    }

    const image = sharp(master, { limitInputPixels: false, unlimited: true });
    const meta = await image.metadata();
    const landscape = meta.width >= meta.height;

    // The only geometry decision in this file: scale the long edge, never crop.
    const pipeline = image
      .rotate() // honour EXIF orientation only
      .resize({
        width: landscape ? LONG_EDGE : null,
        height: landscape ? null : LONG_EDGE,
        withoutEnlargement: true,
        fit: "inside",
        kernel: "lanczos3",
      })
      .toColourspace("srgb")
      .jpeg({
        quality: QUALITY,
        chromaSubsampling: CHROMA,
        mozjpeg: true,
        progressive: true,
      });

    const buffer = await pipeline.toBuffer();
    const oldSize = existsSync(out) ? (await stat(out)).size : 0;
    before += oldSize;
    after += buffer.length;

    console.log(
      `  ${photo.out}\n      ${meta.width}×${meta.height} ${bytes((await stat(master)).size)}` +
      `  ->  ${bytes(buffer.length)}${oldSize ? `  (was ${bytes(oldSize)})` : ""}`,
    );

    if (write) {
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, buffer);
      written += 1;
    }
  }

  if (write) await writeFile(CACHE, JSON.stringify(nextCache, null, 2));

  console.log("");
  console.log(`  masters in manifest : ${photographs.length}`);
  console.log(`  regenerated         : ${write ? written : `${photographs.length - skipped - missing} (dry run)`}`);
  console.log(`  unchanged, skipped  : ${skipped}`);
  if (missing) console.log(`  MISSING MASTERS     : ${missing}`);
  if (before) {
    console.log(`  weight before       : ${bytes(before)}`);
    console.log(`  weight after        : ${bytes(after)}`);
    console.log(`  saved               : ${bytes(before - after)} (${Math.round((1 - after / before) * 100)}%)`);
  }
  if (!write) {
    console.log("\n  Dry run. Nothing written. Add --write when you are happy.");
  } else if (written) {
    console.log("\n  The shipped files have changed size, so the layout data is now stale.");
    console.log("  Run these two, in order:");
    console.log("      python3 tools/photography/scan-masters.py");
    console.log("      python3 tools/photography/write-plates.py");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
