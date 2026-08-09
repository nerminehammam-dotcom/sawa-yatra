# audit/pending-decisions.md

Every undecided item, with what it blocks. Opened in Phase 1, 5 August 2026. Append as later
phases surface more.

`docs/PENDING-DECISIONS.md` is the mechanical file-path guardrail. **This** file is the decision
queue: what is being asked, why, and what stops until it is answered.

---

## P0 — escalated

### PD-01 · Data capture is running without a privacy basis or consent tooling

**The exposure, named.** Four live forms collect personal data from a UK/EU audience:

| Route | Fields collected |
|---|---|
| `/contact` | name, email, free-text question, journey context |
| `/request-invitation` | name, email, country, free-text travel interest |
| `/start-here` | name, email, journey, Travel Self result, free-text note |
| `/sign-in` | email |

Against that:

- `/privacy` renders a placeholder: body `["To be confirmed"]`, `lastReviewed: TO_BE_CONFIRMED`,
  under a "LEGAL REVIEW" notice. There is no stated lawful basis, no retention period, no data
  controller, no subject-access route.
- The consent checkbox reads: *"PLACEHOLDER / LEGAL REVIEW: Required consent wording has not been
  supplied. This mock checkbox is not final legal consent."* The schema requires it to be ticked
  (`zod` refines `consent` to must-be-true). **The site tells the user its consent is invalid and
  requires it anyway.**
- `cookieNoticeDecision.required` is `TO_BE_CONFIRMED`, and the export is orphaned.
- No cookie banner, no consent manager, no analytics of any kind exists in the codebase.
- `lib/forms/client.ts` writes a SHA-256 fingerprint of each submission plus a timestamp to
  `localStorage` (`sawayatra:r1:mock-form-receipts`, up to 24 entries), with no expiry and no
  user-facing deletion route. A one-way hash of personal data is still derived from personal data.

**What currently limits it.** `developmentMockFormAdapter` discards every submission — nothing is
sent, stored server-side, or logged. So today the exposure is **latent**: the forms collect into a
void. It becomes live the instant delivery is implemented.

**The decision.** Sequence, not substance: privacy copy and lawful basis must be settled **before**
form delivery is wired, not after. If delivery ships first, the site processes personal data behind
a page that says "To be confirmed".

**Blocks:** step D1 (form delivery), and therefore the entire conversion path. Also blocks
analytics activation, since the same privacy basis covers both.

**Files:** `content/legal-placeholders.ts`, `app/(public)/privacy/page.tsx`,
`content/forms.ts` → `formUiContent.consent`, `components/forms/ConsentField.tsx`,
`lib/forms/client.ts`, `lib/forms/adapters.ts`.

---

## Blocking engineering work

### PD-02 · Where enquiries go

Unchanged from the prelaunch plan, Decision 2. `resendApiFormAdapterStub` exists with
`configured: false`. Nothing can be built until a destination, a retention period and a lawful
basis exist. **Gated behind PD-01.**

**Blocks:** D1, D2, D3 — the whole conversion path, four forms, and the announcement banner on
every route.

### PD-03 · Whether `NEXT_PUBLIC_SITE_URL` gets set, and to what

Setting this one Vercel environment variable does four things at once: switches `robots` from
`noindex, nofollow` to `allow` on every route, fixes `og:url` and `twitter:image` from
`http://localhost:3000` to the real host, populates `host` in `robots.txt`, and makes every
canonical absolute URL correct.

It is therefore **a launch decision, not a configuration task**, and must not be set casually.

`sawayatra.com` and `www.sawayatra.com` are already attached to the Vercel project. The value
determines the canonical host. The mechanism needs no code change — see `audit/static.md` §1.1–1.2.

**Blocks:** launch. Also blocks any meaningful discoverability work, since nothing is indexable
until it is set.

### PD-04 · The Travel Self axis mapping — blocks build item 5.1

The brief marks 5.1 highest-priority and fully unblocked. It is not.

There are two models. The live one has five axes (`pace`, `planning`, `social`, `rhythm`,
`comfort`); the legacy one has six (`rhythm`, `discovery`, `socialEnergy`, `clock`, `threshold`,
`focus`). They share one identifier. A compile test this session proved the live result cannot be
passed to the legacy recommender.

The legacy model contains a complete recommendation engine **and hand-authored fit vectors for all
nine Andean sections** — the expensive part of 5.1, already done, against the wrong axes.

**The question:** re-author the nine section fit vectors against the live five axes, or define a
six-to-five mapping? Either is a judgement about what the axes mean, and neither can be inferred
from code.

Once answered, the port is small and the annotate / rank / warn / persist work the brief describes
proceeds with no auth and no accounts, exactly as specified.

