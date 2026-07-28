import {
  TO_BE_CONFIRMED,
  type CallToAction,
  type ContentStatusRecord,
  type LegalPagePlaceholder,
  type SystemPageContent,
} from "@/lib/types";

const legalNotice =
  "LEGAL REVIEW — This page is a placeholder. Approved copy must be supplied and professionally reviewed before launch.";

export const legalPages = [
  {
    id: "privacy",
    path: "/privacy",
    title: "Privacy",
    reviewLabel: "LEGAL REVIEW",
    notice: legalNotice,
    body: ["To be confirmed"],
    lastReviewed: TO_BE_CONFIRMED,
    contentStatus: "LEGAL REVIEW",
  },
  {
    id: "terms",
    path: "/terms",
    title: "Terms",
    reviewLabel: "LEGAL REVIEW",
    notice: legalNotice,
    body: ["To be confirmed"],
    lastReviewed: TO_BE_CONFIRMED,
    contentStatus: "LEGAL REVIEW",
  },
  {
    id: "accessibility",
    path: "/accessibility",
    title: "Accessibility",
    reviewLabel: "LEGAL REVIEW",
    notice: legalNotice,
    body: ["To be confirmed"],
    lastReviewed: TO_BE_CONFIRMED,
    contentStatus: "LEGAL REVIEW",
  },
] as const satisfies readonly LegalPagePlaceholder[];

export const legalPageById = {
  privacy: legalPages[0],
  terms: legalPages[1],
  accessibility: legalPages[2],
} as const satisfies Readonly<
  Record<LegalPagePlaceholder["id"], LegalPagePlaceholder>
>;

export const cookieNoticeDecision = {
  required: TO_BE_CONFIRMED,
  notice: "PLACEHOLDER — Cookie requirements and approved notice copy are to be confirmed.",
  contentStatus: "LEGAL REVIEW",
} as const;

const returnHomeAction = {
  label: "Return home",
  href: "/",
  style: "primary",
  contentStatus: "LOCKED",
} as const satisfies CallToAction;

export const systemUiContent = {
  loading: {
    label: "Loading page",
    announcement: "Loading Sawayatra…",
    contentStatus: "LOCKED",
  },
  retryAction: {
    label: "Try again",
    contentStatus: "LOCKED",
  },
  legal: {
    lastReviewedLabel: "Last reviewed",
    returnHomeAction,
    contentStatus: "LOCKED",
  },
} as const satisfies {
  readonly loading: ContentStatusRecord & {
    readonly label: string;
    readonly announcement: string;
  };
  readonly retryAction: ContentStatusRecord & { readonly label: string };
  readonly legal: ContentStatusRecord & {
    readonly lastReviewedLabel: string;
    readonly returnHomeAction: CallToAction;
  };
};

export const systemPageContent = {
  notFound: {
    eyebrow: "404",
    title: "Page not found",
    body: "PLACEHOLDER — Founder-approved 404 message to be supplied.",
    actions: [
      returnHomeAction,
      {
        label: "Browse departures",
        href: "/caravans/andean",
        style: "secondary",
        contentStatus: "LOCKED",
      },
    ],
    contentStatus: "PLACEHOLDER",
  },
  error: {
    eyebrow: "Something went wrong",
    title: "We couldn't show this page.",
    body: "Please try again. If the problem continues, return home.",
    actions: [returnHomeAction],
    contentStatus: "PLACEHOLDER",
    contentNote: "Neutral error microcopy; founder review requested.",
  },
} as const satisfies Record<"notFound" | "error", SystemPageContent>;
