# Sawayatra — PASS 6: synthesis, roadmap, verdict

Built only from the findings in passes 1–5. No new claims are introduced; every item traces to a prior pass, cited as [P1]–[P5]. Candid, unsentimental, and aimed at one thing: a realistic path from the site's present condition to an exceptional, coherent, trusted, funder-ready Sawayatra.

The one-sentence state of things: **the proposition is strong and the craft is real, but the site does not explain the proposition on first contact, cannot presently be found, and cannot presently convert the one action it asks for.**

---

## Roadmap — four tiers

Columns: **deliverable · page/file · reason · priority · effort · dependencies · who · acceptance criteria · test/evidence to close.** "Who" ∈ founder, editor, designer, developer, operations, legal, photographer.

### TIER 1 — Immediate (damages comprehension, accessibility, credibility, core function, or performance)

| # | Deliverable | Page/file | Reason | Pri | Effort | Depends on | Who | Acceptance criteria | Test to close |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Set `NEXT_PUBLIC_SITE_URL` + choose canonical domain; redirect the other host | Vercel Prod env; `next.config.ts` [P1 C1, P3 SEO] | Site is live but `noindex` + `robots: Disallow: /` + `localhost` canonicals/OG/sitemap — invisible to search, broken on shares | Critical | Small | Canonical-domain decision | founder (decide), developer | `view-source` shows `index,follow` + real canonical; `robots.txt` allows; a shared link shows the photograph | Search Console URL-inspection = indexable; `robots.txt` fetched shows `Allow` |
| 2 | One working interest capture; make banner + CTA agree | `/register-interest`, `lib/forms/adapters.ts` [P1 C2/C6, P5 J7] | The primary conversion dead-ends: banner says "open for interest," page says "coming soon," mailto only | Critical | Small (wire) + decision | Resend keys (founder); consent basis (legal) | founder, developer, legal | Submitting delivers an email; banner and CTA no longer contradict | Submit a test interest → email received; `grep` shows no "coming soon" under an "open" banner |
| 3 | Remove visible `PLACEHOLDER`/`LEGAL REVIEW` text + the mock-consent box; fold `/request-invitation` into interest capture or 301 it | `/request-invitation`, content [P1 C3] | A public page shows internal scaffolding and a checkbox that admits it is not real consent while collecting personal data | Critical | Small | Consent wording (legal) before any data collection | developer, legal | No "PLACEHOLDER"/"LEGAL REVIEW" in any rendered page; no personal data collected behind a non-consent box | `grep -ri "placeholder\|legal review"` over rendered HTML = 0 |
| 4 | Give `/start-here` real server content or 301 it to `/how-it-works` | `/start-here` [P1 C4, P3 A1] | Named, described URL renders only "Loading Sawayatra…"; 0 `h1`; dead to crawlers/no-JS | High | Small | None | developer | Server HTML has an `h1` + real links, or a 301 | `curl` (JS off) shows `<h1>` or a redirect |
| 5 | Homepage: add the plain subline + status line; reorder so proposition + three-ways precede the etymology | `/`, `app/(public)/page.tsx` [P1 C5] | First substantive content is the name's etymology, not what Sawayatra is; fails the ten-second test on what/who/next | High | Medium | Copy exists (P1 §2) | editor, developer | A five-second read answers what it is / who for / what next; three-ways block above the fold | 3 unfamiliar readers answer the three questions correctly |
| 6 | One "dual-nature" chip across all nine section pages; delete the contradictory "separate departure, not a place on the Caravan" block | `/departures/[slug]`, section component [P2] | Section pages say both "Section 1 of 9, joined end to end" and "not a place on the annual Caravan" | High | Small | Section-model decision (founder) | founder (confirm), editor, developer | No page states both framings; one chip states the dual nature | Read all nine; no contradiction present |
| 7 | Resolve group size to one field with the true exception stated | `content/andean-caravan.ts`; caravan + section pages [P2] | "max 12" (brief) vs "12–16" (caravan) vs "up to 16" (section) — three numbers | High | Small | The true number (founder) | founder (decide), developer | Overview and section strips cite the same value or the documented exception | A test asserts the two cite one source |

