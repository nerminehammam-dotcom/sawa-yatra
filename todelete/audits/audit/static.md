# audit/static.md — Phase 1, static audit

Repo-only findings, plus production metadata read live. 5 August 2026 · `main` @ `3489fd5`.

**Method.** Everything below was obtained from a tool run in this session: filesystem analysis of
an isolated copy of the repo, a TypeScript compile test, and live fetches of the production
deployment via the Vercel MCP fetch tool. Nothing rendered in a browser was measured — that is
Phase 2. Where a value could not be obtained it reads `UNMEASURED`.

**Orphaned content is reported, not touched**, per the decision taken after Phase 0. No orphan has
been deleted or wired.

---

## Headline

**The typography audit is stale and must not be used as a work list.** It describes 78 declarations
below 0.875rem. There are now **8** below 14px. 52 commits landed on `main` after that branch's
HEAD. Detail in §1.5.

**One page states the caravan runs a year earlier than every other surface says.** Detail in §1.6.

**Build item 5.1 cannot reuse the existing scoring engine.** The two Travel Self models share one
axis identifier out of six. Proved by compile error in §1.10.

---

## 1.1 Canonical URL and metadata

**The mechanism the brief asks for already exists.** There is no hardcoded host anywhere in the
codebase. `lib/site-url.ts` reads `NEXT_PUBLIC_SITE_URL` and falls back to `http://localhost:3000`
for development only. Every absolute URL in the app is built through `absoluteUrl()` or
`metadataBase`:

| Site | Construction |
|---|---|
| `app/layout.tsx:13` | `metadataBase: new URL(siteUrl)` |
| `app/_metadata.ts:23,33,48` | social image, `alternates.canonical`, `openGraph.url` |
| `app/robots.ts:19,28` | sitemap URL |
| `app/sitemap.ts:21,27` | every entry |
| `app/(public)/travel-self/page.tsx:26` | share URL |
| `app/(public)/departures/[slug]/page.tsx:577` | journey canonical |

The only other `new URL(` calls are six client-side `new URL(window.location.href)` in the Travel
Self components, which are correct by construction. `components/brand/RouteGateMark.tsx:24` is an
SVG namespace, not a link.

**No code change is required for the mechanism.** The production failure is one unset environment
variable — `NEXT_PUBLIC_SITE_URL` is not set on Vercel, confirmed by live fetch (`og:url` =
`http://localhost:3000`, recorded in `audit/facts.md` §0.8). Setting it is a launch decision, not
an engineering task, because it also flips indexing on. Routed to `audit/pending-decisions.md`.

### A real defect: one page emits the homepage's canonical and social card

`/caravans/andean-caravan/how-it-works` does **not** use `createPageMetadata`. It declares its own
`metadata` object at `page.tsx:13` containing only `title` and `description`. Next merges the rest
from the root layout, which spreads `createPageMetadata("/")`.

**Measured live on production this session:**

```
<link rel="canonical" href="http://localhost:3000">
<meta property="og:url" content="http://localhost:3000">
<meta property="og:title" content="Sawayatra | One c…">   ← the homepage title
<meta name="robots" content="noindex, …">
```

The page's own title, "Hop on, hop off", does not reach `og:title`. Its canonical points at the
homepage. `robots` is correctly inherited as `noindex`, so this is latent rather than live damage —
but it is the only public route outside the metadata system.

The same page is absent from `content/site.ts` `routeMetadata`, from the `StaticRoute` union in
`lib/types.ts`, and therefore from `app/sitemap.ts`.

**Fix:** add the route to `routeMetadata` and `StaticRoute`, then replace the inline object with
`createPageMetadata()`. No undecided surface is touched — this is structure, not words. Committable
to `main`.

---

## 1.2 The `noindex` switch

**Also already a single documented flag.** `app/_metadata.ts:9` and `app/robots.ts:11` both derive
from the same expression:

