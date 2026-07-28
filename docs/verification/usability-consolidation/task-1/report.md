# Task 1 checkpoint report

## Task completed

- Task 1 — Repair colour semantics and decision text.
- User problem addressed: brand orange had been carrying action, focus, error and text responsibilities at once, while some practical facts and controls were still presented at decorative-caption sizes.
- Scope: semantic colour roles and decision-critical text only. No page, route, component structure, journey copy, image, itinerary or map behaviour was redesigned.

## Production baseline

- Production URL: `https://sawayatra.vercel.app/`
- Confirmed production deployment: `https://sawayatra-k6v24kw23-minou-s-projects.vercel.app/`
- Deployment ID: `dpl_8hr2RfMrFgzMQU9DBo2PmqggBpp2`
- Deployed SHA: `2822a81484a14bb535bed36d9526b5a8d7a9ec33`
- Working branch: `codex/usability-consolidation`
- Baseline commit: `2b3a880 Capture production content baseline`

## Files changed

- `styles/tokens.css` — separated brand signal, readable signal text, action, focus and error roles while keeping `#f05a2a` unchanged.
- `app/globals.css` — made the global focus rule consume a contextual semantic focus-ring token.
- `app/system.module.css` — moved system-page actions to the action tokens and restored their labels to 16px.
- `components/ui/Button.module.css` — applied semantic action colours and explicit light/dark focus roles.
- `components/ui/Progress.module.css` — raised progress information from 14px to 16px.
- `components/ui/StatusBadge.module.css` — raised state and availability labels from 13px to 16px.
- `components/brand/SkipLink.module.css` — raised the actionable skip link from 14px to 16px.
- `components/forms/forms.module.css` — applied semantic error/action roles and raised instructions, errors and notices to 16px.
- `components/journeys/DepartureFilters.module.css` — changed decision filters to 16px sentence case with normal tracking.
- `components/journeys/JourneyCard.module.css` — raised place, date and duration metadata to 16px.
- `components/journeys/FitBand.module.css` — changed result-interpretation labels to 16px sentence case.
- `components/journeys/ArchetypeChip.module.css` — raised only interactive chips to 16px; decorative/static chips remain 14px.
- `components/field/FieldDocument.module.css` — changed field-document actions to 16px sentence case and route facts to 16px.
- `components/field/JoiningPointSelector.module.css` — raised joining-point facts to 16px.
- `app/(public)/departures/departures.module.css` — changed route, time, join/leave, date, group and price labels to 16px sentence case.
- `app/(public)/how-it-works/how-it-works.module.css` — raised the Caravan journey facts and values to 16px sentence case.
- `app/(public)/travel-self/travel-self.module.css` — raised progress, question, option guidance and result-interpretation labels to 16px while retaining decorative eyebrows at 14px.
- `app/(public)/caravans/andean-caravan/how-it-works/_components/GateSelector.module.css` — changed the selector container's light-surface focus ring from orange to ink.
- `app/(public)/caravans/andean-caravan/how-it-works/how-it-works.module.css` — used readable text-orange for small numbered rules and raised the practical price note to 16px.
- `docs/verification/usability-consolidation/task-1/desktop-1440/*.png` — 14 local desktop comparison captures.
- `docs/verification/usability-consolidation/task-1/mobile-375/*.png` — 13 local mobile comparison captures.
- `docs/verification/usability-consolidation/task-1/report.md` — this checkpoint evidence.

## Content-deletion table

The 18-route comparison found no missing journey sentence, paragraph, heading, link label, control, or image. CSS sentence casing changes visible rendering, so the required deletion gate records those transformations explicitly.

| Route | Removed baseline text | Replacement | Reason | Restored or approved |
| ----- | --------------------- | ----------- | ------ | -------------------- |
| `/departures` | `COMPLETE ROUTE` (1) | `Complete route` | Decision-critical fact label must use sentence case. | Required by Task 1 |
| `/departures` | `SECTIONS` (1) | `Sections` | Decision-critical fact label must use sentence case. | Required by Task 1 |
| `/departures` | `GROUP` (1) | `Group` | Decision-critical capacity label must use sentence case. | Required by Task 1 |
| `/departures` | `PRICE` (1) | `Price` | Decision-critical price label must use sentence case. | Required by Task 1 |
| `/departures` | `ROUTE` (9) | `Route` (9) | Practical section fact must use sentence case. | Required by Task 1 |
| `/departures` | `TIME` (9) | `Time` (9) | Duration label must use sentence case. | Required by Task 1 |
| `/departures` | `JOIN / LEAVE` (9) | `Join / leave` (9) | Joining and leaving facts must use sentence case. | Required by Task 1 |
| `/departures` | `DATE` (9) | `Date` (9) | Date label must use sentence case. | Required by Task 1 |

