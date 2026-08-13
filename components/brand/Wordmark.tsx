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
   * The commissioned full-colour wordmark, replacing the traced single-colour
   * mark on 8 August 2026. Served as a file rather than inlined: it appears
   * twice per page, in the navigation and the footer, and ~40KB inlined twice
   * on every route is worse than one cached request. Decorative here - every
   * caller either sets aria-label on the link or role="img" on the wrapper.
   */
  const wordmark = (
    /* next/image is deliberately not used. It does not optimise SVG without
       dangerouslyAllowSVG, which loosens the image policy site-wide for no
       gain on a file that is already vector and already minified. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.label}
      src="/assets/brand/sawayatra-wordmark-309c304e.svg"
      alt=""
      width={1326}
      height={471}
      aria-hidden="true"
    />
  );

  if (!href) {
    return (
      <span
        className={wordmarkClassName}
        role="img"
        aria-label={siteConfig.name}
      >
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
