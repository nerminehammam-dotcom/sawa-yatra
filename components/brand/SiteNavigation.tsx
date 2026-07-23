"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";

import styles from "./SiteNavigation.module.css";
import { Wordmark } from "./Wordmark";

export interface SiteNavigationItem {
  href: string;
  label: string;
}

export interface SiteNavigationProps {
  items?: readonly SiteNavigationItem[];
  signInHref?: string;
}

const defaultItems: readonly SiteNavigationItem[] = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/travel-self", label: "Meet your Travel Self" },
  { href: "/departures", label: "Departures" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
] as const;

function isCurrentPath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation({
  items = defaultItems,
  signInHref = "/sign-in",
}: SiteNavigationProps) {
  const pathname = usePathname();
  const drawerId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const visibleItems = items.filter((item) => item.href !== "/open-seats");

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => firstLinkRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <nav className={styles.root} aria-label="Primary">
      <Container className={styles.bar}>
        <Wordmark />
        <div className={styles.desktop}>
          <ul className={styles.list}>
            {visibleItems.map((item) => (
              <li key={item.href}>
                <Link
                  className={styles.link}
                  href={item.href}
                  aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className={styles.signIn}
            href={signInHref}
            aria-current={isCurrentPath(pathname, signInHref) ? "page" : undefined}
          >
            Sign in
          </Link>
        </div>
        <button
          ref={triggerRef}
          className={styles.mobileButton}
          type="button"
          aria-expanded={isOpen}
          aria-controls={drawerId}
          onClick={() => setIsOpen(true)}
        >
          Menu
        </button>
      </Container>

      {isOpen ? (
        <div
          ref={drawerRef}
          className={styles.drawer}
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className={styles.panel}>
            <div className={styles.drawerHeader}>
              <Wordmark href={null} />
              <button
                className={styles.closeButton}
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
            <ul className={styles.mobileList}>
              {visibleItems.map((item, index) => (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    className={styles.mobileLink}
                    href={item.href}
                    aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              className={`${styles.mobileLink} ${styles.mobileSignIn}`}
              href={signInHref}
              aria-current={isCurrentPath(pathname, signInHref) ? "page" : undefined}
              onClick={() => setIsOpen(false)}
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
