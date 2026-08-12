import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";

import styles from "./club.module.css";

export const metadata = createPageMetadata("/club");

export default function ClubPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.hero}>
        <p>The club</p>
        <h1>Join before you know where you&apos;re going.</h1>
        <p>
          Membership is free and separate from any journey. You may stay a
          member for as long as you need before a road holds you.
        </p>
        <Link href="/club/apply">Apply to join</Link>
      </header>
      <section className={styles.process} aria-labelledby="process-heading">
        <h2 id="process-heading">How vetting works</h2>
        <ol>
          <li><strong>01</strong><span>You apply to the club, not to a journey.</span></li>
          <li><strong>02</strong><span>We read the application as people, not as a score.</span></li>
          <li><strong>03</strong><span>If it is a fit, membership opens every journey layer.</span></li>
        </ol>
      </section>
      <section className={styles.promise}>
        <h2>Membership is a place to sit while you decide.</h2>
        <p>
          There is no fee, subscription, booking obligation or expectation
          that you declare interest quickly. Travel does not happen often. A
          long gap is normal here.
        </p>
      </section>
    </main>
  );
}