### TIER 2 — Short term (materially improves trust, navigation, conversion, product understanding)

| # | Deliverable | Page/file | Reason | Pri | Effort | Depends on | Who | Acceptance criteria | Test to close |
|---|---|---|---|---|---|---|---|---|---|
| 8 | Name the founder — short bio + photograph | `/who-we-are` [P5 audit, J8] | The only human trace on the whole site is a Gmail address; highest-leverage trust fix and needs no legal review | High | Small | Founder consent | founder, photographer, editor | A named human with credentials renders on `/who-we-are` | Page shows a name, face, and one-line credibility |
| 9 | Make the three ways genuinely three, each with a status chip | `/how-it-works` [P2 Page 1] | Ways (1) Caravan and (2) Join a Journey both point at the Andean Caravan; (3) "not available" | High | Small | Copy exists (P2 §9) | editor, developer | Three distinct destinations + statuses; none duplicated | Each card resolves to one taxonomy value; no two share a destination |
| 10 | Revised primary navigation (four operational items); move "coming soon" pages to footer | `content/navigation.ts` [P1 §5.2] | Half the primary nav points at "coming soon"/stub pages | High | Small | None | editor, developer | Primary nav = How it works · Travel Self · The Andean Caravan · Who we are | Nav renders four items; stubs are footer-only |
| 11 | Surface the Travel Self boundary on the landing screen; soften the three essentialist phrases; result → journey handoff | `/travel-self`, `content/travel-self/*` [P2 Page 4] | The "not a psychological test" guard exists but not on first contact; "Which one are you?"/"reveal which one is yours" edge to diagnosis | Medium | Small | None | editor, developer | Boundary text in `/travel-self` SSR and in the result; result links to a journey | Assert `boundary` string in landing + result; result contains a journey link |
| 12 | Solo practicalities block (rooming, single-room option, honest); connect Travel Self to a solo path | `/caravans/andean`, `/travel-self` [P5 J5, P4] | The core audience gets the matching philosophy but none of the solo practicalities every competitor answers | High | Medium | Rooming/solo policy (founder/ops) | founder, ops, editor | A solo visitor can answer "will I share a room / does it cost more / who else is going (later)" | The three solo questions are answerable on-page |
| 13 | Complete the Caravan fact layer: transport line + difficulty grade + included/excluded | `/caravans/andean`, `/departures/[slug]` [P2, P4] | No transport stated; no difficulty grade; inclusions partial | High | Medium | Facts + a difficulty scale (founder/ops) | founder, ops, editor, developer | Each section shows difficulty + transport; an included/not-included list exists | Fact strip carries all fields; a section shows a grade |
| 14 | Consolidate four capture flows to one interest form + `/contact` | `/register-interest`, `/sign-in`, `/request-invitation` [P1 C6] | Four flows, four states, four wordings, none deliver | High | Medium | Item 2 | developer, editor | One reachable interest capture; `/contact` remains the question path | `grep` finds no second "leave your email" outside `/contact` |

### TIER 3 — Medium term (design system, content system, SEO, testing, maintainability)

