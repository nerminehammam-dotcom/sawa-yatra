<!--
  Canonical copy of the Membership, Identity, Access & Pricing spec v3.1.
  Converted from sawayatra-membership-identity-spec-v3.1.md.docx on 2026-08-08.
  Source of truth for the /implement-membership-spec command. Do not paraphrase values —
  every monetary/parametric value is a {{TOKEN}} collected in §13; nothing ships with a guess.
-->

# Sawayatra — Membership, Identity, Access & Pricing

## Specification v3.1

**Status:** pending-review/ — contains commercial decisions reserved to
[SIGN-OFF] (§8, §13). **Supersedes:** v3.0.

**Changed in v3.1**

  - > §7.4 rewritten — the individual price ceiling is **removed**.
    > Price moves with the group in both directions, quoted as
    > **"from"** with today's real price always beside it.

  - > §7.7 rewritten — cancellation fees now hold the remaining
    > travellers' price. **Replacement** added: a cancelling member may
    > find a verified member to take their seat.

  - > §6.7 — reveal stage 2 is **photograph and first name only**. Full
    > name is held to checkout.

  - > 4.7 — **no money at any point before checkout.** No deposit at
    > interest, at matching, or at group formation.

**Carried from v3.0**

  - > §2 — the Fixed / Forming taxonomy, resolving the four-label
    > collision.

  - > §6 — two signal kinds, windows instead of dates, published demand
    > density, quorum calls, conveners.

  - > §7.2 — journeys carry a pricing model; not everything is laddered.

  - > §11 — the two agent briefs. Pricing agent produces **indicative
    > round figures only**. Moderation agent **flags, never blocks**.

  - > §10 — state machine with reverse transitions.

**All monetary values are tokens, not numbers**, written {{TOKEN}} and
collected in §13. No numeric literal may be substituted for a token
anywhere in the build. Pricing follows the operator agreements; a
placeholder that looks like a number will end up shipped.

## 1. The model in one paragraph

Sawayatra accepts members by invitation only. For the first six months
invitations come exclusively from personal referral by an existing
member, and membership is free for that founding cohort. The public site
is browse-only: a visitor reads everything about the club and the route
but sees no member and no Travel Self until they join. Every member
holds a **hidden real profile** and a public **Travel Self Passport**;
the passport is the only identity inside the club. Members hold interest
in one another, journeys either have a date or acquire one from the
people who gather, and the real profile opens gradually — first name at
mutual interest, photograph when two people commit to a section
together, identity documents only at checkout.

## 2. What a journey is

The site has carried four competing labels for one purchasable thing.
The resolving distinction is not who made a journey but **whether its
date exists yet.**

### 2.1 The two states

**Fixed** — the date is real and immovable. The member's decision is yes
or no. The Andean Caravan sections are Fixed; it runs once a year and
the vehicle passes through Cusco when it passes through Cusco.
Partner-seeded journeys are Fixed.

**Forming** — the date does not exist yet. It is decided by whoever
gathers. Member-created journeys are Forming, and remain so until a date
is set.

Everything in §6.3–6.6 — windows, demand density, quorum calls, voting,
conveners — belongs to **Forming only**. None of it touches Fixed. On a
Fixed journey the date is the given; what moves is who is aboard, and
therefore the price.

### 2.2 Provenance is a badge, not an axis

|               | **Fixed**                                          | **Forming**                            |
| ------------- | -------------------------------------------------- | -------------------------------------- |
| **Sawayatra** | The Andean Caravan — nine sections, one annual run | —                                      |
| **Partner**   | Seeded operator journeys                           | —                                      |
| **Member**    | —                                                  | Created; open to joining while forming |

The empty cells are the point. Provenance and date-state have been doing
the work of one distinction under two names, which is how four labels
appeared.

Provenance still matters — a member is entitled to know whether the
club, an operator or another member stands behind a journey — so it
renders as a badge on every card: **Sawayatra · Partner · Member-made**.
Never soft-pedalled, never abbreviated away. A member who discovers late
that the club was largely resold operator inventory reacts badly; a
member who saw the badge from the first day does not mind at all.

### 2.3 Navigation consequence

The Caravan leaves the taxonomy fight entirely — it is the flagship and
the reason people arrive, so it is named in the nav the way a maker
names one model.

  - > **The Andean Caravan**

  - > **Journeys** — one page, two groups: *Leaving on a date* / *Still
    > forming*

  - > **How it works**

  - > **Membership**

*Create your own* ceases to be a destination and becomes a button on
Journeys — **Start one**. This also disposes of the dead-nav problem
while Create is disabled in Release 1: a single honest, disabled CTA is
far better than an entire unreachable section.

### 2.4 Health metric, not a hope

