import Link from "next/link";

import { classNames } from "@/components/ui/classNames";
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
  /*
   * The current horizontal Sawayatra wordmark. Served as a file rather than
   * inlined so its repeated header, menu and footer instances share one cached
   * request. The image keeps its descriptive alt text at every placement.
   */
  const wordmark = (
    /* next/image is deliberately not used. It does not optimise SVG without
       dangerouslyAllowSVG, which loosens the image policy site-wide for no
       gain on a file that is already vector and already minified. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.label}
      src="/assets/brand/sawayatra-logo-web.svg"
      alt={siteConfig.name}
      width={1964}
      height={394}
    />
  );

  if (!href) {
    return (
      <span className={wordmarkClassName}>
        {wordmark}
      </span>
    );
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
