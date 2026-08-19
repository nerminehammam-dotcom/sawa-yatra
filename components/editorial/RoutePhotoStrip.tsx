import Image from "next/image";

import styles from "./RoutePhotoStrip.module.css";

export interface RoutePhoto {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly width: number;
  readonly height: number;
}

interface RoutePhotoStripProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly photos: readonly RoutePhoto[];
}

export function RoutePhotoStrip({
  id,
  eyebrow,
  title,
  photos,
}: RoutePhotoStripProps) {
  return (
    <section className={styles.root} aria-labelledby={`${id}-heading`}>
      <header className={styles.header}>
        <p>{eyebrow}</p>
        <h2 id={`${id}-heading`}>{title}</h2>
      </header>
      <div className={styles.photographs}>
        {photos.map((photo) => (
          <figure key={photo.src}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 760px) 100vw, 33vw"
            />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
