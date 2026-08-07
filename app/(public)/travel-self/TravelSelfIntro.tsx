import Image from "next/image";

import { TRAVEL_SELF_COPY } from "@/content/travel-self/copy";

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
    // Split hero, built to read as one system with the Caravans hero: the copy
    // sits in a coloured column on the left and the painting fills a column on
    // the right, rather than the picture dropping full-bleed beneath the text.
    <div className={styles.travelSelfIntro}>
      <div className={styles.introCopy}>
        <div className={styles.introOpeningInner}>
          <p className={styles.introKicker}>Before you join</p>
          <h1 className={styles.introTitle}>
            Which one are <i className={styles.introYou}>you</i>?
          </h1>
          {/* Was "…reveal which — through how you travel and what you travel
              for." The em dash carried the sentence, so removing it needed a
              rewrite rather than a comma. Same claim, same length, two clauses
              instead of an aside. */}
          <p className={styles.introStandfirst}>
            One of sixteen travelling selves. Eight short questions reveal
            which one is yours: how you travel, and what you travel for.
          </p>
          <p className={styles.introBoundary}>
            <span>
              You can read every route on this site without answering a single
              question.
            </span>
            <span>This is only for when you want to join one.</span>
          </p>
        </div>

        <div className={styles.introAct}>
          <BeginButton />
          <div className={styles.introAssurances}>
            <p className={styles.introReassure}>{PRIVACY_SENTENCE}</p>
            {/* The boundary belongs on the landing screen, before "Find out →",
                because the headline ("Which one are you?") reads as a personality
                test until this qualifies it. Same words the questionnaire already
                carries in TRAVEL_SELF_COPY.boundary — just surfaced earlier. */}
            <p className={styles.introReassure}>{TRAVEL_SELF_COPY.boundary}</p>
          </div>
        </div>
      </div>

      <figure className={styles.introPlate}>
        <Image
          alt="Painted travel poster: a vicuña in dry grass beneath blue and red rock towers, pink cloud across a sage sky, a propeller plane at upper left, and the word Sawayatra set into the cloud"
          className={styles.introArtwork}
          fill
          priority
          sizes="(max-width: 899px) 100vw, (max-width: 1440px) 52vw, 749px"
          src="/assets/images/travel-self/intro-sawayatra.jpg"
        />
      </figure>
    </div>
  );
}
