import type { MetadataRoute } from "next";

import {
  FAMILY_LIST,
  familySlug,
} from "@/content/travel-self/families";
import { absoluteUrl } from "@/lib/site-url";
import { journeys } from "@/lib/sawayatra/server";

const PUBLIC_ROUTES = [
  "/",
  "/how-it-works",
  "/journeys",
  "/travel-self",
  "/travel-self/take",
  "/club",
  "/club/apply",
  "/who-we-are",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PUBLIC_ROUTES,
    ...journeys.map((journey) => `/journeys/${journey.slug}` as const),
    ...FAMILY_LIST.map((family) => `/travel-self/${familySlug(family)}` as const),
  ].map((path) => ({ url: absoluteUrl(path) }));
}
