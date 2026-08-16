import type { MembershipStatus } from "./model";
import {
  canIssueInvitation,
  canRedeemInvitation,
  HOUSE_SPONSOR_ID,
  INVITES_PER_MEMBER,
  isHouseSponsor,
  issueInvitationToken,
  normaliseEmail,
  recordInvitation,
  type AllocationDecision,
  type InvitationRecord,
  type RedemptionRefusal,
} from "./invitations";

/**
 * Membership: the states a person moves through, and the store that holds them.
 *
 * ADDITIVE ON PURPOSE. `MembershipStatus` in model.ts is the older application
 * model (none / applied / member / declined / lapsed) and is read by session.ts,
 * view-model.ts, claims.ts and proxy.ts. Changing it would touch all of them, so
 * this module carries the spec §10 states separately and maps at the boundary
 * with `toLegacyStatus`. When the older model is retired, this is the one to keep.
 *
 * §10 also defines "in conversation", "committed" and "travelled". Those are
 * journey-level states, reached long after joining, and are deliberately not
 * modelled here.
 *
 * NOTHING IN THIS FILE COLLECTS ANYTHING. It defines shapes and transitions and
 * an in-memory store for tests. Persisting a real person's details is blocked on
 * the consent wording and the lawful basis - see docs/build/invitation-mechanism.md §6.
 */

/** Spec v3.1 §10, the joining portion. */
export const MEMBER_STATES = [
  "invited",
  "registered",
  "verified",
  "lapsed",
  "removed",
] as const;
export type MemberState = (typeof MEMBER_STATES)[number];

/**
 * The §3.1 hidden profile. Collected at joining. Never displayed, never
 * partially displayed. `dateOfBirth` is held for eligibility and insurance and
 * must never surface anywhere - rule 4.2 is absolute, and the derivation to an
 * age bracket is one-way.
 */
export interface HiddenProfile {
  readonly legalName: string;
  /** ISO date. NEVER rendered. Rule 4.2. */
  readonly dateOfBirth: string;
  readonly email: string;
  readonly mobile?: string;
  /** Confirmed by the sponsor as belonging to them. §3.1, an anchor not a requirement. */
  readonly socialAnchor?: string;
}

/**
 * Details needed to put someone on a road: visas, insurance, rooming.
 *
 * SEPARATE FROM THE HIDDEN PROFILE ON PURPOSE. §4.7 says nothing is asked of a
 * member before checkout, and /club/apply currently promises in public that the
 * site "does not collect nationality, gender or any inferred demographic".
 * Collecting these at joining contradicts both, and neither has a lawful basis
 * written in docs/data-protection/. Modelled here so the shape is agreed, and
 * kept apart so moving it to booking is a change of caller, not of schema.
 */
export interface TravelDetails {
  readonly address?: string;
  readonly nationality?: string;
  readonly gender?: string;
}

export interface MemberRecord {
  readonly id: string;
  readonly email: string;
  readonly state: MemberState;
  /** Who vouched. HOUSE_SPONSOR_ID for a founder invitation. §5.3, permanent. */
  readonly sponsorId: string;
  /** The invitation this member entered through. */
  readonly invitationId: string;
  readonly invitedAt: number;
  readonly registeredAt?: number;
  readonly verifiedAt?: number;
  readonly lapsedAt?: number;
  readonly removedAt?: number;
  readonly hiddenProfile?: HiddenProfile;
  readonly travelDetails?: TravelDetails;
  readonly hasSavedTravelSelf: boolean;
}

/**
 * Only these transitions exist. Anything else is a bug, not a state.
 * Removed is terminal: §10 says re-entry requires a fresh invitation.
 */
const TRANSITIONS: Readonly<Record<MemberState, readonly MemberState[]>> = {
  invited: ["registered", "removed"],
  registered: ["verified", "removed"],
  verified: ["lapsed", "removed"],
  lapsed: ["verified", "removed"],
  removed: [],
};

