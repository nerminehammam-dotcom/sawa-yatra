import { describe, expect, it } from "vitest";

import {
  canIssueInvitation,
  canRedeemInvitation,
  countIssuedAgainstAllocation,
  HOUSE_SPONSOR_ID,
  INVITES_PER_MEMBER,
  isHouseSponsor,
  issueInvitationToken,
  normaliseEmail,
  recordInvitation,
  redeemInvitation,
  remainingAllocation,
  revokeInvitation,
  verifyInvitationToken,
  type InvitationRecord,
} from "@/lib/sawayatra/invitations";
import {
  issueInterestToken,
  issueSessionToken,
  verifyInterestToken,
  verifySessionToken,
} from "@/lib/sawayatra/session";

const SECRET = "a".repeat(32);
const OTHER_SECRET = "b".repeat(32);
const NOW = new Date("2026-08-16T12:00:00.000Z");
const DAY = 86_400_000;
const SPONSOR = "member-1";

function issue(email: string, slot: number, sponsorId = SPONSOR, now = NOW) {
  return issueInvitationToken({ sponsorId, inviteeEmail: email, slot }, SECRET, now);
}

let seq = 0;
function record(overrides: Partial<InvitationRecord> = {}): InvitationRecord {
  seq += 1;
  return {
    id: `inv-${seq}`,
    sponsorId: SPONSOR,
    inviteeEmail: `person${seq}@example.com`,
    slot: seq,
    issuedAt: NOW.getTime(),
    expiresAt: NOW.getTime() + 30 * DAY,
    ...overrides,
  };
}

/** Issue, record, and hand back both, the way a caller must. */
function issueAndRecord(
  invitations: readonly InvitationRecord[],
  email: string,
  sponsorId = SPONSOR,
  now = NOW,
) {
  const decision = canIssueInvitation(invitations, sponsorId, email, now);
  if (!decision.allowed) throw new Error(`refused: ${decision.reason}`);
  const issued = issueInvitationToken(
    { sponsorId, inviteeEmail: email, slot: decision.slot! },
    SECRET,
    now,
  );
  return {
    token: issued.token,
    invitations: recordInvitation(invitations, issued.payload),
    slot: decision.slot!,
    remaining: decision.remaining,
  };
}

