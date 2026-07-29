// AUTO-TRANSCRIBED FROM Sawayatra Travel Self v2.3. Do not edit strings here —
// change the specification first, then re-transcribe. The specification wins.

export type Pole = 1 | 2 | 3 | 4 | 5 | 6;
export type Axis = 'pace' | 'planning' | 'social' | 'rhythm' | 'comfort';
export type Family = 'Table' | 'Made' | 'Wild' | 'Quiet';

export const HELPER_1_TO_5 = "With people you haven't travelled with before.";

export const AXES = [
  {
    step: 1, key: 'pace', label: "Pace",
    question: "How much ground do you want to cover?",
    left:  { name: "Slow", note: "fewer places, longer in each" },
    right: { name: "Full-Tilt", note: "more places, keep moving" },
    lines: [
      "One town. You would stay another night if you could.",
      "Few places, and time enough to be bored in them.",
      "Slowly — though you would not want to miss the thing an hour away.",
      "Onward, but not through lunch.",
      "More ground. Another stop still sounds like a good idea.",
      "Three towns, and you would have taken a fourth.",
    ],
    remainingAfter: 8,
  },
  {
    step: 2, key: 'planning', label: "Planning",
    question: "How much of it do you want settled before you go?",
    left:  { name: "Improviser", note: "decide as you arrive" },
    right: { name: "Choreographer", note: "know the week in advance" },
    lines: [
      "No plan. That is the plan.",
      "You will decide when you get there.",
      "A loose idea, and the rest as it comes.",
      "Enough booked to stop thinking about it.",
      "You would like the week settled before you pack.",
      "You have a document, and it has tabs.",
    ],
    remainingAfter: 4,
  },
  {
    step: 3, key: 'social', label: "Social energy",
    question: "How much company do you want around you?",
    left:  { name: "Quiet", note: "a few people, room to be quiet" },
    right: { name: "Table-Setter", note: "a full table, most nights" },
    lines: [
      "A few people, and long silences that are not awkward.",
      "Company, in small amounts.",
      "You will join the table. You may not lead it.",
      "A full table suits you, even when you are not the loudest person at it.",
      "Dinner with everyone, most nights.",
      "You have already invited the people at the next table.",
    ],
    remainingAfter: 2,
  },
  {
    step: 4, key: 'rhythm', label: "Rhythm",
    question: "When does your day come alive?",
    left:  { name: "Sunrise-Chaser", note: "first light" },
    right: { name: "Night-Owl", note: "after dark" },
    lines: [
      "You have watched more than one town wake up.",
      "The first hour is the good one.",
      "Early — though you will stay up if something is happening.",
      "Late — though you can be got out of bed.",
      "The day starts properly after lunch.",
      "You are still awake, and glad about it.",
    ],
    remainingAfter: 1,
  },
  {
    step: 5, key: 'comfort', label: "Comfort",
    question: "How much comfort do you want around you?",
    left:  { name: "Unfussy", note: "simple is fine" },
    right: { name: "Considered", note: "where you stay matters" },
    lines: [
      "A bed is a bed.",
      "You have slept in worse and thought nothing of it.",
      "Simple is fine, as long as it is clean.",
      "Comfortable, without needing a view.",
      "Where you stay is part of the trip.",
      "You would rather one good room than three nights saved.",
    ],
    remainingAfter: null,
  },
] as const;

export const STRENGTH = ["Strongly","Clearly","Slightly","Slightly","Clearly","Strongly"] as const;

export const TIME_TOGETHER = [
  "Most of the day",
  "A few shared hours, with time apart",
  "Mainly meals and evenings",
] as const;
export const TIME_TOGETHER_HELPER = "This one shapes the group, not the comparison. Nobody is measured against it.";

export const PASSIONS: { name: string; family: Family; note: string }[] = [
  { name: "Food", family: 'Table', note: "Markets, kitchens and long lunches." },
  { name: "Festivals", family: 'Table', note: "Processions, feast days, and whatever the town is doing that week." },
  { name: "Local Connection", family: 'Table', note: "Time with the people who live there, not only the ones who host." },
  { name: "Design", family: 'Made', note: "Buildings, objects, and how a place puts itself together." },
  { name: "Culture", family: 'Made', note: "Museums, ruins, music, and the history under the street." },
  { name: "Photography", family: 'Made', note: "Light, and the time it takes to wait for it." },
  { name: "Learning", family: 'Made', note: "Courses, guides, languages, and being taught something." },
  { name: "Shopping", family: 'Made', note: "Workshops, makers, and bringing something home." },
  { name: "Nature", family: 'Wild', note: "Landscape, walking, weather, and being outside all day." },
  { name: "Wildlife", family: 'Wild', note: "Animals and birds, and the patience they ask for." },
  { name: "Adventure", family: 'Wild', note: "Height, distance, effort, and a little risk." },
  { name: "Wellness", family: 'Quiet', note: "Rest, treatment, sleep, and coming home slower than you left." },
  { name: "Water", family: 'Quiet', note: "Coastlines, swimming, rivers and hot springs." },
];
export const PASSIONS_HELPER = "Choose three. These are shown to other members — never scored, never counted against you.";
export const PASSIONS_REFUSAL = "Three only. Something has to go.";
export const FOLLOW_UP_HELPER = "This orders what we show you first. It does not change your Travel Self.";
export const SUBMIT_LABEL = "See your Travel Self";

