import { NextResponse } from "next/server";

import { getCurrentViewer } from "@/lib/sawayatra/server";

export async function GET() {
  const viewer = await getCurrentViewer();
  return NextResponse.json(
    {
      isSignedIn: viewer.isSignedIn,
      membershipStatus: viewer.membershipStatus,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
        Vary: "Cookie",
      },
    },
  );
}