Partner-seeded inventory is a sound launch tactic and a slow poison if
it stays dominant: a club whose journeys are mostly resold operator
seats is a marketplace with a questionnaire attached. Write down a
target for partner-seeded share of live journeys falling below
{{PARTNER_SHARE_TARGET}} by {{PARTNER_SHARE_DATE}} and review it as
a metric. [SIGN-OFF]

## 3. The two objects

### 3.1 The hidden profile

Collected at joining. Never displayed. Never partially displayed.

| **Field**                   | **Purpose**                                | **Ever public?**               |
| --------------------------- | ------------------------------------------ | ------------------------------ |
| Legal name                  | Identity, booking, insurance               | Stage 3 — checkout only (§6.7) |
| Date of birth               | Eligibility, insurance, bracket derivation | **Never — rule 4.2**           |
| Email                       | Account, contact                           | No                             |
| Mobile                      | Account recovery, on-route contact         | No                             |
| Social or equivalent anchor | Verification                               | No                             |
| Sponsoring member           | Accountability chain                       | No                             |

**Verification anchors.** The vouch, plus **two** of: verified email,
verified mobile, a social or professional account confirmed by the
sponsor as belonging to them.

Social media is an anchor, not a requirement — a member with no public
presence is not less suitable and in many cases is more so. Where a
sponsor confirms an account the confirmation is strictly factual: *this
account belongs to this person.* It is never an assessment of what the
account contains. No sponsor is asked to approve anyone's taste,
politics or output, and no such criterion exists anywhere in Sawayatra's
vetting.

### 3.2 The Travel Self Passport

**Part one — the face.** Illustrated archetype icon, archetype name,
four keywords, age bracket. The unit that appears in a roster, a card, a
section page, a share.

**Part two — the reading.** Opens on click. Questionnaire-derived: the
five axes in the introductory register, the archetype description, what
this traveller is like on a long road.

**Part three — the open space.** Member-authored and open in kind —
photographs, notes, hobbies, interests, anything they want the room or a
future companion to know. Fully public to members.

## 4. Locked rules

**4.1 — Browse-only until membership.** No visitor sees any passport,
member, roster or interaction surface. A visitor may take the
questionnaire and receive their archetype privately; visibility of and
by others begins at membership.

**4.2 — Date of birth never surfaces.** Not on the passport, not in the
open space, not in a filter, not in an export, not in a share card, not
to a matched member, not in aggregate, not in an admin view a member
could be shown. It exists in the hidden profile for eligibility and
insurance and nowhere else. DOB → bracket is one-way in the data model.

**4.3 — Age bracket appears on the passport.** Derived, never
member-editable. Being open to all ages does not mean age is concealed:
a traveller deciding on seventy-one days on a road is entitled to know
roughly who is beside them. Brackets: **20s · 30s · 40s · 50s · 60s ·
70s · 80+**

**4.4 — Age bracket is displayed, never operative.** Not a filter, sort
key, matching input, facet, search parameter or API query field. A
displayed bracket informs a person; an operative bracket lets the room
sort itself by age, which is both what calendar sovereignty exists to
refuse and a legal exposure. Making it filterable amends this document;
it is not a feature request.

**4.5 — The open space is fully public to members.** Anonymity inside
Sawayatra is member-elective. A member who posts their own photograph
and name has chosen to be known. The club does not enforce anonymity; it
enforces the option of it.

**4.6 — No contact details in the open space.** No email addresses,
phone numbers, social handles, messaging IDs, personal URLs, QR codes,
or contact details rendered inside images.

*Honest note on enforcement:* pattern-matching catches structured
strings and misses "same name on instagram", a handle written into a
photograph, and numbers spelled in words. Expect roughly two-thirds
coverage. The filter is a speed bump; the enforcement is the term of
membership plus member reporting. The rule is absolute contractually,
not technically.

Handling: held with a plain explanation and a route to a person — never
a silent disappearance. A member pasting a handle is being friendly, not
misbehaving, and the message reads that way. Repeat instances reach the
sponsor chain.

**4.7 — Nothing is asked of a member before checkout — not money, not
documents.** No deposit at interest, at mutual interest, at matching, or
at group formation. No identity document until checkout. The first time
a member pays anything or proves anything is the moment they commit to a
named journey.

Sincerity is controlled structurally (§6), never financially. A deposit
at matching would turn an expression of curiosity into a transaction and
the double opt-in would stop feeling like two people finding each other.

**4.8 — Identity documents are verified and destroyed.** Record
pass/fail, date, verifying party. Delete the image immediately.
Sawayatra never retains scans of members' identity documents.

**4.9 — A headline price never appears without today's price beside
it.** §7.4.

**4.10 — The share card is a separate artefact.** §9.

**4.11 — No agent decision is final.** §11.

## 5. Invitation