export const FAMILY_LINE: Record<Family, string> = {
  Table: "You measure a place by who you ended up eating with.",
  Made: "You read a place through what people there have made and kept.",
  Wild: "You want the part of a country that was not arranged for you.",
  Quiet: "You travel to come back to yourself.",
};

// key is the three families sorted alphabetically and joined with '+'
export const SPREAD_LINE: Record<string, string> = {
  "Made+Table+Wild": "You want all of it: the meal, the workshop, the weather.",
  "Made+Quiet+Table": "You like a place best when it is well made and someone is feeding you.",
  "Quiet+Table+Wild": "You go out for the whole day and come back to the table.",
  "Made+Quiet+Wild": "You want beauty and open country, and quiet at the end of it.",
};

// walked in this order; first axis where the member sits at 1, 2, 5 or 6
export const FRICTION_ORDER: Axis[] = ['rhythm','pace','planning','social'];
export const FRICTION: Record<string, string> = {
  "rhythm|Sunrise-Chaser": "the table is still going at midnight and you have a six o’clock in your head.",
  "rhythm|Night-Owl": "the group wants to be up at six and decide the day over breakfast.",
  "pace|Slow": "the group decides to fit in one more town before dark.",
  "pace|Full-Tilt": "it is four in the afternoon and everyone is still in the same square.",
  "planning|Improviser": "Tuesday was decided in March, and Tuesday turns out to be beautiful somewhere else.",
  "planning|Choreographer": "nothing is booked and it is already Thursday.",
  "social|Quiet": "the table has been going two hours and it is understood that you stay.",
  "social|Table-Setter": "everyone goes up to their rooms straight after dinner.",
};
export const FRICTION_ALL_FLEXIBLE = "the group looks to you for a preference about how the day should run, and you do not have a strong one to give.";

export const BEND_ORDER: Axis[] = ['rhythm','pace','comfort','planning','social'];
export const NO_BENDS = "Nothing. You are firmly placed on all five.";

// readout word for each pole, in passport order pace · planning · social · rhythm
export const READOUT_WORD = {
  pace:     { first: 'unhurried', second: 'full-tilt' },
  planning: { first: 'unplanned', second: 'charted' },
  social:   { first: 'quiet',     second: 'sociable' },
  rhythm:   { first: 'dawn-led',  second: 'night-led' },
} as const;

