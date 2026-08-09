#!/usr/bin/env python3
"""
Measure the contrast of the home hero headline against the photograph.

Why this and not a browser: the sandbox this was written in cannot reach the
Playwright CDN, so no headless Chromium was available. Rather than estimate,
this composites the same pixels the browser would and measures those.

It is a real measurement of the real assets, not a screenshot:

  - the photograph is loaded from public/, cropped exactly as object-fit:
    cover with object-position: center var(--hero-focus-y) would crop it
  - the scrim is the literal linear-gradient from home.module.css, evaluated
    per column and alpha-composited over the crop
  - the glyph boxes come from the shipped Fraunces files via HVAR, at the same
    optical size, weight and letter-spacing the CSS asks for

Two things it does NOT model, both stated rather than hidden:

  - the full-page grain overlay (body::before, opacity 0.085). A prior audit
    measured its effect on contrast at 0.03, i.e. below the precision that
    matters here.
  - kerning. Advances are summed per glyph without pair kerning, so line
    widths are within a percent or so, not exact.

Usage:  python3 tools/audit/measure-hero-contrast.py [--header PX]
"""

from __future__ import annotations

import argparse
import os
import sys

import warnings

from PIL import Image
from fontTools.ttLib import TTFont

warnings.filterwarnings("ignore", category=DeprecationWarning)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERO = os.path.join(ROOT, "public/assets/images/home/hero.jpg")
ROMAN = os.path.join(ROOT, "public/assets/fonts/fraunces-latin-full-normal.woff2")
ITALIC = os.path.join(ROOT, "public/assets/fonts/fraunces-latin-full-italic.woff2")

# --- values taken from app/(public)/home.module.css -------------------------
PINK = "#eeb6c4"          # --pink, the headline colour above 639px
PAPER = "#e7e1d6"         # --paper, the colour used below 639px
FOCUS_Y = 0.82            # --hero-focus-y
SCRIM = [                 # (stop from the RIGHT edge, alpha) — "to left"
    (0.00, 0.88),
    (0.28, 0.74),
    (0.52, 0.42),
    (0.72, 0.10),
    (0.88, 0.00),
]
SCRIM_RGB = (26, 21, 18)
LARGE_TEXT_THRESHOLD = 3.0

WIDTHS = [1280, 1366, 1440, 1512, 1728, 1920, 2560]
VIEWPORT_HEIGHTS = {1280: 800, 1366: 768, 1440: 900, 1512: 982,
                    1728: 1080, 1920: 1080, 2560: 1440}


def clamp(low: float, preferred: float, high: float) -> float:
    return max(low, min(preferred, high))


def srgb_to_linear(channel: float) -> float:
    channel /= 255
    return channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4


