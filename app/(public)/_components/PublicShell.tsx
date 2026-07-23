import type { ReactNode } from "react";

import { Footer } from "@/components/brand/Footer";
import { SiteNavigation } from "@/components/brand/SiteNavigation";
import { SkipLink } from "@/components/brand/SkipLink";
import { footerNavigation, primaryNavigation } from "@/content/navigation";
import { siteConfig } from "@/content/site";

const legalLinks = footerNavigation
  .filter((item) =>
    ["/privacy", "/terms", "/accessibility"].includes(item.href),
  )
  .map(({ href, label }) => ({ href, label }));

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <SiteNavigation items={primaryNavigation} />
      {children}
      <Footer
        legalLinks={legalLinks}
        pronunciation={siteConfig.pronunciation}
      />
    </>
  );
}
