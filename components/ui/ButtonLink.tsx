import Link from "next/link";
import type { ComponentProps } from "react";

import { classNames } from "./classNames";
import styles from "./Button.module.css";

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: "primary" | "secondary";
  surface?: "light" | "deep";
  fullWidth?: boolean;
}

export function ButtonLink({
  variant = "primary",
  surface = "light",
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  const appearance =
    surface === "deep"
      ? variant === "primary"
        ? styles.primaryDeep
        : styles.secondaryDeep
      : styles[variant];

  return (
    <Link
      {...props}
      className={classNames(styles.root, appearance, fullWidth && styles.fullWidth, className)}
    />
  );
}
