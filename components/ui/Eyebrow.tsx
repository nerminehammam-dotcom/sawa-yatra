import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./classNames";
import styles from "./Eyebrow.module.css";

export interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  tone?: "inherit" | "muted" | "accent" | "honey";
  kind?: "decorative" | "decision";
}

export function Eyebrow({
  children,
  tone = "inherit",
  kind = "decorative",
  className,
  ...props
}: EyebrowProps) {
  return (
    <p
      {...props}
      className={classNames(
        styles.root,
        kind === "decision" && styles.decision,
        tone !== "inherit" && styles[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
