import type { Metadata } from "next";

import JourneyPage from "@/app/(public)/departures/[slug]/page";
import { createPageMetadata } from "@/app/_metadata";

export const metadata: Metadata = createPageMetadata(
  "/caravans/the-andean-caravan",
);

export default function AndeanCaravanPage() {
  return JourneyPage({
    params: Promise.resolve({ slug: "the-andean-caravan" }),
  });
}
