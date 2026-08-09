# Task 3 — Consolidate journeys under Departures

## Preservation gate

Task 3 was implemented as a routing and wayfinding change only. No page layout,
component styling, map behaviour, journey data, section data, image assignment,
Travel Self scoring or long-form journey copy was changed.

The existing `/caravans/andean-caravan/how-it-works` page is not a duplicate of
the canonical Departures hub or complete-journey page. It contains a unique map
placement, gate selector, journey drawer, combinations, FAQ and operating copy.
Because no equivalent canonical destination exists, that route remains live and
unchanged rather than being redirected and making its content appear to vanish.

## Redirect table

| Legacy URL | Canonical destination | Redirect status |
| --- | --- | --- |
| `/caravans` | `/departures#full-route-map` | `308 Permanent Redirect` |
| `/caravans/the-andean-caravan` | `/departures/the-andean-caravan` | `308 Permanent Redirect` |

Meaningful query strings pass through both redirects. The legacy hub adds the
stable `#full-route-map` fragment after the preserved query string.

## Departures dropdown lock

The dropdown remains present in both desktop navigation and the mobile drawer.
Its exact contents and order are:

1. The Andean Caravan — `/departures/the-andean-caravan`
2. Browse all nine sections — `/departures#all-sections`
3. Full route map — `/departures#full-route-map`
4. Joining & Leaving Points — `/joining-points`
5. Dates & availability — `/departures#dates-availability`
6. What is included — `/departures#what-is-included`

Only the Full route map destination changed, from the duplicate Caravan hub to
the already-existing stable anchor on Departures. Labels, order, rendering and
menu interactions were not altered.

## Internal-link consolidation

The public How it works page, the field-document action, the complete-journey
wayfinding block and the legacy hub's internal journey link now point directly
to the canonical Departures destinations. The sitemap excludes the two redirect
sources and retains the Departures hub, complete journey and all nine sections.

## Content and map integrity

The pre-edit and post-edit SHA-256 values match:

| Locked source | SHA-256 |
| --- | --- |
| `app/(public)/caravans/_components/CaravanRouteMap.tsx` | `e596b8c558e81e6c05e66e60cbee71965c8d072003e2a77e3ee43b985fbd8140` |
| `app/(public)/caravans/_components/CaravanRouteMap.module.css` | `1b32d62821521dbe360d35ea9e2d040866b49ad5c09bf10760155e6444d787f7` |
| `app/(public)/caravans/andean-caravan/how-it-works/page.tsx` | `999fb4f35509815c4010a17b6e5166e756c9d591138cd90ceba6bc6a0fd739c1` |
| `app/(public)/caravans/andean-caravan/how-it-works/_content.ts` | `2d42751d40286592524502ffa6efe4c15ac769b8da6719056b2c2b4a405d2d00` |
| `content/andean-caravan-destinations.ts` | `ee72bfbccc141f82b6cd31c7ec51796410ece42fc29ba6a743035919b3ab4172` |
| `content/andean-caravan-images.ts` | `4bfcf4208498fbd82803a17a8522d5ec2c1867686edd61fd86bcd655db89c243` |

The public image inventory remains 84 files with aggregate path/content checksum
`cee2588ed75831fa5593d5f9818a377f9e278da3f1fcd81d0a0261475f21c753`.

## Verification

- Focused preservation tests: 22 passed.
- Full unit suite: 71 passed.
- TypeScript: passed.
- ESLint: passed.
- Production build: passed; 33 static pages generated.
- Live redirect requests: both returned 308 with query strings preserved.
- Unique Caravan explainer: returned 200.
- Desktop dropdown: opened and rendered all six entries in the locked order.
- Mobile drawer dropdown: opened and rendered the same six entries in the locked order.
- Sitemap: contains only canonical Departures journey URLs.
- Locked-map and content checksums: unchanged.

## Files intentionally changed

- `next.config.ts`
- `content/navigation.ts`
- `content/field-document.ts`
- `app/(public)/how-it-works/page.tsx`
- `app/(public)/departures/[slug]/page.tsx`
- `app/(public)/caravans/page.tsx`
- `app/sitemap.ts`
- `tests/content/contracts.test.ts`
- `tests/content/redirects.test.ts`
- `tests/brand/site-navigation.test.tsx`

No production file outside this list was modified for Task 3.
