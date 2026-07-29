"use client";

import { useEffect, useState, type CSSProperties } from "react";

import styles from "./travel-self.module.css";

const TILE_COLORS = [
  "var(--tsi-signal)",
  "var(--tsi-sun)",
  "var(--tsi-olive)",
  "var(--tsi-pink)",
  "var(--tsi-clay)",
  "var(--tsi-sun)",
  "var(--tsi-signal)",
  "var(--tsi-olive)",
  "var(--tsi-pink)",
  "var(--tsi-sun)",
  "var(--tsi-clay)",
  "var(--tsi-olive)",
  "var(--tsi-signal)",
  "var(--tsi-pink)",
  "var(--tsi-sun)",
  "var(--tsi-clay)",
] as const;

export function TravelSelfTiles() {
  const [activeTile, setActiveTile] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mounted = true;
    queueMicrotask(() => {
      if (mounted) setActiveTile(0);
    });
    const intervalId = window.setInterval(() => {
      setActiveTile((current) => ((current ?? 0) + 1) % TILE_COLORS.length);
    }, 4000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.introTiles} aria-hidden="true">
      {TILE_COLORS.map((color, index) => (
        <span
          key={`${color}-${index}`}
          data-on={activeTile === index ? "" : undefined}
          style={{ "--tsi-c": color } as CSSProperties}
        />
      ))}
    </div>
  );
}
