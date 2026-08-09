/**
 * Invitation — spec v3.1 §5. The vouch is the club's strongest safety
 * instrument; this module keeps it accountable.
 */

/** Carrier of the unfilled INVITES_PER_MEMBER token. Injected, no default. */
export interface InvitationPolicy {
  readonly invitesPerMember: number;
}

export interface InvitationRecord {
  readonly id: string;
  /** §5.3 — the sponsor's name lives permanently in the hidden record. */
  readonly sponsorMemberId: string;
  readonly invitedMemberId: string;
  readonly issuedAt: Date;
}

export interface SponsorAllocation {
  readonly memberId: string;
  readonly used: number;
  /** §5.3 — suspended pending review when an invitee is removed for conduct. */
  readonly suspended: boolean;
}

export function canInvite(
  allocation: SponsorAllocation,
  policy: InvitationPolicy,
): boolean {
  return !allocation.suspended && allocation.used < policy.invitesPerMember;
}

/**
 * §5.3 — if an invited member is removed for conduct, the sponsor's
 * remaining allocation is suspended and reviewed.
 */
export function suspendAfterInviteeRemoval(
  allocation: SponsorAllocation,
): SponsorAllocation {
  return { ...allocation, suspended: true };
}

/**
 * §5.4 — removal requires a written reason from a documented list of
 * grounds, and every removed member has a stated appeal route to a named
 * human. Removal without cause or appeal is the specific failure this type
 * makes unrepresentable.
 */
export const REMOVAL_GROUNDS = [
  "conduct-toward-member",
  "conduct-on-journey",
  "breach-of-terms",
  "misrepresented-identity",
  "contact-detail-repeat-violations",
] as const;

export type RemovalGround = (typeof REMOVAL_GROUNDS)[number];

export interface RemovalRecord {
  readonly memberId: string;
  readonly ground: RemovalGround;
  /** Written reason — mandatory, never empty. */
  readonly writtenReason: string;
  /** A named human, not a queue. */
  readonly appealRoute: { readonly contactName: string; readonly route: string };
  readonly decidedAt: Date;
}

export function createRemoval(record: RemovalRecord): RemovalRecord {
  if (record.writtenReason.trim().length === 0) {
    throw new Error("Removal requires a written reason (§5.4).");
  }
  if (record.appealRoute.contactName.trim().length === 0) {
    throw new Error("Every removal carries an appeal route to a named human (§5.4).");
  }
  return record;
}
