"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { primaryNavigation } from "@/content/navigation";
import {
  rightHandNavigation,
  type NavigationSession,
} from "@/lib/sawayatra/navigation";

import styles from "./SiteNavigation.module.css";
import { Wordmark } from "./Wordmark";

const SIGNED_OUT: NavigationSession = {
  isSignedIn: false,
  membershipStatus: "none",
};

function isCurrentPath(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const pathname = usePathname();
  const sheetId = useId();
  const [session, setSession] = useState<NavigationSession>(SIGNED_OUT);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/session", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : SIGNED_OUT))
      .then((value: NavigationSession) => setSession(value))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsSheetOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!isSheetOpen) return;
    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSheetOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      menuButton?.focus();
    };
  }, [isSheetOpen]);

  const rightItems = rightHandNavigation(session);

  return (
    <header className={styles.root} id="site-top" tabIndex={-1}>
      <div className={styles.brandRow}>
        <Wordmark className={styles.wordmark} size="large" />
        <nav className={styles.utility} aria-label="Account">
          {rightItems.map((item, index) => (
            <span className={styles.utilityItem} key={item.href}>
              {index > 0 ? <span className={styles.utilityRule} aria-hidden="true" /> : null}
              {item.label === "Join" || item.label === "Renew" ? (
                <ButtonLink href={item.href} variant="primary">
                  {item.label}
                </ButtonLink>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </span>
          ))}
        </nav>
        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={isSheetOpen}
          aria-controls={sheetId}
          onClick={() => setIsSheetOpen(true)}
        >
          <span className={styles.menuBars} aria-hidden="true"><span /><span /><span /></span>
          Menu
        </button>
      </div>

      <nav className={styles.mainBar} aria-label="Primary">
        <ul className={styles.mainList}>
          {primaryNavigation.map((item) => (
            <li className={styles.mainItem} key={item.id}>
              <Link
                className={styles.mainLink}
                href={item.href}
                aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isSheetOpen ? (
        <div className={styles.sheet} id={sheetId} role="dialog" aria-modal="true" aria-label="Site menu">
          <div className={styles.sheetTop}>
            <Wordmark href={null} className={styles.sheetWordmark} />
            <button ref={closeButtonRef} className={styles.sheetClose} type="button" onClick={() => setIsSheetOpen(false)}>
              Close
            </button>
          </div>
          <ul className={styles.sheetList}>
            {primaryNavigation.map((item) => (
              <li key={item.id}>
                <Link className={styles.sheetLink} href={item.href} aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
            {rightItems.map((item) => (
              <li key={item.href}>
                <Link className={styles.sheetLink} href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
