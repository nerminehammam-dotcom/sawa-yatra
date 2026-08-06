import type { ReactNode } from "react";

import { Footer } from "@/components/brand/Footer";
import { SiteNavigation } from "@/components/brand/SiteNavigation";
import { SkipLink } from "@/components/brand/SkipLink";
import {
  comingLaterNavigation,
  footerNavigation,
  primaryNavigation,
  utilityNavigation,
} from "@/content/navigation";
import { siteConfig } from "@/content/site";

const legalLinks = footerNavigation
  .filter((item) =>
    ["/privacy", "/terms", "/accessibility"].includes(item.href),
  )
  .map(({ href, label }) => ({ href, label }));

// The footer is the full site index — it carries the operational primary nav,
// the "coming later" pages that were removed from the top nav, and the club
// pages, so nothing becomes unreachable when the primary nav is trimmed.
const footerLinks = [
  ...primaryNavigation.map(({ href, label }) => ({ href, label })),
  ...comingLaterNavigation.map(({ href, label }) => ({ href, label })),
  ...utilityNavigation.map(({ href, label }) => ({ href, label })),
  { href: "/contact", label: "Ask a question" },
  { href: "/sign-in", label: "Sign in" },
  { href: "#site-top", label: "Back to top" },
] as const;

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <SiteNavigation />
      {children}
      <Footer
        navigationLinks={footerLinks}
        legalLinks={legalLinks}
        pronunciation={siteConfig.pronunciation}
      />
    </>
  );
}
