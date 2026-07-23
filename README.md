# Sawayatra — Release 1 public website

This repository contains the Release 1 public website defined by the Sawayatra Master Brand & Build Spec v1.3 and Visual Manual v1.1. The master specification governs scope and behaviour; the visual manual governs execution. Phase 2 features and sensitive-data collection are intentionally absent.

## Stack

- Next.js App Router and React
- TypeScript in strict mode
- CSS Modules with global design tokens
- React Hook Form and Zod
- Typed local content in `content/`
- Vitest, Testing Library and Playwright

## Local setup

Use Node.js 20.9 or newer.

```bash
npm install
npx playwright install chrome firefox webkit
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Release 1 is safe to run without credentials: every form uses a clearly labelled development mock that sends and stores no submitted values on the server.

## Environment variables

| Variable | Release 1 use |
| --- | --- |
| `NEXT_PUBLIC_FORM_MODE` | Keep as `mock`. No live form adapter is implemented. |
| `NEXT_PUBLIC_SITE_URL` | Required before production launch for canonical, sitemap and social URLs. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Leave blank. Analytics transmission is disabled pending a domain, consent decision and privacy basis. |
| `RESEND_API_KEY` | Reserved for a future approved server-side adapter; unused in Release 1. |
| `SAWAYATRA_FORM_ENDPOINT` | Reserved for a future approved endpoint; unused in Release 1. |

Never place private credentials in a `NEXT_PUBLIC_*` variable.

## Quality commands

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run test:e2e
npm run build
```

Playwright covers the acceptance widths at 375px, 768px, 1024px and 1440px. The test runner starts a local Next.js server automatically.

## Content and assets

Repeated editorial content, journeys, archetypes, quiz data, FAQs, legal placeholders and metadata live in `content/`. The public Departures area now reads from the typed Andean Caravan model in `content/andean-caravan.ts`: one complete 71-day Caravan plus nine consecutive sections. The photographs used there are local, responsive Next.js image assets in `public/assets/images/departures/andean/`.

The public URLs remain under the Release 1 route contract: `/departures`, `/departures/the-andean-caravan`, and the nine `/departures/[section-slug]` pages. The earlier three visual-manual demonstration slugs are no longer generated.

Missing source material elsewhere remains visibly status-labelled as `DRAFT`, `PLACEHOLDER` or `LEGAL REVIEW`; see [BUILD_NOTES.md](./BUILD_NOTES.md) for the launch blockers.

The current logo is an intentionally temporary Fraunces wordmark paired with a decorative route-through-a-gate mark. Final identity assets can replace the manifest entries in `content/assets.ts` without changing page layout contracts.

## Deployment

The locked deployment target is Vercel. Before creating a production deployment:

1. Resolve every launch blocker in `BUILD_NOTES.md`.
2. Set `NEXT_PUBLIC_SITE_URL` to the approved HTTPS origin.
3. Keep analytics and live delivery disabled until their legal and operational decisions are approved.
4. Run the full quality command set above.
5. Import the repository into Vercel using the Next.js preset and repeat the acceptance checks on the preview URL.

No deployment is performed by this repository setup.
