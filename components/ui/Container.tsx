import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./classNames";
import styles from "./Container.module.css";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: "default" | "narrow" | "full";
}

export function Container({
  children,
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={classNames(
        styles.root,
        size === "narrow" && styles.narrow,
        size === "full" && styles.full,
        className,
      )}
    >
      {children}
    </div>
  );
}
