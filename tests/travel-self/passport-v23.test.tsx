import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TravelSelfPassport } from "@/app/(public)/travel-self/TravelSelfPassport";
import {
  BOUNDARY_PERSONAL,
  CHANGE_LATER,
  FAMILY_LINE,
  GUEST_BAND,
  SAVE,
  SEEKER_PLATE,
  TIME_TOGETHER,
} from "@/content/travel-self/travel-self-model";
import type { TravelSelfResultV23 } from "@/lib/travel-self/scoring-v23";

const SEEKER_RESULT: TravelSelfResultV23 = {
  signature: "unhurried|unplanned|quiet|dawn-led",
  name: "The Seeker",
  readout: "unhurried · unplanned · quiet · dawn-led",
  essence: "You are up before the town is, and you do not yet know where you are going.",
  bring: "the discovery nobody booked.",
  travelFor: FAMILY_LINE.Made,
  comfort: "Considered",
  timeTogether: TIME_TOGETHER[1],
  bendOn: "Comfort.",
  feelItWhen: "the table is still going at midnight and you have a six o’clock in your head.",
  passions: ["Design", "Culture", "Nature"],
  lead: "Design",
};

describe("Travel Self v2.3 passport", () => {
  it("renders the complete selectable passport and the Seeker plate crop", () => {
    render(<TravelSelfPassport result={SEEKER_RESULT} onChangeAnswer={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "The Seeker" })).toBeInTheDocument();
    expect(screen.getByText(SEEKER_RESULT.readout)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: SEEKER_PLATE.alt })).toHaveAttribute(
      "src",
      expect.stringContaining("travel-self-plate-the-seeker.jpg"),
    );
    expect(screen.getByText(GUEST_BAND)).toBeInTheDocument();
    expect(screen.getByText(BOUNDARY_PERSONAL)).toBeInTheDocument();
    expect(screen.getByText(CHANGE_LATER)).toBeInTheDocument();
    expect(screen.queryByText("All sixteen Travel Selves")).not.toBeInTheDocument();
  });

  it("keeps save honest for a guest and lets the member change an answer", async () => {
    const user = userEvent.setup();
    const onChangeAnswer = vi.fn();
    render(<TravelSelfPassport result={SEEKER_RESULT} onChangeAnswer={onChangeAnswer} />);

    await user.click(screen.getByRole("button", { name: SAVE.action }));
    expect(screen.getByText(SAVE.signInPrompt)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: SAVE.changeAnswer }));
    expect(onChangeAnswer).toHaveBeenCalledOnce();
  });
});
