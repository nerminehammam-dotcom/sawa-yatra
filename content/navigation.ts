import type { NavigationItem } from "@/lib/types";
import { ANDEAN_CARAVAN_FIRST_DEPARTURE } from "@/content/andean-caravan";

// Primary navigation per Membership/Identity spec v3.1 §2.3 — exactly four
// items, in this order. The Caravan is named the way a maker names one model.
// "Create your own" is no longer a destination: it is the Start one button on
// /journeys, honestly disabled in Release 1 (build command §3.B). "Departure
// dates" is likewise absorbed into Journeys (Leaving on a date / Still
// forming). The id "caravans" is retained on the first item because
// SiteNavigation keys its mega-panel off that id.
export const primaryNavigation = [
  {
    id: "caravans",
    label: "The Andean Caravan",
    href: "/caravans/andean",
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
  ],
  join: [
    {
      id: "hop-on-hop-off",
      label: "Hop on, hop off",
      href: "/caravans/andean-caravan/how-it-works",
      meta: "Nine route sections. Join for one, or ride the whole route.",
    },
    {
      id: "route-map",
      label: "Full route map, dates and availability",
      href: "/caravans/andean/route-map",
      meta: "Every route section, every date, and current availability.",
    },
    {
      id: "who-else-is-travelling",
      label: "See who else is travelling",
      href: "/caravans/who-else-is-travelling",
      meta: "How the group is shaping up on each route section.",
    },
  ],
} as const;

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
