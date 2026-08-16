import type { MetadataRoute } from "next";

import { absoluteUrl, isIndexingEnabled, siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Indexing is an explicit opt-in, separate from knowing our own address.
  // Until SAWAYATRA_ALLOW_INDEXING is set, the site is publicly reachable and
  // shareable but closed to search engines. See lib/site-url.ts.
  const isIndexableEnvironment =
    process.env.NODE_ENV === "production" && isIndexingEnabled;

  if (!isIndexableEnvironment) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: absoluteUrl("/sitemap.xml"),
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}

