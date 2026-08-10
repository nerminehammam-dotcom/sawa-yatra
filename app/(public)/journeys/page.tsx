import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { ProvenanceBadge } from "@/components/journeys/ProvenanceBadge";
import { fixedJourneys } from "@/content/journeys-catalog";

import styles from "./journeys.module.css";

export const metadata = createPageMetadata("/journeys");

export default function JourneysPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Journeys</h1>
        <p className={styles.lede}>
          The Andean Caravan is one continuous route. Open it to choose one of
          four sections, combine consecutive sections, or travel the complete
          road from Lima to Balmaceda.
        </p>
      </header>

      <section className={styles.group} aria-label="Available journeys">
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
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
