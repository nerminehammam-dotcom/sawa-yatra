# Constitution v2.5 — proposed amendments & Appendix B candidates

Phase 2 executed §6.3's instruction: a genuinely new role gets a new semantic
token and an amendment to the constitution — never a hard-coded value. The
tokens exist in `styles/tokens.css`; the amendments below await your edit of
the constitution (version bump to v2.6). Nothing here changes the document
itself.

## Proposed §6.3 amendments (tokens already in tokens.css)

1. **`--fs-map-label` (24px) / `--fs-map-caption` (19px)** — SVG route-map
   type lives in a viewBox coordinate space where the rem ramp does not
   apply. Proposed clause: "SVG-space type consumes the map tokens; px is
   deliberate there and nowhere else."
2. **`--fs-display-1-compact`** — the sub-640px h1 override existed as five
   separate bespoke clamps; now one token. Proposed clause: add it to the
   scale list.
3. **`em`-relative sizing** (3 sites, deliberately left unmigrated:
   `travel-self.module.css:8`, `how-it-works.module.css:148`,
   andean `how-it-works.module.css:234`) — parent-relative type is a
   different mechanism from the absolute ramp. Either bless a documented
   `em`-relative role or instruct conversion; the two `max()` sites encode
   real floor logic worth keeping.

## Appendix B candidates (exceptions that must be logged or refused)

1. **Route-notation arrows in data** — "Lima → Paracas" (~50 strings in
   content and pages; the biggest single remaining ledger item). §6.3 says
   arrows are the `<Arrow />` SVG, never a font glyph, with no carve-out —
   but `Arrow.tsx` documents one for route data, and Fraunces carries no
   U+2192 (the OG-image code strips them for exactly that reason), so these
   render in a fallback face today. Log the exception, or withdraw the
   carve-out and convert route strings to structured from/to pairs rendered
   with the SVG.
2. **Image-generation colour literals** (17, all canonical palette values) —
   icon/OG/manifest code runs where CSS custom properties don't exist.
   Log once so future audits stop re-flagging; consider a lint check that
   they match tokens.css.
3. **Home-hero `@supports` text-stroke branch** — a deliberate, measured
   3.07:1 vs a 3.0 large-text threshold with the scrim removed. It is a
   documented decision that reads as an exception to §10's "scrim or plate";
   log it or remove the branch.

## Author decisions still open (from Phase 2, none guessed)

- `docs/alt-text-decisions.md` — 6 same-frame contradictory alts (needs eyes
  on the images), 4 assets needing a description, the card-thumbnail
  informative-vs-decorative call.
- General Sans binaries — drop three woff2 files into
  `public/fonts/general-sans/` (README there); CSS is fully wired and falls
  back to the system sans, never Fraunces, until then.
- PageHero scrim gradient (now in place) — re-measure contrast against the
  actual hero pixels at each breakpoint when hero frames are re-chosen
  (Appendix A items 1–2).
- Borderline `--signal` calls left untouched: scrollbar thumb, 4px active
  flight-arc stroke (also the sole carrier of that state — a §10 concern).
