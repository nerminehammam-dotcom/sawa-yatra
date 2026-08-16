import type { Metadata } from "next";

import { assetManifest } from "@/content/assets";
import { routeMetadataByPath, siteConfig } from "@/content/site";
import { absoluteUrl, isIndexingEnabled } from "@/lib/site-url";
import type { StaticRoute } from "@/lib/types";

// Absolute URLs below are always correct in a production build. Whether the
// page invites indexing is a separate opt-in - see lib/site-url.ts.
const isIndexableEnvironment =
  process.env.NODE_ENV === "production" && isIndexingEnabled;

function routeTitle(path: StaticRoute, fullTitle: string): Metadata["title"] {
  if (path === "/") {
    return { absolute: fullTitle };
  }

  const suffix = ` | ${siteConfig.name}`;
  return fullTitle.endsWith(suffix) ? fullTitle.slice(0, -suffix.length) : fullTitle;
}

export function createPageMetadata(path: StaticRoute): Metadata {
  const entry = routeMetadataByPath[path];
  const socialImage = assetManifest[siteConfig.defaultSocialAssetId];
  const socialImageUrl = absoluteUrl(socialImage.src);
  const shouldIndex =
    isIndexableEnvironment &&
    entry.noIndex !== true &&
    entry.descriptionStatus !== "PLACEHOLDER";

  return {
    title: routeTitle(path, entry.title),
    description: entry.description,
    alternates: {
      canonical: absoluteUrl(entry.canonicalPath),
    },
    robots: {
      index: shouldIndex,
      follow: isIndexableEnvironment,
      googleBot: {
        index: shouldIndex,
        follow: isIndexableEnvironment,
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: entry.title,
      description: entry.description,
      url: absoluteUrl(entry.canonicalPath),
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: socialImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [{ url: socialImageUrl, alt: socialImage.alt }],
    },
  };
}
