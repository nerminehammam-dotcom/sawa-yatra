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
          background: "#FAE3B1",
        }}
      >
        <RouteGateMark
          gateColor="#7D2027"
          height={350}
          routeColor="#6E6A28"
          width={395}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
