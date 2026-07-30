"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  BOUNDARY_PERSONAL,
  CHANGE_LATER,
  GUEST_BAND,
  PASSPORT_LABELS,
  SAVE,
  SEEKER_PLATE,
} from "@/content/travel-self/travel-self-model";
import type { TravelSelfResultV23 } from "@/lib/travel-self/scoring-v23";

import styles from "./travel-self.module.css";

export function TravelSelfPassport({
  result,
  onChangeAnswer,
}: {
  result: TravelSelfResultV23;
  onChangeAnswer: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [saveNotice, setSaveNotice] = useState("");
  const isSeeker = result.name === "The Seeker";

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section
      className={styles.passportStage}
      aria-labelledby="travel-self-passport-name"
    >
      <div className={styles.passportWrap}>
        <article className={styles.passportCard}>
          <header className={styles.passportHead}>
            <p>{PASSPORT_LABELS.kicker}</p>
            <h1
              ref={headingRef}
              id="travel-self-passport-name"
              tabIndex={-1}
            >
              {result.name}
            </h1>
            <p className={styles.passportReadout}>{result.readout}</p>
          </header>

          {isSeeker ? (
            <div className={styles.passportPlate}>
              <Image
                alt={SEEKER_PLATE.alt}
                className={styles.passportPlateImage}
                height={1344}
                preload
                sizes="(max-width: 768px) 100vw, 48rem"
                src={SEEKER_PLATE.src}
                width={896}
              />
            </div>
          ) : null}

          <p className={styles.passportGuestBand}>{GUEST_BAND}</p>

          <div className={styles.passportBody}>
            <dl>
              <div>
                <dt>{PASSPORT_LABELS.essence}</dt>
                <dd>{result.essence}</dd>
              </div>
              <div>
                <dt>{PASSPORT_LABELS.bring}</dt>
                <dd>{result.bring}</dd>
              </div>
              <div>
                <dt>{PASSPORT_LABELS.travelFor}</dt>
                <dd>{result.travelFor}</dd>
              </div>
              <div>
                <dt>{PASSPORT_LABELS.comfort}</dt>
                <dd>{result.comfort}</dd>
              </div>
              <div>
                <dt>{PASSPORT_LABELS.timeTogether}</dt>
                <dd>{result.timeTogether}</dd>
              </div>
              <div>
                <dt>{PASSPORT_LABELS.bendOn}</dt>
                <dd>{result.bendOn}</dd>
              </div>
            </dl>
          </div>

          <dl className={styles.passportFriction}>
            <dt>{PASSPORT_LABELS.feelItWhen}</dt>
            <dd>{result.feelItWhen}</dd>
          </dl>
        </article>

        <div className={styles.passportOutside}>
          <p className={styles.passportBoundary}>{BOUNDARY_PERSONAL}</p>
          <p className={styles.passportChange}>{CHANGE_LATER}</p>
          <div className={styles.passportActions}>
            <button
              className={`${styles.qButton} ${styles.qNext}`}
              type="button"
              onClick={() => setSaveNotice(SAVE.signInPrompt)}
            >
              {SAVE.action}
            </button>
            <button
              className={styles.qButton}
              type="button"
              onClick={onChangeAnswer}
            >
              {SAVE.changeAnswer}
            </button>
          </div>
          <p className={styles.passportSaveNotice} role="status">{saveNotice}</p>
        </div>
      </div>
    </section>
  );
}
