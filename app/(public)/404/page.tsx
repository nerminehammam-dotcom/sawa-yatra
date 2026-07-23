import type { Metadata } from "next";

import { createPageMetadata } from "@/app/_metadata";
import { NotFoundContent } from "@/app/(public)/_components/NotFoundContent";

export const metadata: Metadata = createPageMetadata("/404");

export default function ExplicitNotFoundPage() {
  return <NotFoundContent />;
}
