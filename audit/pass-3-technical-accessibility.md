# Sawayatra — PASS 3: technical and accessibility

## Evidence boundary (read first)

The brief says to analyse *attached* Lighthouse, axe/WAVE, Network-tab, `next build` and console evidence. **None of that was attached** — the source-file list in the brief is still the `[...]` placeholder, and no report files came with it. This environment also has **no browser** and cannot install Playwright's Chromium (the CDN is unreachable from the sandbox).

So I did not infer from a rendered screen, and I did not fabricate numbers. I **generated** the evidence I can produce authoritatively and analysed that:

- `next build` output (run this session).
- Client JS and asset sizes read from `.next/` and `public/` on disk.
- The full 39-route crawl (headings, metadata, links) from the served build, confirmed in PASS 1 to be byte-current with live production.
- Live production `robots.txt` and homepage `<head>` fetched through the Vercel-aware fetcher (real production responses, quoted with headers).
- Source files: `content/navigation.ts`, `next.config.ts`, `app/` structure, the test suite.

Everything that genuinely requires a running browser — **LCP, CLS, INP, an axe/WAVE DOM audit, computed contrast of text over photographs in-browser, focus order, zoom-to-200 % reflow, screen-reader behaviour, and runtime hydration-warning capture** — is **UNMEASURED** and listed at the end. I will not invent a Lighthouse score.

---

## Architecture

**Verdict: strong and maintainable. Two real gaps: E2E is not wired into CI, and the CSS strategy inflates every HTML document.**

**App Router structure — sound.** `next build` shows a coherent route tree: static (`○`) for the marketing pages, SSG (`●`) with `generateStaticParams` for `/departures/[slug]`, dynamic (`ƒ`) only where justified (`/contact`, `/travel-self`, `/start-here`, `/api/forms/[kind]`, the OG image route). Error handling is complete: `app/(public)/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` all exist, and `/nonexistent-xyz` returns a real **HTTP 404** (verified in the crawl), not a soft-200.

**Server/Client boundary — reasonable.** 18 files carry `"use client"`; the interactive surfaces (Travel Self quiz, route map, forms, nav) are client, the content pages are server. No evidence of over-clienting.

**Navigation data — single source (hypothesis disproven).** The brief hypothesised "duplicated navigation configuration." It is not duplicated: `content/navigation.ts` exports `primaryNavigation`, `utilityNavigation`, `announcementNavigation`, `caravansNavigation`, `footerNavigation`, consumed by `PublicShell.tsx` and `SiteNavigation.tsx`. `content/site.ts` defines **zero** `label`/`href` pairs. Nav is centralised; the header and footer cannot drift apart.

**Design tokens / CSS Modules — genuinely strong.** One token file (`styles/tokens.css`) with a WCAG pairing matrix that is now enforced by tests (`tests/design/pairings.test.ts`, `tokens-table.test.ts`). CSS Modules throughout, no Tailwind, no CSS-in-JS runtime.

**Two divergent map implementations exist** — `components/departures/CaravanRouteMap.tsx` and `app/(public)/caravans/_components/CaravanRouteMap.tsx` are two separate map components (found in the craft pass). *Consequence:* a change to the route map must be made twice or they drift. *Repair:* extract one shared `CaravanRouteMap` into `components/` and delete the page-local copy; the page imports the shared one. *Verify:* `grep -r "CaravanRouteMap" app components` returns one component definition.

**Test coverage — good on units, absent on E2E-in-CI.**
| | |
|---|---|
| **Area** | CI / `tests/e2e` |
| **Score** | 6 |
| **Severity** | Medium |
| **Evidence** | 159 unit/integration tests pass (run this session). Three Playwright specs exist (`contrast.spec.ts`, `cross-browser.spec.ts`, `release-one.spec.ts`). `.github/workflows/ci.yml` contains **no** `test:e2e`/`playwright` step (grep count 0). |
| **Problem** | The end-to-end specs — the ones that would catch a broken form flow or a hydration failure — run only if someone remembers, and there is no browser in CI to run them. |
| **Consequence** | The class of bug E2E catches (a journey that renders but does not *work*) ships unguarded. |
| **Root cause** | Technical / operational (CI job missing a browser + step). |
| **Exact repair** | Add a second CI job: `npx playwright install --with-deps chromium` then `npm run test:e2e` against `next start`, on the same `.nvmrc` Node. |
| **Replacement** | A `e2e:` job in `ci.yml` depending on the build. |
| **Preserve** | The existing unit job. |
| **Effort** | Small |
| **Dependency** | None. |
| **Verification** | A pushed PR shows the E2E job running the three specs green in GitHub Actions. |

