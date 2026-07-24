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
  ground?: "brick" | "ink" | "olive";
  className?: string;
}

const defaultLegalLinks: readonly FooterLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

export function Footer({
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
        <nav aria-label="Legal">
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
      </Container>
    </footer>
  );
}
