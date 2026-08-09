// @vitest-environment jsdom
/** Area F — §5 invitation, §8 money format, no-tier-table rule. */
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import MembershipPage from "@/app/(public)/membership/page";
import { invitationModel, membershipMoney } from "@/content/membership";
import { unfilledSpecTokens } from "@/content/spec-tokens";
import {
  canInvite,
  createRemoval,
  suspendAfterInviteeRemoval,
} from "@/lib/membership/invitation";

afterEach(cleanup);

describe("§5 invitation model", () => {
  it("founding cohort waiver is stated in the invitation itself, for life", () => {
    expect(invitationModel.founding).toMatch(/waived for life/);
    expect(invitationModel.founding).toMatch(/invitation letter itself/);
  });

  it("the house door is permanently open", () => {
    expect(invitationModel.houseDoor).toMatch(/permanently open/);
  });

  it("allocation is a token, and budget + suspension behave per §5.2–5.3", () => {
    expect(invitationModel.allocationToken).toBe("INVITES_PER_MEMBER");
    const policy = { invitesPerMember: 3 }; // test fixture only
    expect(canInvite({ memberId: "m", used: 2, suspended: false }, policy)).toBe(true);
    expect(canInvite({ memberId: "m", used: 3, suspended: false }, policy)).toBe(false);
    const suspended = suspendAfterInviteeRemoval({ memberId: "m", used: 0, suspended: false });
    expect(canInvite(suspended, policy)).toBe(false);
  });

  it("removal requires written reason and a named-human appeal route (§5.4)", () => {
    const valid = {
      memberId: "m",
      ground: "breach-of-terms" as const,
      writtenReason: "Documented breach of the contact-details term.",
      appealRoute: { contactName: "Nermine", route: "appeals@sawayatra" },
      decidedAt: new Date(),
    };
    expect(createRemoval(valid)).toEqual(valid);
    expect(() => createRemoval({ ...valid, writtenReason: "  " })).toThrow(/written reason/);
    expect(() =>
      createRemoval({ ...valid, appealRoute: { contactName: "", route: "x" } }),
    ).toThrow(/named human/);
  });
});

describe("§8 money format", () => {
  it("is three separate lines, each a token, never absorbed", () => {
    expect(membershipMoney.lines.map((line) => line.token)).toEqual([
      "JOINING_FEE",
      "SERVICE_CHARGE",
      "HOUSEHOLD_FEE",
    ]);
    expect(membershipMoney.lines[1]?.detail).toMatch(/own line/);
  });

  it("checkout order matches §8.4 with price paired at step two", () => {
    expect(membershipMoney.checkoutOrder[1]).toMatch(/floor beside it/);
    expect(membershipMoney.checkoutOrder.at(-1)).toBe("Total");
    expect(membershipMoney.checkoutOrder.at(-2)).toBe("Identity check");
  });

  it("renders no tier table anywhere while §8 tokens are unfilled", () => {
    expect(unfilledSpecTokens()).toContain("JOINING_FEE");
    const { container } = render(<MembershipPage />);
    expect(container.textContent?.toLowerCase()).not.toMatch(/tier/);
    expect(container.querySelector("table")).toBeNull();
  });

  it("dev surface shows the three money lines as visible token markers", () => {
    const { container } = render(<MembershipPage />);
    expect(container.textContent).toContain("{{JOINING_FEE}}");
    expect(container.textContent).toContain("{{SERVICE_CHARGE}}");
    expect(container.textContent).toContain("{{HOUSEHOLD_FEE}}");
  });
});
