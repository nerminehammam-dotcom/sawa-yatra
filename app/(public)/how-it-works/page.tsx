import Image from "next/image";

import { createPageMetadata } from "@/app/_metadata";
import { ButtonLink } from "@/components/ui/ButtonLink";

import styles from "./how-it-works.module.css";

export const metadata = createPageMetadata("/how-it-works");

const consentSteps = [
  "Find a journey",
  "Express interest privately",
  "Both members opt in",
  "Connect and plan",
] as const;

export default function HowItWorksPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      {/* 1. Opening */}
      <section className={styles.opening} aria-labelledby="how-heading">
        <div className={styles.openingInner}>
          <p className={styles.kicker}>A simple arrangement</p>
          <h1 id="how-heading">How Sawayatra works</h1>
          <p className={styles.openingLine}>
            Browse the Andean Caravan openly. Connect privately. Nothing is
            revealed until the interest is mutual.
          </p>
        </div>
      </section>

      {/* 2. Three ways to travel */}
      <section className={styles.ways} aria-labelledby="ways-heading">
        <header className={styles.sectionHeader}>
          <p className={styles.kicker}>Choose your way in</p>
          <h2 id="ways-heading">Three ways to travel</h2>
        </header>

        <article className={styles.featuredJourney}>
          <div className={styles.featuredImage}>
            <Image
              src="/assets/images/departures/andean/gallery/the-end-of-the-road/09-patagonia-41.jpg"
              alt="A broad Patagonian lake lies beneath a distant ridge of snow-covered mountains."
              fill
              priority
              sizes="(max-width: 767px) 100vw, (max-width: 1440px) 92vw, 1325px"
            />
          </div>
          <div className={styles.featuredCopy}>
            <p className={styles.cardLabel}>Open for interest</p>
            <h3>Caravan — hop on, hop off</h3>
            <p className={styles.panelSummary}>
              One long overland route, travelled together. Join for a single
              section, combine several, or ride the whole 71-day road. One
              departure a year.
            </p>
            <ButtonLink
              className={styles.featuredAction}
              href="/caravans/andean"
              surface="deep"
            >
              Explore the Andean Caravan <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </article>

        <div className={styles.secondaryWays}>
          <article className={`${styles.wayCard} ${styles.joinCard}`}>
            <div className={styles.wayImage}>
              <Image
                src="/assets/images/departures/andean/gallery/white-city-deep-canyon/05-london-0ps.jpg"
                alt="A pale road crosses cultivated Andean fields beneath dark mountains and gathering clouds."
                fill
                loading="eager"
                sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 58vw, 835px"
              />
            </div>
            <div className={styles.wayCopy}>
              <p className={styles.cardLabel}>Coming later</p>
              <h3>Join a journey with others</h3>
              <p className={styles.panelSummary}>
                Shorter journeys, one country at a time, discovered and joined
                with other members. In development now, opening after the
                Caravan.
              </p>
              <ButtonLink href="/journeys" surface="deep">
                See what&apos;s coming <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>
          </article>

          <article className={styles.wayCard}>
            <div className={`${styles.wayImage} ${styles.atacamaImage}`}>
              <Image
                src="/assets/images/departures/andean/gallery/atacama/01-astro-01.jpg"
                alt="Stars fill the night sky above rock formations in the Atacama Desert."
                fill
                sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 58vw, 835px"
              />
            </div>
            <div className={styles.wayCopy}>
              <p className={styles.cardLabel}>Coming later</p>
              <h3>Create your own</h3>
              <p className={styles.panelSummary}>
                A later way for members to propose a destination, dates and
                travel style, then invite compatible members to join.
              </p>
              <div className={styles.cardActionGroup}>
                <ButtonLink href="/register-interest" surface="deep">
                  Register your interest <span aria-hidden="true">→</span>
                </ButtonLink>
                <p className={styles.requirement}>Not yet available.</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Meet Your Travel Self */}
      <section className={styles.travelSelf} aria-labelledby="travel-self-heading">
        <div className={styles.travelSelfHeading}>
          <p className={styles.kicker}>Before you participate</p>
          <h2 id="travel-self-heading">Meet Your Travel Self</h2>
        </div>
        <div className={styles.travelSelfCopy}>
          <p className={styles.largeBody}>
            When you are ready to join, create or express interest in a journey,
            begin by telling us how you travel.
          </p>
          <p>
            Your Travel Self captures your pace, preferences, independence,
            comfort and interests. It helps Sawayatra suggest journeys and
            travelling companions that are more likely to suit you.
          </p>
          <ButtonLink href="/travel-self">
            Meet your Travel Self <span aria-hidden="true">→</span>
          </ButtonLink>
          <p className={styles.note}>
            You can explore freely. A completed Travel Self is required only when
            you want to participate.
          </p>
        </div>
      </section>

      {/* 4. Privacy and mutual consent */}
      <section className={styles.privacy} aria-labelledby="privacy-heading">
        <header className={styles.privacyHeader}>
          <p className={styles.kicker}>Future member-created journeys</p>
          <h2 id="privacy-heading">Your interest remains private</h2>
        </header>

        <div className={styles.privacyCopy}>
          <blockquote>“People don&apos;t browse people. They browse journeys.”</blockquote>
          <p>
            When this membership pathway opens, another member will be able to
            review your Travel Self without receiving your private identity or
            contact details. If both of you choose to connect, Sawayatra will
            open an introduction.
          </p>
        </div>

        <ol className={styles.consentSequence} aria-label="How a private connection opens">
          {consentSteps.map((step) => (
            <li key={step}>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

    </main>
  );
}
