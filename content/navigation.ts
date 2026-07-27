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
    id: "ask-a-question",
    label: "Ask a question",
    href: "/contact",
    contentStatus: "LOCKED",
  },
] as const;

export const departuresNavigation = [
  {
    id: "andean-caravan",
    label: "The Andean Caravan",
    href: "/departures/the-andean-caravan",
  },
  {
    id: "all-sections",
    label: "Browse all nine sections",
    href: "/departures#all-sections",
  },
  {
    id: "route-map",
    label: "Full route map",
    href: "/departures#full-route-map",
  },
  {
    id: "joining-points",
    label: "Joining & Leaving Points",
    href: "/joining-points",
  },
  {
    id: "dates",
    label: "Dates & availability",
    href: "/departures#dates-availability",
  },
  {
    id: "included",
    label: "What is included",
    href: "/departures#what-is-included",
  },
] as const;

export const footerNavigation = [
  ...primaryNavigation,
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
