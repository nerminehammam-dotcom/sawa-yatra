import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/**
 * Invitation tokens and allocation.
 *
 * Membership is by invitation only (spec v3.1 §5). An invitation is a signed,
 * expiring link rather than a one-time code: the invitee has no account to log
 * into, so there is nothing for them to log in to and be challenged on.
 *
 * WHAT A LINK DOES AND DOES NOT PROVE
 *
 * An opened link proves that whoever opened it had the link. It does NOT prove
 * control of the address it was sent to: mail is forwarded, and corporate scanners
 * (Outlook Safe Links and similar) fetch URLs found in mail before any human sees
 * them. Redemption therefore requires the recipient to state their address, and
 * `presentedEmail` is a required argument for exactly that reason. Redemption must
 * also be a POST behind an explicit confirmation, never a bare GET, or a security
 * scanner will burn the invitation on delivery.
 *
 * WHAT THIS FILE CANNOT DO
 *
 * A signed token is stateless. Nothing inside one can stop it being forwarded,
 * redeemed twice, or minted beyond an allocation. Those rules are enforced against
 * a RECORD of issued invitations, which is why every function here takes that list
 * as an argument. There is no database in this repository yet; see
 * docs/build/invitation-mechanism.md §4.
 *
 * CALLER OBLIGATION. These are pure functions over a list the caller supplies. Two
 * concurrent requests reading the same list will both be allowed, and will both
 * allocate. The caller MUST serialise issuance and redemption per sponsor, or rely
 * on a unique constraint on `id` at the database. Neither can be enforced here.
 *
 * This file holds no personal data and performs no collection.
 */

/** Founding-period allocation. Signed by the founder, 16 August 2026. */
export const INVITES_PER_MEMBER = 2;

/**
 * How long an invitation stays open. Not specified by the spec; chosen so an
 * invitation is a real invitation rather than a standing entitlement.
 */
export const INVITATION_VALIDITY_DAYS = 30;

/**
 * Sponsor of an invitation sent by Sawayatra itself, per §5.1's house door.
 * Namespaced so it can never collide with a member id. Member ids must never
 * be allowed to take the `house:` prefix - `isHouseSponsor` is the only place
 * that decides what is uncapped.
 */
export const HOUSE_SPONSOR_ID = "house:sawayatra";

export function isHouseSponsor(sponsorId: string): boolean {
  return sponsorId === HOUSE_SPONSOR_ID;
}

/**
 * Domain tag. All token types in this codebase share one secret and one
 * `payload.signature` construction, so each payload states its own type and
 * every verifier requires it. Without this, two token types stay distinct only
 * as long as their required fields happen not to overlap.
 */
const TOKEN_TYPE = "invitation" as const;

export interface InvitationPayload {
  readonly typ: typeof TOKEN_TYPE;
  /** Stable identity. The only key redemption is matched on. */
  readonly id: string;
  /** Member id of the sponsor, or HOUSE_SPONSOR_ID. Permanent, per §5.3. */
  readonly sponsorId: string;
  /** Address the invitation was sent to. Redemption is bound to it. */
  readonly inviteeEmail: string;
  /** Which of the sponsor's allocation this is. Never reused. */
  readonly slot: number;
  readonly issuedAt: number;
  readonly expiresAt: number;
}

/** The shape a table would hold. `id` is the primary key. */
export interface InvitationRecord {
  readonly id: string;
  readonly sponsorId: string;
  readonly inviteeEmail: string;
  readonly slot: number;
  readonly issuedAt: number;
  readonly expiresAt: number;
  readonly redeemedAt?: number;
  /**
   * Withdrawn by the sponsor or the club. Distinct from expiry: an expired
   * invitation lapsed on its own, a revoked one was taken back. Both stop
   * redemption; only expiry is a natural end.
   */
  readonly revokedAt?: number;
}

export type AllocationRefusal =
  | "allocation-exhausted"
  | "already-invited"
  | "invalid-email";

