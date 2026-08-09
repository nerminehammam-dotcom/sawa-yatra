# Sawayatra — Data protection (spec v3.1 §12)

Status: draft for legal review. This is the section where getting it wrong
causes damage a later redesign cannot repair.

## Lawful basis per category

| Category | Data | Basis |
|---|---|---|
| Account | Email, mobile | Contract (membership) |
| Eligibility & insurance | Date of birth, legal name | Contract + legal obligation |
| Identity verification | Document check outcome only | Legal obligation / legitimate interest |
| Passport (Travel Self) | Archetype, keywords, reading, open space | Contract; open space is member-authored and member-elective |
| Signals & matches | Live/standing signals, reveal log | Contract |
| Sponsor chain | Sponsoring member (hidden) | Legitimate interest (club safety, §5.3) |
| Agent logs | Moderation/pricing decision entries | Legitimate interest; personal data in their own right (§11.1) |
| Payments | Handled by processor | Contract. Sawayatra stores no card data; confirm the processor holds partial-payment state across a group's lifetime (§7.7 settlement and refunds) |

## Retention schedule

| Data | Retention |
|---|---|
| Identity document images | **Zero.** Verified and destroyed immediately (rule 4.8). Record kept: pass/fail, date, verifying party — nothing else |
| DOB | Held in hidden profile only; never exported. DOB → age bracket is one-way in the data model — no export, admin view or API response can reconstruct a date of birth (rule 4.2; enforced by `lib/membership/identity.ts` and its tests) |
| Agent decision logs | Personal data with their own retention rule (`lib/agents/decision-log.ts` carries the classification); period to be set at legal review |
| Removed members | Open space deleted (§10); hidden record retained per legal obligation and sponsor-accountability review |

## Member rights

- Documented subject access and erasure route.
- A route to human review of every automated decision (§11.1): members are
  told an agent is involved; an unreviewed moderation flag expires and the
  content stands; no agent decision is ever final (rule 4.11).
- Removal: written reason from documented grounds, appeal to a named human
  (§5.4).

## Enforcement in code (this build)

- `lib/membership/identity.ts`: one-way `deriveAgeBracket`; serialization
  helpers structurally exclude DOB/legal name; `assertNoHiddenFields` deep
  scan; `assertBracketNotOperative` rejects bracket-keyed queries (rule 4.4).
- `lib/agents/decision-log.ts`: `assertAgentBlind` — agents never see DOB,
  legal name, or contact details.
- `lib/membership/reveal.ts`: `IdentityCheckRecord` cannot carry an image.
- Tests: `tests/spec/identity.test.ts`, `decision-log.test.ts`, `reveal.test.ts`.
