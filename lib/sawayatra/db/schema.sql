-- Sawayatra membership schema, for Neon (Postgres).
--
-- Run once against the database, then again only through a numbered migration.
-- Nothing in the application creates or alters tables at runtime.
--
-- REGION. Members will be in the EU and in Egypt. Choose the Neon project region
-- deliberately for data residency under GDPR - it cannot be changed later without
-- moving the project.
--
-- WHAT IS DELIBERATELY NOT HERE. No password column. No nationality, gender or
-- address. The first is a design choice (a signed link needs no password); the
-- other three are blocked - /club/apply promises in public that the site "does
-- not collect nationality, gender or any inferred demographic", and
-- docs/data-protection/ has no lawful basis written for them. Adding them is a
-- migration, once both are resolved.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- invitation
-- ---------------------------------------------------------------------------
create table if not exists invitation (
  id            uuid primary key default gen_random_uuid(),
  -- Member id, or 'house:sawayatra' for an invitation from Sawayatra itself.
  -- Kept permanently: spec v3.1 §5.3, the accountability chain.
  sponsor_id    text        not null,
  invitee_email text        not null,
  -- Which of the sponsor's allocation this is. Never reused, so the unique
  -- constraint below is what makes concurrent issuance safe.
  slot          integer     not null check (slot >= 1),
  issued_at     timestamptz not null default now(),
  expires_at    timestamptz not null,
  redeemed_at   timestamptz,
  -- Withdrawn by the sponsor or the club. Distinct from expiry: an expired
  -- invitation lapsed on its own, a revoked one was taken back.
  revoked_at    timestamptz,

  constraint invitation_slot_unique unique (sponsor_id, slot),
  constraint invitation_not_both_ends check (redeemed_at is null or revoked_at is null)
);

-- Emails are compared lower-cased everywhere in the application; the index
-- matches so the lookup can use it.
create index if not exists invitation_email_idx on invitation (lower(invitee_email));
create index if not exists invitation_sponsor_idx on invitation (sponsor_id);

-- An address may hold only one LIVE invitation from a given sponsor. Redeemed
-- and revoked rows are excluded so a lapsed invitation can be re-sent.
create unique index if not exists invitation_one_live_per_sponsor
  on invitation (sponsor_id, lower(invitee_email))
  where redeemed_at is null and revoked_at is null;

-- ---------------------------------------------------------------------------
-- member
-- ---------------------------------------------------------------------------
-- States are spec v3.1 §10. 'in conversation', 'committed' and 'travelled' are
-- journey-level and are not modelled here.
create table if not exists member (
  id             uuid primary key default gen_random_uuid(),
  email          text        not null,
  state          text        not null
                 check (state in ('invited','registered','verified','lapsed','removed')),
  sponsor_id     text        not null,
  invitation_id  uuid        not null references invitation (id),
  invited_at     timestamptz not null,
  registered_at  timestamptz,
  verified_at    timestamptz,
  lapsed_at      timestamptz,
  removed_at     timestamptz,

  -- §3.1 hidden profile. Never displayed, never partially displayed.
  -- date_of_birth is held for eligibility and insurance ONLY and must never
  -- surface anywhere - rule 4.2. Derivation to an age bracket is one-way, so
  -- no view, export or API response may return this column.
  legal_name     text,
  date_of_birth  date,
  mobile         text,
  social_anchor  text,

  has_saved_travel_self boolean not null default false
);

-- One live membership per address. A removed member may be invited again (§10),
-- so removed rows are excluded rather than blocking re-entry.
create unique index if not exists member_one_live_per_email
  on member (lower(email))
  where state <> 'removed';

create index if not exists member_sponsor_idx on member (sponsor_id);
create index if not exists member_state_idx on member (state);

-- ---------------------------------------------------------------------------
-- A view for the admin members list.
-- ---------------------------------------------------------------------------
-- Rule 4.2 forbids date of birth surfacing "in an admin view a member could be
-- shown". The safest way to honour that is for the admin list to read from a
-- view that cannot return it. Query this, never `member`, for anything a person
-- will see.
create or replace view member_summary as
  select id, email, state, sponsor_id, invited_at, has_saved_travel_self
  from member;
