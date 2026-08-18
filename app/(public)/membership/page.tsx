import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { joiningCopy } from "@/content/club-first";

import styles from "../club/club.module.css";

export const metadata = createPageMetadata("/membership");

const joiningSteps = [
  "Invitation opens the application",
  "Complete Travel Self",
  "Join the club",
  "Consider each journey",
] as const;

export default function MembershipPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.hero}>
        <div className={styles.heroStatement}>
          <p>Membership</p>
          <h1>Join the club before you choose the road.</h1>
        </div>
        <div className={styles.heroInvitation}>
          <p>{joiningCopy.status}</p>
          <Link href="/contact">Ask a question</Link>
        </div>
      </header>

      <section className={styles.memberPath} aria-labelledby="joining-heading">
        <header className={styles.sheetHeader}>
          <div>
            <p>Sawayatra · membership</p>
            <h2 id="joining-heading">How joining will work</h2>
          </div>
          <p>
            An invitation opens an application. It does not guarantee
            admission or acceptance onto a particular journey.
          </p>
        </header>

        <div className={styles.pathColumns}>
          <section className={styles.pathColumn} aria-label="The joining model">
            <p className={styles.columnLabel}>The joining model</p>
            <ol>
              {joiningCopy.paragraphs.map((paragraph, index) => (
                <li key={joiningSteps[index]}>
                  <p className={styles.stepNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3>{joiningSteps[index]}</h3>
                  <p className={styles.stepBody}>{paragraph}</p>
                  {index === 1 ? (
                    <div className={styles.stepActions}>
                      <Link className={styles.stepAction} href="/travel-self">
                        Meet your Travel Self
                      </Link>
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <footer className={styles.sheetFooter}>
          <p>No booking. No payment. No public member profiles.</p>
          <p>Applications are not yet accepted online.</p>
        </footer>
      </section>

      <section className={styles.promise}>
        <h2>What Travel Self can and cannot do.</h2>
        <p>{joiningCopy.travelSelfLimit}</p>
      </section>
    </main>
  );
}
