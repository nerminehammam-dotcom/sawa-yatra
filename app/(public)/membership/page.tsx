import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { membershipContent } from "@/content/membership";
import { contactHref } from "@/lib/contact";

import styles from "./membership.module.css";
import { Arrow } from "@/components/ui/Arrow";

export const metadata = createPageMetadata("/membership");

export default function MembershipPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="membership-heading">
        <p>{membershipContent.hero.eyebrow}</p>
        <h1 id="membership-heading">{membershipContent.hero.title}</h1>
        <p>
          Membership is the way Sawayatra keeps introductions considered and
          the travelling room small.
        </p>
        <Link href={contactHref("Membership")}>
          Ask about membership <Arrow />
        </Link>
      </section>
      <section className={styles.note} aria-labelledby="membership-note-heading">
        <h2 id="membership-note-heading">The details come after the idea is clear.</h2>
        <p>
          Prices, tiers and conditions are not being published before they are
          ready. You can still ask how the club is taking shape.
        </p>
      </section>
    </main>
  );
}
