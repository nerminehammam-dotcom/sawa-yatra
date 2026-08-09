# Sawayatra — public website

This repository contains the Sawayatra public website governed by **Sawayatra Website Master Build Brief v2 — Fonts and Pink Locked** (24 July 2026). The implementation preserves the existing Fraunces display face, Inter reading face, existing pink `#eeb6c4`, and the established temporary logo.

The site now behaves as a photographic field document: full-bleed natural-colour imagery, strong editorial sequencing, index-like route rows, numbered joining points, regional chapters and rare bold colour fields. It deliberately avoids generic rounded-card layouts, gradients and decorative overlays on photographs.

## Principal public routes

- `/` — photographic opening, key proposition, route index, joining-point selector and regional chapters
- `/caravans` — Caravan collection and flagship journey entry
- `/caravans/the-andean-caravan` — complete journey, sections and interactive route atlas
- `/joining-points` — numbered entry-gate selector
- `/how-it-works` — entry, movement and exit model
- `/about` — point of view and operating principles
- `/start-here` — joining-point context and interest form

The older `/departures` paths remain functional for existing links and the nine detailed journey sections, but **Caravans** is the principal public label.

## Locked visual system

| Role | Value |
| --- | --- |
| Paper | `#e7e1d6` |
| Ink | `#27231f` |
| Signal orange | `#f05a2a` |
| Clay | `#a96f47` |
| Sun | `#e5bc4f` |
| Olive | `#98904f` |
| Existing pink | `#eeb6c4` |

No additional interface colours, gradients or photo casts are used. Readable copy uses ink on coloured fields; colour is carried by surfaces, markers, borders and graphic accents.

## Stack

- Next.js App Router and React
- strict TypeScript
- CSS Modules and global tokens
- React Hook Form and Zod
- typed local content in `content/`
- Vitest, Testing Library and Playwright

## Run locally

Node.js 20.9 or newer is required.

```bash
npm install
npx playwright install chrome firefox webkit
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Release 1 forms use a clearly labelled local mock and do not send or retain raw submissions on a server.

## Quality commands

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

The browser suite checks 375px, 768px, 1024px and 1440px, plus Firefox and WebKit. It covers overflow, keyboard navigation, real CTA destinations, forms, metadata and automated accessibility.

## Content and imagery

The field-document model lives in `content/field-document.ts`. The detailed Andean model and local photographs live in the other typed files under `content/`. Supplied route photography is presented in natural colour and served responsively through Next.js Image.

To regenerate the compressed web copies from untouched journey originals:

```bash
python3 scripts/optimize-journey-images.py
```

The script applies orientation, converts to sRGB, removes metadata, limits the longest edge to 2,400 pixels and writes progressive JPEGs.

## Production

Before launch, resolve the explicit placeholders and approvals in `BUILD_NOTES.md`, set the approved `NEXT_PUBLIC_SITE_URL`, keep live form delivery and analytics disabled until approved, and repeat the complete quality suite on the Vercel preview URL.
