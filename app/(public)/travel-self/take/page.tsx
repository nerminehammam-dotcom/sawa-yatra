import { createPageMetadata } from "@/app/_metadata";

import { TakeTravelSelfQuestionnaire } from "./TakeTravelSelfQuestionnaire";

export const metadata = createPageMetadata("/travel-self/take");

export default function TakeTravelSelfPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <TakeTravelSelfQuestionnaire />
    </main>
  );
}
