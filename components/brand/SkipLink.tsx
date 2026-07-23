import { classNames } from "@/components/ui/classNames";

import styles from "./SkipLink.module.css";

export interface SkipLinkProps {
  href?: `#${string}`;
  label?: string;
  className?: string;
}

export function SkipLink({
  href = "#main-content",
  label = "Skip to main content",
  className,
}: SkipLinkProps) {
  return (
    <a className={classNames(styles.root, className)} href={href}>
      {label}
    </a>
  );
}
