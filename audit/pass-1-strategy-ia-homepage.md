# Sawayatra — PASS 1: What exists, and is it understood?

**Target:** the live site at https://www.sawayatra.com/
**Crawled:** 6 August 2026, 39 routes.
**Method:** the live production HTML would not render through the plain fetcher (it returned empty bodies), so I fetched it through the Vercel-aware fetcher and confirmed the production build is commit `822c98c` — the current one — by fingerprinting today's components in the live homepage and `/departures/desert-coast` HTML. I then crawled that identical build served locally, which gives clean structural extraction, and spot-checked the findings that are environment-specific (noindex, canonical URLs) against the real production HTML. Where a finding is live-verified I say so.

This output is candid and unflattered, as requested. Every problem carries a repair with exact copy, structure or code.

---

## The one-paragraph verdict

The craft is real and the honesty is unusual — this site tells you what is not ready instead of pretending, which most pre-launch sites do not. But two things undermine it right now. First, **the entire live site is invisible to search and broken on shares**: every page ships `noindex,nofollow` and a `localhost:3000` canonical, live, today. Second, **the homepage opens with a linguistics lesson**: after the line "Go alone, arrive together," a first-time visitor reads the Arabic and Sanskrit etymology of the name before learning that this is a members' travel club that matches people by how they travel. The proposition, the three ways to travel, and the status of the product are all present on the site — just not where a ten-second visitor will find them. Neither problem is expensive to fix.

---

## 1. Sitemap — full route structure

39 routes crawled, all returning 200 except the 404 route (correct). Redirect hygiene is **good** — the obvious duplicate paths are clean 301s, not duplicate-rendered pages:

**301 redirects (correct, keep):**

- `/about` → `/who-we-are`
- `/membership` → `/members`
- `/do-it-yourself` → `/create-your-own-journey`
- `/caravans/the-andean-caravan` → `/caravans/andean`
- `/departures` → `/caravans/andean`
- `/departures/the-andean-caravan` → `/caravans/andean`
- (7 rules total in `next.config.ts`)

**Live, indexable-intent pages (200):**

| Path | Title | Role | Content state |
|---|---|---|---|
| `/` | One caravan. One long route. | Home | Real, but mis-ordered (§2) |
| `/how-it-works` | How Sawayatra works | Concept + three ways | **Real and good** |
| `/travel-self` | Meet your Travel Self | The matching device | Real, operational (quiz) |
| `/caravans` | Caravans | Flagship index | Real (one caravan) |
| `/caravans/andean` | The Andean Caravan | Flagship + 9 sections | **Real and strong** |
| `/caravans/andean/route-map` | Route map | Map | Real |
| `/caravans/andean-caravan/how-it-works` | Hop on, hop off | Section mechanics | Real and good |
| `/departures/{9 slugs}` | Section pages | The nine sections | **Real and strong** |
| `/joining-points` | Joining points | Entry/leave gates | Real |
| `/who-we-are` | A travel club with a point of view | Trust | Real, no named human |
| `/members` | A small, vetted club… | Membership | Real, deliberately thin |
| `/travel-self` | — | — | — |

**Pages that are "coming soon" shells (200, honest, but see §4):**

- `/journeys` — "Coming soon… we are building the first three now" + email capture
- `/register-interest` — "Registration is coming soon" + email capture
- `/partners` — "This section is coming soon" + email capture
- `/departure-dates` — "Coming soon" + email capture
- `/caravans/who-else-is-travelling` — "Coming soon" + email capture
- `/create-your-own-journey` — the third "way to travel", routes enquiries to `/request-invitation`

**Capture / access pages (200):**

- `/request-invitation` — form, but **shows raw PLACEHOLDER and LEGAL REVIEW text to visitors** (§ Confirmed problem 3)
- `/contact` — "Online delivery is not connected yet", form + `mailto:nerminehammam@gmail.com`
- `/sign-in` — "Member access is opening in stages. Authentication is not active in Release 1." + email interest form

**Broken / empty:**

- `/start-here` — 200, titled "Start here", description "Choose a joining point and begin an enquiry," but the server-rendered body is **only "Loading Sawayatra…"**. It is a client-only page with no server content. (§ Confirmed problem 4)

**Legal / utility:** `/privacy`, `/terms`, `/accessibility` — all render "LEGAL REVIEW" placeholder content (known, blocked on a solicitor).

