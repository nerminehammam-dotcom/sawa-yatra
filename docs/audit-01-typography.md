# Audit 01 — Typography

Audit branch: `audit/typography`

Scope: audit only. This document records the current source; it does not implement Task 2 changes.

## Confirmed root font-size

- No `font-size` declaration exists on `html` or `:root` in the tracked source.
- `app/globals.css`, selector `body`, declares `font-size: clamp(1rem, 0.94rem + 0.22vw, 1.125rem)`.
- That declaration changes the body text size, not the root size.
- No media query or custom property overrides the root text size.
- The browser default root of **16px remains in effect at every breakpoint**. All `rem` conversions below use 16px.
- The body clamp resolves to 16px at 320px, approximately 16.73px at 768px, approximately 17.29px at 1024px, and reaches its 18px maximum before 1440px.

## Method and counting basis

The audit traced every tracked CSS `font-size` declaration capable of producing visible text below `0.875rem`/14px, then traced the associated CSS Module into JSX/TSX and local content data. A grouped CSS rule counts as one declaration. “Verified visible rendered uses” counts below-threshold declarations with at least one traceable public rendering; dead rules and valid non-text exclusions are not included in that total. Where a grouped declaration serves several semantic roles, the row is classified `MIXED USE` and expanded later.

## Main audit table

