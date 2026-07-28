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
          href="/assets/fonts/fraunces-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
        />
        <link
          rel="preload"
          href="/assets/fonts/fraunces-latin-300-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
