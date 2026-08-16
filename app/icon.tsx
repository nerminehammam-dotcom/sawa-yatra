import { ImageResponse } from "next/og";

import { RouteGateMark } from "@/components/brand/RouteGateMark";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          // Palette literals, not tokens: ImageResponse renders outside the
          // document, so CSS custom properties are not available here. Keep
          // these in step with styles/tokens.css by hand.
          // paper, signal, olive as of the 15 August 2026 colour pass.
          background: "#F5EFE2",
        }}
      >
        <RouteGateMark
          gateColor="#D9522F"
          height={350}
          routeColor="#8E9130"
          width={395}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
