import Image from "next/image";
import type { CSSProperties } from "react";

import { AXES } from "@/content/travel-self/axes";

import styles from "./travel-self.module.css";
import { TravelSelfTiles } from "./TravelSelfTiles";

const INTRO_AXES = [
  { axis: AXES[0], color: "var(--tsi-signal)" },
  { axis: AXES[1], color: "var(--tsi-sun)" },
  { axis: AXES[2], color: "var(--tsi-olive)" },
  { axis: AXES[3], color: "var(--tsi-clay)" },
] as const;

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

      <section
        className={`${styles.introGrid} ${styles.introBand}`}
        aria-labelledby="tsi-asks"
      >
        <h2 id="tsi-asks">What it asks</h2>
        <div className={styles.introAxes}>
          <p className={styles.introAxesLead}>
            Four questions describe how you travel. Four ask what draws you to
            a place. You will land somewhere along each of these — nothing is
            set until you answer.
          </p>

          {INTRO_AXES.map(({ axis, color }) => (
            <div
              className={styles.introAxis}
              key={axis.id}
              style={{ "--tsi-axis": color } as CSSProperties}
            >
              <div className={styles.introPoles}>
                <span>{axis.left.name}</span>
                <span>{axis.right.name}</span>
              </div>
              <div className={styles.introScale} aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => (
                  <i key={index} />
                ))}
              </div>
              <p className={styles.introNote}>{axis.question}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`${styles.introGrid} ${styles.introBand}`}
        aria-labelledby="tsi-back"
      >
        <h2 id="tsi-back">What comes back</h2>
        <div className={styles.introBody}>
          <p>
            Your answers return as a Travel Self: a named portrait of how you
            move through a journey, alongside what draws you to a place.
          </p>
          <p>
            It is a description, not a compatibility score. It cannot tell you
            whether you will like someone.
          </p>
          <p>
            There is no directory of members to browse. You see the comparison,
            not the person, and names stay private until interest runs both
            ways.
          </p>
          <p>
            It changes how every journey on the site reads: where its pace and
            standard sit against your own, and where agreement may be needed.
          </p>
        </div>
      </section>

      <section
        className={`${styles.introGrid} ${styles.introBand}`}
        aria-labelledby="tsi-lives"
      >
        <h2 id="tsi-lives">Where it lives</h2>
        <div className={styles.introBody}>
          <p>
            {PRIVACY_SENTENCE} No account needed. Revise it whenever you like,
            and we will ask you to look at it again once a year — people change
            how they travel.
          </p>
        </div>
      </section>

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
