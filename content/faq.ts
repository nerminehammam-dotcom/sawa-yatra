import type { FaqItem } from "@/lib/types";

export const faqItems = [
  {
    id: "membership-faq-placeholder-1",
    question:
      "PLACEHOLDER: Founder-approved membership FAQ question 1 to be supplied.",
    answer: "To be confirmed",
    category: "membership",
    contentStatus: "PLACEHOLDER",
  },
  {
    id: "membership-faq-placeholder-2",
    question:
      "PLACEHOLDER: Founder-approved membership FAQ question 2 to be supplied.",
    answer: "To be confirmed",
    category: "membership",
    contentStatus: "PLACEHOLDER",
  },
  {
    id: "membership-faq-placeholder-3",
    question:
      "PLACEHOLDER: Founder-approved membership FAQ question 3 to be supplied.",
    answer: "To be confirmed",
    category: "membership",
    contentStatus: "PLACEHOLDER",
  },
  {
    id: "membership-faq-placeholder-4",
    question:
      "PLACEHOLDER: Founder-approved membership FAQ question 4 to be supplied.",
    answer: "To be confirmed",
    category: "membership",
    contentStatus: "PLACEHOLDER",
  },
] as const satisfies readonly FaqItem[];
