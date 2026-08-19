import type { Metadata, Viewport } from "next";

import { routeMetadataByPath, siteConfig } from "@/content/site";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

import { createPageMetadata } from "./_metadata";
import "./globals.css";

const homeMetadata = routeMetadataByPath["/"];
const googleFontsHref =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&display=swap";

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
  themeColor: "#e7e1d6",
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
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link href={googleFontsHref} rel="stylesheet" />
      </head>
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
