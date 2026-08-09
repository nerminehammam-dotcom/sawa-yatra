# Sawayatra — PASS 5: journeys, conversion, and funder readiness

**Basis:** the live-current build (confirmed in PASS 1), the 39-route crawl, and the four prior passes. New verification this pass: searched every crawled page for a named founder, host names, phone/address, safety/insurance wording and social proof. **Result, tested:** the only human identifier anywhere on the site is the address `nerminehammam@gmail.com` on `/contact`; "founder" appears only inside internal `PLACEHOLDER: Founder-approved…` labels; there are **zero** occurrences of insurance, evacuation, financial protection, ATOL/ABTA, refund or cancellation across all pages; and there is no testimonial, review or rating of the club (the "review" hits are all `LEGAL REVIEW` placeholders).

One thing governs this whole pass: the funnel has a **top and no middle or bottom.** Every prior pass found pieces of this; here it is as one picture.

---

## 1. The eight visitor journeys

Each row: entry · the visitor's real questions · what they need · recommended next step · exact CTA + destination · trust required · the likely failure point today · the repair (cross-referenced to the pass that specifies it in full).

### J1 — "I have never heard of Sawayatra."
- **Entry:** `/` (and, once indexable, a search result — today `noindex` means they cannot arrive by search at all).
- **Questions:** What is this? A tour company, a club, an app? Who is it for? What can I do?
- **Needs:** one plain sentence naming the category, the flagship, and the status.
- **Next step:** read "How it works" or open the Caravan.
- **CTA / destination:** **"Explore the Andean Caravan"** → `/caravans/andean`; secondary **"Meet your Travel Self"** → `/travel-self`.
- **Trust required:** enough to grant two minutes — a signal it is real and honest.
- **Failure point (tested):** the homepage opens with the name's etymology before saying what the thing is (PASS 1 C5); and the site is `noindex` + `robots: Disallow` live (PASS 3), so this visitor mostly cannot find it in the first place.
- **Repair:** the hero rewrite + section reorder (PASS 1 §2, §5.3) and `NEXT_PUBLIC_SITE_URL` (PASS 3 SEO).

### J2 — "I'm interested but don't know which model suits me."
- **Entry:** `/how-it-works`.
- **Questions:** What are my options? Which one is me?
- **Needs:** three genuinely different ways, each with a status.
- **Next step:** take the Travel Self, or pick a way.
- **CTA / destination:** the three rewritten cards (PASS 2 Page 1 §9) → `/caravans/andean`, `/journeys`, `/register-interest`.
- **Trust required:** that "three ways" are three, not one described twice.
- **Failure point (tested):** ways (1) "Caravan" and (2) "Join a Journey" both point at the Andean Caravan; way (3) is "Not yet available." A visitor asking "which suits me" finds two identical options and one that doesn't exist (PASS 2).
- **Repair:** differentiate the three ways with status chips (PASS 2 Page 1 §9).

### J3 — "I want to understand the Andean Caravan."
- **Entry:** `/caravans/andean`.
- **Questions:** Where, how long, how hard, how much, when, what's included, can I do part of it?
- **Needs:** the fact grid, the 71-day model, altitude, sections, price status — mostly present.
- **Next step:** explore a section, or ask.
- **CTA / destination:** section cards → `/departures/[slug]`; **"Ask about a section"** → `/contact`.
- **Trust required:** operational seriousness — supplied well by the who-we-are principles and the altitude honesty.
- **Failure point (tested):** group size contradicts across pages; no difficulty grade; transport unstated; "Ask" dead-ends ("delivery not connected").
- **Repair:** PASS 2 Page 2 §9 (name as H1, resolve group size, transport line, difficulty grade) + connect delivery (PASS 1 C2).

### J4 — "I want to compare its nine sections."
- **Entry:** `/caravans/andean` → the nine section cards.
- **Questions:** How do the sections differ in length, altitude, difficulty and character — and how do they connect?
- **Needs:** a comparable spec per section and a legible connection model.
- **Next step:** open sections, see adjacency.
- **CTA / destination:** **"View section"** → `/departures/[slug]`; the RouteStepper for adjacency.
- **Trust required:** that the sections genuinely chain into one route.
- **Failure point (tested):** you compare by opening nine pages — there is no side-by-side view; section pages carry no difficulty to compare on; and each section page contradicts itself on whether it is part of the Caravan (PASS 2). "View section →" is repeated ambiguous link text (PASS 3 A11y).
- **Repair:** the dual-nature chip across all nine (PASS 2 Page 3), a difficulty column (PASS 2/PASS 4), and Dragoman's **additive naming + chained hinge-city dates** so the parts visibly sum to the whole (PASS 4).

