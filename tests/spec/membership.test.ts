import { describe, expect, it } from "vitest";

import { HOUSE_SPONSOR_ID, verifyInvitationToken } from "@/lib/sawayatra/invitations";
import {
  canTransition,
  createInMemoryMembershipStore,
  issueInvitation,
  redeemInvitationForMember,
  removeMember,
  toLegacyStatus,
  toMemberSummary,
  verifyMember,
  withdrawInvitation,
  type HiddenProfile,
  type MembershipStore,
} from "@/lib/sawayatra/membership";

const SECRET = "a".repeat(32);
const NOW = new Date("2026-08-16T12:00:00.000Z");
const DAY = 86_400_000;

let ids = 0;
const nextId = () => `member-${++ids}`;

const PROFILE: HiddenProfile = {
  legalName: "Hannah Marie Weiss",
  dateOfBirth: "1968-03-14",
  email: "hannah@example.com",
};

async function invited(store: MembershipStore, email: string, sponsor = HOUSE_SPONSOR_ID) {
  const issued = await issueInvitation(store, sponsor, email, SECRET, NOW);
  expect(issued.ok).toBe(true);
  return issued.value!;
}

async function registered(store: MembershipStore, email: string, sponsor = HOUSE_SPONSOR_ID) {
  const { token } = await invited(store, email, sponsor);
  const result = await redeemInvitationForMember(store, token, email, SECRET, NOW, nextId);
  expect(result.ok).toBe(true);
  return result.value!;
}

describe("founder invitations, spec v3.1 §5.1", () => {
  it("are not capped", async () => {
    const store = createInMemoryMembershipStore();
    for (let i = 0; i < 12; i += 1) {
      const result = await issueInvitation(
        store,
        HOUSE_SPONSOR_ID,
        `founding${i}@example.com`,
        SECRET,
        NOW,
      );
      expect(result.ok).toBe(true);
      expect(result.value?.remaining).toBeNull();
    }
    expect(await store.listInvitations()).toHaveLength(12);
  });

  it("carry the house as sponsor, permanently", async () => {
    const store = createInMemoryMembershipStore();
    const { token } = await invited(store, "guest@example.com");
    expect(verifyInvitationToken(token, SECRET, NOW)?.sponsorId).toBe(HOUSE_SPONSOR_ID);
    const member = await registered(store, "second@example.com");
    expect(member.sponsorId).toBe(HOUSE_SPONSOR_ID);
  });
});

describe("member invitations, spec v3.1 §5.2", () => {
  it("are capped at two, on the same code path", async () => {
    const store = createInMemoryMembershipStore();
    expect((await issueInvitation(store, "member-1", "a@example.com", SECRET, NOW)).ok).toBe(true);
    expect((await issueInvitation(store, "member-1", "b@example.com", SECRET, NOW)).ok).toBe(true);
    const third = await issueInvitation(store, "member-1", "c@example.com", SECRET, NOW);
    expect(third).toMatchObject({ ok: false, reason: "allocation-exhausted" });
  });

  it("reports what is left after each", async () => {
    const store = createInMemoryMembershipStore();
    const first = await issueInvitation(store, "member-1", "a@example.com", SECRET, NOW);
    expect(first.value?.remaining).toBe(1);
    const second = await issueInvitation(store, "member-1", "b@example.com", SECRET, NOW);
    expect(second.value?.remaining).toBe(0);
  });
});

