import Image from "next/image";

import { createPageMetadata } from "@/app/_metadata";
import { Arrow } from "@/components/ui/Arrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { homeCarreteraHeroImage } from "@/content/andean-caravan-images";

import styles from "./home.module.css";
import howItWorksStyles from "./how-it-works/how-it-works.module.css";

export const metadata = createPageMetadata("/");

export default function HomePage() {
  return (
    <main className={styles.homePage} id="main-content" tabIndex={-1}>
      <section className={styles.homeHero} aria-labelledby="home-heading">
        <Image
          className={styles.homeHeroImage}
          src={homeCarreteraHeroImage.src}
          alt={homeCarreteraHeroImage.alt}
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

      <section className={styles.howSteps} aria-labelledby="home-how-heading">
        <header className={styles.howStepsHeader}>
          <h2 id="home-how-heading">The people are the journey.</h2>
        </header>
        <ButtonLink href="/how-it-works" variant="secondary">
          Read how it works
        </ButtonLink>
      </section>

      <section
        className={howItWorksStyles.ways}
        aria-labelledby="ways-heading"
      >
        <header className={howItWorksStyles.sectionHeader}>
          <p className={howItWorksStyles.kicker}>Choose your way in</p>
          <h2 id="ways-heading">Three ways to travel</h2>
        </header>

        <article className={howItWorksStyles.featuredJourney}>
          <div className={howItWorksStyles.featuredImage}>
            <Image
              src="/assets/images/departures/andean/gallery/the-end-of-the-road/09-patagonia-41.jpg"
              alt="Broad Patagonian lake lying beneath a distant ridge of snow-covered mountains."
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1440px) 92vw, 1325px"
            />
          </div>
          <div className={howItWorksStyles.featuredCopy}>
            <h3>
              Caravans
              <span className={howItWorksStyles.featuredTitleDetail}>
                join and leave by section
              </span>
            </h3>
            <p className={howItWorksStyles.panelSummary}>
              One long overland route, travelled together. Join for a single
              section, combine several, or ride the whole 71-day road. One
              departure a year.
            </p>
            <ButtonLink
              className={howItWorksStyles.featuredAction}
              href="/journeys/caravans/andean-caravan"
              surface="deep"
            >
              Explore the Andean Caravan <Arrow />
            </ButtonLink>
          </div>
        </article>

        <div className={howItWorksStyles.secondaryWays}>
          <article
            className={`${howItWorksStyles.wayCard} ${howItWorksStyles.joinCard}`}
          >
            <div className={howItWorksStyles.wayImage}>
              <Image
                src="/assets/images/departures/andean/gallery/white-city-deep-canyon/05-london-0ps.jpg"
                alt="Pale road crossing cultivated Andean fields beneath dark mountains and gathering clouds."
                fill
                sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 58vw, 835px"
              />
            </div>
            <div className={howItWorksStyles.wayCopy}>
              <p className={howItWorksStyles.cardLabel}>Coming later</p>
              <h3>Join a journey with others</h3>
              <p className={howItWorksStyles.panelSummary}>
                Shorter journeys, one country at a time, discovered and joined
                with other members. In development now, opening after the
                Caravan.
              </p>
              <ButtonLink href="/journeys/join" surface="deep">
                See what&apos;s coming <Arrow />
              </ButtonLink>
            </div>
          </article>

          <article className={howItWorksStyles.wayCard}>
            <div
              className={`${howItWorksStyles.wayImage} ${howItWorksStyles.atacamaImage}`}
            >
              <Image
                src="/assets/images/departures/andean/gallery/atacama/01-astro-01.jpg"
                alt="Stars fill the night sky above rock formations in the Atacama Desert."
                fill
                sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 58vw, 835px"
              />
            </div>
            <div className={howItWorksStyles.wayCopy}>
              <p className={howItWorksStyles.cardLabel}>Coming later</p>
              <h3>Create your own</h3>
              <p className={howItWorksStyles.panelSummary}>
                A later way for members to propose a destination, dates and
                travel style, then invite compatible members to join.
              </p>
              <div className={howItWorksStyles.cardActionGroup}>
                <ButtonLink href="/journeys/create" surface="deep">
                  Register your interest <Arrow />
                </ButtonLink>
                <p className={howItWorksStyles.requirement}>
                  Not yet available.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.nameStory} aria-labelledby="name-heading">
        <div className={styles.nameStoryInner}>
          <h2 className={styles.nameStoryHeading} id="name-heading">
            The name
          </h2>

          <div className={styles.nameStoryOrigins}>
            <article className={styles.nameStoryOrigin}>
              <p className={styles.nameStoryLanguage}>Arabic</p>
              <h3 className={styles.nameStoryWord}>sawa</h3>
              <p className={styles.nameStoryDefinition}>
                Together - rooted in an old word for harmony, alignment, and
                making things level.
              </p>
            </article>

            <article className={styles.nameStoryOrigin}>
              <p className={styles.nameStoryLanguage}>Sanskrit</p>
              <h3 className={styles.nameStoryWord}>yatra</h3>
              <p className={styles.nameStoryDefinition}>
                Journey - once a pilgrimage of purpose, now any voyage of
                discovery.
              </p>
            </article>
          </div>

          <blockquote className={styles.nameStoryQuote}>
            <p>
              The most meaningful journeys aren’t simply shared - they’re
              shared with people who move through the world much the way we do.
            </p>
          </blockquote>
        </div>
      </section>
    </main>
  );
}
