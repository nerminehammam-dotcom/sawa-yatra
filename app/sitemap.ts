import type { MetadataRoute } from "next";

import { andeanCaravanSections } from "@/content/andean-caravan";
import { routeMetadata } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = routeMetadata
    .filter(
      (entry) =>
        entry.path !== "/departures/[slug]" &&
        entry.path !== "/caravans" &&
        entry.path !== "/caravans/the-andean-caravan" &&
        entry.noIndex !== true &&
        entry.descriptionStatus !== "PLACEHOLDER",
    )
    .map((entry) => ({ url: absoluteUrl(entry.path) }));

  const journeyEntries: MetadataRoute.Sitemap = [
    "/departures/the-andean-caravan",
    ...andeanCaravanSections.map(
      (section) => `/departures/${section.slug}` as const,
    ),
  ].map((path) => ({ url: absoluteUrl(path) }));

  return [...staticEntries, ...journeyEntries];
}
