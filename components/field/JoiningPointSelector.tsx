"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { JoiningPointRecord } from "@/content/field-document";

import styles from "./JoiningPointSelector.module.css";

export function JoiningPointSelector({
  points,
  headingId,
}: {
  points: readonly JoiningPointRecord[];
  headingId: string;
}) {
  const [activeId, setActiveId] = useState(points[0]?.id ?? "");
  const active = points.find((point) => point.id === activeId) ?? points[0];

  if (!active) return null;

  return (
    <div className={styles.root} aria-labelledby={headingId}>
      <div className={styles.index} aria-label="Choose a joining point">
        {points.map((point) => (
          <button
            className={styles.indexButton}
            data-active={point.id === active.id}
            key={point.id}
            type="button"
            aria-pressed={point.id === active.id}
            onClick={() => setActiveId(point.id)}
          >
            <span>{point.number}</span>
            <strong>{point.place}</strong>
            <small>{point.duration}</small>
          </button>
        ))}
      </div>

      <article className={styles.detail} key={active.id}>
        <figure className={styles.image}>
          <Image
            src={active.image.src}
            alt={active.image.alt}
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
            style={{
              objectPosition: `${active.image.focalPoint.x}% ${active.image.focalPoint.y}%`,
            }}
          />
          <figcaption>
            JOINING POINT {active.number} / {active.country}
          </figcaption>
        </figure>
        <div className={styles.copy}>
          <p className={styles.number}>{active.number}</p>
          <div className={styles.titleBlock}>
            <p>{active.country}</p>
            <h3>{active.place}</h3>
            <p className={styles.route}>{active.route}</p>
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>Recommended window</dt>
              <dd>{active.date}</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>
                {active.access} · {active.accessNote}
              </dd>
            </div>
            <div>
              <dt>Commitment</dt>
              <dd>{active.duration}</dd>
            </div>
            <div>
              <dt>Next natural leaving point</dt>
              <dd>{active.leaveAt}</dd>
            </div>
          </dl>
          <div className={styles.actions}>
            <Link href={`/departures/${active.sectionSlug}`}>View this section →</Link>
            <a
              href={`mailto:nerminehammam@gmail.com?subject=${encodeURIComponent(`Sawayatra joining point: ${active.place}`)}`}
            >
              Ask about joining here ↗
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
