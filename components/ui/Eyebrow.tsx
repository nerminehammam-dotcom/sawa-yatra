import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./classNames";
import styles from "./Eyebrow.module.css";

export interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  tone?: "inherit" | "muted" | "accent" | "honey";
}

export function Eyebrow({
  children,
  tone = "inherit",
  className,
  ...props
}: EyebrowProps) {
  return (
    <p
      {...props}
      className={classNames(styles.root, tone !== "inherit" && styles[tone], className)}
    >
      {children}
    </p>
  );
}
