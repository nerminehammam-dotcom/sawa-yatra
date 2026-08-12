import { createPageMetadata } from "@/app/_metadata";

import { TravelSelfIntro } from "../TravelSelfIntro";
import { TravelSelfQuiz } from "../TravelSelfQuiz";

export const metadata = createPageMetadata("/travel-self/take");

export default function TakeTravelSelfPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <TravelSelfQuiz>
        <TravelSelfIntro />
      </TravelSelfQuiz>
    </main>
  );
}