**5.1 The founding door.** For six months, invitations originate from an
existing member or from Sawayatra itself. The house door is not
decoration: at launch there are no members, and it must remain
permanently open so a worthy applicant with no connection into the club
is never structurally excluded.

**5.2 Allocation.** {{INVITES_PER_MEMBER}} per member in the founding
period — three recommended. The clearest cause of decline in comparable
clubs is invitation inflation: quality holds while invitation rights are
scarce and collapses when they are handed out broadly. Allocation after
month six is open (§13).

**5.3 Sponsor accountability.** Every invitation carries its sponsor's
name permanently in the hidden record. If an invited member is removed
for conduct, the sponsor's remaining allocation is suspended and
reviewed. This is what makes a vouch mean something — and in a vouched
club of a few hundred it is a stronger safety instrument than any
automated review.

**5.4 Removal and appeal.** Removal requires a written reason from a
documented list of grounds, and every removed member has a stated appeal
route to a named human. Removal without cause or appeal is the specific
failure that has produced litigation and lasting reputational damage in
comparable clubs, and it is trivially avoidable.

## 6. Interest, dates, and reveal

### 6.1 What the design has to survive

Mutual interest opens a real identity, so a member could in principle
signal indiscriminately to harvest it. v2.0 solved this by requiring
every signal to be bound to a named section and named dates — which
worked, and cost most of the club's matches, because in a small pool two
well-matched people rarely have the same date in mind eighteen months
out.

The precondition is **removed**. It was belt-and-braces: the graduated
reveal (§6.7) already empties the prize — a successful insincere signal
yields a first name, a message the other party can end, and a passport
already public to every member. The signal budget caps volume. Nothing
further was needed, and the cost was the product.

### 6.2 Two kinds of signal

**Live signal — "Ask to travel together."** Bound to a specific journey
the member is committing attention to. Budget: {{LIVE_SIGNALS}} held at
once — three recommended. To signal a fourth, withdraw one. On mutual,
both are notified immediately.

Scarcity does two jobs. It makes indiscriminate signalling
arithmetically impossible, and — worth more — a signal that cost the
sender something is read by the receiver as meaning something.

**Standing signal — "I'd travel with you."** Bound to a person, no
calendar. Held in the member's own shortlist, visible to nobody, never
notified in either direction. It converts to a match only when both
members hold standing interest in each other **and** both are looking at
the same journey or window. At that instant both are told,
simultaneously, and the reveal begins at stage one.

Budget: {{STANDING_SIGNALS}} — ten recommended. A shortlist, not a
stream. Expires after {{STANDING_MONTHS}} with a quiet prompt to renew.
Withdrawal is silent at every stage.

A standing match does not consume live budget. It arrives unbidden.

**Locked:** no member is ever told that they hold a one-sided standing
signal, that one is held on them, or that a standing pair awaits
overlap. Any of those disclosures reconstructs the one-sided reveal the
double opt-in exists to prevent.

**Locked:** interest signals never reference age bracket, and the pool
is never orderable by it (4.4).

### 6.3 Windows, not dates — *Forming only*

On Forming journeys a member marks a **window**, not a day. *Section 4,
sometime southern autumn.* Ranges intersect far more often than points;
this is the largest arithmetic gain available and it costs one field.

It is also truer. Nobody choosing a three-week section of the Andes has
a fixed Tuesday in mind eighteen months out, and asking for a date they
do not have produces false precision that then fails to match.

Granularity: {{WINDOW_GRANULARITY}} — season, month, or six-week block.
Marked windows capped at {{CONSIDERING_MAX}} — three recommended, both
because nobody is seriously weighing nine and because it prevents
manufacturing overlap by marking everything.

### 6.4 The demand map — *Forming only*

Every member sees, anonymised, where the club is looking:

> **Section 4 · Cusco to Uyuni** Southern autumn — 11 members
> considering Southern spring — 3 members considering

No names, no passports, no archetypes. Density only.

This is the substantive replacement for waiting. A flexible member can
move to where the people are instead of colliding with them by luck. It
costs nothing, it is honest, and it turns the long stretch before
February 2028 into something with visible motion. It is also the funnel
model, live, without a survey.

### 6.5 The quorum call — *Forming only*

When a window accumulates {{QUORUM_TRIGGER}} mutually-interested
members, Sawayatra issues a call to exactly those members:

> *Eight of you are looking at Section 4 in southern autumn. Here are
> three dates the road allows. Mark every one that works for you.*

Candidate dates come from what the operator can actually run — never
invented. Members mark **all** that work: approval voting, not single
choice, because approval finds the option most people can live with
rather than the one with the loudest plurality. Widest coverage becomes
a real departure with a live ladder and the journey moves to **Fixed**.
Anyone whose dates did not survive stays in the window for the next
call.

{{QUORUM_TRIGGER}} should sit **above** {{MIN_GROUP}}, so a vote can
lose people without collapsing the departure.

