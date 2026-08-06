import Image from "next/image";

import type { RisoAsset } from "@/components/brand/RisoArtwork";
import { plateFor } from "@/content/photograph-plates";

import styles from "./JourneyPlate.module.css";

interface JourneyPlateProps {
  asset: RisoAsset;
  /** Rendered height in CSS pixels, used to ask for a sensible width. */
  nominalHeight?: number;
  priority?: boolean;
}

/**
 * One photograph, at its own shape.
 *
 * This exists because RisoArtwork renders in `fill` mode with
 * `object-fit: cover`, which is a crop applied by a stylesheet that has never
 * seen the photograph. That is right for a card, where the slot is fixed. It is
 * wrong for a gallery of somebody's own work.
 *
 * Here the true dimensions come from content/photograph-plates.ts, so the
 * browser reserves exactly the right box, the CSS fixes only the height, and
 * the width follows the frame. Portraits stay portrait; the 1.94:1 altiplano
 * panoramas stay panoramic. Of the thirteen photography and gallery sites
 * surveyed on 6 August 2026, not one fixed both dimensions of a photograph.
 *
 * The caption is short and human. The alt text is longer and describes the
 * picture for someone who cannot see it. They are never the same string.
 */
export function JourneyPlate({
  asset,
  nominalHeight = 420,
  priority = false,
}: JourneyPlateProps) {
  const plate = plateFor(asset.src);

  // Without real dimensions there is no honest way to lay this out uncropped,
  // so the plate is skipped rather than guessed at.
  if (!plate) return null;

  const ratio = plate.width / plate.height;
  const renderedWidth = Math.round(nominalHeight * ratio);

  return (
    <figure className={styles.plate} style={{ "--plate-ratio": `${ratio}` } as React.CSSProperties}>
      <Image
        alt={asset.alt}
        className={styles.image}
        height={plate.height}
        loading={priority ? undefined : "lazy"}
        preload={priority}
        // Asks for roughly what is actually displayed, not the viewport width.
        sizes={`(max-width: 767px) 92vw, ${renderedWidth}px`}
        src={asset.src}
        width={plate.width}
      />
      {plate.caption ? (
        <figcaption className={styles.caption}>{plate.caption}</figcaption>
      ) : null}
    </figure>
  );
}