export interface AllocationDecision {
  readonly allowed: boolean;
  readonly slot?: number;
  readonly reason?: AllocationRefusal;
  /**
   * Invitations still available to this sponsor after this one, or `null` when
   * the sponsor is uncapped (the house door, §5.1). `null` rather than Infinity
   * because Infinity does not survive JSON and would reach a client as `null`
   * anyway - this way the type says so and a caller must handle it.
   */
  readonly remaining: number | null;
}

function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function assertSecret(secret: string): void {
  if (secret.length < 32) {
    throw new Error("Invitation secret must be at least 32 characters.");
  }
}

/** Addresses are compared trimmed and lower-cased. */
export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Deliberately NOT canonicalised beyond case and whitespace. `bob+tag@` and
 * `b.o.b@` stay distinct from `bob@`: provider-specific alias rules are not
 * ours to guess, and guessing wrong would silently refuse a real person an
 * invitation. The cap counts invitations, not humans.
 */
function looksLikeEmail(email: string): boolean {
  const value = normaliseEmail(email);
  const [local] = value.split("@");
  return (
    value.length > 0 &&
    value.length <= 254 &&
    (local?.length ?? 0) <= 64 &&
    /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value)
  );
}

function isLive(invitation: InvitationRecord, at: number): boolean {
  return (
    invitation.redeemedAt === undefined &&
    invitation.revokedAt === undefined &&
    invitation.expiresAt > at
  );
}

/**
 * An invitation counts against allocation from the moment it is issued, not
 * when it is redeemed - otherwise a member could issue endlessly by never
 * having any accepted.
 *
 * A LAPSED or REVOKED invitation returns the slot. The seat was never taken.
 * Holding it open forever would quietly reduce a member's two to one.
 */
export function countIssuedAgainstAllocation(
  invitations: readonly InvitationRecord[],
  sponsorId: string,
  now: Date,
): number {
  const at = now.getTime();
  return invitations.filter(
    (invitation) =>
      invitation.sponsorId === sponsorId &&
      (invitation.redeemedAt !== undefined || isLive(invitation, at)),
  ).length;
}

export function remainingAllocation(
  invitations: readonly InvitationRecord[],
  sponsorId: string,
  now: Date,
): number | null {
  if (isHouseSponsor(sponsorId)) return null;
  return Math.max(
    0,
    INVITES_PER_MEMBER - countIssuedAgainstAllocation(invitations, sponsorId, now),
  );
}

/**
 * Slots are never reused, even when a lapsed invitation returns its allocation.
 * Reuse would let two records share (sponsor, email, slot) and, before `id`
 * existed, caused a redemption to mark both.
 */
function nextSlot(
  invitations: readonly InvitationRecord[],
  sponsorId: string,
): number {
  const highest = invitations
    .filter((invitation) => invitation.sponsorId === sponsorId)
    .reduce((max, invitation) => Math.max(max, invitation.slot), 0);
  return highest + 1;
}

/**
 * Whether this sponsor may issue an invitation to this address right now.
 *
 * PRIVACY. Only this sponsor's own invitations are consulted. Checking every
 * sponsor's would turn this into an oracle: any member could probe an address
 * and learn whether it had been invited to the club, without spending anything.
 * Two sponsors may therefore both invite the same person; the first redemption
 * wins and `canRedeemInvitation` refuses the rest.
 */