**Could not reach / verify:** see the list at the end.

---

## 2. The ten-second test (from the homepage alone)

The homepage in reading order is: announcement bar → "Go alone, arrive together." → **the etymology of the name (Sawa + Yatra, Arabic and Sanskrit)** → "Sawayatra is a new way to travel… we call it your Travel Self" → pronunciation guide → footer.

| Question | Answer a visitor can give in ten seconds | Source of the uncertainty |
|---|---|---|
| **What is Sawayatra?** | Unclear. Something about travel and finding like-minded people. The words "club" and "members" appear only in the nav, never in the hero. | The hero states a slogan, then the name's etymology. It never says what the thing *is* in a plain sentence. |
| **Who is it for?** | Not stated at all. | No audience line anywhere above the fold. |
| **What can someone do?** | Explore the caravan; take the Travel Self quiz. "Register your interest" is offered but leads to "coming soon." | Two equal hero CTAs plus a banner CTA that dead-ends. |
| **What is distinctive?** | "Find people who share your pace… we call it your Travel Self" — one sentence, after the etymology. | The single most distinctive claim is buried in paragraph three. |
| **Club / operator / community / matching / caravan?** | A combination, unresolved. Nav implies all of them. | The homepage never picks a primary noun. |
| **What can I do today?** | Read routes; take a quiz whose answers stay in your browser. | Fine, but not signposted as "today vs later." |
| **What is planned?** | Not visible from the homepage. | Status lives on inner pages, not the home. |
| **What should I do next?** | Ambiguous — three competing calls (See how it works · Explore the Caravan · Register interest). | No single primary action. |

**Verdict: the homepage fails the ten-second test on "what is it," "who is it for," and "what should I do next."** Everything needed to pass exists elsewhere on the site; the homepage simply leads with the wrong block.

### Rewrite of the responsible section (the homepage hero + first block)

Keep the H1 (approved identity, and it is good). Add one plain-language subline, a visible status line, and one primary action. Move the etymology to the foot of the page.

> **Go alone, arrive together.**
>
> Sawayatra is a members' travel club that pairs you with people who travel the way you do — your pace, your curiosity, your appetite for the unplanned — not just your destination. Our first journey is **the Andean Caravan**: one continuous overland route from Lima to Patagonia, travelled in a small group, joined and left where you choose.
>
> `Open for interest · First departure February 2028 · Not bookable yet`
>
> **[ Explore the Andean Caravan ]**  →  /caravans/andean
> **[ Meet your Travel Self ]**  →  /travel-self
> *How Sawayatra works* → /how-it-works

**Preserve:** the line "Go alone, arrive together," the warm paper ground, the wordmark, the pronunciation note (move it lower), the etymology text (move it lower — see §5 of deliverables).

---

## 3. Concept separation

Can a first-time visitor keep these ten apart? Mostly yes — the inner pages are careful. Three collapse:

| Concept | Separable? | Note |
|---|---|---|
| Sawayatra (the organisation) | ✓ | Clear on `/who-we-are` |
| The Travel Self | ✓ | Its own page; well-scoped; explicitly "not sent to Sawayatra" |
| The three ways to travel | ⚠ | Named clearly on `/how-it-works`, **absent from the homepage** |
| The Andean Caravan | ✓ | Strong on `/caravans/andean` |
| A Caravan section | ⚠ **collapses** | Section pages say both "part of the annual Caravan" **and** "A separate departure, not a place on the annual Caravan" (`/departures/desert-coast`). A visitor cannot tell whether a section is a leg of the 71-day journey or a standalone trip. |
| Departures | ⚠ | `/departures` 301s to the Caravan; but "Departure dates" is its own nav item and a coming-soon stub. The word points at three things. |
| Joining / leaving points | ✓ | Clear on `/joining-points` and `/caravans/andean-caravan/how-it-works` |
| Membership / profile creation | ✓ | `/members` deliberately thin, honest |
| Registering interest | ✗ **collapses** | Four different capture flows (see §4) with four different states and wordings |
| Booking / paying | ✓ | Correctly and repeatedly stated as not available |

**The two collapses to repair:**

**(a) Section = leg or standalone?** Pick one framing and state it once, everywhere a section appears. Recommended copy, on every section page directly under the title, as a one-line chip:

