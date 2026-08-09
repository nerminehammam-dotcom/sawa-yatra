# Constitution audit — v2.5, Phase 1 (audit only)

8 August 2026 · against `docs/visual-voice-constitution-v2.5.md` §§6–8, §10.
No file was changed by this audit. Every violation below was verified broken at the
cited line before listing; already-compliant work is listed in A and stays untouched.
Zero-diff was treated as a valid outcome per file. Images, wordmark asset and copy
are out of scope by instruction (alt text and markup only).

Baseline facts established first (not assumed):
`--fs-body` = clamp(1.05rem→1.3rem) → **16.8px floor**; body element = 16px floor;
`--touch-min` = 48px ✓; `--leading-body` = 1.62 ✓; `--measure` = 62ch ✓;
`--font-display` **and** `--font-read` both resolve to Fraunces — General Sans is
absent from the repo (`@fontsource/inter` is in package.json but imported nowhere).

---

## A. Already compliant

- **§6.1 wordmark** — `components/brand/Wordmark.tsx` renders the locked SVG artwork; no live-font retyping anywhere; no CSS recolours it.
- **§10 measure** — global `p { max-width: var(--measure) }` (62ch); every explicit cap ≤62ch. Zero findings.
- **§10 focus** — one zero-specificity `:focus-visible` ring in globals.css; all three `outline:none` sites legitimate (programmatic focus targets / paired with :focus-visible). Zero findings.
- **§10 decorative SVG** — all four inline SVGs `aria-hidden` + `focusable="false"`; Wordmark img pattern textbook. Zero findings.
- **§8 reduced motion (CSS)** — global 0.01ms clamp on animation/transition + nine reinforcing component blocks; motion-safe pattern in SiteNavigation.
- **§8 reduced motion (JS)** — both route maps gate the timer, scroll and Play control on `matchMedia`; all scrollTo calls pass `"auto"` (one exception, M1).
- **§8 vocabulary** — no parallax, no scroll-jacking, no autoplay: the map's 7s interval starts only on a user's Play press and stops on any interaction. The route-line advance and canvas zoom are the sanctioned vocabulary.
- **§10 no info by motion alone** — map progress mirrored as text + progressbar + aria-live.
- **§10 targets** — `--touch-min` 48px consumed at 43 sites (buttons, nav, forms, quiz, ladder). Two regressions only (A4).
- **§10 scrims** — solid plates or measured gradient scrims in six overlay sites; home hero scrim's measurement method documented in-file.
- **§7 colour discipline** — tokens.css matrix present; `--dusty-blue`/`--soft-blue` de-aliased; ~25 `--signal` uses verified as fills-behind-ink or large marks — compliant, do not touch. `--signal-text` foregrounds compliant per the matrix.
- **§6.3 arrows** — `<Arrow />` SVG correct and consumed correctly at its call sites.
- **New journeys components** (`ProvenanceBadge`, `DemandMap`, `UpgradePanel`, `PairedPrice`, `PricingLadder` CSS) — full token consumption, no hard-coded colour. (Face + tabular findings only, below.)
- **globals.css h1–h4** — correct face, weight 500, token sizes. Violations below are per-page walk-aways from a correct baseline.
- **Alt hygiene (partial)** — no filename alts, no missing alts, no caption/alt duplication, decorative images correctly `alt=""`, photograph-plate captions deliberately distinct from alt.

---

## B. Violations — by rule, ranked by repo-wide frequency

### 1 · T1 — §6.3 scale tokens only — **316 occurrences** (73 bespoke clamp())
Only 73 declarations repo-wide consume a `--fs-*` token. Densest files:
travel-self.module.css (59) · home.module.css (36) · the two duplicate
CaravanRouteMap.module.css (23 each) · FieldDocument (15) · journey.module.css (15)
· GateSelector (15) · SiteNavigation (14) · how-it-works (14+11) · JoiningPointSelector (13)
· ComingSoonPage (10) · remainder in 20 further files.

Mapping (same swap for every occurrence of a value):
`1rem`×115 → `--fs-small` (exact match, no-op) · `1.125rem`×49 + `1.0625rem`×23 +
nearby ×15 → `--fs-body` · 1.2–1.8rem ×20 → `--fs-title` · 2–2.8rem ×9 → `--fs-display-3`
· clamp() families by floor: 1.0–1.2 → `--fs-body`, 1.125–1.6 → `--fs-lead`/`--fs-title`,
1.75–2.4 → `--fs-display-3`, 2.5–2.8 → `--fs-display-2`, 3.0–3.5 → `--fs-hero`/`--fs-heading`/`--fs-card`,
≥4 → `--fs-display-1`.

