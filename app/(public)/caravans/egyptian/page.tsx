import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/caravans/egyptian");

export default function EgyptianCaravanPage() {
  return (
    <ComingSoonPage
      title="The Egyptian Caravan"
      lede="This Caravan is coming soon. Route information will be added section by section when the approved details are ready."
    />
  );
}