describe("redemption creates a member", () => {
  it("in registered, not verified", async () => {
    const store = createInMemoryMembershipStore();
    const member = await registered(store, "hannah@example.com");
    expect(member.state).toBe("registered");
    expect(member.verifiedAt).toBeUndefined();
    expect(toLegacyStatus(member.state)).toBe("applied");
  });

  it("binds to the address the invitation was sent to", async () => {
    const store = createInMemoryMembershipStore();
    const { token } = await invited(store, "hannah@example.com");
    const wrong = await redeemInvitationForMember(
      store,
      token,
      "someone-else@example.com",
      SECRET,
      NOW,
      nextId,
    );
    expect(wrong).toMatchObject({ ok: false, reason: "wrong-recipient" });
    expect(await store.listMembers()).toHaveLength(0);
  });

  it("cannot be done twice with the same link", async () => {
    const store = createInMemoryMembershipStore();
    const { token } = await invited(store, "hannah@example.com");
    expect((await redeemInvitationForMember(store, token, "hannah@example.com", SECRET, NOW, nextId)).ok).toBe(true);
    expect(
      await redeemInvitationForMember(store, token, "hannah@example.com", SECRET, NOW, nextId),
    ).toMatchObject({ ok: false, reason: "already-redeemed" });
    expect(await store.listMembers()).toHaveLength(1);
  });

  it("refuses to invite someone who is already a member", async () => {
    const store = createInMemoryMembershipStore();
    await registered(store, "hannah@example.com");
    expect(
      await issueInvitation(store, HOUSE_SPONSOR_ID, "Hannah@Example.com", SECRET, NOW),
    ).toMatchObject({ ok: false, reason: "already-member" });
  });
});

describe("withdrawing an invitation", () => {
  it("stops the link working and returns a member's slot", async () => {
    const store = createInMemoryMembershipStore();
    const first = await issueInvitation(store, "member-1", "a@example.com", SECRET, NOW);
    await issueInvitation(store, "member-1", "b@example.com", SECRET, NOW);
    expect((await issueInvitation(store, "member-1", "c@example.com", SECRET, NOW)).ok).toBe(false);

    expect((await withdrawInvitation(store, first.value!.invitationId, NOW)).ok).toBe(true);

    const replacement = await issueInvitation(store, "member-1", "c@example.com", SECRET, NOW);
    expect(replacement.ok).toBe(true);

    const redeemed = await redeemInvitationForMember(
      store,
      first.value!.token,
      "a@example.com",
      SECRET,
      NOW,
      nextId,
    );
    expect(redeemed).toMatchObject({ ok: false, reason: "withdrawn" });
  });

  it("reports when there was nothing to withdraw", async () => {
    const store = createInMemoryMembershipStore();
    expect(await withdrawInvitation(store, "no-such-id", NOW)).toMatchObject({
      ok: false,
      reason: "no-record",
    });
  });
});

describe("verification, spec v3.1 §3.1", () => {
  it("moves registered to verified and only then counts as a member", async () => {
    const store = createInMemoryMembershipStore();
    const member = await registered(store, "hannah@example.com");
    const verified = await verifyMember(store, member.id, PROFILE, true, NOW);
    expect(verified.ok).toBe(true);
    expect(verified.value?.state).toBe("verified");
    expect(toLegacyStatus(verified.value!.state)).toBe("member");
  });

  it("refuses without the second anchor", async () => {
    const store = createInMemoryMembershipStore();
    const member = await registered(store, "hannah@example.com");
    expect(await verifyMember(store, member.id, PROFILE, false, NOW)).toMatchObject({
      ok: false,
      reason: "wrong-state",
    });
  });

  it("cannot verify twice", async () => {
    const store = createInMemoryMembershipStore();
    const member = await registered(store, "hannah@example.com");
    await verifyMember(store, member.id, PROFILE, true, NOW);
    expect(await verifyMember(store, member.id, PROFILE, true, NOW)).toMatchObject({
      ok: false,
      reason: "wrong-state",
    });
  });
});

