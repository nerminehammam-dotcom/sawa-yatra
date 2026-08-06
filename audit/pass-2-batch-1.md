# Sawayatra — PASS 2, batch 1: page by page

**Pages in this batch:** `/how-it-works` · `/caravans/andean` · `/departures/desert-coast` · `/travel-self`
**Why these four:** they carry the three special sub-rubrics — the travel model, the product/journey pages (×2), and the Travel Self. **Route list was left as a placeholder in the brief; I chose the highest-value four.** Next batches, in suggested order: (2) `/` + `/who-we-are` + `/members` + `/caravans/andean-caravan/how-it-works`; (3) the eight remaining section pages; (4) `/joining-points` + `/register-interest` + `/contact` + `/sign-in`; (5) the coming-soon shells + legal. Tell me to proceed and I will not skip any.

**Method:** live production confirmed to be the current build (PASS 1). Page content read from the served build; the Travel Self quiz is client-rendered and invisible to a crawler, so its questions, sixteen families, motivation lines and passions were read from source (`content/travel-self/*`) to audit them sentence by sentence.

Two cross-page factual inconsistencies surfaced in this batch and are called out at the top because they are not the fault of any single page:

- **Group size disagrees three ways.** Your brief says "maximum 12 travellers." `/caravans/andean` says "12 travellers at most points; up to 16 on four flexible sections." `/departures/desert-coast` says "Up to 16 travellers" with no explanation. A visitor comparing the two sees a contradiction, and both contradict the brief. **Decide the true number and the true exception, then state the exception wherever the higher number appears.** (Dependency: yours.)
- **"Section" means two contradictory things on the same page.** `/departures/desert-coast` shows a breadcrumb "The Andean Caravan › All route sections › Desert Coast" and a stepper "Section 1 of 9 … joined end to end," and *also* an `h2` reading "A separate departure, not a place on the annual Caravan." Both are on the one page. This is the single most damaging comprehension fault in the batch.

---

## Page 1 — `/how-it-works`

**1. Apparent purpose.** Explain the arrangement: browse openly, connect privately; the three ways to travel; the Travel Self; the mutual-consent privacy model.

**2. Intended primary audience.** A first-time visitor deciding *how the thing works* before committing attention. Traveller-first.

**3. Primary action.** Understand the model, then "Explore the Andean Caravan." Secondary: begin a Travel Self.

**4. What works.**
- The opening promise is the clearest sentence on the whole site: "Browse the Andean Caravan openly. Connect privately. Nothing is revealed until the interest is mutual." Keep it verbatim.
- The privacy section ("Your interest remains private") with the four-step flow (Find a journey → Express interest privately → Both members opt in → Connect and plan) explains mutual consent better than any competitor page I read in PASS 1.
- Honest status on the third way: "Not yet available."

**5. What fails.**
- **The three ways collapse into two.** "Caravan" and "Join a Journey" are the same product: the Join-a-Journey card reads "Available now: the Andean Caravan, with nine consecutive sections." Your brief defines way (2) as "Discover or Join Journeys With Others" — joining *other members'* journeys — which is distinct from the Caravan. As written, ways (1) and (2) point at the identical thing, so the page teaches a visitor that "three ways" is really "one way, described twice, plus a future one."
- **Status is inconsistent across the three cards and collides with the site-wide status.** Card 1 (Caravan) has no status label; card 2 says "Available now"; card 3 says "Future membership pathway … Not yet available." "Available now" contradicts the site-wide truth that nothing is bookable — a visitor cannot tell whether "available now" means "bookable now" (it is not) or "readable now."
- **An unattributed maxim is presented as authority:** "People don't browse people. They browse journeys." No source, no speaker. It reads as borrowed gravitas.
- **Internal state-machine vocabulary is exposed:** "Planned interest states: Interest sent · Awaiting response · Interest accepted · Introduction opened · Not moving forward." These are back-end status names; to a visitor they are noise.

**6. What is missing.** A single opening sentence that says what Sawayatra *is* before "how it works." The page assumes you already know it is a members' club. (This is the same gap as the homepage; the fix is one shared sentence.)

**7. Score: 7** — strong and clear on privacy, but the three-ways collapse and the "available now" status ambiguity undercut the page's core explanatory job.

**8. Ideal section order.**
1. One-line "what Sawayatra is" (shared with homepage).
2. The promise: "Browse openly. Connect privately." (keep)
3. Three ways to travel — differentiated, each with a status chip.
4. Meet your Travel Self.
5. Your interest remains private (the four-step flow). (keep)
6. Next step.

