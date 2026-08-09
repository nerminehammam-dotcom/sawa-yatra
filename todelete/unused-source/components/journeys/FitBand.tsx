import { classNames } from "@/components/ui/classNames";

import styles from "./FitBand.module.css";

export interface FitBandProps {
  aligns?: string;
  canFlex?: string;
  willChafeWith?: string;
  needsFromGroup?: string;
  className?: string;
}

export function FitBand({
  aligns,
  canFlex,
  willChafeWith,
  needsFromGroup,
  className,
}: FitBandProps) {
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
      <div className={classNames(styles.item, styles.willChafeWith)}>
        <dt className={styles.label}>Will chafe with</dt>
        {willChafeWith ? (
          <dd className={styles.value}>{willChafeWith}</dd>
        ) : null}
      </div>
      <div className={classNames(styles.item, styles.needsFromGroup)}>
        <dt className={styles.label}>Needs from a group</dt>
        {needsFromGroup ? (
          <dd className={styles.value}>{needsFromGroup}</dd>
        ) : null}
      </div>
    </dl>
  );
}
