/** Area B — §2.3: the nav is exactly four items. */
import { describe, expect, it } from "vitest";

import {
  footerNavigation,
  primaryNavigation,
  utilityNavigation,
} from "@/content/navigation";

describe("§2.3 primary navigation", () => {
  it("is exactly: The Andean Caravan · Journeys · How it works · Membership", () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      "The Andean Caravan",
      "Journeys",
      "How it works",
      "Membership",
    ]);
  });

  it("has no Create-your-own or Departure-dates destination in any nav set", () => {
    const all = [...primaryNavigation, ...utilityNavigation, ...footerNavigation];
    for (const item of all) {
      expect(item.href).not.toMatch(/create-your-own|do-it-yourself|departure-dates/);
    }
  });
});