*Could not verify:* I could not **run** the Playwright specs here (no Chromium). Their existence and CI-absence are confirmed; their pass/fail state is unknown this session.

---

## Performance

**Verdict: asset weights are now modest and the ~53 MB hypothesis is false; the real, unmeasured risk is the inlined-CSS HTML weight and the absence of a per-route JS budget.**

### The named "~53 MB image asset" hypothesis — disproven for the shipped site

| | |
|---|---|
| **Evidence** | Largest file anywhere under `public/`: `public/assets/images/departures/andean/gallery/the-stone-road/03-cusco-15.jpg` at **1,058 KB**. Total shipped images **29 MB across 71 files; exactly one over 1 MB.** The multi-GB originals (`chile 2025 Web/` = 2.8 GB, font masters up to 867 MB) are **gitignored and not under `public/`** — never deployed. |
| **Verdict** | No ~53 MB asset is served. The hypothesis referred to source masters, which the browser never sees. |

Next.js also re-encodes each served JPEG to AVIF/WebP per device width (`next.config.ts` `formats: ["image/avif","image/webp"]`, `deviceSizes` capped at 1920), and the `sizes` attributes were capped at the container width in the craft pass, so a 2560 px monitor now fetches ~97 KB instead of ~280 KB per hero (measured on the real renditions).

### The real performance question: HTML weight

| | |
|---|---|
| **Area** | `next.config.ts` `experimental.inlineCss: true` |
| **Score** | 6 |
| **Severity** | Medium (pending measurement) |
| **Evidence** | Every page ships **500–640 KB of HTML** (measured per route in the crawl): `/caravans/andean-caravan/how-it-works` 646 KB, `/caravans/andean` 639 KB, home 512 KB. `inlineCss: true` is set. |
| **Problem** | The full stylesheet is inlined into every document, so CSS is re-sent on every navigation with no cross-page caching, and the HTML the browser must parse before first paint is large. |
| **Consequence** | Likely a slower LCP on a cold cache and on a slow connection — the Andean audience. **I have not measured LCP**, so this is a flagged risk, not an asserted failure. |
| **Root cause** | Technical (build configuration trade-off). |
| **Exact repair** | Measure first: run Lighthouse on the deployed preview for `/` and `/caravans/andean`. If LCP on "Slow 4G" exceeds 2.5 s, disable `inlineCss` (revert to a linked, cacheable stylesheet) or scope it to critical CSS only, and re-measure. Do not remove it blind — inlining can help first paint on a *warm* single-page visit; the question is your traffic pattern. |
| **Replacement** | `experimental: { inlineCss: false }` if measurement shows a regression, else keep. |
| **Preserve** | The image and font pipeline, which is already good. |
| **Effort** | Small (config) + Medium (measure properly) |
| **Dependency** | A Lighthouse run (needs a browser). |
| **Verification** | Lighthouse LCP for `/` and `/caravans/andean` on Slow 4G, before and after, on the deployed URL. |

### JavaScript weight

Total client JS: **1,633 KB across 22 chunks**; two 320 KB chunks lead, then 227 KB and 143 KB. **The `next build` output did not emit a per-route "First Load JS" column** (Turbopack build formatting), so I cannot report the per-page first-load budget — *evidence silent, stated rather than guessed.* *Repair to get the number:* run `ANALYZE=true next build` with `@next/bundle-analyzer`, or read `.next/app-build-manifest.json`; then set a per-route budget. The two 320 KB chunks are worth identifying (framework vs a heavy dependency) once the analyzer names them.

### Fonts — good

`fraunces-normal.woff2` 58 KB + `fraunces-italic.woff2` 121 KB = **179 KB**, subsetted and proven glyph-identical to the masters, both `preload`ed with `font-display: swap`. No change needed.

### Caching — good at the edge

The live `robots.txt` response shows `x-vercel-cache: HIT`, `cache-control: public, max-age=0, must-revalidate`, `age: 2527`. Static routes are edge-cached. The five security headers are live (`strict-transport-security`, `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy`, `permissions-policy`).

---

## Accessibility (WCAG 2.2 AA)

