# Sawayatra navigation repair — preservation and narrow audit

Date: 2026-07-26

## Preservation record

- Starting branch: `codex/travel-self-v4`
- Starting HEAD: `988c4c6b26ac807dc3407fb756ab28185ffa534d`
- Safety branch: `backup/pre-navigation-repair`
- Safety checkpoint: `7bfdc3c` — `checkpoint: preserve full Sawayatra build before navigation repair`
- The safety branch alone was pushed to `origin`.
- The active branch was restored to `codex/travel-self-v4`.
- Pre-existing untracked files were left untouched. `_to_delete/sawa-src.tgz` contains an environment file and was deliberately excluded from the remote backup.

## Visual baseline

The current local site was captured before any production-file changes:

- 28 public routes at 1440 px: `before/desktop-1440/`
- 28 public routes at 390 px: `before/mobile-390/`
- focused evidence: `before/focused/`

Focused evidence covers the desktop header, mobile header, homepage hero and tagline, regional chapters, Field Notes, joining-point selector, nine-section grid, and locked route map.

Captured routes:

`/`, `/how-it-works`, `/travel-self`, `/departures`, `/caravans`, `/caravans/the-andean-caravan`, `/caravans/andean-caravan/how-it-works`, `/departures/the-andean-caravan`, all nine `/departures/[slug]` section routes, `/joining-points`, `/membership`, `/about`, `/start-here`, `/do-it-yourself`, `/request-invitation`, `/privacy`, `/terms`, `/accessibility`, `/sign-in`, and `/404`.

## Exact implementation systems

### Global shell and navigation

- `app/(public)/layout.tsx` mounts the shared public shell.
- `app/(public)/_components/PublicShell.tsx` mounts `SkipLink`, `SiteNavigation`, and `Footer` for every public page.
- `components/brand/SiteNavigation.tsx` owns desktop navigation, the current one-item submenu, the mobile dialog/drawer, focus trapping, Escape handling, and active-route logic.
- `components/brand/SiteNavigation.module.css` owns the two-band header, current six-column desktop grid, hover-only submenu, 1120 px desktop/mobile switch, and mobile drawer presentation.
- `content/navigation.ts` is the passed navigation data source. It currently contains six primary items and two utilities (`Become a Member`, `Sign in`).
- `components/brand/Wordmark.tsx` and `components/brand/Wordmark.module.css` own the wordmark.
- `components/brand/Footer.tsx` owns the site footer; `PublicShell` currently limits its passed links to legal routes.

### Departures and duplicated route entry points

- `app/(public)/departures/page.tsx` is the current two-choice gateway and is not yet the required departures hub.
- `app/(public)/departures/[slug]/page.tsx` renders both the complete Caravan and the nine individual section pages.
- `app/(public)/caravans/page.tsx` is a second Caravan overview with the flagship card and the locked map.
- `app/(public)/caravans/the-andean-caravan/page.tsx` is a wrapper around the complete journey renderer.
- `app/(public)/caravans/andean-caravan/how-it-works/page.tsx` is a separate long-form hop-on/hop-off explainer with its own map placement, gate selector, journey drawer, FAQ, and 2027 wording.
- No redirect rules exist in `next.config.ts`; the legacy and duplicate routes are all currently live independently.

### Single-source data candidates

- `content/andean-caravan.ts` is the canonical structured source for the Caravan, nine sections, gates, date windows, durations, routes, group wording, price status, and enquiry IDs.
- `content/andean-caravan-images.ts` is the canonical route-image source.
- `content/field-document.ts` derives joining-point and homepage field-document content from the Caravan data.
- `content/andean-caravan-route.ts` and `content/andean-caravan-destinations.ts` supply the locked map stops and right-hand destination details.
- `components/departures/CaravanRouteMap.tsx` and `app/(public)/caravans/_components/CaravanRouteMap.tsx` are two separate map implementations. The brief locks the existing route map, so neither may be merged, restyled, resized, rebuilt, replaced, or given new behaviour during this task.
- `components/field/JoiningPointSelector.tsx` renders the reusable joining-point selector.

### Design system to preserve

- Tokens: `styles/tokens.css`
- Global type and element rules: `app/globals.css`
- Colours: paper `#e7e1d6`, ink `#27231f`, signal `#f05a2a`, clay `#a96f47`, sun `#e5bc4f`, olive `#98904f`, pink `#eeb6c4`.
- Display type: self-hosted Fraunces 300/400, normal and italic.
- Reading type: self-hosted Inter 400/500.
- Spacing scale: 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, and 8 rem; section space `clamp(5rem, 10vw, 10rem)`; page gutter `clamp(1.25rem, 5vw, 6rem)`.
- Geometry: 1 px hairlines, 2 px strong rules, 2 px card/pill radii, 48 px touch minimum, 1440 px content maximum.
- Interaction language: ink/paper inversion for current and hover states, signal/clay rules, square buttons, visible 3 px focus outlines, no shadows, global soft-light grain, reduced-motion handling.
- Responsive system: global gutters at 639/640/1024/1440 px; current navigation collapses at 1120 px. The replacement breakpoint must be based on measured fit rather than preserving 1120 px automatically.

### Page visibility and public-content findings

- `app/(public)/membership/page.tsx` publicly renders `ContentStatusLabel` values and placeholder content. It is not launch-ready under the new visibility rules.
- `app/(public)/about/page.tsx` publicly displays “factual placeholder” and missing-founder-copy messages. It is not launch-ready under the new visibility rules.
- `app/(public)/travel-self/TravelSelfQuiz.tsx` publicly renders a `DRAFT` status label, and `content/travel-self/travel-self-model.ts` identifies the question bank and scoring material as draft. Its public visibility requires explicit approval or removal of internal labels without changing the approved experience.
- `app/(public)/caravans/page.tsx` publicly renders a future-route placeholder.
- `app/(public)/departures/page.tsx` publicly renders “Later release” and “Coming later” material.

## Contact and enquiry blocker

The required real contact destination does not exist in the repository:

- `app/(public)/start-here/page.tsx` mounts `JourneyInterestForm`.
- `content/forms.ts` explicitly calls the experience a “Development mock only” and states it sends and stores nothing.
- `app/api/forms/[kind]/route.ts` uses `developmentMockFormAdapter`.
- `lib/forms/adapters.ts` deliberately discards submissions; the future Resend adapter is only an unconfigured stub with no recipient, credentials, or delivery behaviour.
- No approved `mailto:` address, monitored inbox, or functional contact page is present.
- Existing links from the homepage, About, joining points, Travel Self, and the joining selector point to the blocked `/start-here` experience.

The supplied brief says to hide `/start-here`, not link “Ask a question” to it, use only an existing approved real destination, and **stop if no real destination exists**. Therefore no navigation, departures, route, map, content, or production file has been modified. Implementation is paused pending an approved monitored email address or a genuinely functional contact destination.
