import Link from "next/link";

import { RisoArtwork, type RisoAsset } from "@/components/brand/RisoArtwork";
import { classNames } from "@/components/ui/classNames";

import { ArchetypeChip } from "./ArchetypeChip";
import styles from "./JourneyCard.module.css";

export interface JourneyCardProps {
  href: string;
  title: string;
  place: string;
  fitLabel: string;
  duration: string;
  groupSize: string;
  seatStatus: string;
  asset: RisoAsset;
  priority?: boolean;
  className?: string;
}

export function JourneyCard({
  href,
  title,
  place,
  fitLabel,
  duration,
  groupSize,
  seatStatus,
  asset,
  priority = false,
  className,
}: JourneyCardProps) {
  return (
    <article className={classNames(styles.article, className)}>
      <Link className={styles.link} href={href}>
        <RisoArtwork
          asset={asset}
          aspectRatio="card"
          className={styles.media}
          priority={priority}
        />
        <div className={styles.body}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.place}>{place}</p>
          <ArchetypeChip className={styles.fit}>Fits {fitLabel}</ArchetypeChip>
          <ul className={styles.meta} aria-label="Journey details">
            <li className={styles.metaItem}>{duration}</li>
            <li className={styles.metaItem}>{groupSize}</li>
            <li className={styles.metaItem}>{seatStatus}</li>
          </ul>
        </div>
      </Link>
    </article>
  );
}
