import type { ButtonHTMLAttributes, ReactNode } from "react";

import { classNames } from "./classNames";
import styles from "./Button.module.css";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  surface?: "light" | "deep";
  fullWidth?: boolean;
  isPending?: boolean;
  pendingLabel?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  surface = "light",
  fullWidth = false,
  isPending = false,
  pendingLabel = "Working…",
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const appearance =
    surface === "deep"
      ? variant === "primary"
        ? styles.primaryDeep
        : styles.secondaryDeep
      : styles[variant];

  return (
    <button
      {...props}
      type={type}
      className={classNames(styles.root, appearance, fullWidth && styles.fullWidth, className)}
      disabled={disabled || isPending}
      aria-busy={isPending || undefined}
    >
      {isPending ? pendingLabel : children}
    </button>
  );
}
