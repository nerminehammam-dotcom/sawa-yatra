import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentViewer, getJourneyView, journeys } from "@/lib/sawayatra/server";
import { absoluteUrl } from "@/lib/site-url";

import styles from "./journey.module.css";
import passportStyles from "../../travel-self/travel-self.module.css";
import {
  declareInterestAction,
  reconfirmInterestAction,
  withdrawInterestAction,
} from "./actions";

export function generateStaticParams() {
  return journeys.map((journey) => ({ journey: journey.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ journey: string }>;
}): Promise<Metadata> {
  const { journey: slug } = await params;
  const journey = journeys.find((item) => item.slug === slug);
  if (!journey) return {};
  const canonical = absoluteUrl(`/journeys/${journey.slug}`);
  return {
    title: journey.title,
    description: journey.story[0],
    alternates: { canonical },
    openGraph: {
      title: journey.title,
      description: journey.story[0],
      url: canonical,
      images: [{ url: absoluteUrl(journey.heroImage), alt: journey.heroAlt }],
    },
  };
}

function PassportCard({
  passport,
}: {
  passport: NonNullable<ReturnType<typeof getJourneyView>>["passports"][number];
}) {
  const demographics = Object.values(passport.demographics);
  return (
    <article className={`${passportStyles.passport} ${styles.poolPassport}`}>
      <p>Travel Self Passport</p>
      <h3>{passport.archetype}</h3>
      <dl>
        {Object.entries(passport.axes).map(([axis, value]) => (
          <div key={axis}><dt>{axis}</dt><dd>{value} / 6</dd></div>
        ))}
      </dl>
      {demographics.length > 0 ? (
        <p className={styles.demographics}>{demographics.join(" · ")}</p>
      ) : null}
    </article>
  );
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ journey: string }>;
}) {
  const { journey: slug } = await params;
  const viewer = await getCurrentViewer();
  const view = getJourneyView(slug, viewer);
  if (!view?.canViewJourney) notFound();

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="journey-heading">
        <div className={styles.heroCopy}>
          <p>{view.journey.type === "caravan" ? "Caravan" : "Open journey"}</p>
          <h1 id="journey-heading">{view.journey.title}</h1>
          <p>{view.journey.route}</p>
        </div>
        <figure>
          <Image
            src={view.journey.heroImage}
            alt={view.journey.heroAlt}
            fill
            sizes="(max-width: 760px) 100vw, 55vw"
            preload
          />
        </figure>
      </section>

      <section className={styles.facts} aria-label="Journey facts">
        <dl>
          <div><dt>Route</dt><dd>{view.journey.route}</dd></div>
          <div><dt>Duration</dt><dd>{view.journey.duration}</dd></div>
          <div><dt>Cost</dt><dd>{view.journey.cost}</dd></div>
          <div><dt>Status</dt><dd>{view.journey.status}</dd></div>
        </dl>
      </section>

      <section className={styles.story} aria-labelledby="story-heading">
        <h2 id="story-heading">The road</h2>
        <div>{view.journey.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className={styles.asks} aria-labelledby="asks-heading">
        <h2 id="asks-heading">What it asks of you</h2>
        <ul>{view.journey.asksOfYou.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className={styles.portrait} aria-labelledby="portrait-heading">
        <p>{view.portraitMode === "intended" ? "Who this road is for" : "Who is circling"}</p>
        <h2 id="portrait-heading">A portrait of the group</h2>
        <p>{view.portrait}</p>
      </section>

      {view.needsTravelSelfPrompt ? (
        <section className={styles.prompt} aria-labelledby="passport-prompt-heading">
          <h2 id="passport-prompt-heading">Complete your Travel Self</h2>
          <p>
            You can declare interest without it. Until you save one, you will
            neither see nor appear in this journey&apos;s matching layer.
          </p>
          <Link href="/travel-self/take">Take the questionnaire</Link>
        </section>
      ) : null}

      {view.showsFitLayer ? (
        <section className={styles.fit} aria-labelledby="fit-heading">
          <p>Your view / fit</p>
          <h2 id="fit-heading">Your Travel Self on this road</h2>
          <p>
            Your saved Travel Self is read against this journey&apos;s pace,
            structure and social rhythm. It is never a club-wide compatibility
            score.
          </p>
        </section>
      ) : null}

      {view.viewLevel === "public" ? (
        <section className={styles.action} aria-label="Join the club">
          <h2>Join the club before you choose the road.</h2>
          <Link href="/club/apply">Join</Link>
        </section>
      ) : null}

      {view.canDeclareInterest ? (
        <section className={styles.action} aria-label="Declare interest">
          <h2>Circle this journey.</h2>
          <p>Nothing is owed and no deposit is taken. This is not a booking.</p>
          <form action={declareInterestAction}>
            <input type="hidden" name="journey" value={view.journey.slug} />
            <button type="submit">Declare interest</button>
          </form>
        </section>
      ) : null}

      {view.viewLevel === "pool" ? (
        <section className={styles.pool} aria-labelledby="pool-heading">
          <p>{view.poolSize} {view.poolSize === 1 ? "person is" : "people are"} circling</p>
          <h2 id="pool-heading">
            {view.poolSize === 1 ? "You are early to this road." : "The journey pool"}
          </h2>
          {view.showsMatchLayer ? (
            <div className={styles.passports}>
              {view.passports.map((passport) => <PassportCard key={passport.memberId} passport={passport} />)}
            </div>
          ) : (
            <p>Save your Travel Self to see and be seen in the matching layer.</p>
          )}
        </section>
      ) : null}

      {view.viewLevel === "pool" ? (
        <section className={styles.declarationStatus} aria-label="Your declaration">
          <p>Your interest is active. It is not a booking or an obligation.</p>
          <div>
            <form action={reconfirmInterestAction}>
              <input type="hidden" name="journey" value={view.journey.slug} />
              <button type="submit">Re-confirm interest</button>
            </form>
            <form action={withdrawInterestAction}>
              <input type="hidden" name="journey" value={view.journey.slug} />
              <button type="submit">Withdraw interest</button>
            </form>
          </div>
        </section>
      ) : null}

      {view.viewLevel === "pool" ? (
        <p className={styles.peopleRoute}>
          The same private pool is available at <Link href={`/journeys/${view.journey.slug}/people`}>its people page</Link>.
        </p>
      ) : null}
    </main>
  );
}