export function canTransition(from: MemberState, to: MemberState): boolean {
  return TRANSITIONS[from].includes(to);
}

/**
 * Bridge to the older model that session.ts and view-model.ts still read.
 * Only `verified` is a member: §10 gives Registered "nothing member-facing".
 */
export function toLegacyStatus(state: MemberState): MembershipStatus {
  switch (state) {
    case "verified":
      return "member";
    case "lapsed":
      return "lapsed";
    case "invited":
    case "registered":
      return "applied";
    case "removed":
      return "declined";
  }
}

export type MembershipFailure =
  | RedemptionRefusal
  | "allocation-exhausted"
  | "already-invited"
  | "invalid-email"
  | "not-invited"
  | "wrong-state";

export interface MembershipResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly reason?: MembershipFailure;
}

/**
 * The persistence port.
 *
 * The two mutating invitation methods are ATOMIC BY CONTRACT. An earlier version
 * of this interface was list-then-save, which cannot be made race-free by any
 * caller: Neon's HTTP transactions are non-interactive, so a read, a decision and
 * a write cannot share one transaction. Both are therefore expressed as single
 * conditional statements the database evaluates itself.
 *
 * Async throughout, because every real implementation is.
 */
export interface MembershipStore {
  listInvitations(sponsorId?: string): Promise<readonly InvitationRecord[]>;

  /**
   * ATOMIC. Insert only if the sponsor is within `allocation` and holds no live
   * invitation to that address. `allocation` null means uncapped (the house).
   * Returns null when the insert was refused - the caller may then read to find
   * out why, but must not treat a read as authority.
   */
  insertInvitation(
    invitation: InvitationRecord,
    allocation: number | null,
    now: Date,
  ): Promise<InvitationRecord | null>;

  /** ATOMIC. Marks redeemed only if live. Null means someone else got there. */
  markInvitationRedeemed(id: string, now: Date): Promise<InvitationRecord | null>;

  /** ATOMIC. Marks revoked only if live. Null means it was already spent. */
  markInvitationRevoked(id: string, now: Date): Promise<InvitationRecord | null>;

  findMemberByEmail(email: string): Promise<MemberRecord | null>;
  findMemberById(id: string): Promise<MemberRecord | null>;
  listMembers(): Promise<readonly MemberRecord[]>;
  saveMember(member: MemberRecord): Promise<void>;
}

export function createInMemoryMembershipStore(seed?: {
  readonly invitations?: readonly InvitationRecord[];
  readonly members?: readonly MemberRecord[];
}): MembershipStore {
  let invitations: readonly InvitationRecord[] = seed?.invitations ?? [];
  const members = new Map<string, MemberRecord>(
    (seed?.members ?? []).map((member) => [member.id, member]),
  );

  const live = (invitation: InvitationRecord, at: number) =>
    invitation.redeemedAt === undefined &&
    invitation.revokedAt === undefined &&
    invitation.expiresAt > at;

  return {
    async listInvitations(sponsorId) {
      return sponsorId === undefined
        ? invitations
        : invitations.filter((invitation) => invitation.sponsorId === sponsorId);
    },

    // Atomic here because JavaScript is single-threaded and nothing is awaited
    // between the check and the write. The Neon implementation gets the same
    // guarantee from a conditional INSERT and a unique index.
    async insertInvitation(invitation, allocation, now) {
      const at = now.getTime();
      const held = invitations.filter(
        (existing) =>
          existing.sponsorId === invitation.sponsorId &&
          (existing.redeemedAt !== undefined || live(existing, at)),
      ).length;
      if (allocation !== null && held >= allocation) return null;

      const clash = invitations.some(
        (existing) =>
          existing.sponsorId === invitation.sponsorId &&
          normaliseEmail(existing.inviteeEmail) === normaliseEmail(invitation.inviteeEmail) &&
          live(existing, at),
      );
      if (clash) return null;

      invitations = [...invitations, invitation];
      return invitation;
    },

    async markInvitationRedeemed(id, now) {
      const at = now.getTime();
      const target = invitations.find((invitation) => invitation.id === id);
      if (!target || !live(target, at)) return null;
      const updated = { ...target, redeemedAt: at };
      invitations = invitations.map((invitation) =>
        invitation.id === id ? updated : invitation,
      );
      return updated;
    },

    async markInvitationRevoked(id, now) {
      const at = now.getTime();
      const target = invitations.find((invitation) => invitation.id === id);
      if (!target || !live(target, at)) return null;
      const updated = { ...target, revokedAt: at };
      invitations = invitations.map((invitation) =>
        invitation.id === id ? updated : invitation,
      );
      return updated;
    },
    async findMemberByEmail(email) {
      const wanted = normaliseEmail(email);
      for (const member of members.values()) {
        if (normaliseEmail(member.email) === wanted) return member;
      }
      return null;
    },
    async findMemberById(id) {
      return members.get(id) ?? null;
    },
    async listMembers() {
      return [...members.values()];
    },
    async saveMember(member) {
      members.set(member.id, member);
    },
  };
}

