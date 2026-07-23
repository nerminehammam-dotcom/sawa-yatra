import type { Metadata } from "next";

import { createPageMetadata } from "@/app/_metadata";
import { legalPageById } from "@/content/legal-placeholders";

import { LegalPlaceholderPage } from "../_components/LegalPlaceholderPage";

export const metadata: Metadata = createPageMetadata("/privacy");

export default function PrivacyPage() {
  return <LegalPlaceholderPage content={legalPageById.privacy} />;
}