| Component or stylesheet | Selector or token | Route or screen | Rendered text example | Current size | Breakpoint variants | Text transform | Letter spacing | Classification | Proposed Task 2 treatment |
| ----------------------- | ----------------- | --------------- | --------------------- | -----------: | ------------------- | -------------- | -------------: | -------------- | ------------------------- |
| `components/journeys/DepartureFilters.module.css` | `.legend` | No traced route | No current rendering; component has no importer | 0.8125rem, 13px | None found | uppercase | 0.16em | DEAD OR UNUSED | Retain until ownership is confirmed; if restored, make the filter legend 1rem sentence case. |
| `components/field/FieldDocument.module.css` | `.heroEyebrow, .heroCaption, .heroIndex, .routeFacts dt, .chapterImage figcaption` | `/` plus unused `CinematicHero` | “Time”; “Join”; “FIELD NOTE / PERU”; dead examples “AC / 01” and supplied hero eyebrow | 0.75rem, 12px | None found | uppercase | 0.16em | MIXED USE | Split decision facts from editorial captions; raise route facts to 1rem sentence case and captions to at least 0.875rem. |
| `components/field/FieldDocument.module.css` | `.primaryAction, .secondaryAction, .routeLink` | `/`; two hero selectors currently unused | “View section ↗” | 0.86rem, 13.76px | None found | uppercase | 0.08em | DECISION FACT | Raise the live route link to 1rem, sentence case, normal tracking; separately confirm unused hero actions. |
| `components/field/FieldDocument.module.css` | `.signal > span` | `/` | “MOVING / ANNUAL” | 0.75rem, 12px | None found | none | 0.18em | DECORATIVE LABEL | May remain uppercase, but raise to 0.875rem and cap tracking at 0.12em. |
| `components/field/FieldDocument.module.css` | `.routeMain p` | `/`, route index on narrow screens | “Lima → Paracas → Arequipa” (route data) | 0.82rem, 13.12px at max-width 767px; otherwise inherited body clamp, 16–18px | max-width 767px only | none | normal | DECISION FACT | Remove the narrow-screen reduction; keep at least 1rem. |
| `components/field/JoiningPointSelector.module.css` | `.indexButton strong, .indexButton small` | `/`, `/joining-points` | “Lima”; “8 days” | 0.75rem, 12px | None found | uppercase | 0.06em | DECISION FACT | Raise place and duration to 1rem; sentence case; normal tracking. |
| `components/field/JoiningPointSelector.module.css` | `.image figcaption` | `/`, `/joining-points` | “JOINING POINT 01 / Peru” | 0.72rem, 11.52px | None found | none | 0.14em | DECORATIVE LABEL | Raise to 0.875rem and reduce tracking to no more than 0.08em. |
| `components/field/JoiningPointSelector.module.css` | `.titleBlock > p:first-child, .facts dt` | `/`, `/joining-points` | “Peru”; “Recommended window”; “Next natural leaving point” | 0.72rem, 11.52px | None found | uppercase | 0.14em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/field/JoiningPointSelector.module.css` | `.actions a` | `/`, `/joining-points` | “View this section →”; “Ask about joining here ↗” | 0.78rem, 12.48px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/departures/DepartureCard.module.css` | `.facts dt` | `/departures/the-andean-caravan` | “Duration”; “Group”; “Window” | 0.8125rem, 13px | None found | uppercase | 0.09em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/departures/CaravanRouteMap.module.css` | `.kicker, .stopCount, .country, .progressLabel, .orientation > p, .quickFacts dt` | `/departures/the-andean-caravan` | “The illustrated route”; “Stop 01 of 13”; “Peru”; “Route progress”; “Altitude” | 0.72rem, 11.52px | None found | uppercase | 0.15em | MIXED USE | Split the decorative kicker from all operational facts; facts become 1rem sentence case. |
| `components/departures/CaravanRouteMap.module.css` | `.zoomControls > span` | `/departures/the-andean-caravan` | “Overview”; “Closer”; “Closest” | 0.7rem, 11.2px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/departures/CaravanRouteMap.module.css` | `.zoomControls .resetZoom` | `/departures/the-andean-caravan` | “Overview” | 0.68rem, 10.88px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking and preserve control height. |
| `components/departures/CaravanRouteMap.module.css` | `.stopButton` | `/departures/the-andean-caravan` | “01” through “13” | 0.68rem, 10.88px | None found | none | normal | DECISION FACT | Raise stop numerals to at least 1rem; check marker geometry locally. |
| `components/departures/CaravanRouteMap.module.css` | `.stopLabel` | `/departures/the-andean-caravan` | “Lima”; “Lake Titicaca”; “Villa O’Higgins” | 0.68rem, 10.88px | None found | none | normal | DECISION FACT | Raise to 1rem and re-test collisions at all map scales. |
| `components/departures/CaravanRouteMap.module.css` | `.destinationPhoto figcaption` | `/departures/the-andean-caravan` | “Lima · Sawayatra route photograph” (local destination data) | 0.68rem, 10.88px | None found | none | 0.08em | DECORATIVE LABEL | Raise to 0.875rem; keep sentence case; reduce tracking if space becomes tight. |
| `components/departures/CaravanRouteMap.module.css` | `.quickFacts small` | `/departures/the-andean-caravan` | “Lima Province · 2017 census” | 0.72rem, 11.52px | None found | none | normal | DECISION FACT | Raise to 1rem because it qualifies the population figure. |
| `components/departures/CaravanRouteMap.module.css` | `.orientation ul` | `/departures/the-andean-caravan` | “Historic centre and working streets” | 0.86rem, 13.76px | None found | none | normal | DECISION FACT | Raise to approximately 1.125rem for comfortable reading. |
| `components/departures/CaravanRouteMap.module.css` | `.nextStop span:first-child` | `/departures/the-andean-caravan` | “Next stop” | 0.68rem, 10.88px | None found | uppercase | 0.12em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/departures/CaravanRouteMap.module.css` | `.controls .playButton, .motionNote` | `/departures/the-andean-caravan` | “Play route”; “Pause route”; “Manual route” | 0.72rem, 11.52px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/departures/CaravanRouteMap.module.css` | `.mapNote` | `/departures/the-andean-caravan` | “Geographic orientation only; these are not confirmed itinerary inclusions.” | 0.72rem, 11.52px | None found | none | normal | DECISION FACT | Raise safety/qualification copy to approximately 1.125rem with a comfortable measure. |
| `components/brand/SiteNavigation.module.css` | `.utilityLink` | Shared public shell | “Become a member”; “Sign in” | 0.75rem, 12px | None found | uppercase | 0.1em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/brand/SiteNavigation.module.css` | `.utilitySeparator` | Shared public shell | “·” | 0.75rem, 12px | None found | none | normal | VALID EXCLUSION | Retain; this is an aria-hidden non-text separator glyph. |
| `components/brand/SiteNavigation.module.css` | `.link` | Shared public shell, desktop | “How it works”; “Caravan Hop On Hop Off” | 0.72rem, 11.52px | Letter spacing becomes 0.065em at min-width 1280px; size unchanged | uppercase | 0.075em; 0.065em at min-width 1280px | DECISION FACT | Raise to 1rem, sentence case, normal tracking; test wrapping across the six-item row. |
| `components/brand/SiteNavigation.module.css` | `.submenuLink` | Shared public shell, desktop | “Joining & Leaving Points” | 0.75rem, 12px | Desktop submenu only | uppercase | 0.06em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/brand/SiteNavigation.module.css` | `.mobileButton, .closeButton` | Shared public shell below 1024px | “Menu”; “Close” | 0.75rem, 12px | Rendered below 1024px; size unchanged | uppercase | 0.09em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/brand/SiteNavigation.module.css` | `.mobileSubmenuLink` | Shared public shell below 1024px | “Joining & Leaving Points” | 0.75rem, 12px | Rendered below 1024px; size unchanged | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/brand/SiteNavigation.module.css` | `.mobileUtilityLink` | Shared public shell below 1024px | “Become a member”; “Sign in” | 0.75rem, 12px | Rendered below 1024px; size unchanged | uppercase | 0.1em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/brand/Footer.module.css` | `.pronunciation` | Shared public shell | “sa·wa·ya·tra” | 0.8rem, 12.8px | None found | none | 0.16em | DECORATIVE LABEL | Raise to 0.875rem and cap tracking at 0.12em. |
| `components/brand/Footer.module.css` | `.link` | Shared public shell | “Privacy”; “Terms”; “Accessibility” | 0.75rem, 12px | None found | uppercase | 0.1em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/forms/forms.module.css` | `.required` | `/request-invitation`, `/sign-in`, `/start-here`, `/departures/[slug]` interest forms | “Required” | 0.8125rem, 13px | None found | uppercase | 0.04em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/forms/forms.module.css` | `.journeyContext span` | `/start-here`, `/departures/[slug]` interest forms | “Journey” | 0.8125rem, 13px | None found | uppercase | 0.04em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/home.module.css` | `.editorialHeading > p, .routeHeading > div > p, .joiningHeading > p:first-child, .regionsHeading > p, .fieldNotes > header > p, .finalAction > p` | `/` | “How the caravan works”; “Human proof / field notes”; “Final question / joining point selector” | 0.75rem, 12px | None found | uppercase | 0.17em | DECORATIVE LABEL | Raise to 0.875rem and cap tracking at 0.12em. |
| `app/(public)/home.module.css` | `.editorialHeading a` | `/` | “Read the practical guide →” | 0.8rem, 12.8px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/home.module.css` | `.routeHeading aside strong` | `/` | “TRANSFER / SOUTHERN CONNECTION” | 0.72rem, 11.52px | None found | none | 0.12em | DECISION FACT | Raise to 1rem, sentence case, normal tracking; retain emphasis through weight or colour. |
| `app/(public)/home.module.css` | `.imageStrip figcaption` | `/` | “FIELD NOTE / 01” | 0.7rem, 11.2px | None found | none | 0.12em | DECORATIVE LABEL | Raise to 0.875rem; uppercase may remain. |
| `app/(public)/home.module.css` | `.finalAction a` | `/` | “Compare joining points →”; “Start here ↗” | 0.82rem, 13.12px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/ui/ContentStatusLabel.module.css` | `.root` | Shared — see import list | “DRAFT”; “PLACEHOLDER”; “LEGAL REVIEW” | 0.75rem, 12px | None found | uppercase | 0.12em | DECISION FACT | Raise visible status information to 1rem, sentence case, normal tracking; retain the full accessible label. |
| `components/ui/Accordion.module.css` | `.indicator` | `/membership`, `/caravans/andean-caravan/how-it-works` | “Open”; “Close” | 0.8125rem, 13px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `components/ui/StatusBadge.module.css` | `.root` | No traced route | No current rendering; component has no importer | 0.8125rem, 13px | None found | none | normal | DEAD OR UNUSED | Do not delete during typography work; confirm intended ownership first. |
| `app/(public)/how-it-works/how-it-works.module.css` | `.kicker, .eyebrow, .cardLabel, .stateLabel` | `/how-it-works` | “A simple arrangement”; “Created by you”; “Interest states” | 0.72rem, 11.52px | None found | uppercase | 0.14em | MIXED USE | Split `stateLabel` into a 1rem decision-fact style; keep editorial kickers at 0.875rem with restrained tracking. |
| `app/(public)/how-it-works/how-it-works.module.css` | `.routeLine span` | No current rendering | Selector remains but `.routeLine` is not used in current page JSX | 0.72em; parent clamp would produce 13.82–19.58px if restored | None found | none | normal | DEAD OR UNUSED | Confirm removal or future use; if restored, use an explicit accessible size. |
| `app/(public)/how-it-works/how-it-works.module.css` | `.journeyFacts dt` | No current rendering | Previous fact-grid selector remains; no current JSX use | 0.68rem, 10.88px | None found | uppercase | 0.1em | DEAD OR UNUSED | Confirm ownership; if restored for dates/duration, use 1rem sentence case. |
| `app/(public)/how-it-works/how-it-works.module.css` | `.requirement, .note` | `/how-it-works` | “Completed Travel Self required.”; “A completed Travel Self is required only when you want to participate.” | 0.82rem, 13.12px | None found | none | normal | DECISION FACT | Raise participation requirements to at least 1rem, preferably 1.125rem for the longer note. |
| `app/(public)/how-it-works/how-it-works.module.css` | `.interestStates li` | `/how-it-works` | “Interest accepted”; “Not moving forward” | 0.82rem, 13.12px | None found | none | normal | DECISION FACT | Raise status states to 1rem. |
| `app/(public)/caravans/caravans.module.css` | `.heroCopy > p:first-child, .flagshipTitle > p:first-child, .facts dt, .future > p:first-child, .heroImage figcaption` | `/caravans` | “Caravans / annual routes”; “Full route”; “Public window”; “FLAGSHIP / SOUTH AMERICA” | 0.72rem, 11.52px | None found | uppercase | 0.16em | MIXED USE | Split `.facts dt` to 1rem sentence case; keep editorial labels/caption at 0.875rem with tracking capped at 0.12em. |
| `app/(public)/caravans/caravans.module.css` | `.actions a` | `/caravans` | “Follow the complete route →”; “Compare joining points ↗” | 0.78rem, 12.48px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/about/about.module.css` | `.hero > p:first-child, .observation > div > p:first-child, .principles header > p, .founder > p:first-child` | `/about` | “About / Sawayatra field document”; “Working belief” | 0.72rem, 11.52px | None found | uppercase | 0.16em | DECORATIVE LABEL | Raise to 0.875rem and cap tracking at 0.12em. |
| `app/(public)/about/about.module.css` | `.observation figcaption` | `/about` | “FIELD NOTE / ALTIPLANO ROAD” | 0.72rem, 11.52px | None found | none | 0.14em | DECORATIVE LABEL | Raise to 0.875rem and reduce tracking. |
| `app/(public)/about/about.module.css` | `.action a` | `/about` | “Follow the caravan →”; “Start here ↗” | 0.78rem, 12.48px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.kicker, .stopCount, .country, .progressLabel, .orientation > p, .quickFacts dt` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “The illustrated route”; “Stop 01 of 13”; “Peru”; “Route progress”; “Altitude” | 0.72rem, 11.52px | None found | uppercase | 0.15em | MIXED USE | Split the decorative kicker from operational facts; facts become 1rem sentence case. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.zoomControls > span` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Overview”; “Closer”; “Closest” | 0.7rem, 11.2px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.zoomControls .resetZoom` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Overview” | 0.68rem, 10.88px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.stopButton` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “01” through “13” | 0.68rem, 10.88px | None found | none | normal | DECISION FACT | Raise stop numerals to at least 1rem; verify marker geometry without resizing the locked map in the separate approved task. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.stopLabel` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Lima”; “Lake Titicaca”; “Villa O’Higgins” | 0.68rem, 10.88px | None found | none | normal | DECISION FACT | Raise to 1rem and perform a rendered collision check; do not alter map behaviour. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.destinationPhoto figcaption` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Lima · Sawayatra route photograph” | 0.68rem, 10.88px | None found | none | 0.08em | DECORATIVE LABEL | Raise to 0.875rem. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.quickFacts small` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Lima Province · 2017 census” | 0.68rem, 10.88px | None found | none | normal | DECISION FACT | Raise to 1rem because it qualifies the displayed population. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.orientation ul` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Historic centre and working streets” | 0.8rem, 12.8px | None found | none | normal | DECISION FACT | Raise to approximately 1.125rem. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.nextStop span:first-child` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Next stop” | 0.68rem, 10.88px | None found | uppercase | 0.12em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.controls .playButton, .motionNote` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Play route”; “Pause route”; “Manual route” | 0.72rem, 11.52px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.mapNote` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “Geographic orientation only; these are not confirmed itinerary inclusions.” | 0.68rem, 10.88px | None found | none | normal | DECISION FACT | Raise qualification/safety copy to approximately 1.125rem. |
| `app/(public)/departures/[slug]/journey.module.css` | `.countryRoutes dt` | `/departures/the-andean-caravan` | “Peru”; “Bolivia”; “Chile” | 0.8125rem, 13px | None found | none | normal | DECISION FACT | Raise to 1rem; preserve country colour coding as secondary support. |
| `app/(public)/departures/[slug]/journey.module.css` | `.adjacentLinks span` | `/departures/[section]` | “All nine sections” | 0.72rem, 11.52px | None found | uppercase | 0.11em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/andean-caravan/how-it-works/_components/GateSelector.module.css` | `.kicker, .label, .gateChoice label > span, .truths span, .drawerHeader p` | `/caravans/andean-caravan/how-it-works` | “Find my gate”; “Joining gate”; “Altitude”; “Before you choose”; “Your Caravan” | 0.72rem, 11.52px | None found | uppercase | 0.14em | MIXED USE | Split editorial kicker from selection labels, gate facts and drawer context; decision uses become 1rem sentence case. |
| `app/(public)/caravans/andean-caravan/how-it-works/_components/GateSelector.module.css` | `.altitudeOptions span` | `/caravans/andean-caravan/how-it-works` | “Lima”; “Arequipa or Sucre”; “Cusco and higher gates” | 0.82rem, 13.12px | None found | none | normal | DECISION FACT | Raise to 1rem. |
| `app/(public)/caravans/andean-caravan/how-it-works/_components/GateSelector.module.css` | `.cardMain > span, .cardFacts` | `/caravans/andean-caravan/how-it-works` | “Lima → Cusco”; “8 days”; “Max 3,400 m” | 0.86rem, 13.76px | None found | none | normal | DECISION FACT | Raise to 1rem; consider 1.125rem for the physical facts. |
| `app/(public)/caravans/andean-caravan/how-it-works/_components/GateSelector.module.css` | `.cardState` | `/caravans/andean-caravan/how-it-works` | “Open”; “Close” | 0.72rem, 11.52px | None found | uppercase | 0.1em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/andean-caravan/how-it-works/_components/GateSelector.module.css` | `.gateDetails dt, .drawerFacts dt` | `/caravans/andean-caravan/how-it-works` | “Airport”; “Altitude”; “Maximum altitude”; “Price” | 0.72rem, 11.52px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/andean-caravan/how-it-works/_components/GateSelector.module.css` | `.dynamicImage > p` | `/caravans/andean-caravan/how-it-works` | “01 Desert Coast” (selected section data) | 0.78rem, 12.48px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem and sentence case. |
| `app/(public)/caravans/andean-caravan/how-it-works/how-it-works.module.css` | `.eyebrow` | `/caravans/andean-caravan/how-it-works` | “The Andean Caravan · January–April 2027” | 0.72rem, 11.52px | None found | uppercase | 0.15em | DECISION FACT | Treat the date as decision information: 1rem, sentence case, normal tracking. |
| `app/(public)/caravans/andean-caravan/how-it-works/how-it-works.module.css` | `.numbers p` | `/caravans/andean-caravan/how-it-works` | “71 days”; “9 sections”; “4 short flights”; “Small groups” | 0.86rem, 13.76px | None found | uppercase | 0.05em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/start-here/start-here.module.css` | `.hero > p:first-child, .context > p:first-child, .context dt` | `/start-here` | “Start here / joining-point enquiry”; “Selected joining point 01”; “Access”; “Leave at” | 0.72rem, 11.52px | None found | uppercase | 0.15em | MIXED USE | Split editorial eyebrow from selected-point and fact labels; decision uses become 1rem sentence case. |
| `app/(public)/start-here/start-here.module.css` | `.selector a strong, .selector a small` | `/start-here` | “Lima”; “8 days” | 0.72rem, 11.52px | None found | uppercase | 0.06em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/travel-self/travel-self.module.css` | `.eyebrow` | `/travel-self` | “Your Travel Self”; quiz intro/reveal eyebrow content | 0.8125rem, 13px | None found | uppercase | 0.2em | DECORATIVE LABEL | Raise to 0.875rem and cap tracking at 0.12em. |
| `app/system.module.css` | `.eyebrow` | `/404`, errors, `/privacy`, `/terms`, `/accessibility`, `/sign-in`, `/request-invitation` | “404”; “Something went wrong”; “LEGAL REVIEW”; “Member access” | 0.8125rem, 13px | None found | uppercase | 0.2em | MIXED USE | Add semantic variants: status/review messages at 1rem sentence case; decorative context at 0.875rem with restrained tracking. |
| `app/system.module.css` | `.legalMeta dt` | `/privacy`, `/terms`, `/accessibility` | “Last reviewed” | 0.8125rem, 13px | None found | uppercase | 0.12em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |
| `app/(public)/joining-points/joining-points.module.css` | `.hero > p:first-child, .final > p` | `/joining-points` | “Joining points / enter and leave the moving route”; “Need a calm way into the route?” | 0.74rem, 11.84px | None found | uppercase | 0.16em | DECORATIVE LABEL | Raise to 0.875rem and cap tracking at 0.12em. |
| `app/(public)/joining-points/joining-points.module.css` | `.hero a, .final a` | `/joining-points` | “How the caravan works →”; “Ask about a joining point ↗” | 0.78rem, 12.48px | None found | uppercase | 0.08em | DECISION FACT | Raise to 1rem, sentence case, normal tracking. |

## Decision facts already at 14px or above that remain uppercase or over-tracked

| Component or stylesheet | Selector | Route or screen | Rendered text example | Font size | Text transform | Letter spacing | Why it is a decision fact | Proposed treatment |
| ----------------------- | -------- | --------------- | --------------------- | --------: | -------------- | -------------: | ------------------------- | ------------------ |
| `components/departures/DepartureCard.module.css` | `.kicker` | `/departures/the-andean-caravan` | “Caravan section” plus the section sequence | 0.875rem, 14px | uppercase | 0.1em | Identifies the product/section type while comparing journeys. | Keep at least 1rem; sentence case; normal tracking. |
| `components/departures/DepartureCard.module.css` | `.price` | `/departures/the-andean-caravan` | “Price on request” | 0.875rem, 14px | uppercase | 0.06em | Price is a direct participation and comparison fact. | Raise to 1rem; sentence case; normal tracking. |
| `components/ui/Eyebrow.module.css` | `.root` | Shared — see import list | “Choose where to join”; “Section details”; “Complete Caravan” | 0.875rem, 14px | uppercase | 0.12em | Several uses identify the decision context of facts or joining choices. | Add a decision-fact variant at 1rem sentence case; retain a separate decorative variant. |
| `app/(public)/departures/[slug]/journey.module.css` | `.facts dt` | `/departures/[slug]` | “Route”; “Duration”; “Caravan window”; “Altitude”; “Price” | 0.875rem, 14px | uppercase | 0.11em | These labels structure the core comparison facts. | Raise to 1rem; sentence case; normal tracking. |
| `app/(public)/departures/[slug]/journey.module.css` | `.routeOverviewLabel` | `/departures/the-andean-caravan` | “Route at a glance” | 0.875rem, 14px | uppercase | 0.09em | Introduces the complete route used to understand the journey. | Raise to 1rem; sentence case; normal tracking. |
| `app/(public)/departures/departures.module.css` | `.availableLabel, .laterLabel` | `/departures` | “Available journey”; “Later release” | 0.875rem, 14px | uppercase | 0.12em | Availability determines what can be chosen now. | Raise to 1rem; sentence case; normal tracking. |
| `app/(public)/departures/departures.module.css` | `.comingLater` | `/departures` | “Coming later” | 0.9rem, 14.4px | uppercase | 0.12em | Communicates that Create cannot currently be selected. | Use 1rem sentence case with normal tracking. |
| `components/departures/CaravanRouteMap.module.css` | `.countryLabels text` | `/departures/the-andean-caravan` | “PERU”; “BOLIVIA”; “CHILE” | 24px | uppercase | 5px | Country geography orients the route and helps interpret stops. | Retain size but reduce tracking and use title case if the SVG treatment permits. |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `.countryLabels text` | `/caravans`, `/caravans/andean-caravan/how-it-works` | “PERU”; “BOLIVIA”; “CHILE” | 24px | uppercase | 5px | Country geography orients the route and helps interpret stops. | Retain size but reduce tracking and use title case if the locked map allows local type treatment. |

## Mixed-use selectors

### `components/field/FieldDocument.module.css` grouped 0.75rem rule

- Decision facts: `.routeFacts dt` renders “Time” and “Join”.
- Decorative uses: `.chapterImage figcaption` renders “FIELD NOTE / PERU”.
- Unused members: `.heroEyebrow`, `.heroCaption`, and `.heroIndex` belong to `CinematicHero`, which has no current importer.
- A blanket increase would retain inappropriate uppercase/tracking on decision facts and obscure the unused state.
- Future separation: create a sentence-case decision-fact class for route facts, retain a dedicated editorial-caption class, and leave unused hero selectors untouched until ownership is confirmed.

### `components/departures/CaravanRouteMap.module.css` grouped map micro-label rule

- Decorative: `.kicker` — “The illustrated route”.
- Decision facts: `.stopCount`, `.country`, `.progressLabel`, `.orientation > p`, `.quickFacts dt` — stop position, country, route progress, orientation and altitude/population labels.
- A blanket editorial treatment would leave essential map facts too small and over-tracked.
- Future separation: `mapEditorialLabel` at 0.875rem and `mapDecisionLabel` at 1rem sentence case.

### `app/(public)/caravans/_components/CaravanRouteMap.module.css` grouped map micro-label rule

- Same semantic split as the departure-detail map, but this is a separate active implementation.
- Decorative: `.kicker`.
- Decision facts: `.stopCount`, `.country`, `.progressLabel`, `.orientation > p`, `.quickFacts dt`.
- Future separation must be applied locally without rebuilding, resizing or changing the locked map.

### `app/(public)/how-it-works/how-it-works.module.css` grouped label rule

- Decorative: `.kicker`, `.eyebrow`, `.cardLabel` — examples include “A simple arrangement” and “Created by you”.
- Decision fact: `.stateLabel` — “Interest states”, which explains participation status choices.
- Future separation: a 1rem sentence-case state heading and a distinct 0.875rem editorial kicker.

### `app/(public)/caravans/caravans.module.css` grouped 0.72rem rule

- Decision facts: `.facts dt` — “Full route”, “Public window”, “Sections”, “Price”.
- Decorative: hero/flagship/future kickers and the hero-image caption.
- Future separation: card/fact definition labels at 1rem sentence case; editorial labels/caption at 0.875rem.

### `app/(public)/caravans/andean-caravan/how-it-works/_components/GateSelector.module.css` grouped label rule

- Decorative: `.kicker` — “Find my gate”.
- Decision facts: `.gateChoice label > span`, `.truths span`, and relevant `.label` uses — “Joining gate”, “Leaving gate”, “Arrival”, “Comfort”, “Before you choose”.
- Context with mixed editorial/operational use: `.drawerHeader p` — “Your Caravan”.
- Future separation: explicit `gateFieldLabel`, `gateFactLabel`, and `editorialKicker` variants.

### `app/(public)/start-here/start-here.module.css` grouped label rule

- Decorative: `.hero > p:first-child` — “Start here / joining-point enquiry”.
- Decision facts: `.context > p:first-child` and `.context dt` — selected joining point, access, time on the road and leaving point.
- Future separation: selected context/fact labels at 1rem sentence case; editorial eyebrow at 0.875rem.

### `app/system.module.css` `.eyebrow`

- Decorative/contextual uses: “404”, “Member access”.
- Decision/status uses: “Something went wrong” and “LEGAL REVIEW”.
- The same selector is shared by errors, form headers and legal placeholders, so a blanket visual change would conflate page texture with status communication.
- Future separation: `systemContextLabel` and `systemStatusLabel`, with the latter at 1rem sentence case.

## Shared component import lists

### `components/ui/ContentStatusLabel.tsx`

Direct importers:

- `components/brand/RisoArtwork.tsx` — indirect exposure wherever placeholder artwork is rendered.
- `app/(public)/membership/page.tsx` — `/membership`.
- `app/(public)/sign-in/page.tsx` — `/sign-in`.
- `app/(public)/request-invitation/page.tsx` — `/request-invitation`.
- `app/(public)/travel-self/TravelSelfQuiz.tsx` — `/travel-self`.
- `app/(public)/error.tsx` — public error boundary.
- `app/(public)/_components/NotFoundContent.tsx` — `/404` and root not-found handling.
- `app/(public)/_components/LegalPlaceholderPage.tsx` — indirect wrapper for `/privacy`, `/terms`, `/accessibility`.

### `components/ui/Eyebrow.tsx`

Direct importers:

- `components/ui/PageHero.tsx` — indirect wrapper used by membership and departure-detail pages.
- `app/(public)/membership/page.tsx` — `/membership`.
- `app/(public)/departures/page.tsx` — `/departures`.
- `app/(public)/departures/[slug]/page.tsx` — all departure detail pages.

`PageHero.tsx` is imported by:

- `app/(public)/membership/page.tsx`.
- `app/(public)/departures/[slug]/page.tsx`.

## Known-offender verification

- `SiteNavigation .link` still exists at 0.72rem, uppercase, 0.075em; it has a 0.065em tracking override at min-width 1280px but no size increase.
- `SiteNavigation .utilityLink` still exists at 0.75rem, uppercase, 0.1em.
- `SiteNavigation .submenuLink` still exists at 0.75rem, uppercase, 0.06em.
- `how-it-works .journeyFacts dt` still exists at 0.68rem but is currently dead/unused; the current JSX no longer renders that grid.
- `GateSelector .gateDetails dt` still exists at 0.72rem, uppercase, 0.08em and renders operational facts.
- `GateSelector .altitudeOptions span` still exists at 0.82rem and renders actual joining locations.
- `DepartureCard .facts dt` still exists at 0.8125rem, uppercase, 0.09em.
- Both active `CaravanRouteMap` implementations contain `.stopButton` and `.stopLabel` at 0.68rem.
- `forms .required` still exists at 0.8125rem, uppercase, 0.04em.
- `Footer .link` still exists at 0.75rem, uppercase, 0.1em.
- The home grouped editorial heading rule still exists at 0.75rem, uppercase, 0.17em; it serves decorative editorial labels rather than one selector named `.editorialHeading p` alone.

## Highest-risk findings

1. **Primary and utility navigation:** `components/brand/SiteNavigation.module.css`, `.link`, `.utilityLink`, `.submenuLink`, and mobile equivalents. “How it works”, “Joining & Leaving Points”, “Become a member” and “Sign in” render at 11.52–12px, uppercase, with 0.06–0.1em tracking. These are the visitor’s primary wayfinding controls and are consistently below the audit floor.
2. **Current route-map stop selection:** `app/(public)/caravans/_components/CaravanRouteMap.module.css`, `.stopButton` and `.stopLabel`. Stop numerals and names such as “01” and “Lima” render at 0.68rem/10.88px. They are the direct controls for changing the destination details on the right.
3. **Required form information:** `components/forms/forms.module.css`, `.required`. “Required” renders at 0.8125rem/13px, uppercase, 0.04em tracking across invitation, sign-in and journey-interest forms. Missing this word can directly cause failed form completion.
4. **Joining-point comparison facts:** `components/field/JoiningPointSelector.module.css`, `.facts dt` within the grouped `.titleBlock > p:first-child, .facts dt` rule. “Recommended window”, “Access”, “Commitment” and “Next natural leaving point” render at 0.72rem/11.52px, uppercase, 0.14em tracking. These labels structure the essential comparison.
5. **Gate, altitude and journey facts:** `GateSelector.module.css`, `.gateDetails dt, .drawerFacts dt`, plus `.altitudeOptions span`. “Airport”, “Altitude”, “Maximum altitude”, “Price” and entry-place names render at 11.52–13.12px. These are safety, access and participation facts rather than decorative microcopy.

## Recommended Task 2 plan

1. Establish a shared 1rem decision-fact treatment: sentence case, normal tracking, reading-family medium weight, and no forced uppercase. Apply it to navigation, footer links, form-required markers, route-card facts, joining-point facts, gate facts, statuses and map controls.
2. Keep genuinely decorative labels no smaller than 0.875rem. Uppercase may remain where editorially intentional, with tracking capped around 0.12em.
3. Split the eight mixed-use rules before changing values. Do not globally enlarge or normalize shared `.eyebrow`, `.label`, `dt`, or map micro-label groups without semantic variants.
4. Raise longer operational reading copy toward 1.125rem: map qualification notes, map orientation lists, participation notes, gate physical notices where necessary, and narrow-screen route descriptions.
5. At 320px, expect navigation labels, map labels, route-card facts and joining actions to wrap or collide; preserve touch targets and allow vertical growth. At 768px, verify iPad map/detail balance and joining selector density. At 1024px, test the navigation transition and six-link desktop row. At 1440px, confirm that reduced tracking does not make editorial bands feel visually loose.
6. Treat both route-map implementations separately. Increase only local typography and surrounding text capacity; do not resize, rebuild, restyle, replace or change the behaviour of the locked `/caravans` map.
7. Render-check country SVG labels, stop-label collisions, the GateSelector cards/drawer, and the shared status/eyebrow variants before implementation. Dead selectors should remain untouched until ownership is confirmed.

## Ambiguities requiring approval

- Whether visible `DRAFT`, `PLACEHOLDER`, and `LEGAL REVIEW` badges are intended as public decision information or are temporary editorial tooling. The audit classifies them as decision facts because they affect whether the visitor can rely on the content.
- Whether map country names may change from uppercase to title case without violating the locked map instruction. Their tracking should be addressed only if local typography treatment is approved.
- Whether “Caravan section” on departure cards is required product taxonomy or editorial texture. It is treated as a decision fact here because it distinguishes the available journey type.
- Whether “Your Caravan” in the GateSelector drawer is purely editorial or a functional summary heading. It currently shares a rule with essential labels and must be separated either way.
- Whether unused `CinematicHero`, `DepartureFilters`, `.routeLine`, `.journeyFacts`, and `StatusBadge` sources are intentionally retained for future routes. No deletion is recommended without ownership confirmation.

No font-size value or runtime context in the below-threshold set remains mathematically unresolved after tracing the current local source. The ambiguities above concern editorial classification or future ownership rather than pixel resolution.

## Required totals

```text
Total declarations below 0.875rem: 78
Total verified visible rendered uses below 0.875rem: 73
Total unresolved rendered uses: 0
Total decision facts: 54
Total decorative labels: 11
Total mixed-use selectors: 8
Total valid exclusions: 1
Total dead or unused rules: 4
Total ambiguous cases: 0
Total decision facts at 0.875rem or above that remain uppercase or over-tracked: 9
```

Classification totals describe the 78 below-threshold declarations and therefore sum to 78. Editorial approval questions are listed separately and are not counted as statically unresolved rendered uses.
