import { classNames } from "./classNames";
import styles from "./Progress.module.css";

export interface ProgressProps {
  value: number;
  max: number;
  label: string;
  valueText?: string;
  className?: string;
}

export function Progress({
  value,
  max,
  label,
  valueText,
  className,
}: ProgressProps) {
  const safeMax = Math.max(1, max);
  const safeValue = Math.min(Math.max(0, value), safeMax);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.header}>
        <span>{label}</span>
        {valueText ? <span className={styles.valueText}>{valueText}</span> : null}
      </div>
      <progress
        className={styles.progress}
        max={safeMax}
        value={safeValue}
        aria-label={label}
        aria-valuetext={valueText}
      />
    </div>
  );
}
