# Task 7 - Simplify Travel Self progress and passion flow

## Task completed

- Task: 7, Simplify Travel Self progress and passion flow.
- User problem: the quiz now presents one clear `Step x of 17` count and divides
  the final passion decision into selection and priority screens without adding
  misleading extra steps.
- Preservation approach: presentation state was separated from the existing
  scoring model. The sixteen questions, answers, scoring, centroids, passion
  weighting, result names, result copy and recommendation order remain intact.

## Production baseline

- Production URL: `https://sawayatra.vercel.app/`
- Deployed baseline SHA: `2822a81484a14bb535bed36d9526b5a8d7a9ec33`
- Working branch: `codex/usability-consolidation`
- Starting local checkpoint: `365fdda`

## Files changed

- `app/(public)/travel-self/TravelSelfQuiz.tsx`: replaces the dual progress
  denominator, separates passion selection from priority ranking, preserves
  state across Back, edit, save, cancel and recovery, and moves focus and the
  viewport to each new screen heading.
- `components/ui/Progress.tsx`: exposes the visible step wording through
  `aria-valuetext` so assistive technology receives the meaningful count.
- `components/ui/Progress.module.css`: makes the single step count visually
  dominant while retaining the existing typeface, weights and progress style.
- `content/travel-self/travel-self-model.ts`: changes only the passion-screen
  heading to the required exact title, `Choose up to four reasons you travel.`
- `lib/travel-self-session.ts`: stores the `choose` or `prioritise` passion
  substage and safely migrates older sessions that did not contain this field.
- `tests/travel-self/quiz-v2.test.tsx`: covers the split screen, retained
  selections, retained primary choice and unified progress.
- `tests/travel-self/session-v2.test.ts`: covers both substages and legacy
  session migration.
- `tests/e2e/release-one.spec.ts`: covers the complete keyboard flow, one
  denominator, focus, Back-state preservation, edit/cancel restoration and
  accessibility at four viewport sizes. It also corrects the existing contact
  destination assertion to the already-approved Task 5 route.
- `docs/verification/usability-consolidation/task-7/screenshots/*.png`: local
  desktop, mobile, 320px and 200%-zoom-equivalent verification.
- `docs/verification/usability-consolidation/task-7/report.md`: this report.

## Content-deletion table

The repository diff and the committed production text inventory were compared.
No production-baseline Travel Self introduction text is removed. The only
Task 7 rewording occurs in the interactive passion state:

| Route | Removed baseline text | Replacement | Reason | Restored or approved |
| --- | --- | --- | --- | --- |
| `/travel-self` interactive step 17 | `Choose the reasons you travel.` | `Choose up to four reasons you travel.` | Exact Task 7 substage-A title and clearer selection limit. | Approved by Task 7 |

No files, questions, options, results, recommendations, images, routes or
controls were deleted.

## Additions

- Visible progress from `Step 1 of 17` through `Step 17 of 17`.
- Secondary labels `Question n`, `Choose passions` and `Choose priorities`
  without a second denominator.
- A separate `Choose priorities` action and screen.
- A clear `Cancel` action when passions are edited from a completed result.
- Recoverable `choose` and `prioritise` session substages.
- Screen-reader progress values matching the visible `Step x of 17` wording.

## Structural preservation

- Fonts and weights unchanged.
- Images and image sources unchanged; no asset file is included in this task.
- Locked map component, styles, data, geography, route line and markers
  unchanged.
- Itinerary, section order and nine section slugs unchanged.
- Eleven gateway records and ten selectable joining entries unchanged.
- Primary navigation order unchanged; Sign in remains separate.
- Travel Self scoring implementation unchanged:
  `lib/travel-self.ts` remains
  `201e6c7627fb8e6c6f3e6adad79a4d38bb8d9b135165ae9d6e37c539794c79e1`.
- Analytics event definitions and transmission boundary unchanged:
  `lib/travel-self-events.ts` remains
  `34eaa0eebe733f0d9fad3db8d90942fb53fc3a394103b9d919b14c9c4e06715a`.
- The model-file diff is one presentation string only; all sixteen questions,
  option wording, axis values, centroids, passion weighting, results and
  recommendation calculations are unchanged.
- No dependency, route, image, typeface or replacement visual system added.

## Accessibility checks

- Keyboard: the full 17-step flow, both passion substages, result editing,
  Cancel and answer editing complete using keyboard controls only.
- Focus: each question and passion substage focuses its named H1; returning
  from edit/cancel restores focus to the initiating control.
- Progress semantics: the native progress element receives `aria-valuetext`
  matching the visible single denominator.
- Contrast: the existing approved olive, paper, pink, sun and ink relationships
  remain; the focused Task 7 Axe scan reports no serious or critical issue.
- 200% zoom: verified with a 720 CSS-pixel equivalent; labels and actions wrap
  without page-level horizontal overflow.
- 320px: both priority choices remain readable and keyboard-operable with no
  clipped text or hidden action.
- Reduced motion: no animation was introduced; screen positioning is instant.
- Semantics: one screen H1, fieldset legends, native checkbox/radio groups,
  live selection count and native progress semantics remain in use.

## Tests

- `npm run lint`: passed with no errors or warnings.
- `npm run typecheck`: passed.
- `npm run test:unit`: 17 files and 85 tests passed.
- Focused Task 7 component/session/model suite: 4 files and 28 tests passed.
- Focused Task 7 Playwright flow: 4 passed at 375px, 768px, 1024px and
  1440px. This includes keyboard completion, focus, Back/edit/cancel state and
  an Axe scan.
- `npm run build`: passed; Next.js generated 34 routes/pages.
- No separate integration-test command exists; component-to-route integration
  is covered by the focused Playwright flow.
- A broad legacy Playwright run was attempted and stopped after reproducing
  documented baseline failures outside Task 7. The Task 7 test passed in every
  completed project during that run and again in the isolated four-project run.

## Screenshots

Production references:

- `../production-baseline/desktop-1440/travel-self-question.png`
- `../production-baseline/desktop-1440/travel-self-passion.png`
- `../production-baseline/mobile-375/travel-self-progress.png`
- `../production-baseline/mobile-375/travel-self-passion.png`

Local Task 7 captures:

- `screenshots/approval-passion-select-desktop-1440.png`
- `screenshots/approval-passion-priorities-desktop-1440.png`
- `screenshots/approval-result-desktop-1440.png`
- `screenshots/approval-passion-select-mobile-375.png`
- `screenshots/approval-passion-priorities-mobile-375.png`
- `screenshots/approval-result-mobile-375.png`
- `screenshots/approval-passion-priorities-mobile-320.png`
- `screenshots/approval-passion-priorities-zoom-200-equivalent.png`

## Commit

- Required message: `Simplify Travel Self progress and passion flow`
- Commit SHA: recorded in the approval handoff after checkpoint creation.
- Exact staged files are the eight implementation/test files listed above plus
  this report and the eight Task 7 screenshots. Unrelated untracked files are
  excluded.

## Deferred findings

- The broad historical Playwright suite still contains documented pre-existing
  assertions for older navigation, colour and layout states. Its baseline
  failures are unrelated to the Task 7 files and were not changed here.
- The Next.js development-tool badge appears in local screenshots. It is local
  framework tooling and is absent from the production build.