### J5 — "I'm travelling alone and want compatible company." *(the visitor Sawayatra is FOR)*
- **Entry:** `/` → `/travel-self` or `/how-it-works`.
- **Questions:** Will I be among strangers? How are people matched? Is it private and safe? Will I share a room? Does travelling alone cost me more? Who else is on my section?
- **Needs:** the matching model *and* the solo practicalities.
- **Next step:** take the Travel Self, register interest.
- **CTA / destination:** **"Meet your Travel Self"** → `/travel-self`; **"Register your interest"** → `/register-interest`.
- **Trust required:** that matching is real, privacy holds, and solo isn't penalised.
- **Failure point (tested) — and this is the sharpest strategic miss:** the site serves its **core audience** the philosophy of matching (the how-it-works consent flow, the Travel Self) but **none of the solo practicalities every competitor answers** — there is no rooming/single-supplement information anywhere (0 occurrences), no "who else is on this leg," and the Travel Self result does not visibly connect to "and here is how you'd sit against the Caravan or its travellers." The person most likely to convert gets the poem and not the plumbing.
- **Repair:** add a solo-practicalities block using the category-standard mechanisms from PASS 4 (no-cost same-gender share + a named single-room option, stated honestly); make the Travel Self result hand off to a journey (PASS 2 Page 4 §15); and specify the privacy-first "who's on this leg" surface as a **Coming later** concept (PASS 4 gap).

### J6 — "I want to take the Travel Self."
- **Entry:** `/travel-self`.
- **Questions:** What is this — a personality test? Is it private? How long?
- **Needs:** purpose, the "not a psychological test" boundary, privacy, time — all of which exist in the copy.
- **Next step:** take it → result → journey.
- **CTA / destination:** **"Find out →"** (the quiz).
- **Trust required:** that it is neither pseudoscience nor surveillance.
- **Failure point (tested):** the boundary disclaimer and rich framing are **not on the landing screen** — the first thing shown is the most diagnostic phrasing ("Which one are you?", "reveal which one is yours") without the qualifier (PASS 2 Page 4).
- **Repair:** surface the boundary line on the landing view; soften the three essentialist phrases; ensure the result links to a journey (PASS 2 Page 4 §9, §15).

### J7 — "I'm interested, but nothing is bookable yet." *(the primary conversion, today)*
- **Entry:** any page → `/register-interest`.
- **Questions:** How do I stay in the loop? What am I committing to? When can I actually book?
- **Needs:** a working capture, a "what happens next," and the timeline (February 2028).
- **Next step:** register interest — ideally per section.
- **CTA / destination:** **"Register your interest"** → `/register-interest`.
- **Trust required:** that leaving details does something.
- **Failure point (tested) — the single worst conversion failure:** the banner says "open for interest," the page says **"Registration is coming soon"** and offers only a `mailto:`; four parallel capture flows exist and **none deliver** (PASS 1 C2, C6). The one visitor who is ready to convert cannot.
- **Repair:** one working interest capture on the existing Resend adapter, and a per-section **"Hold my interest in this section"** (no money, named state) modelled on G Adventures' "Save my spot" (PASS 1 C2/C6 + PASS 4). Until delivery is on, banner and CTA both read "Register your interest (opens soon)."

### J8 — "I'm a partner or funder evaluating the project."
- **Entry:** `/` → `/who-we-are` → `/partners`.
- **Questions:** What problem, what market, what's the differentiation and model, what's real vs planned, who's behind it, is it serious, how do I engage?
- **Needs:** a compact problem/market/model/proof/status/founder/next-action.
- **Next step:** a partner/contact path.
- **CTA / destination:** `/partners` ("coming soon") or `/contact` (gmail).
- **Trust required:** operating seriousness **and a credible human**.
- **Failure point (tested):** `/partners` is a "coming soon" shell; there is **no named founder, no team, no operating-model or "what's real vs planned" statement, and contact is a personal Gmail**. The funder gets the (genuinely good) editorial "field document" and nothing on team, model, traction or how to engage.
- **Repair:** see Funder readiness below — this belongs on a **separate, lightly-linked partner surface, not the traveller funnel.**

---

## 2. Conversion and trust audit

