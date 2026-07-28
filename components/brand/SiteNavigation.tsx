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

import {
  announcementNavigation,
  caravansNavigation,
  primaryNavigation,
  utilityNavigation,
} from "@/content/navigation";

import styles from "./SiteNavigation.module.css";
import { Wordmark } from "./Wordmark";

const BANNER_STORAGE_KEY = "sawayatra.navigation.notice.dismissed";

function isCurrentPath(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function isCaravansPath(pathname: string): boolean {
  return (
    pathname.startsWith("/caravans") ||
    pathname.startsWith("/departures") ||
    pathname === "/joining-points"
  );
}

export function SiteNavigation() {
  const pathname = usePathname();
  const sheetId = useId();
  const caravansPanelId = useId();
  const caravansTriggerId = useId();
  const mobileCaravansId = useId();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCaravansOpen, setIsCaravansOpen] = useState(false);
  const [isMobileCaravansOpen, setIsMobileCaravansOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const previousPathnameRef = useRef(pathname);
  const caravansItemRef = useRef<HTMLLIElement>(null);
  const caravansTriggerRef = useRef<HTMLButtonElement>(null);
  const firstCaravanLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setIsBannerVisible(sessionStorage.getItem(BANNER_STORAGE_KEY) !== "true");
      } catch {
        setIsBannerVisible(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
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
      setIsCaravansOpen(false);
      setIsSheetOpen(false);
      setIsMobileCaravansOpen(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1025px)");
    const closeSheetAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsSheetOpen(false);
    };

    desktopQuery.addEventListener("change", closeSheetAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeSheetAtDesktop);
  }, []);

  useEffect(() => {
    if (!isCaravansOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!caravansItemRef.current?.contains(event.target as Node)) {
        setIsCaravansOpen(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsCaravansOpen(false);
      caravansTriggerRef.current?.focus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCaravansOpen]);

  useEffect(() => {
    if (!isSheetOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      sheetCloseRef.current?.focus();
    });

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsSheetOpen(false);
        setIsMobileCaravansOpen(false);
        return;
      }

      if (event.key !== "Tab" || !sheetRef.current) return;
      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
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
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isSheetOpen]);

  const dismissBanner = () => {
    setIsBannerVisible(false);
    try {
      sessionStorage.setItem(BANNER_STORAGE_KEY, "true");
    } catch {
      // The banner still closes for this render when storage is unavailable.
    }
  };

  const openCaravansFromKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    setIsCaravansOpen(true);
    window.requestAnimationFrame(() => firstCaravanLinkRef.current?.focus());
  };

  const closeCaravansWhenFocusLeaves = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsCaravansOpen(false);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setIsMobileCaravansOpen(false);
  };

  return (
    <header ref={rootRef} className={styles.root} id="site-top" tabIndex={-1}>
      {isBannerVisible ? (
        <div className={styles.banner}>
          <p>
            {announcementNavigation.message}{" "}
            <Link href={announcementNavigation.action.href}>
              {announcementNavigation.action.label}
            </Link>
          </p>
          <div className={styles.bannerActions}>
            <Link className={styles.bannerSignIn} href={announcementNavigation.signIn.href}>
              {announcementNavigation.signIn.label}
            </Link>
            <button
              className={styles.bannerClose}
              type="button"
              aria-label="Dismiss this notice"
              onClick={dismissBanner}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      ) : null}

      <div className={styles.brandRow}>
        <Wordmark className={styles.wordmark} size="large" />
        <nav className={styles.utility} aria-label="Club pages">
          {utilityNavigation.map((item, index) => (
            <span className={styles.utilityItem} key={item.id}>
              {index > 0 ? <span className={styles.utilityRule} aria-hidden="true" /> : null}
              <Link href={item.href}>{item.label}</Link>
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
          <span className={styles.menuBars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Menu
        </button>
      </div>

      <nav className={styles.mainBar} aria-label="Primary">
        <ul className={styles.mainList}>
          {primaryNavigation.map((item) => {
            const isCaravans = item.id === "caravans";
            if (isCaravans) {
              return (
                <li
                  ref={caravansItemRef}
                  className={styles.mainItem}
                  key={item.id}
                  onBlur={closeCaravansWhenFocusLeaves}
                >
                  <button
                    ref={caravansTriggerRef}
                    id={caravansTriggerId}
                    className={styles.mainLink}
                    type="button"
                    aria-expanded={isCaravansOpen}
                    aria-controls={caravansPanelId}
                    data-active={isCaravansPath(pathname) ? "true" : undefined}
                    onClick={() => setIsCaravansOpen((open) => !open)}
                    onKeyDown={openCaravansFromKeyboard}
                  >
                    {item.label}
                    <span className={styles.caret} aria-hidden="true" />
                  </button>
                  {isCaravansOpen ? (
                    <div
                      className={styles.caravansPanel}
                      id={caravansPanelId}
                      role="region"
                      aria-labelledby={caravansTriggerId}
                    >
                      <div className={styles.panelColumn}>
                        <p className={styles.panelLabel}>Choose a caravan</p>
                        {caravansNavigation.choose.map((entry, index) => (
                          <Link
                            ref={index === 0 ? firstCaravanLinkRef : undefined}
                            className={styles.panelEntry}
                            href={entry.href}
                            key={entry.id}
                          >
                            <span className={styles.entryTitle}>{entry.label}</span>
                            <span className={styles.entryMeta}>{entry.meta}</span>
                          </Link>
                        ))}
                      </div>
                      <div className={styles.panelColumn}>
                        <p className={styles.panelLabel}>Join a caravan</p>
                        {caravansNavigation.join.map((entry) => (
                          <Link
                            className={styles.panelEntry}
                            href={entry.href}
                            key={entry.id}
                          >
                            <span className={styles.entryTitle}>{entry.label}</span>
                            {entry.id === "hop-on-hop-off" ? (
                              <span className={styles.routeStrip} aria-hidden="true">
                                {Array.from({ length: 9 }, (_, index) => (
                                  <span key={index} />
                                ))}
                              </span>
                            ) : null}
                            <span className={styles.entryMeta}>{entry.meta}</span>
                          </Link>
                        ))}
                      </div>
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
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {isSheetOpen ? (
        <div
          ref={sheetRef}
          className={styles.sheet}
          id={sheetId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className={styles.sheetTop}>
            <Wordmark href={null} className={styles.sheetWordmark} />
            <button
              ref={sheetCloseRef}
              className={styles.sheetClose}
              type="button"
              onClick={closeSheet}
            >
              Close
            </button>
          </div>
          <ul className={styles.sheetList}>
            {primaryNavigation.map((item) =>
              item.id === "caravans" ? (
                <li key={item.id}>
                  <button
                    className={styles.sheetLink}
                    type="button"
                    aria-expanded={isMobileCaravansOpen}
                    aria-controls={mobileCaravansId}
                    onClick={() => setIsMobileCaravansOpen((open) => !open)}
                  >
                    {item.label}
                    <span className={styles.caret} aria-hidden="true" />
                  </button>
                  {isMobileCaravansOpen ? (
                    <div className={styles.sheetDrawer} id={mobileCaravansId}>
                      <p className={styles.panelLabel}>Choose a caravan</p>
                      {caravansNavigation.choose.map((entry) => (
                        <Link
                          className={styles.panelEntry}
                          href={entry.href}
                          key={entry.id}
                          onClick={closeSheet}
                        >
                          <span className={styles.entryTitle}>{entry.label}</span>
                          <span className={styles.entryMeta}>{entry.meta}</span>
                        </Link>
                      ))}
                      <p className={styles.panelLabel}>Join a caravan</p>
                      {caravansNavigation.join.map((entry) => (
                        <Link
                          className={styles.panelEntry}
                          href={entry.href}
                          key={entry.id}
                          onClick={closeSheet}
                        >
                          <span className={styles.entryTitle}>{entry.label}</span>
                          <span className={styles.entryMeta}>{entry.meta}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </li>
              ) : (
                <li key={item.id}>
                  <Link className={styles.sheetLink} href={item.href} onClick={closeSheet}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
            {utilityNavigation.map((item) => (
              <li key={item.id}>
                <Link className={styles.sheetLink} href={item.href} onClick={closeSheet}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className={styles.sheetLink}
                href={announcementNavigation.signIn.href}
                onClick={closeSheet}
              >
                {announcementNavigation.signIn.label}
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
