import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/departure-dates");

export default function DepartureDatesPage() {
  return (
    <ComingSoonPage
      title="Browse by departure date"
      notificationSubject="departure dates"
      lede="Confirmed dates, route sections and availability will appear here as each journey is ready. The structure is being built section by section."
    />
  );
}
