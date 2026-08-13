import type { Provenance } from "@/lib/journeys/model";
import { PROVENANCE_BADGE_LABEL } from "@/lib/journeys/model";

import styles from "./ProvenanceBadge.module.css";

/**
 * §2.2 / build command §1.4 - provenance renders as a badge on every journey
 * card: Sawayatra · Partner · Member-made. Unabbreviated, never soft-pedalled.
 * A member who saw the badge from the first day does not mind at all.
 */
export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  return (
    <span className={styles.badge} data-provenance={provenance}>
      {PROVENANCE_BADGE_LABEL[provenance]}
    </span>
  );
}
