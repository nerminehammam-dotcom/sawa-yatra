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
          background: "#E7E1D6",
        }}
      >
        <RouteGateMark
          gateColor="#F05A2A"
          height={123}
          routeColor="#98904F"
          width={139}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