def relative_luminance(rgb) -> float:
    r, g, b = (srgb_to_linear(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b) -> float:
    la, lb = relative_luminance(a), relative_luminance(b)
    lighter, darker = max(la, lb), min(la, lb)
    return (lighter + 0.05) / (darker + 0.05)


def hex_to_rgb(value: str):
    value = value.lstrip("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def text_width(path: str, text: str, size_px: float, wght: float,
               opsz: float, letter_spacing_em: float) -> float:
    """Advance width in CSS pixels, at the given variable-font location."""
    font = TTFont(path)
    units = font["head"].unitsPerEm
    glyph_set = font.getGlyphSet(location={"opsz": opsz, "wght": wght})
    cmap = font.getBestCmap()
    total = 0.0
    for character in text:
        name = cmap.get(ord(character))
        if name is None:
            continue
        total += glyph_set[name].width
    width = total / units * size_px
    return width + letter_spacing_em * size_px * len(text)


def scrim_alpha(x: int, width: int) -> float:
    """Alpha of the gradient at column x. Stops are measured from the right."""
    position = (width - 1 - x) / max(width - 1, 1)
    for i in range(len(SCRIM) - 1):
        start, start_alpha = SCRIM[i]
        end, end_alpha = SCRIM[i + 1]
        if start <= position <= end:
            span = end - start
            t = 0.0 if span == 0 else (position - start) / span
            return start_alpha + (end_alpha - start_alpha) * t
    return 0.0


def compose_band(photo: Image.Image, width: int, band_height: int) -> Image.Image:
    """object-fit: cover with object-position: center FOCUS_Y, then the scrim."""
    natural_w, natural_h = photo.size
    scale = max(width / natural_w, band_height / natural_h)
    rendered = photo.resize(
        (round(natural_w * scale), round(natural_h * scale)), Image.LANCZOS
    )
    offset_x = round((width - rendered.width) * 0.5)
    offset_y = round((band_height - rendered.height) * FOCUS_Y)
    band = Image.new("RGB", (width, band_height), (0, 0, 0))
    band.paste(rendered, (offset_x, offset_y))

    pixels = band.load()
    for x in range(width):
        alpha = scrim_alpha(x, width)
        if alpha <= 0:
            continue
        for y in range(band_height):
            r, g, b = pixels[x, y]
            pixels[x, y] = (
                round(r * (1 - alpha) + SCRIM_RGB[0] * alpha),
                round(g * (1 - alpha) + SCRIM_RGB[1] * alpha),
                round(b * (1 - alpha) + SCRIM_RGB[2] * alpha),
            )
    return band


def measure(width: int, viewport_height: int, header: int, photo: Image.Image):
    band_height = viewport_height - header
    band = compose_band(photo, width, band_height)

    # .homeHeroCopy — absolute, top-right, border-box, align-content: end
    box_width = min(720, 0.88 * width)
    pad_inline = 0.06 * width
    pad_block = clamp(40, 0.07 * viewport_height, 80)
    content_right = width - pad_inline
    content_bottom = band_height - pad_block

    # h1 line boxes
    roman_size = clamp(41.6, 0.06 * width, 88)
    turn_size = clamp(54.4, 0.08 * width, 121.6)
    roman_line = 0.92 * roman_size
    turn_line = 0.85 * turn_size
    turn_collapse = (0.14 + 0.10) * turn_size

    lines = [
        ("Go alone,", ROMAN, roman_size, 600, -0.022, roman_line),
        ("arrive", ITALIC, turn_size, 300, -0.030, turn_line - turn_collapse),
        ("together.", ROMAN, roman_size, 600, -0.022, roman_line),
    ]

    total_height = sum(line[5] for line in lines)
    y = content_bottom - total_height

    results = []
    for text, font_path, size, weight, tracking, line_height in lines:
        advance = text_width(font_path, text, size, weight, 144, tracking)
        # The turning word is nudged off the right edge by margin-inline-end.
        nudge = clamp(8, 0.03 * width, 56) if text == "arrive" else 0
        right = content_right - nudge
        left = max(0, right - advance)
        top = max(0, y)
        bottom = min(band_height, y + line_height)
        y += line_height

        crop = band.crop((round(left), round(top), round(right), round(bottom)))
        pixels = list(crop.getdata())
        if not pixels:
            continue
        by_luminance = sorted(pixels, key=relative_luminance)
        lightest = by_luminance[int(len(by_luminance) * 0.95):]
        average = tuple(round(sum(p[i] for p in lightest) / len(lightest)) for i in range(3))
        results.append({
            "text": text,
            "backdrop": average,
            "ratio": contrast(hex_to_rgb(PINK), average),
            "box": (round(left), round(top), round(right), round(bottom)),
        })
    return results, box_width


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--header", type=int, default=177,
                        help="rendered height of the site header in CSS px")
    args = parser.parse_args()

    photo = Image.open(HERO).convert("RGB")
    print(f"photograph      {photo.size[0]}x{photo.size[1]}")
    print(f"headline colour {PINK}   threshold {LARGE_TEXT_THRESHOLD} (large text)")
    print(f"header height   {args.header}px")
    print()
    print(f"{'viewport':>12}  {'line':<11} {'backdrop':>9} {'ratio':>7}  verdict")
    print("-" * 58)

    worst = None
    for width in WIDTHS:
        height = VIEWPORT_HEIGHTS[width]
        results, _ = measure(width, height, args.header, photo)
        for index, result in enumerate(results):
            label = f"{width}x{height}" if index == 0 else ""
            backdrop = "#%02x%02x%02x" % result["backdrop"]
            ratio = result["ratio"]
            verdict = "pass" if ratio >= LARGE_TEXT_THRESHOLD else "FAIL"
            print(f"{label:>12}  {result['text']:<11} {backdrop:>9} "
                  f"{ratio:>7.2f}  {verdict}")
            if worst is None or ratio < worst[0]:
                worst = (ratio, width, height, result["text"])
        print()

    print("-" * 58)
    print(f"worst case: {worst[0]:.2f} on '{worst[3]}' at {worst[1]}x{worst[2]}")
    return 0 if worst[0] >= LARGE_TEXT_THRESHOLD else 1


if __name__ == "__main__":
    sys.exit(main())
