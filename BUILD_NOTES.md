# Sawayatra Release 1 — build notes

This file is the explicit register of mocks, placeholders, credentials and launch blockers. A successful build means the Release 1 implementation works; it does not mean the unresolved editorial, legal or operating decisions below are approved for publication.

## Release boundary

Built: the public route set, typed journey browse/detail pages, the draft six-question Travel Self taster, invitation/journey-interest/member-access holding forms, responsive navigation, metadata, system states and automated tests.

Not built: authentication, verification, passport or date-of-birth collection, health or mobility data, emergency contacts, deposits, payments, mutual-approval operations, member/operator/guide portals, Travel Passport or any other Phase 2 workflow. Open Seats is not present in navigation.

## Launch blockers

| Area | Status | Required before launch |
| --- | --- | --- |
| Production origin | PLACEHOLDER | Supply the approved HTTPS site URL through `NEXT_PUBLIC_SITE_URL`. Until then, local canonical generation uses localhost and non-production pages are noindexed. |
| Final logo | PLACEHOLDER | Replace the typeset Fraunces wordmark with the approved identity asset while preserving the wordmark component contract. |
| Home hero and land imagery | PLACEHOLDER | Supply founder-owned or commissioned imagery, focal points and approved alt text. |
| About/founder material | PLACEHOLDER | Supply the founder name, biography/story, portrait, signature, host-role copy and approved alt text. No facts have been inferred. |
| Andean photography | DRAFT | All 70 supplied HD photographs are now assigned to their corresponding Caravan sections and used across the Departures experience. Confirm publication rights, final focal points and founder-approved alt text before launch. |
| Andean dates | PROVISIONAL | Public pages intentionally show only “February–April 2028 · exact dates announced when the route is secured” or the relevant month window with the same qualification. Do not publish internal gate dates until the route is secured. |
| Andean commercial facts | PLACEHOLDER | Public pricing remains “Price on request”. Availability, contracted accommodation, rooming terms and commercial policy are not activated in Release 1. |
| Andean operating details | DRAFT | The new master supplies the public route narrative and section structure. Any content requiring a separate safety, participation or supplier decision remains omitted or framed only as an honest route condition. |
| Travel Self | DRAFT / PLACEHOLDER | Founder-approve all 12 archetype names, portraits, green flags and fit statements; replace placeholder questions/options/scoring. The current taster is explicitly a deterministic interface demonstration, not a psychological, diagnostic or compatibility assessment. |
| Membership | DRAFT / PLACEHOLDER | Approve the four promise descriptions, selectivity copy, tier names/descriptions/benefits, membership FAQs and prices. Prices remain visibly “To be confirmed”. |
| How it works / safety | DRAFT / PLACEHOLDER | Verify the double-opt-in and private-trip operating mechanisms before publication and supply approved mechanism copy. No guarantee or verification procedure is asserted. |
| Legal pages | LEGAL REVIEW | Supply professionally reviewed Privacy, Terms and Accessibility copy and review dates. Current pages are clearly labelled placeholders. |
| Cookie behaviour | LEGAL REVIEW | Decide whether a notice is required and supply approved wording. No analytics or non-essential tracker is active, so no speculative banner was added. |
| Metadata descriptions | PLACEHOLDER | Supply founder-approved unique descriptions for every route. Titles and route mapping are implemented; placeholder descriptions remain explicit. |
| Structured data | PLACEHOLDER | Supply the legal organisation identity and approved public origin before Organization schema is appropriate. TouristTrip schema is omitted while journey facts remain draft. |
| Favicon | PLACEHOLDER | Replace the temporary route-through-a-gate icon with the final approved identity asset. |
| Social artwork | PLACEHOLDER | Replace the temporary AI-generated Release 1 social artwork with commissioned/approved brand artwork if required. |
| Form consent | LEGAL REVIEW | Professionally review the consent text for invitation and journey-interest requests. Checkboxes are never preselected. |
| Form delivery | MOCK | Approve a data destination, retention policy, recipients, rate limiting and bot protection; then implement and test the existing server-only Resend/API adapter seam. |
| Analytics | DISABLED | Supply the Plausible domain and approve the privacy/consent basis before enabling transmission. Typed event names exist, but no event leaves the browser. |

## Development mock behaviour

- `/api/forms/[kind]` validates JSON with Zod and returns explicit mock responses. It does not send, persist or log submitted values.
- The browser may save only a SHA-256 submission fingerprint, a mock result and timestamp in local storage so duplicate state can be demonstrated. Raw form values are not stored in the receipt.
- Success language states that the request was acknowledged only by the development mock. Journey interest is not a booking, deposit or payment.
- Validation, pending, network-error, success and duplicate states are implemented. A live adapter is intentionally not configured.

## Asset notes

