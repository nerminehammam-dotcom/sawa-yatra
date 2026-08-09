#!/usr/bin/env python3
"""
Cut the shipped Fraunces files down to what the site actually uses.

The masters in tools/typography/masters/ are the full four-axis Latin builds,
270,736 bytes for the pair. They are the source and are never modified. This
script writes the files that ship.

WHAT IS REMOVED, AND THE EVIDENCE FOR EACH

  SOFT and WONK, from the roman only.
      Both axes appear in exactly two CSS rules — .introYou on Travel Self and
      .homeHeroTurn on the home page — and both rules also set
      `font-style: italic`, so both are served by the italic file. The roman
      file has therefore been carrying two axes that nothing ever moves off
      their default. This single change is 39,000 bytes, the largest saving
      here by a wide margin.

  SOFT above 40, from the italic.
      The only value used is 40. Keeping 0 to 40 preserves it exactly and drops
      the rest of the axis.

  Characters outside the set below.
      The built HTML renders 94 distinct characters. The set kept here is far
      wider — full Latin-1 plus typographic punctuation — so Spanish,
      Portuguese and French place names not yet written will still render.

WHAT IS NOT REMOVED

  wght keeps its whole 100 to 900 range, and this was a deliberate reversal.
      Narrowing it to 300:700 saved a further 8,712 bytes, but pinning a range
      forces the instancer to renormalise, and that pushed the worst outline
      movement from 2.2 font units to 4.3. It also put <strong>, <b> and <th>
      — bold by user-agent default, unstyled in fourteen component files — one
      decision away from silently changing weight. Eight kilobytes is not worth
      either. The weights actually declared in the stylesheets are 300, 400,
      500 and 600.

  opsz stays at its full 9 to 144. Narrowing it to 12 to 144 was measured and
  made the files *larger*, because the instancer has to rebuild the delta sets
  around a new default. Optical sizing is also the single reason to use this
  typeface, so it keeps its whole range.

  All OpenType layout features are kept (`--layout-features='*'`), so kerning
  and ligatures behave exactly as before.

Usage
  python3 tools/typography/build-fonts.py            # build and verify
  python3 tools/typography/build-fonts.py --check    # verify only, no writes
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MASTERS = os.path.join(ROOT, "tools/typography/masters")
SHIPPED = os.path.join(ROOT, "public/assets/fonts")

# Kept deliberately wider than what the site renders today. Every range here is
# either in use or is a language the route will plausibly need.
UNICODES = ",".join([
    "U+0020-007E",                      # ASCII printable
    "U+00A0,U+00A1,U+00BF",             # nbsp, inverted punctuation
    "U+00A9,U+00AE,U+2122",             # (c) (r) (tm)
    "U+00AA,U+00BA,U+00B0",             # ordinals and degree
    "U+00B7,U+2022",                    # middle dot, bullet
    "U+00C0-00FF",                      # Latin-1 accented letters
    "U+0152-0153",                      # OE oe
    "U+2013,U+2014",                    # en and em dash
    "U+2018,U+2019,U+201C,U+201D",      # curly quotes
    "U+2026",                           # ellipsis
    "U+2039,U+203A",                    # single angle quotes
    "U+2044",                           # fraction slash
    "U+20AC,U+00A3,U+0024",             # euro, sterling, dollar
    "U+2212",                           # minus
])

BUILDS = [
    {
        "master": "fraunces-latin-full-normal.woff2",
        "out": "fraunces-normal.woff2",
        "axes": ["SOFT=0", "WONK=0"],
    },
    {
        "master": "fraunces-latin-full-italic.woff2",
        "out": "fraunces-italic.woff2",
        "axes": ["SOFT=0:40"],
    },
]

# The variable-font locations the site can actually reach. Every glyph is
# compared at each of these, in both files, before anything is accepted.
ROMAN_INSTANCES = [
    {"opsz": o, "wght": w}
    for o in (9, 24, 48, 96, 144)
    for w in (300, 400, 500, 600, 700)
]
ITALIC_INSTANCES = ROMAN_INSTANCES + [
    {"opsz": 144, "wght": w, "SOFT": 40, "WONK": 1} for w in (300, 400, 500)
]


def run(args: list[str]) -> None:
    result = subprocess.run(args, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        raise SystemExit(f"failed: {' '.join(args[:3])}")


def build(master: str, out: str, axes: list[str], directory: str) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        pinned = os.path.join(tmp, "pinned.ttf")
        run([sys.executable, "-m", "fontTools.varLib.instancer",
             "-o", pinned, os.path.join(MASTERS, master), *axes])
        target = os.path.join(directory, out)
        run([sys.executable, "-m", "fontTools.subset", pinned,
             f"--output-file={target}", "--flavor=woff2",
             f"--unicodes={UNICODES}", "--layout-features=*", "--name-IDs=*"])
    return target


def outlines(font, instance: dict[str, float]) -> dict[str, tuple]:
    """Every glyph's pen path at one variable-font location."""
    # Decomposing, not plain recording: an accented letter is a composite in
    # one file and may be flattened in the other, and comparing a component
    # reference against contours would report a difference that is not one.
    from fontTools.pens.recordingPen import DecomposingRecordingPen

    def normalise(value):
        # Pen operands are points, but addComponent also records a glyph name
        # and a transform, so this has to cope with strings and nested tuples.
        if isinstance(value, float):
            return round(value, 2)
        if isinstance(value, (list, tuple)):
            return tuple(normalise(item) for item in value)
        return value

    glyphs = font.getGlyphSet(location=instance)
    result = {}
    for name in glyphs.keys():
        pen = DecomposingRecordingPen(glyphs)
        glyphs[name].draw(pen)
        result[name] = normalise(pen.value)
    return result


