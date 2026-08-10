# Phase 4 · Browser content placement

Status: **implemented · ready for founder-led section redesign**

Date: 10 August 2026

## Scope

The founder-approved Phase 3 content structure is now visible on public browser
pages using the website's existing components, spacing, typography, image
registry and colour system. No new visual design system was introduced.

Founder correction: the `/caravans/andean` opening must retain the established
Departures design exactly — yellow copy panel, rust headline and Patagonia road
image in the original split grid. Canonical four-section content begins within
that existing page system; the opening is not replaced by a generic page hero.

## Canonical browser pages

- `/caravans/andean` — Caravan overview and four-section index
- `/caravans/andean/sea-to-stone` — Section 01, days 1–23
- `/caravans/andean/both-shores` — Section 02, days 24–39
- `/caravans/andean/the-mirror` — Section 03, days 40–57
- `/caravans/andean/the-end-of-the-road` — Section 04, days 58–71
- `/caravans/andean/the-stone-road` — optional short form, days 16–23
- `/caravans/andean-caravan/how-it-works` — joining and leaving through the
  five Caravan gates, with Cusco shown as the short-form exception
- `/journeys` — one unlabelled Andean Caravan entry linking to the overview

## Content safeguards retained

- All public Caravan page data is read through the public projection in
  `content/caravan/public.ts` and the server-only page adapter in
  `content/caravan/page-data.ts`.
- Prices, provisional dates, availability, booking and payment actions remain
  absent.
- The enquiry-delivery configuration remains a tracked launch blocker and is
  stated plainly on the pages.
- Section 03's declared-load exception and acclimatisation progression appear
  immediately after its factual hero.
- Founder-dependent propositions, route threads and editorial character remain
  explicit development-only placeholders and are omitted from production.

## Verification

- Browser-tested the overview, four sections, Stone Road, Journeys and
  joining/leaving pages on `localhost:3000`.
- Confirmed the old nine-section wording is absent from those public surfaces.
- ESLint passed.
- TypeScript passed.
- Unit suite passed: 15 files, 200 tests.
- Next.js production build passed and generated all five canonical product
  paths.

## Next human step

Redesign one section at a time, beginning from the canonical overview or any
single section chosen by the founder. Content architecture remains fixed while
the visual treatment is reviewed.
