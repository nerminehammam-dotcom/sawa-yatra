import { describe, expect, it } from "vitest";

import {
  andeanCaravanNavigation,
  caravanNavigation,
  footerNavigation,
  journeyProductNavigation,
  primaryNavigation,
} from "@/content/navigation";
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

  it("presents three equal products inside Journeys", () => {
    expect(journeyProductNavigation).toEqual([
      {
        id: "caravans",
        label: "Caravans",
        href: "/journeys/caravans",
      },
      {
        id: "create-your-own-journey",
        label: "Create your own journey",
        href: "/journeys/create",
      },
      {
        id: "join-an-existing-journey",
        label: "Join an existing journey",
        href: "/journeys/join",
      },
    ]);
  });

  it("nests the two Caravan destinations beneath the Caravans product", () => {
    expect(caravanNavigation).toEqual([
      {
        id: "andean-caravan",
        label: "The Andean Caravan",
        href: "/journeys/caravans/andean-caravan",
        meta: "71 days, Lima to Patagonia",
      },
      {
        id: "egyptian-caravan",
        label: "The Egyptian Caravan",
        href: "/journeys/caravans/egyptian-caravan",
        meta: "Egypt · In progress",
      },
    ]);
  });

  it("restores the five Andean detail destinations beneath that Caravan", () => {
    expect(andeanCaravanNavigation).toEqual([
      {
        id: "whole-caravan",
        label: "The whole Caravan",
        href: "/journeys/caravans/andean-caravan",
        meta: "Overview, sections and route.",
      },
      {
        id: "joining-leaving",
        label: "Joining & leaving points",
        href: "/journeys/caravans/andean-caravan/joining-points",
        meta: "Choose your start and finish.",
      },
      {
        id: "route-atlas",
        label: "Maps",
        href: "/journeys/caravans/andean-caravan#full-route-map",
        meta: "The route, transport and terrain.",
      },
      {
        id: "stop-by-stop",
        label: "Each stop",
        href: "/journeys/caravans/andean-caravan/route-map",
        meta: "Every route day in travelling order.",
      },
      {
        id: "trip-documents",
        label: "Trip PDFs — coming soon",
        href: "/journeys/caravans/andean-caravan#trip-documents",
        meta: "No files published yet.",
      },
    ]);
  });

  it("uses canonical Journey addresses throughout the full hierarchy", () => {
    const entries = [
      ...journeyProductNavigation,
      ...caravanNavigation,
      ...andeanCaravanNavigation,
    ];
    expect(entries.every((entry) => entry.href.startsWith("/journeys/"))).toBe(
      true,
    );
    expect(entries.some((entry) => entry.href.startsWith("/caravans/"))).toBe(
      false,
    );
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