### 6.6 The convener — *Forming only*

Any member may propose a date and become its anchor. It appears in the
window as *proposed by a member — seven considering.* No authority, no
discount, no fee. Just the act.

A proportion of any club are organisers by temperament and the product
currently gives them nothing to do. One convener with conviction fills a
section faster than any algorithm.

### 6.7 The reveal, graduated

| **Stage** | **Trigger**                       | **What opens**                                                                                     |
| --------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1         | Mutual interest, live or standing | First name, private message channel, passport in full                                              |
| 2         | Both commit to the same journey   | **Photograph and first name. Nothing more.**                                                       |
| 3         | Checkout                          | Legal name to Sawayatra alone, with the identity check. To co-travellers: {{ROSTER_NAME_POLICY}} |

A face and a first name are what two people need in order to plan
together and recognise each other at a gate city. A surname is what a
stranger needs in order to search for you, and it buys the member
nothing at this stage. So it is held.

**Nothing is asked at any of these stages** (4.7). Stage 2 carries no
deposit, no hold, no commitment fee. The word *commit* here means both
members have said they intend to travel together, not that either has
paid.

Reveal is symmetric and logged: both are told at the same instant and
each sees that the other saw them. There is no vantage point from which
a member looks without being seen to have looked.

**Open — {{ROSTER_NAME_POLICY}}.** Whether confirmed co-travellers on
the same section see one another's legal names at checkout, or continue
on first names through the journey. Seventy-one days in one vehicle
argues for the former; the club's whole register argues for the latter,
and in practice people exchange surnames themselves within a day. My
inclination is first names throughout, with legal names held by
Sawayatra for the manifest. [SIGN-OFF]

### 6.8 Cool-down

A withdrawn signal cannot be re-sent to the same member for
{{COOLDOWN_DAYS}} days. Applies to both kinds.

### 6.9 Deliberately not built

**No acceptance-rate throttling.** Restricting members whose signals are
rarely reciprocated would punish people for being less popular, compound
against exactly the quieter members the archetype system exists to
serve, and become the club's most resented feature within a month. The
budgets already cap volume.

## 7. Pricing

**Format only. Every figure is a token.**

### 7.1 The principle

Per-person price falls as the group grows: the fixed costs of the road —
vehicle, guide, permits, host — divide across whoever is aboard.

Handled correctly this is also the best growth mechanic Sawayatra has.
Every additional traveller lowers the price for everyone already
committed, so members become recruiters by arithmetic rather than by
incentive scheme.

### 7.2 Not every journey is laddered

Every journey carries a **pricing model** attribute:

  - > **laddered** — per-person price falls by band. The Caravan
    > sections and member-formed journeys.

  - > **fixed-seat** — a flat per-person rate on operator inventory,
    > unaffected by group size. Many Partner journeys.

The page renders one component or the other. Showing a ladder on
fixed-seat inventory would be a straightforward lie, and this attribute
is what prevents it.

### 7.3 The bands

Six bands per section, same shape everywhere so a member learns to read
it once.

| **Band** | **Group size** | **Per person** |
| -------- | -------------- | -------------- |
| 1        | 1 traveller    | {{PRICE_T1}}  |
| 2        | 2–3            | {{PRICE_T2}}  |
| 3        | 4–5            | {{PRICE_T3}}  |
| 4        | 6–7            | {{PRICE_T4}}  |
| 5        | 8–9            | {{PRICE_T5}}  |
| 6        | 10–12          | {{PRICE_T6}}  |

Ceiling twelve. A **minimum viable group** {{MIN_GROUP}} is set per
section; below it the section does not run and money is returned in
full. That number is visible on the page from the beginning, never
discovered later.

### 7.4 One price for the table, quoted from the floor

There is no individual ceiling. Every member on a section pays the same
per-person price, which is the price at the size the group has reached.
It moves as the group moves, and it is settled at the lock date (7.7).

The headline is the floor: **from {{PRICE_T6}} per person.**

**Locked rule 4.9 — the headline never appears alone.** Wherever the
"from" figure renders — section page, card, search result, share, email
— today's actual price renders with it, in the same block, at
comparable weight:

> **From {{PRICE_T6}} per person, at twelve travellers.** Four
> travellers so far — today, {{PRICE_T3}} each. Every traveller who
> joins lowers it for everyone.

This rule is not a style preference. "From" quoting without the live
figure beside it is the structure of budget-airline pricing: the
cheapest number on the page, the real number at checkout, and a member
who feels handled. That is the single move most capable of undoing the
trust the rest of this document is built on, and your members will
recognise it on sight. Shown together, the same two numbers read as
candour — here is the best it gets, here is where we are, here is how
the gap closes.

Where a surface can render only one number, it renders **today's
price**, never the floor.

