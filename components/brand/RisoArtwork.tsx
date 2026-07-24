import Image from "next/image";
import type { CSSProperties } from "react";

import {
  ContentStatusLabel,
  type ContentStatus,
} from "@/components/ui/ContentStatusLabel";
import { classNames } from "@/components/ui/classNames";

import styles from "./RisoArtwork.module.css";

export interface RisoAsset {
  src: string;
  alt: string;
  treatment: "true" | "duotone";
  focalPoint?: {
    x: number;
    y: number;
  };
  status: ContentStatus;
}

export interface RisoArtworkProps {
  asset: RisoAsset;
  aspectRatio?: "card" | "wide" | "hero" | "square" | "auto";
  sizes?: string;
  priority?: boolean;
  className?: string;
}

interface FocalPointStyle extends CSSProperties {
  "--focal-x": string;
  "--focal-y": string;
}

function normaliseFocalPoint(value: number): number {
  const asPercentage = value >= 0 && value <= 1 ? value * 100 : value;
  return Math.min(100, Math.max(0, asPercentage));
}

export function RisoArtwork({
  asset,
  aspectRatio = "card",
  sizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw",
  priority = false,
  className,
}: RisoArtworkProps) {
  const isPlaceholder = asset.status === "PLACEHOLDER" || !asset.src;
  const focalPointStyle: FocalPointStyle = {
    "--focal-x": `${normaliseFocalPoint(asset.focalPoint?.x ?? 50)}%`,
    "--focal-y": `${normaliseFocalPoint(asset.focalPoint?.y ?? 50)}%`,
  };

  return (
    <figure
      className={classNames(
        styles.root,
        styles[aspectRatio],
        !isPlaceholder && asset.treatment === "duotone" && styles.duotone,
        className,
      )}
      style={focalPointStyle}
    >
      {isPlaceholder ? (
        <div
          className={styles.placeholder}
          role="img"
          aria-label={asset.alt || "Image placeholder"}
        >
          <ContentStatusLabel className={styles.label} status="PLACEHOLDER" />
          {asset.alt ? <span className={styles.description}>{asset.alt}</span> : null}
        </div>
      ) : (
        <Image
          className={styles.image}
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          preload={priority}
          loading={priority ? undefined : "lazy"}
          fetchPriority={priority ? "high" : undefined}
        />
      )}
    </figure>
  );
}