**9. Exact copy changes.**

- Opening line, new, above "A simple arrangement":
  > **Sawayatra is a members' travel club. You are matched with people who travel the way you do — then you choose a journey together.**

- The three cards, rewritten so they are genuinely three, each with a status chip:
  > **Caravan — the Andean Caravan** `Open for interest`
  > Join one section, combine several, or travel the whole 71-day route. One departure a year.
  > *Explore the Andean Caravan →* `/caravans/andean`
  >
  > **Join a member's journey** `Coming later`
  > Shorter journeys proposed by Sawayatra and, in time, by members. Browse them by how they travel, express interest privately.
  > *See what's coming →* `/journeys`
  >
  > **Create your own** `Coming later`
  > Propose a destination, dates and a way of travelling, and invite compatible members to join you.
  > *Ask about future access →* `/register-interest`

- Replace the unattributed maxim "People don't browse people. They browse journeys." with a first-person statement of the rule:
  > **You browse journeys, never people. A name appears only when two people have both said yes.**

- Delete the "Planned interest states" list from the page. If a status preview is wanted, show it as the traveller sees it, not as system labels: "You will always know where your interest stands: sent, accepted, or closed."

**10. Design and layout changes.** Give the three cards *equal visual weight but unequal status colour*: the status chip is the differentiator. Use the existing palette — `Open for interest` on `--sun`, `Coming later` on `--pink` — never invent a new colour (pairing table governs this). **Usability, not taste:** a visitor must be able to tell operational from planned in one glance, which the current uniform cards prevent.

**11. Technical changes.** The card statuses should be driven by a single `status` field per "way" in `content/`, not hard-coded per card, so the chip and the CTA destination cannot drift out of sync. Confirming test: a unit assertion that every "way" resolves to exactly one taxonomy value.

**12. Accessibility changes.** The four-step privacy flow is currently a visual sequence; ensure it is an ordered list (`<ol>`) so a screen reader announces "step 1 of 4." The status chips must not encode status by colour alone — the word ("Open for interest") must be in the text, which it is; keep it.

**13. What to remove.** The "Planned interest states" system-label list; the unattributed quote.

**14. What must be preserved.** "Browse the Andean Caravan openly. Connect privately. Nothing is revealed until the interest is mutual." The four-step consent flow. The "Not yet available" honesty.

**15. Connection to the next step.** Ends by sending a ready visitor to `/caravans/andean` (primary) or `/travel-self` (secondary). Both destinations exist and are strong; the handoff is sound once the card CTAs above are wired.

---

## Page 2 — `/caravans/andean` (product page)

**1. Apparent purpose.** The flagship page: explain the 71-day continuous Caravan and its nine sections, and let a visitor decide whether it suits them.

**2. Intended primary audience.** A prospective traveller weighing the whole journey or a section; also the investor lens assessing operational seriousness.

**3. Primary action.** Read the route, pick a section to explore, and ask about it.

**4. What works.** This is the strongest page on the site and it does most of the product sub-rubric properly:
- **71-day continuous model, explained:** "one moving journey from the Pacific coast of Peru to the end of the road in Patagonia, and then by a different northbound return to the final flight home." Clear.
- **Fact grid up top:** Complete route 71 days · Sections 9 · Group · Price. This is the convention PASS 1 recommended, and it is already here.
- **Nine sections**, each with Route, Time, Join/leave, Date — a genuine comparison table.
- **Joining & leaving logic**, a dedicated block.
- **Physical demands and altitude — genuinely good and honest:** "rises from sea level to 4,900 metres over five weeks, with a restorative descent into the Yungas. The Lagunas crossing uses simple high-altitude refuges with shared bathrooms and limited heating. Amantaní is a family stay. Tortel has no streets, and luggage must be carried along boardwalks and stairs." This is the acclimatisation-and-conditions honesty most Andean operators omit.
- **Price status, honest:** "Price on request. No payment or booking is taken through this site."
- **Availability language, consistent:** "February 2028 · exact dates announced when the route is secured."

