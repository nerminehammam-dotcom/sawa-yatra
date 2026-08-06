import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/register-interest");

// The announcement banner says the Andean Caravan is "open for interest," so
// registering interest is an available action, not a future one. This page used
// to say "Registration is coming soon," which flatly contradicted the banner
// that led the visitor here. It now presents the email capture as the open
// action. Delivery is still a mailto until the Resend adapter is switched on;
// that is honest — it opens the visitor's own email and stores nothing.
export default function RegisterInterestPage() {
  return (
    <ComingSoonPage
      label="Open for interest"
      title="Register your interest"
      lede="The Andean Caravan is open for interest. Leave your email and we will write to you first — when dates, joining points and membership open. No account, no payment, nothing to commit."
      notifyIntro="Leave your email and we will write to you first."
      submitLabel="Register your interest"
      mailSubject="Register my interest in the Andean Caravan"
    />
  );
}
