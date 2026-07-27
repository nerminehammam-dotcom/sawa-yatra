import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

interface RedirectRule {
  readonly source: string;
  readonly destination: string;
  readonly permanent: boolean;
}

describe("legacy Caravan redirects", () => {
  it("redirects only duplicate public journey routes to direct Departures equivalents", async () => {
    const redirects = await (
      nextConfig as { redirects: () => Promise<readonly RedirectRule[]> }
    ).redirects();

    expect(redirects).toEqual([
      {
        source: "/caravans",
        destination: "/departures#full-route-map",
        permanent: true,
      },
      {
        source: "/caravans/the-andean-caravan",
        destination: "/departures/the-andean-caravan",
        permanent: true,
      },
    ]);

    expect(
      redirects.some(
        (rule) =>
          rule.source === "/caravans/andean-caravan/how-it-works",
      ),
    ).toBe(false);
  });
});
