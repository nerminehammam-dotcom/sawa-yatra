#!/usr/bin/env python3
"""
Generate content/photograph-plates.ts from tools/photography/photographs.json.

The manifest is the source of truth for the photography: which master produced
which file, its shipped dimensions, and where it was taken. The components need
two of those things at render time — the true dimensions, so the browser can
reserve the right space and the photograph is never cropped, and the caption.

Dimensions are what make the no-crop layout possible at all. Without them
next/image has to run in `fill` mode, which requires object-fit, which is a
crop. This is the file that lets the galleries stop cutting into her frames.

A photograph with no place yet is simply absent from the caption map. The
component then renders the plate with no caption rather than inventing one.

Usage:  python3 tools/photography/write-plates.py
"""

from __future__ import annotations

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MANIFEST = os.path.join(ROOT, "tools/photography/photographs.json")
OUTPUT = os.path.join(ROOT, "content/photograph-plates.ts")

HEADER = '''/**
 * GENERATED FILE — do not edit by hand.
 *
 * Written by tools/photography/write-plates.py from
 * tools/photography/photographs.json. Edit the manifest, then re-run the script.
 *
 * `width` and `height` are the real dimensions of the shipped file. They exist
 * so that a photograph can be laid out at its own shape: the galleries fix a
 * common height and let the width follow, which is how a print gallery hangs
 * work, and it means nothing is ever cropped by a stylesheet.
 *
 * `caption` is the short human line that appears under the plate. It is
 * deliberately not the same string as the alt text, which is longer and
 * describes the photograph for someone who cannot see it. A photograph whose
 * place has not been confirmed has no entry here and renders without a caption
 * rather than with a guess.
 */

export interface PhotographPlate {
  readonly width: number;
  readonly height: number;
  readonly caption?: string;
}

export const PHOTOGRAPH_CREDIT =
  "Every photograph on this site was made on this route.";

export const photographPlates: Readonly<Record<string, PhotographPlate>> = {
'''

FOOTER = '''};

export function plateFor(src: string): PhotographPlate | undefined {
  return photographPlates[src.replace(/^\\/assets\\/images\\//, "")];
}
'''


def main() -> int:
    if not os.path.exists(MANIFEST):
        print(f"No manifest at {MANIFEST}. Run scan-masters.py first.")
        return 1

    rows = json.load(open(MANIFEST))
    lines = []
    captioned = 0

    for row in sorted(rows, key=lambda r: r["out"]):
        if not row.get("width") or not row.get("height"):
            continue
        key = json.dumps(row["out"])
        parts = [f'width: {row["width"]}', f'height: {row["height"]}']
        if row.get("place"):
            caption = f'{row["place"]} · {row["year"]}'
            parts.append(f"caption: {json.dumps(caption)}")
            captioned += 1
        lines.append(f'  {key}: {{ {", ".join(parts)} }},')

    with open(OUTPUT, "w") as handle:
        handle.write(HEADER)
        handle.write("\n".join(lines))
        handle.write("\n")
        handle.write(FOOTER)

    print(f"  plates written  : {len(lines)}")
    print(f"  with a caption  : {captioned}")
    print(f"  awaiting a place: {len(lines) - captioned}")
    print(f"  -> {os.path.relpath(OUTPUT, ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
