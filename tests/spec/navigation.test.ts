import { describe, expect, it } from "vitest";

import { footerNavigation, primaryNavigation } from "@/content/navigation";
import { rightHandNavigation } from "@/lib/sawayatra/navigation";

describe("v2.4 navigation", () => {
  it("leads with the unfamiliar concept in the required order", () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      "How it works",
      "Journeys",
      "Travel Self",
      "The Club",
      "Who we are",
    ]);
  });

  it("keeps Partners in the footer only", () => {
    expect(primaryNavigation.map((item) => item.href)).not.toContain("/partners");
    expect(footerNavigation.some((item) => item.href === "/partners")).toBe(true);
  });

  it("renders the exact right-hand state for every membership status", () => {
    expect(rightHandNavigation({ isSignedIn: false, membershipStatus: "none" }).map((item) => item.label)).toEqual(["Join", "Sign in"]);
    expect(rightHandNavigation({ isSignedIn: true, membershipStatus: "none" }).map((item) => item.label)).toEqual(["Join", "My account"]);
    expect(rightHandNavigation({ isSignedIn: true, membershipStatus: "applied" }).map((item) => item.label)).toEqual(["My application"]);
    expect(rightHandNavigation({ isSignedIn: true, membershipStatus: "member" }).map((item) => item.label)).toEqual(["My Sawayatra"]);
    expect(rightHandNavigation({ isSignedIn: true, membershipStatus: "declined" }).map((item) => item.label)).toEqual(["My account"]);
    expect(rightHandNavigation({ isSignedIn: true, membershipStatus: "lapsed" }).map((item) => item.label)).toEqual(["Renew", "My account"]);
  });

  it("contains no club-wide people or member directory destination", () => {
    for (const item of [...primaryNavigation, ...footerNavigation]) {
      expect(item.href).not.toMatch(/^\/(members|people|directory)(\/|$)/);
    }
  });
});
