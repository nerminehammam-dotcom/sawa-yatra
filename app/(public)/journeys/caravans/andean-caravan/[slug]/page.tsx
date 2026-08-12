import type { Metadata } from "next";

import CanonicalCaravanProductPage, {
  generateMetadata as generateLegacyMetadata,
  generateStaticParams,
} from "@/app/(public)/caravans/andean/[slug]/page";
import { absoluteUrl } from "@/lib/site-url";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export { generateStaticParams };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const metadata = await generateLegacyMetadata(props);
  const { slug } = await props.params;
  const canonicalSlug = slug === "the-stone-road" ? "sea-to-stone" : slug;
  return {
    ...metadata,
    alternates: {
      canonical: absoluteUrl(
        `/journeys/caravans/andean-caravan/${canonicalSlug}`,
      ),
    },
  };
}

export default CanonicalCaravanProductPage;
