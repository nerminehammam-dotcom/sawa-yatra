import Image from "next/image";

import styles from "./travel-self.module.css";
import { Arrow } from "@/components/ui/Arrow";

function BeginButton() {
  return (
    <button
      className={styles.introBegin}
      data-travel-self-begin
      type="button"
    >
      Find out <Arrow />
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
        <p className={styles.introKicker}>Before you join</p>
        <h1 className={styles.introTitle}>
          Who are <i className={styles.introYou}>you</i> when you travel?
        </h1>
        <p className={styles.introStandfirst}>
          Not at work. Not at home. The version of you that comes alive when
          the world opens up. Answer a few simple questions to uncover your
          unique Travel Self and begin meeting travelers whose journeys
          naturally align with your own.
        </p>
        <BeginButton />
      </div>

      <figure className={styles.introPlate}>
        <Image
          alt="Painted travel poster: a vicuña in dry grass beneath blue and red rock towers, pink cloud across a sage sky, a propeller plane at upper left, and the word Sawayatra set into the cloud"
          className={styles.introArtwork}
          fill
          preload
          sizes="(max-width: 767px) 100vw, (max-width: 1440px) 52vw, 749px"
          src="/assets/images/travel-self/intro-sawayatra.jpg"
        />
      </figure>
    </div>
  );
}
