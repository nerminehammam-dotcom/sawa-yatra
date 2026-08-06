# Technical check

6 August 2026. Run before a design session, so it says plainly what was proved,
what was disproved, and what could not be checked at all.

Reproduce with:

```
npm test                                   # 119 unit and component tests
npm run build
python3 tools/audit/check-site.py          # links, images, headings, metadata
python3 tools/audit/measure-hero-contrast.py
```

---

## Result

**No failures.** One thing worth acting on before launch, three worth knowing,
and one correction to something I told you earlier.

| Area | Result |
|---|---|
| Unit and component tests | **119 pass, 0 fail** (24 files) |
| Typecheck, lint, build | clean |
| Internal links | 30 targets, **0 broken** |
| External links | 1, resolves |
| Images | 74 referenced, **0 missing**, **0 without alt** |
| Heading structure | **0 problems** across 36 pages |
| Titles and descriptions | present on every page |
| Responsive static scan | **0 unguarded fixed widths** |
| Form delivery | fails loudly when unconfigured, verified by execution |
| Security headers | 5 configured |

---

## The one to act on: two core pages cannot be indexed

`createPageMetadata` sets `noIndex` on any route whose meta description is
still a placeholder, and `sitemap.ts` drops it by the same rule. That is good
design — it stops half-written pages reaching search results.

But two of the pages it is currently catching are ones you would want found:

| Route | Consequence |
|---|---|
| **`/how-it-works`** | noindex, absent from the sitemap |
| **`/travel-self`** | noindex, absent from the sitemap |

Also caught, and mattering less: `/membership`, `/about`, `/sign-in`,
`/request-invitation`, `/privacy`, `/terms`, `/accessibility`, `/404`. Of those,
`/membership` and `/about` are redirected anyway, so only the legal pages are
worth revisiting later.

The sitemap currently carries **18 URLs**. Meet your Travel Self is the thing
that makes Sawayatra different from every operator in the category, and it is
not one of them.

**Fix:** one approved sentence each in `approvedRouteDescriptions` in
`content/site.ts`. Nothing else changes; both flags flip automatically. This is
copy, so it is yours to write.

---

## Worth knowing

### Source images are heavy, but that is not what visitors download

`/departures/the-end-of-the-road` references **10.4 MB across 23 images**, and
17 individual files exceed 600 KB. That is weight on disk.

Checked rather than assumed: **21 of the 23 are served through `next/image`**,
every one carries a `sizes` attribute, 20 lazy-load and one gets
`fetchpriority="high"`. `next.config.ts` requests AVIF and WebP with sensible
device sizes. So a phone receives a resized, re-encoded image, not the
original.

The two raw files are the wordmark SVG, which is correct — SVG should not go
through the optimiser.

Still worth compressing the sources eventually. Not urgent, and not the
performance problem it looks like.

### Nine links point into a redirect

Nine links across the section pages point at `/departures/the-andean-caravan`,
which 301s to `/caravans/andean`. They work; every visitor takes one extra hop.
A one-line change in whatever generates that link.

### Placeholder text still reaches visitors on 20 pages

`Price on request` on 12, `PLACEHOLDER` on `/404` and `/request-invitation`,
`To be confirmed` and `LEGAL REVIEW` on the three legal pages. All known, all
blocked on decisions rather than on code.

---

## Correction to Phase 1

`audit/static.md` says four duplicate-URL pairs would compete once indexing is
switched on. **That was wrong.** `next.config.ts` carries six 301 redirects I
had not accounted for:

| From | To |
|---|---|
| `/about` | `/who-we-are` |
| `/membership` | `/members` |
| `/do-it-yourself` | `/create-your-own-journey` |
| `/departures` | `/caravans/andean` |
| `/departures/the-andean-caravan` | `/caravans/andean` |
| `/caravans/the-andean-caravan` | `/caravans/andean` |

Each duplicate is redirected, not served twice. There is no duplicate-content
problem. The sitemap and the redirects agree with each other.

---

## Mobile and iPad

**Static analysis only. Nothing here was rendered.**

Every fixed width over 320px was traced to see whether it is guarded:

| Component | Floor | Guarded by |
|---|---|---|
| `CaravanRouteMap` (both copies) | 480px / 384px | collapses to one column at 767px; the map stage becomes `overflow: auto`, so the map scrolls inside its frame rather than the page |
| `PageHero` `.splitMedia` | 400px | sits inside `@media (min-width: 640px)`, so never applies on a phone |
| `how-it-works` | 416px | mobile query with single-column reset |
| `Footer`, `JoiningPointSelector`, `about`, `caravans`, `journey`, `home`, `GateSelector` | 352–384px | all have mobile queries and single-column resets |

**No unguarded fixed width was found.** Every one is either inside a min-width
query or has a matching collapse.

**What this does not prove.** Static analysis cannot see overflow, text
overlap, tap-target size, or whether the collapses actually look right. The
Playwright CDN is unreachable from this environment, so no headless browser was
available.

Two specific things to look at on a real device, because they are the ones
static analysis is worst at:

1. **The route map on a phone.** It is designed to scroll horizontally inside
   its own frame. Confirm the page itself does not also scroll sideways.
2. **The tap target on the route map.** An earlier audit measured the stop
   button at 44 × 4.8 px of usable area, against a 44 × 44 minimum. That is
   still the only automated accessibility failure on record and it has not been
   fixed.

---

## Backend

- **Form delivery.** Verified by running `resolveFormAdapter` under each
  condition, not by reading it: production with no keys returns null,
  production with two of three keys returns null, production with all three
  returns the email adapter. A null adapter is a 503 at the route. There is no
  path that returns 200 for an enquiry that went nowhere.
- **Route tests.** 5 tests cover a valid submission, server-side revalidation,
  unknown form kinds, journey and Travel Self identifiers outside typed
  content, and the production-unconfigured case.
- **Still switched off.** `RESEND_API_KEY`, `SAWAYATRA_FORM_SENDER` and
  `SAWAYATRA_FORM_RECIPIENT` are unset, so nothing is delivered yet. See
  `docs/TURN-THE-FORMS-ON.md`.
- **Security headers,** five, applied to every path: `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `Cross-Origin-Opener-Policy`.
- **Indexing.** `robots.txt` is `Disallow: /` for the whole site, correct while
  `NEXT_PUBLIC_SITE_URL` is unset. Every absolute URL still resolves to
  `localhost:3000` for the same reason. Both flip together when that variable
  is set, which is a launch decision.

---

## Six tests were failing before this check

Not new bugs — six assertions still describing behaviour I had changed and not
updated. Worth recording, because a red suite is a useless safety net and I
left it red:

- `wordmark.test.tsx` × 2 looked for the text "Sawayatra"; the wordmark is now
  artwork. Rewritten to assert the artwork is decorative and the link keeps its
  accessible name.
- `contracts.test.ts` × 3: the route map still listed India and Egypt, the
  Caravans submenu still expected three entries, and the form set still
  expected three kinds.
- `contact.test.tsx` asserted that `/contact` never sends. It now does.
  Rewritten to assert the opposite, and to lock in the property that matters
  more: on failure the visitor never loses what they typed.

All 119 now pass.

---

## Not checked

- Anything rendered. No browser available.
- Real device testing on iPhone or iPad.
- Screen-reader behaviour.
- Real production performance. Everything here is from a local build; there is
  no analytics on the site, so no field data exists either.
- Contrast anywhere except the home hero headline, which is in
  `audit/measured.md` and passes at 7.17:1 worst case.
