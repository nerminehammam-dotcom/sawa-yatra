import type { RisoAsset } from "@/components/brand/RisoArtwork";
import { PHOTOGRAPH_CREDIT } from "@/content/photograph-plates";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { JourneyPlate } from "./JourneyPlate";
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
              <JourneyPlate asset={asset} />
            </li>
          ))}
        </ul>

        {/*
          Cookson Adventures were the only operator in twenty-seven surveyed who
          made any claim about owning their imagery. For a club founded by a
          photographic artist whose photographs are the product, this is not a
          claim - it is a fact, and it costs one line.
        */}
        <p className={styles.credit}>{PHOTOGRAPH_CREDIT}</p>
      </Container>
    </Section>
  );
}
