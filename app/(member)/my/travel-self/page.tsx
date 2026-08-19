import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentViewer } from "@/lib/sawayatra/server";
import styles from "../../member.module.css";
export const metadata: Metadata = { title: "Your Travel Fingerprint", robots: { index: false, follow: false } };
export default async function MyTravelSelfPage(){ const viewer=await getCurrentViewer(); if(viewer.membershipStatus!=="member") notFound(); return <main className={styles.page} id="main-content"><header><p>My Sawayatra</p><h1>Your Travel Fingerprint</h1></header><section><h2>{viewer.hasSavedTravelSelf?"Your passport is saved.":"Save Your Travel Fingerprint to join the matching layer."}</h2><p>Retaking updates the same passport in every journey pool. Optional nationality, gender and age band may be added or removed independently. Removing one stops future display; it cannot un-show what somebody already saw, and it never voids a completed reveal.</p><Link href="/travel-self/take">Retake the questionnaire</Link></section></main>; }
