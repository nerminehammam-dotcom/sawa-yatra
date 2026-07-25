import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import styles from "../departures/departures.module.css";

export default function DoItYourselfPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section
        className={styles.gateway}
        ground="cream"
        aria-labelledby="do-it-yourself-heading"
      >
        <Container size="full" className={styles.gatewayFrame}>
          <div className={styles.pathSequence}>
            <article className={styles.createPath}>
              <div className={styles.createRoute} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.createCopy}>
                <p className={styles.laterLabel}>Later release</p>
                <h1 id="do-it-yourself-heading">
                  Create <span className={styles.comingLater}>Coming later</span>
                </h1>
                <p>
                  Create is not available in Release 1. Explore Caravan / Join
                  for the journey available now.
                </p>
              </div>
            </article>
          </div>
        </Container>
      </Section>
    </main>
  );
}
