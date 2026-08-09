# Proposed Caravan URL architecture

Status: **proposal for founder approval; no redirects implemented**.

## Canonical product documents

| Product | Proposed canonical |
| --- | --- |
| The Andean Caravan | `/caravans/andean` |
| 01 · Sea to Stone | `/caravans/andean/sea-to-stone` |
| The Stone Road | `/caravans/andean/the-stone-road` |
| 02 · Both Shores | `/caravans/andean/both-shores` |
| 03 · The Mirror | `/caravans/andean/the-mirror` |
| 04 · The End of the Road | `/caravans/andean/the-end-of-the-road` |

This keeps every product inside one Caravan namespace. Section 01 owns the
canonical day-by-day record for Days 16–23. The Stone Road page’s metadata
canonical will point to the Section 01 document URL—not a fragment—while its
visible product page remains reachable for visitors.

## Current URL → canonical/redirect/anchor

| Current URL | Proposed canonical document | Redirect destination | Anchor / disposition |
| --- | --- | --- | --- |
| `/caravans` | `/caravans` | none | Retain as the collection surface. |
| `/caravans/andean` | `/caravans/andean` | none | Canonical overview. |
| `/caravans/andean/route-map` | `/caravans/andean` | `/caravans/andean` | `#shape-of-the-journey` |
| `/caravans/andean-caravan/how-it-works` | `/caravans/andean` | `/caravans/andean` | `#how-the-caravan-works` |
| `/caravans/the-andean-caravan` | `/caravans/andean` | `/caravans/andean` | none |
| `/caravans/who-else-is-travelling` | `/caravans/andean` | `/caravans/andean` | `#who-else-is-travelling`; retain only if real launch data exists, otherwise redirect. |
| `/departures` | `/caravans/andean` | `/caravans/andean` | none |
| `/departures/the-andean-caravan` | `/caravans/andean` | `/caravans/andean` | none |
| `/departures/desert-coast` | `/caravans/andean/sea-to-stone` | `/caravans/andean/sea-to-stone` | `#stage-a` |
| `/departures/white-city-deep-canyon` | `/caravans/andean/sea-to-stone` | `/caravans/andean/sea-to-stone` | `#stage-b` |
| `/departures/the-stone-road` | `/caravans/andean/the-stone-road` | `/caravans/andean/the-stone-road` | none; the locked asymmetry. |
| `/departures/both-shores` | `/caravans/andean/both-shores` | `/caravans/andean/both-shores` | `#stage-a-the-islands-and-the-border` |
| `/departures/thin-air-cloud-forest` | `/caravans/andean/both-shores` | `/caravans/andean/both-shores` | `#stage-b` |
| `/departures/silver-and-bone` | `/caravans/andean/the-mirror` | `/caravans/andean/the-mirror` | `#stage-a` |
| `/departures/the-mirror` | `/caravans/andean/the-mirror` | `/caravans/andean/the-mirror` | `#stage-b-the-salar-and-the-lagunas` |
| `/departures/atacama` | `/caravans/andean/the-mirror` | `/caravans/andean/the-mirror` | `#stage-c` |
| `/departures/the-end-of-the-road` | `/caravans/andean/the-end-of-the-road` | `/caravans/andean/the-end-of-the-road` | none |
| `/joining-points` | `/caravans/andean` | `/caravans/andean` | `#joining-and-leaving` |
| `/journeys` | `/journeys` | none | Retain; replace nine cards with one Caravan entry. |
| `/contact?journey=…` | `/contact` | none | Retain generic form; future product IDs must be canonical model IDs, not free-text section names. |

Known URLs receive precise redirects. Unknown Caravan-shaped URLs must return a
real 404 with recovery links to the overview and four sections; there will be no
blanket redirect to a 200 overview.

Fragments are navigation only. They are not canonical targets and are not sent
to the server.
