import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/brand/Footer";

const navigationLinks = [
  { href: "/how-it-works", label: "How Sawayatra works" },
  { href: "/travel-self", label: "Meet your Travel Self" },
  { href: "/departures", label: "Departures" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Ask a question" },
  { href: "/sign-in", label: "Sign in" },
  { href: "#site-top", label: "Back to top" },
] as const;

describe("Footer", () => {
  it("provides the complete secondary orientation and retains legal links", () => {
    render(<Footer navigationLinks={navigationLinks} />);

    const navigation = screen.getByRole("navigation", {
      name: "Footer navigation",
    });
    const links = within(navigation).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(
      navigationLinks.map((link) => link.label),
    );
    expect(
      within(navigation).getByRole("link", { name: "Ask a question" }),
    ).toHaveAttribute("href", "/contact");
    expect(
      within(navigation).getByRole("link", { name: "Sign in" }),
    ).toHaveAttribute("href", "/sign-in");
    expect(
      within(navigation).getByRole("link", { name: "Back to top" }),
    ).toHaveAttribute("href", "#site-top");

    const legal = screen.getByRole("navigation", { name: "Legal" });
    expect(within(legal).getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(within(legal).getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(
      within(legal).getByRole("link", { name: "Accessibility" }),
    ).toHaveAttribute("href", "/accessibility");
  });
});
