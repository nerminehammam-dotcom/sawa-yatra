export interface OmanJourneyGuide {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly standfirst: string;
  readonly days: number;
  readonly route: string;
  readonly group?: string;
  readonly href: string;
  readonly pages: number;
  readonly sizeLabel: string;
}

const GUIDE_PATH = "/assets/guides";

export const omanJourneyGuides: readonly OmanJourneyGuide[] = [
  {
    id: "monsoon-magic",
    number: "01",
    title: "Monsoon Magic",
    standfirst: "A 7-day journey into Dhofar when it is most alive.",
    days: 7,
    route: "Dhofar",
    href: `${GUIDE_PATH}/sawayatra-oman-01-monsoon-magic.pdf`,
    pages: 14,
    sizeLabel: "3.7 MB",
  },
  {
    id: "roots-and-souqs",
    number: "02",
    title: "Roots & Souqs",
    standfirst: "A journey through the spine of Oman.",
    days: 5,
    route: "Hajar Mountains",
    href: `${GUIDE_PATH}/sawayatra-oman-02-roots-and-souqs.pdf`,
    pages: 18,
    sizeLabel: "3.9 MB",
  },
  {
    id: "the-big-janoob",
    number: "03",
    title: "The Big Janoob",
    standfirst:
      "Seven days of crossing Oman, from desert to sea to canyon to mountain.",
    days: 7,
    route: "Across Oman",
    href: `${GUIDE_PATH}/sawayatra-oman-03-the-big-janoob.pdf`,
    pages: 21,
    sizeLabel: "5.1 MB",
  },
  {
    id: "the-full-janoob",
    number: "04",
    title: "The Full Janoob",
    standfirst: "Mountains. Water. Desert. Coast. Then all the way south.",
    days: 20,
    route: "Muscat to Salalah",
    group: "3 guests plus driver per 4x4",
    href: `${GUIDE_PATH}/sawayatra-oman-04-the-full-janoob.pdf`,
    pages: 13,
    sizeLabel: "5.0 MB",
  },
  {
    id: "the-janoob-essential",
    number: "05",
    title: "The Janoob Essential",
    standfirst: "Mountain to desert. The northern loop.",
    days: 7,
    route: "Muscat to Sharqiyah Sands",
    group: "3 guests plus driver per 4x4",
    href: `${GUIDE_PATH}/sawayatra-oman-05-the-janoob-essential.pdf`,
    pages: 8,
    sizeLabel: "1.8 MB",
  },
  {
    id: "the-mainland-crossing",
    number: "06",
    title: "The Mainland Crossing",
    standfirst: "Mountains. Water. Desert. Coast. Then all the way south.",
    days: 14,
    route: "Muscat to Salalah",
    group: "3 guests plus driver per 4x4",
    href: `${GUIDE_PATH}/sawayatra-oman-06-the-mainland-crossing.pdf`,
    pages: 11,
    sizeLabel: "2.6 MB",
  },
  {
    id: "yalla-east",
    number: "07",
    title: "Yalla East",
    standfirst: "Mountains. Water. Desert. Coast.",
    days: 10,
    route: "Mountains to coast",
    group: "3 guests plus driver per 4x4",
    href: `${GUIDE_PATH}/sawayatra-oman-07-yalla-east.pdf`,
    pages: 9,
    sizeLabel: "3.1 MB",
  },
] as const;
