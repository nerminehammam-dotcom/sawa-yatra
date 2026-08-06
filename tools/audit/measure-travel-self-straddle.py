#!/usr/bin/env python3
"""
Measure the Travel Self headline where it crosses onto the painting.

The composition is a flat paper panel on the left and the artwork flush to the
right, with the headline set across the seam. The left half of every line sits
on paper, so contrast there is fixed and safe; the question is only what the
right half lands on.

This does not screenshot. It reproduces the layout arithmetic from
travel-self.module.css against the real 2400x1600 artwork, then samples the
exact rectangle each line occupies inside the image and reports the contrast of
the candidate ink colours against the *lightest* and *darkest* 5% of those
pixels. Both tails matter: a dark cactus and a bright cloud fail in opposite
directions.

Glyph advances come from the shipped Fraunces files via the variable-font axes
the CSS actually asks for. Pair kerning is not applied, so line widths are
within about a percent.

Usage:  python3 tools/audit/measure-travel-self-straddle.py [--scan]
"""

from __future__ import annotations

import argparse
import os
import warnings

from PIL import Image
from fontTools.ttLib import TTFont

warnings.filterwarnings("ignore", category=DeprecationWarning)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ART = os.path.join(ROOT, "public/assets/images/travel-self/intro.jpg")
ROMAN = os.path.join(ROOT, "public/assets/fonts/fraunces-latin-full-normal.woff2")
ITALIC = os.path.join(ROOT, "public/assets/fonts/fraunces-latin-full-italic.woff2")

# --- values taken from app/(public)/travel-self/travel-self.module.css ------
PANEL = 0.24            # grid-template-columns: 24% 76%
TITLE_LEFT = 0.05       # inset-inline-start on .introTitle
TITLE_TOP = 0.20        # inset-block-start on .introTitle
LINE_HEIGHT = 0.86
INDENT_EM = 0.9         # padding-inline-start on the second line
TRACKING = -0.025       # letter-spacing
FONT_CAP_PX = 115.2     # clamp(...) upper bound, 7.2rem
FONT_VW = 0.074         # clamp(...) preferred, 7.4vw

SIGNAL_TEXT = "#b03a0c"
INK = "#27231f"
LARGE_TEXT_THRESHOLD = 3.0

CONTAINER_MAX_PX = 1344  # max-width: 84rem
VIEWPORTS = [1280, 1440, 1512, 1728, 1920]


def srgb_to_linear(channel: float) -> float:
    channel /= 255
    return channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4