describe("removal, spec v3.1 §5.3 and §10", () => {
  it("names the sponsor whose allocation is to be reviewed", async () => {
    const store = createInMemoryMembershipStore();
    const { token } = await invited(store, "guest@example.com", "member-7");
    const member = (
      await redeemInvitationForMember(store, token, "guest@example.com", SECRET, NOW, nextId)
    ).value!;
    const removed = await removeMember(store, member.id, NOW);
    expect(removed.value?.sponsorToReview).toBe("member-7");
  });

  it("names nobody when the house was the sponsor", async () => {
    const store = createInMemoryMembershipStore();
    const member = await registered(store, "guest@example.com");
    expect((await removeMember(store, member.id, NOW)).value?.sponsorToReview).toBeNull();
  });

  it("is terminal", async () => {
    const store = createInMemoryMembershipStore();
    const member = await registered(store, "guest@example.com");
    await removeMember(store, member.id, NOW);
    expect(await verifyMember(store, member.id, PROFILE, true, NOW)).toMatchObject({
      ok: false,
      reason: "wrong-state",
    });
    expect(canTransition("removed", "verified")).toBe(false);
    expect(canTransition("removed", "registered")).toBe(false);
  });

  it("lets a removed person be invited again, per §10", async () => {
    const store = createInMemoryMembershipStore();
    const member = await registered(store, "guest@example.com");
    await removeMember(store, member.id, NOW);
    const again = await issueInvitation(
      store,
      HOUSE_SPONSOR_ID,
      "guest@example.com",
      SECRET,
      new Date(NOW.getTime() + 60 * DAY),
    );
    expect(again.ok).toBe(true);
  });

  it("does not refund the sponsor's slot when their invitee is removed", async () => {
    const store = createInMemoryMembershipStore();
    const first = await invited(store, "a@example.com", "member-7");
    await invited(store, "b@example.com", "member-7");

    const member = (
      await redeemInvitationForMember(store, first.token, "a@example.com", SECRET, NOW, nextId)
    ).value!;
    await removeMember(store, member.id, NOW);

    // §5.3 suspends and reviews the sponsor's allocation. It does not hand it back.
    expect(
      await issueInvitation(store, "member-7", "c@example.com", SECRET, NOW),
    ).toMatchObject({ ok: false, reason: "allocation-exhausted" });
  });
});

describe("concurrency is settled by the store, not the caller", () => {
  it("two simultaneous issues cannot both take the last slot", async () => {
    const store = createInMemoryMembershipStore();
    await issueInvitation(store, "member-1", "a@example.com", SECRET, NOW);

    const [first, second] = await Promise.all([
      issueInvitation(store, "member-1", "b@example.com", SECRET, NOW),
      issueInvitation(store, "member-1", "c@example.com", SECRET, NOW),
    ]);

    const won = [first, second].filter((result) => result.ok);
    expect(won).toHaveLength(1);
    expect(await store.listInvitations("member-1")).toHaveLength(2);
  });

  it("two simultaneous redemptions of one link make one member", async () => {
    const store = createInMemoryMembershipStore();
    const { token } = await invited(store, "hannah@example.com");

    const [first, second] = await Promise.all([
      redeemInvitationForMember(store, token, "hannah@example.com", SECRET, NOW, nextId),
      redeemInvitationForMember(store, token, "hannah@example.com", SECRET, NOW, nextId),
    ]);

    expect([first, second].filter((result) => result.ok)).toHaveLength(1);
    expect(await store.listMembers()).toHaveLength(1);
  });
});

describe("the state machine", () => {
  it("allows only the transitions §10 defines", () => {
    expect(canTransition("invited", "registered")).toBe(true);
    expect(canTransition("registered", "verified")).toBe(true);
    expect(canTransition("verified", "lapsed")).toBe(true);
    expect(canTransition("lapsed", "verified")).toBe(true);

    expect(canTransition("invited", "verified")).toBe(false);
    expect(canTransition("registered", "lapsed")).toBe(false);
    expect(canTransition("verified", "registered")).toBe(false);
  });

  it("treats only verified as a member for the older model", () => {
    expect(toLegacyStatus("verified")).toBe("member");
    expect(toLegacyStatus("registered")).toBe("applied");
    expect(toLegacyStatus("invited")).toBe("applied");
    expect(toLegacyStatus("lapsed")).toBe("lapsed");
    expect(toLegacyStatus("removed")).toBe("declined");
  });
});

describe("the admin list never carries the hidden profile, rule 4.2", () => {
  it("drops date of birth and travel details on the way out", async () => {
    const store = createInMemoryMembershipStore();
    const member = await registered(store, "hannah@example.com");
    const verified = (await verifyMember(store, member.id, PROFILE, true, NOW)).value!;
    const summary = toMemberSummary(verified);

    expect(verified.hiddenProfile?.dateOfBirth).toBe("1968-03-14");
    expect(JSON.stringify(summary)).not.toContain("1968");
    expect(JSON.stringify(summary)).not.toContain("dateOfBirth");
    expect(JSON.stringify(summary)).not.toContain("legalName");
    expect("hiddenProfile" in summary).toBe(false);
    expect("travelDetails" in summary).toBe(false);
  });
});
