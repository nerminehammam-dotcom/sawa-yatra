import type { Metadata, Viewport } from "next";

import { routeMetadataByPath, siteConfig } from "@/content/site";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

import { createPageMetadata } from "./_metadata";
import { fraunces, ibmPlexMono } from "./fonts";
import "./globals.css";

const homeMetadata = routeMetadataByPath["/"];

export const metadata: Metadata = {
  ...createPageMetadata("/"),
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: homeMetadata.title,
    template: `%s | ${siteConfig.name}`,
  },
};

export const viewport: Viewport = {
  // --paper. A literal because the browser reads this before any stylesheet;
  // keep it in step with styles/tokens.css by hand.
  themeColor: "#F5EFE2",
};

// Organization + WebSite structured data (JSON-LD). Uses siteUrl, so it is
// correct once NEXT_PUBLIC_SITE_URL is set at launch; pre-launch it mirrors the
// rest of the metadata (localhost) and the site is noindex anyway.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: siteConfig.name,
      url: siteUrl,
      logo: absoluteUrl("/icon"),
      description: siteConfig.descriptor,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      name: siteConfig.name,
      url: siteUrl,
      publisher: { "@id": `${siteUrl}#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next/font (app/fonts.ts) self-hosts Fraunces, preloads both faces, and
    // supplies a metric-matched fallback via --font-fraunces - so the manual
    // <head> preloads and @font-face are no longer needed.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
