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
    alt: "To be confirmed",
    treatment: "duotone",
    role: "hero",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
    contentNote:
      "Founder-owned or commissioned land photography and approved alt text are required before launch.",
  },
  "about-founder": {
    id: "about-founder",
    src: "/assets/images/about-founder-placeholder.svg",
    alt: "To be confirmed",
    treatment: "true",
    role: "portrait",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
    contentNote:
      "Founder portrait, identity details and approved alt text have not been supplied.",
  },
  "journey-patagonia-card": {
    id: "journey-patagonia-card",
    src: "/assets/images/journeys/patagonia-slowly-card-placeholder.svg",
    alt: "To be confirmed",
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
    alt: "To be confirmed",
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
    alt: "To be confirmed",
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
    alt: "A lone traveller follows a mountain path toward a welcoming outdoor table.",
    treatment: "duotone",
    role: "social",
    isPlaceholder: true,
    contentStatus: "PLACEHOLDER",
    contentNote:
      "Temporary AI-generated Release 1 social artwork; replace with commissioned brand artwork before launch.",
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
  contentStatus: "PLACEHOLDER",
  contentNote:
    "Temporary Fraunces wordmark with a decorative route-through-a-gate mark for Release 1; the final logo must replace it without changing layout contracts.",
} as const;
