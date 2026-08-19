/**
 * The six steps, split into what a reader can act on today and what the club
 * does once it opens (15 August 2026).
 *
 * They were one undifferentiated list, which read as a process you could walk
 * from end to end. You cannot: there is no application form on the site yet,
 * no interest mechanism behind step 04, and no group to meet at step 05. The
 * page was teaching a process the site could not run, and gave no way to start
 * the parts that do work.
 *
 * The step copy is unchanged. What is new is `group`, which decides where a
 * step sits, and `action`, which is present only where something on this site
 * can actually be done today. Adding an `action` to a step in the `later`
 * group would put the promise straight back.
 */

export type HowItWorksGroupId = "today" | "later";

export interface HowItWorksAction {
  readonly label: string;
  readonly href: string;
}

export interface HowItWorksStep {
  readonly number: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly group: HowItWorksGroupId;
  readonly action?: HowItWorksAction;
}

export const HOW_IT_WORKS_GROUPS = [
  {
    id: "today",
    label: "What you can do today",
  },
  {
    id: "later",
    label: "What happens once the club opens",
  },
] as const satisfies readonly { id: HowItWorksGroupId; label: string }[];

// Typed as the interface rather than `as const satisfies`: with `as const`
// every element narrows to its own literal shape, so `action` would not exist
// on the type of a step that omits it.
export const HOW_IT_WORKS_STEPS: readonly HowItWorksStep[] = [
  {
    number: "01",
    title: "Meet Your Travel Fingerprint",
    paragraphs: [
      "Eight questions about how you travel, not who you are. Whether you plan or improvise. Whether you rise early or arrive late. Whether you want the table full or the road quiet.",
      "It takes a few minutes and costs nothing. No account, no payment. You can walk away with the result and never come back.",
      "There are sixteen ways to answer. None is better than another.",
    ],
    group: "today",
    action: { label: "Take the questionnaire", href: "/travel-self/take" },
  },
  {
    number: "02",
    title: "Join the club",
    paragraphs: [
      "Membership is separate from any journey. You apply, we read it, and if it's a fit, you're in - whether or not you yet know what you want to do.",
      "Members keep their Travel Fingerprint, see how they sit against every journey, and can travel with us. Anyone can read the site and take the questionnaire. The people are the part that stays private.",
    ],
    group: "today",
    // The application wording is in legal review, so nothing is accepted on the
    // site yet. /club/apply says so and offers the same route: ask by email.
    action: { label: "Ask the club about applying", href: "/contact" },
  },
  {
    number: "03",
    title: "Find a journey",
    paragraphs: [
      "Every journey is open to read, member or not. Where it goes, how long it takes, what it asks of you, who it's for.",
      "You'll also find a short portrait of who's coming - written by us, never lifted from anyone's profile. Three who read the geology. Four travelling alone. Three who've done a long overland before.",
    ],
    group: "today",
    action: { label: "Read the journeys", href: "/journeys" },
  },
  {
    number: "04",
    title: "Say you're interested",
    paragraphs: [
      "This is the step that's ours.",
      "When a journey holds you, you say so - long before booking, with nothing owed and no deposit. Interest isn't a commitment. It's a declaration that you're circling.",
      "Everyone circling the same journey forms a group. That group is where the matching happens.",
    ],
    group: "later",
  },
  {
    number: "05",
    title: "Meet who's going",
    paragraphs: [
      "Inside that group, and only there, you can see who's circling the same journey. How they travel. Enough of who they are to picture the table.",
      "Names and faces stay yours until you decide otherwise. If someone reads well to you, you say so. If they say the same, you both appear.",
      "We don't match people in the abstract. There is no directory of members to browse and no compatibility score floating free of a road. Sawayatra matches people for a particular journey, or not at all.",
    ],
    group: "later",
  },
  {
    number: "06",
    title: "Go",
    paragraphs: ["Arrive as strangers to the place. Not to each other."],
    group: "later",
  },
];

export const HOW_IT_WORKS_REASONS = [
  {
    title: "Why membership comes before the journey.",
    body: "Travel doesn't happen often. You might join in March and not find your journey until the following spring. That's normal. Membership isn't a queue - it's where you sit while you decide.",
  },
  {
    title: "Why matching only happens per journey.",
    body: "Compatibility isn't a fixed property of a person. Someone who'd be fine company across a slow month in the Andes might be the wrong one entirely on a short, hard road. We tell you only what we can honestly know: how you'd travel together, on this journey, at this pace, for this long.",
  },
  {
    title: "Why the people stay private.",
    body: "Members joined a club, not a listing. What they told us about how they travel was told in confidence, for the purpose of travelling. It doesn't become browsable because someone landed on the site.",
  },
] as const;