export function canIssueInvitation(
  invitations: readonly InvitationRecord[],
  sponsorId: string,
  inviteeEmail: string,
  now: Date,
  /**
   * Invitation ids that must not block a fresh invitation to the same address.
   * Used when a member has been removed: §10 says removal is terminal but
   * "re-entry requires a fresh invitation", so their spent invitation cannot
   * stand in the way. It still COUNTS against the sponsor's allocation, because
   * §5.3 suspends a sponsor's allocation on removal rather than refunding it.
   */
  ignoreForDuplicateCheck: readonly string[] = [],
): AllocationDecision {
  const remaining = remainingAllocation(invitations, sponsorId, now);

  if (!looksLikeEmail(inviteeEmail)) {
    return { allowed: false, reason: "invalid-email", remaining };
  }

  const email = normaliseEmail(inviteeEmail);
  const at = now.getTime();
  const alreadyMine = invitations.some(
    (invitation) =>
      invitation.sponsorId === sponsorId &&
      normaliseEmail(invitation.inviteeEmail) === email &&
      !ignoreForDuplicateCheck.includes(invitation.id) &&
      (invitation.redeemedAt !== undefined || isLive(invitation, at)),
  );
  if (alreadyMine) {
    return { allowed: false, reason: "already-invited", remaining };
  }

  if (remaining !== null && remaining <= 0) {
    return { allowed: false, reason: "allocation-exhausted", remaining: 0 };
  }

  return {
    allowed: true,
    slot: nextSlot(invitations, sponsorId),
    remaining: remaining === null ? null : remaining - 1,
  };
}

export function issueInvitationToken(
  payload: Omit<InvitationPayload, "typ" | "id" | "issuedAt" | "expiresAt"> & {
    readonly id?: string;
  },
  secret: string,
  now: Date,
  validityDays: number = INVITATION_VALIDITY_DAYS,
): { readonly token: string; readonly payload: InvitationPayload } {
  assertSecret(secret);
  const expires = new Date(now);
  expires.setUTCDate(expires.getUTCDate() + validityDays);
  const full: InvitationPayload = Object.freeze({
    typ: TOKEN_TYPE,
    id: payload.id ?? randomUUID(),
    sponsorId: payload.sponsorId,
    inviteeEmail: normaliseEmail(payload.inviteeEmail),
    slot: payload.slot,
    issuedAt: now.getTime(),
    expiresAt: expires.getTime(),
  });
  const body = Buffer.from(JSON.stringify(full), "utf8").toString("base64url");
  return { token: `${body}.${signature(body, secret)}`, payload: full };
}

/**
 * Returns the payload, or null. Null covers every failure - bad signature,
 * tampering, wrong token type, expiry, malformed - deliberately, so a caller
 * cannot distinguish "expired" from "forged" and leak the difference.
 */
export function verifyInvitationToken(
  token: string | undefined,
  secret: string | undefined,
  now: Date,
): InvitationPayload | null {
  if (!token || !secret || secret.length < 32) return null;
  const [body, presentedSignature, extra] = token.split(".");
  if (!body || !presentedSignature || extra) return null;

  const expected = Buffer.from(signature(body, secret));
  const presented = Buffer.from(presentedSignature);
  if (expected.length !== presented.length) return null;
  if (!timingSafeEqual(expected, presented)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Partial<InvitationPayload>;
    if (
      parsed.typ !== TOKEN_TYPE ||
      typeof parsed.id !== "string" ||
      parsed.id.length === 0 ||
      typeof parsed.sponsorId !== "string" ||
      parsed.sponsorId.length === 0 ||
      typeof parsed.inviteeEmail !== "string" ||
      !looksLikeEmail(parsed.inviteeEmail) ||
      typeof parsed.slot !== "number" ||
      !Number.isInteger(parsed.slot) ||
      parsed.slot < 1 ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= now.getTime()
    ) {
      return null;
    }
    return Object.freeze({
      typ: TOKEN_TYPE,
      id: parsed.id,
      sponsorId: parsed.sponsorId,
      inviteeEmail: normaliseEmail(parsed.inviteeEmail),
      slot: parsed.slot,
      issuedAt: parsed.issuedAt,
      expiresAt: parsed.expiresAt,
    });
  } catch {
    return null;
  }
}

export type RedemptionRefusal =
  | "invalid-token"
  | "wrong-recipient"
  | "no-record"
  | "already-redeemed"
  | "withdrawn"
  | "already-member";

export interface RedemptionDecision {
  readonly allowed: boolean;
  readonly payload?: InvitationPayload;
  readonly reason?: RedemptionRefusal;
}

