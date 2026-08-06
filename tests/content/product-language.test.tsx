import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import AboutPage from "@/app/(public)/about/page";
import HowItWorksPage from "@/app/(public)/how-it-works/page";

afterEach(cleanup);

describe("public product language", () => {
  it("keeps the three ways distinct — the Caravan is open, the others are later", () => {
    // Updated 7 August 2026. The "Join a Journey" card used to say "Available
    // now: the Andean Caravan…", collapsing two of the three ways into the same
    // product. Way 2 is now its own, later, thing (joining others' journeys) and
    // points at /journeys, not the Caravan.
    render(<HowItWorksPage />);

    expect(screen.queryByText(/Browse Member Journeys/iu)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/journeys created by other members/iu),
    ).not.toBeInTheDocument();

    // Way 1 — the Caravan, open for interest.
    expect(
      screen.getByRole("link", { name: /Explore the Andean Caravan/u }),
    ).toHaveAttribute("href", "/caravans/andean");

    // Way 2 — joining others' journeys is distinct and later, not the Caravan.
    expect(
      screen.getByRole("heading", { name: "Join a journey with others" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /See what.s coming/u }),
    ).toHaveAttribute("href", "/journeys");
  });

  it("marks Create Your Own as a later pathway, and drops the system-label list", () => {
    render(<HowItWorksPage />);

    expect(screen.getByRole("heading", { name: "Create your own" })).toBeVisible();
    expect(screen.getByText("Not yet available.")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Register your interest/u }),
    ).toHaveAttribute("href", "/register-interest");
    expect(screen.getByText("Future member-created journeys")).toBeVisible();

    // Both later cards carry the same honest status chip.
    expect(screen.getAllByText("Coming later").length).toBeGreaterThanOrEqual(2);

    // The internal "Planned interest states" system labels were removed.
    expect(screen.queryByText("Planned interest states")).not.toBeInTheDocument();
  });

  it("defines Sawayatra as a travel club that begins with its first route", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "A travel club with a point of view.",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(/It begins with the annual Andean Caravan/iu),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Explore the Andean Caravan →" }),
    ).toHaveAttribute("href", "/caravans/andean");
  });
});
