"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { JoiningPointRecord } from "@/content/field-document";
import { contactHref } from "@/lib/contact";

import styles from "./JoiningPointSelector.module.css";
import { Arrow } from "@/components/ui/Arrow";

export function JoiningPointSelector({
  points,
  headingId,
}: {
  points: readonly JoiningPointRecord[];
  headingId: string;
}) {
  const [activeId, setActiveId] = useState(points[0]?.id ?? "");
  const pointButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const hasSelectedPoint = useRef(false);
  const active = points.find((point) => point.id === activeId) ?? points[0];
  const activeIndex = active
    ? points.findIndex((point) => point.id === active.id)
    : -1;

  useEffect(() => {
    if (!active || !hasSelectedPoint.current) return;

    pointButtonRefs.current.get(active.id)?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  if (!active) return null;

  const selectedPosition = activeIndex + 1;
  const totalPoints = points.length;
  const detailId = `${headingId}-selected-point`;
  const detailHeadingId = `${detailId}-heading`;

  function selectPoint(index: number) {
    const point = points[index];
    if (!point) return;

    hasSelectedPoint.current = true;
    setActiveId(point.id);
  }

  return (
    <div className={styles.root} aria-labelledby={headingId}>
      <div className={styles.controls}>
        <div className={styles.position} aria-live="polite" aria-atomic="true">
          <p>
            Joining point <strong>{selectedPosition}</strong> of{" "}
            <strong>{totalPoints}</strong>
          </p>
          <span>{active.place}</span>
        </div>
        <div className={styles.navigation} aria-label="Joining point navigation">
          <button
            type="button"
            disabled={activeIndex === 0}
            aria-controls={detailId}
            onClick={() => selectPoint(activeIndex - 1)}
          >
            <Arrow direction="left" /> Previous
          </button>
          <button
            type="button"
            disabled={activeIndex === totalPoints - 1}
            aria-controls={detailId}
            onClick={() => selectPoint(activeIndex + 1)}
          >
            Next <Arrow />
          </button>
        </div>
        <p className={styles.railHint}>
          More choices continue horizontally. Swipe, scroll, or use Previous and
          Next.
        </p>
      </div>
      <div className={styles.index} aria-label="Choose a joining point">
        {points.map((point, index) => (
          <button
            className={styles.indexButton}
            data-active={point.id === active.id}
            key={point.id}
            type="button"
            ref={(node) => {
              if (node) pointButtonRefs.current.set(point.id, node);
              else pointButtonRefs.current.delete(point.id);
            }}
            aria-pressed={point.id === active.id}
            aria-controls={detailId}
            aria-label={`${point.place}, joining point ${index + 1} of ${totalPoints}`}
            onClick={() => selectPoint(index)}
          >
            <span>{point.number}</span>
            <strong>{point.place}</strong>
            <small>{point.duration}</small>
          </button>
        ))}
      </div>

      <article
        className={styles.detail}
        id={detailId}
        key={active.id}
        aria-labelledby={detailHeadingId}
      >
        <figure className={styles.image}>
          <Image
            src={active.image.src}
            alt={active.image.alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1440px) 55vw, 792px"
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
            {/* Was an h3, and this component sits directly under the page h1
                on /joining-points, so the level was skipped. It is the only
                consumer, so h2 is correct everywhere it renders. */}
            <h2 id={detailHeadingId}>{active.place}</h2>
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
            <Link href={`/departures/${active.sectionSlug}`}>View this section <Arrow /></Link>
            <Link href={contactHref(`Joining point: ${active.place}`)}>
              Ask about joining here <Arrow direction="up-right" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
