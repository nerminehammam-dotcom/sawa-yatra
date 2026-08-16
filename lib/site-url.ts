/**
 * Where the site thinks it lives, and whether it may be indexed.
 *
 * These were one decision until 15 August 2026: setting NEXT_PUBLIC_SITE_URL
 * both fixed every absolute URL and switched indexing on. That coupling meant
 * the live site could not have working link previews without also opening
 * itself to search engines, so a link shared in WhatsApp or Slack rendered a
 * card whose image pointed at http://localhost:3000 and failed to load.
 *
 * They are now two decisions:
 *
 *   siteUrl            knowing our own address. Correct automatically in any
 *                      production build - no environment variable required.
 *   isIndexingEnabled  a separate, explicit opt-in. Defaults to OFF.
 *
 * Knowing your own address is not a launch decision. Inviting Google in is.
 */

/**
 * The canonical production origin.
 *
 * The www form is deliberate: sawayatra.com issues a 308 to www.sawayatra.com,
 * so dropping the www would point every canonical, og:url and sitemap entry at
 * a URL that immediately redirects.
 */
const productionUrl = "https://www.sawayatra.com";
const developmentUrl = "http://localhost:3000";

/** An explicit override, still honoured first. Rarely needed now. */
export const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl =
  configuredSiteUrl ||
  (process.env.NODE_ENV === "production" ? productionUrl : developmentUrl);

/**
 * True when absolute URLs point at the real domain rather than localhost.
 * This is now a statement about addressing only. It no longer authorises
 * indexing - see isIndexingEnabled.
 */
export const isProductionDomainConfigured = siteUrl !== developmentUrl;

/**
 * The launch switch. Set SAWAYATRA_ALLOW_INDEXING=true in the Vercel project
 * and redeploy to let search engines in; robots.txt then flips from
 * `Disallow: /` to `Allow: /`. It is read at build time, so setting it in the
 * dashboard does nothing until the next deployment.
 *
 * Deliberately not a NEXT_PUBLIC_ variable: nothing in the browser needs it,
 * and it should not be readable as part of the client bundle.
 */
export const isIndexingEnabled =
  process.env.SAWAYATRA_ALLOW_INDEXING?.trim() === "true";

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, siteUrl).toString();
}