### 7.5 The display

On every laddered journey, a **pricing ladder** — the section's live
state, not a table dropped into the layout.

  - > Six bands drawn horizontally, riso palette.

  - > Current band marked: *you are here.*

  - > Bands reached in darker ink; bands ahead lighter, as possibility.

  - > The {{MIN_GROUP}} notch on the ladder.

  - > One live line beneath: **"Six travellers so far. Two more and the
    > price falls to {{PRICE_T4}} — for everyone, including you."**

That last line is the design. True, specific, points at a benefit shared
with strangers, and contains no scarcity theatre — nothing is running
out, something is being reached.

Always present in small type: *everyone at this table pays the same. The
price is set by how many of us there are, and settles* {{LOCK_DAYS}}
*days before departure. If more travellers join, it falls — for all of
us.*

**Required states** — the component must be specified for all of: empty
(no travellers yet), below minimum, at minimum, mid-band, final band,
locked, closed, cancelled. **Mobile:** six horizontal bands do not fit
at 380px; the vertical or condensed treatment is part of the component
spec, not an afterthought.

### 7.6 Never

No countdown timers. No "seats left" where the truthful frame is
"travellers so far". No band that appears to expire. The urgency here is
real and additive; dressed as scarcity, members read the dress and stop
believing the number.

### 7.7 Lock date, cancellation, and replacement

Price moves with the group, so a departure moves it too. Three
mechanisms handle that, in order of preference: replacement, then the
cancellation fee, then the lock date.

**Lock date.** {{LOCK_DAYS}} before departure — sixty recommended — the
price **settles**. Before it, the price moves in both directions with
the group. After it, it is final for everyone regardless of what happens
next. One number, one date, no per-member arithmetic.

**Replacement — the preferred route.** A cancelling member may find
another member to take their seat. The group size never changes,
nobody's price moves, and the cancelling member recovers per
{{CANCELLATION_TERMS}} on far better terms than a plain cancellation.
Conditions:

  - > The replacement is **an existing verified member**, and passes the
    > checkout identity check unchanged (4.7). A seat is never handed to
    > an unvetted friend — that is the one route by which someone enters
    > a section without passing the door, and it would quietly dissolve
    > the club.

  - > The remaining travellers are **notified**, with
    > {{SUBSTITUTION_NOTICE}} to raise anything with the host. Not a
    > veto — but people chose this table partly on who was at it, and a
    > swap that arrives unannounced breaks that.

  - > Replacement closes at {{REPLACEMENT_DEADLINE}}, at or before the
    > lock date, per what the operator agreement allows for manifests,
    > permits and rooming.

The flow should open on the departing member's own standing shortlist
(§6.2) — they already hold ten people they would travel with, and those
are the first people to ask.

**Cancellation fee holds the price.** Where no replacement is found, the
forfeited fee is applied **first** to holding the remaining travellers
at their current price. The money that leaves the group pays for the
hole it made. This is the intended use of {{CANCELLATION_TERMS}} and
should be stated to members as such, because it reframes a penalty as a
protection — the fee is not punishment, it is what keeps everyone else's
price where it was.

**Where the fee falls short.** It will not always cover the gap: one
traveller leaving a group of nine is a small hole; one leaving a group
of six may not be. Rule: fees are applied first to holding the price,
and any shortfall is borne by {{SHORTFALL_HOLDER}} — either Sawayatra
absorbs it, or the group re-bands with {{REBAND_NOTICE}} notice and a
right to withdraw without penalty. [SIGN-OFF]. Whichever is chosen
must be stated on the section page before anyone books, not discovered
in a cancellation email.

**After the lock date.** Forfeit per {{CANCELLATION_TERMS}}. No
re-banding, no replacement, nobody else's price moves.

**Below {{MIN_GROUP}} at the lock date.** The section does not run;
full refund of everything paid to Sawayatra. **The decision is made and
communicated at the lock date, not later** — members book flights, and
the date the answer arrives matters more to them than the refund policy.

### 7.8 Upgrades

Where the route permits, optional accommodation upgrades. Displayed
**separately, beneath the ladder**, never folded into the base price, so
the ladder stays legible as a single number.

| **Field**        | **Content**                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| Name             | {{UPGRADE_NAME}} — plain description, not a marketing tier                     |
| Where available  | Which nights, which gate cities, and explicitly which are **not** upgradeable   |
| Price            | Per person, per section — {{UPGRADE_PRICE}}                                    |
| Single occupancy | Handled here, never as a hidden supplement at checkout — {{SINGLE_SUPPLEMENT}} |

**Locked:** an upgrade purchased by one member never affects another
member's band or price. A member who upgrades still counts as one
traveller toward everyone's band.

Single occupancy deserves particular care. Many members will travel
alone and are used to being charged a penalty for it. Naming it plainly
on the section page rather than surfacing it at checkout is worth more
than the sum involved.

