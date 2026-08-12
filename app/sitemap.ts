import type { MetadataRoute } from "next";

import {
  FAMILY_LIST,
  familySlug,
} from "@/content/travel-self/families";
import { absoluteUrl } from "@/lib/site-url";

const PUBLIC_ROUTES = [
  "/",
  "/how-it-works",
  "/journeys",
  "/journeys/caravans",
  "/journeys/caravans/andean-caravan",
  "/journeys/caravans/andean-caravan/route-map",
  "/journeys/caravans/andean-caravan/joining-points",
  "/journeys/caravans/andean-caravan/sea-to-stone",
  "/journeys/caravans/andean-caravan/both-shores",
  "/journeys/caravans/andean-caravan/the-mirror",
  "/journeys/caravans/andean-caravan/the-end-of-the-road",
  "/travel-self",
  "/travel-self/take",
  "/club",
  "/club/apply",
  "/who-we-are",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PUBLIC_ROUTES,
    ...FAMILY_LIST.map((family) => `/travel-self/${familySlug(family)}` as const),
  ].map((path) => ({ url: absoluteUrl(path) }));
}
