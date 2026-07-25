import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Wordmark } from "@/components/brand/Wordmark";
import { temporaryWordmark } from "@/content/assets";
import { siteConfig } from "@/content/site";

describe("Wordmark", () => {
  it("renders the word-only identity as an accessible home link", () => {
    render(<Wordmark />);

    const homeLink = screen.getByRole("link", {
      name: `${siteConfig.name} home`,
    });
    expect(homeLink).toHaveTextContent(temporaryWordmark.text);
    expect(homeLink.querySelector("svg")).not.toBeInTheDocument();
  });

  it("preserves the non-link wordmark variant", () => {
    render(<Wordmark href={null} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(temporaryWordmark.text)).toBeVisible();
  });
});