## 8. Money — format

Three charges, three moments, each shown separately. All tokens.

**8.1 Joining — {{JOINING_FEE}}.** One time, at membership, fully
credited against the first booked section, so a member who travels
effectively never pays it. Nothing recurs, so nothing churns through the
year between the club opening and February 2028 — the constraint shaping
this whole section. A subscription introduced at month seven would ask
members to renew through four quarters in which nothing is travellable,
and every churned member is a passport out of the pool.

**Founding cohort: waived for life, stated in the invitation letter
itself** — not announced in month six. An undefined free period reads as
a bait the moment it ends. Suggested addition: a permanent first-look
window on new journeys. Priority rewards better than discount, costs no
margin, and is what frequent travellers actually want.

**8.2 Group formation service charge — {{SERVICE_CHARGE}}.** Flat, per
person, per section, at checkout. Its own line, never absorbed into the
band price. Flat rather than percentage: percentage charges more for
longer sections, penalising exactly the behaviour the Caravan
encourages. If percentage is preferred, it needs a cap.

**8.3 Optional recurring — {{HOUSEHOLD_FEE}}.** If a recurring line is
wanted, the least damaging shape is a Household tier — additional
passports under one household, first-look windows, companion rights —
sold to members who already travel, never as the price of entry.

**8.4 Checkout order.** Journey and dates → today's per-person price,
with the floor beside it (7.4) → when the price settles (7.7) → upgrades
→ {{SERVICE_CHARGE}} → joining credit applied → identity check → total.
**Nothing appears at the last step that was not visible at the second.**

## 9. Sharing

Members may share their Passport. The shared object is a **static
image** generated on export, not a live view.

Contains: archetype illustration, archetype name, four keywords, the
Sawayatra mark, the words *by invitation*. Excludes: the open space, the
age bracket, any live link to a member surface, any other member.

The card lands on a **waitlist page**. During the closed six months it
generates demand that cannot be filled — useful, but only if the page is
honest: this club is by invitation, here is what it is, leave your name
and we will write when the door opens. Demand acknowledged compounds;
demand ignored turns to resentment before launch.

## 10. Member states

| **State**       | **Entered from**                            | **Can do**                                      | **Passport visible**                   |
| --------------- | ------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| Visitor         | —                                           | Browse, take questionnaire privately            | None exists                            |
| Invited         | Visitor                                     | Register                                        | No                                     |
| Registered      | Invited                                     | Nothing member-facing                           | No                                     |
| Verified        | Registered                                  | Full member surface, hold signals, mark windows | Yes                                    |
| In conversation | Verified                                    | Message, plan                                   | Yes                                    |
| Committed       | In conversation → checkout + identity check | Section membership                              | Yes, in roster                         |
| Travelled       | Committed                                   | Stamp added                                     | Yes                                    |
| Lapsed          | Verified, after {{LAPSE_MONTHS}}           | Read-only; cannot signal                        | Yes, marked *not currently travelling* |
| Removed         | Any                                         | Nothing                                         | No — open space deleted                |

**Reverse transitions.** Lapsed → Verified on any sign-in, silently,
with signal budgets restored and standing signals renewable if within
{{STANDING_MONTHS}}. Committed → Verified on cancellation, with §7.7
applying. In conversation → Verified on withdrawal by either party,
silently, with no notification to the other. Removed is terminal;
re-entry requires a fresh invitation and is at Sawayatra's discretion.

**Lapsed passports** stay visible but marked, and are **excluded from
any forming roster and from the demand map**. Leaving them counted would
inflate the pool, waste other members' scarce signals, and corrupt the
quorum trigger.

## 11. Agents

Two agents, two very different risk profiles, two different rules.

### 11.1 Shared constraints

  - > **No agent decision is final** (4.11). Both agents propose; a
    > human commits.

  - > **Every decision is logged** with input, output, the rule that
    > fired, timestamp, and the human who committed or overrode it. You
    > must be able to answer "why was my paragraph held" and "why did
    > this band change" a year later.

  - > **Members are told an agent is involved.** Discovered automation
    > reads as surveillance; disclosed automation reads as care. GDPR
    > also requires a route to human review of automated decisions
    > affecting a member.

  - > Neither agent ever sees date of birth, legal name, or contact
    > details from the hidden profile.

### 11.2 The pricing agent

**Purpose.** Produce **indicative round figures** for the six bands of a
section from operator cost inputs, so that the ladder can be designed,
tested and reviewed before final commercial terms exist.

**Standing instruction to the agent, and the framing shown to any human
reading its output:**

> These are round figures for shape and review only. They are not
> prices, not quotes, and not commitments. No output of this agent may
> reach a member-facing surface.