**Blocks:** 5.1 entirely. Detail in `audit/static.md` §1.10.

---

## Content contradictions — reported, not resolved

### PD-05 · Route geography: "Peru, Bolivia and Chile" vs "Lima to Patagonia"

Live in production this session as the `<meta name="description">` on the journey route, and
therefore in every shared link.

| File | Line | Says |
|---|---|---|
| `content/site.ts` | `approvedRouteDescriptions.journey` | "One annual caravan through **Peru, Bolivia and Chile**." |
| `content/navigation.ts` | 78 | "71 days, **Lima to Patagonia**" |
| `app/(public)/caravans/andean-caravan/how-it-works/_content.ts` | gate table | final gate **Balmaceda** (Chilean Patagonia) |
| `content/andean-caravan.ts` | section list | ninth section "The End of the Road" |

Argentina is never named. Patagonia — the emotional endpoint — is absent from the one line that
appears in every shared link. **Do not resolve unilaterally.**

### PD-06 · Departure dates: three windows, one a year apart

| Window | Where |
|---|---|
| February 2028 | `content/navigation.ts:65` — announcement banner, **every route** |
| February–April 2028 | `content/andean-caravan.ts:2`, `content/site.ts:394`, `departures/[slug]/page.tsx:38,340,470`, nine per-section `publicDateWindow` values |
| **January–April 2027** | `caravans/andean-caravan/how-it-works/page.tsx:38`, `_components/GateSelector.tsx:338` |
| February 2027 | `content/journeys.ts:15` — orphaned, not rendered |

A visitor on the hop-on/hop-off page sees "January–April 2027" beneath a banner saying "First
departure February 2028". **Which is correct is a founder decision.** Once answered the fix is
mechanical: single-source the window and derive every surface from it.

### PD-07 · Two altitude datasets for the same six places

`content/andean-caravan-destinations.ts` carries cited figures; `_content.ts` carries rounded,
uncited ones. Differences of 2–14 m across Arequipa, San Pedro, Cusco, La Paz, Uyuni and Puno.
Separately, the Lagunas refuges are "above 4,300 metres" in one file and the section maximum is
"4,900 m" in the other.

Physical-demand description is an undecided surface, so **no altitude figure may be changed,
reconciled or rounded** without a decision. Full table in `audit/static.md` §1.6 B.

### PD-08 · Whether India and Egypt stay on the site

They were described as removed. They are not: both are live stub routes, both are listed as cards
on `/caravans`, and both appear in the Caravans submenu as "Coming soon" and "In planning". Both
are `noIndex` and excluded from the sitemap, so this is a visitor-facing roadmap claim rather than a
technical problem.

Removing them from the submenu and the index page is structural. Keeping the words "Coming soon"
and "In planning" is a claim about the roadmap, and therefore a decision.

---

## Carried from the prelaunch plan, still open

Recorded so the queue is complete. Detail in `docs/Sawayatra-prelaunch-plan.docx` §3.

| Ref | Decision | Blocks |
|---|---|---|
| PD-09 | Pricing — what is published and when | Nine `"Price on request"` strings; the literal type in `content/andean-caravan.ts:66,80` |
| PD-10 | What a member is — gets / costs / commits / how to leave | `/membership`, `/members`, `membershipPromises` (orphaned) |
| PD-11 | The eight FAQ questions | `content/faq.ts` (orphaned). Note a real five-question FAQ already renders on `/caravans/andean-caravan/how-it-works` via `approvedFaq` |
| PD-12 | Who is named — founder and ground operator | `/about`, `/who-we-are`, footer |
| PD-13 | Financial protection wording | Footer, membership |
| PD-14 | How legal pages get written | Gated by PD-01 |
| PD-15 | How physical demand is described | Gated with PD-07 |
| PD-16 | Whether to show who is already on a departure | 5.2, 5.3, `/caravans/who-else-is-travelling` |
| PD-17 | The public contact address | `lib/contact.ts` — currently a personal Gmail on 9 routes |
| PD-18 | Analytics provider activation | No analytics code exists; this is a build, not a flag. Gated by PD-01 |

---

## Structural work that is NOT blocked

Committable to `main` now, touching no words or numbers:

- `/caravans/andean-caravan/how-it-works` currently emits the **homepage's** canonical and
  `og:title` (measured live). Add it to `routeMetadata` and `StaticRoute`, replace the inline
  metadata object with `createPageMetadata()`. `audit/static.md` §1.1.
- Three citations point at a `.pdf` URL that returns an XLSX; the percent-encoded sibling returns
  the PDF. Correcting the URL changes no prose. `audit/static.md` §1.7.
- The Phase 2 harness, `tools/audit/`.
- `docs/spec-archetype-passport.md` — build item 5.2, specification only.
