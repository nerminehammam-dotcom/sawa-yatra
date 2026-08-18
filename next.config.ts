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
        source: "/register-interest",
        destination: "/club/apply",
        statusCode: 301,
      },
      {
        source: "/request-invitation",
        destination: "/club/apply",
        statusCode: 301,
      },
      {
        source: "/journeys/andean-caravan",
        destination: "/journeys/caravans/andean-caravan",
        statusCode: 301,
      },
      {
        source: "/caravans",
        destination: "/journeys/caravans",
        statusCode: 301,
      },
      {
        source: "/caravans/andean",
        destination: "/journeys/caravans/andean-caravan",
        statusCode: 301,
      },
      {
        source: "/caravans/andean/:path*",
        destination: "/journeys/caravans/andean-caravan/:path*",
        statusCode: 301,
      },
      {
        source: "/caravans/andean-caravan/how-it-works",
        destination: "/journeys/caravans/andean-caravan/joining-points",
        statusCode: 301,
      },
      {
        source: "/caravans/andean-caravan",
        destination: "/journeys/caravans/andean-caravan",
        statusCode: 301,
      },
      {
        source: "/caravans/who-else-is-travelling",
        destination: "/journeys/caravans/andean-caravan",
        statusCode: 301,
      },
      {
        source: "/caravans/egypt/:path*",
        destination: "/journeys/caravans/egyptian-caravan",
        statusCode: 301,
      },
      {
        source: "/do-it-yourself",
        destination: "/journeys/create",
        statusCode: 301,
      },
      {
        source: "/create-your-own-journey",
        destination: "/journeys/create",
        statusCode: 301,
      },
      {
        source: "/departure-dates",
        destination: "/journeys/caravans",
        statusCode: 301,
      },
      {
        source: "/departures",
        destination: "/journeys/caravans",
        statusCode: 301,
      },
      {
        source: "/departures/the-andean-caravan",
        destination: "/journeys/caravans/andean-caravan",
        statusCode: 301,
      },
      {
        source: "/departures/desert-coast",
        destination: "/journeys/caravans/andean-caravan/sea-to-stone",
        statusCode: 301,
      },
      {
        source: "/departures/white-city-deep-canyon",
        destination: "/journeys/caravans/andean-caravan/sea-to-stone",
        statusCode: 301,
      },
      {
        source: "/departures/the-stone-road",
        destination: "/journeys/caravans/andean-caravan/the-stone-road",
        statusCode: 301,
      },
      {
        source: "/departures/both-shores",
        destination: "/journeys/caravans/andean-caravan/both-shores",
        statusCode: 301,
      },
      {
        source: "/departures/thin-air-cloud-forest",
        destination: "/journeys/caravans/andean-caravan/both-shores",
        statusCode: 301,
      },
      {
        source: "/departures/silver-and-bone",
        destination: "/journeys/caravans/andean-caravan/the-mirror",
        statusCode: 301,
      },
      {
        source: "/departures/the-mirror",
        destination: "/journeys/caravans/andean-caravan/the-mirror",
        statusCode: 301,
      },
      {
        source: "/departures/atacama",
        destination: "/journeys/caravans/andean-caravan/the-mirror",
        statusCode: 301,
      },
      {
        source: "/departures/the-end-of-the-road",
        destination: "/journeys/caravans/andean-caravan/the-end-of-the-road",
        statusCode: 301,
      },
      {
        source: "/caravans/the-andean-caravan",
        destination: "/journeys/caravans/andean-caravan",
        statusCode: 301,
      },
      {
        source: "/joining-points",
        destination: "/journeys/caravans/andean-caravan/joining-points",
        statusCode: 301,
      },
      {
        source: "/start-here",
        destination: "/journeys/caravans/andean-caravan",
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/journeys/:journey((?!caravans$|create$|join$)[^/]+)",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        source: "/journeys/:journey/people",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Vary", value: "Cookie" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/my/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Vary", value: "Cookie" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/my",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Vary", value: "Cookie" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/api/session",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Vary", value: "Cookie" },
        ],
      },
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
