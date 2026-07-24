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
          background: "#E7E1D6",
        }}
      >
        <RouteGateMark
          gateColor="#F05A2A"
          height={350}
          routeColor="#98904F"
          width={395}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