```ts
const isIndexableEnvironment =
  process.env.NODE_ENV === "production" && isProductionDomainConfigured;
```

There is no line for anyone to remember to delete. **The named launch trigger is: set
`NEXT_PUBLIC_SITE_URL` in the Vercel production environment.** That single action simultaneously
switches `robots` from `noindex, nofollow` to `allow`, fixes every `og:` and `twitter:` absolute
URL, and populates `host` in `robots.txt`.

Per-route suppression is layered on top and is finer-grained than the brief assumed:
`routeMetadata` marks eleven ids `noIndex: true` — `do-it-yourself`, `sign-in`, `not-found`,
`indian-caravan`, `egyptian-caravan`, `who-else-is-travelling`, `departure-dates`, `journeys`,
`create-your-own-journey`, `partners`, `register-interest`. Every stub is covered.

There is additionally a `descriptionStatus !== "PLACEHOLDER"` gate, so any route whose meta
description is still a placeholder will not be indexed even after launch. That is a well-built
mechanism.

**No work required.** Documented here so the trigger is written down.

---

## 1.3 India / Long Descent / Egypt removal debris

**They have not been removed.** Both remain as live, reachable stub routes, and both are still
presented as forthcoming products.

| Surface | Path | State |
|---|---|---|
| Route | `app/(public)/caravans/indian/page.tsx` | live, renders `ComingSoonPage` |
| Route | `app/(public)/caravans/egyptian/page.tsx` | live, renders `ComingSoonPage` |
| Type union | `lib/types.ts:30–31` | both listed as `StaticRoute` |
| Metadata | `content/site.ts:79–80` | titles "The Indian Caravan \| Sawayatra", "The Egyptian Caravan \| Sawayatra" |
| Descriptions | `content/site.ts:34–37` | "…is in development. Approved route information will be added when it is ready." |
| Indexing | `content/site.ts:139–140` | both `noIndex: true` |
| Sitemap | `app/sitemap.ts` | excluded via the `noIndex` filter |
| **Caravans submenu** | `content/navigation.ts:85–95` | **"The Indian Caravan — Coming soon", "The Egyptian Caravan — In planning"** |
| **Caravans index page** | `app/(public)/caravans/page.tsx:18–27` | **both listed as cards with links** |

**No "Long Descent" string exists anywhere** in `app/`, `components/`, `lib/`, `content/` or
`public/`. Nothing to clean there.

**No orphaned assets.** `public/` contains no file matching `india`, `egypt` or `descent`.
`public/assets/images/` holds four entries: `departures/` (containing only `andean/`), `home/`,
`how-it-works/`, `travel-self/`, plus `social-sawayatra-r1.webp`.

**No dead links, no stale redirects, no sitemap entries pointing at nothing.** Every reference
resolves to a route that exists and returns 200.

**So the debris is not broken plumbing — it is two products still being advertised.** Whether they
leave the Caravans submenu and the Caravans index is a content decision, since the labels "Coming
soon" and "In planning" are claims about the roadmap. Routed to `audit/pending-decisions.md`.

---

## 1.4 Stub census

**8 of 32 public routes (25%) render `ComingSoonPage`:** `/caravans/egyptian`, `/caravans/indian`,
`/caravans/who-else-is-travelling`, `/create-your-own-journey`, `/departure-dates`, `/journeys`,
`/partners`, `/register-interest`.

**As a proportion of navigation:**

| Navigation set | Items | Stubs | Share |
|---|---:|---:|---:|
| Primary (`primaryNavigation`) | 6 | 3 | **50%** |
| Utility (`utilityNavigation`) | 3 | 1 | 33% |
| Caravans submenu — "Choose" (`caravansNavigation.choose`) | 3 | 2 | 67% |
| Caravans submenu — "Join" (`caravansNavigation.join`) | 3 | 1 | 33% |
| Footer (`footerNavigation` = primary + 3 legal) | 9 | 3 | 33% |
| Announcement banner action | 1 | 1 | **100%** |

