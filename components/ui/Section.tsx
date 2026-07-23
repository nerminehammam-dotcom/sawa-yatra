import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./classNames";
import styles from "./Section.module.css";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  ground?: "cream" | "butter" | "brick" | "olive" | "ink" | "transparent";
  spacing?: "default" | "flush";
}

export function Section({
  children,
  ground = "cream",
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      {...props}
      className={classNames(
        styles.root,
        styles[ground],
        spacing === "flush" && styles.flush,
        className,
      )}
    >
      {children}
    </section>
  );
}
