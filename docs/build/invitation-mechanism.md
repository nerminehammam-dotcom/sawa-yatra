# Invitation mechanism — how a member actually gets in

Status: **the token and allocation layer is built and tested. No UI, no storage, no collection.**
Written 16 August 2026, after the founder set membership to invitation-only with
**two invitations per member** in the founding round.

Built:

- `lib/sawayatra/invitations.ts` — tokens and allocation. 37 tests.
- `lib/sawayatra/membership.ts` — the §10 states, the store port, and the two entry points
  (founder uncapped, member capped). 21 tests.

- `lib/sawayatra/db/schema.sql` — the Neon schema.
- `lib/sawayatra/db/neon-store.ts` — the Neon implementation of the store. **Not yet run against a
  live database.**

Not built, and blocked: every surface that collects anything (§6).

This note exists so the mechanism is decided on paper before anyone writes it. It records what
the spec already requires, what the codebase already has, what is missing, and what it costs.

---

## 1. What the spec fixes, and what it leaves open

Spec v3.1 specifies an **outcome**, not a mechanism. It never says OTP, magic link, or password.

**§3.1 — verification anchors.** Verbatim:

> The vouch, plus **two** of: verified email, verified mobile, a social or professional account
> confirmed by the sponsor as belonging to them.

So a new member needs the sponsor's vouch plus **two independent proofs**. The vouch is a third
factor that already exists by the time anyone lands on the site.

**§5.3 — sponsor accountability.** Every invitation carries its sponsor's name permanently in the
hidden record; if the invitee is removed for conduct, the sponsor's remaining allocation is
suspended and reviewed. Whatever is built has to carry sponsor identity with the invitation.

**§10 — the states.** Visitor → Invited → Registered → Verified. Only *Verified* sees the member
surface. So the mechanism has to move a person through three transitions, not one.

**§4.7.** Nothing is asked of a member before checkout — not money, not documents.

**§5.1 — the house door.** Invitations originate from a member *or from Sawayatra itself*, and the
door must stay permanently open so someone with no connection is never structurally excluded.

---

## 2. The invitation should be a signed link, not a one-time code

An OTP is a **challenge**: it assumes the person is already at your door and you are testing them.
An invitation is the opposite — you are reaching out to someone who is not there yet and has no
account to log into.

A signed link is the right shape. But an earlier draft of this note claimed it **proves control of
the address by construction**, and that is wrong — an adversarial review of the implementation
caught it. An opened link proves only that whoever opened it had the link. Mail is forwarded, and
corporate scanners such as Outlook Safe Links fetch URLs found in mail before any human sees them.

So two things follow, and both are implemented:

- Redemption requires the recipient to **state their address**, checked against the token. The
  parameter is required, not optional.
- Redemption must be a **POST behind an explicit confirmation**, never a bare GET, or a security
  scanner will burn the invitation on delivery.

With those, the link plus the stated address is a reasonable email anchor for §3.1. Without them it
is not an anchor at all.

### The machinery already exists

`lib/sawayatra/session.ts` implements exactly the right primitive:

- HMAC-SHA256 over a base64url JSON payload, `payload.signature`
- expiry inside the signed payload
- `timingSafeEqual` comparison, so signature checking is not timing-variable
- refuses to operate on a secret under 32 characters

`issueSessionToken` / `verifySessionToken` and `verifyInterestToken` are two existing uses of the
same pattern. An invitation token is a third, with a payload of roughly:

```
{ sponsorMemberId, inviteeEmail, allocationSlot, issuedAt, expiresAt }
```

No new dependency. No new cryptography. The work is a payload type, an issue/verify pair, a route
to land on, and the storage in §4 below.

---

## 3. Where a one-time code does earn its place

**The second anchor.** §3.1 needs two proofs, and the link gives one. The choice is:

| Second anchor | What it needs | Cost |
| --- | --- | --- |
| Verified mobile, by SMS code | An SMS vendor, a phone number from every member, a new personal-data category | Vendor account, per-message cost, more data to protect |
| Social or professional account, confirmed by the sponsor | Nothing. The sponsor ticks *this account belongs to this person* | None |

**Recommendation: sponsor confirmation for the founding round.** §3.1 already says social is
*"an anchor, not a requirement — a member with no public presence is not less suitable and in many
cases is more so."* For a founding cohort of a few dozen, SMS adds a vendor, a cost and a category
of personal data to protect, to prove something the sponsor can already attest. Revisit when
volume, not principle, demands it.

