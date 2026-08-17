import localFont from "next/font/local";

/**
 * The Announcer. Headings, navigation, numbers and buttons.
 *
 * Self-hosted, like Fraunces and Plex Mono, rather than pulled through
 * next/font/google. Both routes end up serving the file from our own origin,
 * but the Google route fetches it at BUILD time, which makes every build -
 * local, CI and Vercel - depend on a route to fonts.googleapis.com. A build
 * behind a proxy fails rather than falling back. Vendoring the file removes
 * that dependency and matches how the other two faces are already handled.
 *
 * The file is the variable "standard" cut from @fontsource-variable, latin
 * subset, carrying all three axes the type system uses:
 *   opsz 12-96, wght 200-800, wdth 75-100
 * Source: https://github.com/ateliertriay/bricolage, SIL Open Font License 1.1.
 * The licence is kept beside it as bricolage-grotesque-LICENSE.txt.
 *
 * `adjustFontFallback` gives a metric-matched Arial so the swap does not
 * reflow the page.
 */
export const bricolage = localFont({
  src: [
    {
      path: "../public/assets/fonts/bricolage-grotesque-variable.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-bricolage",
  adjustFontFallback: "Arial",
  fallback: ["Arial", "sans-serif"],
  preload: true,
});

/**
 * Self-hosted variable Fraunces (opsz 9–144, wght 100–900), roman + italic,
 * built by tools/typography/build-fonts.py from the four-axis masters.
 *
 * Loaded through next/font/local rather than a hand-written @font-face so that
 * Next generates a metric-matched fallback (Times New Roman, adjusted) and the
 * font swap no longer reflows the page - the FOUT reflow the manual setup left
 * behind. next/font also self-hosts and preloads automatically.
 *
 * Exposed as the CSS variable --font-fraunces, consumed by --font-display and
 * --font-read in styles/tokens.css. The SOFT / WONK / opsz axes are still set
 * per-element via font-variation-settings; that is independent of loading.
 */
export const fraunces = localFont({
  src: [
    {
      path: "../public/assets/fonts/fraunces-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/fraunces-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-fraunces",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
  preload: true,
});

/**
 * IBM Plex Mono is the site's annotation voice: legal notes, limitations,
 * pricing conditions and route footnotes. It is deliberately separate from
 * both the editorial Fraunces voice and the operational sans face.
 */
export const ibmPlexMono = localFont({
  src: [
    {
      path: "../public/assets/fonts/ibm-plex-mono/IBMPlexMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/ibm-plex-mono/IBMPlexMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  adjustFontFallback: false,
  fallback: ["Courier New", "monospace"],
  preload: true,
});
