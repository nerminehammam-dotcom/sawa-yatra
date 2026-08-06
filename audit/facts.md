# audit/facts.md — Phase 0 reconnaissance

**Observations only. No judgements, no scores, no recommendations.**

Session date: 5 August 2026 · repo at `main`, HEAD `3489fd5` · working tree carries one modified file (`.gitignore`).

## Method and honesty statement

Every figure below was obtained from a tool run in this session. Where a value could not be
obtained, it reads `UNMEASURED` and says why.

Three environments are involved and they are not equivalent:

| Environment | Node | Used for |
|---|---|---|
| Linux sandbox (this session) | **v22.22.3** | `npm ci`, `npm run build`, all filesystem analysis |
| Nermine's Mac | **v26.0.0** (per brief, not verified in session) | Local dev |
| Vercel build image | **24.x** (read from project config this session) | Production |

`npm ci` and `npm run build` were run against an **isolated copy** at `/tmp/build-check`, never
against `/Users/mimou/Documents/Sawayatra - 01`. Running `npm ci` in a Linux sandbox against the
mounted folder would replace macOS-arm64 native bindings with Linux ones and break local dev. The
mounted `node_modules` was not touched.

Anything requiring a rendered browser — contrast, layout, tap targets, performance — is out of
scope for Phase 0 and is `UNMEASURED` here by design. That is Phase 2's harness.

---

## 0.1 Runtime and build

**Build status: clean.** `npm ci` (550 packages, 28s, exit 0) followed by `npm run build`
(exit 0) under Node v22.22.3. No warnings, no errors, no deprecation notices in the build log.

**Node version drift — three majors across three environments.** `engines` declares `>=20.9.0`.
The floor is satisfied everywhere, so nothing fails today.

- The build is verified at **v22.22.3 only**. It is **not** verified at v24.x (production) or
  v26.0.0 (local). *Inference: a clean build at v22 is weak evidence for v24 and v26, because the
  failures that appear across Node majors are usually native-binding and ESM-resolution failures,
  which is exactly the class `npm ci` resolves differently per platform.*
- Vercel project config reports `"nodeVersion": "24.x"`.
- The v26.0.0 local figure comes from the brief and was not verified in this session.

**Known environment limitation, carried forward from prior work:** `vitest` does not run in a
Linux sandbox against this repo's `node_modules` — rolldown ships macOS-arm64 native bindings.
`tsc --noEmit` and `eslint` do run. Unit tests are therefore `UNMEASURED` in this session and must
be run on the Mac.

**Vercel project facts** (read this session):

| Field | Value |
|---|---|
| Project | `sawayatra` / `prj_iHLGsmsgkKyRyZtA46dxAKUWYD1x` |
| Team | `team_h7JatSUbYYOi2LvX4EE8gath` |
| `live` | `false` |
| Latest production deployment | `dpl_27nxkJyAJQDzdyhHzUCUz3LBwJJE`, `READY` |
| Domains attached | `www.sawayatra.com`, `sawayatra.com`, `sawayatra.vercel.app`, `sawayatra-minou-s-projects.vercel.app`, `sawayatra-git-main-minou-s-projects.vercel.app` |

*Observation, not inference: the canonical domain is listed as undecided in the brief, but both
`sawayatra.com` and `www.sawayatra.com` are already attached to the project.*

---

## 0.2 Prior documents

### `docs/Sawayatra-prelaunch-plan.docx` (30 July 2026)

Establishes: 10 founder decisions, 20 sequenced work steps in 7 phases (B–G), a 16-line launch
gate, a tracker. Scope P0+P1. It also records four corrections to a lost audit — the form adapter
being a deliberate no-op, four working forms already existing, mock-facing copy shipping to
production, and the Atacama image being present rather than broken.

**Three of its own claims are contradicted by this session's findings. See 0.9.**

### `docs/audit-01-typography.md`

Undated. Branch `audit/typography`. Self-described scope: *"audit only. This document records the
current source; it does not implement Task 2 changes."*

**Method, verbatim:** *"The audit traced every tracked CSS `font-size` declaration capable of
producing visible text below `0.875rem`/14px, then traced the associated CSS Module into JSX/TSX
and local content data. A grouped CSS rule counts as one declaration."*

