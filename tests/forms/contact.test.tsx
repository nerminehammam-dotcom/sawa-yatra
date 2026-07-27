import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactQuestionForm } from "@/components/forms";

describe("ContactQuestionForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows editable journey context and focuses the validation summary", async () => {
    const user = userEvent.setup();
    render(<ContactQuestionForm initialJourneyContext="The Andean Caravan" />);

    const context = screen.getByLabelText("Journey or section, optional");
    expect(context).toHaveValue("The Andean Caravan");
    await user.clear(context);
    expect(context).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "Send question" }));

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Check the form");
    await waitFor(() => expect(alert).toHaveFocus());
    expect(screen.getByText("Name is required.")).toBeVisible();
    expect(screen.getByText("Email is required.")).toBeVisible();
    expect(screen.getByText("Question is required.")).toBeVisible();
  });

  it("reports unavailable delivery without sending, storing or clearing text", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactQuestionForm initialJourneyContext="Atacama" />);

    await user.type(screen.getByLabelText(/^Name/u), "Nermine Hammam");
    await user.type(
      screen.getByLabelText(/^Email address/u),
      "nerminehammam@gmail.com",
    );
    await user.type(
      screen.getByLabelText(/^What would you like to ask/u),
      "Can I join this section without continuing to Patagonia?",
    );
    await user.click(screen.getByRole("button", { name: "Send question" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your question was not sent or stored.",
    );
    expect(screen.getByLabelText(/^Name/u)).toHaveValue("Nermine Hammam");
    expect(screen.getByLabelText(/^Email address/u)).toHaveValue(
      "nerminehammam@gmail.com",
    );
    expect(screen.getByLabelText(/^What would you like to ask/u)).toHaveValue(
      "Can I join this section without continuing to Patagonia?",
    );
    expect(fetchMock).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
  });
});
