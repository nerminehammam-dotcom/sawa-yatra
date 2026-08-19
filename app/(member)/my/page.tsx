import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentViewer } from "@/lib/sawayatra/server";

import styles from "../member.module.css";

export const metadata: Metadata = { title: "My Sawayatra", robots: { index: false, follow: false } };

export default async function MyPage() {
  const viewer = await getCurrentViewer();
  if (viewer.membershipStatus !== "member") notFound();
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header><p>My Sawayatra</p><h1>Your place between journeys.</h1></header>
      {viewer.declaredJourneyIds.length === 0 ? (
        <section>
          <h2>No journey needs choosing yet.</h2>
          <p>
            Membership is a supported steady state. Keep Your Travel Fingerprint,
            read the roads, and declare interest only when one holds you.
          </p>
          <nav><Link href="/journeys">Read the journeys</Link><Link href="/my/travel-self">Your Travel Fingerprint</Link></nav>
        </section>
      ) : (
        <section><h2>Your journeys</h2><p>You are circling {viewer.declaredJourneyIds.length} journey.</p><Link href="/my/journeys">See your journeys</Link></section>
      )}
    </main>
  );
}