**It is a static source read.** No browser, no devtools, no computed-style dump, no screenshot, no
script is named. Every px figure in it is arithmetic — rem × 16 — resting on the stated assumption
that *"the browser default root of 16px remains in effect at every breakpoint"*, itself inferred
from the absence of any `html`/`:root` declaration.

**Its headline totals** (to be verified, not re-derived, in Phase 1):

| Metric | Its figure |
|---|---:|
| Declarations below 0.875rem | 78 |
| Verified visible rendered uses below 0.875rem | 73 |
| Decision facts | 54 |
| Decorative labels | 11 |
| Mixed-use selectors | 8 |
| Valid exclusions | 1 |
| Dead or unused rules | 4 |
| Unresolved rendered uses | 0 |
| Ambiguous cases | 0 |
| Decision facts ≥0.875rem still uppercase or over-tracked | 9 |

Ten distinct below-threshold absolute values, plus one relative `0.72em`: 0.68 / 0.7 / 0.72 /
0.74 / 0.75 / 0.78 / 0.8 / 0.8125 / 0.82 / 0.86 rem.

**Figures it asserts without showing evidence** — these are the ones Phase 1 should verify first:

1. The 16px root "at every breakpoint". Every other px figure depends on it.
2. Body clamp resolved values: 16px @320, "approximately 16.73px" @768, "approximately 17.29px"
   @1024, 18px max before 1440. No arithmetic shown; "approximately" signals estimation.
3. The entire totals block above. Counting *rules* are given; the count itself is not derived, and
   no file list or glob demonstrates full coverage.
4. `"Total unresolved rendered uses: 0"` and `"Total ambiguous cases: 0"` — completeness claims
   with no coverage evidence.
5. `.countryLabels text` at 24px / 5px tracking, asserted identical across two implementations,
   given in px with no rem equivalent and no stated source (SVG attribute vs CSS).
6. `"Breakpoint variants: None found"` — a negative claim repeated 70+ times with no statement of
   how media queries were searched.
7. That both `CaravanRouteMap` implementations carry `.stopButton`/`.stopLabel` at 0.68rem. Its
   own table shows the two files differ elsewhere (`.orientation ul` 0.86 vs 0.8rem;
   `.quickFacts small` 0.72 vs 0.68rem; `.mapNote` 0.72 vs 0.68rem), so per-file re-verification
   is warranted.

**What it explicitly could not verify:** five selectors with no traced route
(`DepartureFilters .legend`, `StatusBadge .root`, `how-it-works .routeLine span`,
`how-it-works .journeyFacts dt`, the `FieldDocument` hero members belonging to an unimported
`CinematicHero`); all rendered/layout behaviour — marker geometry, stop-label collisions, nav
wrapping — which it defers to a render-check it did not perform.

