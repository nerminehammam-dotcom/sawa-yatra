import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  verifyInterestToken,
  verifySessionToken,
} from "@/lib/sawayatra/session";
import { journeyIdForSlug } from "@/lib/sawayatra/journey-registry";

/**
 * Optimistic, pre-render pool gate. The page repeats the full authorization
 * check; this early check exists so an unauthorized response is a real 404
 * rather than a streamed 200 carrying not-found UI.
 */
export function proxy(request: NextRequest) {
  const secret = process.env.SAWAYATRA_SESSION_SECRET;
  const viewer = verifySessionToken(
    request.cookies.get("sawayatra_session")?.value,
    secret,
    new Date(),
  );
  const pathname = request.nextUrl.pathname;

  if (pathname === "/my" || pathname.startsWith("/my/")) {
    if (!viewer.isSignedIn) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  const journeyId = journeyIdForSlug(slug);
  const cookieDeclaration =
    viewer.memberId && journeyId
      ? request.cookies
          .getAll()
          .filter((cookie) => cookie.name.startsWith("sawayatra_interest_"))
          .some(
            (cookie) =>
              verifyInterestToken(
                cookie.value,
                viewer.memberId!,
                secret,
                new Date(),
              ) === journeyId,
          )
      : false;
  const authorized =
    journeyId !== null &&
    viewer.membershipStatus === "member" &&
    (viewer.declaredJourneyIds.includes(journeyId) || cookieDeclaration);

  if (!authorized) {
    return new Response(null, {
      status: 404,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/my", "/my/:path*", "/journeys/:journey/people"],
};