All other baseline strings match exactly, including duplicate occurrence counts.

## Additions

- Added semantic design tokens: `--signal-text`, `--action-bg`, `--action-text`, `--focus-ring-light`, `--focus-ring-dark`, `--error-text`, and `--error-border`.
- Added no visible text, controls, routes, images or journey content.

## Structural preservation

- Fonts unchanged: Fraunces and Inter only.
- Weights unchanged: Fraunces 300/400 and Inter 400/500.
- Images unchanged: all 116 meaningful occurrences and all 73 unique meaningful sources match the production baseline across the 18 required routes.
- Map unchanged: both route-map TSX files and both route-map CSS files have no diff from the deployed SHA.
- Map data unchanged: route, geometry and destination data have no diff from the deployed SHA.
- Itinerary unchanged.
- Route metrics unchanged on all 18 routes: heading counts, image counts/sources, internal links and interactive-control counts are identical.
- Section slugs unchanged: nine Andean Caravan section slugs plus the complete Caravan.
- Gateway count unchanged: 11.
- Selectable joining-point count unchanged: 10.
- Navigation order and destinations unchanged.
- Sign-in route and content preserved; production did not expose Sign in in the header, and Task 1 did not alter that pre-existing state.
- Travel Self questions, scoring, persistence and reveal model unchanged.
- No new visual identity or component language introduced.

## Accessibility checks

- Keyboard and focus: sampled public links, buttons and the mobile drawer. Light surfaces render ink focus; dark surfaces render paper focus. Focus offsets remain visible outside component boundaries.
- Contrast ratios: ink on signal `4.61:1`; darker signal text on paper `4.67:1`; ink on paper `11.99:1`; paper on ink `11.99:1`; ink on sun `8.64:1`; ink on pink `9.00:1`; ink on olive `4.78:1`.
- 200% zoom equivalent: all 18 required routes tested at a 720 CSS-pixel viewport with no whole-page overflow.
- 375px: all 18 required routes tested with no whole-page overflow.
- 320px: the pre-existing global width is 323px at a 320px CSS viewport on every route. The same issue was captured before Task 1 and is deferred because fixing it would widen this gated task and risk the locked map.
- Reduced motion: the existing global reduced-motion rules and route-map motion behaviour are unchanged.
- Semantics: no markup or accessible-name changes were made; decision labels remain associated with their existing controls and facts.
- Locked maps: dedicated rendered-colour checks passed at mobile and wide viewports.

## Tests

- `npm run typecheck` — passed.
- `npm run lint -- --max-warnings=0` — passed with zero warnings.
- `npm test` — passed: 11 files, 67 tests.
- `npx vitest run tests/forms/route.test.ts tests/forms/client.test.ts tests/forms/components.test.tsx tests/travel-self/quiz-v2.test.tsx` — passed: 4 files, 15 integration/component tests.
- `npm run build` — passed: Next.js 16.2.11, 33 generated routes.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npm run test:e2e` — 162 passed, 44 failed, 130 skipped. Production baseline was 163 passed, 43 failed, 130 skipped. The remaining failures are the documented stale navigation/content assertions, pre-existing axe issues and 323px-at-320px overflow assertion; the one-test run-to-run drift occurred among those existing timeout/overflow checks. The dedicated map-colour tests, route overflow tests at supported project viewports and all Firefox/WebKit rendering checks passed.

## Screenshots

- Production desktop baseline: `docs/verification/usability-consolidation/production-baseline/desktop-1440/` — 14 captures.
- Production mobile baseline: `docs/verification/usability-consolidation/production-baseline/mobile-375/` — 13 captures.
- Task 1 desktop comparison: `docs/verification/usability-consolidation/task-1/desktop-1440/` — 14 captures.
- Task 1 mobile comparison: `docs/verification/usability-consolidation/task-1/mobile-375/` — 13 captures.

## Commit

- Required commit message: `Fix semantic contrast and decision text`.
- Commit SHA: supplied in the final checkpoint handoff after the commit is created.
- Exact staged files: the 19 CSS files listed above, this report, and the 27 Task 1 comparison screenshots. No unrelated untracked file is included.

## Deferred findings

- The exact 320px viewport retains the production-baseline 3px horizontal overflow (`323px` document width). The locked map must not be resized in Task 1.
- Existing browser tests still assert earlier navigation, membership and enquiry copy and therefore time out against the current production information architecture.
- Existing serious axe findings are not caused by the Task 1 CSS changes and require a separately approved accessibility pass.
- The production mobile homepage marks How it works as active on `/`; changing navigation state is outside Task 1.
- Restoring Sign in to the utility header is governed by a later gated task; Task 1 preserves the deployed navigation exactly.
- Task 2 and all later usability-consolidation tasks remain unstarted pending approval.
