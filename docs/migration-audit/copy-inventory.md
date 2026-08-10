# Existing Caravan copy inventory

Status: inventory only. **Nothing in this document is approved founder copy.**
Existing wording may move forward only after explicit founder review and later
copy-manifest approval.

## 1. Copy-bearing sources

| Current surface | Wording location | Likely future use | Factual dependencies | Duplication |
| --- | --- | --- | --- | --- |
| Overview hero | `app/(public)/departures/page.tsx` | overview proposition/standfirst candidate | one continuous annual route; section choice | Related language in home and field document. |
| Complete Caravan page | `app/(public)/departures/[slug]/page.tsx` `CompleteCaravanPage` | overview/whole-Caravan editorial slots | 71 days, countries, flights, gates, season | Several claims repeat central model and selector page. |
| Nine legacy section pages | `content/andean-caravan.ts` `promise`, `whyThisSectionExists`, `journeyShape`, `feature`, `warnings`, `standaloneWindows` | future section/stage/editorial candidates | day allocation, route modes, altitude, season, comfort, access | Promise/route/facts repeat selector `_content.ts`. |
| Gate/how page | page JSX, `_content.ts`, FAQ | how-it-works, joining ritual, pre-sale disclosure candidates | four-section/five-gate model, Hosts, arrival support, conditions | Rules and counts repeat central model/navigation. |
| Map details | `content/andean-caravan-destinations.ts` | quiet place context/captions | verified altitude/population/source; new map semantics | Place images/captions repeat image registry. |
| Collection/field document | `content/field-document.ts`, `/caravans` page | overview navigation and regional context candidates | locked product hierarchy | Uses legacy joining-point derivation. |
| Journeys | `/journeys/page.tsx`, `content/journeys-catalog.ts` | single Caravan entry and hub context | live/member-created state | Nine cards duplicate nine sections. |
| Metadata/navigation | `content/site.ts`, `content/navigation.ts` | SEO slots and derived labels | canonical product model and approved SEO copy | Nine-section and hop-on/off wording repeated. |

## 2. Candidate passages for founder review

These are the current distinctive passages worth reviewing; they are not
automatically carried forward.

| Candidate | Current wording or identifier | Likely slot | Review notes |
| --- | --- | --- | --- |
| Overview proposition | “Choose where the road becomes yours.” | `overview.hero.proposition` | Strong, short line; verify against the new first-viewport chooser. |
| Whole-Caravan title | “The whole length of the Andes. Once a year.” | overview/editorial heading | Factually compatible with annual operation; founder approval still required. |
| One changing group | Current paragraph beginning “The complete journey is not nine holidays placed end to end…” | overview group-rhythm slot | “nine holidays” is retired and must be rewritten or rejected by founder. |
| Ground movement | Current paragraph beginning “It moves overland, by van, Land Cruiser…” | overview movement slot | Four-flight claim is obsolete; must be fact-checked to the five-flight model. |
| Seasonal logic | “The calendar is arithmetic.” plus current Salar/Patagonia/boat paragraph | overview season slot | Candidate idea; exact dates and operational claims require route references. |
| Patagonian close | Current “The road ends. The journey does not simply reverse.” block | Section 04 editorial slot | Route return logic needs reconciliation with locked day records. |
| Honest conditions | Current refuge/Amantaní/Tortel paragraph | pre-sale disclosures by section | Must be split into the relevant product surfaces and rendered before enquiry. |
| Joining ritual | Six-item welcome list on Caravan how-it-works | overview joining process | Host model and handover statements need locked-source verification. |
| Gate explanation | “A gate is a designated city where you may join or leave…” | overview joining definition | Must name only Lima, Puno, Sucre, Santiago and Balmaceda; Cusco is short-form only. |

## 3. Legacy-to-future editorial routing

| Existing copy group | Future owner if approved | Notes |
| --- | --- | --- |
| Desert Coast | Section 01 Stage A | Remove Nazca overflight and retired section framing. |
| White City, Deep Canyon | Section 01 Stage B | Reconcile route with atomic Days 10–15. |
| The Stone Road | Section 01 Stage C + Stone Road product framing | One day source; product copy remains separate manifest slots. |
| Both Shores | Section 02 Stage A, “The Islands and the Border” | Required subline “Titicaca, La Paz and the Road East” belongs on product surfaces. |
| Thin Air & Cloud Forest | Section 02 later stages | Remove Sajama/legacy gate assumptions where locked route differs. |
| Silver & Bone | Section 03 Stage A | Reconcile with Sucre-to-refuge altitude ladder. |
| The Mirror | Section 03 Stage B, “The Salar and the Lagunas” | Declared Load Exception must precede editorial copy in the locked position. |
| Atacama | Section 03 Stage C | “Red Earth, Open Sky” is the locked legacy mapping label; current public title is simply “Atacama”. |
| The End of the Road | Section 04 | Current 13-day copy must be reconciled with the locked 14-day section and Day 71 exit. |

## 4. Copy governance findings

- The current model has no `copy_class`, approval status, slot ID, route-fact
  references or fact-check status.
- Some comments call copy “approved” or “locked”, but this is not the v1.3 copy
  manifest and cannot substitute for explicit founder approval.
- Candidate copy contains retired facts and labels. Copy cannot be migrated by
  mechanical rename.
- Phase 2/3 preview must render the required visible
  `[COPY: slot_id · ≤max]` placeholder for every missing `founder_copy` slot.
- No implementation-agent-authored travel prose will be inserted into those
  slots.