**What I can assert from static evidence, and what needs a browser.** I have real, non-inferred evidence for alt coverage, heading hierarchy, contrast (computed from tokens and composited over the actual photographs), the focus rule, reduced-motion, touch-target size, skip link and landmarks. I have **no** axe/WAVE DOM audit, no zoom-reflow, no focus-order and no screen-reader run — those are UNMEASURED.

### Failures found (element · failure · correction · verification)

**A1 — `/start-here` has no `<h1>` and no server content.**
- *Element:* the `/start-here` document.
- *Failure:* 0 `h1` elements (crawl census; every other route has exactly one); SSR body is only "Loading Sawayatra…". Breaks WCAG 2.4.6 (Headings) and 1.3.1 for that page, and gives a no-JS or slow-JS user nothing. It is a `ƒ` dynamic route rendering client-only.
- *Correction:* server-render an `h1` "Start here" and real links, or 301 to `/how-it-works` (this is PASS 1 C4).
- *Verification:* `curl -s https://…/start-here | grep '<h1'` returns a heading; axe "page has heading" passes.

**A2 — Placeholder strings serve as meta descriptions and page copy.**
- *Element:* `/request-invitation` (`<meta name="description">` = "PLACEHOLDER: Founder-approved request-invitation meta description to be supplied"; body shows "PLACEHOLDER / LEGAL REVIEW … mock checkbox is not final legal consent"), `/sign-in` (description = "PLACEHOLDER: Founder-approved sign-in meta description to be supplied").
- *Failure:* not a WCAG criterion but a shipped-scaffolding defect; the consent checkbox self-declaring "not final legal consent" while collecting personal data is a data-protection risk (PASS 1 C3).
- *Correction:* fold into the single interest capture, or remove the fields and placeholder strings.
- *Verification:* `grep -ri "placeholder\|legal review" ` over the rendered HTML of every reachable page returns nothing.

**A3 — Colour-only status risk on `/how-it-works` cards (to verify).**
- *Element:* the three "ways to travel" cards.
- *Failure (probable):* if status is conveyed by chip colour, that fails 1.4.1 (Use of Colour). Currently the status words are in the text ("Available now", "Not yet available"), so it likely passes — but the PASS 2 redesign adds coloured chips; keep the word inside the chip.
- *Correction:* every status chip carries its text label, never colour alone (the palette work already assumes this).
- *Verification:* greyscale the page; status is still legible.

### Passing, with real evidence (do not regress)

- **Alt text:** 0 missing across 71 images (crawl); alt strings audited against the actual photographs in the craft pass and 17 corrected. **1.1.1 — pass.**
- **Contrast:** computed from `tokens.css` and enforced by `pairings.test.ts`; text over the hero and Travel Self photographs was composited over the real pixels and measured ≥ 4:1 and ≥ 3:1 respectively. **1.4.3 — pass on what was measured** (arbitrary text-over-photo in-browser still UNMEASURED).
- **Focus visibility:** one global `:focus-visible` rule (3 px outline, `currentColor` proven ≥ 3:1 by the pairing test), guarded by `accessibility.test.ts`. **2.4.7 / 2.4.11 — pass in code.**
- **Reduced motion:** global `@media (prefers-reduced-motion: reduce)` block with `!important`, tested. **2.3.3 — pass.**
- **Touch targets:** `--touch-min: 48px` (≥ 44 px), used on interactive controls. **2.5.8 — pass in code** (needs a device check for real tap area).
- **Skip link + landmark:** "Skip to main content" → `#main-content`; `<main id="main-content" tabIndex={-1}>`. **2.4.1 — pass.**
- **Horizontal overflow:** the 21 grid tracks wider than 320 px were fixed to `minmax(min(…,100%),…)` and are guarded by a test. **Runtime overflow at specific widths is still UNMEASURED** (no browser).

### Cannot assert without a browser (UNMEASURED — see list)

Zoom-to-200 % reflow (1.4.10), focus **order** (2.4.3), screen-reader announcement of the slider/route-map/breadcrumb, INP for the quiz (2.5.x/perf), and a full axe/WAVE DOM pass. The route-map and questionnaire accessibility specifically need a real assistive-tech run; the markup looks correct (radios with `aria-label`, `aria-checked`, roving `tabindex`) but correct markup is not a passing screen-reader experience.

---

## SEO

### Is the deployment indexable at all? **No — triple-blocked, live, verified.**

