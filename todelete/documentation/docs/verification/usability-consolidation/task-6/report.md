# Task 6 - Improve joining-point and footer wayfinding

## Task completed

- Task: 6, Improve joining-point and footer wayfinding.
- User problem: all ten joining choices can now be reached without horizontal
  swiping, and the footer provides a compact route back to every major public
  area.
- Preservation approach: the existing rail, image, detail card, typography,
  colour system, route data and legal links remain in place. New controls are
  composed from the site's existing square borders, paper, ink, sun and pink.

## Production baseline

- Production URL: `https://sawayatra.vercel.app/`
- Deployed baseline SHA: `2822a81484a14bb535bed36d9526b5a8d7a9ec33`
- Working branch: `codex/usability-consolidation`
- Starting local checkpoint: `2248d9f`

## Files changed

### Joining-point selector

- `components/field/JoiningPointSelector.tsx`: adds Previous and Next controls,
  a visible position out of ten, point-name announcements, disabled boundaries,
  labelled rail controls and automatic selected-button scrolling.
- `components/field/JoiningPointSelector.module.css`: styles the new control
  band and selected state using existing tokens, with explicit desktop, mobile
  and 320px layouts.
- `tests/field/joining-point-selector.test.tsx`: covers the ten-choice count,
  Previous, Next, focus continuity, rail scrolling, `03B`, the final joining
  point and Balmaceda's leaving-only status.

### Footer and header utility

- `components/brand/Footer.tsx`: adds secondary orientation navigation while
  retaining the existing legal navigation.
- `components/brand/Footer.module.css`: provides compact two-column wrapping on
  wide screens and clean one-column wrapping at narrow widths; every link
  remains at least 16px with a 48px target height.
- `components/brand/BackToTopLink.tsx`: makes Back to top focus the primary
  navigation after the fragment jump.
- `app/(public)/_components/PublicShell.tsx`: supplies the five primary routes,
  Ask a question, Sign in and Back to top to every public footer.
- `content/navigation.ts`: restores Sign in to the separate header utility
  position required by the locked navigation law.
- `components/brand/SiteNavigation.tsx`: names the generic utility action and
  exposes the non-tabbable `#site-top` focus target.
- `tests/brand/footer.test.tsx`: locks all secondary and legal destinations.
- `tests/brand/site-navigation.test.tsx`: locks Sign in outside the five-item
  primary navigation.
- `tests/content/contracts.test.ts`: updates the utility navigation contract to
  Sign in.
- `tests/e2e/release-one.spec.ts`: covers Task 6 keyboard, count, `03B`,
  Balmaceda, footer, Back to top, accessibility and overflow behaviour.

### Verification

- `docs/verification/usability-consolidation/task-6/*.png`: desktop, mobile,
  320px and 200% zoom-equivalent captures.
- `docs/verification/usability-consolidation/task-6/report.md`: this report.

## Content-deletion table

| Route | Removed baseline text | Replacement | Reason | Restored or approved |
| --- | --- | --- | --- | --- |
| All public routes | None | Not applicable | Existing page copy, joining details, footer legal labels and Ask a question remain visible. Ask a question moves from the utility header to the footer, while Sign in returns to the required header utility position and is also present in the footer. | Preserved |

## Additions

- `Joining point 1 of 10`, updated live through position ten.
- Previous and Next controls with clearly disabled first and last boundaries.
- Joining-point names and positions in every rail button's accessible name.
- A visible explanation that the rail also remains horizontally scrollable.
- Footer labels `Explore Sawayatra` and `Legal`.
- Footer links to How it works, Meet your Travel Self, Departures, Membership,
  About, Ask a question, Sign in and Back to top.

## Structural preservation

- Fonts and weights unchanged.
- Existing image files and sources unchanged: 84 public images.
- Locked map component and styles unchanged from the Task 5 checkpoint.
- Map destination, route and geography data unchanged.
- Journey data unchanged: `content/andean-caravan.ts` remains
  `28c21040112f6b59e905a6de08c6df645798ca55f8aa2e1ae2cd9dbbdb58e844`.
- Itinerary and nine section slugs unchanged.
- Eleven gateway records unchanged.
- Ten selectable joining entries unchanged.
- `03B` remains the second option for section 03.
- Balmaceda remains the final leaving gateway and is not rendered as an
  eleventh joining choice.
- Primary navigation order unchanged; Sign in remains separate.
- Sign in page unchanged:
  `31c6e452eba040e7af9e403d5f1793a551c92fb09fec55e4248871c5f34483a6`.
- Travel Self files and scoring unchanged.
- No route, image, dependency, typography or visual system added.

## Accessibility checks

- Keyboard: Previous and Next work with Enter; focus remains on the initiating
  control; boundaries are natively disabled; every rail button remains
  keyboard reachable.
- Focus: Back to top moves focus to the primary navigation target. Existing
  global focus outlines remain in use.
- Announcements: a polite atomic live region provides point name and position.
- Contrast: the affected main content has no serious or critical Axe
  violations at desktop or mobile widths.
- 200% zoom: the 720 CSS-pixel equivalent has no page-level overflow and retains
  both navigation buttons.
- 320px: controls, joining detail, actions and footer remain usable without
  page-level horizontal overflow.
- Reduced motion: selected rail movement uses instant scrolling; no automatic
  animation was added.
- Semantics: the existing heading structure remains unchanged; labelled
  navigation landmarks distinguish primary, footer and legal navigation.

## Tests

- `npm run test:unit`: 17 files and 83 tests passed.
- `npm run typecheck`: passed.
- `npm run lint -- --max-warnings=0`: passed.
- Focused Task 6 unit suite: 4 files and 26 tests passed before the full suite.
- Focused Task 6 Playwright flow: 2 passed at 375px and 1440px, including a
  320px resize check and Axe scan.
- `npm run build`: passed; 34 generated routes/pages.
- No separate integration-test command exists; component-to-route behaviour is
  covered by the focused Playwright flow.

## Screenshots

- Production references:
  `production-baseline/desktop-1440/joining-points.png`,
  `production-baseline/mobile-375/joining-points.png` and
  `production-baseline/desktop-1440/footer.png`.
- Local Task 6:
  `joining-points-desktop-1440.png`,
  `joining-points-mobile-375.png`,
  `joining-points-mobile-320.png` and
  `joining-points-zoom-200-equivalent.png`.

## Commit

- Required message: `Improve joining-point and footer navigation`
- Commit SHA: reported in the Task 6 approval handoff after checkpoint creation.
- Exact staged files are recorded at commit time; unrelated untracked files are
  excluded.

## Deferred findings

- The Next.js development-tool badge appears over the page in local development
  screenshots. It is framework tooling and is absent from production builds.
- The historical broad Playwright suite still contains pre-existing assertions
  for an older six-item navigation and old form surfaces. Task 6's focused
  browser coverage passes and those unrelated stale expectations were not
  rewritten.