**5. What fails.**
- **Group size:** "12 travellers at most points; up to 16 on four flexible sections" contradicts the brief ("maximum 12") and the section pages ("Up to 16"). See the cross-page note. This is a trust problem on the one figure a serious traveller checks.
- **No difficulty grade.** Altitude and conditions are described in prose, but there is no single at-a-glance rating, so a reader has to already know what 4,900 m and "simple refuges" mean for them. (PASS 1, S-item; needs your scale.)
- **Transport is barely stated.** Accommodation appears in fragments ("refuges," "family stay"); transport between sections is not stated at all. A 71-day overland journey's mode of travel is a top-three question and it is unanswered.
- **Title hierarchy:** the visible `h1` is "Choose where the road becomes yours." with an eyebrow "Departures"; the product's actual name, "The Andean Caravan," is an `h2` below. A first-time visitor's eye and a search engine both take the `h1` as the page's subject, and "Choose where the road becomes yours" is a slogan, not a subject.

**6. What is missing.** A one-line transport statement; a difficulty grade; and an explicit "you can take one section on its own" line at the top (it is implied by the section cards but not stated in the fact grid).

**7. Score: 8** — strong, honest, and already carries most of the product rubric; held back by the group-size contradiction, the missing difficulty grade and the absent transport line.

**8. Ideal section order.** Largely keep it. One change: promote "The Andean Caravan" to the `h1` and demote the slogan to a standfirst. Order: H1 name + fact grid → the 71-day model paragraph → nine sections → joining/leaving → dates → what's included → physical demands + altitude + **difficulty grade** → **transport & accommodation** → price status → next step.

**9. Exact copy changes.**
- `h1`: **"The Andean Caravan"**, with the current line demoted to standfirst: *"Choose where the road becomes yours. Join for one section, combine several, or travel until the road ends."*
- Group-size fact (once you decide the number). If the true maximum is 12 with four larger sections, state the exception in the fact itself: **"12 travellers, up to 16 on four flexible sections — [name them]."** If the true maximum is 12 everywhere, change the section pages to match. Do not leave "up to 16" unexplained on section pages.
- New transport line under "What is included": **"How you travel: [private vehicle / internal flights on the four named legs / train on the Titicaca section]. Every joining gate connects to an airport."** (Bracketed facts are yours to confirm — I will not invent the transport mode.)
- Difficulty grade, once you supply a scale: a one-line **"Effort: [n] of [m] — [word]"** in the fact grid, linked to a scale page. (Dependency: your grade per section.)

**10. Design and layout changes.** None to the visual system — it works. The only layout change is promoting the name to `h1` (above). Keep the fact grid, the section cards, the map, the warm ground, the photography treatment.

**11. Technical changes.** The group-size string is currently authored per place; make it one field in `content/andean-caravan.ts` referenced by both the overview fact grid and the section fact strips, so the two can never disagree again. Confirming test: assert the section fact strips and the overview cite the same group value (or the section carries the documented exception). This is the same class of fix as the pairing/alt tests already in the suite.

**12. Accessibility changes.** The nine section cards are link cards; confirm each is a single focusable link with an accessible name that includes the section number and title ("Section 1, Desert Coast"), not just "View section →" (which is what the current repeated link text suggests). Repeated "View section →" links are ambiguous to a screen-reader user listing links.

**13. What to remove.** Nothing. This page earns its length.

**14. What must be preserved.** The 71-day model paragraph; the fact grid; the nine-section comparison; the altitude-and-conditions honesty; the "no payment or booking is taken through this site" line; the map; the photography.

**15. Connection to the next step.** Each section card → its section page; the page foot → "Ask about a section." Sound. Once delivery is connected (PASS 1 C2), the "Ask a question" endpoint stops being a dead end.

---

## Page 3 — `/departures/desert-coast` (section / journey page)

**1. Apparent purpose.** Present one section (Desert Coast, Lima→Arequipa) both as a leg of the Caravan and as a journey a visitor could take alone.

**2. Intended primary audience.** A prospective traveller deciding on this section specifically.

**3. Primary action.** Understand the section, move to the next/previous, or ask about it.

**4. What works.**
- Fact strip under the title: Duration 9 days · Route · Altitude "Sea level, rising to 2,335 m on the final day" · Group · Season · Price. The PASS 1 recommendation is already implemented here.
- The photographs, captions ("Lima, Peru · 2025") and the provenance line ("Every photograph on this site was made on this route") are the site's strongest editorial asset.
- The RouteStepper at the foot ("Section 1 of 9 · The road begins · Continues to White City, Deep Canyon") is genuinely good wayfinding.
- Alt text is specific and correct (audited in the craft pass).

