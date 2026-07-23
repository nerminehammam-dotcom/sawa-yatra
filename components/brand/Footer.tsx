import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { classNames } from "@/components/ui/classNames";

import styles from "./Footer.module.css";
import { Wordmark } from "./Wordmark";

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterProps {
  legalLinks?: readonly FooterLink[];
  pronunciation?: string;
  ground?: "brick" | "ink";
  className?: string;
}

const defaultLegalLinks: readonly FooterLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

const exploreLinks: readonly FooterLink[] = [
  { href: "/departures", label: "Departures" },
  { href: "/travel-self", label: "Meet your Travel Self" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
] as const;

export function Footer({
  legalLinks = defaultLegalLinks,
  pronunciation = "sa·wa·ya·tra",
  ground = "ink",
  className,
}: FooterProps) {
  return (
    <footer className={classNames(styles.root, styles[ground], className)}>
      <Container className={styles.layout}>
        <div className={styles.identity}>
          <Wordmark tone="cream" size="large" />
          <p className={styles.pronunciation}>
            <span className="sr-only">Pronunciation: </span>
            {pronunciation}
          </p>
        </div>
        <div className={styles.footerNavs}>
          <nav aria-label="Explore">
            <p className={styles.navLabel}>Explore</p>
            <ul className={styles.explore}>
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link className={styles.link} href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal">
            <p className={styles.navLabel}>Small print</p>
            <ul className={styles.legal}>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link className={styles.link} href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link className={styles.invitation} href="/request-invitation">
            Request an invitation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </Container>
    </footer>
  );
}