| | |
|---|---|
| **Area** | Whole site (production) |
| **Score** | 1 |
| **Severity** | Critical |
| **Evidence (live, quoted)** | 1. Live homepage `<head>` contains `noindex,nofollow`. 2. Live `https://www.sawayatra.com/robots.txt` returns `User-Agent: *\nDisallow: /` (fetched with headers, `x-vercel-cache: HIT`). 3. Canonical, `og:url` and `og:image` are `http://localhost:3000/…` on every page. 4. `sitemap.xml` lists 20 `http://localhost:3000/…` locs. |
| **Problem** | Three independent blocks — the robots meta, the robots.txt disallow, and localhost canonicals — all stem from one unset variable, `NEXT_PUBLIC_SITE_URL`, on the Vercel production environment. |
| **Consequence** | The site cannot be indexed, and every shared link resolves its preview and canonical to `localhost` — broken. For a photography-led brand, shares that render nothing is the worst-case failure. |
| **Root cause** | Operational (env var unset) + one decision (canonical domain). |
| **Exact repair** | Decide `www.sawayatra.com` **or** `sawayatra.com`; set `NEXT_PUBLIC_SITE_URL=https://www.sawayatra.com` in Vercel → Production; redeploy. `robots.ts` and `app/_metadata.ts` already switch on it — the disallow, the noindex and the localhost URLs all resolve together. Add a host redirect from the non-canonical domain. |
| **Replacement** | n/a (config). |
| **Preserve** | The noindex-until-configured guard is correct behaviour; it just needs the variable now that you are live. |
| **Effort** | Small |
| **Dependency** | Canonical-domain decision (yours). |
| **Verification** | `view-source` shows `index,follow` + a `https://www.sawayatra.com/` canonical; `robots.txt` shows `Allow: /` and a real sitemap URL; Search Console "URL inspection" reports indexable; a WhatsApp paste shows the photograph. |

### Structured data — absent.

| | |
|---|---|
| **Area** | All pages |
| **Score** | 2 |
| **Severity** | High (once indexable) |
| **Evidence** | `application/ld+json` count = **0** on `/`, `/caravans/andean`, `/departures/desert-coast`, `/travel-self`, `/who-we-are`. |
| **Problem** | Nothing tells a search engine what these entities *are*. The brief asks whether search can distinguish Sawayatra, the Caravan, sections, the Travel Self and the three modes — with no structured data, it can only use titles. |
| **Consequence** | No rich results, no entity disambiguation, weaker ranking for "Andean Caravan" against literal geography. |
| **Root cause** | Technical (no JSON-LD emitted). |
| **Exact repair** | Emit JSON-LD from the metadata layer: `Organization` on `/` and `/who-we-are`; `TouristTrip` (or `Trip`) on `/caravans/andean` and each `/departures/[slug]` with `itinerary`, `touristType`, and an `Offer` whose `availability` maps to your status taxonomy (`https://schema.org/PreOrder` for "open for interest"); `BreadcrumbList` on section pages (the breadcrumb UI already exists). Do **not** emit `price`/`Offer.price` while price is "on request." |
| **Replacement** | A `JsonLd` server component injected per route, typed from the same `content/` data the page renders, so the markup and the structured data cannot disagree. |
| **Preserve** | Titles and descriptions, which are already good. |
| **Effort** | Medium |
| **Dependency** | The status→`availability` mapping (decide once); must not run before indexability is fixed (else you structure-mark a noindex page). |
| **Verification** | Google Rich Results Test on the deployed URL validates `Organization`, `TouristTrip`, `BreadcrumbList`; no `Offer.price` present. |

### Titles, descriptions, headings, canonicals, duplicates

- **Titles — good.** Unique, descriptive, "{Page} | Sawayatra" (home is "Sawayatra | One caravan. One long route."). No change.
- **Descriptions — good except two placeholders** (`/request-invitation`, `/sign-in` — A2). Fix those two.
- **H1 — one per page except `/start-here`** (A1). Fix that one.
- **Canonicals / sitemap / OG — localhost** (the C1 root cause). Fixed by `NEXT_PUBLIC_SITE_URL`.
- **Duplicate content — handled.** `/about`→`/who-we-are`, `/membership`→`/members`, `/do-it-yourself`→`/create-your-own-journey`, `/departures`→`/caravans/andean` are clean **301s** (tested in PASS 1). Not a duplicate-content problem.
- **Descriptive URLs — good.** `/departures/desert-coast`, `/caravans/andean` read well.
- **Can search distinguish the five entities?** By title, partly. Without structured data, no; and moot while noindex. Fix indexability, then structured data, then it can.