**5. What fails.**
- **The page contradicts itself on the one thing a section page must settle.** Breadcrumb and stepper frame it as "Section 1 of 9" on the Caravan, "joined end to end." The `h2` "A separate departure, not a place on the annual Caravan" says the opposite. A visitor cannot tell whether booking Desert Coast means joining the 71-day Caravan at Lima or taking a standalone 9-day trip. This is the section-vs-standalone collapse from PASS 1, live and self-refuting on one page.
- **Group "Up to 16 travellers"** — unexplained, contradicts the Caravan page and the brief.
- **"Ask about this section" is a dead end:** "Online delivery is not connected yet." Honest, but the section's only conversion action does not work.

**6. What is missing.** A single, unambiguous statement of the section's dual nature, and the transport line (as on the parent page).

**7. Score: 6** — the structure, facts and photography are strong, but the internal contradiction about what a "section" *is* is a comprehension failure a first-time visitor will hit within one screen.

**8. Ideal section order.** Title + one-line dual-nature chip → fact strip → photographs → why this section exists → the shape of the journey → what makes it distinct → the stepper → ask. (Drop the standalone-vs-caravan `h2` as a separate contradictory block; fold its true content — the wider standalone season — into the fact strip.)

**9. Exact copy changes.**
- Directly under the title, one chip replacing the contradiction:
  > **Section 1 of 9 on the Andean Caravan. Can also be travelled on its own, on its own season.**
- Delete the `h2` "A separate departure, not a place on the annual Caravan." Keep its only real fact by moving it into the fact strip as a second season row:
  > **Season** — On the Caravan: February 2028. On its own: December–March, when the coast escapes the garúa fog.
- Group fact: apply the resolved number (cross-page note). If Desert Coast is one of the "flexible" larger sections, say so: **"Group — up to 16 on this section (12 on the core Caravan)."**

**10. Design and layout changes.** None to the system. The one layout change is replacing the contradictory `h2` block with the single chip under the title, so the dual nature is stated once, at the top, not argued across two blocks.

**11. Technical changes.** Same shared group-size field as the parent page. The "dual nature" chip should be a shared component across all nine section pages, driven by section data, so the framing is identical everywhere and cannot drift into "a separate departure, not a place on the Caravan" on one page and "Section n of 9" on another.

**12. Accessibility changes.** Confirm the breadcrumb is a `nav` with `aria-label="Breadcrumb"` and the current page is marked `aria-current="page"` (PASS 1 saw this markup on the complete page; confirm on sections). The stepper's terminus states ("The road begins," "The end of the road") must be non-link text, not disabled links — a disabled link is a focus trap and a screen-reader ambiguity; render them as plain text (the shipped RouteStepper already does this — keep it).

**13. What to remove.** The `h2` "A separate departure, not a place on the annual Caravan" as a standalone contradictory block.

**14. What must be preserved.** The fact strip; the photographs, captions and provenance line; the RouteStepper; the "why this section exists / the shape of the journey / what makes it distinct" editorial structure.

**15. Connection to the next step.** The stepper → next/previous section and the whole route; the foot → "Ask about this section." Sound once delivery is connected. The dual-nature chip also resolves the reader's "is this the Caravan or a standalone?" question before they decide to ask.

---

## Page 4 — `/travel-self` (the Travel Self)

This page gets the Travel Self sub-rubric. The short version: **it is the strongest, most carefully-guarded thing on the site, and I am not going to manufacture severity to balance that.** The overclaiming defences are better than the brief demands. There is one real, specific problem: the defences are not on the first screen.

**1. Apparent purpose.** Let a visitor produce their "Travel Self" — a portrait of how they travel — used later to compare journeys and, eventually, travelling companions.

**2. Intended primary audience.** A visitor curious enough to try it; and, structurally, anyone about to express interest in a journey.

**3. Primary action.** Take the eight-question quiz ("Find out →").

**4. What works.**
- **Clarity of purpose (source copy):** "Sawayatra is a members' travel club that matches travellers by how they travel, not by age, not by destination. The Travel Self is how that works." Exactly right.
- **The overclaiming guard is excellent** (in `content/travel-self/copy.ts`): "It is not a compatibility score." "No number can tell you whether nine days with a stranger will work, and we would rather say so than pretend." And the boundary: **"The Travel Self is not a psychological test. It compares what travellers have said about how and why they travel. It cannot predict whether two people will get along."** This is the correct posture, stated plainly.
- **Privacy explanation is strong and stated twice:** "Your answers are saved in this browser when you finish, and they are not sent to Sawayatra," and "Names stay private until interest runs both ways."
- **Scoring transparency is promised:** "Nothing used to make the comparison is hidden from you," "Where two ways of travelling differ, we name the difference and explain why it matters."
- **Question design is genuinely considered:** five axes on a six-point slider with *no middle* — and the reason is given: "It depends is true of very nearly everyone, and it is the one answer that tells us nothing." The passions ("choose three… never scored, never counted against you") and the time-together question ("shapes the group, not the comparison") are correctly separated from the scored axes.
- **Archetype credibility:** the sixteen families (The Seeker, The Naturalist, The Convener…) are written about *travel behaviour*, not character, and are plausible without being astrology.

