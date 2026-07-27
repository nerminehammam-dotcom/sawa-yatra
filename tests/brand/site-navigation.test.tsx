import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteNavigation } from "@/components/brand/SiteNavigation";
import { departuresNavigation } from "@/content/navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/departures",
}));

describe("SiteNavigation Departures menu", () => {
  beforeEach(() => {
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

  it("keeps Sign in in the separate utility position", () => {
    render(<SiteNavigation />);

    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in",
    );
    const primary = screen.getByRole("list", {
      name: "Primary navigation links",
    });
    expect(
      within(primary).queryByRole("link", { name: "Sign in" }),
    ).not.toBeInTheDocument();
  });

  it("keeps every desktop dropdown item available in its approved order", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const toggle = screen.getByRole("button", {
      name: "Toggle Departures menu",
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const menu = document.getElementById(toggle.getAttribute("aria-controls")!);
    expect(menu).toBeInTheDocument();

    const links = within(menu!).getAllByRole("link");
    expect(links).toHaveLength(departuresNavigation.length);
    expect(
      links.map((link) => ({
        label: link.textContent,
        href: link.getAttribute("href"),
      })),
    ).toEqual(
      departuresNavigation.map((item) => ({
        label: item.label,
        href: item.href,
      })),
    );
  });

  it("keeps the same complete dropdown inside the mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const drawer = screen.getByRole("dialog", { name: "Site menu" });
    const toggle = within(drawer).getByRole("button", {
      name: "Toggle Departures menu",
    });

    await user.click(toggle);

    const menu = document.getElementById(toggle.getAttribute("aria-controls")!);
    const links = within(menu!).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(
      departuresNavigation.map((item) => item.label),
    );
  });
});
