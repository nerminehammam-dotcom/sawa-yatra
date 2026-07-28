# Sawayatra production content baseline

Captured: 2026-07-26

- Production alias: `https://sawayatra.vercel.app/`
- Production deployment: `https://sawayatra-k6v24kw23-minou-s-projects.vercel.app/`
- Vercel deployment ID: `dpl_8hr2RfMrFgzMQU9DBo2PmqggBpp2`
- Production Git SHA: `2822a81484a14bb535bed36d9526b5a8d7a9ec33`
- Production state: `READY`
- Working branch: `codex/usability-consolidation`

Each route text file contains the live page's visible rendered text, normalised to one string per line and sorted consistently. Duplicate strings are retained. `route-metrics.json` records image occurrences and sources, heading counts, internal-link destinations, and interactive-control counts for every required route.

## Repository-level structure

- Public route slugs: 28
- Andean Caravan section slugs: 9, plus the complete Caravan slug
- Gateway records: 11
- Selectable joining-point entries: 10
- Public image files in `public/assets/images`: 84
- Unique meaningful live image sources across the 18 required baseline routes: 73
- Meaningful live image occurrences across the 18 required baseline routes: 116

## Pre-change validation

- `npm run typecheck`: passed
- `npm run lint -- --max-warnings=0`: passed
- `npm test`: passed, 11 test files and 67 tests
- `npm run build`: passed, 33 generated routes
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npm run test:e2e`: 163 passed, 43 failed, 130 skipped

The browser failures pre-date Task 1. They include stale expectations for the earlier navigation, membership, and contact experiences; contrast/focus assertions that Task 1 is intended to repair; and a documented 323 px document width at a 320 px map test viewport. These failures are the comparison baseline, not new Task 1 regressions.
