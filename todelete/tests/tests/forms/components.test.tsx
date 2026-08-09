import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  InvitationRequestForm,
  JourneyInterestForm,
  SignInInterestForm,
} from "@/components/forms";
import { useFormSubmission } from "@/components/forms/useFormSubmission";
import { submitForm } from "@/lib/forms/client";

vi.mock("@/lib/forms/client", () => ({
  submitForm: vi.fn(),
}));

const mockSubmitForm = vi.mocked(submitForm);

function ValidationFallbackHarness() {
  const { setFormElement, showValidationState } = useFormSubmission(
    "sign-in-interest",
  );

  return (
    <form
      ref={setFormElement}
      onSubmit={(event) => {
        event.preventDefault();
        showValidationState();
      }}
    >
      <input aria-label="First invalid field" aria-invalid="true" />
      <input aria-label="Second invalid field" aria-invalid="true" />
      <button type="submit">Validate without summary</button>
    </form>
  );
}

describe("Release 1 form components", () => {
  beforeEach(() => {
    mockSubmitForm.mockReset();
  });

  it("starts consent unchecked and exposes an actionable validation state", async () => {
    const user = userEvent.setup();
    render(<InvitationRequestForm />);

    const consent = screen.getByRole("checkbox");
    expect(consent).not.toBeChecked();

    await user.click(
      screen.getByRole("button", { name: "Request an invitation" }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Check the form");
    await waitFor(() => expect(alert).toHaveFocus());
    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(alert).toHaveAttribute("aria-atomic", "true");
    expect(alert).toHaveAttribute("tabindex", "-1");

    const firstInvalid = screen.getByLabelText(/^Name/u);
    expect(firstInvalid).toHaveAttribute("aria-invalid", "true");
    expect(firstInvalid).toHaveAttribute(
      "aria-describedby",
      "invitation-name-error",
    );
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/Consent must be checked/)).toBeInTheDocument();

    await user.tab();
    expect(firstInvalid).toHaveFocus();
  });

  it("focuses the journey validation alert before the first invalid field", async () => {
    const user = userEvent.setup();
    render(
      <JourneyInterestForm
        journey={{ id: "sample-journey", label: "Sample journey" }}
        availableTravelSelfIds={["slow-wanderer", "food-led"]}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Ask to join this table" }),
    );

    const alert = await screen.findByRole("alert");
    await waitFor(() => expect(alert).toHaveFocus());
    const firstInvalid = screen.getByLabelText(/^Name/u);
    expect(firstInvalid).toHaveAttribute("aria-invalid", "true");
    expect(firstInvalid.getAttribute("aria-describedby")).toContain(
      "journey-interest-name-error",
    );

    await user.tab();
    expect(firstInvalid).toHaveFocus();
  });

  it("focuses the sign-in validation alert before its invalid email field", async () => {
    const user = userEvent.setup();
    render(<SignInInterestForm />);

    await user.click(
      screen.getByRole("button", {
        name: "Record interest in member access",
      }),
    );

    const alert = await screen.findByRole("alert");
    await waitFor(() => expect(alert).toHaveFocus());
    const firstInvalid = screen.getByLabelText(/^Email/u);
    expect(firstInvalid).toHaveAttribute("aria-invalid", "true");
    expect(firstInvalid.getAttribute("aria-describedby")).toContain(
      "sign-in-interest-email-error",
    );

    await user.tab();
    expect(firstInvalid).toHaveFocus();
  });

  it("falls back to the first invalid control inside the submitted form", async () => {
    const user = userEvent.setup();
    render(<ValidationFallbackHarness />);

    await user.click(
      screen.getByRole("button", { name: "Validate without summary" }),
    );

    await waitFor(() =>
      expect(screen.getByLabelText("First invalid field")).toHaveFocus(),
    );
    expect(screen.getByLabelText("Second invalid field")).not.toHaveFocus();
  });

  it("does not move focus to pending or success status messages", async () => {
    const user = userEvent.setup();
    let resolveSubmission:
      | ((result: Awaited<ReturnType<typeof submitForm>>) => void)
      | undefined;
    mockSubmitForm.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmission = resolve;
        }),
    );
    render(<SignInInterestForm />);

    await user.type(screen.getByLabelText(/^Email/u), "member@example.com");
    await user.click(
      screen.getByRole("button", {
        name: "Record interest in member access",
      }),
    );

    const pendingStatus = await screen.findByRole("status");
    expect(pendingStatus).toHaveTextContent(
      "Sending",
    );
    expect(pendingStatus).not.toHaveFocus();

    await act(async () => {
      resolveSubmission?.({
        status: "success",
        response: {
          ok: true,
          mode: "development-mock",
          kind: "sign-in-interest",
          sent: false,
          storedOnServer: false,
          message: "Sent.",
        },
        localReceiptSaved: false,
      });
    });

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Sent",
      ),
    );
    expect(screen.getByRole("status")).not.toHaveFocus();
  });

  it("does not move focus to a network-error message", async () => {
    const user = userEvent.setup();
    mockSubmitForm.mockResolvedValue({
      status: "network-error",
      message: "This could not be sent — the connection did not hold.",
    });
    render(<SignInInterestForm />);

    await user.type(screen.getByLabelText(/^Email/u), "member@example.com");
    await user.click(
      screen.getByRole("button", {
        name: "Record interest in member access",
      }),
    );

    const networkAlert = await screen.findByRole("alert");
    expect(networkAlert).toHaveTextContent("Not sent");
    expect(networkAlert).not.toHaveFocus();
    expect(networkAlert).not.toHaveAttribute("tabindex");
  });

  it("takes its journey and available Travel Self ids from props", () => {
    render(
      <JourneyInterestForm
        journey={{ id: "sample-journey", label: "Sample journey" }}
        availableTravelSelfIds={["slow-wanderer", "food-led"]}
      />,
    );

    expect(screen.getByText("Sample journey")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Not completed" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Slow Wanderer" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/date of birth|passport|health|payment/i),
    ).not.toBeInTheDocument();
  });
});
