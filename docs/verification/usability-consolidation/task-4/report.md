# Task 4 - Align journey labels with available products

## Preservation result

Task 4 changes public wording only. No route, anchor, navigation item, dropdown
entry, component, stylesheet, image, journey fact, section, map source, map
behaviour, membership configuration or interaction was changed.

The five required pages were audited. Home, Membership and Departures were
already accurate and remain byte-for-byte unchanged. Only How it works and
About required wording corrections.

## Deletion and replacement table

| Page | Removed wording | Replacement | Why |
| --- | --- | --- | --- |
| How it works | `Browse journeys openly.` | `Browse the Andean Caravan openly.` | Names the journey actually available now. |
| How it works | `Browse journeys created by other members and express interest when one feels right.` | `Available now: the Andean Caravan, with nine consecutive sections and one complete route.` | Removes a member-created inventory claim that the destination cannot fulfil. |
| How it works | `Browse Member Journeys` | `Browse available journeys` | Accurately labels the Departures hub destination. |
| How it works | `Created by you` | `Future membership pathway` | Marks Create Your Own as later, not currently available. |
| How it works | `Choose your destination, dates and travel style, then invite compatible members to join.` | `A later way for members to propose a destination, dates and travel style, then invite compatible members to join.` | Preserves the model while making its future status explicit. |
| How it works | `Create a Journey` | `Ask about future access` | The destination is an invitation enquiry, not a live creation tool. |
| How it works | `Completed Travel Self required.` | `Not yet available.` | Removes the implication that completing the Travel Self unlocks this feature now. |
| How it works | `Privacy by design` | `Future member-created journeys` | Locates the following mutual-interest model in the future pathway. |
| How it works | `When you express interest in a journey, the other member can review your Travel Self without receiving your private identity or contact details. If both of you choose to connect, Sawayatra opens an introduction.` | `When this membership pathway opens, another member will be able to review your Travel Self without receiving your private identity or contact details. If both of you choose to connect, Sawayatra will open an introduction.` | Retains the planned consent model without presenting it as live. |
| How it works | `Interest states` | `Planned interest states` | Marks the states as part of the future model. |
| About | `A caravan with a point of view.` | `A travel club with a point of view.` | Defines Sawayatra as the club, not only its first journey. |
| About | `Sawayatra organises one long route around designated joining points, practical clarity and the life found between destinations.` | `Sawayatra brings compatible travellers together through shared journeys. It begins with the annual Andean Caravan, built around designated joining points, practical clarity and the life found between destinations.` | Aligns About with the approved homepage definition while retaining the Andean Caravan as the first route. |
| About | `Begin with the route.` | `Begin with the first route.` | Makes room for future shared journeys without weakening the current route. |
| About | `Follow the caravan` | `Explore the Andean Caravan` | Names the exact destination opened by the CTA. |

No journey copy, journey facts, images or sections were deleted. The table
records only misleading or over-narrow public wording replaced in place.

## Protected content checks

These required pages and sources match the pre-edit SHA-256 values:

- Homepage: `61d44788df8666ca4f245a5c9eb5caccd1f376dd4b8515325c4b6e87bbc446a2`
- Membership page: `78d962f10e7d4bad546e7472132d56554e5f736cdca90595e123e07b3725e5d7`
- Departures page: `60d0ad419d3c03152d15396178a94ba96c3b2d8fe5200f8249b0d00cbdd502c9`
- Departures dropdown source: `7cb88e38f6a24f2a81205e42b39157e921bf1ab96343f35708a8d8038d6bd916`
- Locked map component: `e596b8c558e81e6c05e66e60cbee71965c8d072003e2a77e3ee43b985fbd8140`
- Locked map styles: `1b32d62821521dbe360d35ea9e2d040866b49ad5c09bf10760155e6444d787f7`
- Unique Caravan explainer: `999fb4f35509815c4010a17b6e5166e756c9d591138cd90ceba6bc6a0fd739c1`
- Unique Caravan explainer content: `2d42751d40286592524502ffa6efe4c15ac769b8da6719056b2c2b4a405d2d00`
- Journey and section data: `28c21040112f6b59e905a6de08c6df645798ca55f8aa2e1ae2cd9dbbdb58e844`
- Destination data: `ee72bfbccc141f82b6cd31c7ec51796410ece42fc29ba6a743035919b3ab4172`
- Route data: `feb853289489b9cb1b074a154b68a21e747f490a1e36b423edaab44f743ffb15`
- Journey image assignments: `4bfcf4208498fbd82803a17a8522d5ec2c1867686edd61fd86bcd655db89c243`
- Public image inventory: 84 files, aggregate checksum `cee2588ed75831fa5593d5f9818a377f9e278da3f1fcd81d0a0261475f21c753`

## Verification

- No public source contains `Browse Member Journeys`.
- No public source claims journeys at Departures were created by other members.
- Create Your Own is retained and explicitly marked as a future membership pathway.
- How it works names the Andean Caravan as available now.
- About defines Sawayatra as a travel club beginning with the Andean Caravan.
- Home, Membership and Departures remain unchanged.
- Desktop and mobile replacement CTAs fit without horizontal overflow.
- Desktop Departures dropdown opens with all six entries intact and in order.
- Mobile drawer dropdown opens with the same six entries intact and in order.
- Full unit suite: 74 passed.
- TypeScript: passed.
- ESLint: passed.
- Production build: passed, with the same 33 generated pages.

## Files intentionally changed

- `app/(public)/how-it-works/page.tsx`
- `app/(public)/about/page.tsx`
- `tests/content/product-language.test.tsx`
- `docs/verification/usability-consolidation/task-4/report.md`

No production file outside the first two entries was modified for Task 4.
