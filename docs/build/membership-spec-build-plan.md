# Build plan — Membership, Identity, Access & Pricing (spec v3.1)

Source of truth: `docs/specs/sawayatra-membership-identity-spec-v3.1.md`.
Working method: one area per pass, human review between passes, no commits without sign-off.
Working tree is mid-cleanup (`todelete/`, deleted configs) — worked around, never restored.

## Codebase facts the plan rests on

- No `{{TOKEN}}` convention exists yet; the repo's placeholder pattern is `TO_BE_CONFIRMED` + `ContentStatus`. Spec tokens get their own module (area A) rather than overloading that.
- No bare numeric price exists anywhere today (all "Price on request" / TO_BE_CONFIRMED). The guard's job is to keep it that way.
- `vitest.config.ts`, `playwright.config.ts`, `tests/setup.ts`, CI workflow are git-deleted. New tests are written but cannot run until a config decision is made (reported as a blocker, not fixed by restoring).
- `next.config.ts` 301-redirects `/departures` → `/caravans/andean` and `/membership` → `/members`; those pages exist on disk but are unreachable.
- `lib/types.ts` still holds an orphan `Journey` type (its data source `content/journeys.ts` is deleted) with `seatsRemaining` and a `status` enum that conflicts with the spec's Fixed/Forming model — to be superseded in area C, not patched.
- Nav today: 6 primary items incl. `create-your-own-journey` and `departure-dates`; spec §2.3 reduces to 4. `SiteNavigation.tsx` is prop-less and reads `content/navigation.ts` directly.

## A. tokens — foundation (this pass)

- `content/spec-tokens.ts` — all 29 §13 tokens, typed, every `value: null` (unfilled). `specToken(name)` returns a visible `{{NAME}}` marker in dev and **throws in production**, so an unfilled token failing to a surface fails `next build` for any prerendered page. Recommended values in the spec ("3 recommended") are deliberately NOT encoded — they are guidance for the signer.
- `scripts/guard-spec-tokens.mjs` — static guard, runnable without vitest: (1) every §13 token present and unfilled/non-numeric; (2) no bare numeric literal on a price/fee/parametric key in `app|components|content|lib`; (3) no hardcoded `{{…}}` outside the token module (everything routes through it); (4) `pending-review/` imported nowhere.
- `tests/spec/spec-tokens.test.ts` — vitest wrapper + unit tests of dev/prod behaviour (blocked on the config decision).
- `pending-review/` with README — the only sink for pricing-agent output; the guard enforces the app never imports it.
- `package.json` gains `guard:spec-tokens`.

## B. navigation — §2.3

- `content/navigation.ts`: primary nav becomes exactly The Andean Caravan · Journeys · How it works · Membership. `create-your-own-journey` and `departure-dates` leave the nav; "Start one" becomes an honestly-disabled button on `/journeys`.
- `components/brand/SiteNavigation.tsx` adjusted (it special-cases ids); check the `caravans` mega-panel id against the new "The Andean Caravan" item.
- Resolve the `/membership` → `/members` redirect tension with the spec's "Membership" nav item (surface for review, likely point nav at the canonical route rather than editing redirects).

## C. taxonomy — §2, §7.2

- New journey model (fresh types, superseding the orphan `Journey`): `dateState: "fixed" | "forming"`, `provenance: "sawayatra" | "partner" | "member"`, `pricingModel: "laddered" | "fixed-seat"`. Forming-only fields (windows, demand, quorum, convener) type-gated so they cannot exist on Fixed.
- `/journeys` stops being a ComingSoon stub: one page, two groups (*Leaving on a date* / *Still forming*).
- Provenance badge component, unabbreviated, on every card (test asserts presence).

## D. travel-self — §3, §4, §6

- Passport three parts (face / reading / open space) on top of the existing v2.3 engine; browse-only gate (4.1) — visitor questionnaire stays private (already the shape of the current flow).
- DOB→bracket one-way (4.2); bracket displayed, never operative (4.3/4.4) — asserted by test.
- Two-signal model ({{LIVE_SIGNALS}}, {{STANDING_SIGNALS}}, {{STANDING_MONTHS}}, {{COOLDOWN_DAYS}}), locked non-disclosures, no acceptance-rate throttling.
- Graduated reveal stages 1–3 (§6.7), symmetric and logged, nothing asked at any stage (4.7); 4.6 held-with-explanation flow.

## E. departures — §6.3–6.6, §7

- Six-band ladder, ceiling 12, {{MIN_GROUP}} notch; `pricingModel` gates ladder vs flat.
- Paired from/today price as ONE component (4.9/7.4); single-number surfaces show today's price.
- Ladder component: all eight states + mobile treatment, tested.
- Lock/cancel/replace (§7.7) in order: replacement → fee holds price → lock; below-minimum decision at lock date.
- Upgrades separate beneath ladder; {{SINGLE_SUPPLEMENT}} named on page.
- Forming tools: demand map (density only), quorum call (approval voting), convener.

## F. membership — §5, §8

- Invitation-only; founding cohort waived for life, stated in the invite; house door open; sponsor accountability; removal + appeal.
- Three money lines ({{JOINING_FEE}} credited, {{SERVICE_CHARGE}} flat own line, optional {{HOUSEHOLD_FEE}}); §8.4 checkout order; **no tier table until §8 tokens are filled** — current `membershipTiers` in `content/membership.ts` reviewed against this.

## G. agents — §11

- Pricing agent: derivation + rounding {{PRICE_ROUNDING}}, sanity rails, writes to `pending-review/` only.
- Moderation agent: flags-never-blocks, never-flag hard list (incl. all non-English), single 4.6 hold, {{REVIEW_SLA}}, editor disclosure text.
- Shared: nothing final (4.11), full decision log, agents never see DOB/legal name/contact.

## H. states — §10

- Nine-state machine + reverse transitions; Lapsed marked, excluded from forming rosters and demand map.

## I. data-protection — §12

- Lawful basis, retention schedule, zero-retention identity docs (4.8), DOB one-way with no reconstruction path, agent logs as personal data, SAR/erasure + human-review routes; Terms and Privacy updated per §14 (current legal pages are placeholder stubs in `content/legal-placeholders.ts`).

## J. Non-code deliverables

- Decisions document ([SIGN-OFF] rows of §8/§13, §2.4, post-month-six allocation) and operator negotiation brief — tracked as documents, never invented values.

## K. §15 blocker

- Funnel arithmetic (cohort size, acceptance rate, 2028 dates offered) is unmodelled. Flagged: must be resolved **before §8 is priced**. Nothing invented.

## Standing blockers (carried in every report)

1. All [SIGN-OFF] tokens unfilled — see §13 register; no guesses.
2. §15 funnel model unresolved — blocks §8 pricing.
3. Test configs git-deleted — new tests cannot execute; decision needed on writing a *fresh* vitest/playwright config (counts as touching deleted paths, so: stop-and-ask).
4. Operator-dependent terms ({{REPLACEMENT_DEADLINE}}, manifest/rooming windows, feasible quorum dates) go to the operator brief only.
