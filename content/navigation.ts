import type { NavigationItem } from "@/lib/types";

export const primaryNavigation = [
  {
    id: "how-it-works",
    label: "How it works",
    href: "/how-it-works",
    contentStatus: "LOCKED",
  },
  {
    id: "travel-self",
    label: "Meet your Travel Self",
    href: "/travel-self",
    contentStatus: "LOCKED",
  },
  {
    id: "departures",
    label: "Departures",
    href: "/departures",
    contentStatus: "LOCKED",
  },
  {
    id: "membership",
    label: "Membership",
    href: "/membership",
    contentStatus: "LOCKED",
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];

export const utilityNavigation = [
  {
    id: "sign-in",
    label: "Sign in",
    href: "/sign-in",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];

export const footerNavigation = [
  ...primaryNavigation,
  {
    id: "request-invitation",
    label: "Request an invitation",
    href: "/request-invitation",
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

// Open Seats is intentionally absent from every Release 1 navigation set.
