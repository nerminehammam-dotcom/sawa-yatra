# Task 5 - Add an accessible contact journey

## Task completed

- Task: 5, Add an accessible contact journey.
- User problem: visitors can now reach one consistent question form without
  depending exclusively on a configured desktop email application.
- Delivery boundary: no approved email provider, database, CRM, delivery
  credential or live contact endpoint exists in the repository. The form
  validates locally, stores nothing, transmits nothing and reports that the
  question was not sent. The approved fallback address remains visible.

## Production baseline

- Production URL: `https://sawayatra.vercel.app/`
- Deployed baseline SHA: `2822a81484a14bb535bed36d9526b5a8d7a9ec33`
- Working branch: `codex/usability-consolidation`
- Starting local checkpoint: `8a339a2`

## Files changed

### Contact route and form

- `app/(public)/contact/page.tsx`: creates `/contact`, reads optional visible
  journey context and presents the delivery and privacy boundary.
- `app/(public)/contact/contact.module.css`: uses the existing paper, olive,
  orange, border, spacing and typography language for the new page.
- `components/forms/ContactQuestionForm.tsx`: adds persistent labels,
  field-linked errors, focused validation summary, editable context, preserved
  values and an honest unavailable-delivery state.
- `components/forms/index.ts`: exports the contact form.
- `content/forms.ts`: adds contact labels, instructions and failure wording.
- `lib/forms/schemas.ts`: adds the strict client-side contact schema.
- `lib/contact.ts`: centralises the approved fallback address and context URL.
- `lib/types.ts`: adds `/contact` to the static route type.
- `content/site.ts`: adds contact metadata with an approved description.

### Enquiry continuity

- `content/navigation.ts`: sends the header Ask a question action to `/contact`.
- `app/(public)/page.tsx`: sends the homepage joining-point question to the
  contact form with context.
- `app/(public)/departures/page.tsx`: sends the Departures question with
  context.
- `app/(public)/departures/[slug]/page.tsx`: sends section questions with the
  section title visible in the form and replaces the email-app-only ending.
- `app/(public)/joining-points/page.tsx`: sends the page enquiry with context.
- `components/field/JoiningPointSelector.tsx`: sends the selected joining place
  as editable context.
- `app/(public)/membership/page.tsx`: sends the Membership enquiry with context.
- `app/(public)/about/page.tsx`: sends the general enquiry to `/contact`.
- `app/(public)/travel-self/TravelSelfQuiz.tsx`: sends the result-page enquiry
  with Travel Self context.

### Baseline and verification

- `content-baseline/contact.txt`: records the new route's visible text.
- `content-baseline/route-metrics.json`: records the new route's headings,
  images, controls and internal destinations.
- `tests/forms/contact.test.tsx`: covers validation focus, context editing,
  unavailable delivery, value recovery, no network request and no storage.
- `tests/forms/schemas.test.ts`: covers the strict contact payload.
- `tests/content/contracts.test.ts`: locks the route, sitemap and contact action.
- `tests/e2e/release-one.spec.ts`: covers desktop/mobile contact behaviour,
  keyboard use, main-content accessibility, 320px, zoom equivalent and link
  integrity.
- `tests/e2e/cross-browser.spec.ts`: adds the contact route to Firefox and
  WebKit rendering checks.
- `docs/verification/usability-consolidation/task-5/*.png`: four local visual
  captures.

## Content-deletion table

| Route | Removed baseline text | Replacement | Reason | Restored or approved |
| --- | --- | --- | --- | --- |
| All production-baseline routes | None | Not applicable | The production baseline comparison contains no Task 5 deletion. Existing action labels remain visible and now lead to `/contact`. | Preserved |

Two strings added after the original production baseline were necessarily
replaced on the nine section pages: `Your question opens in your email app.
Nothing is submitted or stored on this site.` became `Use the question form
without opening an email app. Online delivery is not connected yet.`; `Email a
question →` became `Ask a question →`. These changes are confined to the Task 5
requirement to remove mail-only endings.

