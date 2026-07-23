import Link from "next/link";

import {
  RisoArtwork,
  type RisoAsset,
} from "@/components/brand/RisoArtwork";
import { classNames } from "@/components/ui/classNames";

import styles from "./DepartureCard.module.css";

export interface DepartureCardProps {
  href: string;
  title: string;
  route: string;
  duration: string;
  dateWindow: string;
  groupSize: string;
  price: string;
  asset: RisoAsset;
  sequence?: string;
  eyebrow?: string;
  className?: string;
  priority?: boolean;
  featured?: boolean;
}

export function DepartureCard({
  href,
  title,
  route,
  duration,
  dateWindow,
  groupSize,
  price,
  asset,
  sequence,
  eyebrow,
  className,
  priority = false,
  featured = false,
}: DepartureCardProps) {
  return (
    <Link
      className={classNames(
        styles.card,
        featured && styles.featured,
        className,
      )}
      href={href}
      aria-label={`Explore ${title}`}
    >
      <RisoArtwork
        asset={asset}
        aspectRatio={featured ? "wide" : "card"}
        sizes={
          featured
            ? "(max-width: 767px) 100vw, 55vw"
            : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
        }
        priority={priority}
        className={styles.image}
      />
      <div className={styles.body}>
        <div className={styles.kicker}>
          {sequence ? <span aria-hidden="true">{sequence}</span> : null}
          <span>{eyebrow ?? "Caravan section"}</span>
        </div>
        <h3>{title}</h3>
        <p className={styles.route}>{route}</p>
        <dl className={styles.facts}>
          <div>
            <dt>Duration</dt>
            <dd>{duration}</dd>
          </div>
          <div>
            <dt>Window</dt>
            <dd>{dateWindow}</dd>
          </div>
          <div>
            <dt>Group</dt>
            <dd>{groupSize}</dd>
          </div>
        </dl>
        <div className={styles.footer}>
          <span>{price}</span>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </Link>
  );
}
