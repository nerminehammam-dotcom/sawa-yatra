import Link from "next/link";
import { notFound } from "next/navigation";

import { createPageMetadata } from "@/app/_metadata";
import { JourneyInterestForm } from "@/components/forms/JourneyInterestForm";
import { archetypes } from "@/content/archetypes";
import { joiningPoints } from "@/content/field-document";

import styles from "./start-here.module.css";

export const metadata = createPageMetadata("/start-here");

interface StartHerePageProps {
  searchParams: Promise<{ join?: string }>;
}

export default async function StartHerePage({ searchParams }: StartHerePageProps) {
  const { join } = await searchParams;
  const selected =
    joiningPoints.find((point) => point.id === join) ?? joiningPoints[0]!;

  notFound();

  return (
    <main id="main-content" tabIndex={-1}>
      <header className={styles.hero}>
        <p>Start here / joining-point enquiry</p>
        <h1>Begin with the place where you enter.</h1>
        <p>
          Choose a gateway below. The enquiry keeps the wider caravan in view
          while naming the section you are asking about.
        </p>
      </header>

      <section className={styles.selector} aria-labelledby="select-heading">
        <h2 id="select-heading">Choose a joining point</h2>
        <ol>
          {joiningPoints.map((point) => (
            <li key={point.id}>
              <Link
                href={`/start-here?join=${point.id}`}
                aria-current={point.id === selected.id ? "true" : undefined}
              >
                <span>{point.number}</span>
                <strong>{point.place}</strong>
                <small>{point.duration}</small>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.enquiry} aria-labelledby="enquiry-heading">
        <div className={styles.context}>
          <p>Selected joining point {selected.number}</p>
          <h2 id="enquiry-heading">{selected.place}</h2>
          <p>{selected.route}</p>
          <dl>
            <div>
              <dt>Access</dt>
              <dd>{selected.access} · {selected.accessNote}</dd>
            </div>
            <div>
              <dt>Time on the road</dt>
              <dd>{selected.duration}</dd>
            </div>
            <div>
              <dt>Leave at</dt>
              <dd>{selected.leaveAt}</dd>
            </div>
          </dl>
        </div>
        <div className={styles.formPanel}>
          <JourneyInterestForm
            journey={{
              id: `andean-caravan-${selected.id}`,
              label: `The Andean Caravan, join at ${selected.place}`,
            }}
            availableTravelSelfIds={archetypes.map((archetype) => archetype.id)}
          />
        </div>
      </section>
    </main>
  );
}
