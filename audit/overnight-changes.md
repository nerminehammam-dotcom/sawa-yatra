# While you were asleep — 7 August 2026

I worked through the no-decision batch and then swept the whole site for anything else safe to fix without you. **Nine commits.** Every one was verified against types, lint, the full test suite (now **159 tests, all passing**) and a production build, and each is a separate commit so you can review or revert any single change cleanly.

Nothing here needed a decision from you, and I touched **nothing** that did — the hero, the group-size number, your Travel Self headline, the founder's identity, the price, the legal copy and the search-visibility switch are all untouched and waiting for you (list at the end).

---

## What changed (in the order I'd review it)

**1. The homepage now leads with what Sawayatra is, not the etymology.** `65b500f`
Your proposition — *"Sawayatra is a new way to travel. A way to find people who share not just your destination, but your pace, your curiosity… We call it your Travel Self"* — was sitting in the third paragraph, after the Arabic/Sanskrit word origins. A first-time visitor read the linguistics before learning what the thing is. I **reordered** the block so the proposition leads and the etymology follows as depth. **Not one word was rewritten** — your sentences, in a better order. **The hero is exactly as you left it** — the photograph and the line. I did not add anything to it.

**2. The three ways to travel are genuinely three now.** `d28af23`
Two of them were the same product: the "Caravan" card and the "Join a Journey" card both pointed at the Andean Caravan, and the second said *"Available now"* — which also contradicted "nothing is bookable." Now: **Caravan — hop on, hop off** (Open for interest → the Caravan); **Join a journey with others** (Coming later → shorter journeys, its own thing, not the Caravan); **Create your own** (Coming later → register interest). Each has an honest status chip.

**3. Every section page stops contradicting itself.** `4f54afd`
Section pages said both "Section 1 of 9, joined end to end" *and* "A separate departure, **not** a place on the annual Caravan." Now the top of each section states the dual nature plainly — *"Section N of 9 on the Andean Caravan. Travel it as a leg of the whole route, or on its own"* — and the standalone block keeps its only real fact (it runs on a different season alone) without denying the section is part of the Caravan.

**4. "Register your interest" no longer contradicts the banner.** `1380fe6`
The banner says "open for interest"; the page it led to said "Registration is coming soon." The page now presents registering interest as the open action it is — *"Leave your email and we will write to you first."* It still opens your email app (the real delivery still needs your Resend keys — see below), which is honest and stores nothing.

**5. All the visible PLACEHOLDER and mock-consent scaffolding is gone.** `57e9d76`
Five pages showed internal scaffolding to visitors. `/request-invitation` was showing "PLACEHOLDER: Founder-approved introduction to be supplied" **and a consent checkbox that declared itself "not final legal consent" while collecting name, email and country** — a real compliance risk. That form is removed until consent wording exists; the page now holds honest copy and one button to register interest. Privacy/Terms/Accessibility no longer show "LEGAL REVIEW / To be confirmed" — they carry plain, honest "being prepared before launch" copy (**I wrote no fake legal text**), and are marked noindex until the real policies land. The 404 and six placeholder meta descriptions are fixed too.

**6. The Travel Self boundary is on the landing screen.** `cc78663`
Your guard — *"The Travel Self is not a psychological test… It cannot predict whether two people will get along"* — only appeared inside the quiz. It now sits on the first screen, beside the privacy line, before "Find out →", so the framing is qualified on first contact. **Your own words, moved earlier — nothing rewritten.** (I left your headline "Which one are you?" alone; whether to soften it is your call — see below.)

**7. The nav is trimmed to what actually works.** `661b089`
Primary nav was six items, three of them "coming soon" shells. It's now **How Sawayatra works · Meet your Travel Self · Caravans**. Journeys, Create your own journey and Departure dates moved to the footer (nothing became unreachable — the footer is now the full site index).

**8. The broken /start-here is retired.** `24da228`
It rendered only a spinner with no heading — a named, described, dead page. It now 301-redirects to `/joining-points`, which does exactly what /start-here promised.

**9. The nine section cards have clear accessible names.** `af25fa1`
Each section card is one big link; a screen-reader user heard the entire card dumped as the link text, nine times. Each now reads "Section 1, Desert Coast — 9 days, Lima → Paracas → Nazca → Arequipa."

---

## What I deliberately did NOT touch (it needs you)

Ranked by leverage. The first three unblock the most.

1. **The canonical domain + going live to search.** The site is still `noindex` and its shares still resolve to `localhost`. Fixing it is one Vercel variable — but it also flips you *visible to Google*, which is a launch decision, not a bug. **Tell me: www.sawayatra.com or sawayatra.com, and do you want to be findable yet?** If not yet, I can fix the broken share-previews without going public.
2. **Name yourself on "Who we are."** Still the single biggest trust fix, and it needs no lawyer. A few sentences and a photo. The only human trace on the site is still your Gmail address.
3. **Turn form delivery on.** The interest and contact flows still open an email app rather than delivering, because that needs your Resend account keys in Vercel (I won't handle your keys) and a consent basis (solicitor).
4. **The group-size number.** Your brief says "maximum 12"; the site says "12, up to 16 on four flexible sections"; I did **not** change it because I don't know the true answer. Tell me the real maximum and which sections (if any) are the exception, and I'll make every page agree.
5. **The money sentence** — a per-person-per-day rate or a from-figure. Your decision; I won't invent a number.
6. **A difficulty grade per section** — you've walked the road; I haven't. Give me a scale and nine numbers and I'll build it.
7. **Transport and the included/not-included list** — facts I won't invent.
8. **Legal copy** (privacy/terms/consent) — a solicitor. Longest lead; worth starting today.
9. **Two small voice calls, entirely yours:** whether to soften the Travel Self headline "Which one are you?" (I left it), and whether to keep the unattributed line "People don't browse people. They browse journeys."
10. **Restore the invitation form** on `/request-invitation` once consent wording exists (I removed it, didn't delete the component).

---

## What I chose not to do overnight, on purpose

Not because they're wrong — because they carried more risk than I'd take without you watching:

- **Unifying the two route-map components** (a maintainability refactor) — too easy to break the map silently overnight.
- **Adding the E2E tests to CI** — the CI job is right, but the Chromium browser can't run in this environment, so I couldn't confirm the three specs pass; I won't hand you red builds.
- **Structured data (JSON-LD)** — it shouldn't be added while the site is noindex, and it depends on the status decisions above.

---

## State of the repository

**Fifteen commits are unpushed** — the six audit documents from yesterday plus tonight's nine fixes. They exist on your machine only. When you're up, `Push to GitHub.command` on your desktop will push them (it shows you everything first and asks before doing anything), and Vercel will redeploy. Everything is green: 159 tests, types, lint and build all clean.

Sleep well — this was a good night's work on the parts that didn't need you. The morning's work is the parts that do.