**Categories it contains nothing on:** contrast ratios, line length / measure, line-height,
font-weight. Several of its recommendations ("a comfortable measure", "reading-family medium
weight", "retain emphasis through weight") rest on no recorded baseline.

---

## 0.3 Route inventory

32 `page.tsx` files under `app/(public)`. Build output confirms 39 entries including
`/api/forms/[kind]`, `/icon`, `/robots.txt`, `/sitemap.xml`, `/_not-found`, and the SSG expansion
of `/departures/[slug]` into 10 paths.

`loc` is the page file's own line count. `inline` counts string literals of 25+ characters written
directly in the page file. Neither is a rendered word count — rendered prose is
`UNMEASURED` in Phase 0 because most of it arrives from `content/` or child components.

| Route | loc | inline | Kind | content modules imported |
|---|---:|---:|---|---|
| `/` | 68 | 17 | real | `field-document` |
| `/404` | 10 | 1 | real | — |
| `/about` | 102 | 87 | real | `andean-caravan-images` |
| `/accessibility` | 13 | 2 | legal placeholder | `legal-placeholders` |
| `/caravans` | 134 | 50 | real | `andean-caravan`, `andean-caravan-images` |
| `/caravans/andean` | 7 | 0 | **re-export of `/departures`** | — |
| `/caravans/andean-caravan/how-it-works` | 165 | 157 | real | — |
| `/caravans/andean/route-map` | 13 | 2 | real | — |
| `/caravans/egyptian` | 13 | 20 | **STUB** | — |
| `/caravans/indian` | 13 | 20 | **STUB** | — |
| `/caravans/the-andean-caravan` | 14 | 2 | **re-export of `/departures/[slug]`** | — |
| `/caravans/who-else-is-travelling` | 13 | 32 | **STUB** | — |
| `/contact` | 86 | 4 | real, has form | — |
| `/create-your-own-journey` | 13 | 57 | **STUB** | — |
| `/departure-dates` | 14 | 23 | **STUB** | — |
| `/departures` | 143 | 16 | real | `andean-caravan`, `andean-caravan-images` |
| `/departures/[slug]` | 610 | 411 | real, largest page | 4 modules |
| `/do-it-yourself` | 41 | 2 | real | — |
| `/how-it-works` | 188 | 68 | real | — |
| `/joining-points` | 39 | 2 | real | `field-document` |
| `/journeys` | 13 | 28 | **STUB** | — |
| `/members` | 7 | 0 | **re-export of `/membership`** | — |
| `/membership` | 34 | 0 | real | `membership` |
| `/partners` | 13 | 19 | **STUB** | — |
| `/privacy` | 13 | 2 | legal placeholder | `legal-placeholders` |
| `/register-interest` | 13 | 19 | **STUB** | — |
| `/request-invitation` | 40 | 2 | real, has form | `site` |
| `/sign-in` | 58 | 3 | real, has form | `site` |
| `/start-here` | 85 | 10 | real, has form | `archetypes`, `field-document` |
| `/terms` | 13 | 2 | legal placeholder | `legal-placeholders` |
| `/travel-self` | 47 | 5 | real, the instrument | `travel-self/families` |
| `/who-we-are` | 7 | 0 | **re-export of `/about`** | — |

### Stub census

**8 of 32 routes (25%) render `ComingSoonPage`:** `/caravans/egyptian`, `/caravans/indian`,
`/caravans/who-else-is-travelling`, `/create-your-own-journey`, `/departure-dates`, `/journeys`,
`/partners`, `/register-interest`.

Against `content/navigation.ts`: primary navigation has 6 items, of which **3 are stubs**
(`/journeys`, `/create-your-own-journey`, `/departure-dates`) — **50% of the primary navigation**.
Utility navigation has 3 items, of which **1 is a stub** (`/partners`) — 33%.

### Duplicate-URL census — four pairs

| URL | Renders | Its own canonical? |
|---|---|---|
| `/members` | `/membership`'s default export | yes, self |
| `/who-we-are` | `/about`'s default export | yes, self |
| `/caravans/andean` | `/departures`' default export | yes, self |
| `/caravans/the-andean-caravan` | `/departures/[slug]` with `slug: "the-andean-caravan"` | yes, self |

`content/site.ts` builds every entry with `canonicalPath: path`, so each of the eight URLs
self-canonicalises. None of these four is in the `noIndex` list. *Inference: when indexing is
enabled, four pairs of byte-identical pages become four pairs of competing URLs.*

3 legal routes (`/privacy`, `/terms`, `/accessibility`) render `LegalPlaceholderPage`.

---

## 0.4 The content split

23 typed files under `content/`. `contentStatus` census across all of them:

| Status | Occurrences |
|---|---:|
| `DRAFT` | 78 |
| `LOCKED` | 41 |
| `PLACEHOLDER` | 31 |
| `LEGAL REVIEW` | 4 |

10 files contain `TO_BE_CONFIRMED`, `PLACEHOLDER` or `"To be confirmed"`: `archetypes`, `assets`,
`faq`, `field-document`, `forms`, `journeys`, `legal-placeholders`, `membership`, `quiz`, `site`.

### The split is not a split. It is a fork.

The brief anticipated a division between typed content and copy embedded in TSX. What is actually
present is **a substantial body of typed content that nothing imports**, sitting alongside pages
that render their own hardcoded copy instead.

Orphan census — exported symbols in `content/` referenced nowhere under `app/`, `components/` or
`lib/`:

| File | Used / total exports | Orphaned exports |
|---|---|---|
| `content/site.ts` | **5 / 11** | `homeContent`, `howItWorksContent`, `travelSelfPageContent`, `departuresPageContent`, `journeyDetailContent`, `aboutContent` |
| `content/quiz.ts` | **0 / 2** | `quizQuestions`, `quizContent` |
| `content/faq.ts` | **0 / 1** | `faqItems` |
| `content/membership.ts` | 1 / 3 | `membershipPromises`, `membershipTiers` |
| `content/legal-placeholders.ts` | 3 / 5 | `legalPages`, `cookieNoticeDecision` |
| `content/journeys.ts` | 1 / 3 | `journeyBySlug`, `journeySlugs` |
| `content/field-document.ts` | 2 / 4 | `reservedHomeSections`, `approvedHomeSections` |
| `content/andean-caravan.ts` | 5 / 8 | `ANDEAN_CARAVAN_PUBLIC_DATE`, `andeanCaravanGates`, `andeanCaravanSectionById` |
| `content/andean-caravan-images.ts` | 3 / 5 | `andeanCaravanSectionGalleries`, `andeanCaravanSectionImages` |
| `content/travel-self/travel-self-model-legacy.ts` | 12 / 30 | 18 including `scoreAxes`, `recommendSections`, `recommendSection`, `experientialFit`, `confidenceFor`, `SECTION_FIT_WEIGHTS`, `PASSION_WEIGHTS` |
| `content/travel-self/travel-self-model.ts` | 34 / 46 | 12 including `COMPARISON_AXES`, `DISTANCE_BANDS`, `GROUP_THRESHOLD`, `GROUP_MIN_MEMBERS`, `RESULT_INVENTORY_HEADING` |
| `content/travel-self/families.ts` | 2 / 3 | `FAMILY_KEYS` |

Fully consumed: `andean-caravan-destinations`, `andean-caravan-route`, `andean-map-geometry`,
`archetypes`, `assets`, `forms`, `navigation`, `travel-self/axes`, `travel-self/copy`,
`travel-self/motivation`, `travel-self/passions`.

### A third content location

*Added in Phase 1:* `app/(public)/caravans/andean-caravan/how-it-works/_content.ts` (148 lines) is
a page-local content module outside `content/` entirely. It carries the gate table, the section
table, and `approvedFaq`. It is the source of both the date and the altitude contradictions
recorded in `audit/static.md` §1.6.

### Copy hardcoded in TSX

Page and component files containing string literals of 40+ characters that are not class names,
imports, ARIA values or paths. Ranked:

| File | Count |
|---|---:|
| `app/(public)/caravans/andean-caravan/how-it-works/page.tsx` | 27 |
| `app/(public)/departures/[slug]/page.tsx` | 19 |
| `app/(public)/caravans/_components/CaravanRouteMap.tsx` | 12 |
| `components/departures/CaravanRouteMap.tsx` | 11 |
| `app/(public)/travel-self/TravelSelfQuestionnaire.tsx` | 11 |
| `app/(public)/how-it-works/page.tsx` | 8 |
| `app/(public)/departures/page.tsx` | 8 |
| `.../how-it-works/_components/GateSelector.tsx` | 7 |
| `app/(public)/about/page.tsx` | 6 |
| 16 further files | 1–3 each |

*Observation: the four pages with the most embedded copy — `caravans/andean-caravan/how-it-works`,
`departures/[slug]`, `how-it-works`, `about` — are precisely the four whose typed content objects
(`howItWorksContent`, `journeyDetailContent`, `departuresPageContent`, `aboutContent`) are
orphaned. Inference: these pages were rewritten in TSX and their content modules were left behind
rather than deleted.*

*Consequence for governance, stated as inference: the `contentStatus` census in the table above
counts statuses on content that does not render. It cannot be read as a measure of how much
placeholder text a visitor sees.*

### `CaravanRouteMap` exists twice

`components/departures/CaravanRouteMap.tsx` and
`app/(public)/caravans/_components/CaravanRouteMap.tsx`, each with its own `.module.css`. The
typography audit's own table shows the two stylesheets differ in at least three declarations.
Which one renders on which route is **UNMEASURED** in Phase 0.

---

## 0.5 Environment variables

**Read anywhere in the codebase — two, total:**

| Variable | Read at |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `lib/site-url.ts:3` |
| `NODE_ENV` | `app/_metadata.ts:9`, `app/robots.ts:11`, `lib/travel-self-events.ts:43` |

**Declared in `.env.example` but read nowhere in code:**

- `NEXT_PUBLIC_FORM_MODE` — commented as "Release 1 runs safely without credentials. Forms use the
  documented mock adapter." No code reads it. The mock is unconditional.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — commented as "Analytics remains disabled until the domain,
  consent decision, and privacy basis are approved." No code reads it.
- `RESEND_API_KEY` and `SAWAYATRA_FORM_ENDPOINT` — commented out in the example, read nowhere.

**`.env.local` contains exactly one key: `VERCEL_OIDC_TOKEN`.** `NEXT_PUBLIC_SITE_URL` is unset
locally, so `lib/site-url.ts` falls through to its `http://localhost:3000` default.

**Production status of `NEXT_PUBLIC_SITE_URL` on Vercel: UNMEASURED directly** — the project's
environment-variable list was not read this session. It is measured *indirectly* and conclusively
by 0.8 below.

---

## 0.6 `/sign-in` and `/members`

**`/sign-in`** (58 lines) renders a real page: a `ContentStatusLabel`, eyebrow, `h1`, lead
paragraph from `signInContent` in `content/site.ts`, two `ButtonLink`s, and a
`SignInInterestForm`. That form posts `{ email }` against `signInInterestSchema` to
`/api/forms/sign-in-interest`.

There is **no authentication provider, no session, no callback route, no middleware and no
protected route** anywhere in the tree. `/sign-in` is an interest-capture form wearing the name of
an auth page. It is in the `noIndex` list.

**`/members`** is seven lines: `export default MembershipPage`, a direct re-export of
`/membership`. It has its own metadata entry and its own self-canonical, and it is **not** in the
`noIndex` list.

**`/membership`** (34 lines) renders `membershipContent.hero` plus four sentences written inline,
including: *"Prices, tiers and conditions are not being published before they are ready."* It does
**not** render `membershipPromises` or `membershipTiers` — both orphaned.

---

## 0.7 Analytics, consent and tag management

**None exists.** Zero occurrences anywhere in `app/`, `components/`, `lib/`, `content/`,
`next.config.ts` or `package.json` of: Plausible, Google Analytics, `gtag`, GTM, Segment, PostHog,
Mixpanel, Fathom, Umami, `@vercel/analytics`, `@vercel/speed-insights`.

The word "consent" appears only in two unrelated contexts: a `ConsentField` checkbox component
used by the forms, and a `consentSteps` narrative list on `/how-it-works` describing how a private
introduction opens.

There is **no cookie banner, no consent manager, no tag container, and no disabled analytics
component**. `content/legal-placeholders.ts` exports `cookieNoticeDecision` — `{ required:
TO_BE_CONFIRMED, notice: "PLACEHOLDER — Cookie requirements and approved notice copy are to be
confirmed.", contentStatus: "LEGAL REVIEW" }` — and it is orphaned.

*Correction to the brief's framing, stated as observation: the brief describes analytics and
consent as "disabled placeholders". The placeholders exist only as two unread lines in
`.env.example` and one orphaned object. In code there is nothing to enable. Activation is a build,
not a flag.*

**Consequence for real-user performance data:** there is none, and never has been. All Phase 2
performance figures will be lab figures.

---

## 0.8 Production metadata, measured this session

Fetched from `https://sawayatra.vercel.app/` via the Vercel MCP fetch tool, 5 August 2026.
These are observed strings from the live production HTML, not source reads.

| Tag | Live value |
|---|---|
| `og:url` | `http://localhost:3000` |
| `og:image` | `http://localhost:3000/assets/images/social-sawayatra-r1.webp` |
| `twitter:image` | `http://localhost:3000/assets/images/social-sawayatra-r1.webp` |
| `og:image:width` / `height` | `1200` / `630` |
| `robots` | `noindex, nofollow` |
| `googlebot` | `noindex, nofollow` |
| `description` | `One annual caravan through Peru, Bolivia and Chile. Join at a designated point and leave when your part of the route is complete.` |

**This confirms `NEXT_PUBLIC_SITE_URL` is unset in the Vercel production environment.** Every
absolute URL in production metadata resolves to `localhost:3000`.

**On the mechanism.** There is no hardcoded host anywhere. `lib/site-url.ts` already reads
`NEXT_PUBLIC_SITE_URL` and exposes `absoluteUrl()` and `isProductionDomainConfigured`.
`app/robots.ts` and `app/_metadata.ts` already gate indexing on
`NODE_ENV === "production" && isProductionDomainConfigured`. *Inference: the `noindex` is not a
line someone must remember to delete — it is already a single derived flag whose launch trigger is
setting one environment variable, and setting that same variable fixes the social-card host in the
same move.*

**The geography contradiction is live.** The production description says *"Peru, Bolivia and
Chile"*. Source: `approvedRouteDescriptions.journey` in `content/site.ts`. Not resolved — routed
to `audit/pending-decisions.md` per the brief.

---

## 0.9 Where this session's findings contradict the prior documents

Recorded as observations. No judgement is offered on why.

**1. The placeholder FAQ is not rendered — but a different, real FAQ is.** `content/faq.ts`
exports `faqItems` (8 entries, all `PLACEHOLDER`), and nothing imports it. The prelaunch plan
describes those eight as a visitor-facing state; they are not rendered anywhere.

*Corrected in Phase 1:* `components/ui/Faq` does render, on exactly one route —
`/caravans/andean-caravan/how-it-works` — fed by `approvedFaq` in that page's own
`_content.ts`. Five questions, all with real answers, including "Do I need to be fit?" and
"What's the hardest day?". So the site has an FAQ; it is on one page, it is not the one in
`content/`, and it is not reachable from the membership surface.

**2. The membership page does not render the five promises.** `membershipPromises` and
`membershipTiers` are orphaned. `/membership` renders `membershipContent.hero` plus four inline
sentences, one of which states plainly that prices, tiers and conditions are not being published
yet. The prelaunch plan describes a page making five promises with `TO_BE_CONFIRMED` descriptions.

**3. The legal pages do render placeholders**, but via `legalPageById`, not the orphaned
`legalPages` export.

**4. The `noindex` and `metadataBase` mechanisms already exist** as env-driven derived flags. See
0.8.

**5. The group-matching maths already exists and is unwired.** `content/travel-self/travel-self-model.ts`
exports `COMPARISON_AXES`, `DISTANCE_BANDS`, `GROUP_THRESHOLD = 0.6` and `GROUP_MIN_MEMBERS = 5`,
all orphaned. `travel-self-model-legacy.ts` additionally exports `scoreAxes`, `experientialFit`,
`recommendSection`, `recommendSections`, `SECTION_FIT_WEIGHTS` and `PASSION_WEIGHTS`, also
orphaned. *Inference, flagged as inference: build item 5.1 may be substantially closer to existing
than "unbuilt" implies — the scoring exists, it is the wiring to the rendered page that does not.
This must be verified before 5.1 is scoped.*

---

## 0.10 Carried into Phase 1 as open questions

- Which `CaravanRouteMap` implementation renders on which route, and is the other dead?
- Do the orphaned `content/site.ts` objects predate or postdate the TSX copy that replaced them?
- Do `scoreAxes` / `recommendSections` / `experientialFit` in the legacy model still function
  against the current model's data shapes?
- Is `content/quiz.ts` — a six-question tuple, five of six `placeholderQuestion()`, labelled
  `"DRAFT — interface demonstration only"` — retained deliberately?
- What is the true Travel Self question count as rendered? Copy says "Eight short questions" in
  three places and "Six honest questions" in two, one of which is the orphaned `quiz.ts`.
- Are the four duplicate-URL pairs intentional aliases, and should three of them redirect?

## 0.11 Not measured in Phase 0, by design

`UNMEASURED`, deferred to Phase 2's harness: all contrast ratios; all rendered font sizes; line
length; tap-target sizes; focus behaviour; keyboard order; axe results; LCP, CLS, TBT, byte
weight; console errors; rendered prose word counts.

`UNMEASURED`, deferred to Phase 1: internal and external link resolution; India/Egypt removal
debris; the full font-size and spacing enumeration; the complete content-contradiction scan.

`UNMEASURED`, no route available this session: unit tests (`vitest` cannot run in this sandbox);
the Vercel project's environment-variable list read directly; behaviour under Node 24.x or 26.0.0.
