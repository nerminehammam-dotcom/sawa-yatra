import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentViewer } from "@/lib/sawayatra/server";
import styles from "../../member.module.css";
export const metadata: Metadata = { title: "My connections", robots: { index: false, follow: false } };
export default async function ConnectionsPage(){ const viewer=await getCurrentViewer(); if(viewer.membershipStatus!=="member") notFound(); return <main className={styles.page} id="main-content"><header><p>My Sawayatra</p><h1>Connections</h1></header><section><h2>A record, not a directory.</h2><p>Mutual reveals appear here with first name, photograph and the journey where you recognised one another. There is no member discovery, messaging or contact action on this page.</p></section></main>; }

