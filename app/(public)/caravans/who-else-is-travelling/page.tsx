import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/caravans/who-else-is-travelling");

export default function WhoElseIsTravellingPage() {
  return (
    <ComingSoonPage
      title="See who else is travelling"
      lede="This section is coming soon. Group information will be added only when it can be shown clearly, privately and with enough registrations to be useful."
    />
  );
}
