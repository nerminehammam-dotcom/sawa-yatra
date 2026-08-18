import type { ReactNode } from "react";

import { Footer } from "@/components/brand/Footer";
import { SiteNavigation } from "@/components/brand/SiteNavigation";
import { SkipLink } from "@/components/brand/SkipLink";
import { footerNavigation, primaryNavigation } from "@/content/navigation";
import { siteConfig } from "@/content/site";

import { EditorialReveal } from "./EditorialReveal";

const legalLinks = footerNavigation
  .filter((item) =>
    ["/privacy", "/terms", "/accessibility"].includes(item.href),
  )
  .map(({ href, label }) => ({ href, label }));

const footerLinks = [
  ...primaryNavigation.map(({ href, label }) => ({ href, label })),
  { href: "/journey-standards", label: "Journey Standards" },
  { href: "/archive", label: "Archive" },
  { href: "/partners", label: "Partners" },
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
      <EditorialReveal />
      <Footer
        navigationLinks={footerLinks}
        legalLinks={legalLinks}
        pronunciation={siteConfig.pronunciation}
      />
    </>
  );
}