---

## The named hypotheses — verdicts

| Hypothesis | Verdict | Evidence |
|---|---|---|
| Hydration mismatch | **Unconfirmed — needs a browser console.** No hydration errors in the build or server logs I captured; the "Loading Sawayatra…" SSR string is a Suspense fallback, not a mismatch. Runtime client console UNMEASURED. |
| Horizontal overflow | **Reduced, not proven clear.** 21 fixed widths > 320 px fixed to `minmax(min(…,100%),…)`, guarded by a test. Runtime overflow at specific widths UNMEASURED. |
| ~53 MB image asset | **False (for the shipped site).** Largest served asset 1,058 KB; the multi-GB masters are gitignored, never under `public/`. |
| Image-sizing / LCP | **Sizing fixed; LCP UNMEASURED.** `sizes` capped at container width; AVIF/WebP per device; LCP needs Lighthouse. |
| Missing H1 / metadata | **True for exactly one page** (`/start-here`, 0 h1) **and two descriptions** (`/request-invitation`, `/sign-in` placeholders). Everything else has one H1 and a real description. |
| Duplicated navigation config | **False.** Single source `content/navigation.ts`; `site.ts` defines no nav. |
| Incomplete E2E coverage | **True in effect.** Three Playwright specs exist; none run in CI; none runnable here. |
| Missing structured data | **True.** Zero JSON-LD anywhere. |

---

## Findings grouped

**Confirmed problems:** indexability triple-block (SEO, Critical); zero structured data (SEO, High); `/start-here` no-H1/empty SSR (A11y+SEO, High); two placeholder meta descriptions (SEO/trust, Medium); two divergent route-map components (maintainability, Medium); E2E not in CI (maintainability, Medium).

**Probable, need a browser to confirm:** LCP impact of inlined CSS (Perf); per-route first-load JS budget (Perf, evidence silent); runtime horizontal overflow and zoom-200 % reflow (A11y); axe/WAVE DOM pass, focus order, screen-reader behaviour of slider/map/breadcrumb (A11y); hydration warnings (Arch).

**Strategic opportunities:** emit JSON-LD from the same `content/` the pages render (structure and markup can't diverge); add an E2E CI job with Chromium; unify the two map components; set a per-route JS budget once the analyzer names the two 320 KB chunks.

**Matters of subjective taste:** none material in this pass — the technical choices are defensible; `inlineCss` is a genuine trade-off to *measure*, not a taste call.

---

## Scores

| Dimension | Score | One-line justification |
|---|---|---|
| **Architecture & maintainability** | **8** | Single-source nav, enforced token contract, complete error boundaries, 159 tests + CI; held back by two map components and E2E outside CI. |
| **Performance** | **6** | Modest assets, good fonts, AVIF/WebP pipeline; the 500–640 KB inlined-CSS documents and the un-budgeted 1.63 MB JS are real risks I could not measure to a verdict. |
| **Accessibility** | **7** | Strong measurable basics — alt, headings, contrast, focus, reduced motion, touch size, skip link; one no-H1 page, and the whole rendered-DOM/AT layer is unverified without a browser. |
| **SEO** | **2** | Live-blocked from indexing three ways and zero structured data; titles/URLs/redirects are good underneath, so it recovers fast once `NEXT_PUBLIC_SITE_URL` is set. |

---

## Could not verify (this pass)

1. **LCP, CLS, INP** — no browser; no Lighthouse. The inlined-CSS HTML weight and JS total are real bytes; their effect on a real device is unmeasured.
2. **axe/WAVE DOM audit** — not runnable without a browser; static a11y facts are reported instead, clearly labelled.
3. **Per-route "First Load JS"** — Turbopack build did not emit the column; total client JS reported instead. Get it via `@next/bundle-analyzer` or `app-build-manifest.json`.
4. **Zoom to 200 % reflow, focus order, screen-reader behaviour** of the slider, route map and breadcrumb — markup inspected, runtime behaviour not.
5. **Hydration warnings** — not observable without the client console; none seen server-side.
6. **The three Playwright specs' pass/fail** — Chromium uninstallable in this sandbox; specs exist and are absent from CI, but were not executed this session.
7. **The two 320 KB JS chunks' contents** — not named without the analyzer.
8. **Nothing in this pass was measured on a physical tablet/phone**, which the "arm's length, ordinary light" lens ultimately requires.
