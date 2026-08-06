import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Wordmark } from "@/components/brand/Wordmark";
import { siteConfig } from "@/content/site";

/**
 * The wordmark was Fraunces text until 5 August 2026 and is now the drawn
 * mark. These assertions moved with it: the accessible name still has to come
 * from the link or the wrapper, and the artwork itself still has to be
 * decorative, but there is no longer any text to find.
 */
describe("Wordmark", () => {
  it("renders as an accessible home link with decorative artwork", () => {
    render(<Wordmark />);

    const homeLink = screen.getByRole("link", {
      name: `${siteConfig.name} home`,
    });

    const artwork = homeLink.querySelector("img");
    expect(artwork).toBeInTheDocument();
    expect(artwork).toHaveAttribute("alt", "");
    expect(artwork).toHaveAttribute("aria-hidden", "true");
    expect(artwork?.getAttribute("src")).toContain("sawayatra-wordmark.svg");
  });

  it("preserves the non-link wordmark variant", () => {
    render(<Wordmark href={null} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: siteConfig.name })).toBeVisible();
  });
});
