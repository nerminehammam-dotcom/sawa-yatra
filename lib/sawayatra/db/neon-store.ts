import "server-only";

import { neon } from "@neondatabase/serverless";

import type { InvitationRecord } from "../invitations";
import type {
  HiddenProfile,
  MemberRecord,
  MemberState,
  MembershipStore,
} from "../membership";

/**
 * Neon-backed MembershipStore.
 *
 * Queries go over HTTP with the `neon()` template function, which is the right
 * choice here: every operation below is a single statement, and HTTP is faster
 * than WebSockets for one-shot queries.
 *
 * WHY THE MUTATIONS ARE SINGLE STATEMENTS. Neon's HTTP transactions are
 * NON-INTERACTIVE - `transaction()` takes a fixed array of queries, so a read, a
 * decision and a write cannot share one transaction. Read-then-write would race.
 * Each mutation is therefore one conditional statement Postgres evaluates
 * itself, backed by the unique indexes in schema.sql. Two simultaneous requests
 * cannot both win.
 *
 * NOT YET EXERCISED AGAINST A LIVE DATABASE. The SQL is written against
 * lib/sawayatra/db/schema.sql and the shapes are typed, but no Neon project
 * existed when this was written. Run schema.sql, set DATABASE_URL, and verify
 * before trusting it. The in-memory store is what the test suite covers.
 */

type Row = Record<string, unknown>;

function sqlClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. The membership store cannot run without it.",
    );
  }
  return neon(url);
}

function ms(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  const time = new Date(value as string).getTime();
  return Number.isNaN(time) ? undefined : time;
}

function toInvitation(row: Row): InvitationRecord {
  return {
    id: String(row.id),
    sponsorId: String(row.sponsor_id),
    inviteeEmail: String(row.invitee_email),
    slot: Number(row.slot),
    issuedAt: ms(row.issued_at) ?? 0,
    expiresAt: ms(row.expires_at) ?? 0,
    redeemedAt: ms(row.redeemed_at),
    revokedAt: ms(row.revoked_at),
  };
}

function toMember(row: Row): MemberRecord {
  const profile: HiddenProfile | undefined = row.legal_name
    ? {
        legalName: String(row.legal_name),
        dateOfBirth: String(row.date_of_birth ?? ""),
        email: String(row.email),
        mobile: row.mobile ? String(row.mobile) : undefined,
        socialAnchor: row.social_anchor ? String(row.social_anchor) : undefined,
      }
    : undefined;

  return {
    id: String(row.id),
    email: String(row.email),
    state: String(row.state) as MemberState,
    sponsorId: String(row.sponsor_id),
    invitationId: String(row.invitation_id),
    invitedAt: ms(row.invited_at) ?? 0,
    registeredAt: ms(row.registered_at),
    verifiedAt: ms(row.verified_at),
    lapsedAt: ms(row.lapsed_at),
    removedAt: ms(row.removed_at),
    hiddenProfile: profile,
    hasSavedTravelSelf: Boolean(row.has_saved_travel_self),
  };
}