describe("allocation", () => {
  it("lets a member issue exactly two, then refuses", () => {
    let state: readonly InvitationRecord[] = [];

    const first = issueAndRecord(state, "one@example.com");
    expect(first.slot).toBe(1);
    expect(first.remaining).toBe(1);
    state = first.invitations;

    const second = issueAndRecord(state, "two@example.com");
    expect(second.slot).toBe(2);
    expect(second.remaining).toBe(0);
    state = second.invitations;

    expect(canIssueInvitation(state, SPONSOR, "three@example.com", NOW)).toMatchObject({
      allowed: false,
      reason: "allocation-exhausted",
      remaining: 0,
    });
  });

  it("counts from issue, not from redemption", () => {
    const state = [record({ slot: 1 }), record({ slot: 2 })];
    expect(countIssuedAgainstAllocation(state, SPONSOR, NOW)).toBe(2);
    expect(remainingAllocation(state, SPONSOR, NOW)).toBe(0);
  });

  it("returns a lapsed, unredeemed invitation to the allocation", () => {
    const lapsed = record({ expiresAt: NOW.getTime() - 1 });
    expect(remainingAllocation([lapsed], SPONSOR, NOW)).toBe(2);
  });

  it("does not return a lapsed invitation that was redeemed", () => {
    const taken = record({ expiresAt: NOW.getTime() - 1, redeemedAt: NOW.getTime() - 2 });
    expect(remainingAllocation([taken], SPONSOR, NOW)).toBe(1);
  });

  it("keeps allocations separate per sponsor", () => {
    const state = [
      record({ sponsorId: "member-1", slot: 1 }),
      record({ sponsorId: "member-1", slot: 2 }),
      record({ sponsorId: "member-2", slot: 1 }),
    ];
    expect(remainingAllocation(state, "member-1", NOW)).toBe(0);
    expect(remainingAllocation(state, "member-2", NOW)).toBe(1);
    expect(remainingAllocation(state, "member-3", NOW)).toBe(2);
  });

  it("never reuses a slot after one lapses", () => {
    const lapsed = record({
      inviteeEmail: "bob@example.com",
      slot: 1,
      expiresAt: NOW.getTime() - 1,
    });
    const again = canIssueInvitation([lapsed], SPONSOR, "bob@example.com", NOW);
    expect(again.allowed).toBe(true);
    expect(again.slot).toBe(2);
  });

  it("a lapsed invitation re-sent and redeemed costs exactly one slot", () => {
    const lapsed = record({
      inviteeEmail: "bob@example.com",
      slot: 1,
      expiresAt: NOW.getTime() - 1,
    });
    const reissued = issueAndRecord([lapsed], "bob@example.com");
    const decision = canRedeemInvitation(
      reissued.token,
      reissued.invitations,
      SECRET,
      NOW,
      "bob@example.com",
    );
    const after = redeemInvitation(reissued.invitations, decision, NOW);
    expect(after.redeemed).toBe(true);
    expect(after.invitations.filter((i) => i.redeemedAt !== undefined)).toHaveLength(1);
    expect(remainingAllocation(after.invitations, SPONSOR, NOW)).toBe(1);
  });

  it("refuses a second open invitation to a person this sponsor already invited", () => {
    const mine = [record({ inviteeEmail: "Someone@Example.com", slot: 1 })];
    expect(canIssueInvitation(mine, SPONSOR, "someone@example.com", NOW)).toMatchObject({
      allowed: false,
      reason: "already-invited",
    });
  });

  it("does not disclose an invitation issued by another sponsor", () => {
    const theirs = [record({ sponsorId: "member-9", inviteeEmail: "famous@person.com", slot: 1 })];
    const probe = canIssueInvitation(theirs, SPONSOR, "famous@person.com", NOW);
    const control = canIssueInvitation(theirs, SPONSOR, "nobody@person.com", NOW);
    expect(probe.allowed).toBe(true);
    expect(probe.reason).toEqual(control.reason);
  });

  it("refuses an address that is not one", () => {
    for (const bad of ["", "   ", "not-an-email", "a@b", "a b@example.com", "a@b..c"]) {
      expect(canIssueInvitation([], SPONSOR, bad, NOW)).toMatchObject({
        allowed: false,
        reason: "invalid-email",
      });
    }
  });

  it("accepts 254 characters and refuses 255, and refuses a local part over 64", () => {
    const domain = "@example.com";
    const ok = `${"a".repeat(64)}@${"b".repeat(254 - 64 - 1 - 4)}.com`;
    expect(ok.length).toBe(254);
    expect(canIssueInvitation([], SPONSOR, ok, NOW).allowed).toBe(true);
    expect(canIssueInvitation([], SPONSOR, `a${ok}`, NOW).reason).toBe("invalid-email");
    expect(canIssueInvitation([], SPONSOR, `${"a".repeat(65)}${domain}`, NOW).reason).toBe(
      "invalid-email",
    );
  });

  it("treats plus and dot forms as different addresses, deliberately", () => {
    const mine = [record({ inviteeEmail: "bob@example.com", slot: 1 })];
    expect(canIssueInvitation(mine, SPONSOR, "bob+tag@example.com", NOW).allowed).toBe(true);
  });
});

describe("the house door, spec v3.1 §5.1", () => {
  it("is uncapped and reports remaining as null, not a number", () => {
    const many = Array.from({ length: 50 }, (_, index) =>
      record({ sponsorId: HOUSE_SPONSOR_ID, slot: index + 1 }),
    );
    const decision = canIssueInvitation(many, HOUSE_SPONSOR_ID, "another@example.com", NOW);
    expect(decision.allowed).toBe(true);
    expect(decision.slot).toBe(51);
    expect(decision.remaining).toBeNull();
    expect(remainingAllocation(many, HOUSE_SPONSOR_ID, NOW)).toBeNull();
  });

  it("survives a JSON round trip without becoming a cap", () => {
    const decision = canIssueInvitation([], HOUSE_SPONSOR_ID, "a@example.com", NOW);
    const overTheWire = JSON.parse(JSON.stringify(decision)) as typeof decision;
    expect(overTheWire.remaining).toBeNull();
    expect(overTheWire.remaining === null).toBe(true);
  });

  it("cannot be impersonated by a member id", () => {
    expect(isHouseSponsor("sawayatra")).toBe(false);
    expect(remainingAllocation([], "sawayatra", NOW)).toBe(INVITES_PER_MEMBER);
    const state = [
      record({ sponsorId: "sawayatra", slot: 1 }),
      record({ sponsorId: "sawayatra", slot: 2 }),
    ];
    expect(canIssueInvitation(state, "sawayatra", "third@example.com", NOW)).toMatchObject({
      allowed: false,
      reason: "allocation-exhausted",
    });
  });
});

