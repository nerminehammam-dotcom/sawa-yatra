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
        source: "/caravans",
        destination: "/caravans/andean",
        statusCode: 301,
      },
      {
        source: "/membership",
        destination: "/members",
        statusCode: 301,
      },
      {
        // Spec v3.1 §2.3 — "Create your own" ceases to be a destination and
        // becomes the Start one button on /journeys.
        source: "/do-it-yourself",
        destination: "/journeys",
        statusCode: 301,
      },
      {
        source: "/create-your-own-journey",
        destination: "/journeys",
        statusCode: 301,
      },
      {
        // Departure dates are absorbed into /journeys (Leaving on a date /
        // Still forming) per spec v3.1 §2.3.
        source: "/departure-dates",
        destination: "/journeys",
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
        source: "/departures/desert-coast",
        destination: "/caravans/andean/sea-to-stone",
        statusCode: 301,
      },
      {
        source: "/departures/white-city-deep-canyon",
        destination: "/caravans/andean/sea-to-stone",
        statusCode: 301,
      },
      {
        source: "/departures/the-stone-road",
        destination: "/caravans/andean/the-stone-road",
        statusCode: 301,
      },
      {
        source: "/departures/both-shores",
        destination: "/caravans/andean/both-shores",
        statusCode: 301,
      },
      {
        source: "/departures/thin-air-cloud-forest",
        destination: "/caravans/andean/both-shores",
        statusCode: 301,
      },
      {
        source: "/departures/silver-and-bone",
        destination: "/caravans/andean/the-mirror",
        statusCode: 301,
      },
      {
        source: "/departures/the-mirror",
        destination: "/caravans/andean/the-mirror",
        statusCode: 301,
      },
      {
        source: "/departures/atacama",
        destination: "/caravans/andean/the-mirror",
        statusCode: 301,
      },
      {
        source: "/departures/the-end-of-the-road",
        destination: "/caravans/andean/the-end-of-the-road",
        statusCode: 301,
      },
      {
        source: "/caravans/the-andean-caravan",
        destination: "/caravans/andean",
        statusCode: 301,
      },
      {
        source: "/joining-points",
        destination: "/caravans/andean-caravan/how-it-works",
        statusCode: 301,
      },
      {
        source: "/start-here",
        destination: "/caravans/andean-caravan/how-it-works",
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
