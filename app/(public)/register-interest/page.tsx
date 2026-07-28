import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/register-interest");

export default function RegisterInterestPage() {
  return (
    <ComingSoonPage
      title="Register your interest"
      lede="Registration is coming soon. The process will open when the remaining Caravan information and follow-up structure are ready."
    />
  );
}
