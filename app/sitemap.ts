import type { MetadataRoute } from "next";

import { canonicalSectionSlugs } from "@/content/caravan/page-data";
import { routeMetadata } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = routeMetadata
    .filter(
      (entry) =>
        entry.path !== "/departures/[slug]" &&
        entry.path !== "/departures" &&
        entry.path !== "/caravans/the-andean-caravan" &&
        entry.path !== "/joining-points" &&
        entry.path !== "/do-it-yourself" &&
        entry.path !== "/membership" &&
        entry.path !== "/about" &&
        entry.noIndex !== true &&
        entry.descriptionStatus !== "PLACEHOLDER",
    )
    .map((entry) => ({ url: absoluteUrl(entry.path) }));

  const journeyEntries: MetadataRoute.Sitemap = [
    ...canonicalSectionSlugs.map(
      (slug) => `/caravans/andean/${slug}` as const,
    ),
  ].map((path) => ({ url: absoluteUrl(path) }));

  return [...staticEntries, ...journeyEntries];
}
