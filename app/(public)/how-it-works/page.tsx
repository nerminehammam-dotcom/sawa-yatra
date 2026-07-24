import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { fieldDocumentContent } from "@/content/field-document";

import styles from "./how-it-works.module.css";

export const metadata = createPageMetadata("/how-it-works");

const roadImage = {
  src: "/assets/images/how-it-works/london-0ps.png",
  alt: "A dirt road runs between highland fields and a wall of dark mountains.",
  focalPoint: { x: 28, y: 62 },
} as const;

export default function HowItWorksPage() {
  const content = fieldDocumentContent;

  return (
    <main id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="how-heading">
        <div className={styles.heroTitle}>
          <p>How it works / field guide 01</p>
          <h1 id="how-heading">The caravan moves. You choose your span.</h1>
        </div>
        <figure className={styles.heroImage}>
          <Image
            src={roadImage.src}
            alt={roadImage.alt}
            fill
            priority
            unoptimized
            sizes="(max-width: 800px) 100vw, 48vw"
            style={{
              objectPosition: `${roadImage.focalPoint?.x ?? 50}% ${roadImage.focalPoint?.y ?? 50}%`,
            }}
          />
          <figcaption>ROAD NOTE / CARRETERA AUSTRAL</figcaption>
        </figure>
      </section>

      <section className={styles.proposition} aria-label="Core proposition">
        <p>{content.proposition}</p>
      </section>

      <section className={styles.steps} aria-labelledby="steps-heading">
        <header>
          <p>Three actions / one continuous expedition</p>
          <h2 id="steps-heading">Entry. Movement. Exit.</h2>
        </header>
        <ol>
          {content.how.steps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.label}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.fixedFlexible} aria-labelledby="fixed-heading">
        <header>
          <p>Planning logic / what changes and what does not</p>
          <h2 id="fixed-heading">Fixed route. Flexible participation.</h2>
        </header>
        <dl>
          <div>
            <dt>Fixed</dt>
            <dd>
              The annual departure, connected direction of travel, designated
              joining points and approved transfer logic.
            </dd>
          </div>
          <div>
            <dt>Chosen by you</dt>
            <dd>
              Where you join, how many connected sections you travel and where
              your journey finishes.
            </dd>
          </div>
          <div>
            <dt>Confirmed before travel</dt>
            <dd>
              Exact dates, accommodation, transport details and final transfer
              instructions are supplied from the secured itinerary.
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.transfer} aria-labelledby="transfer-heading">
        <p>Transfer note / the southern connection</p>
        <h2 id="transfer-heading">The road pauses. The route does not.</h2>
        <p>{content.route.transfer}</p>
      </section>

      <section className={styles.actions} aria-labelledby="action-heading">
        <h2 id="action-heading">Choose an entry point.</h2>
        <div>
          <Link href="/joining-points">Compare joining points →</Link>
          <Link href="/caravans/the-andean-caravan">Follow the full route ↗</Link>
        </div>
      </section>
    </main>
  );
}
