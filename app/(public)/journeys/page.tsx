import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { ProvenanceBadge } from "@/components/journeys/ProvenanceBadge";
import { fixedJourneys, formingJourneys } from "@/content/journeys-catalog";
import { isForming } from "@/lib/journeys/model";

import styles from "./journeys.module.css";

export const metadata = createPageMetadata("/journeys");

/**
 * One page, two groups (§2.3): Leaving on a date / Still forming.
 * "Create your own" is not a destination — it is the Start one button below,
 * honestly disabled in Release 1 (build command §3.B).
 */
export default function JourneysPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Journeys</h1>
        <p className={styles.lede}>
          Every journey here is one purchasable thing. The difference that
          matters is not who made it, but whether its date exists yet. Who
          stands behind each one — Sawayatra, a partner, or a member — is on
          the card.
        </p>
      </header>

      <section className={styles.group} aria-labelledby="fixed-heading">
        <h2 id="fixed-heading">Leaving on a date</h2>
        <p className={styles.groupNote}>
          The date is real and immovable. The decision is yes or no.
        </p>
        <ul className={styles.cardList}>
          {fixedJourneys.map((journey) => (
            <li key={journey.id} className={styles.card}>
              <div className={styles.cardTop}>
                <ProvenanceBadge provenance={journey.provenance} />
                <span className={styles.duration}>
                  {journey.durationDays} days
                </span>
              </div>
              <h3 className={styles.cardTitle}>
                <Link href={journey.href}>{journey.title}</Link>
              </h3>
              <p className={styles.cardRoute}>{journey.route}</p>
              <p className={styles.cardDate}>{journey.dateLine}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.group} aria-labelledby="forming-heading">
        <h2 id="forming-heading">Still forming</h2>
        <p className={styles.groupNote}>
          The date does not exist yet. It is decided by whoever gathers.
        </p>
        {formingJourneys.length > 0 ? (
          <ul className={styles.cardList}>
            {formingJourneys.filter(isForming).map((journey) => (
              <li key={journey.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <ProvenanceBadge provenance={journey.provenance} />
                  <span className={styles.duration}>
                    {journey.durationDays} days
                  </span>
                </div>
                <h3 className={styles.cardTitle}>
                  <Link href={journey.href}>{journey.title}</Link>
                </h3>
                <p className={styles.cardRoute}>{journey.route}</p>
                <ul className={styles.windowList}>
                  {journey.windows.map((window) => (
                    <li key={window.id}>
                      {window.label} — {window.consideringCount} considering
                      {window.proposedByMember ? " · proposed by a member" : ""}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.formingEmpty}>
            <p>
              Nothing is forming yet. Member-created journeys open with
              membership: any member will be able to start one, mark a window
              rather than a date, and gather companions from the club.
            </p>
          </div>
        )}
        <div className={styles.startOne}>
          {/* §2.3 — a single honest, disabled CTA, not a dead section. */}
          <button type="button" className={styles.startOneButton} disabled>
            Start one
          </button>
          <p className={styles.startOneNote}>
            Starting a journey is a member action, and membership has not
            opened yet. When it does, this is where a journey begins.
          </p>
        </div>
      </section>
    </main>
  );
}
