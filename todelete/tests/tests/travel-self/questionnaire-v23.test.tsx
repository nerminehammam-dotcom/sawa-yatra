import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TravelSelfQuestionnaire } from "@/app/(public)/travel-self/TravelSelfQuestionnaire";
import { resetTravelSelfStorageForTests } from "@/lib/travel-self/storage-v23";

describe("Travel Self v2.3 questionnaire", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    });
    resetTravelSelfStorageForTests();
    vi.stubGlobal("scrollTo", vi.fn());
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("keeps the framing directly above question one and supports the six-position keyboard scale", async () => {
    const user = userEvent.setup();
    render(<TravelSelfQuestionnaire onExit={vi.fn()} />);

    const before = await screen.findByRole("heading", { name: "Before you begin" });
    expect(before.closest("section")?.nextElementSibling).toContainElement(
      screen.getByRole("heading", { name: "How much ground do you want to cover?" }),
    );
    expect(screen.getByText("Sixteen.")).toBeInTheDocument();

    const first = screen.getByRole("radio", { name: "Strongly Slow" });
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Clearly Slow" })).toBeChecked();
    expect(screen.getByText("Few places, and time enough to be bored in them.")).toBeInTheDocument();
  });

  it("presents all eight decisions in order and limits passions to three", async () => {
    const user = userEvent.setup();
    render(<TravelSelfQuestionnaire onExit={vi.fn()} />);
    await screen.findByText("question 1 of 8");

    for (let step = 1; step <= 5; step += 1) {
      await user.click(screen.getAllByRole("radio")[0]!);
      await user.click(screen.getByRole("button", { name: /Next question/u }));
    }

    expect(screen.getByText("question 6 of 8")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Most of the day" }));
    await user.click(screen.getByRole("button", { name: /Next question/u }));

    expect(screen.getByText("question 7 of 8")).toBeInTheDocument();
    for (const name of [/^Food/iu, /^Culture/iu, /^Nature/iu]) {
      await user.click(screen.getByRole("button", { name }));
    }
    await user.click(screen.getByRole("button", { name: /^Water/iu }));
    expect(screen.getByText("Three only. Something has to go.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Next question/u }));

    expect(screen.getByText("question 8 of 8")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    await user.click(screen.getByRole("radio", { name: "Nature" }));
    expect(screen.getByRole("button", { name: "See your Travel Self" })).toBeEnabled();
  });
});
