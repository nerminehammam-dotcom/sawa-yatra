import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentViewer } from "@/lib/sawayatra/server";
import styles from "../../member.module.css";
export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };
export default async function AccountPage(){ const viewer=await getCurrentViewer(); if(!viewer.isSignedIn) notFound(); return <main className={styles.page} id="main-content"><header><p>Account</p><h1>My account</h1></header><section><h2>Membership status</h2><p>{viewer.membershipStatus}</p></section></main>; }

