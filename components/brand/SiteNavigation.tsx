"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  andeanCaravanNavigation,
  caravanNavigation,
  journeyProductNavigation,
  primaryNavigation,
} from "@/content/navigation";
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

function isJourneysPath(pathname: string): boolean {
  return (
    pathname.startsWith("/journeys") ||
    pathname.startsWith("/caravans") ||
    pathname.startsWith("/departures") ||
    pathname === "/joining-points"
  );
}

function isCurrentJourneyEntry(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isCurrentAndeanEntry(
  pathname: string,
  currentHash: string,
  href: string,
): boolean {
  const [entryPath, entryHash] = href.split("#");
  if (pathname !== entryPath) return false;
  if (entryHash) return currentHash === `#${entryHash}`;
  if (entryPath === caravanNavigation[0].href) return currentHash === "";
  return true;
}

export function SiteNavigation() {
  const pathname = usePathname();
  const sheetId = useId();
  const journeysPanelId = useId();
  const journeysTriggerId = useId();
  const mobileJourneysId = useId();
  const caravansPanelId = useId();
  const mobileCaravansPanelId = useId();
  const [session, setSession] = useState<NavigationSession>(SIGNED_OUT);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isJourneysOpen, setIsJourneysOpen] = useState(false);
  const [isMobileJourneysOpen, setIsMobileJourneysOpen] = useState(false);
  const [isCaravansOpen, setIsCaravansOpen] = useState(false);
  const [isMobileCaravansOpen, setIsMobileCaravansOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const previousPathnameRef = useRef(pathname);
  const journeysItemRef = useRef<HTMLLIElement>(null);
  const journeysTriggerRef = useRef<HTMLButtonElement>(null);
  const firstJourneyLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

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
    const root = rootRef.current;
    if (!root) return;

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${root.getBoundingClientRect().height}px`,
      );
    };

    updateHeaderHeight();
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(root);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--site-header-height");
    };
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    const frame = window.requestAnimationFrame(() => {
      setIsJourneysOpen(false);
      setIsSheetOpen(false);
      setIsMobileJourneysOpen(false);
      setIsCaravansOpen(false);
      setIsMobileCaravansOpen(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  useEffect(() => {
    if (!isJourneysOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!journeysItemRef.current?.contains(event.target as Node)) {
        setIsJourneysOpen(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsJourneysOpen(false);
      setIsCaravansOpen(false);
      journeysTriggerRef.current?.focus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isJourneysOpen]);

  useEffect(() => {
    if (!isSheetOpen) return;
    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSheetOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      menuButton?.focus();
    };
  }, [isSheetOpen]);

  const rightItems = rightHandNavigation(session);

  const openJourneysFromKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    setIsJourneysOpen(true);
    window.requestAnimationFrame(() => firstJourneyLinkRef.current?.focus());
  };

  const closeJourneysWhenFocusLeaves = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsJourneysOpen(false);
      setIsCaravansOpen(false);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setIsMobileJourneysOpen(false);
    setIsMobileCaravansOpen(false);
  };

  return (
    <header ref={rootRef} className={styles.root} id="site-top" tabIndex={-1}>
      <div className={styles.brandRow}>
        <Wordmark className={styles.wordmark} size="large" />
        <nav className={styles.utility} aria-label="Account">
          {rightItems.map((item, index) => (
            <span className={styles.utilityItem} key={item.href}>
              {index > 0 ? <span className={styles.utilityRule} aria-hidden="true" /> : null}
              {item.href === "/club/apply" ? (
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
          {primaryNavigation.map((item) => {
            if (item.id === "journeys") {
              return (
                <li
                  ref={journeysItemRef}
                  className={styles.mainItem}
                  key={item.id}
                  onBlur={closeJourneysWhenFocusLeaves}
                >
                  <button
                    ref={journeysTriggerRef}
                    id={journeysTriggerId}
                    className={styles.mainLink}
                    type="button"
                    aria-expanded={isJourneysOpen}
                    aria-controls={journeysPanelId}
                    data-active={isJourneysPath(pathname) ? "true" : undefined}
                    onClick={() => {
                      setIsJourneysOpen((open) => !open);
                      setIsCaravansOpen(false);
                    }}
                    onKeyDown={openJourneysFromKeyboard}
                  >
                    {item.label}
                    <span className={styles.caret} aria-hidden="true" />
                  </button>
                  {isJourneysOpen ? (
                    <div
                      className={styles.caravansPanel}
                      id={journeysPanelId}
                      role="region"
                      aria-labelledby={journeysTriggerId}
                      data-caravans-open={
                        isCaravansOpen ? "true" : undefined
                      }
                    >
                      <div className={`${styles.panelColumn} ${styles.journeyMenu}`}>
                        <Link
                          ref={firstJourneyLinkRef}
                          className={`${styles.panelLabel} ${styles.panelLabelLink} ${styles.journeysOverview}`}
                          href="/journeys"
                          aria-current={pathname === "/journeys" ? "page" : undefined}
                          onClick={() => setIsJourneysOpen(false)}
                        >
                          All journeys
                        </Link>
                        <div className={styles.productWithChildren}>
                          <Link
                            className={`${styles.panelEntry} ${styles.journeyRootEntry}`}
                            href={journeyProductNavigation[0].href}
                            aria-current={
                              pathname === journeyProductNavigation[0].href
                                ? "page"
                                : undefined
                            }
                            data-active={
                              isCurrentJourneyEntry(
                                pathname,
                                journeyProductNavigation[0].href,
                              )
                                ? "true"
                                : undefined
                            }
                            onClick={() => setIsJourneysOpen(false)}
                          >
                            <span className={styles.entryTitle}>
                              {journeyProductNavigation[0].label}
                            </span>
                          </Link>
                          <button
                            className={styles.productToggle}
                            type="button"
                            aria-label={
                              isCaravansOpen
                                ? "Hide Caravan destinations"
                                : "Show Caravan destinations"
                            }
                            aria-expanded={isCaravansOpen}
                            aria-controls={caravansPanelId}
                            onClick={() =>
                              setIsCaravansOpen((open) => !open)
                            }
                          >
                            <span className={styles.caret} aria-hidden="true" />
                          </button>
                        </div>
                        {isCaravansOpen ? (
                          <div
                            className={styles.nestedEntries}
                            id={caravansPanelId}
                            role="group"
                            aria-label="Caravans"
                          >
                            {caravanNavigation.map((entry) => (
                              <Link
                                className={`${styles.panelEntry} ${styles.caravanEntry}`}
                                href={entry.href}
                                key={entry.id}
                                aria-current={
                                  pathname === entry.href &&
                                  (entry.id !== "andean-caravan" ||
                                    currentHash === "")
                                    ? "page"
                                    : undefined
                                }
                                data-active={
                                  isCurrentJourneyEntry(pathname, entry.href)
                                    ? "true"
                                    : undefined
                                }
                                onClick={() => setIsJourneysOpen(false)}
                              >
                                <span className={styles.entryTitle}>
                                  {entry.label}
                                </span>
                                <span className={styles.entryMeta}>
                                  {entry.meta}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                        {journeyProductNavigation.slice(1).map((entry) => (
                          <Link
                            className={`${styles.panelEntry} ${styles.journeyRootEntry}`}
                            href={entry.href}
                            key={entry.id}
                            aria-current={
                              pathname === entry.href ? "page" : undefined
                            }
                            onClick={() => setIsJourneysOpen(false)}
                          >
                            <span className={styles.entryTitle}>{entry.label}</span>
                          </Link>
                        ))}
                      </div>
                      {isCaravansOpen ? (
                        <div
                          className={`${styles.panelColumn} ${styles.caravanDetails}`}
                          role="group"
                          aria-label="Explore The Andean Caravan"
                        >
                          <p className={styles.panelLabel}>
                            Explore The Andean Caravan
                          </p>
                          {andeanCaravanNavigation.map((entry) => (
                            <Link
                              className={styles.panelEntry}
                              href={entry.href}
                              key={entry.id}
                              aria-current={
                                isCurrentAndeanEntry(
                                  pathname,
                                  currentHash,
                                  entry.href,
                                )
                                  ? "page"
                                  : undefined
                              }
                              onClick={() => setIsJourneysOpen(false)}
                            >
                              <span className={styles.entryTitle}>
                                {entry.label}
                              </span>
                              <span className={styles.entryMeta}>
                                {entry.meta}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            }

            return (
              <li className={styles.mainItem} key={item.id}>
                <Link
                  className={styles.mainLink}
                  href={item.href}
                  aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                >
                  {item.id === "how-it-works"
                    ? "How Sawayatra works"
                    : item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {isSheetOpen ? (
        <div ref={sheetRef} className={styles.sheet} id={sheetId} role="dialog" aria-modal="true" aria-label="Site menu">
          <div className={styles.sheetTop}>
            <Wordmark href={null} className={styles.sheetWordmark} />
            <button ref={closeButtonRef} className={styles.sheetClose} type="button" onClick={() => setIsSheetOpen(false)}>
              Close
            </button>
          </div>
          <ul className={styles.sheetList}>
            {primaryNavigation.map((item) =>
              item.id === "journeys" ? (
                <li key={item.id}>
                  <button
                    className={styles.sheetLink}
                    type="button"
                    aria-expanded={isMobileJourneysOpen}
                    aria-controls={mobileJourneysId}
                    onClick={() => {
                      setIsMobileJourneysOpen((open) => !open);
                      setIsMobileCaravansOpen(false);
                    }}
                  >
                    {item.label}
                    <span className={styles.caret} aria-hidden="true" />
                  </button>
                  {isMobileJourneysOpen ? (
                    <div className={styles.sheetDrawer} id={mobileJourneysId}>
                      <div className={styles.panelGroup}>
                        <Link
                          className={`${styles.panelLabel} ${styles.panelLabelLink} ${styles.journeysOverview}`}
                          href="/journeys"
                          aria-current={pathname === "/journeys" ? "page" : undefined}
                          onClick={closeSheet}
                        >
                          All journeys
                        </Link>
                        <div className={styles.productWithChildren}>
                          <Link
                            className={`${styles.panelEntry} ${styles.journeyRootEntry}`}
                            href={journeyProductNavigation[0].href}
                            aria-current={
                              pathname === journeyProductNavigation[0].href
                                ? "page"
                                : undefined
                            }
                            data-active={
                              isCurrentJourneyEntry(
                                pathname,
                                journeyProductNavigation[0].href,
                              )
                                ? "true"
                                : undefined
                            }
                            onClick={closeSheet}
                          >
                            <span className={styles.entryTitle}>
                              {journeyProductNavigation[0].label}
                            </span>
                          </Link>
                          <button
                            className={styles.productToggle}
                            type="button"
                            aria-label={
                              isMobileCaravansOpen
                                ? "Hide Caravan destinations"
                                : "Show Caravan destinations"
                            }
                            aria-expanded={isMobileCaravansOpen}
                            aria-controls={mobileCaravansPanelId}
                            onClick={() =>
                              setIsMobileCaravansOpen((open) => !open)
                            }
                          >
                            <span className={styles.caret} aria-hidden="true" />
                          </button>
                        </div>
                        {isMobileCaravansOpen ? (
                          <>
                            <div
                              className={styles.nestedEntries}
                              id={mobileCaravansPanelId}
                              role="group"
                              aria-label="Caravans"
                            >
                              {caravanNavigation.map((entry) => (
                                <Link
                                  className={`${styles.panelEntry} ${styles.caravanEntry}`}
                                  href={entry.href}
                                  key={entry.id}
                                  aria-current={
                                    pathname === entry.href &&
                                    (entry.id !== "andean-caravan" ||
                                      currentHash === "")
                                      ? "page"
                                      : undefined
                                  }
                                  data-active={
                                    isCurrentJourneyEntry(pathname, entry.href)
                                      ? "true"
                                      : undefined
                                  }
                                  onClick={closeSheet}
                                >
                                  <span className={styles.entryTitle}>
                                    {entry.label}
                                  </span>
                                  <span className={styles.entryMeta}>
                                    {entry.meta}
                                  </span>
                                </Link>
                              ))}
                            </div>
                            <div
                              className={styles.mobileCaravanDetails}
                              role="group"
                              aria-label="Explore The Andean Caravan"
                            >
                              <p className={styles.panelLabel}>
                                Explore The Andean Caravan
                              </p>
                              {andeanCaravanNavigation.map((entry) => (
                                <Link
                                  className={styles.panelEntry}
                                  href={entry.href}
                                  key={entry.id}
                                  aria-current={
                                    isCurrentAndeanEntry(
                                      pathname,
                                      currentHash,
                                      entry.href,
                                    )
                                      ? "page"
                                      : undefined
                                  }
                                  onClick={closeSheet}
                                >
                                  <span className={styles.entryTitle}>
                                    {entry.label}
                                  </span>
                                  <span className={styles.entryMeta}>
                                    {entry.meta}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : null}
                        {journeyProductNavigation.slice(1).map((entry) => (
                          <Link
                            className={styles.panelEntry}
                            href={entry.href}
                            key={entry.id}
                            aria-current={
                              pathname === entry.href ? "page" : undefined
                            }
                            onClick={closeSheet}
                          >
                            <span className={styles.entryTitle}>{entry.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </li>
              ) : (
                <li key={item.id}>
                  <Link
                    className={styles.sheetLink}
                    href={item.href}
                    aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                    onClick={closeSheet}
                  >
                    {item.id === "how-it-works"
                      ? "How Sawayatra works"
                      : item.label}
                  </Link>
                </li>
              ),
            )}
            {rightItems.map((item) => (
              <li key={item.href}>
                <Link className={styles.sheetLink} href={item.href} onClick={closeSheet}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
