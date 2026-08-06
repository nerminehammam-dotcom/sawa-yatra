# audit/measured.md

Measurements taken with a tool, not asserted. 5 August 2026.

Anything not on this page and not in `audit/static.md` is still `UNMEASURED`
and belongs in `audit/could-not-verify.md`.

---

## Home hero headline contrast — PASSES, 7.17:1 worst case

**Tool:** `tools/audit/measure-hero-contrast.py`, committed and runnable.

**Method.** No browser was available — the sandbox cannot reach the Playwright
CDN, and the Chromium download stalls at 0%. Rather than estimate, the script
composites the same pixels a browser would:

- the photograph is loaded from `public/` and cropped exactly as `object-fit:
  cover` with `object-position: center var(--hero-focus-y)` crops it, at the
  real natural size of 2560×1706;
- the scrim is the literal `linear-gradient` from `home.module.css`, evaluated
  per column and alpha-composited over that crop;
- the glyph boxes come from the shipped Fraunces files through HVAR, at the
  same optical size, weight and letter-spacing the CSS asks for, so each line
  is sampled over the area it actually occupies rather than a guessed box;
- the lightest 5% of the backdrop behind each line is averaged and taken as
  the background, which is the same convention the earlier audit used.

**Not modelled, stated rather than hidden:** the full-page grain overlay
(`body::before`, opacity 0.085) — a prior audit measured its effect on contrast
at 0.03, below the precision that matters here; and pair kerning, so line
widths are within about a percent rather than exact. Header height assumed
177px, measured off a screenshot of the running site.

**Result.** Headline `--pink` `#eeb6c4`. Threshold 3.0 for large text.

| Viewport | Go alone, | arrive | together. |
|---|---:|---:|---:|
| 1280×800 | **7.17** | 7.36 | 7.78 |
| 1366×768 | 7.17 | 7.36 | 7.78 |
| 1440×900 | 7.17 | 7.36 | 7.78 |
| 1512×982 | 7.25 | 7.36 | 7.92 |
| 1728×1080 | 7.68 | 7.28 | 8.22 |
| 1920×1080 | 7.79 | 7.36 | 8.33 |
| 2560×1440 | 7.50 | 8.45 | 8.58 |

Every line at every width clears **7:1**, which is the AAA threshold for
*normal* text. The requirement here is 3.0.

### Why it used to fail, and what actually fixed it

The failure was real. The earlier audit measured **1.99:1** at 1280px and the
stylesheet claimed 4.14:1, which held only at 1728px and above.

The model reproduces that. Reconstructing the old hero — centre crop, and the
headline lifted by the tagline, definition, two buttons and practical link that
used to sit beneath it — gives **1.58–1.66:1** at 1280×800, consistent with the
1.99 on record. That agreement is the reason to trust the 7.17.

| Old hero, reconstructed | Backdrop | Ratio at 1280×800 |
|---|---|---:|
| Headline at the foot of the frame (today) | `#7d7064` | 2.77 |
| Lifted by the buttons | `#9c9987` | 1.66 |
| Lifted by tagline + buttons + link | `#a39783` | 1.66 |
| Lifted by all of it, including the definition | `#a99a86` | 1.58 |

**The scrim was never the problem.** The headline was sitting high in the frame
because four other things were stacked below it, and that is where the sky is
bright. Removing them dropped it to the foot of the frame, over dark land.

Sensitivity to the crop position, for completeness — worst line at each:

| `--hero-focus-y` | 1280×800 | 1920×1080 |
|---|---:|---:|
| 0.50 (the old centre) | 6.31 | 7.39 |
| 0.60 | 7.17 | 7.39 |
| 0.70 | 7.14 | 7.36 |
| **0.82 (shipping)** | **7.17** | **7.36** |
| 0.90 | 7.25 | 7.39 |

So the crop change was worth about 0.9 at 1280 and nothing at 1920. Useful, not
decisive. The layout change was decisive.

### The standing risk

This result depends on the headline sitting at the foot of the frame. **Anything
added below it puts it back over the sky.** Re-run the script before assuming
the number holds:

```
python3 tools/audit/measure-hero-contrast.py
```

It exits non-zero if any line at any width falls below 3.0, so it can go
straight into CI.

### Still unmeasured on this element

- Mobile, below 639px, where the headline switches to `--paper` and the scrim
  becomes vertical. The script models the desktop scrim only.
- Real browser rendering. This is a composite of the same inputs, not a
  screenshot of the output. The two should agree; they have not been compared.

---

## Travel Self headline, where it crosses onto the painting

Measured 6 August 2026 with `tools/audit/measure-travel-self-straddle.py`.
Same method as the hero: no browser, no screenshot. The script reproduces the
layout arithmetic from `travel-self.module.css` against the real 2400x1600
`public/assets/images/travel-self/intro.jpg`, works out the exact rectangle
each headline line occupies inside the image, and measures the contrast of the
candidate colours against the darkest and lightest 5% of those pixels. Both
tails are checked, because a dark cactus and a bright cloud fail in opposite
directions.

Geometry: 24% paper panel, 76% artwork, headline at 5% inset-inline-start and
20% inset-block-start, `clamp(2.6rem, 7.4vw, 7.2rem)` at line-height 0.86,
second line indented 0.9em.

| viewport | line | seam falls at | worst ink | worst signal-text |
| --- | --- | --- | --- | --- |
| 1280 | Which one | 67% through | 4.61 | 1.80 |
| 1280 | are you? | 54% through | 4.12 | 1.60 |
| 1440 | Which one | 62% through | 4.62 | 1.80 |
| 1440 | are you? | 49% through | 4.12 | 1.61 |
| 1512 | Which one | 59% through | 4.62 | 1.80 |
| 1512 | are you? | 45% through | 4.18 | 1.63 |
| 1728 | Which one | 58% through | 4.64 | 1.81 |
| 1728 | are you? | 43% through | 4.19 | 1.63 |
| 1920 | Which one | 58% through | 4.64 | 1.81 |
| 1920 | are you? | 43% through | 4.19 | 1.63 |

Worst case shipped: **4.12:1** for `--ink` #27231f. Threshold for large text
is 3.0.

### Why the headline is not signal orange

The reference for this composition sets the type in burnt orange across both
the flat panel and the photograph. That was tried first and rejected on
measurement, not on taste. `--signal-text` #b03a0c reaches **1.60:1** at worst
here, and the `--scan` mode shows it never clears 3.0 at any vertical offset
from 8% to 50%: its relative luminance is close to the salmon in the painted
cloud, so it disappears into it. The emphasis on "you" is carried by the WONK
swash italic instead, and the orange stays on the paper side of the seam in
the chip, where it sits on a known flat colour.

### Still unmeasured on this element

- Below 900px the panel collapses and the headline sits on plain paper above
  the artwork, with nothing behind it. Not modelled, and does not need to be.
- Real browser rendering, as with the hero. Composite of the same inputs, not
  a screenshot of the output.
- Pair kerning is not applied, so line widths — and therefore the "seam falls
  at" column — are within about a percent.