> `Section 3 of 9 on the Andean Caravan · can also be travelled on its own`

Then delete the contradictory standfirst "A separate departure, not a place on the annual Caravan." A section is a leg you may also take alone; it is not a separate product. (This aligns with the RouteStepper already shipped at the foot of each section page.)

**(b) The capture flows** — see §4, they need consolidating to one.

---

## 4. Status audit

The status taxonomy is mostly **honestly applied** — genuinely better than the category. But the honesty is undermined in two places, and the primary conversion path contradicts the banner.

| Feature / CTA | Where | Implied status | Actual status | Verdict |
|---|---|---|---|---|
| Announcement banner "open for interest" | every page | Open for interest | — | OK |
| "Register your interest" (header CTA) | every page | Open for interest | **`/register-interest` says "Registration is coming soon"** and only offers a mailto | ✗ **Contradiction — Critical** |
| Explore the Andean Caravan | home, how-it-works | Available to read | Available (read-only) | OK |
| Meet your Travel Self | home, nav | Available now | **Available now** (quiz runs, saved locally) | OK — the one genuinely live interaction |
| Join a Journey (shorter trips) | `/journeys` | Coming later | "Coming soon, building the first three" | OK — clearly flagged |
| Create your own journey | nav, `/create-your-own-journey` | Conceptual | Routes to `/request-invitation` | ⚠ under-labelled in nav |
| Departure dates | nav, `/departure-dates` | Available | Coming soon stub | ⚠ nav implies a live feature |
| Request an invitation | `/request-invitation` | Draft | **Shows "PLACEHOLDER" and "LEGAL REVIEW: … mock checkbox is not final legal consent" to visitors** | ✗ **High** |
| Ask a question | `/contact` | Live | "Online delivery is not connected yet" + gmail mailto | ⚠ honest but not delivering |
| Sign in | `/sign-in` | Members area | "Authentication is not active in Release 1" | OK — clearly flagged |
| Who else is travelling | `/caravans/who-else-is-travelling` | Available | Coming soon | OK |
| Our partners | `/partners` | Available | Coming soon | OK |

**The four capture flows that must become one.** Today a visitor who wants to raise their hand meets: **Register your interest** (mailto, "coming soon"), **Request an invitation** (form with placeholders + a mock consent box), **Ask a question** (form, "not connected"), and **Record interest in member access** (email field on `/sign-in`). Four forms, four states, four wordings, none of which deliver. This reads as unfinished and it splits the one action that matters at this stage.

**Repair:** collapse to **one** interest capture, reached by one CTA wording ("Register your interest"), that actually delivers. The email delivery adapter to do this already exists in the codebase (`lib/forms/adapters.ts`, `resolveFormAdapter`); it needs the three Resend environment variables set in Vercel and the page switched from mailto to the real endpoint. `/contact` stays as a separate "ask a specific question" path. `/request-invitation` and the `/sign-in` email field fold into the single interest form. Until delivery is switched on, the CTA label must read **"Register your interest (opens soon)"** rather than sitting above a page that contradicts the banner.

---

## 5. Deliverables

### 5.1 Revised sitemap (what to keep, merge, hide)

**Keep and promote:** `/` · `/how-it-works` · `/travel-self` · `/caravans/andean` (canonical flagship) · the nine `/departures/{slug}` · `/caravans/andean/route-map` · `/caravans/andean-caravan/how-it-works` · `/joining-points` · `/who-we-are` · `/members` · `/register-interest` (once it delivers) · `/contact` · legal.

**Merge / demote:** `/caravans` → make it 301 to `/caravans/andean` while one caravan exists (removes the "Caravans" vs "The Andean Caravan" split). `/departure-dates` → fold into `/caravans/andean` (there is one departure window; a whole page is premature). `/request-invitation` → fold into `/register-interest`. `/create-your-own-journey` → keep as a single "coming later" page, out of primary nav.

**Fix:** `/start-here` renders empty server-side — either give it real server content or 301 it to `/how-it-works`. It currently promises "choose a joining point and begin an enquiry" and delivers a spinner.

### 5.2 Complete proposed navigation

**Primary (only operational or explanatory — four items):**

- How it works → `/how-it-works`
- Travel Self → `/travel-self`
- The Andean Caravan → `/caravans/andean`
- Who we are → `/who-we-are`

