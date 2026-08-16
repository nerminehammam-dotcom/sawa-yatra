import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";

// Web app manifest - gives the site a name, colours and icons when installed to
// a home screen, and sets the mobile browser chrome colour. Icons point at the
// generated app/icon (512) and app/apple-icon (180).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.descriptor,
    start_url: "/",
    display: "standalone",
    // --paper. A literal because the manifest is JSON, not CSS; keep it in step
    // with styles/tokens.css by hand.
    background_color: "#F5EFE2",
    theme_color: "#F5EFE2",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
