import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentViewer } from "@/lib/sawayatra/server";
import styles from "../../member.module.css";
export const metadata: Metadata = { title: "My application", robots: { index: false, follow: false } };
export default async function ApplicationPage(){ const viewer=await getCurrentViewer(); if(!viewer.isSignedIn||viewer.membershipStatus==="member") notFound(); return <main className={styles.page} id="main-content"><header><p>Club application</p><h1>My application</h1></header><section><h2>Status</h2><p>{viewer.membershipStatus}</p><p>Only accepted members receive member journey access.</p></section></main>; }

