---
description: Implement the Sawayatra Membership, Identity, Access & Pricing spec (v3.1) across the codebase — as hard constraints, with every monetary/parametric value kept as a token and nothing shipped on a guess.
argument-hint: "[area] — optional: tokens | navigation | taxonomy | travel-self | departures | membership | agents | states | data-protection | verify | all (default)"
---

# Build: Membership, Identity, Access & Pricing (spec v3.1)

You are implementing the Sawayatra membership/identity/access/pricing model defined in the
canonical spec. This command is the build prompt; the spec is the source of truth.

**Canonical spec (read it in full before anything else):**
`docs/specs/sawayatra-membership-identity-spec-v3.1.md`

`$ARGUMENTS` may name a single area to scope this run (see §3). Empty = plan the whole build,
then work area by area in the order below, pausing for review after each.

---

## 0. Orient before you touch anything

1. **Read the spec end to end** — `docs/specs/sawayatra-membership-identity-spec-v3.1.md`.
   Do not work from this command's summary alone; it is a map, not the territory.
2. **Read `AGENTS.md`.** This repo runs **Next.js 16.2.11**, which has breaking changes from
   model memory. For every Next API you touch (routing, metadata, server/client components,
   server actions/forms, `next/image`), read the matching guide under
   `node_modules/next/dist/docs/` first. Do not rely on remembered conventions.
3. **Inspect the working tree read-only** (`git status --short`, `git diff --stat`). It is
   mid-cleanup: a `todelete/` holding area exists and many files show as deleted. **Do not
   reset, restore, stage, commit, or delete any of it**, and do not remove `todelete/`. Work
   around it. Never run a destructive git operation.
4. If `$ARGUMENTS` is a single area, implement **only** that area. Otherwise produce the full
   plan and proceed in the §3 order, one area per pass.

---

## 1. Hard constraints — these outrank convenience, style, and your own judgement

**1.1 Tokens, never numbers (§13, §7 "Format only", §11.2 commit path).**
Every monetary or parametric value is a placeholder written `{{TOKEN}}` and collected in §13.
- **No numeric literal may ever stand in for a token.** Not "for now", not as a default, not in
  a test fixture that leaks to a surface, not in a comment that looks authoritative.
- Route **all** tokens through a single module — create `content/spec-tokens.ts` — where each
  token is a typed placeholder whose value is *unfilled*. An unfilled token must (a) render a
  visible `{{TOKEN}}` marker in dev, and (b) **fail the production build** if it reaches output.
  A placeholder that looks like a number will get shipped; make that impossible by construction.
- `[SIGN-OFF]` values are commercial decisions **not yet made**. Leave them as tokens and list
  them in your output. Do not infer them from the "recommended" notes in the spec — those are
  guidance for a human signer, not values.

**1.2 Locked rules 4.1–4.11 are invariants.** Implement each, and add a test that asserts it.
- 4.1 Browse-only until membership — no visitor sees any passport, member, roster, or interaction surface.
- 4.2 Date of birth never surfaces — anywhere. `DOB → age bracket` is **one-way** in the data model.
- 4.3 Age bracket appears on the passport — derived, never member-editable.
- 4.4 Age bracket is **displayed, never operative** — never a filter, sort key, matching input, facet, search param, or API query field.
- 4.5 The open space is fully public to members — anonymity is member-elective, never enforced.
- 4.6 No contact details in the open space — held with a plain explanation and a route to a human, **never a silent disappearance**.
- 4.7 **Nothing is asked before checkout — not money, not documents.** No deposit at interest, mutual interest, matching, or group formation.
- 4.8 Identity documents are verified and **destroyed** — record pass/fail, date, verifier; delete the image immediately. Zero retention.
- 4.9 A headline ("from") price **never** appears without today's real price beside it, same block, comparable weight.
- 4.10 The share card is a separate artefact — a static image generated on export (§9).
- 4.11 No agent decision is final — agents propose, a human commits (§11).

**1.3 No dark patterns (§7.6).** No countdown timers, no "seats left" where the honest frame is
"travellers so far", no band that appears to expire. Urgency here is real and additive; never dress it as scarcity.

**1.4 Provenance is always shown (§2.2).** Every journey card carries `Sawayatra · Partner ·
Member-made`, unabbreviated, never soft-pedalled.

**1.5 The paired price is one component (§4.9, §7.4).** The "from {{PRICE_T6}}" floor and
"today, {{PRICE_Tn}} each" live figure are a **single, inseparable** unit. A surface that can
show only one number shows **today's price, never the floor**.

**1.6 Agents are bounded (§11).** Pricing-agent output is indicative round figures that **never**
reach a member-facing surface (it writes to `pending-review/`; the build reads tokens, not agent
output). The moderation agent **flags, never blocks/hides/deletes/edits/delays** — the single
permitted hold is 4.6 contact details. Respect the **never-flag** list (grief, illness/disability/
mental health, religion, sexuality/gender, political history/displacement/war, and any non-English
content). Neither agent ever sees DOB, legal name, or contact details.

---

## 2. Method for each area

