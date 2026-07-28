import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/create-your-own-journey");

export default function CreateYourOwnJourneyPage() {
  return (
    <ComingSoonPage
      title="Create your own journey"
      lede="A route built with you rather than chosen from a list. You tell us where, when and how you want to travel, and we put it together. It is not open yet because we are still working out how to do it at the standard a Caravan is held to, and that is the only reason."
    />
  );
}
