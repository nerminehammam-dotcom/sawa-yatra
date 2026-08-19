import type { NavigationItem } from "@/lib/types";

/** v2.4 §9 - the public concept leads, in this exact order. */
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
    label: "Your Travel Fingerprint",
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
    id: "about",
    label: "About",
    href: "/about",
    contentStatus: "LOCKED",
  },
  {
    id: "who-we-are",
    label: "Who we are",
    href: "/who-we-are",
    contentStatus: "LOCKED",
  },
] as const satisfies readonly NavigationItem[];

/** The two Caravan destinations nested beneath the Caravans product. */
export const caravanNavigation = [
  {
    id: "andean-caravan",
    label: "The Andean Caravan",
    href: "/journeys/caravans/andean-caravan",
    meta: "71 days, Lima to Patagonia",
  },
  {
    id: "egyptian-caravan",
    label: "The Egyptian Caravan",
    href: "/journeys/caravans/egyptian-caravan",
    meta: "Egypt · In progress",
  },
] as const;

/** The Andean Caravan's existing detail navigation, kept beneath that Caravan. */
export const andeanCaravanNavigation = [
  {
    id: "whole-caravan",
    label: "The whole Caravan",
    href: "/journeys/caravans/andean-caravan",
    meta: "Overview, sections and route.",
  },
  {
    id: "joining-leaving",
    label: "Joining & leaving points",
    href: "/journeys/caravans/andean-caravan/joining-points",
    meta: "Choose your start and finish.",
  },
  {
    id: "route-atlas",
    label: "Maps",
    href: "/journeys/caravans/andean-caravan#full-route-map",
    meta: "The route, transport and terrain.",
  },
  {
    id: "stop-by-stop",
    label: "Each stop",
    href: "/journeys/caravans/andean-caravan/route-map",
    meta: "Every route day in travelling order.",
  },
  {
    id: "trip-documents",
    label: "Field books",
    href: "/journeys/caravans/andean-caravan#trip-documents",
    meta: "The complete guide and each section, to download.",
  },
] as const;

/** The three equal public products inside the Journeys section. */
export const journeyProductNavigation = [
  {
    id: "caravans",
    label: "Caravans",
    href: "/journeys/caravans",
  },
  {
    id: "create-your-own-journey",
    label: "Create your own journey",
    href: "/journeys/create",
  },
  {
    id: "join-an-existing-journey",
    label: "Join an existing journey",
    href: "/journeys/join",
  },
] as const;

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