**Utility (top-right):**

- Register interest → `/register-interest` (label "opens soon" until delivery is live)
- Sign in → `/sign-in`

**Footer:**

- *Explore:* How it works · Travel Self · The Andean Caravan · Joining points · Who we are · Members
- *Coming later:* Shorter journeys · Create your own journey (single muted line, honestly labelled)
- *Ask:* Ask a question · Register interest
- *Legal:* Privacy · Terms · Accessibility

**Removed from primary nav:** "Journeys", "Create your own journey", "Departure dates" — all point at not-yet-operational pages and currently make half the primary nav a set of "coming soon" shells. They live in the footer under "Coming later" until they are real. **Preserve:** the "Members / Who we are / Our partners" secondary strip may stay, but drop "Our partners" from it until that page has content.

### 5.3 Revised homepage section order

1. **Hero** — H1 "Go alone, arrive together." + the plain subline (§2) + status line + two CTAs.
2. **What Sawayatra is / three ways to travel** — the block currently only on `/how-it-works`: Caravan (available to explore) · Join a Journey (coming later) · Create your own (coming later), each with a status chip. This is the single most important addition to the homepage.
3. **The matching idea — your Travel Self** — one paragraph on being matched by how you travel, the "answers stay in your browser" honesty, and the "Meet your Travel Self" CTA.
4. **The Andean Caravan** — the flagship: the map, "nine connected sections, Lima to Patagonia, first departure February 2028," and the "Explore the Andean Caravan" CTA.
5. **Who we are** — one short paragraph of point-of-view + a link. (Trust.)
6. **The name** — the Sawa + Yatra etymology and the pronunciation note. **Moved here.** It is a beautiful closing note and a terrible opening one.
7. **One next step** — a single "Register your interest" block with the honest status line.

### 5.4 Hero copy

Written in full in §2 above. The load-bearing addition is the single subline that names the category ("a members' travel club that pairs you with people who travel the way you do") and the flagship ("the Andean Caravan: one continuous overland route from Lima to Patagonia"), plus the status line `Open for interest · First departure February 2028 · Not bookable yet`.

### 5.5 CTA hierarchy (exact wording and destination)

| Rank | Wording | Destination | Notes |
|---|---|---|---|
| Primary | **Explore the Andean Caravan** | `/caravans/andean` | The one thing that is real and rewards a click today |
| Secondary | **Meet your Travel Self** | `/travel-self` | The only live interaction; distinctive; needs no backend |
| Conversion | **Register your interest** | `/register-interest` | Must be made to deliver (Resend env vars); label "(opens soon)" until then |
| Enquiry | **Ask a question** | `/contact` | Keep separate from interest capture |
| Explanatory | **How Sawayatra works** | `/how-it-works` | Text link, not a button |

**Retire** the header's standalone "Register your interest" as the *primary* CTA until it delivers — it currently sends the most motivated visitor to a page that says the opposite of the banner.

---

## Findings grouped

### Confirmed problems

**C1 — The live site is `noindex` with `localhost` canonicals.**
| | |
|---|---|
| **Area** | Whole site / production environment |
| **Score** | 2 |
| **Severity** | Critical |
| **Evidence** | Live production HTML of `www.sawayatra.com` contains `noindex,nofollow` and `http://localhost:3000` in `canonical`, `og:url` and `og:image`, on every page (verified against the fetched production homepage, not just local). |
| **Problem** | `NEXT_PUBLIC_SITE_URL` is unset in the Vercel production environment, so the metadata layer falls back to localhost and marks everything noindex. |
| **Consequence** | The site cannot be found on Google, and every link shared in a message or social post resolves its preview image and canonical to `localhost:3000` — i.e. broken. For a brand whose proposition is its photographs, shares showing nothing is the worst failure. |
| **Root cause** | Technical / operational (environment configuration) + one open decision (canonical domain). |
| **Exact repair** | (1) Decide the canonical domain — `www.sawayatra.com` or `sawayatra.com`; both are attached. (2) Set `NEXT_PUBLIC_SITE_URL=https://www.sawayatra.com` (or apex) in Vercel → Project → Settings → Environment Variables → Production. (3) Add a redirect from the non-canonical host to the canonical one. (4) Redeploy. The noindex flag and the localhost URLs both resolve from this one variable — the code already keys off it (`lib/site-url.ts`, `app/_metadata.ts`). |
| **Replacement** | n/a (configuration) |
| **Preserve** | The noindex-until-`NEXT_PUBLIC_SITE_URL`-is-set behaviour is correct as a guard; it just needs the variable supplied now that you are live. |
| **Effort** | Small |
| **Dependency** | The canonical-domain decision (yours). |
| **Verification** | After redeploy, `view-source:https://www.sawayatra.com/` shows `index,follow` and a `https://www.sawayatra.com/...` canonical; Google Search Console "URL inspection" reports the page as indexable; a link pasted into WhatsApp/Slack shows the photograph. |

