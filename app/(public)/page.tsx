import Image from "next/image";

import { createPageMetadata } from "@/app/_metadata";
import { ButtonLink } from "@/components/ui/ButtonLink";
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

/**
 * Separates the locked name-origin paragraph at its two existing word markers.
 * The copy stays unchanged in content/field-document.ts; only its presentation
 * is rearranged here.
 */
function splitNameOrigin(text: string) {
  const sawaMarker = " Sawa, ";
  const yatraMarker = " Yatra, ";
  const sawaStart = text.indexOf(sawaMarker);
  const yatraStart = text.indexOf(yatraMarker);

  if (sawaStart < 0 || yatraStart <= sawaStart) return null;

  return {
    introduction: text.slice(0, sawaStart),
    sawa: text.slice(sawaStart + sawaMarker.length, yatraStart),
    yatra: text.slice(yatraStart + yatraMarker.length),
  };
}

export default function HomePage() {
  const content = fieldDocumentContent;
  const nameOrigin = splitNameOrigin(content.nameStory.body[1]);

  return (
    <main className={styles.homePage} id="main-content" tabIndex={-1}>
      <section className={styles.homeHero} aria-labelledby="home-heading">
        <Image
          className={styles.homeHeroImage}
          src="/assets/images/departures/andean/gallery/the-end-of-the-road/07-patagoina-01.jpg"
          alt="Quiet road running through open Patagonian grassland beneath a pale blue sky."
          fill
          preload
          sizes="100vw"
        />
        <div className={styles.homeHeroScrim} aria-hidden="true" />

        {/* Stripped to the line alone on 5 August 2026. The tagline and the
            definition paragraph went first (the name story below now says
            both, at length), then the two buttons and the practical link.
            The photograph and the sentence, nothing else. Every way onward is
            in the header and the footer. */}
        <div className={styles.homeHeroCopy}>
          {/* Three spans, one sentence. The text content is unchanged:
              "Go alone, arrive together." The spaces between them are real
              text nodes, so it reads and is announced as one line. */}
          <h1 id="home-heading">
            <span className={styles.homeHeroRoman}>Go alone,</span>{" "}
            <span className={styles.homeHeroTurn}>arrive</span>{" "}
            <span className={styles.homeHeroRoman}>together.</span>
          </h1>
        </div>
      </section>

      <section className={styles.nameStory} aria-label="Sawayatra">
        {/* The tracked label that sat here is gone; the two ways onward take
            its place. They are the only navigation on the homepage outside
            the header and footer. */}
        <div className={styles.nameStoryActions}>
          {content.nameStory.actions.map((action, index) => (
            <ButtonLink
              key={action.href}
              href={action.href}
              variant={index === 0 ? "primary" : "secondary"}
            >
              {action.label}
            </ButtonLink>
          ))}
        </div>

        <p className={styles.nameStoryStatement}>
          {withHighlights(
            content.nameStory.body[0],
            content.nameStory.highlights,
          )}
        </p>

        {nameOrigin ? (
          <div className={styles.nameOrigin}>
            <p className={styles.nameOriginIntroduction}>
              {nameOrigin.introduction}
            </p>
            <div className={styles.nameOriginParts}>
              <article className={styles.nameOriginPart}>
                <p className={styles.nameOriginLanguage}>Arabic</p>
                <h2 className={styles.nameOriginWord}>sawa</h2>
                <p className={styles.nameOriginDefinition}>{nameOrigin.sawa}</p>
              </article>
              <article className={styles.nameOriginPart}>
                <p className={styles.nameOriginLanguage}>Sanskrit</p>
                <h2 className={styles.nameOriginWord}>yatra</h2>
                <p className={styles.nameOriginDefinition}>{nameOrigin.yatra}</p>
              </article>
            </div>
            <p className={styles.nameOriginConclusion}>
              {content.nameStory.body[2]}
            </p>
          </div>
        ) : (
          <div className={styles.nameStoryColumns}>
            {content.nameStory.body.slice(1).map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
