import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TravelSelfQuiz } from "@/app/(public)/travel-self/TravelSelfQuiz";
import {
  TRAVEL_SELF_MODEL_VERSION,
  TRAVEL_SELF_QUESTIONS,
  TRAVEL_SELF_STORAGE_KEY,
} from "@/content/travel-self/travel-self-model";

const pageContent = {
  title: "Meet your Travel Self",
  saveNotice: "Draft save notice",
  requestAction: {
    label: "Request an invitation",
    href: "/request-invitation" as const,
    style: "primary" as const,
    contentStatus: "LOCKED" as const,
  },
  signInAction: {
    label: "Sign in",
    href: "/sign-in" as const,
    style: "secondary" as const,
    contentStatus: "LOCKED" as const,
  },
  contentStatus: "DRAFT" as const,
};

function completeAnswers() {
  return Object.fromEntries(
    TRAVEL_SELF_QUESTIONS.map((question) => [
      question.id,
      question.options[0].id,
    ]),
  );
}

describe("Travel Self v2 quiz", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  it("does not expose editorial labels to an ordinary visitor", () => {
    render(<TravelSelfQuiz pageContent={pageContent} />);
    expect(screen.queryByText(/draft model and copy/iu)).not.toBeInTheDocument();
  });

  it("keeps passion importance explicit and independent of tap order", async () => {
    window.sessionStorage.setItem(
      TRAVEL_SELF_STORAGE_KEY,
      JSON.stringify({
        version: TRAVEL_SELF_MODEL_VERSION,
        stage: "passions",
        questionIndex: TRAVEL_SELF_QUESTIONS.length - 1,
        answers: completeAnswers(),
        selectedPassions: [],
        primary: null,
        secondary: null,
      }),
    );
    const user = userEvent.setup();
    render(<TravelSelfQuiz pageContent={pageContent} />);

    await screen.findByRole("heading", { name: "Choose the reasons you travel." });
    await user.click(screen.getByRole("checkbox", { name: /nature/iu }));
    await user.click(screen.getByRole("checkbox", { name: /food/iu }));

    const continueButton = screen.getByRole("button", {
      name: "Read my Travel Self",
    });
    expect(continueButton).toBeDisabled();

    const primaryGroup = screen.getByRole("group", {
      name: "Which passion leads?",
    });
    await user.click(within(primaryGroup).getByRole("radio", { name: "Food" }));

    expect(continueButton).toBeEnabled();
    expect(
      within(primaryGroup).getByRole("radio", { name: "Food" }),
    ).toBeChecked();
    expect(
      within(
        screen.getByLabelText("Selected passion roles"),
      ).getByText("Nature", { selector: "strong" }),
    ).toBeInTheDocument();
  });
});
