import Link from "next/link";

import { andeanCaravanSections } from "@/content/andean-caravan";

import styles from "./RouteStepper.module.css";
import { Arrow } from "@/components/ui/Arrow";

interface RouteStepperProps {
  /** The section being read, or undefined on the complete-route page. */
  slug?: string;
}

/**
 * Where you are on the road, and how to keep going.
 *
 * The Caravan is nine consecutive sections and, until this existed, there was
 * no way to move from one to the next. A reader finishing Desert Coast had to
 * go back to the index and find White City themselves — on a product whose
 * entire proposition is that the sections join up into one road.
 *
 * Every serious sequential body of work solves this the same way. Nermine's own
 * site ends each series with "← Cairo Days 4 · All works · Maat →". Belmond
 * name each leg of one railway line as its own product and link them. Dragoman
 * and Oasis publish every permutation of one circuit and connect them by naming
 * convention. It is the cheapest structural thing a route brand can do.
 *
 * The counter is deliberately plain — "Section 3 of 9" — because scarcity and
 * shape in this category are always a number and never an adjective.
 */
export function RouteStepper({ slug }: RouteStepperProps) {
  const index = andeanCaravanSections.findIndex((section) => section.slug === slug);
  if (index === -1) return null;

  const total = andeanCaravanSections.length;
  const previous = index > 0 ? andeanCaravanSections[index - 1] : undefined;
  const next = index < total - 1 ? andeanCaravanSections[index + 1] : undefined;
  const current = andeanCaravanSections[index];
  if (!current) return null;

  return (
    <nav className={styles.stepper} aria-label="Move along the Caravan">
      <p className={styles.counter}>
        Section {current.sectionNumber} of {total}
        <span className={styles.countries}> · {current.countries.join(" · ")}</span>
      </p>

      <div className={styles.steps}>
        {previous ? (
          <Link className={styles.step} href={`/departures/${previous.slug}`} rel="prev">
            <span className={styles.direction}>
              <Arrow direction="left" /> Arrives from
            </span>
            <span className={styles.name}>{previous.title}</span>
            <span className={styles.detail}>
              {previous.durationDays} days · {previous.route}
            </span>
          </Link>
        ) : (
          <p className={`${styles.step} ${styles.terminus}`}>
            <span className={styles.direction}>The road begins</span>
            <span className={styles.name}>{current.route.split("→")[0]?.trim()}</span>
            <span className={styles.detail}>
              This is where the Caravan starts. Nothing precedes it.
            </span>
          </p>
        )}

        {next ? (
          <Link className={styles.step} href={`/departures/${next.slug}`} rel="next">
            <span className={styles.direction}>
              Continues to <Arrow />
            </span>
            <span className={styles.name}>{next.title}</span>
            <span className={styles.detail}>
              {next.durationDays} days · {next.route}
            </span>
          </Link>
        ) : (
          <p className={`${styles.step} ${styles.terminus}`}>
            <span className={styles.direction}>The end of the road</span>
            <span className={styles.name}>
              {current.route.split("→").pop()?.trim()}
            </span>
            <span className={styles.detail}>
              The Caravan stops here. There is nothing further south.
            </span>
          </p>
        )}
      </div>

      <p className={styles.whole}>
        Sections can be travelled on their own or joined end to end.{" "}
        <Link href="/departures/the-andean-caravan">
          See all {total} as one continuous route
        </Link>
      </p>
    </nav>
  );
}
