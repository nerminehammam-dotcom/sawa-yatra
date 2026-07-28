import { ImageResponse } from "next/og";

import { TRAVEL_SELF_COPY } from "@/content/travel-self/copy";
import { FAMILIES, type FamilyKey } from "@/content/travel-self/families";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function familyFor(value: string) {
  return FAMILIES[value as FamilyKey] ?? FAMILIES.LRLR;
}

export default async function TravelSelfOpenGraphImage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
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
          color: "#E7E1D6",
          background: "#F05A2A",
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