For every area you pick up:
1. **Re-read** the relevant spec sections (cited per area below).
2. **Read the Next 16 docs** for any framework API you'll use.
3. Write a **short plan** (files to add/change, data-model shape, component contracts, tests).
4. Implement **behind `content/spec-tokens.ts`** — never a raw value on a surface.
5. Add **tests that assert the locked rules** for this area (see §4).
6. Run what you can (`typecheck`, `lint`, `test`, `test:e2e`) — note that the cleanup may have
   moved some configs; if a script fails for that reason, report it, don't "fix" it by restoring.
7. Summarize and **pause for human review** before the next area. Keep changes small and reviewable.
   Do **not** commit without explicit human sign-off.

---

## 3. Build order & checklist (the §14 downstream map)

Work top-down; each area assumes the ones above it. `$ARGUMENTS` picks one; default is all.

### A. `tokens` — token + guardrail scaffolding (foundation)
- [ ] `content/spec-tokens.ts`: every §13 token as a typed, **unfilled** placeholder; dev renders
      `{{TOKEN}}`, prod build fails if an unfilled token is emitted.
- [ ] A lint/test guard that fails on a bare numeric literal in any price/fee/budget surface.
- [ ] Create `pending-review/` as the only sink for pricing-agent output (never imported by the app).

### B. `navigation` — §2.3
- [ ] Nav is exactly: **The Andean Caravan** · **Journeys** · **How it works** · **Membership**.
- [ ] "Create your own" stops being a destination and becomes a **Start one** button on Journeys;
      honestly **disabled** in Release 1 (one disabled CTA, not a dead section).
- [ ] Files: `components/brand/SiteNavigation.tsx`, `content/navigation.ts`, affected `app/(public)` routes.

### C. `taxonomy` — Fixed / Forming + provenance + pricing model — §2, §7.2
- [ ] Journey model gains **date-state** (`fixed | forming`), **provenance** (`sawayatra | partner | member`),
      and **pricing-model** (`laddered | fixed-seat`).
- [ ] **Journeys** = one page, two groups: *Leaving on a date* / *Still forming*.
- [ ] Provenance renders as a badge on every card (1.4). Windows/demand/quorum/voting/conveners are **Forming only**.

### D. `travel-self` — passport, identity, signals, reveal — §3, §4, §6
- [ ] Passport three parts: **face** (archetype icon, name, four keywords, age bracket) / **reading**
      (five axes, description) / **open space** (member-authored, fully public to members — 4.5).
- [ ] Browse-only gate (4.1): a visitor may take the questionnaire and get their archetype **privately** only.
- [ ] DOB never surfaces (4.2); bracket displayed not operative (4.3, 4.4); open-space contact-detail
      handling (4.6) as a held-with-explanation flow.
- [ ] **Two-signal model** replacing the single bound signal (§6.2): **live** (`{{LIVE_SIGNALS}}`, journey-bound)
      and **standing** (`{{STANDING_SIGNALS}}`, person-bound, invisible, expires `{{STANDING_MONTHS}}`),
      with the locked non-disclosures, cool-down `{{COOLDOWN_DAYS}}` (§6.8), and **no** acceptance-rate throttling (§6.9).
- [ ] **Graduated reveal** (§6.7): stage 1 mutual → first name + message + full passport; stage 2 commit →
      **photograph + first name only**; stage 3 checkout → legal name to Sawayatra + identity check;
      co-traveller names per `{{ROSTER_NAME_POLICY}}`. Symmetric and logged. **Nothing asked at any stage** (4.7).

### E. `departures` — pricing ladder, paired price, lock/cancel/replace, upgrades, forming tools — §6.3–6.6, §7
- [ ] Six bands (§7.3) `{{PRICE_T1}}`–`{{PRICE_T6}}`, ceiling 12, `{{MIN_GROUP}}` visible from the start.
- [ ] `pricing-model` gates **ladder vs flat** (§7.2) — never a ladder on fixed-seat inventory.
- [ ] The **from/today block** as one inseparable component (1.5, §4.9, §7.4).
- [ ] **Pricing ladder** component (§7.5) with **all eight states** — empty, below-minimum, at-minimum,
      mid-band, final-band, locked, closed, cancelled — **and** the mobile treatment (part of the spec, not an afterthought).
- [ ] Lock date `{{LOCK_DAYS}}`, and §7.7 in order of preference: **replacement** (existing verified member,
      passes checkout identity check, remaining travellers notified `{{SUBSTITUTION_NOTICE}}`, closes `{{REPLACEMENT_DEADLINE}}`),
      then **cancellation fee holds the price** (`{{CANCELLATION_TERMS}}`, shortfall → `{{SHORTFALL_HOLDER}}` [SIGN-OFF]),
      then lock. Below `{{MIN_GROUP}}` at lock → full refund, **decided and communicated at the lock date**.
- [ ] Upgrades (§7.8) **separate, beneath the ladder**; single occupancy `{{SINGLE_SUPPLEMENT}}` named on the page;
      an upgrade never moves anyone else's band. No dark patterns (1.3).
