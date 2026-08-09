import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RouteStepper } from "@/components/departures/RouteStepper";
import { andeanCaravanSections } from "@/content/andean-caravan";

/**
 * The Caravan is nine consecutive sections. Until 6 August 2026 there was no
 * way to move from one to the next — a reader finishing Desert Coast had to go
 * back to an index and find White City themselves, on a product whose whole
 * proposition is that the sections join into one road.
 *
 * These tests pin the three cases that matter: the first section has no
 * predecessor, the last has no successor, and everything between links both
 * ways to the right neighbour.
 */

const first = andeanCaravanSections[0]!;
const last = andeanCaravanSections[andeanCaravanSections.length - 1]!;
const middle = andeanCaravanSections[2]!;

function stepper(slug: string) {
  render(<RouteStepper slug={slug} />);
  return screen.getByRole("navigation", { name: "Move along the Caravan" });
}

describe("RouteStepper", () => {
  it("says plainly where you are", () => {
    // Scarcity and shape in this category are always a number and never an
    // adjective, so the counter is checked literally.
    const nav = stepper(middle.slug);
    expect(nav.textContent).toContain(
      `Section ${middle.sectionNumber} of ${andeanCaravanSections.length}`,
    );
    for (const country of middle.countries) {
      expect(nav.textContent).toContain(country);
    }
  });

  it("links both ways from a section in the middle", () => {
    const nav = stepper(middle.slug);
    const links = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(links).toContain(`/departures/${andeanCaravanSections[1]!.slug}`);
    expect(links).toContain(`/departures/${andeanCaravanSections[3]!.slug}`);
  });

  it("offers no predecessor on the first section", () => {
    const nav = stepper(first.slug);
    expect(within(nav).getByText("The road begins")).toBeVisible();

    const links = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    // Forward and the whole-route link, and nothing pointing backwards.
    expect(links).toContain(`/departures/${andeanCaravanSections[1]!.slug}`);
    expect(links).toHaveLength(2);
  });

  it("offers no successor on the last section", () => {
    const nav = stepper(last.slug);
    expect(within(nav).getByText("The end of the road")).toBeVisible();

    const links = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(links).toContain(
      `/departures/${andeanCaravanSections[andeanCaravanSections.length - 2]!.slug}`,
    );
    expect(links).toHaveLength(2);
  });

  it("always offers the whole route as an alternative to the parts", () => {
    // The commercial point of the component: every section page says, without
    // needing a price, that these join end to end.
    for (const section of [first, middle, last]) {
      const { unmount } = render(<RouteStepper slug={section.slug} />);
      expect(
        screen.getByRole("link", { name: /as one continuous route/ }),
      ).toHaveAttribute("href", "/departures/the-andean-caravan");
      unmount();
    }
  });

  it("renders nothing for a slug that is not a section", () => {
    const { container } = render(<RouteStepper slug="the-andean-caravan" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("covers every section without a gap", () => {
    // A guard on the data as much as the component: if a section is ever added
    // or reordered, the chain must still be continuous and numbered 1..n.
    const numbers = andeanCaravanSections.map((section) => section.sectionNumber);
    expect(numbers).toEqual(
      Array.from({ length: andeanCaravanSections.length }, (_, index) => index + 1),
    );
  });
});
