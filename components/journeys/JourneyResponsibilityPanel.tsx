import { classNames } from "@/components/ui/classNames";
import type { JourneyResponsibilityRecord } from "@/lib/journeys/responsibility";
import {
  getPublishableJourneyResponsibility,
  JOURNEY_RESPONSIBILITY_FIELD_KEYS,
  JOURNEY_RESPONSIBILITY_FIELD_LABELS,
} from "@/lib/journeys/responsibility";

import styles from "./JourneyResponsibilityPanel.module.css";

export interface JourneyResponsibilityPanelProps {
  readonly responsibility: JourneyResponsibilityRecord;
  readonly className?: string;
}

/**
 * A direct, non-interactive disclosure. Incomplete records render nothing:
 * public pages never show partial responsibility information or placeholders.
 */
export function JourneyResponsibilityPanel({
  responsibility,
  className,
}: JourneyResponsibilityPanelProps) {
  const published = getPublishableJourneyResponsibility(responsibility);

  if (!published) return null;

  const headingId = `${published.journeySlug}-responsibility-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className={classNames(styles.panel, className)}
    >
      <h2 className={styles.heading} id={headingId}>
        Who is responsible for this journey
      </h2>
      <dl className={styles.list}>
        {JOURNEY_RESPONSIBILITY_FIELD_KEYS.map((key) => (
          <div className={styles.item} key={key}>
            <dt>{JOURNEY_RESPONSIBILITY_FIELD_LABELS[key]}</dt>
            <dd>{published.fields[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