export interface IssuedInvitation {
  readonly token: string;
  readonly invitationId: string;
  readonly slot: number;
  readonly remaining: number | null;
}

/**
 * Issue an invitation.
 *
 * A founder issues as HOUSE_SPONSOR_ID and is uncapped (§5.1). A member issues
 * as themselves and is held to two (§5.2). Same path, and the difference is one
 * argument - so member invitations need no new code when they open.
 *
 * The caller must serialise this per sponsor, or rely on a unique constraint at
 * the database. The allocation read and the write are not one transaction here
 * and cannot be made so in a store-agnostic layer.
 */
export async function issueInvitation(
  store: MembershipStore,
  sponsorId: string,
  inviteeEmail: string,
  secret: string,
  now: Date,
): Promise<MembershipResult<IssuedInvitation>> {
  const existingMember = await store.findMemberByEmail(inviteeEmail);
  if (existingMember && existingMember.state !== "removed") {
    return { ok: false, reason: "already-member" };
  }

  // A removed member may be invited again (§10), so the invitation they came in
  // through must not block a fresh one. It still counts against the sponsor's
  // allocation: §5.3 suspends a sponsor's allocation on removal, it does not
  // refund it.
  const spentByRemoved =
    existingMember?.state === "removed" ? [existingMember.invitationId] : [];

  const all = await store.listInvitations();
  const decision: AllocationDecision = canIssueInvitation(
    all,
    sponsorId,
    inviteeEmail,
    now,
    spentByRemoved,
  );
  if (!decision.allowed || decision.slot === undefined) {
    return { ok: false, reason: decision.reason ?? "allocation-exhausted" };
  }

  const { token, payload } = issueInvitationToken(
    { sponsorId, inviteeEmail, slot: decision.slot },
    secret,
    now,
  );

  // The decision above is advisory - it gives a useful refusal and a remaining
  // count. THIS is the authority: one conditional statement the store evaluates
  // itself, so two simultaneous requests cannot both succeed.
  const [record] = recordInvitation([], payload);
  const inserted = await store.insertInvitation(
    record!,
    isHouseSponsor(sponsorId) ? null : INVITES_PER_MEMBER,
    now,
  );
  if (!inserted) return { ok: false, reason: "allocation-exhausted" };

  return {
    ok: true,
    value: {
      token,
      invitationId: payload.id,
      slot: payload.slot,
      remaining: decision.remaining,
    },
  };
}

/**
 * Redeem an invitation, creating a member in `registered`.
 *
 * `presentedEmail` is required and is checked against the token: an opened link
 * proves only that someone had the link, not that they own the address.
 */
