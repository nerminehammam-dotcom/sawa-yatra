import { classNames } from "@/components/ui/classNames";

import styles from "./FitBand.module.css";

export interface FitBandProps {
  aligns?: string;
  canFlex?: string;
  className?: string;
}

export function FitBand({ aligns, canFlex, className }: FitBandProps) {
  return (
    <dl className={classNames(styles.root, className)} aria-label="Travel fit">
      <div className={classNames(styles.item, styles.aligns)}>
        <dt className={styles.label}>Aligns</dt>
        {aligns ? <dd className={styles.value}>{aligns}</dd> : null}
      </div>
      <div className={classNames(styles.item, styles.canFlex)}>
        <dt className={styles.label}>Can flex</dt>
        {canFlex ? <dd className={styles.value}>{canFlex}</dd> : null}
      </div>
    </dl>
  );
}
