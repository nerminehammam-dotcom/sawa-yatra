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

  /**
   * Until 5 August 2026 this form never submitted: it validated, then said
   * delivery was not connected. It now posts like the other three, so the
   * contract under test is the opposite of what it used to be — it must
   * actually send, and a failure must never cost the visitor their text.
   */
  it("posts the question, and on failure keeps the text and stores nothing", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
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

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Not sent"),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/forms/contact-question");
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "POST" });

    // Nothing kept locally when nothing was delivered.
    expect(storageSpy).not.toHaveBeenCalled();

    // And the visitor does not have to retype any of it.
    expect(screen.getByLabelText(/^Name/u)).toHaveValue("Nermine Hammam");
    expect(screen.getByLabelText(/^Email address/u)).toHaveValue(
      "nerminehammam@gmail.com",
    );
    expect(screen.getByLabelText(/^What would you like to ask/u)).toHaveValue(
      "Can I join this section without continuing to Patagonia?",
    );
  });
});
