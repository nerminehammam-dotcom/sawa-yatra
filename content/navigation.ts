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
    id: "caravan-hop-on-hop-off",
    label: "Caravan Hop On Hop Off",
    href: "/caravans",
    contentStatus: "LOCKED",
  },
  {
    id: "do-it-yourself",
    label: "Do It Yourself",
    href: "/do-it-yourself",
    contentStatus: "LOCKED",
  },
  {
    id: "discover-journeys-with-others",
    label: "Discover Journeys With Others",
    href: "/departures",
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
    id: "become-a-member",
    label: "Become a Member",
    href: "/membership",
    contentStatus: "LOCKED",
  },
  {
    id: "sign-in",
    label: "Sign in",
    href: "/sign-in",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];

export const footerNavigation = [
  ...primaryNavigation.slice(0, 4),
  {
    id: "membership",
    label: "Membership",
    href: "/membership",
    contentStatus: "LOCKED",
  },
  primaryNavigation[5],
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