# Pinning an axis makes the instancer rebuild the delta sets around a new
# default, and that arithmetic rounds. The resulting outlines are not
# bit-identical to the master; they are off by a fraction of a font unit.
#
# 2000 units make one em. The tolerance is three of them — 0.15% of an em,
# which is 0.22 of a pixel on the largest type the site sets, 144px, and 0.024
# of a pixel on 16px body copy. Both are below the rendering grid.
#
# The measured worst case is 2.21 units on the italic, and it comes entirely
# from narrowing SOFT. The roman, which only has axes removed rather than
# narrowed, moves 0.21 units — which is nothing at all.
#
# The number is not the point; the reported worst case is. The script prints
# the largest movement it actually found, so if a future change starts pushing
# outlines around properly it will be visible in the output long before it
# reaches this threshold.
UNITS_PER_EM = 2000
TOLERANCE_UNITS = 3.0


def deviation(before, after) -> float:
    """Largest coordinate difference between two recorded pen paths."""
    if len(before) != len(after):
        return float("inf")
    worst = 0.0
    for (op_a, args_a), (op_b, args_b) in zip(before, after):
        if op_a != op_b:
            return float("inf")
        flat_a = [v for arg in args_a for v in (arg if isinstance(arg, tuple) else (arg,))]
        flat_b = [v for arg in args_b for v in (arg if isinstance(arg, tuple) else (arg,))]
        if len(flat_a) != len(flat_b):
            return float("inf")
        for x, y in zip(flat_a, flat_b):
            if isinstance(x, (int, float)) and isinstance(y, (int, float)):
                worst = max(worst, abs(x - y))
            elif x != y:
                return float("inf")
    return worst


def verify(master: str, shipped: str, instances: list[dict]) -> tuple[list[str], float]:
    """Compare every shared glyph at every reachable instance."""
    from fontTools.ttLib import TTFont

    problems: list[str] = []
    a, b = TTFont(os.path.join(MASTERS, master)), TTFont(shipped)

    kept = set(b.getBestCmap().values())
    worst = 0.0
    for instance in instances:
        before, after = outlines(a, instance), outlines(b, instance)
        for name in sorted(kept & set(before) & set(after)):
            moved = deviation(before[name], after[name])
            worst = max(worst, moved)
            if moved > TOLERANCE_UNITS:
                problems.append(
                    f"{os.path.basename(shipped)}: glyph {name} moved "
                    f"{moved:.2f} units at {instance}"
                )
                if len(problems) > 8:
                    return problems, worst
    return problems, worst


def coverage(master: str, shipped: str) -> list[str]:
    """
    Characters the master could render and the shipped file no longer can.

    Anything the master never had is not this script's problem — the arrows in
    "Find out →" have always fallen back to Georgia, and dropping them here
    would not be a regression, it would be the status quo.
    """
    from fontTools.ttLib import TTFont

    had = {chr(c) for c in TTFont(os.path.join(MASTERS, master)).getBestCmap()}
    have = {chr(c) for c in TTFont(shipped).getBestCmap()}

    lost: set[str] = set()
    for directory in ("content", "app", "components"):
        for base, _dirs, files in os.walk(os.path.join(ROOT, directory)):
            for name in files:
                if not name.endswith((".ts", ".tsx")):
                    continue
                text = open(os.path.join(base, name), encoding="utf8").read()
                lost |= {c for c in set(text) if c in had and c not in have}
    return sorted(lost)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    directory = tempfile.mkdtemp() if args.check else SHIPPED
    os.makedirs(directory, exist_ok=True)

    total_before = total_after = 0
    problems: list[str] = []
    worst_overall = 0.0

    for spec in BUILDS:
        target = build(spec["master"], spec["out"], spec["axes"], directory)
        before = os.path.getsize(os.path.join(MASTERS, spec["master"]))
        after = os.path.getsize(target)
        total_before += before
        total_after += after

        instances = ITALIC_INSTANCES if "italic" in spec["out"] else ROMAN_INSTANCES
        found, worst = verify(spec["master"], target, instances)
        problems += found
        worst_overall = max(worst_overall, worst)

        lost = coverage(spec["master"], target)
        if lost:
            problems.append(
                f"{spec['out']} drops characters the source used: "
                + " ".join(f"{c!r} (U+{ord(c):04X})" for c in lost)
            )

        print(f"  {spec['out']}")
        print(f"      {before:,} -> {after:,} bytes  ({(1 - after / before) * 100:.0f}% smaller)")
        print(f"      pinned: {' '.join(spec['axes'])}")
        print(f"      {len(instances)} instances compared glyph by glyph")
        print(f"      worst outline movement: {worst:.2f} font units")

    print()
    print(f"  total {total_before:,} -> {total_after:,} bytes "
          f"({(1 - total_after / total_before) * 100:.0f}% smaller)")

    if problems:
        print("\n  FAILED")
        for problem in problems:
            print(f"      {problem}")
        return 1

    at_display = worst_overall / UNITS_PER_EM * 144
    at_body = worst_overall / UNITS_PER_EM * 16
    print(f"  no glyph moved more than {worst_overall:.2f} of {UNITS_PER_EM} units per em —")
    print(f"  {at_display:.3f}px at 144px display, {at_body:.4f}px at 16px body.")
    print("  Nothing the site uses lost a character it had.")
    if args.check:
        print(f"\n  --check: built into {directory}, nothing in public/ was touched.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