export function createNeonMembershipStore(): MembershipStore {
  return {
    async listInvitations(sponsorId) {
      const sql = sqlClient();
      const rows =
        sponsorId === undefined
          ? await sql`select * from invitation order by issued_at`
          : await sql`select * from invitation where sponsor_id = ${sponsorId} order by issued_at`;
      return (rows as Row[]).map(toInvitation);
    },

    /**
     * One statement. The INSERT proceeds only if both conditions hold at the
     * moment Postgres evaluates them:
     *
     *   - the sponsor holds fewer than `allocation` invitations that are either
     *     redeemed or still live (null allocation means uncapped, the house);
     *   - the sponsor holds no live invitation to that address.
     *
     * `invitation_slot_unique` and `invitation_one_live_per_sponsor` in
     * schema.sql are the backstop if two inserts are evaluated concurrently:
     * one raises, and we return null rather than letting it through.
     */
    async insertInvitation(invitation, allocation, now) {
      const sql = sqlClient();
      const at = new Date(now).toISOString();
      try {
        const rows = await sql`
          insert into invitation
            (id, sponsor_id, invitee_email, slot, issued_at, expires_at)
          select
            ${invitation.id}::uuid,
            ${invitation.sponsorId},
            ${invitation.inviteeEmail},
            ${invitation.slot},
            ${new Date(invitation.issuedAt).toISOString()}::timestamptz,
            ${new Date(invitation.expiresAt).toISOString()}::timestamptz
          where
            (
              ${allocation}::int is null
              or (
                select count(*) from invitation held
                where held.sponsor_id = ${invitation.sponsorId}
                  and (
                    held.redeemed_at is not null
                    or (held.revoked_at is null and held.expires_at > ${at}::timestamptz)
                  )
              ) < ${allocation}::int
            )
            and not exists (
              select 1 from invitation clash
              where clash.sponsor_id = ${invitation.sponsorId}
                and lower(clash.invitee_email) = lower(${invitation.inviteeEmail})
                and clash.redeemed_at is null
                and clash.revoked_at is null
                and clash.expires_at > ${at}::timestamptz
            )
          returning *`;
        const [row] = rows as Row[];
        return row ? toInvitation(row) : null;
      } catch (error) {
        // A unique violation means a concurrent insert won. That is a refusal,
        // not a fault - anything else is rethrown.
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as { code?: string }).code === "23505"
        ) {
          return null;
        }
        throw error;
      }
    },

    /** One statement. The WHERE clause is what makes redemption single-use. */
    async markInvitationRedeemed(id, now) {
      const sql = sqlClient();
      const at = new Date(now).toISOString();
      const rows = await sql`
        update invitation
           set redeemed_at = ${at}::timestamptz
         where id = ${id}::uuid
           and redeemed_at is null
           and revoked_at is null
           and expires_at > ${at}::timestamptz
        returning *`;
      const [row] = rows as Row[];
      return row ? toInvitation(row) : null;
    },

    async markInvitationRevoked(id, now) {
      const sql = sqlClient();
      const at = new Date(now).toISOString();
      const rows = await sql`
        update invitation
           set revoked_at = ${at}::timestamptz
         where id = ${id}::uuid
           and redeemed_at is null
           and revoked_at is null
           and expires_at > ${at}::timestamptz
        returning *`;
      const [row] = rows as Row[];
      return row ? toInvitation(row) : null;
    },

    async findMemberByEmail(email) {
      const sql = sqlClient();
      const rows = await sql`
        select * from member where lower(email) = lower(${email}) and state <> 'removed' limit 1`;
      const [row] = rows as Row[];
      return row ? toMember(row) : null;
    },

    async findMemberById(id) {
      const sql = sqlClient();
      const rows = await sql`select * from member where id = ${id}::uuid limit 1`;
      const [row] = rows as Row[];
      return row ? toMember(row) : null;
    },

    /**
     * Reads the `member_summary` VIEW, not the table. Rule 4.2 forbids date of
     * birth surfacing in an admin view, and a view that cannot select it is a
     * stronger guarantee than remembering not to.
     */
    async listMembers() {
      const sql = sqlClient();
      const rows = await sql`select * from member_summary order by invited_at desc`;
      return (rows as Row[]).map((row) => ({
        id: String(row.id),
        email: String(row.email),
        state: String(row.state) as MemberState,
        sponsorId: String(row.sponsor_id),
        invitationId: "",
        invitedAt: ms(row.invited_at) ?? 0,
        hasSavedTravelSelf: Boolean(row.has_saved_travel_self),
      }));
    },

    async saveMember(member) {
      const sql = sqlClient();
      await sql`
        insert into member
          (id, email, state, sponsor_id, invitation_id, invited_at,
           registered_at, verified_at, lapsed_at, removed_at,
           legal_name, date_of_birth, mobile, social_anchor, has_saved_travel_self)
        values
          (${member.id}::uuid, ${member.email}, ${member.state}, ${member.sponsorId},
           ${member.invitationId}::uuid,
           ${new Date(member.invitedAt).toISOString()}::timestamptz,
           ${member.registeredAt ? new Date(member.registeredAt).toISOString() : null}::timestamptz,
           ${member.verifiedAt ? new Date(member.verifiedAt).toISOString() : null}::timestamptz,
           ${member.lapsedAt ? new Date(member.lapsedAt).toISOString() : null}::timestamptz,
           ${member.removedAt ? new Date(member.removedAt).toISOString() : null}::timestamptz,
           ${member.hiddenProfile?.legalName ?? null},
           ${member.hiddenProfile?.dateOfBirth ?? null}::date,
           ${member.hiddenProfile?.mobile ?? null},
           ${member.hiddenProfile?.socialAnchor ?? null},
           ${member.hasSavedTravelSelf})
        on conflict (id) do update set
          state = excluded.state,
          registered_at = excluded.registered_at,
          verified_at = excluded.verified_at,
          lapsed_at = excluded.lapsed_at,
          removed_at = excluded.removed_at,
          legal_name = excluded.legal_name,
          date_of_birth = excluded.date_of_birth,
          mobile = excluded.mobile,
          social_anchor = excluded.social_anchor,
          has_saved_travel_self = excluded.has_saved_travel_self`;
    },
  };
}
