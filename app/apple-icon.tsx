import { ImageResponse } from "next/og";

import { RouteGateMark } from "@/components/brand/RouteGateMark";

// iOS home-screen icon (180×180). Same route-through-a-gate mark as app/icon,
// scaled for the smaller canvas.
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
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
          background: "#e7e1d6",
        }}
      >
        <RouteGateMark
          gateColor="#f05a2a"
          height={123}
          routeColor="#98904f"
          width={139}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
