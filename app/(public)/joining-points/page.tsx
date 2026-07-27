import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { JoiningPointSelector } from "@/components/field/JoiningPointSelector";
import { joiningPoints } from "@/content/field-document";
import { contactHref } from "@/lib/contact";

import styles from "./joining-points.module.css";

export const metadata = createPageMetadata("/joining-points");

export default function JoiningPointsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <header className={styles.hero}>
        <p>Joining points / enter and leave the moving route</p>
        <h1 id="joining-points-heading">Choose the part that belongs to you.</h1>
        <div>
          <p>
            Every gateway shows the practical span from entry to the next
            natural leaving point. The caravan continues beyond your section.
          </p>
          <Link href="/how-it-works">How the caravan works →</Link>
        </div>
      </header>
      <JoiningPointSelector
        points={joiningPoints}
        headingId="joining-points-heading"
      />
      <section className={styles.final} aria-labelledby="joining-final-heading">
        <p>Need a calm way into the route?</p>
        <h2 id="joining-final-heading">Start with the place—not a package.</h2>
        <Link href={contactHref("Joining points")}>
          Ask about a joining point ↗
        </Link>
      </section>
    </main>
  );
}
