# Alt-text decisions awaiting the author

8 August 2026 · Phase 2 alt-text pass (constitution v2.5 §10, audit §B.2/X1).

The de-formulaic rewrite (dropping the retired "A …/An …" opener while preserving
every stated fact) has been applied across the owned files. Nothing below was
decided by the pass, because each item needs eyes on the image or a placement
call only the author can make. No new visual detail was invented anywhere.

## (a) Contradictory-alt clusters — which description is true?

Six frames carry alt text with incompatible facts in different placements. The
de-formulaic transform was applied where the opener was present, but the
differing facts were left exactly as found. At least one variant of each cluster
is factually wrong; please confirm which is true so the others can be corrected
(or re-worded for their placement's job, if the difference is intentional).

1. `gallery/desert-coast/01-lima-01.jpg`
   - `content/andean-caravan-images.ts:37` — "Man in white friar's robes standing in a green doorway in Lima, holding a phone, an ornate iron street lamp on the wall beside him."
   - `content/andean-caravan-destinations.ts:45` — "Woman standing in the pale green doorway of a Lima building."
   - `app/(public)/caravans/andean-caravan/how-it-works/_content.ts:53` — "Quiet street and coastal architecture in Lima"
   - Conflict: a man in friar's robes vs a woman vs an unpeopled street; green vs pale green doorway.

2. `gallery/the-stone-road/04-cusco-19.jpg`
   - `content/andean-caravan-images.ts:131` — "Two motorcycles rest against a weathered green wall in Cusco." (no opener; untouched)
   - `app/(public)/caravans/andean-caravan/how-it-works/_content.ts:72` — "Travellers and motorcycles beside a stone wall near Cusco" (no opener; untouched)
   - Conflict: motorcycles alone vs travellers present; weathered green wall vs stone wall; in Cusco vs near Cusco.

3. `gallery/both-shores/03-drive-la-paz-puno-10.jpg`
   - `content/andean-caravan-images.ts:157` — "Yellow truck passing a pedestrian on the high road towards La Paz."
   - `app/(public)/caravans/andean-caravan/how-it-works/_content.ts:81` — "Traveller beside a vehicle on the road between Puno and La Paz"
   - Conflict: a truck passing a pedestrian vs a traveller standing beside a vehicle.

4. `gallery/silver-and-bone/03-bolivia-02a.jpg`
   - `content/andean-caravan-images.ts:239` — "Two women sit on a guardrail beside a remote Bolivian road." (no opener; untouched)
   - `app/(public)/caravans/andean-caravan/how-it-works/_content.ts:100` — "Traveller standing beside a highland road in Bolivia"
   - Conflict: two women seated vs one traveller standing.

5. `gallery/the-mirror/03-uyuni-05.jpg`
   - `content/andean-caravan-images.ts:301` — "Turquoise lagoon cutting through the white mineral plain near Uyuni."
   - `app/(public)/caravans/andean-caravan/how-it-works/_content.ts:107` — "Mountains reflected in shallow water on the Salar de Uyuni" (no opener; untouched)
   - Conflict: a turquoise lagoon in a mineral plain vs mountains reflected in shallow water; near Uyuni vs on the Salar itself.

6. `gallery/atacama/01-astro-01.jpg`
   - `content/andean-caravan-images.ts:321` — "The Milky Way spans the dark sky above Atacama rock formations." (no opener; untouched)
   - `content/andean-caravan-destinations.ts:185` (Atacama stop) — "The Milky Way spans the dark sky above Atacama rock formations." (identical; untouched)
   - `content/andean-caravan-destinations.ts:205` (Santiago stop) — "Star-filled Atacama landscape on the northern Chile section of the route."
   - `app/(public)/caravans/andean-caravan/how-it-works/_content.ts:116` — "Clear night sky above the Atacama Desert"
   - Conflict: Milky Way over rock formations vs a generic star-filled landscape vs a clear night sky. The Santiago placement (a stand-in image for a different stop) may be a legitimate different-job rewording under §10, but the facts still diverge — please confirm what the frame shows.

## (b) content/assets.ts — placeholder alts needing an author decision

Eight `alt: "To be confirmed"` entries were triaged. Four were resolved as
decorative slot art (`alt: ""`); four remain `"To be confirmed"` because they
are content imagery whose eventual description only the author can supply.
None of these assets currently renders anywhere live.

Left as `"To be confirmed"` — please supply the image and its alt when ready:

- `journey-patagonia-hero` (`content/assets.ts:47`) — journey hero imagery.
- `journey-carretera-hero` (`content/assets.ts:65`) — journey hero imagery.
- `journey-atacama-hero` (`content/assets.ts:83`) — journey hero imagery.

Resolved 9 August 2026:

- `about-founder` — founder photograph supplied by Nermine Hammam, with a
  placement-specific informative alt. Precise date and location remain to be
  added to the rights ledger.

Set to `alt: ""` in this pass (reversible if you disagree):

- `home-hero` — legacy/unused slot; the real home hero renders directly in `app/(public)/page.tsx` with its own alt. The placeholder SVG is slot art.
- `journey-patagonia-card`, `journey-carretera-card`, `journey-atacama-card` — placeholder card plates that would sit beside a heading naming the journey; a placeholder plate depicts nothing describable, so empty alt avoids announcing noise. When real card photography lands, revisit under (c) below.

## (c) Card-thumbnail alts beside naming headings — placement call

`components/field/RouteIndex.tsx:24` and the departures index
(`app/(public)/departures/page.tsx:68`) render section thumbnails via
`getAndeanCaravanImage(section.slug)` directly beside headings that already name
the section. Whether these thumbnails are informative (describe the scene) or
decorative (`alt=""`) is a placement decision under §10:

- The photographs do carry scene information the heading lacks (the heading says "Desert Coast"; the alt says what the frame shows), which argues informative.
- But where the thumbnail sits inside, or immediately beside, a link whose text already names the destination, a described alt makes screen readers announce the card twice, which argues decorative.

Recommendation: keep the alts informative where the image stands apart from the
link text (current RouteIndex layout), and use `alt=""` only if a thumbnail is
moved inside the same anchor as its heading. Please confirm or overrule; no
change was made to either component in this pass.

## (d) Note on same-frame, different-alt

Per §10, the same photograph may legitimately carry different alt text in
different placements when its job differs (§2). The clusters in (a) are flagged
for differing facts, not differing jobs — two placements may describe the same
frame differently, but they may not disagree about what is in it.
