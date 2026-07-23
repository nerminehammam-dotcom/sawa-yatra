import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  InvitationRequestForm,
  JourneyInterestForm,
} from "@/components/forms";

describe("Release 1 form components", () => {
  it("starts consent unchecked and exposes an actionable validation state", async () => {
    const user = userEvent.setup();
    render(<InvitationRequestForm />);

    const consent = screen.getByRole("checkbox");
    expect(consent).not.toBeChecked();

    await user.click(
      screen.getByRole("button", { name: "Request an invitation" }),
    );

    expect(await screen.findByText("Check the form")).toBeInTheDocument();
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/Consent must be checked/)).toBeInTheDocument();
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
