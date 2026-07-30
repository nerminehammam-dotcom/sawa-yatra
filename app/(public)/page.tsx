import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { RegionalChapter } from "@/components/field/RegionalChapter";
import { SignalStatement } from "@/components/field/SignalStatement";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getAndeanCaravanGallery } from "@/content/andean-caravan-images";
import {
  fieldDocumentContent,
  reservedHomeSections,
} from "@/content/field-document";
import { contactHref } from "@/lib/contact";

import styles from "./home.module.css";

export const metadata = createPageMetadata("/");

const fieldNotes = [
  getAndeanCaravanGallery("white-city-deep-canyon")[0]!,
  getAndeanCaravanGallery("both-shores")[2]!,
  getAndeanCaravanGallery("the-mirror")[0]!,
  getAndeanCaravanGallery("the-end-of-the-road")[0]!,
];

// Sections that are designed but awaiting founder-approved copy are shown while
// developing so the gap stays visible, and omitted from the published page.
const showReserved = process.env.NODE_ENV !== "production";

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

        <div className={styles.homeHeroCopy}>
          <h1 id="home-heading">Go alone, arrive together.</h1>
          <p className={styles.homeHeroTagline}>
            A members’ club that matches travellers by how they travel.
          </p>
          <p className={styles.homeHeroDefinition}>
            Sawayatra is a members’ travel club that brings compatible
            travellers together through shared journeys, beginning with the
            annual Andean Caravan.
          </p>
          <div className={styles.homeHeroActions}>
            <ButtonLink
              className={styles.homeHeroPrimaryAction}
              href="/how-it-works"
              surface="deep"
            >
              See how Sawayatra works
            </ButtonLink>
            <ButtonLink
              className={styles.homeHeroSecondaryAction}
              href="/caravans/andean"
              surface="deep"
              variant="secondary"
            >
              Explore the Andean Caravan
            </ButtonLink>
          </div>
          <Link
            className={styles.homeHeroPracticalLink}
            href="/caravans/andean#honest-conditions-heading"
          >
            Altitude, physical demands and accommodation
          </Link>
        </div>
      </section>

      <SignalStatement>{content.interruption}</SignalStatement>

      <section className={styles.how} aria-labelledby="how-caravan-heading">
        <header className={styles.editorialHeading}>
          <p>{content.how.eyebrow}</p>
          <h2 id="how-caravan-heading">{content.how.title}</h2>
          <Link href="/how-it-works">Read the practical guide →</Link>
        </header>
        <ol className={styles.howSteps}>
          {content.how.steps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.label.replace("\u2014", " ")}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={styles.travelSelf}
        aria-labelledby="travel-self-heading"
      >
        <div className={styles.travelSelfCopy}>
          <p>{content.travelSelf.eyebrow}</p>
          <h2 id="travel-self-heading">{content.travelSelf.title}</h2>
          <p className={styles.travelSelfBody}>{content.travelSelf.body}</p>
          <ButtonLink href={content.travelSelf.actionHref}>
            {content.travelSelf.actionLabel} →
          </ButtonLink>
          <p className={styles.travelSelfNote}>{content.travelSelf.note}</p>
        </div>
        <div className={styles.travelSelfFigure}>
          <Image
            src="/assets/images/travel-self/intro.jpg"
            alt="A painted Andean landscape with the word Sawayatra formed in the clouds above a mountain range."
            fill
            sizes="(max-width: 1023px) 100vw, 52vw"
          />
        </div>
      </section>

      <section className={styles.regions} aria-labelledby="regions-heading">
        <header className={styles.regionsHeading}>
          <p>{content.route.eyebrow}</p>
          <h2 id="regions-heading">{content.route.title}</h2>
          <Link href="/caravans/andean">
            See the nine sections and their dates →
          </Link>
        </header>
        {content.regionalChapters.map((chapter) => (
          <RegionalChapter key={chapter.id} {...chapter} />
        ))}
      </section>

      <section
        className={styles.fieldNotes}
        aria-labelledby="field-notes-heading"
      >
        <header>
          <p>Human proof / field notes</p>
          <h2 id="field-notes-heading">The road is made of details.</h2>
        </header>
        <div
          className={styles.imageStrip}
          aria-label="Photographs from the Andean Caravan route"
          tabIndex={0}
        >
          {fieldNotes.map((image, index) => (
            <figure key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 72vw, 28vw"
                style={{
                  objectPosition: `${image.focalPoint?.x ?? 50}% ${image.focalPoint?.y ?? 50}%`,
                }}
              />
              <figcaption>
                FIELD NOTE / {String(index + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {showReserved && reservedHomeSections.length > 0 ? (
        <section className={styles.reserved} aria-label="Sections awaiting copy">
          {reservedHomeSections.map((section) => (
            <article key={section.id}>
              <p>{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              <p className={styles.reservedNeeds}>Needs: {section.needs}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section
        className={styles.finalAction}
        aria-labelledby="final-action-heading"
      >
        <p>Final question / joining point selector</p>
        <h2 id="final-action-heading">Where will you join us?</h2>
        <div>
          <Link href="/register-interest">Register your interest →</Link>
          <Link href="/caravans/andean-caravan/how-it-works">
            Compare joining points
          </Link>
          <Link href={contactHref("Joining points")}>Ask a question ↗</Link>
        </div>
      </section>
    </main>
  );
}
