import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/journeys");

export default function JourneysPage() {
  return (
    <ComingSoonPage
      title="Journeys"
      lede="Shorter trips, one country at a time, for members who want the Sawayatra way of travelling without clearing a season. We are building the first three now."
    />
  );
}
