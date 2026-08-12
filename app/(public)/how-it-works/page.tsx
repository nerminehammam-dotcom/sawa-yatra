import Image from "next/image";

import { createPageMetadata } from "@/app/_metadata";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  HOW_IT_WORKS_REASONS,
  HOW_IT_WORKS_STEPS,
} from "@/content/how-it-works-v24";

import styles from "./how-it-works.module.css";

export const metadata = createPageMetadata("/how-it-works");

export default function HowItWorksPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="how-heading">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>How Sawayatra works</p>
          <h1 id="how-heading">How Sawayatra works</h1>
          <p className={styles.openingLine}>
            Sawayatra is a members&apos; travel club. You join it before you know
            where you&apos;re going.
          </p>
          <p>
            Most group travel sells you a date and hands you a set of strangers
            on the first morning. We think the people are the journey, not an
            accident of who booked the same week.
          </p>
          <p>So the order is different here.</p>
        </div>
        <figure className={styles.heroImage}>
          <Image
            src="/assets/images/how-it-works/masthead.jpg"
            alt="Painted Sawayatra travel poster over an Andean valley beneath tall clouds and a red sun."
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
            preload
          />
        </figure>
      </section>

      <section className={styles.v24Steps} aria-label="The six steps">
        <ol>
          {HOW_IT_WORKS_STEPS.map((step) => (
            <li key={step.number}>
              <header>
                <span>{step.number}</span>
                <h2>{step.title}</h2>
              </header>
              <div>
                {step.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.v24Reasons} aria-labelledby="reasons-heading">
        <header>
          <p className={styles.kicker}>The arrangement</p>
          <h2 id="reasons-heading">Why it works this way</h2>
        </header>
        <div>
          {HOW_IT_WORKS_REASONS.map((reason) => (
            <p key={reason.title}>
              <strong>{reason.title}</strong> {reason.body}
            </p>
          ))}
        </div>
      </section>

      <section className={styles.v24Closing} aria-label="Where to begin">
        <p>Start with the questionnaire. It&apos;s free and asks nothing of you.</p>
        <ButtonLink href="/travel-self/take">Meet your travel self</ButtonLink>
        <p>Or read the journeys first.</p>
        <ButtonLink href="/journeys" variant="secondary">The journeys</ButtonLink>
      </section>
    </main>
  );
}
