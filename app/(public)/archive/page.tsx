import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { Arrow } from "@/components/ui/Arrow";
import { archiveCopy } from "@/content/club-first";

import styles from "../about/club-about.module.css";

export const metadata = createPageMetadata("/archive");

export default function ArchivePage() {
  return (
    <main className={styles.aboutPage} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="archive-heading">
        <div className={styles.wrap}>
          <h1 id="archive-heading">The Archive</h1>
          <div className={styles.introduction}>
            <p>{archiveCopy.status}</p>
            <p>
              This page explains its purpose and privacy boundary. It contains
              no member contributions.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.belief} aria-label="Archive principle">
        <div className={styles.wrap}>
          <blockquote>
            <p>Every road travelled can leave something useful for those who follow.</p>
          </blockquote>
        </div>
      </section>

      <section className={styles.splitSection} aria-labelledby="purpose-heading">
        <div className={styles.wrap}>
          <header>
            <h2 id="purpose-heading">Purpose</h2>
          </header>
          <div className={styles.sectionCopy}>
            <p>{archiveCopy.purpose}</p>
            <p>
              Contributions are intended to focus on places, routes, objects,
              work and practical evidence. They are not public testimonials.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.splitSection} aria-labelledby="privacy-heading">
        <div className={styles.wrap}>
          <header>
            <h2 id="privacy-heading">Member privacy</h2>
          </header>
          <div className={styles.sectionCopy}>
            <p>{archiveCopy.privacy}</p>
            <p>
              No member names, portraits, personal profiles or private
              contributions have been added to the public website.
            </p>
            <Link className={styles.textLink} href="/sign-in">
              Member access <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
