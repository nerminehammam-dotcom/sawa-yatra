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
