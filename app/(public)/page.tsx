import Image from "next/image";

import { createPageMetadata } from "@/app/_metadata";
import { fieldDocumentContent } from "@/content/field-document";

import styles from "./home.module.css";

export const metadata = createPageMetadata("/");

/**
 * Wraps the given phrases in <mark> without altering a character of the copy.
 * Each phrase must occur exactly once in the text; anything not found is
 * skipped rather than approximated.
 */
function withHighlights(text: string, phrases: readonly string[]) {
  const pattern = phrases
    .filter((phrase) => text.includes(phrase))
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  if (!pattern) {
    return text;
  }

  return text
    .split(new RegExp(`(${pattern})`))
    .map((part, index) =>
      phrases.includes(part) ? (
        <mark key={`${part}-${index}`}>{part}</mark>
      ) : (
        part
      ),
    );
}

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
          {/* Three spans, one sentence. The text content is unchanged —
              "Go alone, arrive together." — and the spaces between them are
              real text nodes, so it reads and is announced as one line. */}
          <h1 id="home-heading">
            <span className={styles.homeHeroRoman}>Go alone,</span>{" "}
            <span className={styles.homeHeroTurn}>arrive</span>{" "}
            <span className={styles.homeHeroRoman}>together.</span>
          </h1>
        </div>
      </section>

      <section className={styles.nameStory} aria-labelledby="name-heading">
        <p className={styles.nameStoryLabel} id="name-heading">
          {content.nameStory.label}
        </p>

        <p className={styles.nameStoryStatement}>
          {withHighlights(
            content.nameStory.body[0],
            content.nameStory.highlights,
          )}
        </p>

        <div className={styles.nameStoryColumns}>
          {content.nameStory.body.slice(1).map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
