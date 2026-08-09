import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

interface RedirectRule {
  readonly source: string;
  readonly destination: string;
  readonly statusCode: number;
}

describe("legacy Caravan redirects", () => {
  it("allows the hostname used by the local review site", () => {
    expect(nextConfig.allowedDevOrigins).toContain("127.0.0.1");
  });

  it("preserves old public addresses in the new navigation structure", async () => {
    const redirects = await (
      nextConfig as { redirects: () => Promise<readonly RedirectRule[]> }
    ).redirects();

    expect(redirects).toEqual([
      { source: "/about", destination: "/who-we-are", statusCode: 301 },
      { source: "/membership", destination: "/members", statusCode: 301 },
      {
        source: "/do-it-yourself",
        destination: "/create-your-own-journey",
        statusCode: 301,
      },
      {
        source: "/departures",
        destination: "/caravans/andean",
        statusCode: 301,
      },
      {
        source: "/departures/the-andean-caravan",
        destination: "/caravans/andean",
        statusCode: 301,
      },
      {
        source: "/caravans/the-andean-caravan",
        destination: "/caravans/andean",
        statusCode: 301,
      },
      {
        source: "/start-here",
        destination: "/joining-points",
        statusCode: 301,
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