| # | Deliverable | Page/file | Reason | Pri | Effort | Depends on | Who | Acceptance | Test to close |
|---|---|---|---|---|---|---|---|---|---|
| 15 | JSON-LD structured data (Organization, TouristTrip, BreadcrumbList) emitted from `content/` | metadata layer [P3] | Zero structured data; search can't distinguish the entities | Medium | Medium | Item 1 (don't structure-mark a noindex page); status→availability map | developer | Valid JSON-LD, no `Offer.price` while price-on-request | Google Rich Results Test validates all three types |
| 16 | Unify the two route-map components | `components/departures/CaravanRouteMap.tsx` + page-local copy [P3] | Two divergent implementations drift | Medium | Medium | None | developer | One shared component; page imports it | `grep` returns one `CaravanRouteMap` definition |
| 17 | Add E2E to CI (Playwright + Chromium) | `.github/workflows/ci.yml` [P3] | Three specs exist; none run in CI; no browser in CI | Medium | Small | None | developer | An e2e job runs the three specs | e2e job green in GitHub Actions |
| 18 | Replace the two placeholder meta descriptions | `/request-invitation`, `/sign-in` [P3 A2] | Descriptions read "PLACEHOLDER: … to be supplied" | Medium | Small | Item 3/14 may remove the pages | editor | Real descriptions; no PLACEHOLDER | `grep` = 0 |
| 19 | Measure LCP; decide on `inlineCss` | `next.config.ts` [P3] | 500–640 KB HTML per page; LCP unmeasured | Medium | Small (measure) | A browser/Lighthouse | developer | LCP for `/` and `/caravans/andean` on Slow 4G recorded; decision documented | Lighthouse report before/after |
| 20 | The money sentence (per-person-per-day rate or from-figure with basis) | `/caravans/andean`, section pages [P1 §5.5, P4] | "Price on request" only; category norm is a floor/day-rate | Medium | Small (once decided) | The price (founder) | founder, editor | A price signal on the Caravan; whole-vs-parts saving stated if priced | Page shows a from/day-rate; no invented number |
| 21 | Legal copy — privacy, terms, consent, cookie basis | `/privacy`, `/terms`, forms [P1] | All three are `LEGAL REVIEW` placeholders; gates lawful data capture | High (long lead) | Medium | A solicitor | legal, developer | Real policies; consent wording live; forms collect lawfully | Pages render real copy; no PLACEHOLDER; consent recorded |

### TIER 4 — Later (enhancements that must not distract from fundamentals)

| # | Deliverable | Reason | Who | Acceptance |
|---|---|---|---|---|
| 22 | Interactive leg-boundary route map | Every competitor ships a static map; this is an ownable gap [P4] | designer, developer | A clickable nine-section map showing hop-on/hop-off connections |
| 23 | Per-section "Hold my interest" (no-money, named state) → structured per-leg demand | No competitor turns interest into per-leg demand data [P4] | developer, product | Interest captured per section; a view of which legs lead |
| 24 | The private "who's on this leg" mutual-consent surface | The differentiator none owns with privacy intact [P4] | designer, developer, product | A leg-level presence surface that reveals identity only on mutual consent |
| 25 | `/partners` page for the funder lens, kept off primary nav | Funders can't assemble problem/market/model/founder/next-action; must not crowd the traveller funnel [P5] | founder, editor | One footer-linked page: problem · market · model · state-of-build · founder · contact |

---

## 1. The ten most serious problems

1. **The live site is `noindex` + `robots: Disallow` + localhost canonicals** — invisible to search, broken on shares [P1 C1 / P3].
2. **The primary conversion dead-ends** — "Register your interest" contradicts its own banner and delivers nothing [P1 C2 / P5 J7].
3. **No named founder or human anywhere** — only a personal Gmail [P5].
4. **`/request-invitation` shows PLACEHOLDER + a mock-consent box while collecting personal data** [P1 C3].
5. **The homepage leads with the name's etymology, not the proposition** — fails the ten-second test [P1 C5].
6. **Four capture flows, none deliver** — the one action that matters is split four ways and works zero [P1 C6].
7. **Section pages contradict themselves** on whether a section is part of the Caravan [P2].
8. **The core audience (solo, matching) gets the philosophy but none of the solo practicalities** competitors answer [P5 J5].
9. **Group size disagrees three ways** across the brief, the Caravan page and the section pages [P2].
10. **The three "ways to travel" collapse to two**, and `/start-here` renders empty [P2 / P1 C4].

## 2. The ten highest-value repairs (impact ÷ effort)