export async function redeemInvitationForMember(
  store: MembershipStore,
  token: string,
  presentedEmail: string,
  secret: string,
  now: Date,
  newMemberId: () => string,
): Promise<MembershipResult<MemberRecord>> {
  const all = await store.listInvitations();
  const decision = canRedeemInvitation(token, all, secret, now, presentedEmail);
  if (!decision.allowed || !decision.payload) {
    return { ok: false, reason: decision.reason ?? "invalid-token" };
  }

  // Authority again: the store marks it redeemed only if it is still live, in
  // one statement. Two simultaneous redemptions of the same link mean one
  // member, not two.
  const spent = await store.markInvitationRedeemed(decision.payload.id, now);
  if (!spent) return { ok: false, reason: "already-redeemed" };

  const member: MemberRecord = {
    id: newMemberId(),
    email: decision.payload.inviteeEmail,
    state: "registered",
    sponsorId: decision.payload.sponsorId,
    invitationId: decision.payload.id,
    invitedAt: decision.payload.issuedAt,
    registeredAt: now.getTime(),
    hasSavedTravelSelf: false,
  };
  await store.saveMember(member);
  return { ok: true, value: member };
}

/** Withdraw an unaccepted invitation. Returns the slot to the sponsor. */
export async function withdrawInvitation(
  store: MembershipStore,
  invitationId: string,
  now: Date,
): Promise<MembershipResult<null>> {
  const revoked = await store.markInvitationRevoked(invitationId, now);
  if (!revoked) return { ok: false, reason: "no-record" };
  return { ok: true, value: null };
}

/**
 * Registered → Verified. §3.1 needs the vouch plus two anchors; the invitation
 * carries the vouch, and the link plus the stated address is the first anchor.
 * `secondAnchorConfirmed` is the sponsor confirming a social or professional
 * account, or a verified mobile - whichever was used.
 */
export async function verifyMember(
  store: MembershipStore,
  memberId: string,
  profile: HiddenProfile,
  secondAnchorConfirmed: boolean,
  now: Date,
): Promise<MembershipResult<MemberRecord>> {
  const member = await store.findMemberById(memberId);
  if (!member) return { ok: false, reason: "not-invited" };
  if (!canTransition(member.state, "verified")) {
    return { ok: false, reason: "wrong-state" };
  }
  if (!secondAnchorConfirmed) return { ok: false, reason: "wrong-state" };

  const verified: MemberRecord = {
    ...member,
    state: "verified",
    verifiedAt: now.getTime(),
    hiddenProfile: profile,
  };
  await store.saveMember(verified);
  return { ok: true, value: verified };
}

/**
 * Removal. §5.3: the sponsor's remaining allocation is suspended and reviewed.
 * Suspension is a club decision, not an automatic one, so this reports who
 * sponsored the removed member rather than acting on their allocation.
 */
export async function removeMember(
  store: MembershipStore,
  memberId: string,
  now: Date,
): Promise<MembershipResult<{ readonly sponsorToReview: string | null }>> {
  const member = await store.findMemberById(memberId);
  if (!member) return { ok: false, reason: "not-invited" };
  if (!canTransition(member.state, "removed")) {
    return { ok: false, reason: "wrong-state" };
  }
  await store.saveMember({ ...member, state: "removed", removedAt: now.getTime() });
  return {
    ok: true,
    value: {
      sponsorToReview: isHouseSponsor(member.sponsorId) ? null : member.sponsorId,
    },
  };
}

/** What the admin members list shows. No hidden profile, by construction. */
export interface MemberSummary {
  readonly id: string;
  readonly email: string;
  readonly state: MemberState;
  readonly sponsorId: string;
  readonly invitedAt: number;
  readonly hasSavedTravelSelf: boolean;
}

/**
 * Deliberately drops `hiddenProfile` and `travelDetails`. Rule 4.2 forbids date
 * of birth surfacing "in an admin view a member could be shown", and the safest
 * way to honour that is for the list never to carry it.
 */
export function toMemberSummary(member: MemberRecord): MemberSummary {
  return {
    id: member.id,
    email: member.email,
    state: member.state,
    sponsorId: member.sponsorId,
    invitedAt: member.invitedAt,
    hasSavedTravelSelf: member.hasSavedTravelSelf,
  };
}

export { HOUSE_SPONSOR_ID };
