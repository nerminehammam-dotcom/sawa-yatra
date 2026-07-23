import type { Metadata } from "next";

import { createPageMetadata } from "@/app/_metadata";
import { travelSelfPageContent } from "@/content/site";

import { TravelSelfQuiz } from "./TravelSelfQuiz";

export const metadata: Metadata = createPageMetadata("/travel-self");

export default function TravelSelfPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <TravelSelfQuiz pageContent={travelSelfPageContent} />
    </main>
  );
}
