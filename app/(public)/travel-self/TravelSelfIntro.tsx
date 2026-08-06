import Image from "next/image";

import styles from "./travel-self.module.css";

const PRIVACY_SENTENCE =
  "Four minutes. Your answers are saved in this browser when you finish, and they are not sent to Sawayatra.";

function BeginButton() {
  return (
    <button
      className={styles.introBegin}
      data-travel-self-begin
      type="button"
    >
      Find out <span aria-hidden="true">→</span>
    </button>
  );
}

export function TravelSelfIntro() {
  return (
    <div className={styles.travelSelfIntro}>
      <div className={styles.introStraddle}>
        <Image
          alt="Painted travel poster: a vicuña in dry grass beneath blue and red rock towers, pink cloud across a sage sky, a propeller plane at upper left, and the word Sawayatra set into the cloud"
          className={styles.introArtwork}
          height={1280}
          priority
          sizes="(max-width: 900px) 100vw, 64rem"
          src="/assets/images/travel-self/intro.jpg"
          width={1920}
        />
        {/* Two lines, not one: the break is what lets each of them start on
            paper and finish on the painting. */}
        <h1 className={styles.introTitle}>
          <span>Which one</span>
          <span>
            are <i className={styles.introYou}>you</i>?
          </span>
        </h1>
        <p className={styles.introChip}>Travel Self · before you join</p>
      </div>

      <div className={`${styles.introGrid} ${styles.introLede}`}>
        {/* Was "…reveal which — through how you travel and what you travel
            for." The em dash carried the sentence, so removing it needed a
            rewrite rather than a comma. Same claim, same length, two clauses
            instead of an aside. */}
        <p className={styles.introStandfirst}>
          One of sixteen travelling selves. Eight short questions reveal which
          one is yours: how you travel, and what you travel for.
        </p>

        <div className={styles.introAct}>
          <BeginButton />
          <p className={styles.introReassure}>{PRIVACY_SENTENCE}</p>
        </div>
      </div>

      <div className={`${styles.introGrid} ${styles.introClosing}`}>
        <p className={styles.introBoundary}>
          <span>
            You can read every route on this site without answering a single
            question.
          </span>
          <span>This is only for when you want to join one.</span>
        </p>
      </div>
    </div>
  );
}