**Returning sign-in.** `/sign-in` has no mechanism today. Email one-time code or magic link is the
right pattern for a club with no passwords: nothing stored, nothing to breach, no reset flow, and
it matches §4.7. This is the place OTP belongs, and it is a separate piece of work from the
invitation.

---

## 4. The blocker: two invitations cannot be enforced without storage

Signed tokens are **stateless**. That is their virtue and their limit.

Nothing inside a token can stop a member forwarding the same link to two people, or stop a token
being redeemed twice. Enforcing *two per member, single use* requires a record of which
invitations exist and which are spent. So does §5.3, which requires the sponsor's name to persist
permanently, and §10, which requires a member to have a state that changes over time.

**There is no persistence layer in this repository.** No Prisma, Drizzle, Postgres, KV, Redis or
equivalent. Members are three hard-coded fixtures in `lib/sawayatra/server.ts` —
`member-1`, `member-2`, `member-3` — and interest is held in signed cookies.

This is the first thing on the site that genuinely cannot be built without a database. Everything
to date has been renderable from content files.

Minimum to support the founding round:

| Record | Fields | Why |
| --- | --- | --- |
| `member` | id, state (§10), email, sponsor id, joined at | §10 states, §5.3 chain |
| `invitation` | **id**, sponsor id, invitee email, slot, issued at, expires at, redeemed at, revoked at | allocation, single use, §5.3 |

Two tables. `id` is load-bearing: an earlier implementation identified invitations by
`(sponsor, email, slot)` and a review found that redeeming one could mark two records, costing a
member both invitations after a single person joined. `InvitationRecord` in
`lib/sawayatra/invitations.ts` is the shape the table should take.

The allocation rule as implemented is **not** the naive `count(invitation where sponsor = X) < 2`.
A lapsed or revoked invitation returns its slot, because the seat was never taken and holding it
open would quietly reduce a member's two to one. Redeemed invitations never return. Slot numbers
are never reused, so `UNIQUE(sponsor_id, slot)` is available as a database-level guard against the
concurrency in the note below.

**Concurrency.** The functions are pure over a caller-supplied list, so two simultaneous requests
reading the same list will both be allowed and both allocate. The caller must serialise per
sponsor, or rely on that unique constraint. This is stated in the module header and pinned by a
test; it cannot be fixed inside a stateless layer.

### The store port, and why three of its methods are atomic

`MembershipStore` in `lib/sawayatra/membership.ts` has two implementations:
`createInMemoryMembershipStore()` for tests, and `createNeonMembershipStore()` for Neon.

The three mutating invitation methods are **atomic by contract**, and that is not decoration.
Neon's HTTP transactions are **non-interactive** — `transaction()` takes a fixed array of queries,
so a read, a decision and a write cannot share one transaction. A list-then-save interface could
not be made race-free by any caller. Each mutation is therefore a single conditional statement the
database evaluates itself:

- `insertInvitation` — an `INSERT … SELECT … WHERE` that checks the allocation and the duplicate
  address in the same statement, backed by `invitation_slot_unique` and
  `invitation_one_live_per_sponsor`. A unique violation is caught and returned as a refusal.
- `markInvitationRedeemed` — an `UPDATE … WHERE redeemed_at IS NULL AND revoked_at IS NULL AND
  expires_at > now()`. The `WHERE` clause is what makes redemption single-use.
- `markInvitationRevoked` — the same shape.

Two tests pin the behaviour: two simultaneous issues cannot both take a member's last slot, and
two simultaneous redemptions of one link produce one member.

`canIssueInvitation` is still used, but only to produce a good refusal message and the remaining
count. **It is advisory. The store is the authority.**

### Setting Neon up

1. Create the project. **Choose an EU region** — members will be in the EU and Egypt, and residency
   under GDPR is a decision, not a default. It cannot be changed later without moving the project.
2. Run `lib/sawayatra/db/schema.sql` once. Nothing in the application creates or alters tables.
3. Set `DATABASE_URL` locally and in Vercel, and `SAWAYATRA_SESSION_SECRET` (at least 32
   characters — it signs session, interest and invitation tokens, so rotating it signs everyone out
   and invalidates every unredeemed invitation).

The schema deliberately has **no password column**, and no address, nationality or gender. The
first is a design choice; the other three are blocked — see §6 and §7.

### Removal and the sponsor's allocation

