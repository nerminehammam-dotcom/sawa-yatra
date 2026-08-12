import {
  TO_BE_CONFIRMED,
  type CallToAction,
  type ContentStatusRecord,
  type LegalPagePlaceholder,
  type SystemPageContent,
} from "@/lib/types";

// Honest holding copy, rewritten 7 August 2026. The pages previously showed
// internal scaffolding to visitors — "LEGAL REVIEW: This page is a placeholder.
// Approved copy must be supplied…" and a body of "To be confirmed". None of the
// text below is legal copy or a compliance claim; it is a plain, honest notice
// that the real document is being prepared and reviewed before any data is
// collected. The professionally-drafted policies still replace it before launch.
const legalNotice =
  "This page is being prepared and professionally reviewed. It will be published before Sawayatra collects any personal information or takes any reservation. Until then, anything you send is emailed to Sawayatra and is not stored on this website.";

export const legalPages = [
  {
    id: "privacy",
    path: "/privacy",
    title: "Privacy",
    reviewLabel: "Before launch",
    notice: legalNotice,
    body: [
      "Sawayatra's privacy policy will appear here: what is collected, why, how long it is kept, and your rights over it. We would rather show you nothing than publish a policy we have not properly prepared.",
      // §14 downstream row — Privacy notice covers §12 in full. Plain-language
      // scope statement, not legal copy; drafting is at legal review.
      "When it is published it will cover, among other things: that identity documents are checked and immediately destroyed, never stored; that your date of birth is never shown to anyone and cannot be reconstructed from any export or report; how automated checks are used, that a person reviews them, and your route to a human review of any automated decision; and how long each kind of record, including moderation logs, is kept.",
    ],
    lastReviewed: "Not yet published",
    contentStatus: "LEGAL REVIEW",
  },
  {
    id: "terms",
    path: "/terms",
    title: "Terms",
    reviewLabel: "Before launch",
    notice: legalNotice,
    body: [
      "Sawayatra's terms will appear here before any booking or payment is possible. None is taken through this site today.",
      // §14 downstream row — Terms cover 4.6, 5.3, 5.4, §6 budgets, §7.7,
      // §11 disclosure. Plain-language scope statement, not legal copy.
      "When they are published they will cover, among other things: the rule that contact details are not shared in open spaces; how invitations and sponsorship work, and what sponsors are accountable for; how removal works, always with a written reason and an appeal to a named person; the budgets that govern interest signals; how cancellation, replacement and the price lock work; and where automated tools are involved and what they may and may not do.",
    ],
    lastReviewed: "Not yet published",
    contentStatus: "LEGAL REVIEW",
  },
  {
    id: "accessibility",
    path: "/accessibility",
    title: "Accessibility",
    reviewLabel: "Before launch",
    notice: legalNotice,
    body: [
      "Sawayatra's accessibility statement will appear here. The site is built with WCAG 2.2 AA as the standard; the formal statement is being finalised.",
    ],
    lastReviewed: "Not yet published",
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
  notice: "PLACEHOLDER: Cookie requirements and approved notice copy are to be confirmed.",
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
    body: "The page you were looking for isn't here — it may have moved, or the link may be wrong. You can pick the road back up below.",
    actions: [
      returnHomeAction,
      {
        label: "Browse departures",
        href: "/journeys/caravans/andean-caravan",
        style: "secondary",
        contentStatus: "LOCKED",
      },
    ],
    contentStatus: "LOCKED",
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
