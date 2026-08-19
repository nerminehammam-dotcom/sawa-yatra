import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCurrentViewer, getJourneyView } from "@/lib/sawayatra/server";
import { canViewPoolRoute } from "@/lib/sawayatra/view-model";

import styles from "../journey.module.css";
import passportStyles from "../../../travel-self/travel-self.module.css";

export const metadata: Metadata = {
  title: "Journey people | Sawayatra",
  robots: { index: false, follow: false },
};

export default async function JourneyPeoplePage({
  params,
}: {
  params: Promise<{ journey: string }>;
}) {
  const { journey: slug } = await params;
  const viewer = await getCurrentViewer();
  const view = getJourneyView(slug, viewer);
  if (!view || !canViewPoolRoute(view.journey.id, viewer)) notFound();

  return (
    <main className={styles.pool} id="main-content" tabIndex={-1}>
      <p>{view.poolSize} {view.poolSize === 1 ? "person" : "people"} circling</p>
      <h1>{view.journey.title} / people</h1>
      {view.showsMatchLayer ? (
        <div className={styles.passports}>
          {view.passports.map((passport) => (
            <article className={`${passportStyles.passport} ${styles.poolPassport}`} key={passport.memberId}>
              <p>Your Travel Fingerprint Passport</p>
              <h2>{passport.archetype}</h2>
              {Object.values(passport.demographics).length > 0 ? (
                <p>{Object.values(passport.demographics).join(" · ")}</p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p>Save Your Travel Fingerprint to see and be seen in this matching layer.</p>
      )}
    </main>
  );
}
