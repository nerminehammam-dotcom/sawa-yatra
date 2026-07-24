import Image from "next/image";
import Link from "next/link";

import { andeanCaravanSections } from "@/content/andean-caravan";
import { getAndeanCaravanImage } from "@/content/andean-caravan-images";

import styles from "./FieldDocument.module.css";

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
                sizes="(max-width: 767px) 35vw, 18vw"
                style={{
                  objectPosition: `${image.focalPoint?.x ?? 50}% ${image.focalPoint?.y ?? 50}%`,
                }}
              />
            </div>
            <div className={styles.routeMain}>
              <h3>{section.title}</h3>
              <p>{section.route}</p>
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
              View section <span aria-hidden="true">↗</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
