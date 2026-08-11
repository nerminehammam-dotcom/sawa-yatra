import type { NavigationItem } from "@/lib/types";
import { ANDEAN_CARAVAN_FIRST_DEPARTURE } from "@/content/andean-caravan";

// Primary navigation per Membership/Identity spec v3.1 §2.3 — exactly four
// items, in this order. Caravans is the expandable collection; individual
// routes such as The Andean Caravan sit beneath it as named products.
// "Create your own" is no longer a destination: it is the Start one button on
// /journeys, honestly disabled in Release 1 (build command §3.B). "Departure
// dates" is likewise absorbed into Journeys (Leaving on a date / Still
// forming). The id "caravans" is retained on the first item because
// SiteNavigation keys its mega-panel off that id.
export const primaryNavigation = [
  {
    id: "caravans",
    label: "Caravans",
    href: "/caravans",
    contentStatus: "LOCKED",
  },
  {
    id: "journeys",
    label: "Journeys",
    href: "/journeys",
    contentStatus: "LOCKED",
  },
  {
    id: "how-it-works",
    label: "How it works",
    href: "/how-it-works",
    contentStatus: "LOCKED",
  },
  {
    // Canonical route: next.config.ts 301s /membership → /members.
    id: "membership",
    label: "Membership",
    href: "/members",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];

export const utilityNavigation = [
  {
    // Kept reachable outside the four-item primary nav (§2.3): the Travel
    // Self questionnaire remains the visitor's private on-ramp (rule 4.1).
    id: "travel-self",
    label: "Meet your Travel Self",
    href: "/travel-self",
    contentStatus: "LOCKED",
  },
  {
    id: "who-we-are",
    label: "Who we are",
    href: "/who-we-are",
    contentStatus: "LOCKED",
  },
  {
    id: "partners",
    label: "Our partners",
    href: "/partners",
    contentStatus: "LOCKED",
  },
  {
    // Persistent join CTA in the header + mobile menu, so the action survives
    // the dismissable announcement banner. Points at the working capture
    // (/register-interest), not the "not open yet" /request-invitation holding
    // page.
    id: "register-interest",
    label: "Register your interest",
    href: "/register-interest",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];

export const announcementNavigation = {
  message: `The Andean Caravan is open for interest. First departure ${ANDEAN_CARAVAN_FIRST_DEPARTURE}.`,
  signIn: {
    label: "Sign in",
    href: "/sign-in",
  },
} as const;

export const caravansNavigation = {
  choose: [
    {
      id: "andean-caravan",
      label: "The Andean Caravan",
      href: "/caravans/andean",
      meta: "71 days, Lima to Patagonia",
    },
    {
      id: "egyptian-caravan",
      label: "The Egyptian Caravan",
      href: "/caravans/egypt",
      meta: "Egypt · In progress",
    },
  ],
} as const;

export const andeanCaravanNavigation = [
  {
    id: "whole-caravan",
    label: "The whole Caravan",
    href: "/caravans/andean",
    meta: "Overview, sections and route.",
  },
  {
    id: "joining-leaving",
    label: "Joining & leaving points",
    href: "/caravans/andean-caravan/how-it-works",
    meta: "Choose your start and finish.",
  },
  {
    id: "route-atlas",
    label: "Maps",
    href: "/caravans/andean#full-route-map",
    meta: "The route, transport and terrain.",
  },
  {
    id: "stop-by-stop",
    label: "Each stop",
    href: "/caravans/andean/route-map",
    meta: "Every route day in travelling order.",
  },
  {
    id: "trip-documents",
    label: "Trip PDFs — coming soon",
    href: "/caravans/andean#trip-documents",
    meta: "No files published yet.",
  },
] as const;

export const footerNavigation = [
  ...primaryNavigation,
  {
    id: "travel-self",
    label: "Meet your Travel Self",
    href: "/travel-self",
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
