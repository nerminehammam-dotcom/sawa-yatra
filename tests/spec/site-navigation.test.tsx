// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteNavigation } from "@/components/brand/SiteNavigation";

const expectedAndeanLinks = [
  ["The whole Caravan", "/journeys/caravans/andean-caravan"],
  [
    "Joining & leaving points",
    "/journeys/caravans/andean-caravan/joining-points",
  ],
  ["Maps", "/journeys/caravans/andean-caravan#full-route-map"],
  ["Each stop", "/journeys/caravans/andean-caravan/route-map"],
  ["Trip PDFs", "/journeys/caravans/andean-caravan#trip-documents"],
] as const;

vi.mock("next/navigation", () => ({
  usePathname: () => "/journeys",
}));

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ isSignedIn: false, membershipStatus: "none" }),
        { status: 200 },
      ),
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Journey navigation hierarchy", () => {
  it("renders the approved desktop hierarchy", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const primary = screen.getByRole("navigation", { name: "Primary" });
    await user.click(
      within(primary).getByRole("button", { name: "Journeys" }),
    );
    const panel = screen.getByRole("region", { name: "Journeys" });

    expect(
      within(panel).getByRole("link", { name: "All journeys" }),
    ).toHaveAttribute("href", "/journeys");
    expect(
      within(panel).getByRole("link", { name: "Caravans" }),
    ).toHaveAttribute("href", "/journeys/caravans");
    expect(
      within(panel).getByRole("link", { name: "Create your own journey" }),
    ).toHaveAttribute("href", "/journeys/create");
    expect(
      within(panel).getByRole("link", { name: "Join an existing journey" }),
    ).toHaveAttribute("href", "/journeys/join");

    await user.click(
      within(panel).getByRole("button", {
        name: "Show Caravan destinations",
      }),
    );
    const caravanGroup = within(panel).getByRole("group", {
      name: "Caravans",
    });
    expect(
      within(caravanGroup).getByRole("link", {
        name: /The Andean Caravan/,
      }),
    ).toHaveAttribute("href", "/journeys/caravans/andean-caravan");
    expect(
      within(caravanGroup).getByRole("link", {
        name: /The Egyptian Caravan/,
      }),
    ).toHaveAttribute("href", "/journeys/caravans/egyptian-caravan");

    expect(
      within(panel).queryByRole("button", {
        name: /Andean Caravan details/,
      }),
    ).not.toBeInTheDocument();
    const andeanGroup = within(panel).getByRole("group", {
      name: "Explore The Andean Caravan",
    });
    expect(within(andeanGroup).getAllByRole("link")).toHaveLength(5);
    for (const [name, href] of expectedAndeanLinks) {
      expect(
        within(andeanGroup).getByRole("link", {
          name: new RegExp(`^${name}`),
        }),
      ).toHaveAttribute("href", href);
    }
  });

  it("mirrors the same hierarchy in the mobile sheet", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    await user.click(
      within(dialog).getByRole("button", { name: "Journeys" }),
    );
    await user.click(
      within(dialog).getByRole("button", {
        name: "Show Caravan destinations",
      }),
    );

    const expectedLinks = [
      ["All journeys", "/journeys"],
      ["Caravans", "/journeys/caravans"],
      ["Create your own journey", "/journeys/create"],
      ["Join an existing journey", "/journeys/join"],
    ] as const;
    for (const [name, href] of expectedLinks) {
      expect(within(dialog).getByRole("link", { name })).toHaveAttribute(
        "href",
        href,
      );
    }
    expect(
      within(dialog).getByRole("group", { name: "Caravans" }),
    ).toBeVisible();

    const caravanGroup = within(dialog).getByRole("group", {
      name: "Caravans",
    });
    expect(
      within(caravanGroup).getByRole("link", {
        name: /The Andean Caravan/,
      }),
    ).toHaveAttribute("href", "/journeys/caravans/andean-caravan");
    expect(
      within(caravanGroup).getByRole("link", {
        name: /The Egyptian Caravan/,
      }),
    ).toHaveAttribute("href", "/journeys/caravans/egyptian-caravan");
    expect(
      within(dialog).queryByRole("button", {
        name: /Andean Caravan details/,
      }),
    ).not.toBeInTheDocument();
    const andeanGroup = within(dialog).getByRole("group", {
      name: "Explore The Andean Caravan",
    });
    expect(within(andeanGroup).getAllByRole("link")).toHaveLength(5);
    for (const [name, href] of expectedAndeanLinks) {
      expect(
        within(andeanGroup).getByRole("link", {
          name: new RegExp(`^${name}`),
        }),
      ).toHaveAttribute("href", href);
    }
  });
});
