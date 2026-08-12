import type { Metadata } from "next";

import { createPageMetadata } from "@/app/_metadata";
import { FAMILIES, type FamilyKey } from "@/content/travel-self/families";
import { absoluteUrl } from "@/lib/site-url";

import { TravelSelfIntro } from "./TravelSelfIntro";

function isFamilyKey(value: string | undefined): value is FamilyKey {
  return Boolean(value && value in FAMILIES);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const base = createPageMetadata("/travel-self");
  const query = await searchParams;
  const rawKey = Array.isArray(query.self) ? query.self[0] : query.self;
  if (!isFamilyKey(rawKey)) return base;

  const family = FAMILIES[rawKey];
  const image = {
    url: absoluteUrl(`/travel-self/share/${rawKey}`),
    width: 1200,
    height: 630,
    alt: `${family.name}, ${family.readout}`,
  };

  return {
    ...base,
    openGraph: { ...base.openGraph, images: [image] },
    twitter: { ...base.twitter, images: [{ url: image.url, alt: image.alt }] },
  };
}

export default function TravelSelfPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <TravelSelfIntro />
    </main>
  );
}