The three primary-navigation stubs — `/journeys`, `/create-your-own-journey`, `/departure-dates` —
appear **twice** each, in the header and again in the footer, because `footerNavigation` spreads
`primaryNavigation`.

The announcement banner appears on every route and its only action points at `/register-interest`,
which is a stub.

Additionally, 3 routes render `LegalPlaceholderPage`: `/privacy`, `/terms`, `/accessibility`.

**Summary figure for the Phase 3 report: 11 of 32 routes (34%) render placeholder content of one
kind or the other, and half the primary navigation is a dead end.**

---

## 1.5 Type and spacing scales — and the stale typography audit

### Measured this session

| Metric | Value |
|---|---:|
| `font-size` declarations across all CSS Modules | **342** |
| Distinct values | **136** |
| Distinct `clamp()` expressions | **95** |
| `clamp()` expressions used exactly once | **86** |
| Distinct values of any kind used exactly once | **107** |
| Declarations resolving below 14px (static values only) | **8** |
| Distinct sub-14px values | **4** |

The four sub-14px values, all in `app/(public)/travel-self/travel-self.module.css`:

| Value | px @16 root | Uses | Selectors |
|---|---:|---:|---|
| `0.72rem` | 11.52 | 1 | `.otherFamilies li span` |
| `0.75rem` | 12.00 | 2 | `.panelEyebrow, .progress, .passport dt` · `.resultEyebrow` |
| `0.8rem` | 12.80 | 2 | line 376 · `.otherFamilies li p` |
| `0.8125rem` | 13.00 | 3 | line 92 · `.passportHead > p:first-child` · `.passportBody dt, .passportFriction dt` |

Three relative declarations remain: `1.1em` (travel-self), `1.35em` (andean how-it-works),
`0.72em` (how-it-works).

Files carrying the most `font-size` declarations: `travel-self.module.css` **64**, `home.module.css`
24, `caravans/_components/CaravanRouteMap.module.css` 24,
`components/departures/CaravanRouteMap.module.css` 23, `how-it-works.module.css` 19.

### Discrepancies against `docs/audit-01-typography.md` — reported, as instructed

| Its claim | Measured now | Verdict |
|---|---|---|
| 78 declarations below 0.875rem | 8 below 14px | **Contradicted** |
| 73 verified visible rendered uses below 0.875rem | 8 declarations exist at all | **Contradicted** |
| Ten distinct below-threshold values incl. 0.68 / 0.7 / 0.74 / 0.78 / 0.82 / 0.86rem | **None of those six values exists as a `font-size` anywhere.** `0.7rem` survives only as a `height:` and a `margin:`; `0.78rem` only inside a `padding:` shorthand | **Contradicted** |
| `.stopButton` and `.stopLabel` at 0.68rem on both route maps — its highest-risk finding | Neither value exists | **Contradicted** |
| `.countryLabels text` at 24px / 5px tracking | `24px` appears twice in the corpus — consistent | **Consistent** |
| 54 decision facts / 11 decorative labels / 8 mixed-use / 4 dead | Not re-derived; the population they describe no longer exists | **Moot** |

**Cause, established this session, not inferred:** `audit/typography` is an ancestor of `main`. Its
HEAD is dated **2026-07-26 00:11:30 +0300**; `main` HEAD is **2026-07-30 16:04:16 +0300**. **52
commits** landed on `main` in between, including `ba34040 "Adopt Fraunces variable font and phase-0
design fixes"` and a Travel Self rebuild spanning roughly fifteen commits.

**Consequence.** The typography audit was accurate when written and is now a historical document.
Its seven-item "Recommended Task 2 plan" targets selectors and values that no longer exist. Using
it as a work list would produce edits against dead code. Its *method* remains sound and its list of
five unverifiable selectors is still worth checking.

**What has not been fixed** is the absence of a scale. 136 distinct values, 107 of them used
exactly once, is not a system. That figure is unchanged in character even though the sub-14px
population has been cleared.

