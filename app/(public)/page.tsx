import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { JoiningPointSelector } from "@/components/field/JoiningPointSelector";
import { RegionalChapter } from "@/components/field/RegionalChapter";
import { RouteIndex } from "@/components/field/RouteIndex";
import { SignalStatement } from "@/components/field/SignalStatement";
import { getAndeanCaravanGallery } from "@/content/andean-caravan-images";
import {
  fieldDocumentContent,
  joiningPoints,
} from "@/content/field-document";

import styles from "./home.module.css";

export const metadata = createPageMetadata("/");

const fieldNotes = [
  getAndeanCaravanGallery("white-city-deep-canyon")[0]!,
  getAndeanCaravanGallery("both-shores")[2]!,
  getAndeanCaravanGallery("the-mirror")[0]!,
  getAndeanCaravanGallery("the-end-of-the-road")[0]!,
];

export default function HomePage() {
  const content = fieldDocumentContent;

  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link
        rel="preconnect"
        href="https://cdn.fontshare.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500&display=swap"
      />
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
            <p>A members’ club that matches travellers by how they travel.</p>
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
              <h3>{step.label.replace("—", " ")}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        </section>

        <section className={styles.route} aria-labelledby="connected-route-heading">
        <header className={styles.routeHeading}>
          <div>
            <p>{content.route.eyebrow}</p>
            <h2 id="connected-route-heading">{content.route.title}</h2>
          </div>
          <aside>
            <strong>Transfer / southern connection</strong>
            <p>{content.route.transfer}</p>
          </aside>
        </header>
        <RouteIndex />
        </section>

        <section className={styles.joining} aria-labelledby="joining-heading">
        <header className={styles.joiningHeading}>
          <p>Joining points / practical heart of the caravan</p>
          <h2 id="joining-heading">Where will you join us?</h2>
          <p>
            Choose a numbered gateway. Dates, access, time on the road and the
            next leaving point stay visible together.
          </p>
        </header>
          <JoiningPointSelector
            points={joiningPoints}
            headingId="joining-heading"
          />
        </section>

        <section className={styles.regions} aria-labelledby="regions-heading">
        <header className={styles.regionsHeading}>
          <p>Regional chapters / one connected geography</p>
          <h2 id="regions-heading">Four rhythms. One long spine.</h2>
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
              <figcaption>FIELD NOTE / {String(index + 1).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>
        </section>

        <section
          className={styles.finalAction}
          aria-labelledby="final-action-heading"
        >
          <p>Final question / joining point selector</p>
          <h2 id="final-action-heading">Where will you join us?</h2>
          <div>
            <Link href="/joining-points">Compare joining points →</Link>
            <Link href="/start-here">Start here ↗</Link>
          </div>
        </section>
      </main>
    </>
  );
}
