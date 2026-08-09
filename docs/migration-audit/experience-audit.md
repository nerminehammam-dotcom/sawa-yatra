# Experience, map, photography, Journeys and design-system audit

## 1. Visual baselines

For each surface below, a settled full-page capture and a settled first-viewport
capture exist at 1440×900, 1024×800 and 390×844:

- overview;
- all nine legacy section pages;
- The Stone Road;
- legacy joining/gate selector;
- separate route map;
- Journeys;
- enquiry entry.

Full captures are in `baselines/{1440,1024,390}/`. First-viewport captures are
in `baselines/first-viewport/{1440,1024,390}/`. An additional selected and
zoomed Balmaceda map state is stored at each width as
`route-map-selected-balmaceda-zoomed.png`.

## 2. Observable Caravan experience

### Overview

- The first viewport is a strong two-column editorial hero with proposition,
  supporting line and route image.
- It does not expose the required four-section choice in the first viewport at
  1440 or 1024. At 390 the proposition fills nearly the entire first viewport;
  no section choice is visible.
- Below the hero, the page presents an interactive geographic map, nine section
  cards, joining copy, facts and conditions. The visitor meets many systems
  before reaching a stable section/stage/day hierarchy.
- The page is approximately 11,123 CSS px high at 1440, 10,241 at 1024 and
  18,175 at 390 in the audited build.

### Legacy section pages

- The hero combines breadcrumbs, title, promise, dual “part of / on its own”
  explanation, date and a six-cell fact strip alongside a photograph.
- A full gallery follows immediately, then optional pricing scaffolding,
  multiple editorial blocks, adjacent-section navigation, a nine-step route
  stepper, wayfinding and enquiry.
- Section/stage/day hierarchy is absent. The nine old sections are the only
  scanning unit; days do not exist as canonical atomic records.
- The Stone Road is styled as “Section 3 of 9”, so its present treatment cannot
  express the required dual role inside Section 01.
- At 390, the Stone Road page is approximately 13,103 CSS px high. Content is
  readable and has no horizontal overflow, but navigation, facts, gallery and
  repeated section blocks create a long decision path.

### Joining/gate selector

- A separate page repeats the route proposition, interactive map, headline
  counts, rules, welcome ritual, season explanation, combinations, nine-section
  chooser, standalone logic, FAQ and enquiry.
- The selector exposes join and leave dropdowns plus nine expandable cards. One
  card can show two gate panels, comfort, arrival, physical notice and a movement
  ledger simultaneously.
- At 1024 it becomes a particularly dense long page (about 11,696 CSS px). It
  remains within the viewport width, but the information layers compete rather
  than progressively disclosing a four-section choice.

### Orientation and navigation

- Global header/navigation is consistent.
- Breadcrumbs, adjacent links, “all nine sections”, route stepper and wayfinding
  provide several overlapping local-navigation systems.
- No current surface can state the required current level (whole Caravan /
  section / stage), because stages are not in the content model.

## 3. Map implementation audit

### Architecture

- No mapping library is used.
- The map is a custom React/SVG illustration using country paths from
  `content/andean-map-geometry.ts`, 13 hand-positioned x/y stops from
  `content/andean-caravan-route.ts`, destination details and CSS transforms.
- There are two substantially duplicated interactive map components:
  `app/(public)/caravans/_components/CaravanRouteMap.tsx` and
  `components/departures/CaravanRouteMap.tsx`.

### First state and semantics

- First state shows 13 numbered route stops, three country shapes, country
  labels, route line(s), a flight arc, landscape illustrations, zoom controls,
  active Lima detail, playback and previous/next controls.
- Marker semantics are inferred by exact name matching against generated joining
  points: join, leave, join-leave or neutral. This couples the map to the legacy
  nine-section gate model.
- Stops and gates are visually close enough that non-gate destinations can read
  as joining choices.
- The current x-axis is approximate longitude and y-axis approximate latitude.
  The locked Level 1 design instead requires y=day sequence and x=sleep altitude.

### Route modes and flights

- Route modes are not encoded systematically on the Level 1 map. Most movement
  is one line style.
- A single hand-authored Santiago→Balmaceda flight arc separates north and south
  in the primary component.
- Other scheduled flights exist only in text/leg data.
- The older duplicate component projects one continuous polyline through every
  stop while also drawing a flight arc, so its geometry is easier to
  misinterpret.
- The included Balmaceda→Santiago final exit is not drawn. This correct behaviour
  must survive migration.

### Interaction and accessibility

- Mouse/touch: numbered stop buttons, previous/next, play/pause and three zoom
  levels.
- Keyboard: stop buttons support Arrow keys, Home and End in the primary map;
  normal activation works for zoom/play/navigation.
- Mobile selection scrolls the destination detail into view.
- Reduced-motion preference disables autoplay/smooth scrolling.
- A static route list exists on the standalone map route.
- Reusable primitives: accessible stop buttons, destination detail panel,
  previous/next/play controls, zoom control shape, reduced-motion handling,
  static fallback and focus-visible styles.
- Replace rather than preserve: geographic x/y registration, 13-stop first
  state, exact-name gate-role inference, hardcoded flight path, duplicated map
  component and ten-gate coupling.

