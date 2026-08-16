import type { ContentStatus } from "@/components/ui/ContentStatusLabel";
import type { CanonicalCaravanImageSlug } from "@/content/andean-caravan-images";

/**
 * The approved Andean Caravan client PDFs, served from public/assets/guides.
 *
 * These are the web set: images resampled to 1800px and re-encoded, text layer
 * untouched, so every document stays searchable, selectable and readable by a
 * screen reader. The full-quality masters live outside the repository in
 * output/pdf and are not served.
 *
 * `sizeLabel` and `pages` are stated so a reader knows what they are about to
 * download before they commit to it on a metered connection. They describe the
 * file only - no claim is made about the journey itself.
 */
export interface CaravanDocument {
  readonly id: string;
  /** Section number as printed on the document, or null for the whole guide. */
  readonly number: string | null;
  readonly title: string;
  /** What the document covers. Factual scope, not a description of the travel. */
  readonly scope: string;
  readonly href: string;
  readonly pages: number;
  readonly bytes: number;
  readonly sizeLabel: string;
  readonly contentStatus: ContentStatus;
  /** Section page this document belongs to, if any. */
  readonly sectionSlug: CanonicalCaravanImageSlug | null;
}

const GUIDE_PATH = "/assets/guides";

export const andeanCaravanDocuments: readonly CaravanDocument[] = [
  {
    id: "complete",
    number: null,
    title: "The complete client journey guide",
    scope: "The whole 71-day passage, Lima to the end of the Carretera Austral, with all four sections",
    href: `${GUIDE_PATH}/andean-caravan-00-complete.pdf`,
    pages: 57,
    bytes: 5_533_229,
    sizeLabel: "5.5 MB",
    contentStatus: "DRAFT",
    sectionSlug: null,
  },
  {
    id: "section-01",
    number: "01",
    title: "Sea to Stone",
    scope: "Days 1 to 23, Lima to Puno",
    href: `${GUIDE_PATH}/andean-caravan-01-sea-to-stone.pdf`,
    pages: 18,
    bytes: 1_726_376,
    sizeLabel: "1.7 MB",
    contentStatus: "DRAFT",
    sectionSlug: "sea-to-stone",
  },
  {
    id: "section-02",
    number: "02",
    title: "Both Shores",
    scope: "Days 24 to 39, Puno to Sucre",
    href: `${GUIDE_PATH}/andean-caravan-02-both-shores.pdf`,
    pages: 14,
    bytes: 2_941_727,
    sizeLabel: "2.9 MB",
    contentStatus: "DRAFT",
    sectionSlug: "both-shores",
  },
  {
    id: "section-03",
    number: "03",
    title: "The Mirror",
    scope: "Days 40 to 57, Sucre to Santiago",
    href: `${GUIDE_PATH}/andean-caravan-03-the-mirror.pdf`,
    pages: 15,
    bytes: 2_151_145,
    sizeLabel: "2.2 MB",
    contentStatus: "DRAFT",
    sectionSlug: "the-mirror",
  },
  {
    id: "section-04",
    number: "04",
    title: "The End of the Road",
    scope: "Days 58 to 71, Santiago to Balmaceda",
    href: `${GUIDE_PATH}/andean-caravan-04-the-end-of-the-road.pdf`,
    pages: 13,
    bytes: 1_168_236,
    sizeLabel: "1.2 MB",
    contentStatus: "DRAFT",
    sectionSlug: "the-end-of-the-road",
  },
] as const;

export const andeanCaravanCompleteGuide = andeanCaravanDocuments[0];

/**
 * The document for a section page. `the-stone-road` canonicalises to
 * `sea-to-stone` throughout the route, and the printed guide follows the same
 * division, so both resolve to section 01.
 */
export function getSectionDocument(slug: string): CaravanDocument | undefined {
  const target = slug === "the-stone-road" ? "sea-to-stone" : slug;
  return andeanCaravanDocuments.find((doc) => doc.sectionSlug === target);
}
