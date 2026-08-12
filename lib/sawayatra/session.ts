import { createHmac, timingSafeEqual } from "node:crypto";

import {
  MEMBERSHIP_STATUSES,
  SIGNED_OUT_VIEWER,
  type ViewerContext,
} from "./model";

interface SessionPayload extends Omit<ViewerContext, "isSignedIn"> {
  readonly expiresAt: number;
}

interface InterestPayload {
  readonly memberId: string;
  readonly journeyId: string;
  readonly lastConfirmedAt: number;
  readonly expiresAt: number;
}

function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function issueSessionToken(
  viewer: Omit<ViewerContext, "isSignedIn">,
  secret: string,
  expiresAt: Date,
): string {
  if (secret.length < 32) throw new Error("Session secret must be at least 32 characters.");
  const payload = Buffer.from(
    JSON.stringify({ ...viewer, expiresAt: expiresAt.getTime() } satisfies SessionPayload),
    "utf8",
  ).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
  now: Date,
): ViewerContext {
  if (!token || !secret || secret.length < 32) return SIGNED_OUT_VIEWER;
  const [payload, presentedSignature, extra] = token.split(".");
  if (!payload || !presentedSignature || extra) return SIGNED_OUT_VIEWER;
  const expected = Buffer.from(signature(payload, secret));
  const presented = Buffer.from(presentedSignature);
  if (expected.length !== presented.length || !timingSafeEqual(expected, presented)) {
    return SIGNED_OUT_VIEWER;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<SessionPayload>;
    if (
      parsed.expiresAt === undefined ||
      parsed.expiresAt <= now.getTime() ||
      !parsed.memberId ||
      !MEMBERSHIP_STATUSES.includes(parsed.membershipStatus as never) ||
      typeof parsed.hasSavedTravelSelf !== "boolean" ||
      !Array.isArray(parsed.declaredJourneyIds) ||
      !Array.isArray(parsed.authoredJourneyIds) ||
      typeof parsed.isClubStaff !== "boolean"
    ) {
      return SIGNED_OUT_VIEWER;
    }
    return Object.freeze({
      isSignedIn: true,
      memberId: parsed.memberId,
      membershipStatus: parsed.membershipStatus,
      hasSavedTravelSelf: parsed.hasSavedTravelSelf,
      declaredJourneyIds: Object.freeze([...parsed.declaredJourneyIds]),
      authoredJourneyIds: Object.freeze([...parsed.authoredJourneyIds]),
      isClubStaff: parsed.isClubStaff,
    }) as ViewerContext;
  } catch {
    return SIGNED_OUT_VIEWER;
  }
}

export function issueInterestToken(
  memberId: string,
  journeyId: string,
  secret: string,
  now: Date,
): string {
  if (secret.length < 32) throw new Error("Session secret must be at least 32 characters.");
  const expires = new Date(now);
  expires.setUTCMonth(expires.getUTCMonth() + 6);
  const payload = Buffer.from(
    JSON.stringify({
      memberId,
      journeyId,
      lastConfirmedAt: now.getTime(),
      expiresAt: expires.getTime(),
    } satisfies InterestPayload),
    "utf8",
  ).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function verifyInterestToken(
  token: string,
  expectedMemberId: string,
  secret: string | undefined,
  now: Date,
): string | null {
  if (!secret || secret.length < 32) return null;
  const [payload, presentedSignature, extra] = token.split(".");
  if (!payload || !presentedSignature || extra) return null;
  const expected = Buffer.from(signature(payload, secret));
  const presented = Buffer.from(presentedSignature);
  if (expected.length !== presented.length || !timingSafeEqual(expected, presented)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<InterestPayload>;
    if (
      parsed.memberId !== expectedMemberId ||
      typeof parsed.journeyId !== "string" ||
      typeof parsed.lastConfirmedAt !== "number" ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= now.getTime()
    ) return null;
    return parsed.journeyId;
  } catch {
    return null;
  }
}