## 4. Photography inventory

There are 70 usable route photographs in the registry. All are marked `DRAFT`
by the asset helper; no per-image photographer credit field exists. Alt text and
focal points are present. Destination captions use generic “Sawayatra route
photograph” language, which is not a precise authorship credit.

| Current assignment | Count | Landscape | Portrait | Square | Pixel range |
| --- | ---: | ---: | ---: | ---: | --- |
| Desert Coast | 6 | 0 | 1 | 5 | 1882×2000 to 2000×2000 |
| White City, Deep Canyon | 6 | 6 | 0 | 0 | 2000×1164 to 2000×1334 |
| The Stone Road | 5 | 3 | 1 | 1 | 1835×1256 to 2000×2000 |
| Both Shores | 6 | 6 | 0 | 0 | 2000×1292 to 2000×1604 |
| Thin Air & Cloud Forest | 7 | 7 | 0 | 0 | 2000×1046 to 2000×1717 |
| Silver & Bone | 10 | 10 | 0 | 0 | 2000×1034 to 2000×1356 |
| The Mirror | 5 | 5 | 0 | 0 | 2000×1084 to 2000×1334 |
| Atacama | 4 | 4 | 0 | 0 | 2000×1334 to 2000×1359 |
| The End of the Road | 21 | 21 | 0 | 0 | 2000×1277 to 2000×1496 |

Provisional regrouping available to the locked four-section architecture:

| Future section | Existing image pool | Count | Obvious gap/risk |
| --- | --- | ---: | --- |
| 01 Sea to Stone | Desert Coast + White City + Stone Road | 17 | Strong place coverage; first six images are mostly square, so the layout must not assume landscape-only supply. |
| 02 Both Shores | Both Shores + Thin Air & Cloud Forest | 13 | Adequate landscape supply; image/place accuracy must be rechecked against the new Puno→Sucre day allocation. |
| 03 The Mirror | Silver & Bone + Mirror + Atacama | 19 | Adequate overall, but the critical five-day Lagunas crossing has only the small current Mirror subset and needs careful caption verification. |
| 04 The End of the Road | current End of Road | 21 | Richest section by a wide margin; it must not become the only design specimen. |

The thinnest current pool is Atacama with four images; after honest four-section
regrouping, Section 02 is the thinnest pool with 13. Phase 3 should use Section
03 as required and stress the common architecture using Section 02’s real image
supply. No stock/generated replacement is permitted.

## 5. Journeys launch-state audit

- Route: `/journeys`; one server-rendered page with two hardcoded groups,
  “Leaving on a date” and “Still forming”.
- The fixed group maps `fixedJourneys`; the forming group maps
  `formingJourneys` and filters by `isForming`.
- `fixedJourneys` currently contains nine records—one for each legacy Caravan
  section—not one Caravan.
- `formingJourneys` is empty. The page therefore renders an empty category,
  explanatory copy and a disabled “Start one” control.
- No member-created journey is live on the launch surface.
- Provenance is shown on cards, but the proposed curated/member split would be
  empty on the member side.

Recommendation for founder approval: **one unlabelled Andean Caravan entry** in
the curated position. Its internal surface reveals four sections plus The Stone
Road. Do not publish an empty member category and do not invent member journeys.

## 6. Design-system inventory

| Area | Existing system to retain |
| --- | --- |
| Colour | Closed tokens: paper, ink, signal orange, signal-text, clay, sun, olive, pink and dusty blue, with documented contrast matrix. |
| Typography | Fraunces display/editorial; General Sans operational; IBM Plex Mono for legal notes, limitations, pricing conditions and route footnotes. |
| Scale | Shared display/body/lead/title/eyebrow tokens in `styles/tokens.css`; body floor 18px. |
| Spacing | 4px-based space tokens through 128px; section-space, page-gutter and content max 1440px. |
| Radii/borders | 2px cards/pills; 1px hairline; 2px strong border. |
| Breakpoints | 639, 640–1023, 1024, 1025 navigation shift and 1440 wide layout. Audited widths align with 390/1024/1440. |
| Images | `next/image`, `RisoArtwork`, `JourneyGallery` and `JourneyPlate`; AVIF/WebP enabled with responsive device sizes. |
| Cards | `DepartureCard`, Journey cards, UI facts and panels. Composition can change; tokens and accessibility behaviour remain. |
| Disclosure | `Faq`, `Accordion`, details/panels and route stepper patterns. Future stages/days should use one shared progressive-disclosure architecture. |
| Actions | `Button`, `ButtonLink`, text links and shared Arrow icon. Minimum touch target is 48px. |
| Navigation | SiteNavigation, announcement row, primary/club/footer navigation, breadcrumbs and skip link. |
| Captions/notes | Route captions exist but lack precise photographer provenance. Mono note role is already established. |
| Focus | One 3px current-colour focus-visible ring with 4px offset; documented forced-colours treatment. |
| Motion | Fast 180ms and route 680ms tokens; global reduced-motion override and map-specific autoplay shutdown. |

Controlled Redesign Mode can change layout, hierarchy, map composition, image
scale and Caravan navigation while preserving these identity primitives.
