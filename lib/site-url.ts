const developmentUrl = "http://localhost:3000";

export const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = configuredSiteUrl || developmentUrl;

export const isProductionDomainConfigured = Boolean(configuredSiteUrl);

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, siteUrl).toString();
}
