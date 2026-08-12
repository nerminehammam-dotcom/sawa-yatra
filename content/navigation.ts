import type { NavigationItem } from "@/lib/types";

/** v2.4 §9 — the public concept leads, in this exact order. */
export const primaryNavigation = [
  {
    id: "how-it-works",
    label: "How it works",
    href: "/how-it-works",
    contentStatus: "LOCKED",
  },
  {
    id: "journeys",
    label: "Journeys",
    href: "/journeys",
    contentStatus: "LOCKED",
  },
  {
    id: "travel-self",
    label: "Travel Self",
    href: "/travel-self",
    contentStatus: "LOCKED",
  },
  {
    id: "club",
    label: "The Club",
    href: "/club",
    contentStatus: "LOCKED",
  },
  {
    id: "who-we-are",
    label: "Who we are",
    href: "/who-we-are",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];
export const footerNavigation = [
  ...primaryNavigation,
  {
    id: "partners",
    label: "Partners",
    href: "/partners",
    contentStatus: "LOCKED",
  },
  {
    id: "privacy",
    label: "Privacy",
    href: "/privacy",
    contentStatus: "LOCKED",
  },
  {
    id: "terms",
    label: "Terms",
    href: "/terms",
    contentStatus: "LOCKED",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    href: "/accessibility",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];
