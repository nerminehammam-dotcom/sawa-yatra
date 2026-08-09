import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteNavigation } from "@/components/brand/SiteNavigation";
import { caravansNavigation } from "@/content/navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/caravans/andean",
}));

describe("SiteNavigation Caravans menu", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  it("keeps sign in in the announcement band and club pages in the brand row", () => {
    render(<SiteNavigation />);

    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in",
    );
    const clubPages = screen.getByRole("navigation", { name: "Club pages" });
    expect(
      within(clubPages).getAllByRole("link").map((link) => link.textContent),
    ).toEqual(["Members", "Who we are", "Our partners"]);
  });

  it("opens the complete desktop Caravans panel on click", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const toggle = within(
      screen.getByRole("navigation", { name: "Primary" }),
    ).getByRole("button", { name: "Caravans" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(toggle.getAttribute("aria-controls")!);
    const expected = [
      ...caravansNavigation.choose,
      ...caravansNavigation.join,
    ].map((item) => ({ label: item.label, href: item.href }));
    expect(
      within(panel!).getAllByRole("link").map((link) => ({
        label: link.querySelector("span")?.textContent,
        href: link.getAttribute("href"),
      })),
    ).toEqual(expected);
  });

  it("opens from ArrowDown, focuses the first destination, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);
    const toggle = within(
      screen.getByRole("navigation", { name: "Primary" }),
    ).getByRole("button", { name: "Caravans" });

    toggle.focus();
    await user.keyboard("{ArrowDown}");
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(screen.getByRole("link", { name: /The Andean Caravan/u })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("keeps the complete Caravans panel in the mobile sheet", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const sheet = screen.getByRole("dialog", { name: "Site menu" });
    await user.click(within(sheet).getByRole("button", { name: "Caravans" }));

    for (const item of [
      ...caravansNavigation.choose,
      ...caravansNavigation.join,
    ]) {
      expect(within(sheet).getByRole("link", { name: new RegExp(item.label, "u") })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });
});