describe("tokens", () => {
  it("round-trips, and returns the payload it signed", () => {
    const { token, payload } = issue("guest@example.com", 1);
    expect(payload.id).toMatch(/[0-9a-f-]{36}/);
    expect(verifyInvitationToken(token, SECRET, NOW)).toEqual(payload);
  });

  it("lower-cases and trims the address it carries", () => {
    const { token } = issue("  Guest@Example.COM  ", 1);
    expect(verifyInvitationToken(token, SECRET, NOW)?.inviteeEmail).toBe("guest@example.com");
    expect(normaliseEmail(" A@B.CO ")).toBe("a@b.co");
  });

  it("refuses a different secret, a tampered payload, and a mangled signature", () => {
    const { token } = issue("guest@example.com", 1);
    expect(verifyInvitationToken(token, OTHER_SECRET, NOW)).toBeNull();

    const [body, sig] = token.split(".");
    const decoded = JSON.parse(Buffer.from(body!, "base64url").toString("utf8"));
    decoded.inviteeEmail = "attacker@example.com";
    const forged = Buffer.from(JSON.stringify(decoded), "utf8").toString("base64url");
    expect(verifyInvitationToken(`${forged}.${sig}`, SECRET, NOW)).toBeNull();

    expect(verifyInvitationToken(body, SECRET, NOW)).toBeNull();
    expect(verifyInvitationToken(`${body}.${sig}.${sig}`, SECRET, NOW)).toBeNull();
  });

  it("is valid the instant before expiry and invalid at it", () => {
    const { token, payload } = issue("guest@example.com", 1);
    expect(verifyInvitationToken(token, SECRET, new Date(payload.expiresAt - 1))).not.toBeNull();
    expect(verifyInvitationToken(token, SECRET, new Date(payload.expiresAt))).toBeNull();
  });

  it("refuses a weak or missing secret at both ends", () => {
    expect(() =>
      issueInvitationToken({ sponsorId: SPONSOR, inviteeEmail: "a@b.co", slot: 1 }, "short", NOW),
    ).toThrow(/at least 32/);
    const { token } = issue("guest@example.com", 1);
    expect(verifyInvitationToken(token, "short", NOW)).toBeNull();
    expect(verifyInvitationToken(token, undefined, NOW)).toBeNull();
  });

  it("refuses rubbish without throwing", () => {
    for (const bad of ["", "...", "a.b", "!!!.???", "eyJhIjoxfQ.zzz"]) {
      expect(verifyInvitationToken(bad, SECRET, NOW)).toBeNull();
    }
  });

  it("refuses a session or interest token signed with the same secret", () => {
    const session = issueSessionToken(
      {
        memberId: "member-1",
        membershipStatus: "member",
        hasSavedTravelSelf: true,
        declaredJourneyIds: [],
        authoredJourneyIds: [],
        isClubStaff: false,
      },
      SECRET,
      new Date(NOW.getTime() + DAY),
    );
    const interest = issueInterestToken("member-1", "journey-andean-caravan", SECRET, NOW);

    expect(verifyInvitationToken(session, SECRET, NOW)).toBeNull();
    expect(verifyInvitationToken(interest, SECRET, NOW)).toBeNull();
  });

  it("is refused by the session and interest verifiers in turn", () => {
    const { token } = issue("guest@example.com", 1);
    expect(verifySessionToken(token, SECRET, NOW).isSignedIn).toBe(false);
    expect(verifyInterestToken(token, "member-1", SECRET, NOW)).toBeNull();
  });
});