**5. What fails.**
- **The guardrails are not on the landing screen.** The live `/travel-self` first view shows only: "Which one are you? One of sixteen travelling selves. Eight short questions reveal which one is yours: how you travel, and what you travel for… Find out →." The boundary statement ("not a psychological test… cannot predict") and the rich standfirst live in `copy.ts` and render *inside* the quiz flow, not on first contact. So the first screen carries the **most** diagnostic phrasing ("reveal which one is yours," "Which one are you?") **without** the disclaimer that qualifies it.
- **Two phrases edge toward diagnosis and should be softened** (flagged per the sub-rubric):
  - **"Which one are you?"** (the `h1`) and **"reveal which one is yours"** — both imply a true hidden type the quiz uncovers. That is the essentialist framing the brief warns against.
  - **"Your self is settled."** (`narrowingSettled`) — "your self is settled" asserts a fixed nature.
- **Mild imprecision:** "Eight short questions reveal which one is yours" — only four of the eight (pace, planning, social, rhythm) determine which of the sixteen; comfort, passions, time-together and the follow-up enrich the portrait but do not pick the family. Harmless, but "eight questions reveal which one" slightly overstates the mechanism.

**6. What is missing.** The boundary disclaimer on the landing screen, before "Find out →." Everything needed already exists in `copy.ts`; it is a placement fix, not new writing.

**7. Score: 8** — the strongest asset on the site and the best overclaiming guard I have seen in this genre; one point off for surfacing the diagnostic framing before the disclaimer, and for the two essentialist phrases.

**8. Ideal section order (landing view).** Standfirst (what it is + "not by age, not by destination") → the two asks ("How do you travel? / What do you travel for?") → the boundary line (one sentence, visible) → privacy line → "Find out →."

**9. Exact copy changes (the overclaiming rewrites, written in full).**
- `h1` "Which one are you?" → **"How do you travel?"** (This is the actual question the instrument asks, and it removes the "which type are you" essentialism. Keep "Meet your Travel Self" as the page title/eyebrow.)
- Landing standfirst, replacing "One of sixteen travelling selves. Eight short questions reveal which one is yours" →
  > **Eight short questions about how you move through a journey and what draws you to a place. Answer them once, and every journey on the site reads differently against your own way of travelling.**
- Add the boundary sentence to the landing view, directly above "Find out →," verbatim from your own copy:
  > *The Travel Self is not a psychological test. It compares what travellers have said about how and why they travel. It cannot predict whether two people will get along.*
- `narrowingSettled` "Your self is settled." → **"That's your Travel Self."**
- Where the family result appears, keep "Essence" if you like it, but ensure the result screen repeats the boundary line once (it should be visible with the archetype, not only before the quiz). Recommended one-liner beneath the archetype name:
  > *A way of travelling, not a personality. You can change it whenever it changes.*

**10. Design and layout changes.** None to the visual system — the poster, the sliders and the sixteen-tile treatment are on-brand and were already improved in the craft pass. The only change is surfacing the boundary line on the landing view (a text placement, not a redesign).

**11. Technical changes.** The boundary string already exists (`TRAVEL_SELF_COPY.boundary`); render it in the landing component and in the result component, not only in the questionnaire intro. Confirming test: assert `boundary` text is present in the server-rendered `/travel-self` HTML and in the result view. (The result view is client-rendered; assert it in the component test.)

**12. Accessibility changes.** The six-position slider must be operable by keyboard with clear labels — each position already has a strength label ("Strongly / Clearly / Slightly"); confirm each radio has an accessible name combining strength + pole ("Strongly — Slow"), which the shipped questionnaire does via `aria-label`. Confirm the "no middle" design does not leave a keyboard user unable to express "no answer": there must be a way to move past a question or a stated requirement to choose, announced to assistive tech.