- [ ] Forming-only tools: **demand map** (§6.4, density only, no names), **quorum call** (§6.5, approval voting,
      operator-feasible dates, `{{QUORUM_TRIGGER}}` above `{{MIN_GROUP}}`), **convener** (§6.6).

### F. `membership` — invitation + money — §5, §8, Brand build §8.6
- [ ] Invitation-only; founding cohort **free, waived for life, stated in the invite** (§8.1); house door
      always open (§5.1); `{{INVITES_PER_MEMBER}}` (§5.2); sponsor accountability (§5.3); removal + appeal (§5.4).
- [ ] Money as three separate lines: joining `{{JOINING_FEE}}` (credited), service charge `{{SERVICE_CHARGE}}`
      (flat, own line), optional `{{HOUSEHOLD_FEE}}`. Checkout order per §8.4 — nothing appears at the last
      step that was not visible at the second. **No tier table until §8 tokens are filled.**

### G. `agents` — §11
- [ ] Pricing agent: indicative round figures + derivation, mandatory rounding `{{PRICE_ROUNDING}}`, sanity
      rails (monotonic, within `{{PRICE_ENVELOPE}}`, band 6 ≥ floor, derivation reconciles), writes to
      `pending-review/` only (1.6).
- [ ] Moderation agent: flags-never-blocks, never-flag hard list, the one permitted 4.6 hold, queue SLA
      `{{REVIEW_SLA}}`, member-facing disclosure text at the open-space editor.
- [ ] Shared: no decision final (4.11); every decision logged (input, output, rule fired, timestamp,
      human); members told an agent is involved; agents never see DOB/legal name/contact.

### H. `states` — §10
- [ ] Nine-state machine (Visitor → … → Travelled, plus Lapsed, Removed) with the passport-visibility column
      and the **reverse transitions**. Lapsed passports are marked and **excluded from any forming roster and the demand map**.

### I. `data-protection` — §12 (+ Terms of membership, Privacy notice)
- [ ] Lawful basis per category; retention schedule; identity docs **zero retention** (4.8);
      DOB→bracket one-way with **no** export/admin/API reconstruction; agent logs treated as personal data;
      documented subject-access/erasure and human-review routes. Update Terms and Privacy per the §14 rows.

### J. Non-code deliverables (track, don't fabricate)
- [ ] **Decisions document**: record the [SIGN-OFF] rows (§8, §13), §2.4, post-month-six allocation.
- [ ] **Operator negotiation brief**: §7.7 replacement deadline + manifest/rooming window; whether
      cancellation fees are retained to hold group price; §6.5 candidate dates must be operator-feasible.

### K. `§15` — the funnel arithmetic (blocker, do not skip)
- [ ] **Flag** that the funnel model (cohort size, acceptance rate, 2028 dates offered) is unmodelled and,
      per §15, must be resolved **before §8 is priced**. Do not invent any of it.

---

## 4. Verification — run before calling any area "done"

- [ ] **No bare number on a value surface** — grep price/fee/budget rendering; everything resolves through `content/spec-tokens.ts`.
- [ ] **Age bracket is not operative** (4.4) — assert it exists as no filter, sort, matching input, facet, search param, or API field.
- [ ] **DOB is unreachable** (4.2, §12) — assert it appears in no serialized response, export, admin view, or API; `DOB→bracket` one-way.
- [ ] **Paired price** (4.9, 7.4) — from and today always render together; single-number surfaces show today's price, never the floor.
- [ ] **Pricing model gates display** (7.2) — no ladder ever renders on fixed-seat inventory.
- [ ] **Ladder completeness** (7.5) — all eight states plus the mobile treatment exist and are tested.
- [ ] **Provenance badge** (2.2) — present and unabbreviated on every card.
- [ ] **Reveal + no-ask** (6.7, 4.7) — stages exactly as specified; nothing (money or documents) requested before checkout.
- [ ] **Moderation bounds** (11.3) — never blocks except the 4.6 hold; never-flag list honoured, including non-English content.
- [ ] **Pricing-agent isolation** (11.2) — its output cannot reach a member surface and lands only in `pending-review/`.
- [ ] Run `typecheck` / `lint` / `test` / `test:e2e` where configs exist; report cleanup-related gaps rather than restoring deleted config.
- [ ] For a full-spec run, do a dedicated **subagent verification pass** over the locked rules 4.1–4.11.

---

## 5. Stop and ask — do not push through these

- A `[SIGN-OFF]` value is needed to proceed → **stop**, surface exactly which, keep the token. Never guess.
- §15 funnel model is unresolved and you're about to touch §8 pricing values → **stop** and flag.
- Something requires an operator agreement (dates, deadlines, manifest windows) → record it in the operator
  brief; do not fabricate terms.
- Implementing would require disturbing `todelete/`, restoring deleted files, or any destructive git → **stop and ask**.

---

## 6. Report

End every run with: what changed per area; which tokens were introduced (all unfilled); which tests were
added and their results; and the outstanding `[SIGN-OFF]`, operator, and §15 blockers. **Do not commit
without explicit human approval.**
