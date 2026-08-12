import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: { absolute: "Join an existing journey | Sawayatra" },
  description: null,
  alternates: { canonical: absoluteUrl("/journeys/join") },
  robots: { index: false, follow: true },
  openGraph: null,
  twitter: null,
};

export default function JoinJourneyPage() {
  return <main id="main-content" tabIndex={-1} />;
}
