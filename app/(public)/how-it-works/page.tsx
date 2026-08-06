import Image from "next/image";

import { createPageMetadata } from "@/app/_metadata";
import { ButtonLink } from "@/components/ui/ButtonLink";

import styles from "./how-it-works.module.css";

export const metadata = createPageMetadata("/how-it-works");

const participationStates = [
  "Interest sent",
  "Awaiting response",
  "Interest accepted",
  "Introduction opened",
  "Not moving forward",
] as const;

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
              sizes="(max-width: 767px) 100vw, 92vw"
            />
          </div>
          <div className={styles.featuredCopy}>
            <h3>Caravan</h3>
            <p className={styles.panelSummary}>
              Join one section, combine several, or travel until the road ends.
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
                sizes="(max-width: 1023px) 100vw, 58vw"
              />
            </div>
            <div className={styles.wayCopy}>
              <h3>Join a Journey</h3>
              <p className={styles.panelSummary}>
                Available now: the Andean Caravan, with nine consecutive
                sections and one complete route.
              </p>
              <ButtonLink href="/caravans/andean" surface="deep">
                Browse available journeys <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>
          </article>

          <article className={styles.wayCard}>
            <div className={`${styles.wayImage} ${styles.atacamaImage}`}>
              <Image
                src="/assets/images/departures/andean/gallery/atacama/01-astro-01.jpg"
                alt="Stars fill the night sky above rock formations in the Atacama Desert."
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
              />
            </div>
            <div className={styles.wayCopy}>
              <p className={styles.cardLabel}>Future membership pathway</p>
              <h3>Create Your Own</h3>
              <p className={styles.panelSummary}>
                A later way for members to propose a destination, dates and
                travel style, then invite compatible members to join.
              </p>
              <div className={styles.cardActionGroup}>
                <ButtonLink
                  href="/request-invitation?intent=create-journey&amp;returnTo=%2Fdo-it-yourself"
                  surface="deep"
                >
                  Ask about future access <span aria-hidden="true">→</span>
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
          <ButtonLink href="/request-invitation?intent=create-travel-self&amp;returnTo=%2Ftravel-self">
            Create Your Travel Self <span aria-hidden="true">→</span>
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

        <div className={styles.interestStates}>
          <p className={styles.stateLabel}>Planned interest states</p>
          <ul>
            {participationStates.map((state) => (
              <li key={state}>{state}</li>
            ))}
          </ul>
        </div>
      </section>

    </main>
  );
}