**Inputs.** Operator fixed cost per section, per-head cost, duration,
inclusions, currency, and any known floor or ceiling from the agreement.

**Outputs.** The six band figures **plus the derivation** — which is the
point. A number alone cannot be reviewed; a number with its arithmetic
can be corrected in a minute.

**Rounding is mandatory, not cosmetic.** Round to {{PRICE_ROUNDING}} so
that no output can be mistaken for a settled price. A figure ending in 7
looks calculated; a round one announces itself as provisional.

**Sanity rails — output rejected before a human sees it if:**

  - > bands are not monotonically decreasing;

  - > any band falls outside {{PRICE_ENVELOPE}};

  - > band 6 is below the operator's stated floor;

  - > the derivation does not reconcile to the inputs.

**Commit path.** Agent writes to pending-review/. [SIGN-OFF] commits
into §13. The build reads tokens, never agent output. A price is a
contractual representation — a hallucinated band someone books against
is a commitment you must honour.

### 11.3 The moderation agent

**Purpose.** Flag open-space content for human review. **It never
blocks, hides, deletes, edits or delays publication.** Content publishes
immediately; the flag goes to a queue.

**The reason this rule exists.** In an invitation-only club where every
member is traceable to a sponsor, the risk of harmful content is low and
already addressed by §5.3. The expensive error here is the **false
positive**. A member writes about a late husband, an illness that shapes
how they travel, a war they lived through, their faith — precisely the
material that makes a passport worth reading, and precisely what a
moderation model flags. Many members are travelling after a loss.
Silently suppressing that person's paragraph is the worst thing this
product can do to them, and they will never report it. They will simply
go quiet.

**Never flagged. Hard constraint.**

  - > Grief, bereavement, death of family

  - > Illness, disability, mobility, mental health

  - > Religion and religious practice

  - > Sexuality and gender

  - > Political history, displacement, exile, war experience

  - > Anything written in a language other than English

That last is not a courtesy. A Cairo–London club will have Arabic in its
open spaces, and moderation models are markedly worse outside English —
an English-centred filter would quietly penalise exactly the members
whose presence makes Sawayatra what it is. Non-English content goes to
human review only, and only on member report.

**Does flag, to a human queue:** content details under 4.6; commercial
solicitation; content plausibly identifying a third party who has not
consented; anything triggering a legal obligation.

**The one permitted hold** is 4.6 contact details, because that is
pattern-matching rather than judgment — and even then it is *held with a
plain explanation and a route to a person*, never a silent
disappearance.

**Queue discipline.** A flag reviewed by a human within {{REVIEW_SLA}}.
An unreviewed flag expires and the content stands. A queue that grows
without a service level becomes a blocklist by neglect.

**Member-facing disclosure, to appear at the open space editor:**

> Your open space publishes straight away. We check automatically for
> contact details — everything else, a person reads, and only if
> something is flagged. If we ever hold something of yours, we will tell
> you why and you can talk to a human about it.

## 12. Data protection

  - > Stated lawful basis per category of processing.

  - > Retention schedule; identity documents at **zero retention**
    > (4.8).

  - > Documented subject access and erasure route.

  - > DOB → bracket confirmed one-way in the data model: no export,
    > admin view or API response can reconstruct a date of birth.

  - > Price settlement and refunds (7.7) imply holding partial payment
    > data across a group's lifetime; confirm the processor handles this
    > and Sawayatra stores no card data.

  - > Agent logs (11.1) contain member content and are themselves
    > personal data with their own retention rule.

  - > A route to human review of every automated decision (11.1).

This is the only section where getting it wrong causes damage a later
redesign cannot repair.

## 13. Placeholder register

Nothing ships with an unfilled token. Nothing ships with a token
replaced by a guess.

