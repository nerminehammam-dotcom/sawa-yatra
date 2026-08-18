import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { Arrow } from "@/components/ui/Arrow";
import {
  journeyPrinciples,
  responsibilityLabels,
} from "@/content/club-first";

import styles from "../about/club-about.module.css";

export const metadata = createPageMetadata("/journey-standards");

export default function JourneyStandardsPage() {
  return (
    <main className={styles.aboutPage} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="standards-heading">
        <div className={styles.wrap}>
          <h1 id="standards-heading">Journey Standards</h1>
          <div className={styles.introduction}>
            <p>
              These standards set out how Sawayatra intends to consider a
              journey before admitting it to the programme.
            </p>
            <p>
              They distinguish editorial assessment from operation, contracts,
              payment and emergency responsibility.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.belief} aria-label="Minimum threshold">
        <div className={styles.wrap}>
          <blockquote>
            <p>{journeyPrinciples[0]}</p>
          </blockquote>
        </div>
      </section>

      <section className={styles.splitSection} aria-labelledby="principles-heading">
        <div className={styles.wrap}>
          <header>
            <h2 id="principles-heading">The journey principles</h2>
          </header>
          <div className={styles.sectionCopy}>
            {journeyPrinciples.slice(1).map((principle) => (
              <p key={principle}>{principle}</p>
            ))}
            <p>
              These are admission standards. Public pages do not claim that an
              existing journey has passed assessment until the assessment and
              its evidence are complete.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.splitSection} aria-labelledby="assessment-heading">
        <div className={styles.wrap}>
          <header>
            <h2 id="assessment-heading">Assessment is not operation</h2>
          </header>
          <div className={styles.sectionCopy}>
            <p>
              Assessing a route does not make Sawayatra its host, operator,
              contracting party, payment recipient or emergency lead.
            </p>
            <p>
              Each of those roles belongs to a named person or organisation.
              Sawayatra&apos;s own role must be stated separately.
            </p>
            <p>
              The assessment and material-change review workflows are not yet
              operational. The site therefore does not present current
              journeys as assessed or reassessed.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.splitSection} aria-labelledby="responsibilities-heading">
        <div className={styles.wrap}>
          <header>
            <h2 id="responsibilities-heading">Named responsibilities</h2>
          </header>
          <div className={styles.sectionCopy}>
            <p>
              A journey responsibility record is complete only when all of the
              following fields have approved information:
            </p>
            <ul>
              {responsibilityLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
            <p>
              Incomplete records remain internal. The public site shows no
              partial panel, placeholder name or implied Sawayatra role.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.splitSection} aria-labelledby="change-heading">
        <div className={styles.wrap}>
          <header>
            <h2 id="change-heading">Material changes</h2>
          </header>
          <div className={styles.sectionCopy}>
            <p>
              The planned standard requires a new review when a named route,
              host, operator, contracting arrangement, payment route or
              emergency responsibility changes.
            </p>
            <p>
              That requirement will become a public claim only when the review
              workflow and evidence exist.
            </p>
            <Link className={styles.textLink} href="/how-it-works">
              How Sawayatra works <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