describe("redemption", () => {
  function open(email = "guest@example.com") {
    const issued = issueAndRecord([], email);
    return { ...issued, email };
  }

  it("accepts the recipient", () => {
    const { token, invitations, email } = open();
    const decision = canRedeemInvitation(token, invitations, SECRET, NOW, email);
    expect(decision.allowed).toBe(true);
    expect(decision.payload?.inviteeEmail).toBe(email);
  });

  it("accepts the recipient whatever case they type", () => {
    const { token, invitations } = open();
    expect(
      canRedeemInvitation(token, invitations, SECRET, NOW, "  GUEST@Example.com ").allowed,
    ).toBe(true);
  });

  it("is single use, and marks exactly one record", () => {
    const { token, invitations, email } = open();
    const first = canRedeemInvitation(token, invitations, SECRET, NOW, email);
    const after = redeemInvitation(invitations, first, NOW);
    expect(after.redeemed).toBe(true);
    expect(after.invitations.filter((i) => i.redeemedAt !== undefined)).toHaveLength(1);

    expect(canRedeemInvitation(token, after.invitations, SECRET, NOW, email)).toMatchObject({
      allowed: false,
      reason: "already-redeemed",
    });
  });

  it("refuses a forwarded link presented by someone else", () => {
    const { token, invitations } = open();
    expect(
      canRedeemInvitation(token, invitations, SECRET, NOW, "someone-else@example.com"),
    ).toMatchObject({ allowed: false, reason: "wrong-recipient" });
  });

  it("tells a stranger nothing about the record", () => {
    const { token, invitations, email } = open();
    const redeemed = redeemInvitation(
      invitations,
      canRedeemInvitation(token, invitations, SECRET, NOW, email),
      NOW,
    ).invitations;
    const stranger = canRedeemInvitation(token, redeemed, SECRET, NOW, "nosy@example.com");
    expect(stranger.reason).toBe("wrong-recipient");
  });

  it("refuses a signed token with no matching record", () => {
    const { token } = issue("ghost@example.com", 1);
    expect(canRedeemInvitation(token, [], SECRET, NOW, "ghost@example.com")).toMatchObject({
      allowed: false,
      reason: "no-record",
    });
  });

  it("refuses a withdrawn invitation even though the token is still live", () => {
    const { token, invitations, email } = open();
    const withdrawn = revokeInvitation(invitations, invitations[0]!.id, NOW);
    expect(withdrawn.redeemed).toBe(true);
    expect(
      canRedeemInvitation(token, withdrawn.invitations, SECRET, NOW, email),
    ).toMatchObject({ allowed: false, reason: "withdrawn" });
    expect(remainingAllocation(withdrawn.invitations, SPONSOR, NOW)).toBe(2);
  });

  it("refuses when the record was expired early, whatever the token says", () => {
    const { token, invitations, email } = open();
    const shortened = invitations.map((i) => ({ ...i, expiresAt: NOW.getTime() - 1 }));
    expect(canRedeemInvitation(token, shortened, SECRET, NOW, email)).toMatchObject({
      allowed: false,
      reason: "invalid-token",
    });
  });

  it("refuses a second invitation to someone who already joined", () => {
    const first = issueAndRecord([], "guest@example.com", "member-1");
    const taken = redeemInvitation(
      first.invitations,
      canRedeemInvitation(first.token, first.invitations, SECRET, NOW, "guest@example.com"),
      NOW,
    ).invitations;
    const second = issueAndRecord(taken, "guest@example.com", "member-2");
    expect(
      canRedeemInvitation(second.token, second.invitations, SECRET, NOW, "guest@example.com"),
    ).toMatchObject({ allowed: false, reason: "already-member" });
  });

  it("reports invalid-token for anything unsigned or expired, never distinguishing why", () => {
    const { token, invitations, email } = open();
    expect(canRedeemInvitation("rubbish", invitations, SECRET, NOW, email)).toMatchObject({
      reason: "invalid-token",
    });
    const later = new Date(NOW.getTime() + 31 * DAY);
    expect(canRedeemInvitation(token, invitations, SECRET, later, email)).toMatchObject({
      reason: "invalid-token",
    });
  });

  it("does not mutate the list it is given", () => {
    const { token, invitations, email } = open();
    redeemInvitation(invitations, canRedeemInvitation(token, invitations, SECRET, NOW, email), NOW);
    expect(invitations[0]?.redeemedAt).toBeUndefined();
  });

  it("reports when there was nothing to redeem", () => {
    const { invitations } = open();
    expect(redeemInvitation(invitations, { allowed: false, reason: "no-record" }, NOW)).toEqual({
      invitations,
      redeemed: false,
    });
  });
});

describe("the caller's obligation", () => {
  it("two decisions from the same list allocate the same slot, so callers must serialise", () => {
    const state = [record({ slot: 1 })];
    const a = canIssueInvitation(state, SPONSOR, "a@example.com", NOW);
    const b = canIssueInvitation(state, SPONSOR, "b@example.com", NOW);
    expect(a.slot).toBe(b.slot);
    expect(a.allowed && b.allowed).toBe(true);
  });
});

describe("the sponsor chain, spec v3.1 §5.3", () => {
  it("carries the sponsor into the record permanently", () => {
    const { invitations } = issueAndRecord([], "guest@example.com");
    expect(invitations[0]?.sponsorId).toBe(SPONSOR);
  });
});
