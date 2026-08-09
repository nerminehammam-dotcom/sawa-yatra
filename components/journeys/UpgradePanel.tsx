import { specToken } from "@/content/spec-tokens";

import styles from "./UpgradePanel.module.css";

/**
 * §7.8 — upgrades. Displayed separately, beneath the ladder, never folded
 * into the base price. Single occupancy is named plainly here on the section
 * page, never surfaced as a hidden supplement at checkout. An upgrade never
 * moves anyone else's band.
 */
export function UpgradePanel({
  availabilityNote,
}: {
  /** Which nights, which gate cities, and explicitly which are NOT upgradeable. */
  availabilityNote: string;
}) {
  return (
    <section className={styles.panel} aria-labelledby="upgrades-heading">
      <h3 id="upgrades-heading">Upgrades</h3>
      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt>{specToken("UPGRADE_NAME")}</dt>
          <dd>
            {availabilityNote} — {specToken("UPGRADE_PRICE")} per person, per
            section.
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Travelling alone</dt>
          <dd>
            Single occupancy is {specToken("SINGLE_SUPPLEMENT")} — named here,
            on this page, not discovered at checkout. An upgrade of any kind
            never changes anyone else’s price: a member who upgrades still
            counts as one traveller toward everyone’s band.
          </dd>
        </div>
      </dl>
    </section>
  );
}
