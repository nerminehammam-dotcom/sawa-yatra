# Sawayatra — build notes

This is the explicit register of placeholders, approvals and launch blockers for the implementation governed by **Sawayatra Website Master Build Brief v2 — Fonts and Pink Locked**.

## Implemented from the master brief

- Preserved the existing Fraunces and Inter font files and the exact existing pink `#eeb6c4`.
- Preserved the current temporary logo and wordmark component.
- Rebuilt the principal experience around **Caravans**, with the key proposition: “One caravan. One long route. Join where you choose. Leave when your journey is complete.”
- Added the Home, Caravans, Andean Caravan, Joining Points, How It Works, About and Start Here route flow.
- Added the route index, numbered joining-point selector, regional field-document chapters and final selector-led CTA.
- Reworked the Andean route atlas with country fields, numbered stops, keyboard operation, zoom, selected-stop details and local route photography.
- Applied the closed seven-colour palette across the site; removed gradients, out-of-system colours and photographic casts.
- Kept all existing photographs in natural colour and retained compressed responsive sources.
- Kept the old `/departures` detail URLs functional while removing Departures as the principal navigation label.
- Preserved Release 1 boundaries: no authentication, verification, sensitive data, deposit, payment, approval workflow, operator portal or Travel Passport.

## Typed placeholders and launch blockers

| Area | Status | Required before production |
| --- | --- | --- |
| Production origin | PLACEHOLDER | Supply the approved HTTPS origin through `NEXT_PUBLIC_SITE_URL`. |
| Final logo | PLACEHOLDER | Replace the temporary route mark and typeset wordmark only when the final identity is approved. |
| Founder material | PLACEHOLDER | Supply the approved founder name, story, portrait and image alt text. No founder facts were invented. |
| Photography approval | DRAFT | Confirm publication rights, final crops/focal points and founder-approved alt text for all supplied imagery. |
| Exact dates | PROVISIONAL | Keep the qualified public date wording until routes are secured and dates are approved. |
| Price and availability | PLACEHOLDER | Pricing remains “Price on request”; do not infer availability, accommodation or commercial terms. |
| Joining-point operating detail | DRAFT | Confirm the final operational wording for every entry/exit gate before publication. |
| Legal copy | LEGAL REVIEW | Replace the clearly labelled Privacy, Terms and Accessibility placeholders with reviewed copy. |
| Form consent | LEGAL REVIEW | Review the invitation and journey-interest consent language. Checkboxes are not preselected. |
| Form delivery | MOCK | Approve the destination, retention, access, rate-limiting and bot-protection rules before enabling live delivery. |
| Analytics | DISABLED | Supply the approved domain and privacy basis before enabling analytics. |
| Metadata descriptions | PLACEHOLDER | Approve unique route descriptions before indexation. |
| Structured data | PLACEHOLDER | Add only after the legal organisation identity, public origin and journey facts are approved. |
| Social artwork and favicon | PLACEHOLDER | Replace temporary artwork and icon with final approved identity assets. |
| Older-traveller study | REQUIRED | Run moderated task testing with representative travellers approximately 55–70 years old. |

## Release boundary

Not built: authentication, verification, passport or date-of-birth collection, health or mobility data, emergency contacts, deposits, payments, mutual approval, operator/guide portals, Travel Passport or other Phase 2 workflows. Open Seats is absent from navigation.

## Form and privacy behaviour

- `/api/forms/[kind]` validates JSON with Zod and returns explicit mock responses; it does not send, persist or log submitted values.
- The browser stores only a SHA-256 fingerprint, mock result and timestamp to demonstrate duplicate state. Raw form values are not stored in the receipt.
- Validation, pending, error, success and duplicate states are implemented.
- No private credentials or sensitive Release 2 fields are present in the client.

## Visual and asset notes

- The palette is closed to paper, ink, signal orange, clay, sun, olive and the locked existing pink.
- Fraunces and Inter remain self-hosted WOFF2 files.
- Photographs are untreated: no tint, duotone or overlay cast is applied.
- The route gallery uses compressed progressive JPEG sources up to a 2,400-pixel longest edge; Next.js serves device-sized derivatives.
- The interactive atlas is illustrative rather than navigational. It does not infer road, air or total mileage.
- Destination population and altitude details are orientation content, not confirmed itinerary inclusions; the interface links its named sources.

## Final QA — 24 July 2026

- `npm run typecheck`: passed in strict mode.
- `npm run lint`: passed.
- `npm test`: 33 tests passed.
- `npm run build`: passed; 31 page outputs generated and the form API route compiled.
- Playwright: 184 applicable checks passed; 116 project-specific checks were intentionally skipped outside their assigned viewport or engine.
- Responsive checks passed at 375px, 768px, 1024px and 1440px with no horizontal overflow.
- Firefox 1440px and WebKit 768px checks passed.
- Axe reported no serious or critical violations on any public route.
- Mobile and tablet menu focus trapping, Escape closure and focus return passed.
- Every rendered CTA resolves to a real internal destination; no bare `#` or dead action remains.
- The invitation and journey-interest flows remain non-sensitive and payment-free.

## Deployment note

The repository is ready for a Vercel preview after the production origin is supplied. This task did not deploy, push, or enable any external service.
