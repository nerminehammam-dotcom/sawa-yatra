import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: { absolute: "Create your own journey | Sawayatra" },
  description: null,
  alternates: { canonical: absoluteUrl("/journeys/create") },
  robots: { index: false, follow: true },
  openGraph: null,
  twitter: null,
};

export default function CreateJourneyPage() {
  return <main id="main-content" tabIndex={-1} />;
}
