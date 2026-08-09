import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { JoiningPointSelector } from "@/components/field/JoiningPointSelector";
import { joiningPoints } from "@/content/field-document";

describe("JoiningPointSelector", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    scrollIntoView.mockReset();
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  it("reports ten joining choices and keeps Balmaceda leaving-only", () => {
    render(
      <JoiningPointSelector points={joiningPoints} headingId="joining-heading" />,
    );

    expect(screen.getByText(/Joining point/u)).toHaveTextContent(
      "Joining point 1 of 10",
    );
    expect(
      screen.getByRole("button", {
        name: "Cusco, joining point 4 of 10",
      }),
    ).toHaveTextContent("03B");
    expect(
      screen.queryByRole("button", { name: /Balmaceda, joining point/u }),
    ).not.toBeInTheDocument();
    expect(joiningPoints.some((point) => point.place === "Balmaceda")).toBe(
      false,
    );
    expect(joiningPoints.at(-1)?.leaveAt).toBe("Balmaceda");
  });

  it("moves with Previous and Next, keeps focus, and scrolls the selected choice into view", async () => {
    const user = userEvent.setup();
    render(
      <JoiningPointSelector points={joiningPoints} headingId="joining-heading" />,
    );

    const previous = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });
    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();

    await user.click(next);

    expect(next).toHaveFocus();
    expect(previous).toBeEnabled();
    expect(screen.getByText(/Joining point/u)).toHaveTextContent(
      "Joining point 2 of 10",
    );
    expect(screen.getByRole("heading", { name: "Arequipa" })).toBeVisible();
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());

    await user.click(previous);
    expect(previous).toHaveFocus();
    expect(previous).toBeDisabled();
    expect(screen.getByText(/Joining point/u)).toHaveTextContent(
      "Joining point 1 of 10",
    );
  });

  it("reaches 03B and the final joining point without horizontal swiping", async () => {
    const user = userEvent.setup();
    render(
      <JoiningPointSelector points={joiningPoints} headingId="joining-heading" />,
    );

    const next = screen.getByRole("button", { name: "Next" });
    await user.click(next);
    await user.click(next);
    await user.click(next);

    expect(screen.getByText(/Joining point/u)).toHaveTextContent(
      "Joining point 4 of 10",
    );
    expect(screen.getByText("03B", { selector: "p" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Cusco" })).toBeVisible();

    for (let position = 5; position <= 10; position += 1) {
      await user.click(next);
    }

    expect(screen.getByText(/Joining point/u)).toHaveTextContent(
      "Joining point 10 of 10",
    );
    expect(screen.getByRole("heading", { name: "Santiago" })).toBeVisible();
    expect(next).toBeDisabled();
  });
});