**C2 — The primary conversion CTA contradicts the banner.**
| | |
|---|---|
| **Area** | Global header + `/register-interest` |
| **Score** | 3 |
| **Severity** | Critical |
| **Evidence** | The banner on every page reads "The Andean Caravan is open for interest." The header CTA "Register your interest" leads to `/register-interest`, whose own H1 body reads "Registration is coming soon" and offers only a `mailto:`. |
| **Problem** | The single most prominent, most-repeated call to action sends the most motivated visitor to a page that says the opposite of what brought them there, and then cannot capture them. |
| **Consequence** | The one conversion that matters at this stage — registering interest — is a dead end, and the contradiction reads as either broken or untrustworthy. |
| **Root cause** | Operational (delivery not switched on) + editorial (contradictory status wording). |
| **Exact repair** | Switch on the email delivery that already exists: set `RESEND_API_KEY`, `SAWAYATRA_FORM_RECIPIENT`, `SAWAYATRA_FORM_SENDER` in Vercel Production, and point `/register-interest` at the real form endpoint instead of the mailto. Then the banner and the CTA agree and the interest is captured. |
| **Replacement** | `/register-interest` H1 + intro: **"Register your interest in the Andean Caravan."** / "Leave your name and we'll write to you first when dates, joining points and membership open — no account, no payment, no obligation. First departure February 2028." Until delivery is live, banner and CTA both read **"Register your interest (opens soon)"** and the page says so plainly. |
| **Preserve** | The "no payment / no booking" honesty; the February 2028 date. |
| **Effort** | Small (config + wire one form) |
| **Dependency** | Resend account + the three env vars (yours); the legal basis for storing an email (solicitor). |
| **Verification** | Submitting the form delivers an email to the recipient; the page no longer says "coming soon" while the banner says "open." |

**C3 — `/request-invitation` shows raw PLACEHOLDER and mock-consent text to visitors.**
| | |
|---|---|
| **Area** | `/request-invitation` |
| **Score** | 2 |
| **Severity** | High |
| **Evidence** | The live page renders: "PLACEHOLDER: Founder-approved invitation-request introduction to be supplied," and "PLACEHOLDER / LEGAL REVIEW: Required consent wording has not been supplied. This mock checkbox is not final legal consent." It is reachable from `/how-it-works` ("Create Your Own") and `/sign-in`. |
| **Problem** | A publicly linked page shows internal scaffolding — the literal words PLACEHOLDER and LEGAL REVIEW — and a consent checkbox that admits it is not real consent, while collecting name, email, country and a message. |
| **Consequence** | To the trust and investor lenses this reads as a site shipped mid-edit; to a data-protection eye, collecting personal data behind a self-described non-consent checkbox is a live compliance risk. |
| **Root cause** | Editorial (placeholder copy live) + operational (page reachable before it is ready). |
| **Exact repair** | Fold `/request-invitation` into the single `/register-interest` capture (§4) and 301 it there; or, if it must stay, gate it behind `noindex` **and** remove every visitor-facing PLACEHOLDER string and the mock checkbox until the solicitor's consent wording exists. Do not collect personal data through it until then. |
| **Replacement** | Interim page body if kept: "Invitations open when membership does. In the meantime, register your interest and we'll write to you first." + link to `/register-interest`, and **no data-collection fields**. |
| **Preserve** | The instinct to warn against sending sensitive data; keep that line when the form is real. |
| **Effort** | Small |
| **Dependency** | Consent wording (solicitor) before any personal data is collected here. |
| **Verification** | No occurrence of "PLACEHOLDER" or "LEGAL REVIEW" in the rendered HTML of any reachable page (`grep` the crawl); the page either 301s or collects nothing. |