**Note on the earlier prelaunch plan.** It repeats "over 110 bespoke clamp() expressions used
exactly once". Measured: **86**. Corrected here.

### Spacing

| Metric | Value |
|---|---:|
| `padding` / `margin` / `gap` declarations | **749** |
| Distinct whole values | **221** |
| Distinct individual tokens | **106** |
| Distinct raw `rem` step values | **57** |

Unlike type, **a spacing scale does exist**: `styles/tokens.css:83–95` defines thirteen steps,
`--space-1` through `--space-32`. They are used heavily — `--space-4` 85 times, `--space-8` 70,
`--space-6` 62, `--space-3` 60, `--space-2` 52, `--space-5` 47, `--space-12` 28, `--space-16` 21 —
alongside `--page-gutter` (51) and `--section-space` (20).

So spacing is a **partially adopted** system: roughly 425 token uses sitting beside 57 distinct
hand-written `rem` values (0.125 through 11.0) and viewport units (`5vw` 20, `6vw` 19, `4vw` 18).

*Observation, not judgement: the contrast between spacing (a defined scale, partially adopted) and
type (no scale at all) suggests the type scale is an omission rather than a philosophy.*

---

## 1.6 Content contradictions

### A. Departure dates — three different windows, one of them a year out

| Window | Where |
|---|---|
| **February 2028** | `content/navigation.ts:65` — the announcement banner, on **every route** |
| **February–April 2028** | `content/andean-caravan.ts:2`, `content/site.ts:394`, `app/(public)/departures/[slug]/page.tsx:38,340,470`; nine per-section `publicDateWindow` values running Feb 2028 → April 2028 |
| **January–April 2027** | `app/(public)/caravans/andean-caravan/how-it-works/page.tsx:38` (page eyebrow) and `_components/GateSelector.tsx:338` (`<dt>Window</dt><dd>January–April 2027</dd>`) |
| **February 2027** | `content/journeys.ts:15` — `dateLabel`. `journeys` is imported by nothing outside `content/`; **not rendered** |

`/caravans/andean-caravan/how-it-works` is a real 165-line page, linked from the Caravans submenu
as "Hop on, hop off", and it tells a visitor the caravan runs **January–April 2027** — twelve months
before the banner above it on the same screen says the first departure is February 2028.

The two are visible simultaneously: the announcement banner renders on all routes.

### B. Altitudes — two parallel datasets, six disagreements

`content/andean-caravan-destinations.ts` carries precise altitudes with external citations to
national statistics institutes. `app/(public)/caravans/andean-caravan/how-it-works/_content.ts`
carries rounded altitudes with no source. Both render.

| Place | `andean-caravan-destinations.ts` (cited) | `_content.ts` (uncited) | Δ |
|---|---:|---:|---:|
| Arequipa | 2,337 m | 2,335 m | 2 |
| San Pedro de Atacama | 2,407 m | 2,400 m | 7 |
| Cusco | 3,414 m | 3,400 m | 14 |
| La Paz | 3,631 m | 3,640 m | 9 |
| Uyuni | 3,656 m | 3,650 m | 6 |
| Puno / Titicaca | 3,812 m | 3,800 m | 12 |

Individually trivial. Collectively it means the site holds two altitude tables for the same six
places, one sourced and one not, and a visitor comparing pages sees different numbers.

**Also inconsistent:** `content/andean-caravan.ts:336` says the Lagunas refuges are "above **4,300
metres**"; `_content.ts:107` gives The Mirror a `maximumAltitude` of "**4,900 m**" and its
`physicalNotice` says "Three Lagunas nights use simple high-altitude refuges". Not strictly
contradictory — refuge altitude and section maximum are different measures — but the two figures
describe the same nights and are 600 m apart.

### C. Route geography — live in production

`content/site.ts` → `approvedRouteDescriptions.journey`:

> "One annual caravan through **Peru, Bolivia and Chile**. Join at a designated point and leave when
> your part of the route is complete."

