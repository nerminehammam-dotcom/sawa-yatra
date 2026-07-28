import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { getAndeanCaravanGallery } from "@/content/andean-caravan-images";
import { contactHref } from "@/lib/contact";

import styles from "./about.module.css";

export const metadata = createPageMetadata("/about");

const fieldImage = getAndeanCaravanGallery("both-shores")[3]!;

const principles = [
  {
    number: "01",
    title: "The route is real work",
    body: "Distances, altitude, borders, ferries and transfer days belong in the story—not in hidden small print.",
  },
  {
    number: "02",
    title: "The caravan stays connected",
    body: "Each section is part of one annual movement through the Andes, even as travellers join and leave.",
  },
  {
    number: "03",
    title: "Places are not decoration",
    body: "The site uses approved factual content and observed photography without reducing a region or culture to a motif.",
  },
  {
    number: "04",
    title: "Clarity is a form of care",
    body: "A complex route should still feel possible to understand, compare and enter.",
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="about-heading">
        <p>About / Sawayatra field document</p>
        <h1 id="about-heading">A travel club with a point of view.</h1>
        <p>
          Sawayatra brings compatible travellers together through shared
          journeys. It begins with the annual Andean Caravan, built around
          designated joining points, practical clarity and the life found
          between destinations.
        </p>
      </section>

      <section className={styles.observation} aria-labelledby="observation-heading">
        <figure>
          <Image
            src={fieldImage.src}
            alt={fieldImage.alt}
            fill
            sizes="(max-width: 800px) 100vw, 58vw"
            style={{
              objectPosition: `${fieldImage.focalPoint?.x ?? 50}% ${fieldImage.focalPoint?.y ?? 50}%`,
            }}
          />
          <figcaption>FIELD NOTE / ALTIPLANO ROAD</figcaption>
        </figure>
        <div>
          <p>Working belief</p>
          <h2>The in-between moments are part of the expedition.</h2>
          <p>
            Roads, weather, roadside meals, border crossings and changes of
            vehicle make a continuous caravan tangible. They are not edited out
            to create a polished travel fantasy.
          </p>
        </div>
      </section>

      <section className={styles.principles} aria-labelledby="principles-heading">
        <header>
          <p>Operating principles / what remains visible</p>
          <h2 id="principles-heading">Practical, authored, alive.</h2>
        </header>
        <ol>
          {principles.map((principle) => (
            <li key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.action} aria-labelledby="about-action-heading">
        <h2 id="about-action-heading">Begin with the first route.</h2>
        <div>
          <Link href="/departures/the-andean-caravan">Explore the Andean Caravan →</Link>
          <Link href={contactHref()}>
            Ask a question ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
