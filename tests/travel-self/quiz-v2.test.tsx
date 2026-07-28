import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TravelSelfQuiz } from "@/app/(public)/travel-self/TravelSelfQuiz";
import { TRAVEL_SELF_STORAGE_KEY, resetTravelSelfMemoryForTests } from "@/lib/travel-self/storage";

async function completeTravelSelf() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Begin" }));

  for (let step = 0; step < 5; step += 1) {
    const radios = screen.getAllByRole("radio");
    radios[0]?.focus();
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("button", { name: "Next" }));
  }

  await user.click(screen.getByRole("radio", { name: "Some of it" }));
  await user.click(screen.getByRole("button", { name: "Next" }));

  await user.click(screen.getByRole("button", { name: /^Food/iu }));
  await user.click(screen.getByRole("button", { name: /^Culture/iu }));
  await user.click(screen.getByRole("button", { name: /^Water/iu }));
  await user.click(screen.getByRole("button", { name: "Next" }));

  await user.click(screen.getByRole("radio", { name: "Food" }));
  await user.click(screen.getByRole("button", { name: "See your Travel Self" }));
}

describe("Travel Self v2 flow", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
        clear: () => values.clear(),
      },
    });
    resetTravelSelfMemoryForTests();
    vi.stubGlobal("scrollTo", vi.fn());
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("places the settled framing directly before question one", async () => {
    const user = userEvent.setup();
    render(<TravelSelfQuiz />);
    expect(await screen.findByRole("heading", { name: "Your Travel Self" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Begin" }));
    const before = screen.getByRole("heading", { name: "Before you begin" }).closest("section");
    expect(before?.nextElementSibling).toHaveAttribute("aria-labelledby", "question-heading");
    expect(screen.getByText("Question 1 of 8")).toBeInTheDocument();
  });

  it("supports keyboard sliders, reveals without an update control, and returns to the passport", async () => {
    const first = render(<TravelSelfQuiz />);
    await screen.findByRole("heading", { name: "Your Travel Self" });
    await completeTravelSelf();

    expect(await screen.findByRole("heading", { name: "The Seeker" })).toBeInTheDocument();
    expect(screen.getAllByText("unhurried · unplanned · quiet · dawn-led").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Update your Travel Self" })).not.toBeInTheDocument();

    const raw = window.localStorage.getItem(TRAVEL_SELF_STORAGE_KEY);
    expect(raw).not.toContain("The Seeker");
    expect(raw).not.toContain("unhurried");

    first.unmount();
    render(<TravelSelfQuiz />);
    expect(await screen.findByRole("button", { name: "Update your Travel Self" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Update your Travel Self" }));
    expect(screen.getByRole("radio", { name: "Clearly Slow" })).toBeChecked();
  });

  it("refuses a fourth passion with the written line", async () => {
    const user = userEvent.setup();
    render(<TravelSelfQuiz />);
    await screen.findByRole("heading", { name: "Your Travel Self" });
    await user.click(screen.getByRole("button", { name: "Begin" }));
    for (let step = 0; step < 5; step += 1) {
      await user.click(screen.getAllByRole("radio")[0]!);
      await user.click(screen.getByRole("button", { name: "Next" }));
    }
    await user.click(screen.getByRole("radio", { name: "Some of it" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    for (const name of [/^Food/iu, /^Culture/iu, /^Water/iu]) {
      await user.click(screen.getByRole("button", { name }));
    }
    await user.click(screen.getByRole("button", { name: /^Nature/iu }));
    expect(screen.getByText("Three only. Something has to go.")).toBeInTheDocument();
  });
});
