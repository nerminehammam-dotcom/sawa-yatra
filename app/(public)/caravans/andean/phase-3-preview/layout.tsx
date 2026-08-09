import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Andean Caravan Phase 3 specimen",
  robots: { index: false, follow: false },
};

export default function PhaseThreePreviewLayout({ children }: { children: ReactNode }) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.CARAVAN_PHASE3_PREVIEW !== "1"
  ) {
    notFound();
  }

  return <>{children}</>;
}