**C4 — `/start-here` renders empty server-side.**
| | |
|---|---|
| **Area** | `/start-here` |
| **Score** | 3 |
| **Severity** | High |
| **Evidence** | 200 response, title "Start here", meta description "Choose a joining point and begin an enquiry about the Andean Caravan," but the server-rendered body contains no `<h1>` and only the string "Loading Sawayatra…". It is a client-only page. |
| **Problem** | A named, described, crawlable URL delivers nothing to a crawler or a no-JS reader, and a spinner to everyone else if the client bundle stalls. |
| **Consequence** | If linked or found, it is a dead end; it also drags an SEO signal (a described page with no content). |
| **Root cause** | Technical (page is entirely client-rendered with no SSR fallback content). |
| **Exact repair** | Either give it real server-rendered content (a genuine "start here" that lists the ways in and links to `/caravans/andean` and `/travel-self`), or 301 it to `/how-it-works`. Do not ship a described URL whose SSR output is a spinner. |
| **Replacement** | If kept: H1 "Start here," three links — "Read the Andean Caravan," "Meet your Travel Self," "How Sawayatra works" — as server-rendered anchors. |
| **Preserve** | Nothing; it has no content to preserve. |
| **Effort** | Small |
| **Dependency** | None. |
| **Verification** | `curl` of `/start-here` with JS disabled shows an `<h1>` and real links, or a 301. |

**C5 — The homepage leads with the etymology, not the proposition.**
| | |
|---|---|
| **Area** | `/` (homepage) |
| **Score** | 4 |
| **Severity** | High |
| **Evidence** | Homepage reading order: banner → H1 "Go alone, arrive together." → the Sawa/Yatra etymology (Arabic + Sanskrit) → "Sawayatra is a new way to travel… your Travel Self." The words "club," "members," "match," and "Andean Caravan" do not appear in the hero. |
| **Problem** | The first substantive content a stranger reads is the origin of the name, not what the product is, who it is for, or what they can do. The proposition exists one paragraph later and one page over. |
| **Consequence** | Fails the ten-second test (§2) on the three questions that decide whether a visitor stays. |
| **Root cause** | Strategic / editorial (poem placed where the pitch belongs). |
| **Exact repair** | Re-order the homepage (§5.3) and add the hero subline (§2). Move the etymology to section 6. |
| **Replacement** | Full hero and section order written in §2 and §5.3. |
| **Preserve** | "Go alone, arrive together," the etymology text itself (relocated), the pronunciation note (relocated), the warm identity. |
| **Effort** | Medium (homepage re-order + one new "three ways" block reused from `/how-it-works`) |
| **Dependency** | None — all copy exists; it is a re-order plus one subline. |
| **Verification** | A five-second read of the homepage by someone new answers "what is it / who for / what next" correctly; the "three ways to travel" block appears above the fold on desktop. |

**C6 — Four parallel interest-capture flows, none delivering.**
| | |
|---|---|
| **Area** | `/register-interest`, `/request-invitation`, `/contact`, `/sign-in` |
| **Score** | 3 |
| **Severity** | High |
| **Evidence** | Four forms with four states and wordings: Register (mailto, "coming soon"); Request an invitation (form + placeholders + mock consent); Ask a question (form, "not connected"); Record interest in member access (email field). None delivers to a server. |
| **Problem** | The one action that matters pre-launch — raise your hand — is split four ways and works zero ways. |
| **Consequence** | Diffuses conversion, multiplies the surface that looks unfinished, and multiplies the compliance surface (personal data collected in several places, none with real consent). |
| **Root cause** | UX / product (no single capture) + operational (delivery off). |
| **Exact repair** | One interest form, one CTA wording, one delivery path (the existing Resend adapter). `/contact` stays as "ask a question." `/request-invitation` and the `/sign-in` email field 301 or fold into `/register-interest`. |
| **Replacement** | See §4 and C2. |
| **Preserve** | `/contact` as a distinct "specific question" path; the no-payment honesty. |
| **Effort** | Medium |
| **Dependency** | Resend env vars; consent wording. |
| **Verification** | One reachable interest form; it delivers; `grep` finds no second "leave your email" capture outside `/contact`. |

### Probable problems needing technical verification

