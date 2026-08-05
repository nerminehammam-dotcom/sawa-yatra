import type { Metadata } from "next";

import { routeMetadataByPath, siteConfig } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

import { createPageMetadata } from "./_metadata";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preload"
          href="/assets/fonts/fraunces-latin-opsz-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* The home headline sets one word in italic above the fold, so the
            italic face is now render-blocking in practice. Without this it
            arrives late and that word reflows after the rest has painted. */}
        <link
          rel="preload"
          href="/assets/fonts/fraunces-latin-opsz-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
