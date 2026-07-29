import Image from "next/image";

import styles from "./travel-self.module.css";
import { TravelSelfTiles } from "./TravelSelfTiles";

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
      <div className={`${styles.introGrid} ${styles.introHead}`}>
        <h1>
          Which one are <span className={styles.introYou}>you</span>?
        </h1>
        <p className={styles.introStandfirst}>
          One of sixteen travelling selves. Eight short questions reveal which
          — through how you travel and what you travel for.
        </p>
      </div>

      <div className={styles.introPlate}>
        <Image
          alt="Painted travel poster: a vicuña in dry grass beneath blue and red rock towers, pink cloud across a sage sky, a propeller plane at upper left, and the word Sawayatra set into the cloud"
          className={styles.introArtwork}
          height={1280}
          priority
          sizes="(max-width: 1200px) 92vw, 72rem"
          src="/assets/images/travel-self/intro.jpg"
          width={1920}
        />
        <p className={styles.introChip}>Travel Self · before you join</p>
      </div>

      <div className={`${styles.introGrid} ${styles.introLede}`}>
        <div className={styles.introOdds}>
          <TravelSelfTiles />
          <p>
            Sixteen travelling selves. One of them is already yours — you just
            haven&apos;t been told which.
          </p>
        </div>

        <div className={styles.introAct}>
          <BeginButton />
          <p className={styles.introReassure}>{PRIVACY_SENTENCE}</p>
        </div>
      </div>

      <div className={`${styles.introGrid} ${styles.introClosing}`}>
        <p className={styles.introBoundary}>
          You can read every route on this site without answering a single
          question. This is only for when you want to join one.
        </p>
        <div className={styles.introAct}>
          <BeginButton />
        </div>
      </div>
    </div>
  );
}