## Additions

- `/contact` with one H1, two H2s, four fields and one submit action.
- Name, Email address, question and optional journey/section context controls.
- Visible and editable journey context from every journey-related entry point.
- Focused validation summary and field-associated error text.
- Honest unavailable-delivery state that preserves all entered text.
- Visible fallback: `nerminehammam@gmail.com`.
- Privacy wording: information is for answering the question; an enquiry does
  not reserve a place; no payment is taken.

## Structural preservation

- Fonts and weights unchanged.
- Existing image files and sources unchanged: 84 public images.
- Locked map component unchanged: `e596b8c558e81e6c05e66e60cbee71965c8d072003e2a77e3ee43b985fbd8140`.
- Locked map styles unchanged: `1b32d62821521dbe360d35ea9e2d040866b49ad5c09bf10760155e6444d787f7`.
- Journey and section data unchanged: `28c21040112f6b59e905a6de08c6df645798ca55f8aa2e1ae2cd9dbbdb58e844`.
- Map destination and route data unchanged.
- Itinerary and nine section slugs unchanged.
- Eleven gateway records and ten selectable joining entries unchanged.
- Navigation order unchanged; only the existing utility question destination
  changed.
- Sign in page unchanged: `31c6e452eba040e7af9e403d5f1793a551c92fb09fec55e4248871c5f34483a6`.
- Travel Self model and scoring unchanged:
  `c81d56bb3802cb8b131cb2cde51ed4f25506978c9051656d1abdc9e320c56e90`.
- No new visual system or dependency introduced.
- Route count increases only by the explicitly permitted `/contact` route.

## Accessibility checks

- Keyboard: validation summary receives focus; the next Tab reaches the first
  invalid field; the form completes by keyboard.
- Focus: shared focus styling remains visible and errors are linked with
  `aria-describedby` and `aria-invalid`.
- Contrast: Axe reports no serious or critical issue inside the contact main
  content in both desktop and mobile contact-flow tests.
- 200% zoom: the 720 CSS-pixel equivalent of a 1440px viewport has no page
  overflow and retains all controls.
- 320px: all labels, fields, instructions and the submit action remain usable
  without page-level horizontal overflow.
- Reduced motion: no animation was added; existing reduced-motion form rules
  remain in force.
- Semantics: one H1, persistent labels, two supporting H2s, alert/status live
  regions and a visible fallback email link.

## Tests

- `npm run test:unit`: 15 files, 78 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- Focused contact unit and contract suite: 4 files, 28 tests passed.
- Contact browser flow and responsive checks: 3 passed, 1 expected project skip.
- Firefox and WebKit contact rendering: 2 passed.
- Full internal-destination crawl: 1 passed across every public route.
- Contact main-content Axe scan: no serious or critical violations.
- `npm run build`: passed; 34 generated routes/pages, including `/contact`.
- No separate integration-test command exists; form-to-route continuity is
  covered by the Playwright browser flow and destination crawl.

## Screenshots

- `contact-desktop-1440.png`
- `contact-mobile-375.png`
- `contact-mobile-320.png`
- `contact-zoom-200-equivalent.png`

There is no production-baseline screenshot for `/contact` because the route did
not exist in the baseline deployment.

## Commit

- Required message: `Add accessible contact journey`
- Commit SHA: reported in the Task 5 approval handoff after checkpoint creation.
- Exact staged files are recorded at commit time; unrelated untracked files are
  excluded.

## Deferred findings

- Live delivery remains unavailable until an approved provider, credential,
  sender and recipient configuration are supplied. No workaround was invented.
- The pre-existing global Axe suite flags the approved orange wordmark on paper
  at 1024px. Task 5 did not change the wordmark or brand colour.
- The pre-existing shared form-surface test expects a form at `/start-here`, but
  that route currently contains no form. Task 5 did not change `/start-here`.
