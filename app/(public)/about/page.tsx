import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { Arrow } from "@/components/ui/Arrow";

import styles from "./club-about.module.css";

export const metadata = createPageMetadata("/about");

export default function AboutPage() {
  return (
    <main className={styles.aboutPage} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="about-heading">
        <div className={styles.wrap}>
          <h1 id="about-heading">
            A club for people who travel alone on purpose.
          </h1>
          <div className={styles.introduction}>
            <p>
              Sawayatra is an invitation-only members&apos; club for slow
              overland journeys beyond the usual tourist circuit. It brings
              together independent-minded travellers who want depth rather
              than destination collecting, and compatible company without the
              arbitrariness of conventional group travel.
            </p>
            <p>
              The club exists so that a journey which might otherwise feel too
              unfamiliar, too complex or too remote to attempt alone becomes
              possible.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.belief} aria-label="Sawayatra belief">
        <div className={styles.wrap}>
          <blockquote>
            <p>
              Adventure should belong to the road, not to uncertainty about
              who you are travelling with.
            </p>
          </blockquote>
        </div>
      </section>

      <section
        className={styles.splitSection}
        aria-labelledby="company-heading"
      >
        <div className={styles.wrap}>
          <header>
            <h2 id="company-heading">How the company is formed</h2>
          </header>
          <div className={styles.sectionCopy}>
            <p>
              Most clubs sort people by what they earn or what they do.
              Sawayatra sorts by how they travel: pace, company, planning,
              attention.
            </p>
            <p>
              Every member completes a Travel Self: fourteen situations on the
              road, where both answers cost something. It is not a personality
              test. It is how the company for each journey is assembled, one
              person at a time.
            </p>
            <p>
              A reading describes how you keep pace, how you take company, how
              you hold a plan, where your attention goes, and how you fray when
              a journey is long. Anyone may take it. Only members receive a
              colourway, an archetype and a Passport.
            </p>
            <Link className={styles.textLink} href="/travel-self">
              Take the Travel Self <Arrow />
            </Link>
            <p className={styles.reveal}>
              When two members are considered for the same road, neither sees
              the other until both have agreed to be seen. This is the mutual
              reveal. It is the moment a stranger becomes company.
            </p>
          </div>
        </div>
      </section>

      <section
        className={`${styles.splitSection} ${styles.membership}`}
        aria-labelledby="membership-heading"
      >
        <div className={styles.wrap}>
          <header>
            <h2 id="membership-heading">Membership</h2>
          </header>
          <div className={styles.sectionCopy}>
            <p>
              Membership begins with an invitation from the founders or a
              nomination from an existing member. Prospective members complete
              their Travel Self and apply for admission.
            </p>
            <p>
              Once admitted, a member belongs to the club, not merely to a
              single journey.
            </p>
            <p>
              Age, gender and rooming are asked once, at application, and held
              for rooming and paperwork. They form no part of a reading and are
              not used to match anyone unless a member asks.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ways} aria-labelledby="ways-heading">
        <div className={styles.wrap}>
          <h2 id="ways-heading">Three ways to travel</h2>
          <div className={styles.wayGrid}>
            <article>
              <h3>
                <Link href="/journeys/caravans">A Caravan</Link>
              </h3>
              <p>
                Join the annual overland route, entering or leaving it at
                designated gates.
              </p>
              <p className={styles.note}>71 days and 26 days</p>
            </article>
            <article>
              <h3>
                <Link href="/journeys/join">An Open Journey</Link>
              </h3>
              <p>
                Join a shorter journey between Caravans, designed by Sawayatra
                or proposed by another member.
              </p>
            </article>
            <article>
              <h3>A journey of your own</h3>
              <p>
                Propose a route and find members who may be compatible company.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className={styles.splitSection}
        aria-labelledby="club-carries-heading"
      >
        <div className={styles.wrap}>
          <header>
            <h2 id="club-carries-heading">What the club carries</h2>
          </header>
          <div className={styles.sectionCopy}>
            <p>
              When a proposed journey fits Sawayatra principles, the club helps
              make it workable. It assesses the route, forms the travelling
              company, and finds local people who know the ground.
            </p>
            <p>
              Every journey states plainly who conceived it, who hosts it, who
              operates it, and what Sawayatra is responsible for.
            </p>
            <Link className={styles.textLink} href="/how-it-works">
              How journeys work <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.afterRoad} aria-labelledby="after-road-heading">
        <div className={styles.wrap}>
          <h2 id="after-road-heading">After the road</h2>
          <p>
            Members add field notes, photographs and practical knowledge to
            the journey archive, so each road travelled leaves something useful
            for those who follow.
          </p>
        </div>
      </section>
    </main>
  );
}