- `public/assets/textures/grain.svg` implements the locked grain recipe.
- Fraunces and Inter are self-hosted as WOFF2 files. Only the regular and italic Fraunces faces required by the first view are explicitly preloaded.
- The Andean Caravan uses all 70 supplied HD photographs from the Peru, Bolivia, Atacama and Chile working folders. Web copies are stored at `public/assets/images/departures/andean/gallery/` and assigned geographically across the nine route sections in `content/andean-caravan-images.ts`. Other unresolved site imagery remains manifest-controlled rather than invented.
- `scripts/optimize-journey-images.py` reproduces the gallery assets from the untouched originals. It applies orientation, converts embedded colour profiles to sRGB, removes source metadata, resizes the longest edge to 2,400 pixels and writes progressive JPEGs at quality 78.
- The compression pass reduced 5.65 GB of originals to 42.9 MB of web assets, a 99.2% reduction. Next.js then serves responsive, device-sized variants from these sources.
- Complete Caravan: `chile 2025 Web/patagonia 62.png` → `andean-caravan.jpg`.
- Section 01: `peru 2025 Web/lima 05.png` → `desert-coast.jpg`.
- Section 02: `peru 2025 Web/_Z8N0934.png` → `white-city-deep-canyon.jpg`.
- Section 03: `peru 2025 Web/london 0j.png` → `the-stone-road.jpg`.
- Section 04: `peru 2025 Web/drive la paz puno 10.png` → `both-shores.jpg`.
- Section 05: `bolivia 2025 Web/la paz 09 copy 2.png` → `thin-air-cloud-forest.jpg`.
- Section 06: `bolivia 2025 Web/drive uyuni lapaz 010.png` → `silver-and-bone.jpg`.
- Section 07: `atacama/uyuni 01.png` → `the-mirror.jpg`.
- Section 08: `atacama/astro 01.png` → `atacama.jpg`.
- Section 09: `chile 2025 Web/_Z8N7909-copy.jpg` → `the-end-of-the-road.jpg`.
- `public/assets/images/social-sawayatra-r1.webp` was produced with the built-in image-generation tool as a temporary 1200 × 630 risograph social card. Final prompt: “Create a warm editorial risograph travel illustration conveying going alone and arriving together: an abstract mountain path leading toward a welcoming outdoor table; warm cream, terracotta, brick, honey, olive and near-black; tactile grain; no text, logo, price, verification, deposit, safety claim or watermark.”
- The temporary logo pairs accessible HTML text set in Fraunces with a decorative inline route-through-a-gate mark. It is not a permanent identity asset.

## Privacy and security notes

- No secrets are required or bundled in the client.
- No sensitive or Phase 2 data fields exist.
- Server-bound form data is validated on both client and server.
- Mock responses use `Cache-Control: no-store` and enforce JSON content type and a payload-size ceiling.
- Production rate limiting and bot protection are launch blockers because there is no live endpoint yet.

## Intentional structured-data omissions

Organization schema is omitted until an approved legal name and production origin are supplied. TouristTrip schema is omitted until journey facts are confirmed. This follows the requirement to emit structured data only when legally and factually appropriate.

## Final QA record

Completed on 23 July 2026 against the local optimized production build:

- `npm run typecheck`: passed with strict TypeScript.
- `npm run lint`: passed with no lint errors.
- `npm run test:unit`: 27 tests passed across 7 files.
- `npm run build`: passed; all 27 static outputs generated and the form API route compiled.
- Playwright: 155 applicable checks passed; 101 project-specific checks were intentionally skipped outside their assigned viewport or engine. The suite covers all ten Andean detail routes, every other public route, real 404 responses, metadata, CTA destinations, keyboard interaction, form validation/success/duplicate states, accessibility and horizontal overflow.
- Responsive Chrome checks passed at 375 × 812, 768 × 1024, 1024 × 900 and 1440 × 1000. Manual browser inspection was also completed at the four required widths.
- Secondary-engine checks passed in Firefox at 1440 × 1000 and WebKit at 768 × 1024, including the tablet menu and form controls.
- Axe reported no serious or critical violations on any public route.
- Lighthouse 13 on `/departures` scored 92 for mobile performance and 100 for accessibility, with FCP 1.4 s, LCP 3.3 s, CLS 0, TBT 0 ms and a 410 KiB initial transfer. Repeat the lab audit and collect real-user Web Vitals on the final Vercel origin after the photography and production domain are approved.
- No dead CTA, bare `href="#"`, active Open Seats navigation, authentication field, payment/deposit workflow or sensitive Phase 2 collection was found.

Performance implementation note: route CSS is inlined using Next.js `experimental.inlineCss`, and below-fold sections use progressive `content-visibility`. Revalidate these optimizations when upgrading Next.js; unsupported browsers safely fall back to normal section rendering.