Confirmed live in the production `<meta name="description">` this session. Meanwhile
`content/navigation.ts:78` describes the same product as "**71 days, Lima to Patagonia**", and
`_content.ts` gives the final gate as **Balmaceda** (Chilean Patagonia).

Argentina is never mentioned; Patagonia is absent from the one line that appears in every shared
link. **Not resolved.** Every affected file is listed in `audit/pending-decisions.md`.

### D. Consistent — checked and found to agree

"71 days" appears 8 times and agrees with "70 nights" (1). "9 sections" agrees with the 9 entries
in `andeanCaravanSections` and the 9 legacy `SECTIONS`. The combination table on the hop-on/hop-off
page (16 / 24 / 11 / 24 / 71 days) is internally consistent with its own section day counts.

---

## 1.7 Link graph

**Internal.** 30 distinct internal link targets across `app/`, `components/`, `content/` and
`lib/`. **Zero broken.** Two apparent failures were checked and are false positives:

- `/assets/fonts/fraunces-latin-opsz-normal.woff2` (`app/layout.tsx`) — a font preload, not a
  route. `public/assets/fonts/` contains it (67,304 bytes) and its italic sibling (81,520 bytes).
- `/departures/${slug}` — an uninterpolated template literal in
  `content/travel-self/travel-self-model-legacy.ts`, matched literally by the scanner. The file is
  orphaned.

All 10 `/departures/{slug}` targets resolve against the 10 slugs in `content/andean-caravan.ts`.

**External.** 10 distinct URLs, all citations in `content/andean-caravan-destinations.ts`. Checked
by fetch this session: **9 resolve, 1 could not be verified.**

| # | Source | Result |
|---|---|---|
| 1 | `gob.pe` — INEI Peru 2017 population release | **RESTRICTED — could not verify.** Empty body on every attempt; the parent path returns empty too, so the domain blocks the fetcher. Not evidence the page is dead. |
| 2 | `repositorio.promperu.gob.pe` | Resolves — PDF, PROMPERÚ Arequipa guide, Oct 2019 |
| 3 | `inei.gob.pe` Lib1559 | Resolves — PDF, INEI Cusco 2017 census, Tomo I |
| 4 | `britannica.com/place/Lake-Titicaca` | Resolves — updated 27 June 2026 |
| 5 | `ine.gob.bo` La Paz Censo 2012 | Resolves — publication page with working downloads |
| 6 | `unhabitat.org` Sistema de Ciudades de Bolivia | Resolves — PDF, 2021 |
| 7 | `chile.travel` San Pedro de Atacama | Resolves — updated 10 Feb 2026 |
| 8 | `ine.gob.cl` …`caserios-2019.pdf` (plain ASCII) | Resolves 200, **but the server returns an XLSX spreadsheet, not the PDF the extension implies** |
| 9 | `ine.gob.cl` …`caser%C3%ADos-2019.pdf` (percent-encoded) | Resolves — the actual PDF, INE Chile, March 2019 |
| 10 | `climatologia.meteochile.gob.cl` station 480002 | Resolves — station page; metadata renders client-side |

**Finding on 8 vs 9.** These are cited as the same document at three different destination entries.
They are not equivalent: only the percent-encoded form delivers the PDF. The plain-ASCII form
returns a spreadsheet under a `.pdf` filename. Three citations currently point at the wrong
artefact.

*Note: the accuracy of the cited figures against the cited sources was not checked. That is a
content review, not a link check.*

---

## 1.8 Data-capture legality — P0-escalated

Written in full to `audit/pending-decisions.md` with the exposure named. Summary of the observed
state:

- Four live forms capture personal data: `/contact` (name, email, question), `/request-invitation`
  (name, email, country, free text), `/start-here` (name, email, journey, Travel Self result, free
  text), `/sign-in` (email).
- `/privacy` renders `LegalPlaceholderPage` with body `["To be confirmed"]` and `lastReviewed:
  TO_BE_CONFIRMED`.
