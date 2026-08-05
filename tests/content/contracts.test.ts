import { afterEach, describe, expect, it, vi } from "vitest";

import sitemap from "@/app/sitemap";

import {
  andeanCaravan,
  andeanCaravanSections,
} from "@/content/andean-caravan";
import {
  andeanCaravanHeroImage,
  andeanCaravanSectionGalleries,
} from "@/content/andean-caravan-images";
import { andeanDestinationDetails } from "@/content/andean-caravan-destinations";
import { andeanMapCountries } from "@/content/andean-map-geometry";
import { andeanCaravanRouteStops } from "@/content/andean-caravan-route";
import { archetypes } from "@/content/archetypes";
import { assetManifest } from "@/content/assets";
import {
  caravansNavigation,
  primaryNavigation,
  utilityNavigation,
} from "@/content/navigation";
import { quizQuestions } from "@/content/quiz";
import {
  howItWorksContent,
  routeMetadata,
  routeMetadataByPath,
} from "@/content/site";
import { formSchemas } from "@/lib/forms/schemas";

const releaseOneRoutes = [
  "/",
  "/caravans",
  "/caravans/andean",
  "/caravans/andean/route-map",
  "/caravans/indian",
  "/caravans/egyptian",
  "/caravans/who-else-is-travelling",
  "/caravans/the-andean-caravan",
  "/joining-points",
  "/start-here",
  "/how-it-works",
  "/travel-self",
  "/do-it-yourself",
  "/departures",
  "/departure-dates",
  "/journeys",
  "/create-your-own-journey",
  "/departures/[slug]",
  "/membership",
  "/members",
  "/about",
  "/who-we-are",
  "/partners",
  "/contact",
  "/register-interest",
  "/sign-in",
  "/request-invitation",
  "/privacy",
  "/terms",
  "/accessibility",
  "/404",
];

const andeanDepartureSlugs = [
  "the-andean-caravan",
  "desert-coast",
  "white-city-deep-canyon",
  "the-stone-road",
  "both-shores",
  "thin-air-cloud-forest",
  "silver-and-bone",
  "the-mirror",
  "atacama",
  "the-end-of-the-road",
] as const;

const andeanSectionSlugs = andeanDepartureSlugs.slice(1);
const publicCaravanDateLabel =
  "February–April 2028 · exact dates announced when the route is secured";
const internalGateDateFragments = [
  "4 February",
  "13 February",
  "20 February",
  "28 February",
  "6 March",
  "15 March",
  "22 March",
  "29 March",
  "2 April",
  "14 April",
] as const;

interface AndeanSectionContract {
  readonly slug: string;
  readonly sectionNumber: string | number;
  readonly durationDays: number;
  readonly publicDateWindow: string;
}

const andeanSections: readonly AndeanSectionContract[] =
  andeanCaravanSections;

