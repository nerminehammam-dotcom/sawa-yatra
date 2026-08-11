import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/ui/ComingSoonPage";

export const metadata: Metadata = {
  title: { absolute: "The Egyptian Caravan | Sawayatra" },
  description:
    "The Egyptian Caravan is in development. Its route, dates and sections are not published yet.",
  robots: { index: false, follow: true },
};

const onwardLinks = [
  {
    href: "/caravans/andean",
    label: "The Andean Caravan",
    description:
      "Explore the complete 71-day route through Peru, Bolivia and Chile.",
  },
  {
    href: "/caravans",
    label: "All Caravans",
    description: "Return to the Caravan collection.",
  },
] as const;

export default function EgyptianCaravanPage() {
  return (
    <ComingSoonPage
      label="Caravan in development"
      title="The Egyptian Caravan"
      lede="Its place in the collection is now visible, but the route, dates, sections and joining points are not ready to publish. Nothing on this page should be read as a confirmed itinerary."
      notifyIntro="Only the Andean Caravan is currently open for interest."
      submitLabel="View all Caravans"
      actionHref="/caravans"
      actionNote="The Egyptian Caravan will remain marked in development until its route is ready."
      onwardLinks={onwardLinks}
    />
  );
}