- The consent checkbox text is `"PLACEHOLDER / LEGAL REVIEW: Required consent wording has not been
  supplied. This mock checkbox is not final legal consent."` — the site tells the user its own
  consent is not valid, and requires it anyway (`zod` refines `consent` to must-be-true).
- `cookieNoticeDecision.required` is `TO_BE_CONFIRMED`; the export is orphaned.
- No cookie banner, no consent manager, no analytics exists.
- `lib/forms/client.ts` writes a SHA-256 fingerprint of the submission plus a timestamp to
  `localStorage` under `sawayatra:r1:mock-form-receipts`, retained up to 24 entries, with no expiry
  and no user-facing deletion route.

**Mitigating fact, observed:** the API adapter discards every submission, so no personal data
currently leaves the browser or is stored server-side. The exposure is latent, and becomes live the
moment delivery is implemented.

No legal copy has been written. No form has been altered.

---

## 1.9 Orphan register — report only, nothing touched

Full census in `audit/facts.md` §0.4. Recorded here with a recommendation per item and no action
taken.

| Orphan | Recommendation | Blocked on |
|---|---|---|
| `content/site.ts` → `homeContent`, `howItWorksContent`, `travelSelfPageContent`, `departuresPageContent`, `journeyDetailContent`, `aboutContent` | Decide per object whether the TSX copy that replaced it is authoritative; delete the loser. Six objects, ~300 lines. | Founder review of which copy is current |
| `content/faq.ts` → `faqItems` | 8 placeholder entries. Keep until Decision on the FAQ question set; the real FAQ lives in `_content.ts` (see §1.6) | FAQ decision |
| `content/quiz.ts` → `quizQuestions`, `quizContent` | Six-question tuple, five placeholders, labelled "DRAFT — interface demonstration only". Superseded by the live model. Candidate for deletion. | Confirm it is not a planned surface |
| `content/membership.ts` → `membershipPromises`, `membershipTiers` | Keep — these are the slots the membership decision will fill | Membership definition |
| `content/legal-placeholders.ts` → `legalPages`, `cookieNoticeDecision` | `legalPageById` is the live path; `legalPages` looks superseded. `cookieNoticeDecision` should be wired when consent is decided | Legal copy decision |
| `content/journeys.ts` → `journeyBySlug`, `journeySlugs` | Whole module unused; also the source of the stray "February 2027" | Confirm `/journeys` plans |
| `content/field-document.ts` → `reservedHomeSections`, `approvedHomeSections` | Left behind by the homepage trim (`b856d25`). Delete or document | Homepage decision |
| `content/andean-caravan.ts` → `ANDEAN_CARAVAN_PUBLIC_DATE`, `andeanCaravanGates`, `andeanCaravanSectionById` | `andeanCaravanGates` duplicates the gate table in `_content.ts` — resolve the duplication before deleting either | §1.6 date/altitude resolution |
| `content/andean-caravan-images.ts` → `andeanCaravanSectionGalleries`, `andeanCaravanSectionImages` | Check against Phase 2 image audit before deleting | — |
| `travel-self-model-legacy.ts` → 18 exports incl. the entire recommendation engine | **Do not delete.** See §1.10 | 5.1 modelling decision |
| `travel-self-model.ts` → `COMPARISON_AXES`, `DISTANCE_BANDS`, `GROUP_THRESHOLD`, `GROUP_MIN_MEMBERS`, `RESULT_INVENTORY_HEADING`, +7 | **Do not delete.** These are 5.1 and 5.3 machinery, written against the *live* model | 5.1 / Decision 9 |
| `content/travel-self/families.ts` → `FAMILY_KEYS` | Trivial; delete when convenient | — |

**`components/ui/StatusBadge` and `components/journeys/DepartureFilters`** were flagged by the
typography audit as having no importer. Still true.

---

## 1.10 Build item 5.1 — what actually exists, measured

