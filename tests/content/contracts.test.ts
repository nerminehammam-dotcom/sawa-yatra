import { describe, expect, it } from "vitest";

import {
  andeanCaravan,
  andeanCaravanSections,
} from "@/content/andean-caravan";
import { archetypes } from "@/content/archetypes";
import { assetManifest } from "@/content/assets";
import { primaryNavigation, utilityNavigation } from "@/content/navigation";
import { quizQuestions } from "@/content/quiz";
import { routeMetadata } from "@/content/site";
import { formSchemas } from "@/lib/forms/schemas";

const releaseOneRoutes = [
  "/",
  "/how-it-works",
  "/travel-self",
  "/departures",
  "/departures/[slug]",
  "/membership",
  "/about",
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
    expect(new Set(routeMetadata.map((entry) => entry.title)).size).toBe(
      routeMetadata.length,
    );
    expect(routeMetadata.every((entry) => entry.description.length > 0)).toBe(
      true,
    );
  });

  it("keeps Open Seats and dead links out of navigation", () => {
    const navigation = [...primaryNavigation, ...utilityNavigation];
    const departuresItem = primaryNavigation.find(
      (item) => item.href === "/departures",
    );

    expect(departuresItem?.label).toBe("Departures");
    expect(
      navigation.every(
        (item) =>
          !item.label.toLowerCase().includes("open seats") &&
          item.label.toLowerCase() !== "caravans" &&
          !item.href.includes("open-seats") &&
          item.href.startsWith("/") &&
          !item.href.includes("#"),
      ),
    ).toBe(true);
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