export const ARCHETYPES: { name: string; readout: string; essence: string; bring: string }[] = [
  {
    name: "The Seeker",
    readout: "unhurried · unplanned · quiet · dawn-led",
    essence: "You are up before the town is, and you do not yet know where you are going. That is the point. A day settled in advance feels to you like a day already spent, and the hours that stay with you are the ones you walked into without knowing.",
    bring: "the discovery nobody booked.",
  },
  {
    name: "The Drifter",
    readout: "unhurried · unplanned · quiet · night-led",
    essence: "You let the evening decide. You are unhurried, unscheduled and content in your own company, and you have never once regretted staying out an hour longer than was sensible. Where a day is going matters less to you than what it turns out to be.",
    bring: "an ease with not knowing yet.",
  },
  {
    name: "The Naturalist",
    readout: "unhurried · charted · quiet · dawn-led",
    essence: "You want the day to have a shape and the shape to start early. You have read about where you are going, you know what you hope to see, and you would rather wait two hours in one place than pass through four. Patience is your method, not a virtue you are performing.",
    bring: "preparation, and the stillness to use it.",
  },
  {
    name: "The Astronomer",
    readout: "unhurried · charted · quiet · night-led",
    essence: "You like a journey with room around it — enough structure to trust the road, enough quiet to notice where it has taken you. You do not need to lead the group or fill its silences, but you need the day to have a plan and the evening to stay open.",
    bring: "steadiness, and attention to what everyone else walked past.",
  },
  {
    name: "The Regular",
    readout: "unhurried · unplanned · sociable · dawn-led",
    essence: "By the third morning the café knows your order. You did not plan that and you could not repeat it on purpose—you simply go slowly, turn up early, and talk to whoever is there. You come home with names, invitations and a place that remembers you.",
    bring: "a place that has started to know the group.",
  },
  {
    name: "The Bohemian",
    readout: "unhurried · unplanned · sociable · night-led",
    essence: "The table is the destination. You are in no hurry, you have made no plan, and you assume the evening will produce whatever it produces — which, in your experience, it reliably does. A long dinner is not a break from the journey. It is the journey.",
    bring: "the night everyone talks about afterwards.",
  },
  {
    name: "The Host",
    readout: "unhurried · charted · sociable · dawn-led",
    essence: "You have thought about the day and you have thought about the people. Breakfast is where you gather them — unhurried, with a plan you are perfectly happy to be talked out of. You are organising, but nobody feels organised.",
    bring: "a group that has eaten and knows the day by nine.",
  },
  {
    name: "The Convener",
    readout: "unhurried · charted · sociable · night-led",
    essence: "You booked the table three days ago. Slow days, a long evening, everyone in one place at the end of it — that is a journey well spent, and you are willing to do the arranging that makes it happen rather than hoping it will.",
    bring: "the evening that would not have happened by itself.",
  },
  {
    name: "The Scout",
    readout: "full-tilt · unplanned · quiet · dawn-led",
    essence: "You are ahead, early, and working it out as you go. You would rather cover ground and adjust than settle a plan you may want to abandon by ten. You do not need company for this, though you will happily come back and report what is up there.",
    bring: "the road ahead, checked before anyone else is awake.",
  },
  {
    name: "The Nomad",
    readout: "full-tilt · unplanned · quiet · night-led",
    essence: "You move fast and late. Plans feel like weight. You have crossed three towns in a day on no notice and thought nothing of it, and you are more comfortable than most people with not knowing about tomorrow.",
    bring: "the willingness to go now.",
  },
  {
    name: "The Pathfinder",
    readout: "full-tilt · charted · quiet · dawn-led",
    essence: "You know the route, the timings and where the difficulty is, and you would like to start early enough to get through it. You are not being rigid. You have simply found that a fast day only works when somebody has thought it through first.",
    bring: "a hard day that goes right.",
  },
  {
    name: "The Navigator",
    readout: "full-tilt · charted · quiet · night-led",
    essence: "You plan precisely, move quickly and keep your own counsel. The others discover on the second evening that you knew about the ferry, the closure and the shortcut, and had said nothing about any of it because nobody asked.",
    bring: "the problem that was solved before it arrived.",
  },
  {
    name: "The Bugler",
    readout: "full-tilt · unplanned · sociable · dawn-led",
    essence: "At six in the morning you are certain everyone would be happier awake, and often you are right. You have no plan — you have energy, and a conviction that the day is better started than discussed. People follow you before they have decided to.",
    bring: "momentum, at the hour when it is hardest to find.",
  },
  {
    name: "The Catalyst",
    readout: "full-tilt · unplanned · sociable · night-led",
    essence: "Nothing was going to happen tonight until you suggested it. You move fast, you make no plans, and you are the reason a quiet evening becomes the one people describe when they get home. You do not organise. You start.",
    bring: "the evening that turned.",
  },
  {
    name: "The Conductor",
    readout: "full-tilt · charted · sociable · dawn-led",
    essence: "You set the tempo and you gather the people, and you are up early doing both. The day has a shape, everyone knows it, and it moves. You take real pleasure in a group that is running well and none at all in one that is drifting.",
    bring: "a full day that still ends on time.",
  },
  {
    name: "The Ringmaster",
    readout: "full-tilt · charted · sociable · night-led",
    essence: "You want all of it and you have arranged all of it — the fast day, the full table, the late night. You are the one who booked the thing at eleven and got everybody there. Sleep, to you, is a scheduling matter.",
    bring: "more journey per day than anyone thought possible.",
  },
];

export const BOUNDARY_PERSONAL = "The Travel Self is not a psychological test. It compares what travellers have said about how and why they travel. It cannot predict how two people will get along.";
export const CHANGE_LATER = "You can change any of this later.";
export const PRIVACY_LINE = "Your answers are saved in this browser as you go. They are not sent to Sawayatra unless you choose to save your Travel Self to a member profile. Nationality, gender and age bracket are read only from an existing signed-in profile and are not written or changed by the questionnaire.";
export const NO_STORAGE_WARNING = "Closing or refreshing this page will clear your answers.";
export const GUEST_BAND = "Your member details will appear here when you save this Travel Self to a profile.";
export const MISSING_FIELD = "Not added";

export const RAIL_PURPOSE: Record<number, string> = {
  5: "Now, what standard makes a journey right for you?",
  6: "Now, how much of the day do you want to share?",
  7: "Now, what draws you to a place?",
  8: "One final choice: what leads?",
};

