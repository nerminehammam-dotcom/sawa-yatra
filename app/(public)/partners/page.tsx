import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/partners");

export default function PartnersPage() {
  return (
    <ComingSoonPage
      title="Our partners"
      lede="This section is coming soon. Partner information will be added here when the structure and details are ready."
    />
  );
}
