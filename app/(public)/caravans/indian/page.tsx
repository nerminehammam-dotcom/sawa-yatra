import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/caravans/indian");

export default function IndianCaravanPage() {
  return (
    <ComingSoonPage
      title="The Indian Caravan"
      lede="This Caravan is coming soon. Route information will be added section by section when the approved details are ready."
    />
  );
}
