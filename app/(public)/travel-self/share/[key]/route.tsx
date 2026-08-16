import { ImageResponse } from "next/og";

import { TRAVEL_SELF_COPY } from "@/content/travel-self/copy";
import { FAMILIES, type FamilyKey } from "@/content/travel-self/families";

const size = { width: 1200, height: 630 };

function familyFor(value: string) {
  return FAMILIES[value as FamilyKey] ?? FAMILIES.LRLR;
}

export async function GET(
  _request: Request,
  {
  params,
  }: {
    params: Promise<{ key: string }>;
  },
) {
  const { key } = await params;
  const family = familyFor(key);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "72px",
          // Palette literals, not tokens: ImageResponse renders outside the
          // document. --ink on --signal as of the 15 August 2026 colour pass.
          // That pairing measures 3.86, which is large-text only - it holds
          // here because the name below is set at 116px, and nowhere on this
          // card is smaller than 18px. Do not reuse this pairing at body size.
          color: "#27231F",
          background: "#D9522F",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 116, lineHeight: 0.95 }}>
          {family.name}
        </div>
        <div style={{ display: "flex", marginTop: 42, fontSize: 22, letterSpacing: "0.18em" }}>
          {family.readout}
        </div>
        <div style={{ display: "flex", marginTop: 74, fontSize: 18, letterSpacing: "0.26em" }}>
          {TRAVEL_SELF_COPY.sharePronunciation}
        </div>
      </div>
    ),
    size,
  );
}