1. **Set `NEXT_PUBLIC_SITE_URL`** — one variable fixes indexability, robots and every canonical/OG/sitemap [Tier 1 #1].
2. **Wire one working interest capture + fix the banner/CTA contradiction** [#2].
3. **Homepage subline + status line + reorder** — transforms first contact with copy that already exists [#5].
4. **Name the founder on `/who-we-are`** — the single highest-leverage trust fix, no legal dependency [#8].
5. **Remove the PLACEHOLDER/mock-consent surface** [#3].
6. **One dual-nature chip across the nine sections** — ends the worst comprehension fault [#6].
7. **Differentiate the three ways with status chips** [#9].
8. **Revised four-item primary nav** [#10].
9. **Resolve group size to one field** [#7].
10. **Surface the Travel Self boundary + result→journey handoff** [#11].

## 3. The five things that must NOT be changed

1. **"Go alone, arrive together."** and the warm paper ground, ink `#27231F`, riso earth palette and printed grain — the approved identity [all passes; P5 identity 8].
2. **The own, on-route photography and the provenance line** "Every photograph on this site was made on this route" — the strongest evidenced claim on the site [P2, P5].
3. **The Travel Self overclaiming guards** — "not a compatibility score," "not a psychological test," "cannot predict whether two people will get along" [P2 Page 4].
4. **The editorial honesty** — the `/who-we-are` field-document voice, the altitude candour, "no payment is taken here," and the status taxonomy discipline [P2, P5].
5. **The redirect hygiene, the enforced token contract, single-source nav and test/CI foundation** — the maintainable engineering base [P3].

## 4. The five strongest existing assets

1. **The Travel Self** — the only live, distinctive, backend-free interaction, and the best overclaiming guard in the category [P2, P4].
2. **The Andean Caravan page** — a serious, specific product page that already carries most of the product rubric; the strongest funder proof-of-concept [P2, P5].
3. **The visual identity and art direction** — distinctive and coherent, category-ahead [P5 = 8].
4. **The content and editorial quality** — honest, authored, un-generic [P5 = 8].
5. **The originality of the proposition** — match-by-how-you-travel + mutual-consent, differentiated against eleven live comparators [P4 = 8].

## 5. The biggest strategic opportunity

**Lead with the thing no competitor owns: matching by *how* you travel, surfaced before commitment, on a route shown as a live, connected, per-leg object.** [P4]. No live site matches by travel-style pre-commitment for a route booked ahead; every operator ships a static map; none turns pre-launch interest into per-leg demand data. Sawayatra already has the instrument (the Travel Self) and the route model (nine chained sections). Building the interactive leg map (#22), the per-section interest hold (#23) and the private matching handshake (#24) would occupy a space the category's uniformity leaves wide open — without touching the identity.

## 6. The single greatest threat to trust

**That the site cannot deliver on its one ask and says contradictory things about it.** The banner declares the Caravan "open for interest"; the primary CTA leads to a page that says registration is "coming soon" and can only open an email app [P1 C2, P5 J7]. Every motivated visitor reaches the exact point of commitment and finds it broken. Compounding it: a consent checkbox that admits it "is not final legal consent" while collecting personal data [P1 C3], and no named human to stand behind any of it [P5]. Honesty elsewhere cannot offset a primary action that visibly fails.

## 7. The fastest improvement that would create a visible difference

**The homepage subline + status line + reorder** [Tier 1 #5]. The copy already exists (P1 §2); it is an editor-plus-developer change of a few hours, and it visibly transforms what a first-time visitor understands in the first five seconds — the difference between "I don't know what this is" and "a members' club that matches me by how I travel; the Andean Caravan; open for interest." (The single fastest *findability* fix is the `NEXT_PUBLIC_SITE_URL` variable, but its effect is visible in search and shares, not on the page itself.)

## 8. Proposed revised sitemap [from P1 §5.1]

- **Keep + promote:** `/` · `/how-it-works` · `/travel-self` · `/caravans/andean` (canonical flagship) · the nine `/departures/[slug]` · `/caravans/andean/route-map` · `/caravans/andean-caravan/how-it-works` · `/joining-points` · `/who-we-are` · `/members` · `/register-interest` · `/contact` · legal.
- **Merge/demote:** `/caravans` → 301 to `/caravans/andean` while one caravan exists · `/departure-dates` → fold into the Caravan page · `/request-invitation` → fold into `/register-interest` · `/create-your-own-journey` → one "coming later" page, out of primary nav.
- **Fix:** `/start-here` → real content or 301.
- **Create:** `/partners` (funder lens, footer-linked only) [P5].
- **Untouched:** the seven existing 301s are correct.

## 9. Complete CTA hierarchy [from P1 §5.5]

| Rank | Wording | Destination | Note |
|---|---|---|---|
| Primary | **Explore the Andean Caravan** | `/caravans/andean` | The one thing real and rewarding today |
| Secondary | **Meet your Travel Self** | `/travel-self` | The only live interaction; needs no backend |
| Conversion | **Register your interest** | `/register-interest` | Must deliver (Tier 1 #2); label "(opens soon)" until then |
| Enquiry | **Ask a question** | `/contact` | Kept separate from interest capture |
| Explanatory | **How Sawayatra works** | `/how-it-works` | Text link, not a button |

Retire the standalone header "Register your interest" as the *primary* CTA until it delivers.

## 10. Remove / retain / revise / create

| Action | Item |
|---|---|
| **Remove** | Visible PLACEHOLDER/LEGAL-REVIEW text + the mock-consent box [#3]; the "Planned interest states" system labels on `/how-it-works` [P2]; the unattributed maxim "People don't browse people…" [P2]; the contradictory "separate departure, not a place on the Caravan" block [#6]; three of the four capture flows [#14]. |
| **Retain** | The five must-not-change assets (§3); the seven 301s; the fact grid, RouteStepper, altitude honesty, provenance line. |
| **Revise** | Homepage order + hero [#5]; the three-ways cards [#9]; primary nav [#10]; the Travel Self landing [#11]; group-size + transport + difficulty on the Caravan/sections [#7, #13]; `/register-interest` [#2]; the two placeholder meta descriptions [#18]. |
| **Create** | One working interest capture [#2]; a named-founder block [#8]; a solo-practicalities block [#12]; JSON-LD [#15]; the `/partners` page [#25]; later — interactive leg map [#22], per-section interest hold [#23], the mutual-consent presence surface [#24]. |

## 11. Weighted overall score before repairs

I weight for a **traveller-first, pre-launch site whose primary conversion is registering interest**: comprehension and conversion dominate (if a visitor can't understand it or act, nothing else counts); findability matters because a site nobody reaches can't convert; performance and engineering are weighted low because they are already good and are not the bottleneck.

| Dimension | Weight | Score | Source | Weighted |
|---|---|---|---|---|
| Conversion & interest-capture | 18% | 3 | P5 | 0.54 |
| Comprehension (homepage + IA + strategy) | 16% | 5 | P1 | 0.80 |
| Trust & credibility | 14% | 4 | P5 | 0.56 |
| Proposition & originality | 12% | 8 | P4/P1 | 0.96 |
| Product structure & understanding | 10% | 6 | P2 | 0.60 |
| Content & editorial | 8% | 8 | P5 | 0.64 |
| Visual identity & art direction | 8% | 8 | P5 | 0.64 |
| Accessibility | 6% | 7 | P3 | 0.42 |
| SEO & findability | 6% | 2 | P3 | 0.12 |
| Performance & engineering | 2% | 7 | P3 | 0.14 |
| **Total** | **100%** | | | **5.42** |

**Overall before repairs: 5.4 / 10 — "functional but unconvincing."** Held up by identity, content, originality and engineering (all 7–8); held down by conversion (3), SEO (2) and homepage comprehension. The number is honest: a strong instrument and a strong voice, wrapped around a funnel that neither explains itself on arrival nor works at the point of action.

## 12. The ceiling — and the gates

**Realistically achievable with the whole roadmap: 8 / 10** ("strong but improvable"). Tiers 1–3 lift conversion, comprehension, trust and SEO from their current lows into the 7–8 band the identity and content already occupy. That is the honest near-term ceiling.

**9 ("exceptional") is gated by things web work cannot supply:** a credibly **named founder and team** [#8, but the *credibility* is a real person's real standing, not a bio block]; **real safety and financial-protection** arrangements [P5]; a **decided price** [#20]; **working, lawful conversion** [#2, #21 — needs a solicitor and Resend keys]; and, post-launch, **genuine social proof** the brief rightly forbids inventing [P4/P5]. None of these is a design task.

**10 ("category-leading") additionally requires the ownable differentiators built and in use** — the interactive leg map, per-leg demand capture, and the private mutual-consent matching surface [#22–24, P4] — plus real traction. That is a launched, operating Sawayatra, not a pre-launch site.

**Unflattering bottom line: the site cannot reach 9 on design and copy alone.** It is gated by legal, by a real named team, by a pricing decision, and by shipping a working conversion — decisions and paperwork, not pixels. The good news is symmetrical: none of the gates is a redesign, and the identity that would carry a 9 is already here.

---

## Final verdict

**Is the proposition strong enough?** Yes. Match-by-how-you-travel plus mutual-consent privacy is genuinely differentiated against eleven live competitors [P4]. This is not the problem.

**Does the current site explain it?** Not on first contact. The homepage opens with the name's etymology; the proposition, the three ways and the status all live one page over [P1 C5]. A first-time visitor leaves unsure what Sawayatra is.

**Does the product structure make sense?** Underneath, yes — one route, nine chained sections, an instrument that reads them. On the surface, no: the three ways collapse to two, and a section is described as both part of and not part of the Caravan [P2]. The structure is sound and mis-narrated.

**Does the site feel trustworthy?** In voice, yes — it is honest to a degree the category is not. In substance, no — no named human, a primary action that dead-ends, and visible placeholder/mock-consent scaffolding [P5, P1]. Editorial honesty is undercut by structural unreliability.

**Is it ready for travellers?** No. It cannot be found (noindex), cannot convert (dead register-interest), and underserves its core solo audience on the practicalities [P3, P5]. It is ready to be *read*, not to be *used*.

**Is it ready for partners or funders?** No. There is no operating model, no founder, and no next action for a funder — though the flagship Caravan page is a strong proof-of-concept to link them to [P5]. The fix is a separate `/partners` page, not a rewrite of the traveller site.

**What must happen before it can credibly be called exceptional?** The gates in §12: working lawful conversion; a named, credible team; a pricing stance; real safety/protection; and, for category-leadership, the ownable differentiators built. Design and copy get it to 8; the rest is decisions, legal and operations.

**Continue, refine, or reconsider?** **Continue the direction, refine the surface, reconsider one thing in the model.** Continue: the identity, the proposition and the Travel Self are right — protect them. Refine: comprehension (homepage), conversion (register-interest), and trust (a named founder) — all achievable, most with copy that already exists. Reconsider one thing only: the **"three ways to travel"** as currently built — two of them are the same product today, and "sections as standalone departures" contradicts "sections as legs of one caravan." Decide whether the three ways are genuinely three and whether a section is a leg or a standalone, then narrate that decision consistently. Do not reconsider the core; it is the best thing here.

The site is a strong instrument and a strong voice wrapped around a funnel that does not yet work. Nothing in that sentence requires starting over. It requires finishing.

---

## Could not verify (carried forward)

Consolidated from passes 1–5, unchanged: real-world performance (LCP/CLS/INP) and any browser-run accessibility audit (axe/WAVE, zoom-200 %, focus order, screen-reader) — no browser available; the Travel Self result→journey handoff and any live form delivery — read from source, not exercised; live per-page fetches beyond the homepage and one section — inferred from the byte-current local build; competitor conversion internals; and any funder's actual reading — assessed against the eight lenses, not tested with a real partner. These bound every score above; where a dimension depended on them (performance, parts of accessibility), the score is stated as evidence-limited, not asserted.
