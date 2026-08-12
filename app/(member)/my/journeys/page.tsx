import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journeyPublicHrefForSlug } from "@/lib/sawayatra/journey-registry";
import { getCurrentViewer, journeys } from "@/lib/sawayatra/server";
import styles from "../../member.module.css";
export const metadata: Metadata = { title: "My journeys", robots: { index: false, follow: false } };
export default async function MyJourneysPage(){ const viewer=await getCurrentViewer(); if(viewer.membershipStatus!=="member") notFound(); const declared=journeys.filter(j=>viewer.declaredJourneyIds.includes(j.id)); return <main className={styles.page} id="main-content"><header><p>My Sawayatra</p><h1>My journeys</h1></header><section>{declared.length===0?<><h2>Nothing declared yet.</h2><p>Interest is not a booking and no journey is required to remain a member.</p><Link href="/journeys">Read the journeys</Link></>:<ul>{declared.map(j=><li key={j.id}><Link href={journeyPublicHrefForSlug(j.slug) ?? "/journeys"}>{j.title}</Link></li>)}</ul>}</section></main>; }
