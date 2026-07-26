import type { HTMLAttributes } from "react";

import { classNames } from "./classNames";
import styles from "./ContentStatusLabel.module.css";

export type ContentStatus = "LOCKED" | "DRAFT" | "PLACEHOLDER" | "LEGAL REVIEW";

const statusClasses: Record<ContentStatus, string | undefined> = {
  LOCKED: styles.locked,
  DRAFT: styles.draft,
  PLACEHOLDER: styles.placeholder,
  "LEGAL REVIEW": styles.legalReview,
};

export interface ContentStatusLabelProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  status: ContentStatus;
}

export function ContentStatusLabel({
  status,
  className,
  ...props
}: ContentStatusLabelProps) {
  const visibleStatus = status.charAt(0) + status.slice(1).toLocaleLowerCase("en");

  return (
    <span
      {...props}
      className={classNames(styles.root, statusClasses[status], className)}
      aria-label={`Content status: ${status}`}
    >
      {visibleStatus}
    </span>
  );
}