| Item | Verdict (tested) | Repair |
|---|---|---|
| **Primary CTA** | Ambiguous and self-defeating. The header's "Register your interest" is the most prominent CTA and it **dead-ends** against its own "coming soon" page. | Make it deliver, or relabel "(opens soon)"; make "Explore the Andean Caravan" the primary until then (PASS 1 §5.5). |
| **Secondary CTA** | "Meet your Travel Self" and "Explore the Andean Caravan" — both good, both to live pages. | Keep. |
| **Competing CTAs** | Yes — header "Register your interest" + two equal hero CTAs ("See how it works" / "Explore the Caravan") + "Sign in" = four competing calls with no ranked primary. | One ranked hierarchy (PASS 1 §5.5). |
| **Registration-of-interest journey** | Broken. Banner/page contradiction; mailto only; four parallel flows, none deliver. | One working capture (PASS 1 C2/C6). |
| **Form friction** | Moderate but moot while nothing delivers. `/request-invitation`: name, email, country, travel-interest + a **mock consent box that admits it isn't consent**. `/contact`: name, email, question, journey-context. | Consolidate to one form; remove the mock-consent box until real wording exists (PASS 1 C3). |
| **Trust signals** | Strong on *editorial honesty* (the who-we-are principles; the altitude candour; "no payment is taken here"). Absent on *conventional* signals. | Keep the honesty; add the missing human + protection lines below. |
| **Founder presence** | **None.** Only a Gmail address. No name, photo, bio, or credentials anywhere. | A named founder with a short, credible bio on `/who-we-are` (PASS 1/2). This is the highest-leverage trust fix and it needs no legal review. |
| **Host / guide credibility** | "A Sawayatra Host meets you" — **no names, no bios, no evidence.** | Name the host model and, when real, the people; describe what a Host does and is qualified for. |
| **Operational evidence** | Genuinely present in one respect: the photography is her own, made on the route ("Every photograph on this site was made on this route") — a real, evidenced claim. Otherwise: no company registration, no secured dates ("announced when the route is secured" ⇒ not yet secured), no track record. | Keep the provenance claim; state the operating entity and the "what's secured vs planned" honestly. |
| **Contact information** | A personal `@gmail.com` only. No phone, no address, no company, no response-time. | `hello@` on the domain; a stated response expectation. |
| **Safety information** | **None.** Zero mentions of insurance, evacuation, medical, or safety protocol. Altitude *conditions* are described well, but not what happens if something goes wrong. | A safety/what-protects-you block (some blocked on legal; the altitude/acclimatisation stance is not and can be stated now). |
| **Data / privacy explanation** | Honest at the form ("sent by email, not stored on this website") but `/privacy` is a `LEGAL REVIEW` placeholder. | Commission the policy (blocked on solicitor); until then, do not collect personal data behind a self-declared non-consent box. |
| **Terms / policies** | `LEGAL REVIEW` placeholder. | Same dependency. |
| **Inclusions / exclusions** | Partial. "What is included" says "Complete operating inclusions will be confirmed before enquiries open." No exclusions list. | Once decided, an included/not-included list — the "not included" list is where trust is won (PASS 4). |
| **Pricing transparency** | Honest but bare: "Price on request" everywhere, "no payment taken here." | A per-person-per-day rate or a from-figure with basis, and a whole-vs-parts saving once priced (PASS 1/4). Your decision. |
| **Status transparency** | Mostly excellent and better than the category — *undercut* by the register-interest contradiction and "Available now" on how-it-works. | Resolve those two (PASS 1 C2, PASS 2). |
| **Social proof** | None. Correct for pre-launch, and the brief forbids inventing it. | Do not fabricate. When real, use named/dated reviews (PASS 4). |
| **Partner credibility** | `/partners` is "coming soon." | Separate partner surface (below). |
| **Are claims evidenced?** | The strongest claim — the photographs are the founder's, made on the route — **is** evidenced. No overclaiming found on the Caravan or Travel Self (the latter is scrupulously guarded). The unevidenced gaps are *absences* (no team, no protection), not false claims. | Fill the absences honestly; keep the no-overclaim discipline. |

---

## 3. Funder readiness

A partner or funder landing on the site today **cannot** assemble the picture they need — and, given the TRAVELLER-FIRST decision, **most of it should not be forced onto the traveller pages.** Verdict per question:

| Can a funder understand… | On the site today? | Where it should live |
|---|---|---|
| The **problem** being solved | Partially — implied by "match by how you travel," never stated as a problem. | A one-line problem statement is fine on `/who-we-are`; the framed version belongs on a **partner page**. |
| The **target market** | No. "Traveller-first" and "no age positioning" are correct for travellers but leave a funder without a market definition. | **Partner page** (do not put a market-sizing frame on the traveller site — it breaks the register). |
| The **differentiation** | Partially — "how, not where" and mutual-consent are visible; their novelty vs competitors is not argued. | Traveller site carries the *feeling* of difference; the *argued* differentiation (PASS 4 evidence) belongs on the **partner page**. |
| The **operating model** | No. How money is made, who operates the ground product, the membership economics — none stated (correctly; it would harm the traveller read). | **Partner page / deck.** |
| The **flagship proof of concept** | **Yes — this is the strongest funder asset on the site.** The Andean Caravan page, the nine sections, the altitude honesty and the on-route photography read as a serious, specific, real product. | Keep on the traveller site; **link a funder to it.** |
| **What is currently real vs to-be-built** | Partially — the status honesty shows it per feature, but there is no single "here is what exists / what is next" statement a funder can read in one place. | A **partner page** "state of build" section; the per-feature status stays on the traveller site. |
| **Revenue logic** (no invented projections) | No. | **Partner page / deck** — and per the brief, *no invented numbers*; state the model, not a forecast. |
| **Safety and responsibility** | No (see audit). | Some on the traveller site (safety), the governance/responsibility framing on the **partner page**. |
| **Founder credibility** | **No — the critical gap.** No named human anywhere. | A named founder belongs on **`/who-we-are`** (travellers need it too) *and* on the partner page with fuller credentials. |
| **Partnership opportunities** | No — `/partners` is empty. | The **partner page** is exactly this. |
| **The next concrete action** | No — a funder's only route is a personal Gmail. | A **"For partners — get in touch"** action on the partner page, to a real address. |

**Recommendation (structural, not on the traveller funnel):** build **one `/partners` page** (repurpose the existing empty route) written for the investor/tourism-body/sponsor lens, containing: the problem in one paragraph; the market in one; the differentiation argued against the category (PASS 4); the operating model in plain terms; a "state of build — real vs next" list; the founder with credentials; a responsibility/safety stance; and one contact action to a real address. Keep it **out of the primary nav** (footer link + `/partners` URL), so it never competes with the traveller journey. Everything a funder needs that is *also* good for travellers — the founder's name, the flagship, the status honesty — lives on the traveller site; everything that would break the traveller register — market sizing, revenue logic, projections — lives only here. **Do not** put a deck's worth of business framing on the homepage; that is the one change that would damage the traveller experience the brief protects.

---

## Findings grouped (this pass)

**Confirmed problems:**
- The conversion funnel is rung-zero-only and the primary CTA contradicts the banner (J7 / audit) — Critical.
- No founder / no named human anywhere (audit, J8) — High, and cheap to fix.
- The core audience (solo, matching) gets philosophy but no solo practicalities (J5) — High.
- `/partners` empty; no funder-legible model or next action (J8) — High for that lens, correctly off the traveller funnel.
- No safety/insurance/protection information (audit) — Medium (part legal-blocked, part not).

**Probable, need verification:** whether the Travel Self result hands off to a journey (J6, code-read only — PASS 2 CNV); whether any interest form would deliver once configured (PASS 1 C2, not exercised).

**Strategic opportunities:** the flagship is a strong funder proof-of-concept — *link* funders to it rather than rebuild it; the Travel Self → journey handoff is the conversion spine that is one link away from existing; a single honest `/partners` page carries the entire funder lens without touching the traveller read.

**Matters of subjective taste:** whether the who-we-are "field document" voice is too oblique for a funder — I think it is *right* for travellers and *insufficient alone* for funders, which is why the partner page is a separate surface, not a rewrite of this one.

---

## Scores

| Dimension | Score | One-line justification |
|---|---|---|
| **User experience** | **5** | Careful IA, clean redirects and good wayfinding, undermined by half the nav pointing at "coming soon," an empty `/start-here`, and a primary conversion that dead-ends. |
| **Conversion and trust** | **3** | Only the top of the funnel exists and the primary CTA contradicts the banner; trust rests on real editorial honesty but has no named human, no protection, no working delivery. |
| **Content and editorial quality** | **8** | The strongest dimension — the who-we-are field document, the Travel Self writing, the section editorial and the altitude candour are genuinely distinctive and honest. |
| **Visual identity and art direction** | **8** | Distinctive, coherent and category-ahead — warm paper, an enforced palette, own on-route photography, editorial type; held off 9 by a homepage that leads with words over image and a static route map. |

---

## Could not verify (this pass)

1. **Whether the Travel Self result screen links onward to a journey** — read from source, not stepped through in a browser.
2. **Whether a configured interest form would actually deliver** — the adapter exists and was unit-tested; not exercised end-to-end against a live Resend account.
3. **Any funder's actual reading** — assessed against the eight lenses, not tested with a real partner.
4. **The operating entity, secured dates, and safety arrangements** — absent from the site; I state their absence, not that they don't exist off-site.
5. **Runtime/interactive conversion behaviour** (form validation, the quiz-to-result-to-journey path) — no browser, per PASS 3.

---

*This completes the five-pass audit (strategy/IA/homepage · page-by-page batch 1 · technical/accessibility · competitors · journeys/conversion/funder). Page-by-page batches 2–5 remain to cover every public page at PASS-2 depth; say the word and I will continue without skipping any.*
