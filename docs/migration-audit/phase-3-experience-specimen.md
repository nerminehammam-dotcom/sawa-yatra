# Phase 3 · Information architecture and experience specimen

Status: **implemented · waiting at the founder-review stop**

Date: 10 August 2026

## Review surfaces

The specimen is internal, no-index and unavailable in an ordinary production
build unless `CARAVAN_PHASE3_PREVIEW=1` is deliberately supplied.

- Overview: `/caravans/andean/phase-3-preview`
- Section 03: `/caravans/andean/phase-3-preview/the-mirror`
- Neutral copy stress fixture: `/caravans/andean/phase-3-preview/stress`

The public `/caravans/andean` page remains unchanged. Missing founder copy
therefore cannot leak into the live experience.

## Proven architecture

### Overview

1. factual proposition;
2. four primary section choices;
3. visibly subordinate Stone Road entry;
4. Level 1 section chooser and altitude-orientation map;
5. the fixed joining explanation;
6. Water, Materials, and People and pace editorial slots;
7. a single Andean Caravan Journeys entry; and
8. an enquiry area whose action is withheld by LB-01.

The overview never renders a 71-day accordion and never treats the Stone Road
as a fifth section.

### Section 03

1. hero and fact strip;
2. mandatory Declared Load Exception and eleven-night ladder;
3. Shape of Journey;
4. Level 2 stage map;
5. founder editorial slot;
6. demands;
7. stage-first itinerary, with Stage B's day detail expanded;
8. places and photography;
9. travel, sleep and joining information; and
10. an enquiry area whose action is withheld by LB-01.

The disclosure is the first content after the hero and fact strip. It precedes
all imagery beyond the hero, maps, founder editorial copy, itinerary and CTA.

## New reusable patterns

- `FounderCopy`: conspicuous preview-only copy slot with a manifest ceiling;
- `CaravanOverviewMap`: four selectable route bands, five gates and horizontal
  known-overnight-altitude orientation;
- `Shape of Journey`: separate encodings for effort, operating environment and
  recovery/protection, with text alternatives and no score;
- Level 2 stage route form: three stages, principal places and distinct flight
  treatment; and
- stage-first itinerary: native disclosure controls with one expanded-day
  treatment.

No UI library, CSS framework, identity token, global colour, type role, header
or footer was added or changed.

## Copy governance

`content/caravan/copy-manifest.json` is the writing/implementation interface.
It contains 55 founder-copy slots plus the fixed, locked and derived specimen
records. Every founder slot has a stable ID, measured ceiling, breakpoint note,
fact-check state, approval state and placeholder policy. No slot uses
`drafted`; founder copy begins at `needed`.

The stress route fills each founder slot exactly to its ceiling with the neutral
word `Measure`. It is explicitly labelled as a layout fixture, not proposed
Sawayatra copy.

## Altitude honesty

Known overnight altitudes stated in the Route Master have been added to the
canonical day records. Unknown contracted-property values remain null. Maps
omit those vertices and the Section 03 ladder prints `Altitude pending
contract`; neither surface interpolates or invents a value. LB-02 records the
required completion before a Section 03 enquiry action can ship.

## Responsive verification

Checked against the running application on 10 August 2026:

- **1440 × 900:** all four overview choices end at 819 px; the fixed joining
  choice statement ends at 853 px; no horizontal overflow;
- **1024 × 768:** all four overview choices end at 653 px; the fixed statement
  ends at 735 px; no horizontal overflow;
- **390 × 844:** the full proposition is visible and the first section choice
  begins at 759 px; the layout width equals the viewport content width;
- Section 03 keeps hero → facts → disclosure as the first three content
  objects at every width;
- the mobile Section 03 ladder becomes an eleven-row list, including three
  visibly pending altitude records; and
- the Stage B disclosure is the only itinerary stage open by default.

Browser console errors: none.

## Review gate

This phase stops here. Approval is required before Phase 4 may:

- replace the canonical public overview;
- build the canonical Section 01, Section 02, Section 04 and Stone Road pages;
- merge the one-entry design into the public Journeys surface; or
- record this candidate as the approved Caravan visual baseline.

Founder review should decide the architecture, density, copy ceilings, map
language, disclosure prominence and mobile order. Supplied copy and visual
adjustments can then be placed against the manifest without changing route
truth.
