import type { MetadataRoute } from "next";

import {
  absoluteUrl,
  isProductionDomainConfigured,
  siteUrl,
} from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const isIndexableEnvironment =
    process.env.NODE_ENV === "production" && isProductionDomainConfigured;

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

