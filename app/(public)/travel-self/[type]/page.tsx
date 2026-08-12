import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import styles from "../travel-self.module.css";
import {
  FAMILY_BY_SLUG,
  FAMILY_LIST,
  familySlug,
} from "@/content/travel-self/families";
import {
  BOUNDARY_PERSONAL,
  PASSPORT_LABELS,
  RESULT_INVENTORY_HEADING,
  SEEKER_PLATE,
} from "@/content/travel-self/travel-self-model";
import { absoluteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return FAMILY_LIST.map((family) => ({ type: familySlug(family) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const family = FAMILY_BY_SLUG[type];
  if (!family) return {};
  const url = absoluteUrl(`/travel-self/${type}`);
  return {
    title: `${family.name} Travel Self`,
    description: family.essence,
    alternates: { canonical: url },
    openGraph: { title: family.name, description: family.essence, url },
  };
}

export default async function ArchetypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const family = FAMILY_BY_SLUG[type];
  if (!family) notFound();

  return (
    <main className={styles.passportStage} id="main-content" tabIndex={-1}>
      <div className={styles.passportWrap}>
        <article className={styles.passportCard}>
          <header className={styles.passportHead}>
            <p>{RESULT_INVENTORY_HEADING}</p>
            <h1>{family.name}</h1>
            <p className={styles.passportReadout}>{family.readout}</p>
          </header>

          {family.name === "The Seeker" ? (
            <div className={styles.passportPlate}>
              <Image
                alt={SEEKER_PLATE.alt}
                className={styles.passportPlateImage}
                height={1344}
                preload
                sizes="(max-width: 768px) 100vw, 48rem"
                src={SEEKER_PLATE.src}
                width={896}
              />
            </div>
          ) : null}

          <div className={styles.passportBody}>
            <dl>
              <div>
                <dt>{PASSPORT_LABELS.essence}</dt>
                <dd>{family.essence}</dd>
              </div>
              <div>
                <dt>{PASSPORT_LABELS.bring}</dt>
                <dd>{family.whatYouBring}</dd>
              </div>
            </dl>
          </div>
        </article>

        <div className={styles.passportOutside}>
          <p className={styles.passportBoundary}>{BOUNDARY_PERSONAL}</p>
        </div>
      </div>
    </main>
  );
}