describe("Release 1 content contracts", () => {
  it("keeps the exact public route and metadata map", () => {
    const paths = routeMetadata.map((entry) => entry.path);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toEqual(releaseOneRoutes);
    expect(routeMetadata.every((entry) => entry.title.length > 0)).toBe(true);
    expect(routeMetadata.every((entry) => entry.description.length > 0)).toBe(
      true,
    );
  });

  it("keeps placeholder-description routes out of the sitemap", () => {
    const urls = sitemap().map((entry) => new URL(entry.url).pathname);

    expect(urls).not.toContain("/departures");
    expect(urls).not.toContain("/departures/the-andean-caravan");
    expect(urls).toContain("/caravans");
    expect(urls).toContain("/caravans/andean");
    expect(urls).not.toContain("/caravans/the-andean-caravan");
    expect(urls).not.toContain("/joining-points");
    expect(urls).toContain("/start-here");
    expect(urls).toContain("/contact");
    expect(urls).not.toContain("/do-it-yourself");
    expect(urls).toContain("/who-we-are");
    expect(urls).toContain("/members");
    expect(urls).not.toContain("/privacy");
  });

  it("keeps the approved Do It Yourself metadata explicitly non-indexed", () => {
    expect(routeMetadataByPath["/do-it-yourself"]).toMatchObject({
      path: "/do-it-yourself",
      title: "Do It Yourself | Sawayatra",
      description:
        "Create your own Sawayatra journey. The Do It Yourself experience is coming later.",
      descriptionStatus: "LOCKED",
      canonicalPath: "/do-it-yourself",
      noIndex: true,
    });
  });

  it("keeps Open Seats and dead links out of navigation", () => {
    const navigation = [...primaryNavigation, ...utilityNavigation];

    expect(
      primaryNavigation.map(({ label, href }) => ({ label, href })),
    ).toEqual([
      { label: "How Sawayatra works", href: "/how-it-works" },
      { label: "Meet your Travel Self", href: "/travel-self" },
      { label: "Caravans", href: "/caravans" },
      { label: "Journeys", href: "/journeys" },
      { label: "Create your own journey", href: "/create-your-own-journey" },
      { label: "Departure dates", href: "/departure-dates" },
    ]);
    expect(
      utilityNavigation.map(({ label, href }) => ({ label, href })),
    ).toEqual([
      { label: "Members", href: "/members" },
      { label: "Who we are", href: "/who-we-are" },
      { label: "Our partners", href: "/partners" },
    ]);
    const primaryHrefs: readonly string[] = primaryNavigation.map(
      (item) => item.href,
    );
    expect(primaryHrefs).toContain("/caravans");
    expect(
      navigation.every(
        (item) =>
          !item.label.toLowerCase().includes("open seats") &&
          !item.href.includes("open-seats") &&
          (item.href.startsWith("/") || item.href.startsWith("mailto:")) &&
          !item.href.includes("#"),
      ),
    ).toBe(true);
  });

  it("keeps the complete Caravans menu intact and canonical", () => {
    expect(caravansNavigation.choose).toHaveLength(3);
    expect(caravansNavigation.join).toHaveLength(3);
    expect(caravansNavigation.choose[0].href).toBe("/caravans/andean");
    expect(caravansNavigation.join[1].href).toBe("/caravans/andean/route-map");
  });

  it("offers Caravan / Join and Create without a Match path", () => {
    expect(
      howItWorksContent.waysToTravel.items.map((item) => item.title),
    ).toEqual(["Caravan / Join", "Create"]);
  });

  it("supports exactly twelve archetypes and a six-by-four draft quiz", () => {
    expect(archetypes).toHaveLength(12);
    expect(new Set(archetypes.map((archetype) => archetype.id)).size).toBe(12);
    expect(quizQuestions).toHaveLength(6);
    expect(quizQuestions.every((question) => question.options.length === 4)).toBe(
      true,
    );
    expect(quizQuestions.every((question) => question.contentStatus !== "LOCKED")).toBe(
      true,
    );
  });

  it("publishes only the Andean Caravan and its nine sections", () => {
    const publishedSlugs = [
      "the-andean-caravan",
      ...andeanSections.map((section) => section.slug),
    ];

    expect(publishedSlugs).toEqual(
      andeanDepartureSlugs,
    );
    expect(
      publishedSlugs.some((slug) =>
        ["patagonia-slowly", "the-carretera-austral", "atacama-and-the-stars"].includes(
          slug,
        ),
      ),
    ).toBe(false);
  });

  it("keeps the nine Andean sections consecutive and totalling 71 days", () => {
    expect(andeanSections.map((section) => section.slug)).toEqual(
      andeanSectionSlugs,
    );
    expect(
      andeanSections.map((section) =>
        String(section.sectionNumber).padStart(2, "0"),
      ),
    ).toEqual(["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
    expect(
      andeanSections.reduce(
        (total, section) => total + section.durationDays,
        0,
      ),
    ).toBe(71);
  });

  it("keeps the illustrated Caravan map in the approved thirteen-stop order", () => {
    expect(andeanCaravanRouteStops.map((stop) => stop.name)).toEqual([
      "Lima",
      "Arequipa",
      "Cusco",
      "Lake Titicaca",
      "La Paz",
      "Sucre",
      "Uyuni",
      "Atacama",
      "Santiago",
      "Balmaceda Airport (arrival)",
      "Coyhaique",
      "Carretera Austral to Villa O’Higgins",
      "Balmaceda (return)",
    ]);
    expect(new Set(andeanCaravanRouteStops.map((stop) => stop.id)).size).toBe(13);
  });

  it("uses geographic outlines for each Caravan country", () => {
    expect(andeanMapCountries.map((country) => country.name)).toEqual([
      "Peru",
      "Bolivia",
      "Chile",
    ]);
    expect(
      andeanMapCountries.every((country) => country.path.length > 500),
    ).toBe(true);
  });

  it("provides sourced orientation details and a photograph for every map stop", () => {
    expect(Object.keys(andeanDestinationDetails)).toHaveLength(13);
    for (const stop of andeanCaravanRouteStops) {
      const detail = andeanDestinationDetails[stop.id];
      expect(detail.stopId).toBe(stop.id);
      expect(detail.altitude.length).toBeGreaterThan(2);
      expect(detail.populationContext.length).toBeGreaterThan(8);
      expect(detail.orientation).toHaveLength(2);
      expect(detail.image.src).toMatch(/^\/assets\/images\//u);
      expect(detail.source.href).toMatch(/^https:\/\//u);
    }
  });

  it("exposes only the provisional public date wording", () => {
    const publicJourneyData = JSON.stringify({
      andeanCaravan,
      sections: andeanSections,
    });

    expect(andeanCaravan.publicDateWindow).toBe(publicCaravanDateLabel);
    expect(
      andeanSections.every((section) =>
        section.publicDateWindow
          .toLowerCase()
          .includes("exact dates announced when the route is secured"),
      ),
    ).toBe(true);
    for (const exactDate of internalGateDateFragments) {
      expect(publicJourneyData).not.toContain(exactDate);
    }
  });

  it("keeps the Andean launch enquiry-only and payment-free", () => {
    const publicJourneyData = JSON.stringify({
      andeanCaravan,
      sections: andeanSections,
    });

    expect(publicJourneyData).toContain("Price on request");
    expect(publicJourneyData).not.toMatch(/\bdeposit|payment|checkout\b/i);
  });

  it("routes image use through the typed asset manifest", () => {
    expect(
      Object.values(assetManifest).every(
        (asset) => asset.src.startsWith("/") && asset.contentStatus.length > 0,
      ),
    ).toBe(true);
  });

  it("keeps all Departures photography in its natural colour", () => {
    const treatments = Object.values(andeanCaravanSectionGalleries)
      .flat()
      .map((asset) => asset.treatment);

    expect(andeanCaravanHeroImage.treatment).toBe("true");
    expect(treatments.every((treatment) => treatment === "true")).toBe(true);
  });

  it("collects only the three permitted non-sensitive form shapes", () => {
    expect(Object.keys(formSchemas)).toEqual([
      "invitation-request",
      "journey-interest",
      "sign-in-interest",
    ]);
    expect(Object.keys(formSchemas["invitation-request"].shape)).toEqual([
      "name",
      "email",
      "country",
      "travelInterest",
      "consent",
    ]);
    expect(Object.keys(formSchemas["journey-interest"].shape)).toEqual([
      "name",
      "email",
      "journey",
      "travelSelfResult",
      "shortNote",
      "consent",
    ]);
    expect(Object.keys(formSchemas["sign-in-interest"].shape)).toEqual([
      "email",
    ]);

    const publicFieldNames = Object.values(formSchemas).flatMap((schema) =>
      Object.keys(schema.shape),
    );
    expect(publicFieldNames.join(" ")).not.toMatch(
      /passport|nationality|date.?of.?birth|health|mobility|emergency|room|altitude|deposit|payment/i,
    );
  });
});

describe("Do It Yourself generated metadata", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses noindex, follow on a configured production domain", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.sawayatra.test");
    vi.resetModules();

    const { createPageMetadata } = await import("@/app/_metadata");
    const metadata = createPageMetadata("/do-it-yourself");

    expect(metadata.alternates?.canonical).toBe(
      "https://www.sawayatra.test/do-it-yourself",
    );
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: "Do It Yourself | Sawayatra",
      description:
        "Create your own Sawayatra journey. The Do It Yourself experience is coming later.",
      url: "https://www.sawayatra.test/do-it-yourself",
    });
    expect(metadata.twitter).toMatchObject({
      title: "Do It Yourself | Sawayatra",
      description:
        "Create your own Sawayatra journey. The Do It Yourself experience is coming later.",
    });
  });

  it("preserves noindex, nofollow without a configured production domain", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.resetModules();

    const { createPageMetadata } = await import("@/app/_metadata");
    const metadata = createPageMetadata("/do-it-yourself");

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    });
  });
});
