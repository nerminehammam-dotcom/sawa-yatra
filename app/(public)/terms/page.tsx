import type { Metadata } from "next";

import { createPageMetadata } from "@/app/_metadata";
import { legalPageById } from "@/content/legal-placeholders";

import { LegalPlaceholderPage } from "../_components/LegalPlaceholderPage";

export const metadata: Metadata = createPageMetadata("/terms");

export default function TermsPage() {
  return <LegalPlaceholderPage content={legalPageById.terms} />;
}

