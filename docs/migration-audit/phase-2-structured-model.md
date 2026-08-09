# Phase 2 · Canonical structured Caravan model

Status: **complete · application surfaces intentionally unchanged**

Date: 10 August 2026

## Authority check

The five source hashes still match the Phase 0 safety record. Route truth was
read from the locked Route Master; the later DD-02 recovery-role normalisation
was applied explicitly and is covered by tests.

## Implemented model

- exactly 71 contiguous atomic day records;
- four section ranges of 23, 16, 18 and 14 days;
- eleven ordered stage records;
- one product-stage exception: The Stone Road, referencing the same Day 16–23
  objects as Section 01;
- five Caravan gates plus Cusco as a short-form joining gate only;
- Section 01 canonical ownership of Days 16–23;
- the included Balmaceda–Santiago flight represented outside route geometry;
- five included scheduled flight movements, four of them within the route;
- effort, operating environment, fatigue and explicitly normalised recovery
  roles on every day;
- maker strategy and laundry availability on every stage;
- Section 02's required three-night Cusco progression;
- Section 03's eleven-night altitude ladder and Declared Load Exception;
- source, status, visibility and recheck fields on all content records; and
- Section 11 operational, legal and migration fields represented on every
  section, including explicit draft/null states where decisions remain open.

## Publication firewall

Raw route data lives under `content/caravan/raw-*`. A single server-only module,
`content/caravan/public.ts`, validates the model and creates the browser-safe
projection. Its exact visibility allowlist is:

- `public`
- `pre_sale_disclosure`

It removes `internal_operations`, `legal_review`, evidence records and private
source metadata. No current page or component imports the new raw model.

## Deliberately unresolved facts

The schema is complete, but these facts correctly remain draft or proposed
rather than being invented:

- contracted property sleeping altitudes;
- minimum operating numbers and assessment dates;
- exact Section 02 progression price and inclusion status;
- contracted maker evidence;
- exact refuge and remote-property standards;
- 2028 transport timetables and date-sensitive evidence rechecks; and
- legal conduct, removal, disruption and remedy terms.

The copy manifest ceilings depend on the Phase 3 specimen and are therefore a
Phase 3 deliverable, not guessed in Phase 2.

## Verification

- TypeScript: passed
- ESLint: passed
- Vitest: 194 tests passed
- Next.js production build: passed

The existing browser experience is unchanged. Phase 3 may now build the locked
founder-review specimen: the overview, Section 03, the Stone Road choice,
Journeys entry, maps, Shape of Journey and expanded-day treatment. It must not
roll that design across Sections 01, 02 and 04 before the review gate.
