import Image from "next/image";

import type { RisoAsset } from "@/components/brand/RisoArtwork";

import styles from "./FieldDocument.module.css";

interface RegionalChapterProps {
  number: string;
  place: string;
  note: string;
  image: RisoAsset;
  tone: "sun" | "pink" | "clay" | "olive";
}

export function RegionalChapter({
  number,
  place,
  note,
  image,
  tone,
}: RegionalChapterProps) {
  return (
    <article className={styles.chapter} data-tone={tone}>
      <div className={styles.chapterField}>
        <span>{number}</span>
        <h3>{place}</h3>
        <p>{note}</p>
      </div>
      <figure className={styles.chapterImage}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          style={{
            objectPosition: `${image.focalPoint?.x ?? 50}% ${image.focalPoint?.y ?? 50}%`,
          }}
        />
        <figcaption>FIELD NOTE / {place.toUpperCase()}</figcaption>
      </figure>
    </article>
  );
}
