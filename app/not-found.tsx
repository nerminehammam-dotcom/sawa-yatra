import type { Metadata } from "next";

import { NotFoundContent } from "@/app/(public)/_components/NotFoundContent";
import { PublicShell } from "@/app/(public)/_components/PublicShell";
import { createPageMetadata } from "@/app/_metadata";

export const metadata: Metadata = createPageMetadata("/404");

export default function NotFound() {
  return (
    <PublicShell>
      <NotFoundContent />
    </PublicShell>
  );
}
