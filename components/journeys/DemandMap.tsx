import type { DemandMapEntry } from "@/lib/journeys/forming";

import styles from "./DemandMap.module.css";

/**
 * §6.4 — the demand map, Forming only. Anonymised: where the club is
 * looking. No names, no passports, no archetypes. Density only. The entry
 * type (lib/journeys/forming.ts) cannot carry a member.
 */
export function DemandMap({ entries }: { entries: readonly DemandMapEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section className={styles.map} aria-labelledby="demand-heading">
      <h3 id="demand-heading">Where the club is looking</h3>
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li
            key={`${entry.sectionTitle}-${entry.windowLabel}`}
            className={styles.entry}
          >
            <span className={styles.section}>
              {entry.sectionTitle} · {entry.sectionRoute}
            </span>
            <span className={styles.window}>
              {entry.windowLabel} — {entry.consideringCount}{" "}
              {entry.consideringCount === 1 ? "member" : "members"} considering
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
