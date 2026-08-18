import type { Metadata } from "next";
import Link from "next/link";

import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  existingJourneyDayRange,
  existingJourneyRegion,
  existingJourneys,
} from "@/content/existing-journeys";
import { absoluteUrl } from "@/lib/site-url";

import styles from "./join.module.css";

export const metadata: Metadata = {
  title: { absolute: "Join an existing journey | Sawayatra" },
  description: null,
  alternates: { canonical: absoluteUrl("/journeys/join") },
  robots: { index: false, follow: true },
  openGraph: null,
  twitter: null,
};

export default function JoinJourneyPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="join-heading">
        <div>
          <Eyebrow kind="decision" tone="accent">
            Journeys · Join an existing journey
          </Eyebrow>
          <h1 id="join-heading">Journeys that already exist.</h1>
        </div>
        <div className={styles.heroAside}>
          <p>
            These run to a set route and a set length. You join one as it is,
            rather than building it from scratch or riding a Caravan section by
            section.
          </p>
          <p>
            Each one has a client guide you can read in full before deciding.
          </p>
        </div>
      </section>

      <div className={styles.regionBar}>
        <strong>{existingJourneyRegion.label}</strong>
        <p>
          {existingJourneys.length} journeys ·{" "}
          {existingJourneyDayRange.shortest} to {existingJourneyDayRange.longest}{" "}
          days
        </p>
      </div>

      <ul className={styles.list}>
        {existingJourneys.map((journey) => (
          <li className={styles.item} key={journey.id}>
            <a
              className={styles.link}
              href={journey.href}
              download
              aria-label={`Download the client guide for ${journey.title}, ${journey.days} days, PDF, ${journey.pages} pages, ${journey.sizeLabel}`}
            >
              <span className={styles.number} aria-hidden="true">
                {journey.number}
              </span>
              <span className={styles.body}>
                <span className={styles.title}>{journey.title}</span>
                <span className={styles.standfirst}>{journey.standfirst}</span>
              </span>
              <dl className={styles.facts}>
                <div>
                  <dt>Length</dt>
                  <dd>
                    {journey.days} {journey.days === 1 ? "day" : "days"}
                  </dd>
                </div>
                <div>
                  <dt>Gate</dt>
                  <dd>{journey.gate}</dd>
                </div>
                <div>
                  <dt>Group</dt>
                  <dd>{journey.group}</dd>
                </div>
              </dl>
              <span className={styles.download}>
                <span>Client guide</span>
                <span>
                  PDF · {journey.pages} pages · {journey.sizeLabel}
                </span>
                <Arrow />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <section className={styles.review} aria-labelledby="journey-review-heading">
        <div>
          <p className={styles.reviewEyebrow}>Journey status</p>
          <h2 id="journey-review-heading">Draft guides under review.</h2>
        </div>
        <div className={styles.reviewCopy}>
          <p>
            These downloadable Western Desert guides remain draft source
            material.
          </p>
          <p>
            Named operator, contracting party, payment recipient, emergency
            responsibility and review information is still required for each
            journey.
          </p>
          <Link href="/journey-standards">
            Read the Journey Standards <Arrow />
          </Link>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="join-next-heading">
        <h2 id="join-next-heading">Not what you are after?</h2>
        <p>
          A Caravan is one long route you join and leave by section. Creating
          your own starts from a blank page instead of a published one.
        </p>
        <div className={styles.closingLinks}>
          <Link href="/journeys/caravans">
            Caravans <Arrow />
          </Link>
          <Link href="/journeys/create">
            Create your own journey <Arrow />
          </Link>
          <Link href="/club/apply">
            Register your interest <Arrow />
          </Link>
        </div>
      </section>
    </main>
  );
}