def relative_luminance(rgb) -> float:
    r, g, b = (srgb_to_linear(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b) -> float:
    la, lb = relative_luminance(a), relative_luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def hex_to_rgb(value: str):
    value = value.lstrip("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def advance(path: str, text: str, size_px: float, wght: float, opsz: float) -> float:
    font = TTFont(path)
    units = font["head"].unitsPerEm
    glyphs = font.getGlyphSet(location={"opsz": opsz, "wght": wght})
    cmap = font.getBestCmap()
    total = 0.0
    for character in text:
        name = cmap.get(ord(character))
        if name is not None:
            total += glyphs[name].width
    return total / units * size_px + TRACKING * size_px * len(text)


def line_boxes(viewport: int, title_top: float):
    """Returns (image_pixel_boxes, geometry) for the two headline lines."""
    container = min(CONTAINER_MAX_PX, viewport)
    art_left = container * PANEL
    art_width = container - art_left
    art_height = art_width * 1600 / 2400
    scale = 2400 / art_width  # container px -> artwork px

    size = min(FONT_CAP_PX, viewport * FONT_VW)
    left = container * TITLE_LEFT
    top = art_height * title_top

    lines = [
        ("Which one", ROMAN, 400, 0.0),
        ("are you?", ROMAN, 400, INDENT_EM),
    ]

    boxes = []
    y = top
    for text, path, weight, indent in lines:
        width = advance(path, text, size, weight, 144)
        x0 = left + indent * size
        x1 = x0 + width
        # Cap height to baseline is what actually carries the colour; the em box
        # overstates it. 0.72em below the line-box top is close enough.
        y0 = y + 0.10 * size
        y1 = y + 0.82 * size
        y += LINE_HEIGHT * size

        # Clip to the part that lands on the artwork.
        if x1 <= art_left:
            continue
        boxes.append({
            "text": text,
            "art_box": (
                max(0.0, (x0 - art_left) * scale),
                y0 * scale,
                (x1 - art_left) * scale,
                y1 * scale,
            ),
            "crosses_at": (art_left - x0) / (x1 - x0),
        })
    return boxes, {"container": container, "size": size, "art_height": art_height}


def sample(image: Image.Image, box):
    x0, y0, x1, y1 = (round(v) for v in box)
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(image.width, x1), min(image.height, y1)
    if x1 <= x0 or y1 <= y0:
        return None
    pixels = list(image.crop((x0, y0, x1, y1)).getdata())
    ordered = sorted(pixels, key=relative_luminance)
    cut = max(1, len(ordered) // 20)
    darkest = ordered[:cut]
    lightest = ordered[-cut:]
    mean = lambda group: tuple(
        round(sum(p[i] for p in group) / len(group)) for i in range(3)
    )
    return mean(darkest), mean(lightest)


def evaluate(image: Image.Image, title_top: float):
    worst = {SIGNAL_TEXT: 99.0, INK: 99.0}
    rows = []
    for viewport in VIEWPORTS:
        boxes, geometry = line_boxes(viewport, title_top)
        for box in boxes:
            result = sample(image, box["art_box"])
            if result is None:
                continue
            dark, light = result
            for colour in (SIGNAL_TEXT, INK):
                ratios = (
                    contrast(hex_to_rgb(colour), dark),
                    contrast(hex_to_rgb(colour), light),
                )
                worst[colour] = min(worst[colour], min(ratios))
            rows.append((viewport, box, geometry, dark, light))
    return worst, rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--scan", action="store_true")
    args = parser.parse_args()

    image = Image.open(ART).convert("RGB")

    if args.scan:
        print(f"{'top':>6}  {'signal-text':>12}  {'ink':>8}")
        for step in range(8, 52, 2):
            top = step / 100
            worst, _ = evaluate(image, top)
            print(f"{top:>6.2f}  {worst[SIGNAL_TEXT]:>12.2f}  {worst[INK]:>8.2f}")
        return 0

    worst, rows = evaluate(image, TITLE_TOP)
    print(f"artwork      {ART}  {image.width}x{image.height}")
    print(f"title top    {TITLE_TOP:.2f} of artwork height")
    print()
    for viewport, box, geometry, dark, light in rows:
        x0, y0, x1, y1 = (round(v) for v in box["art_box"])
        print(
            f"{viewport}px  {box['text']:<10} "
            f"seam at {box['crosses_at'] * 100:>4.0f}% through the line  "
            f"artwork rect ({x0},{y0})-({x1},{y1})"
        )
        print(
            f"          darkest 5% {dark}  signal-text "
            f"{contrast(hex_to_rgb(SIGNAL_TEXT), dark):.2f}  ink "
            f"{contrast(hex_to_rgb(INK), dark):.2f}"
        )
        print(
            f"          lightest 5% {light}  signal-text "
            f"{contrast(hex_to_rgb(SIGNAL_TEXT), light):.2f}  ink "
            f"{contrast(hex_to_rgb(INK), light):.2f}"
        )
    print()
    print(f"shipped   ink         worst {worst[INK]:.2f}")
    print(f"rejected  signal-text worst {worst[SIGNAL_TEXT]:.2f}")
    print(f"large-text threshold {LARGE_TEXT_THRESHOLD}")

    # Ink is what the stylesheet sets. Signal orange was the first choice, to
    # match the reference, and it is reported here only to record why it was
    # not used: it sits at almost the same luminance as the salmon in the
    # cloud, so it fails against the darkest fifth of what is behind it at
    # every viewport and every vertical offset tried.
    if worst[INK] < LARGE_TEXT_THRESHOLD:
        print("FAIL: the shipped colour does not clear the large-text threshold.")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
