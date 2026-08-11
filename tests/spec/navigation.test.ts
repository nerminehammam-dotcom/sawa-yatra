/** Area B — §2.3: the nav is exactly four items. */
import { describe, expect, it } from "vitest";

import {
  andeanCaravanNavigation,
  caravansNavigation,
  footerNavigation,
  primaryNavigation,
  utilityNavigation,
} from "@/content/navigation";

describe("§2.3 primary navigation", () => {
  it("is exactly: Caravans · Journeys · How it works · Membership", () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      "Caravans",
      "Journeys",
      "How it works",
      "Membership",
    ]);
    expect(primaryNavigation[0]?.href).toBe("/caravans");
  });

  it("has no Create-your-own or Departure-dates destination in any nav set", () => {
    const all = [...primaryNavigation, ...utilityNavigation, ...footerNavigation];
    for (const item of all) {
      expect(item.href).not.toMatch(/create-your-own|do-it-yourself|departure-dates/);
    }
  });

  it("keeps both Caravan choices in the single Caravans dropdown", () => {
    expect(
      caravansNavigation.choose.map(({ label, href }) => ({ label, href })),
    ).toEqual([
      { label: "The Andean Caravan", href: "/caravans/andean" },
      { label: "The Egyptian Caravan", href: "/caravans/egypt" },
    ]);
    expect(Object.keys(caravansNavigation)).toEqual(["choose"]);
  });

  it("gives the Andean Caravan five clear dropdown destinations", () => {
    expect(
      andeanCaravanNavigation.map(({ label, href }) => ({ label, href })),
    ).toEqual([
      {
        label: "The whole Caravan",
        href: "/caravans/andean",
      },
      {
        label: "Joining & leaving points",
        href: "/caravans/andean-caravan/how-it-works",
      },
      {
        label: "Maps",
        href: "/caravans/andean#full-route-map",
      },
      {
        label: "Each stop",
        href: "/caravans/andean/route-map",
      },
      {
        label: "Trip PDFs — coming soon",
        href: "/caravans/andean#trip-documents",
      },
    ]);
  });
});
