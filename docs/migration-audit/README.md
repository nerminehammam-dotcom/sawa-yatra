# Andean Caravan migration audit

Status: **Phase 1 complete — founder approval pending**

Branch: `migration/andean-caravan-v1-3`

Rollback commit: `8dddebe5b25307513b9923869f726cb7b305fe2e`

Audit date: 9 August 2026

This directory is working material only. It is outside `app`, `pages` and
`public`, is not linked by the application, and is absent from the browser-facing
build output.

## Phase 1 result

The current implementation is a coherent nine-section site, but it is not a
safe base for changing individual labels. Route truth is repeated across a
central content file, a separate gate-selector dataset, map data, JSX copy,
navigation, metadata and Journeys. The four-section migration therefore needs
the canonical structured model required by the execution lock before the visual
redesign begins.

No application, route, component, style, map, configuration, production content
or redirect was changed during this phase. Only this audit, screenshots and raw
performance reports were added.

## Audit set

- [Repository, route and content audit](./repository-and-content-audit.md)
- [Experience, map, photography, Journeys and design-system audit](./experience-audit.md)
- [Performance baseline](./performance-baseline.md)
- [Proposed URL architecture](./url-architecture.md)
- [Existing copy inventory](./copy-inventory.md)
- [Phase 0 safety record](./phase-0-safety.md)
- `baselines/` — full-page and first-viewport captures at 1440, 1024 and 390
- `performance/` — three compressed raw Lighthouse JSON runs per audited scenario

## Human stop

Phase 2 must not begin until the founder explicitly approves:

1. this audit;
2. the proposed URL architecture;
3. the Journeys branch; and
4. any necessary configuration change.

Recommended Journeys branch: **one unlabelled Andean Caravan entry**. There are
no member-created journeys on the launch surface, so a two-sided taxonomy would
publish an empty category.

Configuration issue requiring a later decision: production-equivalent enquiry
delivery is not configured. The required email variables exist only as empty
entries. The migration must not instruct visitors to submit an enquiry until a
real delivery path passes an approved preview test.
