import { ANDEAN_CARAVAN_FIRST_DEPARTURE } from "@/content/andean-caravan";
import type { NavigationItem } from "@/lib/types";

// Journeys, Create your own journey and Departure dates are kept in the primary
// nav at the founder's request (7 August 2026): she is building those pages and
// wants them visible to work on the page design, with content landing shortly.
// They currently resolve to honest "coming soon" pages. Revisit whether they
// belong in the primary nav once their content is in.
export const primaryNavigation = [
  {
    id: "how-it-works",
    label: "How Sawayatra works",
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
    id: "create-your-own-journey",
    label: "Create your own journey",
    href: "/create-your-own-journey",
    contentStatus: "LOCKED",
  },
  {
    id: "departure-dates",
    label: "Departure dates",
    href: "/departure-dates",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];

export const utilityNavigation = [
  {
    id: "members",
    label: "Members",
    href: "/members",
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
] as const satisfies readonly NavigationItem[];

export const announcementNavigation = {
  message: `The Andean Caravan is open for interest. First departure ${ANDEAN_CARAVAN_FIRST_DEPARTURE}.`,
  action: {
    label: "Register your interest",
    href: "/register-interest",
  },
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
