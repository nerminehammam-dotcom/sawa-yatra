import type { AssetId, ImageAsset } from "@/lib/types";

export const assetManifest = {
  grain: {
    id: "grain",
    src: "/assets/textures/grain.svg",
    alt: "",
    treatment: "true",
    role: "texture",
    isPlaceholder: false,
    contentStatus: "LOCKED",
  },
  "home-hero": {
    id: "home-hero",
    src: "/assets/images/home-hero-placeholder.svg",
    alt: "",
    treatment: "duotone",
    role: "hero",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
    contentNote:
      "Legacy/unused slot: the home hero renders a real founder photograph directly in app/(public)/page.tsx (the-end-of-the-road/07-patagoina-01.jpg). Founder-owned, made on the route.",
  },
  "about-founder": {
    id: "about-founder",
    src: "/assets/images/about/founders/lakeside.jpg",
    alt: "Nermine Hammam and Amal standing together beside a lake and green hillside beneath a wide blue sky.",
    treatment: "true",
    role: "portrait",
    isPlaceholder: false,
    contentStatus: "DRAFT",
    contentNote:
      "Founder photograph supplied by Nermine Hammam on 9 August 2026 and reproduced with permission; precise date and location metadata to be confirmed.",
  },
  "journey-patagonia-card": {
    id: "journey-patagonia-card",
    src: "/assets/images/journeys/patagonia-slowly-card-placeholder.svg",
    alt: "",
    treatment: "duotone",
    role: "card",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
  },
  "journey-patagonia-hero": {
    id: "journey-patagonia-hero",
    src: "/assets/images/journeys/patagonia-slowly-hero-placeholder.svg",
    alt: "To be confirmed",
    treatment: "duotone",
    role: "hero",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
  },
  "journey-carretera-card": {
    id: "journey-carretera-card",
    src: "/assets/images/journeys/carretera-austral-card-placeholder.svg",
    alt: "",
    treatment: "true",
    role: "card",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
  },
  "journey-carretera-hero": {
    id: "journey-carretera-hero",
    src: "/assets/images/journeys/carretera-austral-hero-placeholder.svg",
    alt: "To be confirmed",
    treatment: "duotone",
    role: "hero",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
  },
  "journey-atacama-card": {
    id: "journey-atacama-card",
    src: "/assets/images/journeys/atacama-stars-card-placeholder.svg",
    alt: "",
    treatment: "duotone",
    role: "card",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
  },
  "journey-atacama-hero": {
    id: "journey-atacama-hero",
    src: "/assets/images/journeys/atacama-stars-hero-placeholder.svg",
    alt: "To be confirmed",
    treatment: "duotone",
    role: "hero",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
  },
  "social-fallback": {
    id: "social-fallback",
    src: "/assets/images/social-sawayatra-r1.webp",
    alt: "Lone traveller following a mountain path toward a welcoming outdoor table.",
    treatment: "duotone",
    role: "social",
    isPlaceholder: false,
    contentStatus: "LOCKED",
    contentNote:
      "Founder-approved AI-generated brand artwork for social / OG cards. Intentional — not a placeholder.",
  },
  favicon: {
    id: "favicon",
    src: "/icon",
    alt: "",
    treatment: "true",
    role: "icon",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
    contentNote:
      "Temporary programmatic route-through-a-gate mark; replace it when the final identity is supplied.",
  },
} as const satisfies Record<AssetId, ImageAsset>;

export const temporaryWordmark = {
  text: "Sawayatra",
  fontFamily: "Fraunces",
  contentStatus: "DRAFT",
  contentNote:
    "A traced SVG wordmark in brand red now ships (public/assets/brand/sawayatra-wordmark.svg, via components/brand/Wordmark.tsx). A final commissioned logo may still replace it without changing layout contracts. This object is currently unused.",
} as const;
