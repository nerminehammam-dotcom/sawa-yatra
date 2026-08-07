import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 640, 768, 1024, 1440, 1920],
    imageSizes: [64, 96, 160, 256, 384],
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/who-we-are",
        statusCode: 301,
      },
      {
        source: "/membership",
        destination: "/members",
        statusCode: 301,
      },
      {
        source: "/do-it-yourself",
        destination: "/create-your-own-journey",
        statusCode: 301,
      },
      {
        source: "/departures",
        destination: "/caravans/andean",
        statusCode: 301,
      },
      {
        source: "/departures/the-andean-caravan",
        destination: "/caravans/andean",
        statusCode: 301,
      },
      {
        source: "/caravans/the-andean-caravan",
        destination: "/caravans/andean",
        statusCode: 301,
      },
      {
        // /start-here was a joining-point enquiry page that had been disabled
        // with an unconditional notFound(); it rendered only a spinner and no
        // heading. Its stated job — "choose a joining point" — is exactly what
        // /joining-points does, so it redirects there. (7 August 2026)
        source: "/start-here",
        destination: "/joining-points",
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