§10 says removal is terminal but *"re-entry requires a fresh invitation"*, while §5.3 says a
sponsor's remaining allocation is *"suspended and reviewed"* when their invitee is removed. Those
pull in opposite directions and the distinction is easy to get wrong — a first implementation let
the spent invitation block the re-invitation, and a lazier one would have handed the sponsor their
slot back.

As built: a removed member's spent invitation **no longer blocks** a fresh invitation to that
address, and **still counts** against the sponsor's allocation. Suspension is a club decision, so
`removeMember` reports which sponsor to review rather than acting on it. Both halves are pinned by
tests.

### Also missing

`SAWAYATRA_SESSION_SECRET` is **not set** in `.env.local` and not in the Vercel project.
`verifySessionToken` returns a signed-out viewer whenever the secret is absent or under 32
characters, so today every visitor is anonymous by construction and the session system, though
written, is inert.

---

## 5. The flow, end to end

1. **Sawayatra invites the founding cohort directly.** No member exists to sponsor them; §5.1
   calls this the house door. Sponsor is recorded as Sawayatra.
2. Invitee receives a signed link. Opening it satisfies the **email** anchor.
3. Invitee lands on a redemption page: state moves Invited → **Registered**. §3.1 fields are
   collected here — legal name, date of birth, email, mobile, social anchor, sponsor.
4. Sponsor confirms the social or professional account belongs to them. Second anchor satisfied.
   State moves Registered → **Verified**. Only now does the member surface appear.
5. A Verified member sees **two invitations**. Sending one writes an `invitation` record carrying
   their id, permanently (§5.3).

---

### Privacy of the allocation check

`canIssueInvitation` consults **only the asking sponsor's own invitations**. An earlier version
checked every sponsor's, which turned it into an oracle: any member could probe an address and
learn whether it had been invited to the club, without spending anything. Two sponsors may now both
invite the same person; the first redemption wins and the other is refused `already-member`.

## 6. What is still blocked, and by whom

| Blocker | Owner | Note |
| --- | --- | --- |
| Consent wording | Legal | `content/forms.ts` carries `PLACEHOLDER / LEGAL REVIEW: "Required consent wording has not been supplied. This mock checkbox is not final legal consent."` |
| Lawful basis for a non-member | Legal | `docs/data-protection/` is a draft for legal review; every category presupposes an existing member. There is no basis for holding an invitee's details before they are one |
| Copy for all three surfaces | Founder | The spec gives *fields*, not questions. No applicant-facing wording exists anywhere in the repo |
| `{{INVITES_PER_MEMBER}}` recorded in code | — | Signed as **2**, but `content/spec-tokens.ts`, which the decisions register says carries the tokens, was removed in the v2.4 restructure |
| §15 funnel model | Founder | The register warns the funnel arithmetic could change the invitation cap itself |

**Nothing that collects personal data should be built until the first two clear.**

---

## 7. Naming — "Join" is already taken three times

The site currently uses *join* for three unrelated things:

| Where | Means |
| --- | --- |
| `/journeys/join` — "Join an existing journey" | join a **journey** |
| `/journeys/caravans/andean-caravan/joining-points` | where you physically **board** the route |
| `/club` — "Join before you know where you're going", `/club/apply` — "Apply to join" | join the **club** |

Putting the invitation door under *Join* would be the fourth meaning, and the one most likely to
be misread — a visitor clicking "Join" would reasonably expect a journey.

**"Become a member" is also slightly wrong under this model.** It names an action the visitor
cannot take. Under invitation-only you do not become a member; you are invited and then you
register. A door labelled with an action that is unavailable reads as a dead end.

**Recommendation: `Membership`, inside The Club.**

- It names the subject, not an action, which is the only honest framing when the door opens from
  the other side.
- *The Club* already exists as a primary nav item, so membership sits beneath it without adding a
  fifth top-level entry.
- It leaves *join* to mean one thing — joining a journey — everywhere it appears.
- It survives the model changing. If invitations open more widely after month six (§5.2 leaves
  allocation open), "Membership" still reads correctly; "Become a member" and "Join" would both
  need rewriting again.

Suggested addresses, for decision:

```
/club/membership      what membership is, and that it is by invitation
/club/invitation/[token]   redemption, behind a signed link
/my/invitations       a member's two, behind sign-in
```

This would leave `/club/apply` and the `/request-invitation` → `/club/apply` redirect describing a
model that no longer exists. Both need retiring as part of the same change.