**13. What to remove.** The essentialist phrasings above ("Which one are you?", "reveal which one is yours," "Your self is settled") — replaced, not deleted, per §9.

**14. What must be preserved.** Every guard sentence ("not a compatibility score," "not a psychological test," "cannot predict whether two people will get along," "not sent to Sawayatra"). The no-middle slider and its stated rationale. The passions-are-never-scored separation. The sixteen families' copy. This is the site's best writing; touch only the placement and the three flagged phrases.

**15. Connection to the next step.** After the result, the Travel Self should link to the Caravan ("see how the Andean Caravan reads against your Travel Self") and to registering interest — the instrument's whole purpose is to make journeys "read differently," so the result must hand off to a journey. Confirm the result screen offers that link; if it dead-ends at the archetype, add it.

---

## Findings grouped (this batch)

### Confirmed problems
- **Section-vs-standalone contradiction on `/departures/desert-coast`** (and by inheritance all nine section pages). Score 4, High. Repair in Page 3 §9.
- **Group size contradicts across `/caravans/andean`, the section pages and the brief.** Score 4, High. Repair in the top note and Page 2 §9.
- **The "three ways to travel" collapse to two on `/how-it-works`.** Score 5, High. Repair in Page 1 §9.
- **Travel Self overclaiming guard absent from the landing screen; two essentialist phrases.** Score 8 (page is strong; this is the one real fault), Medium. Repair in Page 4 §9.
- **"Available now" status on `/how-it-works` collides with site-wide "not bookable."** Score 5, Medium. Repair in Page 1 §9.

### Probable problems needing technical verification
- **Section pages' "Ask about this section" and the Caravan's "Ask a question" both dead-end** ("Online delivery is not connected yet"). Confirmed copy; the *repair* (connect Resend) is the PASS 1 C2/C6 item. Verify by submitting once delivery is on.
- **Repeated "View section →" link text** on `/caravans/andean` — likely ambiguous to screen readers; verify with a screen reader or an accessible-name check, then give each the section title (Page 2 §12).

### Strategic opportunities
- **Make the three ways genuinely three.** Differentiating way (2) "Join a member's journey" from way (1) "the Caravan" is the single change that would make the product structure legible — and it is a copy + status-chip change, not new product.
- **One shared "dual nature" chip across all nine section pages**, driven by data, ends the section-vs-standalone confusion permanently and cheaply.
- **The Travel Self is the conversion asset.** It is the only live, distinctive, backend-free interaction and it is genuinely well-made; it should be second on the homepage (PASS 1 S2) and its result must hand off to a journey.

### Matters of subjective taste
- `h1` "Choose where the road becomes yours." vs the literal "The Andean Caravan." I argue (Page 2) that the product name should be the `h1` on functional grounds (first-contact comprehension + SEO subject), not taste — but reasonable people could keep the slogan as `h1` with the name as a strong standfirst. Labelled so you can decide.
- The sixteen family names and their prose are a matter of voice; I would change none of them.

---

## Scores (this batch)

| Page | Score | One-line justification |
|---|---|---|
| `/how-it-works` | **7** | Clearest privacy explanation on the site; undercut by the three-ways collapse and the "available now" status ambiguity. |
| `/caravans/andean` | **8** | Strong, honest product page carrying most of the product rubric; held back by the group-size contradiction and missing transport + difficulty. |
| `/departures/desert-coast` | **6** | Excellent facts, photography and wayfinding, sabotaged by a self-contradiction about what a "section" is. |
| `/travel-self` | **8** | The site's best asset and the best overclaiming guard in the genre; one point off for hiding that guard behind the diagnostic landing framing. |

---

## Could not verify (this batch)

1. **The Travel Self result and questionnaire screens** were read from source (`content/travel-self/*`), not exercised in a browser — the scoring animation, the passport result layout, and whether the result hands off to a journey were assessed from code, not observed running.
2. **Whether the boundary disclaimer renders anywhere in the live quiz flow** (it exists in `copy.ts`; I confirmed it is *not* on the landing view, but did not step through the live quiz to see where it does appear).
3. **The "flexible sections" claim** — the Caravan page says four sections allow up to 16; I did not confirm which four, or whether the section pages that say "up to 16" are those four. This is part of the group-size decision that is yours.
4. **Transport mode** — not stated on any page I read; I did not find it in the section data either. Flagged as missing, not asserted as absent from the operation.
5. **Screen-reader behaviour** of the section cards and the slider — inferred from markup, not run through assistive tech.
