import type { RisoAsset } from "@/components/brand/RisoArtwork";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import styles from "./JourneyGallery.module.css";

interface JourneyGalleryProps {
  journeySlug: string;
  images: readonly RisoAsset[];
}

export function JourneyGallery({
  journeySlug,
  images,
}: JourneyGalleryProps) {
  if (images.length === 0) return null;

  const headingId = `${journeySlug}-gallery-heading`;

  return (
    <Section
      className={styles.section}
      ground="cream"
      aria-labelledby={headingId}
    >
      <Container>
        <div className={styles.heading}>
          <h2 id={headingId}>Photographs from the route</h2>
          <p>Scenes from this section of the Andean Caravan.</p>
        </div>
        <ul className={styles.gallery}>
          {images.map((asset) => (
            <li className={styles.item} key={asset.src}>
              <RisoArtwork
                asset={asset}
                aspectRatio="auto"
                className={styles.artwork}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 34vw"
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
