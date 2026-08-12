"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCurrentViewer, getJourneyBySlug } from "@/lib/sawayatra/server";
import { journeyPublicHrefForSlug } from "@/lib/sawayatra/journey-registry";
import { issueInterestToken } from "@/lib/sawayatra/session";

function cookieName(journeyId: string): string {
  return `sawayatra_interest_${journeyId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

async function requireDeclarationContext(slug: string) {
  const viewer = await getCurrentViewer();
  const journey = getJourneyBySlug(slug);
  const secret = process.env.SAWAYATRA_SESSION_SECRET;
  if (
    !journey ||
    viewer.membershipStatus !== "member" ||
    !viewer.memberId ||
    !secret ||
    secret.length < 32
  ) notFound();
  return { viewer, journey, secret };
}

export async function declareInterestAction(formData: FormData) {
  const slug = String(formData.get("journey") ?? "");
  const { viewer, journey, secret } = await requireDeclarationContext(slug);
  if (journey.status !== "open") notFound();
  const now = new Date();
  const expires = new Date(now);
  expires.setUTCMonth(expires.getUTCMonth() + 6);
  (await cookies()).set(
    cookieName(journey.id),
    issueInterestToken(viewer.memberId!, journey.id, secret, now),
    {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires,
    },
  );
  revalidatePath(
    journeyPublicHrefForSlug(journey.slug) ?? `/journeys/${journey.slug}`,
  );
}

export async function withdrawInterestAction(formData: FormData) {
  const slug = String(formData.get("journey") ?? "");
  const { journey } = await requireDeclarationContext(slug);
  (await cookies()).delete(cookieName(journey.id));
  revalidatePath(
    journeyPublicHrefForSlug(journey.slug) ?? `/journeys/${journey.slug}`,
  );
}

export async function reconfirmInterestAction(formData: FormData) {
  return declareInterestAction(formData);
}
