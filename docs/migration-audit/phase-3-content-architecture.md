# Phase 3 · Content architecture and copy manifest

Status: **founder-approved · Phase 4 authorised**

Date: 10 August 2026

Founder approval recorded: 10 August 2026. The founder approved placing this
content onto browser pages with the existing design, followed by separate
founder-led redesign one section at a time.

## Governing instruction

Website Content Migration Prompt v2.0 supersedes the earlier design-led brief.
Phase 3 contains no page design, specimen, mockup, map treatment, new component,
new style or design rationale. The rejected internal preview and its visual
components have been removed. The public site remains visually unchanged.

The v2.0 prompt contains a small amount of residual wording about redesign and
an approved visual baseline. Its expressly overriding rule, Phase 3 stop and
"There is no specimen in this build" instruction resolve that conflict: this
checkpoint is content only.

## Authority

| Source | SHA-256 |
| --- | --- |
| Route Master v4.2.1 LOCKED · NAMES APPROVED | `15d8b91c11778c18a090dcca4285121cc18d42068516e5b25a2c2277a2cca88e` |
| Website Content Migration Prompt v2.0 | `a19d2d5362f0bb73c15b4fd25509246e7785cd5a361419c7e22a93afeecdaff0` |

The Route Master supplies route truth. The v2.0 prompt supplies migration,
architecture, copy-governance and acceptance rules. Earlier experience,
decision and website-build documents are audit history, not current authority.

## Product set

| Product | Days | Gate pair | Content surface |
| --- | ---: | --- | --- |
| The Andean Caravan | 1–71 | Lima → Balmaceda | Overview |
| 01 · Sea to Stone | 1–23 | Lima → Puno | Section page |
| The Stone Road | 16–23 | Cusco → Puno | Subordinate short-form product page |
| 02 · Both Shores | 24–39 | Puno → Sucre | Section page |
| 03 · The Mirror | 40–57 | Sucre → Santiago | Section page |
| 04 · The End of the Road | 58–71 | Santiago → Balmaceda | Section page |

Section 02 carries the exact subline `Titicaca, La Paz and the cloud forest` on
cards and product surfaces.

The four section ranges tile the 71 days exactly. Section 01 owns the one
canonical Day 16–23 record set. The Stone Road references those records and its
page-level canonical target is the Section 01 document URL, never a fragment.

## Overview content order

1. proposition;
2. four-section choice, with The Stone Road visibly subordinate in content
   hierarchy rather than presented as Section 05;
3. Level 1 map content derived from the canonical route model;
4. joining explanation;
5. route threads; and
6. enquiry.

The overview does not contain the complete 71-day itinerary.

## Section content order

Every section uses the same content sequence:

1. hero;
2. at a glance, including `route_max_altitude` with qualifier and survey status;
3. Level 2 map content;
4. editorial section character;
5. demands;
6. stage-first itinerary;
7. places and people;
8. travel, sleep, joining and leaving; and
9. enquiry.

Section 03 inserts its expanded Declared Load Exception and eleven-night
acclimatisation ladder immediately after hero and facts, before editorial or
gallery content, itinerary and enquiry. One founder-written framing sentence
may precede the locked disclosure inside the same block. It may not alter or
soften the locked wording.

## Stage and day rules

- stages are the scanning unit;
- only Section 01 Stage C has product behaviour because it is The Stone Road;
- no other stage may carry a price, date range, capacity or booking control;
- exactly 71 atomic day records feed every surface;
- the public projection admits only `public` and `pre_sale_disclosure` content;
- proposed facts remain conditional and unapproved commercial fields are
  omitted rather than shown as placeholders; and
- the included Balmaceda → Santiago exit flight is content, not route geometry.

## Journeys content

Journeys contains one unlabelled Andean Caravan entry. Member-created journeys
are not live, so the content architecture publishes no empty member category
and invents no member journey.

## Copy governance

The complete repository interface is `content/caravan/copy-manifest.ts`, backed
by the human-editable founder-slot register in
`content/caravan/copy-manifest.json`. It assigns a copy class to founder slots,
the exact v2.0 Section 02 subline, derived route labels and every public or
pre-sale text record in the canonical model without copying the wording into a
second store. It contains no implementation-agent-written founder prose.
Founder slots remain `needed`; production placeholders are forbidden. The two
phrases previously carried from the old Experience Brief have been returned to
`founder_copy`, because v2.0 makes the Route Master and the v2.0 prompt the
complete two-file authority and does not preserve those sentences as fixed
phrases.

Length ceilings refer only to existing patterns: `PageHero`, `DepartureCard`,
ordinary `Section` body copy, `Accordion`, `JourneyGallery` captions and the
existing form introduction. No ceiling comes from the rejected preview.

Locked route descriptions, free-time notes, conditional items, disclosure and
progression content continue to live once in the canonical model with their
`copy_class`; the manifest is the writing and placement interface, not a second
copy store.

## Open content blockers

- founder copy remains unsupplied and therefore cannot be placed in production;
- enquiry delivery remains unconfigured under LB-01;
- three Section 03 sleeping altitudes remain contract-pending under LB-02; and
- prices, dates, availability and other commercial fields remain omitted until
  approved and secured.

## Human stop — approved

The founder approved this content architecture and copy manifest on 10 August
2026. Phase 4 may use existing components and styles unchanged. Visual design
remains a separate founder-led process, section by section.
