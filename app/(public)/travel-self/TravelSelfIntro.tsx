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
    <div className={styles.travelSelfIntro}>
      <section className={styles.introOpening}>
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
      </section>

      <figure className={styles.introPlate}>
        <Image
          alt="Painted travel poster: a vicuña in dry grass beneath blue and red rock towers, pink cloud across a sage sky, a propeller plane at upper left, and the word Sawayatra set into the cloud"
          className={styles.introArtwork}
          height={1600}
          priority
          sizes="100vw"
          src="/assets/images/travel-self/intro.jpg"
          width={2400}
        />
      </figure>

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
  );
}
