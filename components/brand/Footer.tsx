import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { classNames } from "@/components/ui/classNames";

import styles from "./Footer.module.css";
import { BackToTopLink } from "./BackToTopLink";
import { Wordmark } from "./Wordmark";

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterProps {
  navigationLinks?: readonly FooterLink[];
  legalLinks?: readonly FooterLink[];
  pronunciation?: string;
  ground?: "brick" | "ink" | "olive";
  className?: string;
}

const defaultLegalLinks: readonly FooterLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

export function Footer({
  navigationLinks = [],
  legalLinks = defaultLegalLinks,
  pronunciation = "sa·wa·ya·tra",
  ground = "olive",
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
        <div className={styles.orientation}>
          <nav aria-label="Footer navigation">
            <p className={styles.navigationLabel}>Explore Sawayatra</p>
            <ul className={styles.navigation}>
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  {link.href === "#site-top" ? (
                    <BackToTopLink className={styles.link} />
                  ) : (
                    <Link className={styles.link} href={link.href}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal">
            <p className={styles.navigationLabel}>Legal</p>
            <ul className={styles.legal}>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link className={styles.link} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