| **Token**                                             | **Meaning**                                                           | **Owner**                   |
| ----------------------------------------------------- | --------------------------------------------------------------------- | --------------------------- |
| {{PRICE_T1}}–{{PRICE_T6}}                           | Per-person price per band                                             | [SIGN-OFF], post-operator |
| {{PRICE_ROUNDING}}                                   | Rounding unit for agent output                                        | [SIGN-OFF]                |
| {{PRICE_ENVELOPE}}                                   | Plausibility bounds, sanity rail                                      | [SIGN-OFF]                |
| {{MIN_GROUP}}                                        | Minimum viable group per section                                      | [SIGN-OFF], post-operator |
| {{LOCK_DAYS}}                                        | Price settles this many days before departure — 60 recommended        | [SIGN-OFF]                |
| {{CANCELLATION_TERMS}}                               | Cancellation and replacement terms, before and after lock             | [SIGN-OFF]                |
| {{SHORTFALL_HOLDER}}                                 | Who bears a cancellation shortfall — Sawayatra, or the group re-bands | [SIGN-OFF]                |
| {{REBAND_NOTICE}}                                    | Notice and penalty-free withdrawal if the group re-bands              | [SIGN-OFF]                |
| {{REPLACEMENT_DEADLINE}}                             | Last point a seat may be transferred                                  | [SIGN-OFF], post-operator |
| {{SUBSTITUTION_NOTICE}}                              | Window for the group to raise a substitution with the host            | Nermine                     |
| {{ROSTER_NAME_POLICY}}                              | Whether co-travellers see legal names at checkout                     | [SIGN-OFF]                |
| {{UPGRADE_NAME}} / {{UPGRADE_PRICE}}                | Accommodation upgrades                                                | [SIGN-OFF], post-operator |
| {{SINGLE_SUPPLEMENT}}                                | Single occupancy                                                      | [SIGN-OFF], post-operator |
| {{JOINING_FEE}}                                      | One time, credited                                                    | [SIGN-OFF]                |
| {{SERVICE_CHARGE}}                                   | Per person per section at checkout                                    | [SIGN-OFF]                |
| {{HOUSEHOLD_FEE}}                                    | Optional recurring                                                    | [SIGN-OFF]                |
| {{PARTNER_SHARE_TARGET}} / {{PARTNER_SHARE_DATE}} | Health metric                                                         | [SIGN-OFF]                |
| {{INVITES_PER_MEMBER}}                              | Founding period — 3 recommended                                       | Nermine                     |
| {{LIVE_SIGNALS}}                                     | Concurrent live signals — 3 recommended                               | Nermine                     |
| {{STANDING_SIGNALS}}                                 | Shortlist size — 10 recommended                                       | Nermine                     |
| {{STANDING_MONTHS}}                                  | Standing signal expiry                                                | Nermine                     |
| {{CONSIDERING_MAX}}                                  | Windows marked at once — 3 recommended                                | Nermine                     |
| {{WINDOW_GRANULARITY}}                               | Season / month / six-week block                                       | Nermine                     |
| {{QUORUM_TRIGGER}}                                   | Call threshold — above {{MIN_GROUP}}                                 | Nermine                     |
| {{COOLDOWN_DAYS}}                                    | Re-signal cool-down                                                   | Nermine                     |
| {{LAPSE_MONTHS}}                                     | Inactivity threshold                                                  | Nermine                     |
| {{REVIEW_SLA}}                                       | Moderation queue service level                                        | Nermine                     |

## 14. Downstream edits required

| **Document**               | **Change**                                                                                                                                                                                                                                                                                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Travel Self spec           | Passport three-part structure; open space rules; bracket display-not-operative; browse-only gate; **two-signal model replacing the single bound signal**; graduated reveal                                                                                                                                           |
| Brand build spec §8.6      | Membership rewritten: invitation-only, founding cohort, no tier table until §8 tokens are filled                                                                                                                                                                                                                     |
| Departures build spec      | **Fixed / Forming split**; pricing-model attribute; ladder component with all eight states and mobile treatment; **the paired from/today price block (4.9, 7.4) as a single component so the two figures cannot be separated**; lock date, cancellation and replacement; upgrades; demand map; quorum call; convener |
| Navigation                 | §2.3 — four items; Create becomes a button                                                                                                                                                                                                                                                                           |
| Claude Code build prompt   | Rules 4.1–4.11 as hard constraints; bracket must not exist as a filterable field; no numeric literal may replace a token                                                                                                                                                                                             |
| Decisions document         | §8, §13 [SIGN-OFF] rows, §2.4, invitation allocation after month six                                                                                                                                                                                                                                               |
| Operator negotiation brief | §7.7 replacement deadline and manifest/rooming change window; whether cancellation fees are retained by Sawayatra to hold group price; §6.5 candidate dates must be operator-feasible                                                                                                                                |
| Terms of membership        | 4.6, 5.3, 5.4, §6 budgets, §7.7 cancellation, replacement and shortfall, §11 agent disclosure                                                                                                                                                                                                                        |
| Privacy notice             | §12 in full, including agent logs and the human-review route                                                                                                                                                                                                                                                         |

## 15. Still open, and larger than any token

**The funnel arithmetic.** Invitation-only, {{INVITES_PER_MEMBER}} per
member, twelve travellers per section, nine sections, first departure
February 2028. Nobody has yet modelled how many members the pool needs
for a section to fill, or whether the invitation cap reaches that number
in eighteen months. The binding constraint is likely not membership
volume but **date concentration** — which §6.3–6.6 are designed to
relieve, but the relief is untested.

Modelling it needs three assumptions: founding cohort size, invitation
acceptance rate, and departure dates offered per section in 2028. If the
model says the cap or the six-month window is wrong, no pricing design
compensates, and the answer changes §5.2 and §6.5 rather than anything
below them.

**Do this before §8 is priced.**
