import Image from "next/image";
import Link from "next/link";

import type { RisoAsset } from "@/components/brand/RisoArtwork";

import styles from "./FieldDocument.module.css";

interface CinematicHeroProps {
  eyebrow: string;
  title: string;
  image: RisoAsset;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}

export function CinematicHero({
  eyebrow,
  title,
  image,
  primary,
  secondary,
}: CinematicHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="home-field-heading">
      <Image
        className={styles.heroImage}
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        style={{
          objectPosition: `${image.focalPoint?.x ?? 50}% ${image.focalPoint?.y ?? 50}%`,
        }}
      />
      <div className={styles.heroScrim} aria-hidden="true" />
      <div className={styles.heroIndex} aria-hidden="true">
        AC / 01
      </div>
      <div className={styles.heroCopy}>
        <p className={styles.heroEyebrow}>{eyebrow}</p>
        <h1 id="home-field-heading">{title}</h1>
        <div className={styles.heroActions}>
          <Link className={styles.primaryAction} href={primary.href}>
            {primary.label} <span aria-hidden="true">→</span>
          </Link>
          <Link className={styles.secondaryAction} href={secondary.href}>
            {secondary.label}
          </Link>
        </div>
      </div>
      <p className={styles.heroCaption}>South America · Peru / Bolivia / Chile</p>
    </section>
  );
}
