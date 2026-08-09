# audit/could-not-verify.md

Blind spots, mapped rather than hidden. Opened Phase 0, extended Phase 1. Append per phase.

Anything listed here is `UNMEASURED`. No figure in any audit deliverable is derived from an item on
this page.

---

## Out of scope by instruction

| Item | Why | Where instead |
|---|---|---|
| Independence rule / second agent | Subagents share parent context. Compliance would be theatre. | A separate session with no history attached |
| Screen-reader behaviour | Needs VoiceOver, NVDA or JAWS and a human ear. axe-core covers the static layer only. | Manual pass, or an accessibility consultant |
| Competitor JS-hydrated prices — Flash Pack, Much Better Adventures | Plain fetch does not hydrate; both returned empty bodies previously | A Playwright script, or fifteen minutes with a browser |
| Butterfield & Robinson deposit and cancellation ladder | T&Cs client-rendered; unreadable by four methods previously | Manual, or email them |
| Out-of-category research brief | Open-ended research, not repository work. Would be done shallowly here. | Its own Research session |

**On the out-of-category brief.** Institutions that publish their own instrument's failure modes;
that argue against the sale using the customer's own submitted data; that publish remedies
triggered by conditions outside both parties' control. Model cards, ratings agencies, clinical
instruments, standards bodies. Deserves a session of its own.

---

## Phase 0 — could not verify

| Item | Why |
|---|---|
| Build under Node 24.x (Vercel) or v26.0.0 (local) | Sandbox runs v22.22.3. The clean build is evidence for v22 only. |
| Unit tests (`vitest`) | Does not run in a Linux sandbox against this repo's `node_modules` — rolldown ships macOS-arm64 native bindings. Must be run on the Mac. |
| The local Node version, v26.0.0 | Taken from the brief; not independently confirmed in session. |
| The Vercel project's environment-variable list, read directly | Not fetched. `NEXT_PUBLIC_SITE_URL` being unset is established *indirectly but conclusively* by the live `og:url` value. |
| Rendered prose word counts per route | Most prose arrives from `content/` or child components; a source-side count would be wrong. Deferred to Phase 2. |

---

## Phase 1 — could not verify

| Item | Why | How to close it |
|---|---|---|
| Whether `rhythm` means the same thing in the live and legacy Travel Self models | Both models define an axis named `rhythm`; whether the poles and scoring intent match is a semantic question, not a typed one | Read both axis definitions side by side with the founder |
| Whether the cited altitude and population figures match what the cited sources say | Ten citations resolve to PDFs and statistics pages; checking each figure against its source is a content review, not a link check | A content-verification pass, one destination at a time |
| Liveness of citation #1, `gob.pe` INEI Peru | The domain returns an empty body to the fetcher at every path, including parents. Not evidence the page is dead. | Open it in a browser |
| Which `CaravanRouteMap` implementation renders on which route | Two components with two stylesheets and overlapping class names. Needs a rendered page to attribute. | Phase 2 harness — check the emitted class hashes |
| Whether the six orphaned `content/site.ts` objects predate or postdate the TSX copy that replaced them | Needs `git log --follow` per object across 52 commits | Deferred; low value until someone decides which copy is authoritative |
| Whether `content/quiz.ts` is retained deliberately | Superseded by the live model, labelled "DRAFT — interface demonstration only", imported by nothing. Intent is not observable. | Ask |
| The true rendered Travel Self question count | Copy says "Eight short questions" in three places and "Six honest questions" in two, one of which is the orphaned `quiz.ts`. The live questionnaire's count was not counted at runtime. | Phase 2 — count what the page renders |
| Whether the announcement banner and the "January–April 2027" eyebrow are ever visible in the same viewport | Both render on `/caravans/andean-caravan/how-it-works`; whether they co-occur above the fold is a layout question | Phase 2 screenshot |

---

## Phase 2 — deferred to the harness, not yet run

All of these are `UNMEASURED` until `tools/audit/` exists and has run against the deployed site:

Contrast ratios sampled from rendered pixels at 1280, 1440, 1728, 1920, 390 and 820 · computed
font sizes as rendered · line length in characters · tap-target dimensions · focus visibility,
focus contrast, tab order, focus traps, skip-link function · axe-core violations and incompletes ·
LCP, CLS, TBT, total byte weight, image weight by file, font-loading strategy, FOUT · console
errors and warnings per route.

**Note on the harness's own limits, recorded in advance.** Real-user performance data does not
exist and never has — there is no analytics in the codebase at all (`audit/facts.md` §0.7). Every
performance figure Phase 2 produces will be a **lab figure** from a single machine, and must be
labelled as such. Real browser zoom at 200% is not equivalent to a 320px viewport on this site,
because roughly 95 distinct `clamp()` expressions use `vw` units; if the harness uses viewport
narrowing as a proxy, that must be stated as a proxy.

---

## Struck from the brief

Both counts came from the lost v1.0 report and cannot be reproduced or trusted:

- "the 27 unmeasured contrast incompletes"
- "the three previously flagged `aria-prohibited-attr` / `aria-valid-attr-value` incompletes"

The Phase 2 harness generates a fresh baseline. **That baseline is the reference.**

Add to this: **the whole of `docs/audit-01-typography.md` is superseded** as a work list. Its
figures describe the tree at `audit/typography` HEAD (2026-07-26), 52 commits behind `main`. Its
78-declaration finding measures 8 today. Detail in `audit/static.md` §1.5. Its method remains
sound; its numbers do not describe this codebase.
