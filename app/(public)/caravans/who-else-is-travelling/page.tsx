import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata = createPageMetadata("/caravans/who-else-is-travelling");

export default function WhoElseIsTravellingPage() {
  return (
    <ComingSoonPage
      label="Coming soon — by design"
      title="Meet the travelling group"
      lede="Group signals will appear only when they can be useful without exposing anyone's identity: enough registrations, clear consent and no individual member profiles."
      notifyIntro="Interested in helping the first group take shape? Start with the same expression-of-interest path used across the Caravan."
      submitLabel="Register your interest"
      actionHref="/register-interest"
      actionNote="No names or private details will be published. No account or payment is required."
      onwardLinks={[
        {
          href: "/caravans/andean#full-route-map",
          label: "Explore the full route",
          description: "Four atlas plates showing the places, transport and terrain.",
        },
        {
          href: "/caravans/andean-caravan/how-it-works",
          label: "Joining & leaving",
          description: "Build a consecutive run and compare every joining gate.",
        },
        {
          href: "/travel-self",
          label: "Meet your Travel Self",
          description: "Eight short questions about how you travel.",
        },
      ]}
    />
  );
}