The brief marks 5.1 "highest priority, fully unblocked" and describes the matching premise as
**unbuilt**. Phase 0 found orphaned scoring functions and flagged that 5.1 might be mostly wiring.
That was checked this session. **It is not.**

### There are two Travel Self models and they are incompatible

| | Live model | Legacy model |
|---|---|---|
| File | `content/travel-self/travel-self-model.ts` (418 lines) | `content/travel-self/travel-self-model-legacy.ts` (1,105 lines) |
| Axes | **5** — `pace`, `planning`, `social`, `rhythm`, `comfort` | **6** — `rhythm`, `discovery`, `socialEnergy`, `clock`, `threshold`, `focus` |
| Rendered by | `TravelSelfQuiz` → `TravelSelfQuestionnaire` | nothing |
| Still imported for | — | types only, by `lib/travel-self-events.ts` and `lib/travel-self-session.ts` |

Exactly **one** axis identifier, `rhythm`, is common to both, and whether it means the same thing in
each is `UNMEASURED`.

### The compile test

A file was written importing the live stored result and passing it straight to the legacy
recommender, then `npx tsc --noEmit` was run. Result:

```
error TS2345: Argument of type
  'Readonly<Record<"pace" | "planning" | "social" | "rhythm" | "comfort", AxisPosition>>'
is not assignable to parameter of type
  'Readonly<Record<"rhythm" | "discovery" | "socialEnergy" | "clock" | "threshold" | "focus", number>>'.
  Missing the following properties: discovery, socialEnergy, clock, threshold, focus
```

The test file was deleted. This is measurement, not inference: the live result cannot be fed to the
legacy engine.

### What the legacy engine nonetheless contains

A complete, working recommendation engine — `scoreAxes`, `blendedCentroid`, `calculateResiduals`,
`confidenceFor`, `experientialFit`, `passionRelevance`, `recommendSection`, `recommendSections`,
`readTravelSelf` — plus `SECTION_FIT_WEIGHTS`, `PASSION_WEIGHTS`, and **`SECTIONS`: all nine Andean
sections, each with a hand-authored six-value fit vector** (e.g. Desert Coast
`vector(0.35, 0.15, 0.05, -0.15, 0.3, 0.45)`).

Those nine vectors are the expensive part of 5.1 and they already exist. They are expressed against
the superseded six-axis model.

### What 5.1 therefore requires

1. **A modelling decision, not an engineering one:** re-author the nine section fit vectors against
   the live five axes, or define a mapping from six axes to five. Either is a judgement about what
   the axes mean. *This is Nermine's call, not a build task.*
2. Then: port `experientialFit` and `recommendSections` to the live `AxisPositions` shape — small,
   the maths is arithmetic on a vector.
3. Then: the annotate / rank / warn / persist work the brief describes, off the existing
   `localStorage` result. No auth needed, as the brief says.

`GROUP_THRESHOLD = 0.6` and `GROUP_MIN_MEMBERS = 5` are already written against the **live** model
and are 5.3 machinery, not 5.1.

**Correction to Phase 0.** The inference that 5.1 "may be substantially closer to existing than
unbuilt implies" is **half right**: the section fit data exists, the engine exists, and neither can
be used without a modelling decision first. 5.1 is not fully unblocked. It is blocked on one
question that has not been asked yet.

---

## 1.11 Could not verify in Phase 1

Written to `audit/could-not-verify.md`:

- Whether `rhythm` means the same thing in the live and legacy models.
- Whether the cited altitude and population figures match what the cited sources actually say.
- Which `CaravanRouteMap` implementation renders on which route — needs a rendered page.
- `gob.pe` citation liveness — the domain blocks fetching.
- Whether the six orphaned `content/site.ts` objects predate or postdate the TSX copy that replaced
  them — needs `git log --follow` per object, deferred.
- Everything rendered: contrast, computed sizes, line length, tap targets, focus, axe, performance,
  console. Phase 2.
