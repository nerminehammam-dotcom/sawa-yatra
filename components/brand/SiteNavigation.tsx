"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import {
  departuresNavigation,
  utilityNavigation,
} from "@/content/navigation";

import styles from "./SiteNavigation.module.css";
import { Wordmark } from "./Wordmark";

export interface SiteNavigationItem {
  href: string;
  label: string;
}

export interface SiteNavigationProps {
  items?: readonly SiteNavigationItem[];
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
}: SiteNavigationProps) {
  const pathname = usePathname();
  const drawerId = useId();
  const departuresMenuId = useId();
  const mobileDeparturesMenuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeparturesOpen, setIsDeparturesOpen] = useState(false);
  const [isMobileDeparturesOpen, setIsMobileDeparturesOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const departuresTriggerRef = useRef<HTMLButtonElement>(null);
  const departuresItemRef = useRef<HTMLLIElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const visibleItems = items.filter((item) => item.href !== "/open-seats");
  const askAction = utilityNavigation[0];

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1281px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!isDeparturesOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        departuresItemRef.current &&
        !departuresItemRef.current.contains(event.target as Node)
      ) {
        setIsDeparturesOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsDeparturesOpen(false);
      departuresTriggerRef.current?.focus();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeparturesOpen]);

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
        setIsMobileDeparturesOpen(false);
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
      <div className={styles.brandBand}>
        <Container className={styles.brandRow}>
          <Wordmark size="large" />
          <Link className={styles.utilityLink} href={askAction.href}>
            {askAction.label}
          </Link>
          <button
            ref={triggerRef}
            className={styles.mobileButton}
            type="button"
            aria-expanded={isOpen}
            aria-controls={drawerId}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span>{isOpen ? "Close" : "Menu"}</span>
            <span aria-hidden="true">{isOpen ? "×" : "+"}</span>
          </button>
        </Container>
      </div>

      <div className={styles.navigationBand}>
        <Container className={styles.navigationRow}>
          <div className={styles.desktop}>
          <ul className={styles.list} aria-label="Primary navigation links">
            {visibleItems.map((item) => {
              const hasDeparturesMenu = item.href === "/departures";
              const isActive =
                isCurrentPath(pathname, item.href) ||
                (hasDeparturesMenu &&
                  (pathname.startsWith("/caravans") ||
                    pathname === "/joining-points"));

              return (
              <li
                ref={hasDeparturesMenu ? departuresItemRef : undefined}
                className={hasDeparturesMenu ? styles.hasSubmenu : undefined}
                key={item.href}
              >
                <div className={styles.linkGroup}>
                  <Link
                  className={styles.link}
                  href={item.href}
                  aria-current={
                    isCurrentPath(pathname, item.href) ? "page" : undefined
                  }
                  data-active={isActive ? "true" : undefined}
                >
                  {item.label}
                </Link>
                {hasDeparturesMenu ? (
                  <button
                    ref={departuresTriggerRef}
                    className={styles.submenuButton}
                    type="button"
                    aria-label="Toggle Departures menu"
                    aria-expanded={isDeparturesOpen}
                    aria-controls={departuresMenuId}
                    onClick={() => setIsDeparturesOpen((open) => !open)}
                  >
                    <span aria-hidden="true">{isDeparturesOpen ? "↑" : "↓"}</span>
                  </button>
                ) : null}
                </div>
                {hasDeparturesMenu && isDeparturesOpen ? (
                  <div className={styles.submenu} id={departuresMenuId}>
                    {departuresNavigation.map((subitem) => (
                      <Link
                        className={styles.submenuLink}
                        href={subitem.href}
                        key={subitem.id}
                        onClick={() => setIsDeparturesOpen(false)}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
              );
            })}
          </ul>
          </div>
        </Container>
      </div>

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
            <ul
              className={styles.mobileList}
              aria-label="Primary navigation links"
            >
              {visibleItems.map((item, index) => {
                const hasDeparturesMenu = item.href === "/departures";

                return (
                <li key={item.href}>
                  <div className={styles.mobileLinkRow}>
                    <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    className={styles.mobileLink}
                    href={item.href}
                    aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                    {hasDeparturesMenu ? (
                      <button
                        className={styles.mobileSubmenuButton}
                        type="button"
                        aria-label="Toggle Departures menu"
                        aria-expanded={isMobileDeparturesOpen}
                        aria-controls={mobileDeparturesMenuId}
                        onClick={() => setIsMobileDeparturesOpen((open) => !open)}
                      >
                        <span aria-hidden="true">{isMobileDeparturesOpen ? "↑" : "↓"}</span>
                      </button>
                    ) : null}
                  </div>
                  {hasDeparturesMenu && isMobileDeparturesOpen ? (
                    <div className={styles.mobileSubmenu} id={mobileDeparturesMenuId}>
                      {departuresNavigation.map((subitem) => (
                        <Link
                          className={styles.mobileSubmenuLink}
                          href={subitem.href}
                          key={subitem.id}
                          onClick={() => setIsOpen(false)}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </li>
                );
              })}
            </ul>
            <div
              className={styles.mobileUtilities}
              role="group"
              aria-label="Utility actions"
            >
              <Link
                className={styles.mobileUtilityLink}
                href={askAction.href}
                onClick={() => setIsOpen(false)}
              >
                {askAction.label}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
