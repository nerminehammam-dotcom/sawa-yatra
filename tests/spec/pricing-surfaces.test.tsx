// @vitest-environment jsdom
/** Area E — locked rules 4.9/§7.4 (paired price), §7.2 (model gates display),
 *  §7.5 (ladder renders every state), §7.6 (no dark patterns). */
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PairedPrice, TodaysPriceOnly } from "@/components/journeys/PairedPrice";
import { PricingLadder } from "@/components/journeys/PricingLadder";
import { computeLadder, emptyLadder, type LadderPolicy } from "@/lib/journeys/pricing";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const policy: LadderPolicy = { minGroup: 6, lockDays: 60 };
const departure = new Date("2028-02-01T00:00:00Z");
const before = new Date("2027-06-01T00:00:00Z");

function ladderAt(travellers: number, now = before, extra = {}) {
  return computeLadder({ travellers, departureDate: departure, now, ...extra }, policy);
}

describe("rule 4.9 / §7.4 — the paired price is one inseparable block", () => {
  it("the from-figure never renders without today's price in the same block", () => {
    const { container } = render(<PairedPrice ladder={ladderAt(4)} />);
    const block = container.firstElementChild;
    expect(block?.textContent).toContain("From {{PRICE_T6}} per person");
    expect(block?.textContent).toContain("today, {{PRICE_T3}} each");
    // One DOM block: both figures under a single parent element.
    expect(block?.children).toHaveLength(2);
  });

  it("empty state pairs the floor with what the first traveller pays", () => {
    const { container } = render(<PairedPrice ladder={emptyLadder()} />);
    expect(container.textContent).toContain("From {{PRICE_T6}}");
    expect(container.textContent).toContain("the first pays {{PRICE_T1}}");
  });

  it("a single-number surface shows today's price, never the floor", () => {
    const { container } = render(<TodaysPriceOnly ladder={ladderAt(4)} />);
    expect(container.textContent).toBe("{{PRICE_T3}}");
    expect(container.textContent).not.toContain("PRICE_T6");
  });

  it("there is no exported way to render the floor alone", async () => {
    const exports = await import("@/components/journeys/PairedPrice");
    expect(Object.keys(exports).sort()).toEqual(["PairedPrice", "TodaysPriceOnly"]);
  });
});

describe("§7.2 — pricing model gates the display", () => {
  it("never renders a ladder on fixed-seat inventory", () => {
    const { container } = render(
      <PricingLadder ladder={ladderAt(4)} pricingModel="fixed-seat" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("§7.5 — the ladder renders all eight states", () => {
  const cases = [
    ["empty", ladderAt(0)],
    ["below-minimum", ladderAt(3)],
    ["at-minimum", ladderAt(6)],
    ["mid-band", ladderAt(7)],
    ["final-band", ladderAt(11)],
    ["locked", ladderAt(8, new Date("2028-01-15T00:00:00Z"))],
    ["closed", ladderAt(8, before, { closed: true })],
    ["cancelled", ladderAt(3, before, { cancelled: true })],
  ] as const;

  it.each(cases)("%s", (state, ladder) => {
    const { container } = render(
      <PricingLadder ladder={ladder} pricingModel="laddered" />,
    );
    expect(container.querySelector(`[data-state="${state}"]`)).not.toBeNull();
    // Six bands always drawn.
    expect(container.querySelectorAll("li")).toHaveLength(6);
  });

  it("marks the current band: you are here", () => {
    const { container } = render(
      <PricingLadder ladder={ladderAt(7)} pricingModel="laddered" />,
    );
    const current = container.querySelector("[data-current]");
    expect(current?.textContent).toContain("you are here");
  });

  it("the live line points at a shared benefit, with the next band's token", () => {
    const { container } = render(
      <PricingLadder ladder={ladderAt(6)} pricingModel="laddered" />,
    );
    expect(container.textContent).toContain(
      "2 more travellers and the price falls to {{PRICE_T5}} — for everyone, including you.",
    );
  });
});

describe("§7.6 — no dark patterns", () => {
  it("no countdowns, no seats-left, no expiry theatre in any state", () => {
    for (const ladder of [
      ladderAt(0), ladderAt(3), ladderAt(6), ladderAt(7),
      ladderAt(11), ladderAt(8, new Date("2028-01-15T00:00:00Z")),
    ]) {
      const { container, unmount } = render(
        <PricingLadder ladder={ladder} pricingModel="laddered" />,
      );
      const text = container.textContent?.toLowerCase() ?? "";
      expect(text).not.toMatch(/seats? left|only \d+ (left|remaining)|hurry|expires?|running out|countdown/);
      expect(text).not.toMatch(/\d{2}:\d{2}/); // no timers
      unmount();
    }
  });
});
