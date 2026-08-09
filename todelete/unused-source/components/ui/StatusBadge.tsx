import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./classNames";
import styles from "./StatusBadge.module.css";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  status?: "neutral" | "success" | "warning" | "error" | "info";
}

export function StatusBadge({
  children,
  status = "neutral",
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span {...props} className={classNames(styles.root, styles[status], className)}>
      {children}
    </span>
  );
}
