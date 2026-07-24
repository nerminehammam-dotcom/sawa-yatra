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
  tone?: "peru" | "bolivia" | "chile" | "crossing";
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
  tone = "peru",
}: DepartureCardProps) {
  return (
    <Link
      className={classNames(
        styles.card,
        featured && styles.featured,
        styles[tone],
        className,
      )}
      href={href}
    >
      <RisoArtwork
        asset={asset}
        aspectRatio={featured ? "wide" : "card"}
        sizes={
          featured
            ? "(max-width: 767px) 100vw, 55vw"
            : "(max-width: 1023px) 100vw, 50vw"
        }
        priority={priority}
        className={styles.image}
      />
      <div className={styles.body}>
        <div className={styles.intro}>
          <div className={styles.kicker}>
            {sequence ? (
              <span className={styles.sequence} aria-hidden="true">
                {sequence}
              </span>
            ) : null}
            <span>{eyebrow ?? "Caravan section"}</span>
          </div>
          <h3>{title}</h3>
          <p className={styles.route}>{route}</p>
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>Duration</dt>
            <dd>{duration}</dd>
          </div>
          <div>
            <dt>Group</dt>
            <dd>{groupSize}</dd>
          </div>
          <div className={styles.windowFact}>
            <dt>Window</dt>
            <dd>{dateWindow}</dd>
          </div>
        </dl>
        <div className={styles.footer}>
          <span className={styles.price}>{price}</span>
          <span className={styles.viewLink} aria-hidden="true">
            View journey <span className={styles.arrow}>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
