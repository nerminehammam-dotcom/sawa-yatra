import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { homeCarreteraHeroImage } from "@/content/andean-caravan-images";
import { whatSawayatraIs } from "@/content/club-first";

import styles from "./home.module.css";

export const metadata = createPageMetadata("/");

export default function HomePage() {
  return (
    <main className={styles.homePage} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="home-heading">
        <Image
          className={styles.heroImage}
          src={homeCarreteraHeroImage.src}
          alt={homeCarreteraHeroImage.alt}
          fill
          preload
          sizes="100vw"
        />
        <div className={styles.heroScrim} aria-hidden="true" />

        <div className={`${styles.wrap} ${styles.heroInner}`}>
          <p className={`${styles.eyebrow} ${styles.eyebrowOnDark}`}>
            A members&apos; club for long overland journeys
          </p>
          <h1 id="home-heading">
            Go alone, <em>arrive</em> together.
          </h1>
          <div className={styles.actions}>
            <Link
              className={`${styles.button} ${styles.buttonPale}`}
              href="/request-invitation"
            >
              Request an invitation
            </Link>
            <Link
              className={`${styles.textLink} ${styles.textLinkOnDark}`}
              href="/how-it-works"
            >
              Read how it works
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.clubIntroBand}`}>
        <div className={`${styles.wrap} ${styles.clubIntroGrid}`}>
          <header>
            <p className={styles.eyebrow}>What Sawayatra is</p>
            <h2>A members&apos; club before it is a journey.</h2>
          </header>
          <div className={styles.editorialCopy}>
            <p>{whatSawayatraIs.definition}</p>
            <p>{whatSawayatraIs.reason}</p>
            <p className={styles.statusNote}>{whatSawayatraIs.currentStatus}</p>
            <Link className={styles.textLink} href="/membership">
              Read about membership
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.peopleBand}`}>
        <div className={`${styles.wrap} ${styles.peopleGrid}`}>
          <h2>The people are the journey.</h2>
          <div className={styles.peopleCopy}>
            <p>Members are matched by how they travel, not by what they earn.</p>
            <p>
              Your Travel Fingerprint gives members a shared language for considering
              company. It does not guarantee compatibility or safety.
            </p>
            <div className={styles.actions}>
              <Link
                className={`${styles.button} ${styles.buttonLine}`}
                href="/how-it-works"
              >
                Read how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.travelBand}`}>
        <div className={styles.wrap}>
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Choose your way in</p>
            <h2>Three ways to travel</h2>
            <p>
              Members may join a published departure open to the club, ask
              Sawayatra to shape a private journey for an existing company, or
              propose a road they wish to travel and invite interest from
              compatible members.
            </p>
          </header>

          <article className={styles.featured}>
            <div className={styles.featuredImage}>
              <Image
                src="/assets/images/departures/andean/gallery/the-end-of-the-road/09-patagonia-41.jpg"
                alt="Broad Patagonian lake lying beneath a distant ridge of snow-covered mountains."
                fill
                sizes="(max-width: 900px) 100vw, (max-width: 1440px) 90vw, 1248px"
              />
            </div>
            <div className={styles.featuredCopy}>
              <h3>
                Caravans
                <span>join and leave by section</span>
              </h3>
              <div>
                <p>
                  One long overland route, travelled together. Join for a
                  single section, combine several, or ride the whole 71-day
                  road. One departure a year.
                </p>
                <div className={styles.actions}>
                  <Link className={styles.button} href="/journeys/caravans/andean-caravan">
                    Explore the Andean Caravan <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <div className={styles.cards}>
            <article className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src="/assets/images/departures/andean/gallery/white-city-deep-canyon/05-london-0ps.jpg"
                  alt="Pale road crossing cultivated Andean fields beneath dark mountains and gathering clouds."
                  fill
                  sizes="(max-width: 900px) 100vw, 44vw"
                />
              </div>
              <p className={styles.cardLabel}>Coming later</p>
              <h3>Join a journey with others</h3>
              <p>
                Shorter journeys, one country at a time, discovered and joined
                with other members. In development now, opening after the
                Caravan.
              </p>
              <div className={styles.actions}>
                <Link
                  className={`${styles.button} ${styles.buttonLine}`}
                  href="/journeys/join"
                >
                  See what&apos;s coming <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src="/assets/images/departures/andean/gallery/atacama/01-astro-01.jpg"
                  alt="Stars fill the night sky above rock formations in the Atacama Desert."
                  fill
                  sizes="(max-width: 900px) 100vw, 44vw"
                />
              </div>
              <p className={styles.cardLabel}>Coming later</p>
              <h3>Create your own</h3>
              <p>
                A later way for members to propose a destination, dates and
                travel style, then invite compatible members to join.
              </p>
              <div className={styles.actions}>
                <Link
                  className={`${styles.button} ${styles.buttonLine}`}
                  href="/journeys/create"
                >
                  Register your interest <span aria-hidden="true">→</span>
                </Link>
              </div>
              <p className={styles.note}>Not yet available.</p>
            </article>
          </div>
        </div>
      </section>

      <section
        className={`${styles.band} ${styles.nameBand}`}
        aria-labelledby="name-heading"
      >
        <div className={styles.wrap}>
          <h2 className={styles.eyebrow} id="name-heading">
            The name
          </h2>
          <div className={styles.origins}>
            <article className={styles.origin}>
              <p className={styles.language}>Arabic</p>
              <h3 className={styles.word}>sawa</h3>
              <p>
                Together - rooted in an old word for harmony, alignment, and
                making things level.
              </p>
            </article>

            <article className={styles.origin}>
              <p className={styles.language}>Sanskrit</p>
              <h3 className={styles.word}>yatra</h3>
              <p>
                Journey - once a pilgrimage of purpose, now any voyage of
                discovery.
              </p>
            </article>
          </div>

          <blockquote className={styles.quote}>
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
