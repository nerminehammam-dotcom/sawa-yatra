# Production performance baseline

Build: Next.js production build on `migration/andean-caravan-v1-3` before any
runnable migration change. Each scenario ran three times with Lighthouse 13.4.1
against the same local production build; the table reports the median. Desktop
used 1440×900. Mobile used Lighthouse throttling with a 390×844 screen.

Compressed raw reports are in `performance/*.json.gz`.

| Surface | View | Perf | A11y | BP | SEO | LCP | CLS | TBT | Total transfer | JS transfer | Image transfer |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Overview | Desktop | 99 | 97 | 96 | 69 | 0.96s | 0.000 | 0ms | 830 KiB | 278 KiB | 55 KiB |
| Stone Road | Desktop | 95 | 100 | 96 | 69 | 1.49s | 0.000 | 0ms | 1,084 KiB | 293 KiB | 294 KiB |
| Journeys | Desktop | 98 | 98 | 96 | 66 | 1.06s | 0.000 | 0ms | 809 KiB | 274 KiB | 20 KiB |
| Route map | Desktop | 97 | 100 | 96 | 69 | 1.27s | 0.000 | 0ms | 800 KiB | 278 KiB | 35 KiB |
| Overview | Mobile | 83 | 93 | 96 | 69 | 4.73s | 0.000 | 4ms | 771 KiB | 278 KiB | 40 KiB |
| Stone Road | Mobile | 79 | 100 | 96 | 69 | 5.63s | 0.000 | 4ms | 844 KiB | 293 KiB | 97 KiB |
| Journeys | Mobile | 83 | 98 | 96 | 66 | 4.73s | 0.000 | 3ms | 749 KiB | 274 KiB | 20 KiB |
| Route map | Mobile | 82 | 97 | 96 | 69 | 4.95s | 0.000 | 5ms | 761 KiB | 278 KiB | 40 KiB |

## Findings

- Desktop LCP is already within the future 2.0s core budget on all four audited
  surfaces.
- Mobile LCP fails the future 2.5s budget on every audited surface; Stone Road is
  slowest at a 5.63s median.
- CLS is excellent at zero in all scenarios.
- Initial JavaScript transfer is 274–293 KiB, already above the future 220 KiB
  pre-map budget.
- Overview and standalone map transferred the same script set in the audit;
  there is no separately identifiable optional map chunk to report. The map is
  not interaction-level split from the initial route payload.
- Initial image transfer is within future eager-image budgets, but the locked
  full-page image budget still needs a scripted scroll test on the Phase 3
  specimen. Lighthouse initial-navigation numbers are not a substitute for it.
- SEO scores are limited by the intentionally empty production site URL/noindex
  setup and current metadata state; this is not treated as a performance defect.

The Phase 3 specimen must reduce mobile LCP and initial JavaScript without
removing required disclosures, lowering type size, weakening photography or
disabling tablet map behaviour.