/**
 * Single use. A valid signature is not enough: the invitation must still exist,
 * unredeemed and unwithdrawn, and the person redeeming must state the address it
 * was sent to.
 *
 * `presentedEmail` is REQUIRED. An earlier version made it optional and every
 * caller that forgot it accepted forwarded links silently.
 *
 * Order matters. The recipient check runs before the record is consulted, so a
 * stranger holding a forwarded link learns nothing about whether the invitation
 * exists or has been used.
 */
export function canRedeemInvitation(
  token: string | undefined,
  invitations: readonly InvitationRecord[],
  secret: string | undefined,
  now: Date,
  presentedEmail: string,
): RedemptionDecision {
  const payload = verifyInvitationToken(token, secret, now);
  if (!payload) return { allowed: false, reason: "invalid-token" };

  if (normaliseEmail(presentedEmail) !== payload.inviteeEmail) {
    return { allowed: false, reason: "wrong-recipient" };
  }

  const record = invitations.find((invitation) => invitation.id === payload.id);
  if (!record) return { allowed: false, reason: "no-record" };
  if (record.revokedAt !== undefined) {
    return { allowed: false, reason: "withdrawn" };
  }
  if (record.redeemedAt !== undefined) {
    return { allowed: false, reason: "already-redeemed" };
  }
  // The record carries its own expiry as well as the token, so an invitation
  // withdrawn by shortening it cannot still be redeemed on a live token.
  if (record.expiresAt <= now.getTime()) {
    return { allowed: false, reason: "invalid-token" };
  }

  const alreadyIn = invitations.some(
    (invitation) =>
      invitation.id !== record.id &&
      invitation.redeemedAt !== undefined &&
      normaliseEmail(invitation.inviteeEmail) === payload.inviteeEmail,
  );
  if (alreadyIn) return { allowed: false, reason: "already-member" };

  return { allowed: true, payload };
}

export interface RedemptionResult {
  readonly invitations: readonly InvitationRecord[];
  /** False when nothing matched. Never assume the caller checked. */
  readonly redeemed: boolean;
}

/**
 * Marks an invitation spent, by id. Pure: returns a new list, mutates nothing.
 * Takes the decision rather than a bare payload so it cannot be reached without
 * the record-level checks in `canRedeemInvitation` having run.
 */
export function redeemInvitation(
  invitations: readonly InvitationRecord[],
  decision: RedemptionDecision,
  now: Date,
): RedemptionResult {
  if (!decision.allowed || !decision.payload) {
    return { invitations, redeemed: false };
  }
  const id = decision.payload.id;
  let redeemed = false;
  const next = invitations.map((invitation) => {
    if (invitation.id !== id || invitation.redeemedAt !== undefined) {
      return invitation;
    }
    redeemed = true;
    return { ...invitation, redeemedAt: now.getTime() };
  });
  return { invitations: redeemed ? next : invitations, redeemed };
}

/** Withdraws an unredeemed invitation, returning the slot. Pure. */
export function revokeInvitation(
  invitations: readonly InvitationRecord[],
  id: string,
  now: Date,
): RedemptionResult {
  let revoked = false;
  const next = invitations.map((invitation) => {
    if (
      invitation.id !== id ||
      invitation.redeemedAt !== undefined ||
      invitation.revokedAt !== undefined
    ) {
      return invitation;
    }
    revoked = true;
    return { ...invitation, revokedAt: now.getTime() };
  });
  return { invitations: revoked ? next : invitations, redeemed: revoked };
}

/** Records an issued invitation. Pure: returns a new list, mutates nothing. */
export function recordInvitation(
  invitations: readonly InvitationRecord[],
  payload: InvitationPayload,
): readonly InvitationRecord[] {
  return [
    ...invitations,
    {
      id: payload.id,
      sponsorId: payload.sponsorId,
      inviteeEmail: normaliseEmail(payload.inviteeEmail),
      slot: payload.slot,
      issuedAt: payload.issuedAt,
      expiresAt: payload.expiresAt,
    },
  ];
}
