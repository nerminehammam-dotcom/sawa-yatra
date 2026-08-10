import { Arrow } from "@/components/ui/Arrow";
import Link from "next/link";

import {
  RisoArtwork,
  type RisoAsset,
} from "@/components/brand/RisoArtwork";
import { ProvenanceBadge } from "@/components/journeys/ProvenanceBadge";
import { classNames } from "@/components/ui/classNames";
import type { Provenance } from "@/lib/journeys/model";

import styles from "./DepartureCard.module.css";

export interface DepartureCardProps {
  href: string;
  title: string;
  route: string;
  duration: string;
  dateWindow?: string;
  groupSize?: string;
  price?: string;
  asset: RisoAsset;
  /**
   * §2.2 / rule 1.4 — provenance renders as a badge on every journey card:
   * who stands behind this journey. Defaults to Sawayatra for the Caravan
   * sections; partner inventory must pass its own.
   */
  provenance?: Provenance;
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
  provenance = "sawayatra",
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
            ? "(max-width: 767px) 100vw, (max-width: 1440px) 55vw, 792px"
            : "(max-width: 1023px) 100vw, (max-width: 1440px) 50vw, 720px"
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
          <ProvenanceBadge provenance={provenance} />
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>Duration</dt>
            <dd>{duration}</dd>
          </div>
          {groupSize ? (
            <div>
              <dt>Group</dt>
              <dd>{groupSize}</dd>
            </div>
          ) : null}
          {dateWindow ? (
            <div className={styles.windowFact}>
              <dt>Window</dt>
              <dd>{dateWindow}</dd>
            </div>
          ) : null}
        </dl>
        <div className={styles.footer}>
          {price ? <span className={styles.price}>{price}</span> : null}
          <span className={styles.viewLink} aria-hidden="true">
            View journey <Arrow />
          </span>
        </div>
      </div>
    </Link>
  );
}
