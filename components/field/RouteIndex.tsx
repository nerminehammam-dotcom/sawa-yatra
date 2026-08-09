import Image from "next/image";
import Link from "next/link";

import { ProvenanceBadge } from "@/components/journeys/ProvenanceBadge";
import { andeanCaravanSections } from "@/content/andean-caravan";
import { getAndeanCaravanImage } from "@/content/andean-caravan-images";

import styles from "./FieldDocument.module.css";
import { Arrow } from "@/components/ui/Arrow";

export function RouteIndex() {
  return (
    <ol className={styles.routeIndex}>
      {andeanCaravanSections.map((section) => {
        const image = getAndeanCaravanImage(section.slug);
        return (
          <li className={styles.routeItem} key={section.id}>
            <span className={styles.routeNumber} aria-hidden="true">
              {String(section.sectionNumber).padStart(2, "0")}
            </span>
            <div className={styles.routePhoto}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 35vw, (max-width: 1440px) 18vw, 259px"
                style={{
                  objectPosition: `${image.focalPoint?.x ?? 50}% ${image.focalPoint?.y ?? 50}%`,
                }}
              />
            </div>
            <div className={styles.routeMain}>
              <h3>{section.title}</h3>
              <p>{section.route}</p>
              {/* Rule 1.4 / §2.2 — provenance on every journey card. */}
              <ProvenanceBadge provenance="sawayatra" />
            </div>
            <dl className={styles.routeFacts}>
              <div>
                <dt>Time</dt>
                <dd>{section.durationDays} days</dd>
              </div>
              <div>
                <dt>Join</dt>
                <dd>{section.publicDateWindow}</dd>
              </div>
            </dl>
            <Link
              className={styles.routeLink}
              href={`/departures/${section.slug}`}
              aria-label={`View ${section.title}`}
            >
              View section <Arrow direction="up-right" />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