Needs a **new semantic token + constitution amendment** (never a hard-coded value):
SVG-space map type (24px/19px in both CaravanRouteMap css) → `--fs-map-label`/`--fs-map-caption`;
`em`-relative sizing at 3 sites; `globals.css:200` compact-h1 override → fold into token or `--fs-display-1-compact`.
Also: `Eyebrow.module.css` does not consume its own `--fs-eyebrow` token.

### 2 · X1 — §10 alt decisions — **92 occurrences**
- **78× the retired "A …/An …" opener**: andean-caravan-images.ts (54 of 71),
  andean-caravan-destinations.ts (12 of 13), how-it-works `_content.ts` (7 of 9),
  plus 5 inline. Proposed value: **ask author per placement** — alt depends on the
  image's job in that use (§2, §10); wording is not invented here.
- **8× `alt: "To be confirmed"`** in content/assets.ts (currently non-rendering;
  defect if the placeholder path ever consumes them). Decorative slots → `alt=""`;
  founder/hero entries → ask author.
- **6 contradictory-alt clusters** — same frame, incompatible facts (e.g.
  `01-lima-01.jpg`: "a man in friar's robes" vs "a woman in the doorway" vs "a quiet
  street"). At least one of each pair is factually wrong. **Ask author** — these
  need eyes on the image, which the audit does not touch.
- Card-thumbnail alts beside naming headings: informative vs decorative is a
  placement decision — ask author.

### 3 · T2 — §6.2 face split — **1 systemic + 42 sites**
**Systemic:** the operational face does not exist. `--font-read: var(--font-fraunces)`
(tokens.css:100–103, with a comment stating the single-family policy §6.2 forbids);
fonts.ts loads only Fraunces. Every nav, form, button, price, date, caption renders
in the display face. Fix: self-host General Sans, expose `--font-general-sans`,
repoint `--font-read`.
**42 sites hard-code `var(--font-display)` on operational surfaces** and will stay
wrong after the systemic fix: prices/bands (PairedPrice ×3, PricingLadder ×3),
fact rows (UpgradePanel, DemandMap, FactStrip dd), itinerary/route data ×7,
captions ×4, questionnaire ×6 confirmed, selectors/forms/buttons ×8, section
numbers ×4, map labels ×6. Proposed: `var(--font-read)` or delete and inherit.
**Sequencing:** current editorial body in `--font-read` renders correctly today and
becomes wrong after the repoint — the face split must land as one pass (Phase 2
group 2), and before the weight pass.

### 4 · T4 — §6.3 eyebrow discipline — **41 occurrences**
The shared `<Eyebrow />` is used in exactly 2 files; 38 blocks re-roll it per page
(full file:line list in the typography audit; 3 with off-spec 0.1em/0.2em tracking),
3 more are token-correct but re-rolled. One breach of the floor:
travel-self.module.css:1144 at 0.8rem/0.2em → `--fs-eyebrow` + `--tracking-eyebrow`.
Proposed: replace with `<Eyebrow />`, or minimum: consume the two tokens.

### 5 · T3 — §6.3 Fraunces headings ≥500 — **25 occurrences**
All per-page overrides (300/400) under the documented 500 floor: travel-self ×12,
andean how-it-works ×3, GateSelector ×2, journey.module ×1, how-it-works
blockquote ×1, home ×2, Accordion trigger ×1, forms ×1, JoiningPointSelector ×1,
FieldDocument ×1. Proposed: 500 — after the T2 face pass (some of these elements
should not be Fraunces at all).

### 6 · C1 — §7 hard-coded colour — **20 declarations**
- **12 real defects:** home.module.css:70–74, 219–224 (`rgb(26 21 18 / …)` scrim
  stops) and SiteNavigation.module.css:236 (shadow `rgb(36 31 27 / 14%)`) →
  `color-mix(in srgb, var(--ink) N%, transparent)`.
- **8 hex fallbacks inside var()** (travel-self.module.css:37–44) — a second copy
  of the palette; drop the fallbacks.
- **17 image-generation literals** (icon/OG/manifest, Satori contexts where custom
  properties don't exist; all canonical values) — noted, not proposed for change;
  candidate for an Appendix B entry so they aren't re-flagged.

### 7 · A1 — §10 body ≥18px — **14 occurrences (2 systemic)**
- `tokens.css:119` `--fs-body` floor 16.8px → `clamp(1.125rem, 1.4vw, 1.3rem)`.
- `globals.css:35` body floor 16px → `clamp(1.125rem, 1.05rem + 0.22vw, 1.25rem)`.
  The single highest-leverage line in the audit.
- 12 per-surface sustained-reading sites at 16–17.28px (FAQ answers, map
  introductions, route prose, standfirsts, essay columns, reassurance paras,
  panel summaries — file:line list in the a11y audit), of which 3 borderline.
  16px `--fs-small` on genuinely short secondary text was verified permitted and
  not flagged.

### 8 · C3 — §7 ninth colour — **2 colours / 12 occurrences**
`#1A1512` (×11, home scrims) and `#241F1B` (×1, nav shadow) — neither is `--ink`
(#27231F), neither is in the matrix. Same lines as C1. Proposed: derive from
`--ink` via color-mix (no new colour), or add a matrix row in the same commit.

### 9 · T6 — §6.3 tabular figures — **12 surfaces, 0 declarations**
`font-variant-numeric` appears nowhere in the repo; every price, date, duration and
altitude renders proportional. Proposed: apply `tabular-nums` at the 12 listed
surfaces (paired price, ladder bands, upgrades, demand windows, departure-card
facts, journey fact tables, fact strip, route stepper, gate selector, field
document, questionnaire counter) — or one global rule on `dd` + price classes.

### 10 · T5 — §6.3 arrows never a font glyph — **6 occurrences + 1 conflict**
CSS `content: "→"` (how-it-works:412); four `←` spans (RouteStepper,
JoiningPointSelector, both CaravanRouteMaps — needs a `direction="left"` variant on
`<Arrow />`); one `" → "` join on the membership checkout line (borderline).
**Conflict needing a ruling:** `Arrow.tsx` carves out route-notation arrows in data
("Lima → Paracas", ~50 strings) as "real text", but §6.3 states the rule without
exception — and the OG-image code documents that Fraunces has no U+2192, so those
arrows render in a fallback face today. Either an Appendix B entry or the carve-out
is withdrawn.

### 11 · A2 — §10 line-height ≥1.5 — **6 occurrences**
`.mapNote` ×2 (1.4/1.45 on operational copy), `.dualNature` (1.4), `.whole` (1.45),
`.qPrompt` (1.4, split the shared rule), RisoArtwork `.description` (1.35) →
`var(--leading-body)` / 1.55.

### 12 · C2 — §7 --signal misuse — **5 confirmed + 3 borderline**
Text on paper ×2 (andean how-it-works `.proposition` heading; GateSelector
`.sectionNumber`) → `--signal-text`. 1px signal hairlines on paper ×3
(system.module secondary button; journey heroAction; adjacentLinks hover) →
`--ink` or split the rule. Borderline (needs a call): scrollbar thumb; 4px active
flight-arc stroke (also sole carrier of state — §10 concern); one 3px border on
soft-blue read as compliant.

### 13 · A4 — §10 targets ≥48px — **2 occurrences**
Newer CaravanRouteMap `.stopButton` 44px (the older twin already fixed it — a
regression); travel-self `.inkPosition` min-width 44px → `var(--touch-min)`.

### 14 · A6 — §10 text over photography — **2 occurrences**
PageHero ≥640px overlay: cream text over full-bleed photo, no scrim/plate (affects
both journey heroes) — **ask author** (scrim, plate, or split layout). Home hero
`@supports` branch swaps the scrim for text-stroke at a measured 3.07:1 vs a 3.0
threshold — deliberate and documented; if it stands it belongs in Appendix B.

### 15 · A7 — §10/§5 static map equivalent — **1 hard**
`/caravans/andean/route-map` renders the animated map and an sr-only h1 and nothing
else. A static, labelled equivalent is required; form (ol of 13 stops with
name/country/altitude?) — ask author. Partial coverage on four other routes noted;
per-stop payload (altitude, orientation) is reachable only one stop at a time, and
below 768px stop labels vanish except the active one.

### 16 · M1 — §8 reduced motion — **1 occurrence**
`FindGateButton.tsx:8` `scrollIntoView({ behavior: "smooth" })` ungated (the global
CSS reset does not override an explicit behavior option) → matchMedia gate, as the
route map already does.

### 17 · M2 — §8 motion vocabulary — **1 occurrence**
Newer CaravanRouteMap stop-change reveal: 680/782/578ms staggered slide-fades plus
a photo zoom — an expressive second vocabulary (correctly reduced-motion gated, so
vocabulary only). The older twin keeps a bare translate — the restrained version.
Reduce to that form, or ask author.

---

## Cross-cutting notes for Phase 2

1. **Duplicate file pair.** `app/(public)/caravans/_components/CaravanRouteMap.{tsx,module.css}`
   and `components/departures/CaravanRouteMap.{tsx,module.css}` are near-identical
   twins contributing ~50 findings between them, and they have drifted in opposite
   directions (the older one has the 48px buttons and restrained motion; the newer
   one is the rendered one on /caravans/andean). Reconcile first or every fix lands twice.
2. **Sequencing.** Face split (group 2) before weight fixes (group 3's companions):
   several sub-500 weights sit on elements that should leave Fraunces entirely.
   The `--font-read` repoint flips today-harmless editorial surfaces into defects
   in the same commit — one pass, verified together.
3. **Appendix B candidates** (constitution requires logging, not silent exceptions):
   route-notation arrow carve-out (~50 strings); 17 image-generation colour
   literals; home-hero text-stroke branch.
4. **Awaiting author decisions** (listed, not guessed): 78 alt rewrites + 6
   contradictory-alt clusters + 8 placeholder alts; PageHero overlay treatment;
   route-map static equivalent form; reveal-motion choice; scrollbar/flight-arc
   signal calls; membership "→" join.

## Phase 2 execution groups (on green light — one commit each, verify on :3001 between)

1. Scale-token migration (T1; includes the new-token amendments)
2. Face split (T2 systemic + 42 sites; editorial repoint in the same pass)
3. 18px body + 48px targets (A1 ×14, A4 ×2; plus A2 line-heights, T3 weights, T4 eyebrows)
4. Alt-text pass (X1 — proposals only where unambiguous; ambiguous items go to the author list)
5. Motion cleanup (M1 gate, M2 reveal, T5 arrows, C1/C2/C3 colour fixes)

Totals: **~570 verified occurrences** across 17 rules; 4 rules fully clean
(measure, focus, decorative SVG, and — bar one — reduced motion).

---

## Phase 2 — EXECUTED (8 August 2026, on author's green light)

All five groups landed. Verified after: typecheck clean · 184/184 unit tests ·
production build succeeds (45 pages) · spec-token guard clean · zero
signal-as-text, zero "A …" alt openers, 4 remaining non-token font-sizes are
the deliberate `em`-relative/amendment sites plus the body clamp.

- **T1**: 316 → 4 (all intentional; see amendment proposals). New tokens
  `--fs-map-label`, `--fs-map-caption`, `--fs-display-1-compact`.
- **T2**: face split wired — `--font-read` → General Sans (self-hosted slot +
  README; binaries are the author's one-time download), body default is
  Fraunces (editorial), 42 operational sites repointed, Accordion trigger and
  form context moved to the operational face.
- **T3/T4**: weights at ≥500 where Fraunces remains; eyebrow tracking on the
  token, floor breach fixed. Component adoption of `<Eyebrow />` remains
  open (structural JSX refactor, listed as remaining work).
- **A1/A2/A4**: 18px floors in tokens + body; per-surface raises; line-heights;
  both 44px targets to `--touch-min`; dead 44px fallbacks stripped.
- **C1/C2/C3**: ninth colours eliminated via `color-mix` from `--ink`; hex
  fallbacks stripped; signal-as-text ×2 → `--signal-text`; signal hairlines
  ×3 → ink (primary button keeps its fill).
- **T6**: `tabular-nums` at all 12 listed surfaces.
- **T5**: `<Arrow direction="left" />` added; four `←` spans and the CSS
  `content: "→"` replaced; membership checkout sequence became an ordered
  list. Route-notation data strings await the Appendix B ruling.
- **X1**: 78 de-formulaic alt rewrites (facts preserved, nothing invented);
  4 decorative slots → `alt=""`; author list in `docs/alt-text-decisions.md`.
- **M1/M2**: FindGateButton scroll gated; the newer route map's staggered
  reveal + photo zoom reduced to the restrained translate-only form.
- **A6/A7**: PageHero gained an ink-derived scrim (re-measure on hero
  re-choice); `/caravans/andean/route-map` gained the static labelled route.

Open items and proposed amendments: `docs/constitution-amendment-proposals.md`.
Revert: restore `pre-phase2-backup.tar.gz` (in the session outputs folder)
over `app components content styles lib docs package.json next.config.ts`.