export const COMPARISON_AXES: Axis[] = ['pace','planning','social','rhythm'];
export const DISTANCE_BANDS = [
  { max: 1, label: 'Aligned' },
  { max: 2, label: 'Close' },
  { max: 5, label: 'Apart' },
] as const;
export const COMFORT_FIT = {
  quiet: { max: 2 },
  aboveNotice: "This journey sits above the comfort setting in your Travel Self.",
  belowNotice: "This journey is simpler than the comfort setting in your Travel Self.",
};
export const GROUP_THRESHOLD = 0.6;
export const GROUP_MIN_MEMBERS = 5;

// ─────────────────────────────────────────────────────────────
// ARCHETYPE SIGNATURE
// The signature is the four readout words in axis order:
//   pace | planning | social | rhythm
// Positions 1-3 take the first word, 4-6 take the second.
// Look the name up by signature. NEVER by array index — the
// ARCHETYPES array is in presentation order, not binary order.
// ─────────────────────────────────────────────────────────────

export function signatureFor(a: {
  pace: Pole; planning: Pole; social: Pole; rhythm: Pole;
}): string {
  const w = (p: Pole, k: keyof typeof READOUT_WORD) =>
    p <= 3 ? READOUT_WORD[k].first : READOUT_WORD[k].second;
  return [w(a.pace,'pace'), w(a.planning,'planning'),
          w(a.social,'social'), w(a.rhythm,'rhythm')].join('|');
}

export const ARCHETYPE_BY_SIGNATURE: Record<string, string> = {
  "full-tilt|charted|quiet|dawn-led": "The Pathfinder",
  "full-tilt|charted|quiet|night-led": "The Navigator",
  "full-tilt|charted|sociable|dawn-led": "The Conductor",
  "full-tilt|charted|sociable|night-led": "The Ringmaster",
  "full-tilt|unplanned|quiet|dawn-led": "The Scout",
  "full-tilt|unplanned|quiet|night-led": "The Nomad",
  "full-tilt|unplanned|sociable|dawn-led": "The Bugler",
  "full-tilt|unplanned|sociable|night-led": "The Catalyst",
  "unhurried|charted|quiet|dawn-led": "The Naturalist",
  "unhurried|charted|quiet|night-led": "The Astronomer",
  "unhurried|charted|sociable|dawn-led": "The Host",
  "unhurried|charted|sociable|night-led": "The Convener",
  "unhurried|unplanned|quiet|dawn-led": "The Seeker",
  "unhurried|unplanned|quiet|night-led": "The Drifter",
  "unhurried|unplanned|sociable|dawn-led": "The Regular",
  "unhurried|unplanned|sociable|night-led": "The Bohemian",
};

// ─────────────────────────────────────────────────────────────
// EVERY REMAINING MEMBER-FACING STRING
// ─────────────────────────────────────────────────────────────

export const QUESTION_HEADINGS = {
  6: "When you travel with others, how much of the day do you want to spend together?",
  7: "What do you travel for?",
  8: "Which of these would most influence the journey you book?",
} as const;

export const NAV = {
  back: "\u2190 Back",
  next: "Next question \u2192",
  submit: "See your Travel Self",
  stepLabel: (n: number, total = 8) => `question ${n} of ${total}`,
} as const;

export const VALIDATION = {
  chooseAPosition: "Choose a position to continue.",
  chooseAnOption: "Choose an option to continue.",
  chooseThree: "Choose three to continue.",
  chooseWhichLeads: "Choose which one leads to continue.",
  passionsCounter: (n: number) => `${n} of three chosen.`,
  passionsRefusal: PASSIONS_REFUSAL,
} as const;

export const NARROWING = {
  remaining: (n: number) => `${n} of sixteen.`,
  beforeAnyAnswer: "Sixteen.",
  beforeAnyAnswerNote: "Nothing has been ruled out yet.",
  note: "Each answer rules some out. The panel never shows which.",
} as const;

export const PASSPORT_LABELS = {
  kicker: "Your Travel Self",
  nationality: "Nationality",
  gender: "Gender",
  ageBracket: "Age bracket",
  essence: "Essence",
  bring: "What you bring",
  travelFor: "You travel for",
  comfort: "Comfort",
  timeTogether: "Time together",
  bendOn: "You bend on",
  feelItWhen: "You will feel it when",
} as const;

export const COMFORT_LABEL = { first: "Unfussy", second: "Considered" } as const;

export const SAVE = {
  action: "Save to my member profile",
  changeAnswer: "Change an answer",
  completeProfile: "Complete profile",
  saving: "Saving\u2026",
  saved: "Saved to your member profile.",
  failed: "That did not save. Your answers are still here \u2014 try again.",
  retry: "Try again",
  signInPrompt: "Saving to your profile needs you to sign in first.",
  replaceWarning: "This replaces the Travel Self already on your profile.",
} as const;

export const RESULT_INVENTORY_HEADING = "All sixteen Travel Selves";
