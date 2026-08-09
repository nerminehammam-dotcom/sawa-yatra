// @vitest-environment jsdom
/** Area C — §2: Fixed/Forming taxonomy, provenance badge, pricing model. */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(cleanup);

import JourneysPage from "@/app/(public)/journeys/page";
import { fixedJourneys, formingJourneys, journeysCatalog } from "@/content/journeys-catalog";
import { PROVENANCE_BADGE_LABEL } from "@/lib/journeys/model";

describe("§2.1 date-state taxonomy", () => {
  it("every journey carries dateState, provenance and pricingModel", () => {
    for (const journey of journeysCatalog) {
      expect(["fixed", "forming"]).toContain(journey.dateState);
      expect(["sawayatra", "partner", "member"]).toContain(journey.provenance);
      expect(["laddered", "fixed-seat"]).toContain(journey.pricingModel);
    }
  });

  it("the nine Caravan sections are Fixed · Sawayatra · laddered", () => {
    expect(fixedJourneys).toHaveLength(9);
    for (const journey of fixedJourneys) {
      expect(journey.dateState).toBe("fixed");
      expect(journey.provenance).toBe("sawayatra");
      expect(journey.pricingModel).toBe("laddered");
      expect(journey.dateLine).toBeTruthy();
    }
  });

  it("forming journeys are member-made and laddered — §2.2's empty cells", () => {
    for (const journey of formingJourneys) {
      expect(journey.provenance).toBe("member");
      expect(journey.pricingModel).toBe("laddered");
    }
  });
});

describe("§2.2 / rule 1.4 provenance badge", () => {
  it("badge copy is unabbreviated", () => {
    expect(PROVENANCE_BADGE_LABEL).toEqual({
      sawayatra: "Sawayatra",
      partner: "Partner",
      member: "Member-made",
    });
  });

  it("renders on every card of the journeys page", () => {
    const { container } = render(<JourneysPage />);
    const badges = container.querySelectorAll("[data-provenance]");
    expect(badges.length).toBe(journeysCatalog.length);
    for (const badge of badges) {
      expect(["Sawayatra", "Partner", "Member-made"]).toContain(
        badge.textContent,
      );
    }
  });

  it("is present at every journey-card render site, not only /journeys", () => {
    // Audit finding: the /journeys test alone cannot see the other card
    // surfaces. Source-level assertion keeps rule 1.4 honest everywhere.
    const { readFileSync } = require("node:fs") as typeof import("node:fs");
    const { join } = require("node:path") as typeof import("node:path");
    const root = join(__dirname, "..", "..");
    for (const site of [
      "app/(public)/journeys/page.tsx",
      "app/(public)/departures/page.tsx",
      "app/(public)/departures/[slug]/page.tsx",
      "components/field/RouteIndex.tsx",
      "components/departures/DepartureCard.tsx",
    ]) {
      expect(
        readFileSync(join(root, site), "utf8"),
        `${site} must render ProvenanceBadge (rule 1.4)`,
      ).toContain("ProvenanceBadge");
    }
  });

  it("shows one honestly disabled Start one button (§2.3)", () => {
    render(<JourneysPage />);
    const button = screen.getByRole("button", { name: "Start one" });
    expect(button).toBeDisabled();
  });
});
