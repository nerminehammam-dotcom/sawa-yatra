# Task 2 checkpoint report

## Task completed

- Task 2 — Clarify the homepage first screen.
- User problem addressed: a first-time visitor could read the promise but could not immediately tell what Sawayatra is, where to begin, or where to find the practical conditions.
- Scope: the existing homepage hero only, plus a reliable measurement of the existing two-row site header. Every section below the hero remains present and unchanged.

## Production baseline

- Production URL: `https://sawayatra.vercel.app/`
- Confirmed production deployment: `https://sawayatra-k6v24kw23-minou-s-projects.vercel.app/`
- Deployment ID: `dpl_8hr2RfMrFgzMQU9DBo2PmqggBpp2`
- Deployed SHA: `2822a81484a14bb535bed36d9526b5a8d7a9ec33`
- Working branch: `codex/usability-consolidation`
- Task 1 checkpoint: `3a4bf38 Fix semantic contrast and decision text`

## Files changed

- `app/(public)/page.tsx` — preserved the existing headline and tagline, added the approved definition and three approved destinations inside the existing hero.
- `app/(public)/home.module.css` — kept the full-bleed image treatment while fitting the explanation and actions into the first screen at desktop, mobile and zoomed layouts.
- `components/brand/SiteNavigation.tsx` — measures the rendered navigation rather than assuming a single-row header height.
- `components/brand/SiteNavigation.module.css` — reduced only the compact-header gap so the existing wordmark and Menu control fit at 320px.
- `tests/e2e/release-one.spec.ts` — added the homepage first-screen copy, destination and viewport-visibility contract at 375px and 1440px.
- `docs/verification/usability-consolidation/task-2/*/home-first-screen.png` — local approval captures at desktop, mobile, 320px and the 200% zoom equivalent.
- `docs/verification/usability-consolidation/task-2/report.md` — this checkpoint evidence.

## Content-deletion table

| Route | Removed baseline text, control or image | Replacement | Reason | Restored or approved |
| ----- | --------------------------------------- | ----------- | ------ | -------------------- |
| None | None | Not applicable | The original headline, tagline, hero image and all later homepage sections remain in the rendered page. | Preserved |

The source comparison against the approved Task 1 checkpoint found additions and layout-rule replacements only. It found no deleted homepage sentence, heading, link label, control, image or section.

## Additions

- Exact definition: “Sawayatra is a members’ travel club that brings compatible travellers together through shared journeys, beginning with the annual Andean Caravan.”
- Primary action: `See how Sawayatra works` → `/how-it-works`.
- Secondary action: `Explore the Andean Caravan` → `/departures/the-andean-caravan`.
- Practical link: `Altitude, physical demands and accommodation` → `/departures/the-andean-caravan#honest-conditions-heading`.
- One measured CSS custom property, `--site-header-height`, set from the actual existing navigation height through `ResizeObserver`.

## Structural preservation

- Existing homepage headline and tagline preserved verbatim.
- Existing hero image source, full-bleed treatment, grain and warm diagonal scrim preserved.
- Every homepage section and image below the first screen remains in its original source order.
- Existing Fraunces and Inter/General Sans typography language preserved.
- Existing sharp-cornered control language reused through `ButtonLink`; no new component family introduced.
- Navigation order, destinations and visual structure unchanged.
- All non-homepage routes and page files unchanged.
- Locked route map, itinerary, route data, journey drawer and Travel Self behaviour unchanged.
- No production deployment or GitHub push performed.

## Accessibility and responsive checks

- Action names and destinations are explicit and verified by role.
- Primary ink-on-signal contrast remains `4.61:1`; secondary paper-on-ink contrast remains `11.99:1`.
- Existing visible focus treatment is inherited from `ButtonLink`; the practical link remains a semantic, underlined anchor with a 44px minimum target height.
- 1440 × 1000: all three actions render above the viewport bottom; no whole-page horizontal overflow.
- 375 × 812: all three actions render above the viewport bottom; no whole-page horizontal overflow.
- 320 × 812: document width equals the 320px viewport after the compact-header gap correction; all three actions remain visible.
- 200% zoom equivalent at a 720 × 500 CSS viewport: all three actions remain in the first screen with no horizontal overflow.
- The hero uses stable `svh` sizing and subtracts the measured full header height, so the image does not sit behind either navigation row.
- Reduced-motion behaviour is unchanged; no new animation was added.

## Tests

- `npm run typecheck` — passed.
- `npm run lint -- --max-warnings=0` — passed with zero warnings.
- `npm test` — passed: 11 files, 67 tests.
- `npx vitest run tests/forms/route.test.ts tests/forms/client.test.ts tests/forms/components.test.tsx tests/travel-self/quiz-v2.test.tsx` — passed: 4 files, 15 tests.
- `npm run build` — passed: Next.js 16.2.11, 33 generated routes.
- Focused Playwright homepage contract at `mobile-375` and `wide-1440` — passed: 2 of 2 tests.
- `git diff --check` — passed.

## Screenshots

- Production desktop baseline: `docs/verification/usability-consolidation/production-baseline/desktop-1440/home.png`.
- Production mobile baseline: `docs/verification/usability-consolidation/production-baseline/mobile-375/home.png`.
- Task 2 desktop approval: `docs/verification/usability-consolidation/task-2/desktop-1440/home-first-screen.png`.
- Task 2 mobile approval: `docs/verification/usability-consolidation/task-2/mobile-375/home-first-screen.png`.
- Task 2 narrow-screen approval: `docs/verification/usability-consolidation/task-2/mobile-320/home-first-screen.png`.
- Task 2 200% zoom equivalent: `docs/verification/usability-consolidation/task-2/zoom-200/home-first-screen.png`.

## Commit

- Required commit message: `Clarify homepage proposition and first actions`.
- Commit SHA: supplied in the final checkpoint handoff after the commit is created.
- Exact staged scope: the five production/test files listed above, four Task 2 screenshots and this report. No unrelated untracked file is included.

## Deferred findings

- Existing stale navigation/content assertions and existing axe findings documented in Task 1 are unchanged and remain outside this gated task.
- No later usability-consolidation task has been started.
