import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Wordmark } from "@/components/brand/Wordmark";
import { temporaryWordmark } from "@/content/assets";
import { siteConfig } from "@/content/site";

describe("Wordmark", () => {
  it("keeps the temporary mark decorative beside an accessible home link", () => {
    render(<Wordmark />);

    const homeLink = screen.getByRole("link", {
      name: `${siteConfig.name} home`,
    });
    const mark = homeLink.querySelector("svg");

    expect(homeLink).toHaveTextContent(temporaryWordmark.text);
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark).toHaveAttribute("focusable", "false");
  });

  it("preserves the non-link wordmark variant", () => {
    render(<Wordmark href={null} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(temporaryWordmark.text)).toBeVisible();
  });
});
