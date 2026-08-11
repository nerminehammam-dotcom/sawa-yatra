/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import {
  JoinLeavePlanner,
  type JoinLeavePlannerSection,
} from "@/app/(public)/caravans/andean-caravan/how-it-works/_components/JoinLeavePlanner";

const sections: readonly JoinLeavePlannerSection[] = [
  { id: "01", name: "Sea to Stone", slug: "sea-to-stone", days: 23, dayStart: 1, dayEnd: 23, join: "Lima", leave: "Puno", joinAirport: "LIM", leaveAirport: "JUL + road", joinNote: "Arrive on Day 1." },
  { id: "02", name: "Both Shores", slug: "both-shores", days: 16, dayStart: 24, dayEnd: 39, join: "Puno", leave: "Sucre", joinAirport: "JUL + road", leaveAirport: "SRE", joinNote: "Complete the required three-night Cusco progression before Puno." },
  { id: "03", name: "The Mirror", slug: "the-mirror", days: 18, dayStart: 40, dayEnd: 57, join: "Sucre", leave: "Santiago", joinAirport: "SRE", leaveAirport: "SCL", joinNote: "Arrive the previous evening." },
  { id: "04", name: "The End of the Road", slug: "the-end-of-the-road", days: 14, dayStart: 58, dayEnd: 71, join: "Santiago", leave: "Balmaceda", joinAirport: "SCL", leaveAirport: "BBA", joinNote: "Arrive the previous evening." },
];

const shortForm = {
  name: "The Stone Road",
  slug: "the-stone-road",
  days: 8,
  dayStart: 16,
  dayEnd: 23,
  join: "Cusco",
  leave: "Puno",
  joinAirport: "CUZ",
  leaveAirport: "JUL + road",
  joinNote: "Previous-evening arrival and a protected orientation day.",
};

afterEach(cleanup);

describe("Andean Caravan joining and leaving planner", () => {
  it("builds only consecutive section ranges and recalculates the journey", async () => {
    const user = userEvent.setup();
    render(<JoinLeavePlanner sections={sections} shortForm={shortForm} />);

    expect(screen.getByText("71 days")).toBeTruthy();
    expect(screen.getByText("4 consecutive sections")).toBeTruthy();
    expect(screen.getByText(/included scheduled flight then returns/i)).toBeTruthy();

    await user.selectOptions(screen.getByLabelText("Leave at"), "01");
    expect(screen.getByText("23 days")).toBeTruthy();
    expect(screen.getByText("1 section")).toBeTruthy();

    await user.selectOptions(screen.getByLabelText("Leave at"), "04");
    expect(screen.getByText("71 days")).toBeTruthy();
    expect(screen.getByText("4 consecutive sections")).toBeTruthy();
    expect(screen.getByText("1–71")).toBeTruthy();

    await user.selectOptions(screen.getByLabelText("Join at"), "03");
    expect(screen.getByText("32 days")).toBeTruthy();
    expect(screen.getByText("2 consecutive sections")).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Sea to Stone/i })).toBeNull();
    expect(screen.getByRole("link", { name: /The Mirror/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /The End of the Road/i })).toBeTruthy();
    const registrationHref = screen
      .getByRole("link", { name: "Register interest in this run" })
      .getAttribute("href");
    expect(registrationHref).toContain("join=Sucre");
    expect(registrationHref).toContain("leave=Balmaceda");
    expect(registrationHref).toContain("days=32");
    expect(registrationHref).toContain("sections=03-04");
  });

  it("moves the leaving gate forward when the joining gate passes it", async () => {
    const user = userEvent.setup();
    render(<JoinLeavePlanner sections={sections} shortForm={shortForm} />);

    await user.selectOptions(screen.getByLabelText("Leave at"), "01");
    await user.selectOptions(screen.getByLabelText("Join at"), "04");

    expect((screen.getByLabelText("Leave at") as HTMLSelectElement).value).toBe("04");
    expect(screen.getByText("14 days")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /Santiago.*Balmaceda/i }),
    ).toBeTruthy();
  });

  it("surfaces the Puno pre-join progression and the Cusco short form", async () => {
    const user = userEvent.setup();
    render(<JoinLeavePlanner sections={sections} shortForm={shortForm} />);

    await user.selectOptions(screen.getByLabelText("Join at"), "02");

    expect(screen.getByText(/required three-night Cusco progression/i)).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Cusco.*Puno/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Explore The Stone Road/i })).toBeTruthy();
  });
});
