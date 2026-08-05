import Image from "next/image";

import { createPageMetadata } from "@/app/_metadata";
import { SignalStatement } from "@/components/field/SignalStatement";
import { fieldDocumentContent } from "@/content/field-document";

import styles from "./home.module.css";

export const metadata = createPageMetadata("/");

export default function HomePage() {
  const content = fieldDocumentContent;

  return (
    <main className={styles.homePage} id="main-content" tabIndex={-1}>
      <section className={styles.homeHero} aria-labelledby="home-heading">
        <Image
          className={styles.homeHeroImage}
          src="/assets/images/home/hero.jpg"
          alt="A quiet road runs through open Patagonian grassland beneath a pale blue sky."
          fill
          preload
          sizes="100vw"
        />
        <div className={styles.homeHeroScrim} aria-hidden="true" />

        {/* Stripped to the line alone on 5 August 2026. The tagline and the
            definition paragraph went first — the name story below now says
            both, at length — and then the two buttons and the practical link.
            The photograph and the sentence, nothing else. Every way onward is
            in the header and the footer. */}
        <div className={styles.homeHeroCopy}>
          <h1 id="home-heading">Go alone, arrive together.</h1>
        </div>
      </section>

      <section className={styles.nameStory} aria-labelledby="name-story-heading">
        <div className={styles.nameStoryLockup}>
          <p className={styles.nameStoryEyebrow}>{content.nameStory.eyebrow}</p>
          <h2 id="name-story-heading">
            {content.nameStory.roots.map((root) => (
              <span key={root.word} className={styles.nameStoryRoot}>
                <span className={styles.nameStoryWord}>{root.word}</span>
                <span className={styles.nameStoryGloss}>
                  <span>{root.origin}</span>
                  {root.gloss}
                </span>
              </span>
            ))}
          </h2>
        </div>
        <div className={styles.nameStoryProse}>
          {content.nameStory.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <SignalStatement>{content.interruption}</SignalStatement>
    </main>
  );
}
