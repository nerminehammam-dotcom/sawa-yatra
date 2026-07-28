import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import AboutPage from "@/app/(public)/about/page";
import HowItWorksPage from "@/app/(public)/how-it-works/page";

afterEach(cleanup);

describe("public product language", () => {
  it("describes the available Andean Caravan without promising member inventory", () => {
    render(<HowItWorksPage />);

    expect(screen.queryByText(/Browse Member Journeys/iu)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/journeys created by other members/iu),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(
        "Available now: the Andean Caravan, with nine consecutive sections and one complete route.",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Browse available journeys" }),
    ).toHaveAttribute("href", "/caravans/andean");
  });

  it("marks Create Your Own and member-created journeys as future pathways", () => {
    render(<HowItWorksPage />);

    expect(screen.getByText("Future membership pathway")).toBeVisible();
    expect(screen.getByText("Not yet available.")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Ask about future access" }),
    ).toHaveAttribute(
      "href",
      "/request-invitation?intent=create-journey&returnTo=%2Fdo-it-yourself",
    );
    expect(screen.getByText("Future member-created journeys")).toBeVisible();
    expect(screen.getByText("Planned interest states")).toBeVisible();
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
