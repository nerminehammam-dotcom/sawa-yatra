import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { Arrow } from "@/components/ui/Arrow";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";
import { partnerSubmissionCopy } from "@/content/club-first";

import styles from "./partners.module.css";

export const metadata = createPageMetadata("/partners");

export default function PartnersPage() {
  return (
    <ComingSoonPage
      title="Our partners"
      lede="This section is coming soon. Partner information will be added here when the structure and details are ready."
    >
      <section className={styles.process} aria-labelledby="partner-process-heading">
        <div className={styles.wrap}>
          <header>
            <p>Partner-submitted journeys</p>
            <h2 id="partner-process-heading">The submission process</h2>
            <p>{partnerSubmissionCopy.status}</p>
          </header>

          <ol>
            {partnerSubmissionCopy.steps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>

          <div className={styles.note}>
            <p>
              A submission does not make a partner anonymous and does not
              transfer operational responsibility to Sawayatra.
            </p>
            <p>
              Sawayatra&apos;s public voice remains an editorial responsibility.
              Partners confirm facts; they do not write directly into it.
            </p>
            <Link href="/journey-standards">
              Read the Journey Standards <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </ComingSoonPage>
  );
}
