import Link from "next/link";

import { classNames } from "@/components/ui/classNames";
import { temporaryWordmark } from "@/content/assets";
import { siteConfig } from "@/content/site";

import styles from "./Wordmark.module.css";

export interface WordmarkProps {
  href?: string | null;
  tone?: "ink" | "cream";
  size?: "default" | "large";
  className?: string;
}

export function Wordmark({
  href = "/",
  tone = "ink",
  size = "default",
  className,
}: WordmarkProps) {
  const wordmarkClassName = classNames(
    styles.root,
    tone === "cream" && styles.cream,
    size === "large" && styles.large,
    !href && styles.text,
    className,
  );
  const wordmark = <span className={styles.label}>{temporaryWordmark.text}</span>;

  if (!href) {
    return <span className={wordmarkClassName}>{wordmark}</span>;
  }

  return (
    <Link
      className={wordmarkClassName}
      href={href}
      aria-label={`${siteConfig.name} home`}
    >
      {wordmark}
    </Link>
  );
}
