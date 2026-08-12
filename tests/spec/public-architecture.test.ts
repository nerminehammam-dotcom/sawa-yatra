import { existsSync, readFileSync } from "node:fs";

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";
import { proxy } from "@/proxy";
import {
  JOURNEY_IDENTITIES,
  journeyIdForSlug,
} from "@/lib/sawayatra/journey-registry";

const CANONICAL_PRODUCT_ROUTES = [
  "app/(public)/journeys/caravans/page.tsx",
  "app/(public)/journeys/caravans/andean-caravan/page.tsx",
  "app/(public)/journeys/caravans/andean-caravan/route-map/page.tsx",
  "app/(public)/journeys/caravans/andean-caravan/joining-points/page.tsx",
  "app/(public)/journeys/caravans/andean-caravan/[slug]/page.tsx",
  "app/(public)/journeys/caravans/egyptian-caravan/page.tsx",
  "app/(public)/journeys/create/page.tsx",
  "app/(public)/journeys/join/page.tsx",
] as const;

describe("public Journey product architecture", () => {
  it("has a distinct structural destination for every approved product branch", () => {
    for (const route of CANONICAL_PRODUCT_ROUTES) {
      expect(existsSync(route), route).toBe(true);
    }
  });

  it("keeps Create and Join as empty structural pages", () => {
    for (const route of [
      "app/(public)/journeys/create/page.tsx",
      "app/(public)/journeys/join/page.tsx",
    ]) {
      const source = readFileSync(route, "utf8");
      expect(source).toContain('<main id="main-content" tabIndex={-1} />');
      expect(source).not.toMatch(/<(?:h1|h2|p|form|Image)\b/);
    }
  });

  it("keeps Andean detail destinations local and real", () => {
    const overview = readFileSync(
      "app/(public)/caravans/andean/page.tsx",
      "utf8",
    );
    expect(overview).toContain('id="full-route-map"');
    expect(overview).toContain('id="trip-documents"');
    expect(overview).toContain('id="all-sections"');
  });

  it("separates Travel Self introduction and questionnaire routes", () => {
    const introduction = readFileSync(
      "app/(public)/travel-self/page.tsx",
      "utf8",
    );
    const introControl = readFileSync(
      "app/(public)/travel-self/TravelSelfIntro.tsx",
      "utf8",
    );
    const questionnaire = readFileSync(
      "app/(public)/travel-self/take/page.tsx",
      "utf8",
    );
    const questionnaireEntry = readFileSync(
      "app/(public)/travel-self/take/TakeTravelSelfQuestionnaire.tsx",
      "utf8",
    );

    expect(introduction).toContain("<TravelSelfIntro />");
    expect(introduction).not.toContain("TravelSelfQuiz");
    expect(introControl).toContain('href="/travel-self/take"');
    expect(questionnaire).toContain("<TakeTravelSelfQuestionnaire />");
    expect(questionnaire).not.toContain("TravelSelfIntro");
    expect(questionnaireEntry).toContain('router.replace("/travel-self")');
  });
});

describe("canonical compatibility and private route boundaries", () => {
  it("keeps operational Journey IDs and slugs unique and resolvable", () => {
    const ids = JOURNEY_IDENTITIES.map((journey) => journey.id);
    const slugs = JOURNEY_IDENTITIES.map((journey) => journey.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const journey of JOURNEY_IDENTITIES) {
      expect(journeyIdForSlug(journey.slug)).toBe(journey.id);
    }
    expect(journeyIdForSlug("not-a-journey")).toBeNull();
  });

  it("sends signed-out private member routes to sign-in guidance", () => {
    const response = proxy(new NextRequest("https://sawayatra.test/my/travel-self"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://sawayatra.test/sign-in",
    );
  });

  it("redirects old public addresses to exact canonical product destinations", async () => {
    const redirects = await nextConfig.redirects?.();
    if (!redirects) throw new Error("Redirect configuration is missing.");
    const destinationFor = (source: string) =>
      redirects.find((redirect) => redirect.source === source)?.destination;

    expect(destinationFor("/caravans")).toBe("/journeys/caravans");
    expect(destinationFor("/journeys/andean-caravan")).toBe(
      "/journeys/caravans/andean-caravan",
    );
    expect(destinationFor("/caravans/andean")).toBe(
      "/journeys/caravans/andean-caravan",
    );
    expect(destinationFor("/caravans/andean-caravan")).toBe(
      "/journeys/caravans/andean-caravan",
    );
    expect(destinationFor("/caravans/egypt/:path*")).toBe(
      "/journeys/caravans/egyptian-caravan",
    );
    expect(destinationFor("/create-your-own-journey")).toBe(
      "/journeys/create",
    );
    expect(destinationFor("/joining-points")).toBe(
      "/journeys/caravans/andean-caravan/joining-points",
    );
  });
});