**P1 — Very heavy HTML documents (500–640 KB per page).** Every page ships 0.5–0.64 MB of HTML because CSS is inlined (`inlineCss` experiment). *Consequence:* slow first byte-to-render on a phone on a slow Andean connection — exactly the audience. *Verify:* Lighthouse on the deployed preview (LCP, TBT) and compare inlined vs linked CSS. *Repair if confirmed:* disable `inlineCss` or scope it to the critical path. I have not measured render timing, so this is flagged, not asserted.

**P2 — "Loading Sawayatra…" appears in the SSR of interactive pages** (`/how-it-works`, `/caravans/andean`, section pages). Hydration likely replaces it, but it means some content is client-gated. *Verify:* load each with JS disabled and confirm the real content is present (it appears to be, except `/start-here`). *Repair if a page is empty without JS:* give it an SSR fallback.

**P3 — `robots.txt` and `sitemap.xml` returned empty to the plain fetcher.** This may be the same fetcher quirk that returned empty homepages, or a real problem. *Verify:* fetch both through a real browser / the Vercel fetcher and confirm they contain the expected content once `NEXT_PUBLIC_SITE_URL` is set. Tied to C1.

### Strategic opportunities

**S1 — The honesty is a positioning asset; make it visible, not apologetic.** The site already refuses to fake capability. Turn that into a small, consistent status chip system (`Available now` · `Open for interest` · `Coming later`) shown on cards and CTAs, rather than paragraphs of "coming soon." It signals seriousness to the investor lens and manages expectations for the traveller lens, and it is on-brand for an editorial identity.

**S2 — The Travel Self is the only live, distinctive, backend-free interaction on the site.** It should be the second thing on the homepage, not a nav item. It is the clearest proof of the "matched by how you travel" claim and it works today.

**S3 — Resolve "section = leg or standalone."** Deciding this (a leg you may also take alone) unlocks clean copy across ten section pages and removes the one genuine conceptual contradiction.

### Matters of subjective taste

**T1 — The etymology.** Beautiful writing. My objection is placement, not quality — it belongs at the foot, not the head. Reasonable people could keep a *one-line* nod to the name in the hero; the full Arabic/Sanskrit passage should not open the site.

**T2 — "Go alone, arrive together" as the sole H1.** I would keep it (approved identity, genuinely good) and let the subline carry the literal meaning. A stricter reading would want a literal H1; I think the slogan plus subline is the better call and sits within the approved identity.

---

## Scores

| Dimension | Score | One-line justification |
|---|---|---|
| **Strategy & positioning** | **5** | The proposition is real, differentiated and honestly staged — but it is never stated plainly where a new visitor lands, and the primary CTA contradicts the banner. Functional but unconvincing at first contact. |
| **Information architecture** | **6** | Redirect hygiene is good and inner pages are careful; undermined by half the primary nav pointing at "coming soon" shells, the section-vs-standalone ambiguity, and four parallel capture flows. |
| **Homepage** | **4** | Leads with the name's etymology instead of the proposition; no plain "what is it," no "three ways," no single next step. Everything to fix it already exists elsewhere on the site. |

---

## Could not verify (running list)

1. **Live per-page behaviour beyond the homepage and `/departures/desert-coast`.** I confirmed the live production build equals the crawled build by fingerprint on those two, then crawled the identical build locally. Individual live pages (e.g. `/start-here`, `/request-invitation`) were read from the identical local build, not fetched one-by-one from production. Risk: low (same commit), but not independently fetched.
2. **Render performance (P1).** No Lighthouse/LCP/TBT — no browser available in this environment. The 500–640 KB figures are real HTML bytes; their effect on a real device is unmeasured.
3. **`robots.txt` / `sitemap.xml` production content (P3).** Returned empty to the plain fetcher; not re-fetched through the Vercel fetcher.
4. **Whether the two attached hosts (`www.` and apex) both serve or one redirects.** Both are attached in Vercel; I did not test the redirect between them.
5. **Interactive behaviour** — the Travel Self quiz flow, map controls, form validation states — was read from markup, not exercised in a browser.
6. **Analytics / consent behaviour at runtime** — not observed.

This is PASS 1 (strategy, IA, homepage). It does not cover the visual-identity, product-structure, or engineering passes in depth; those are later passes.
