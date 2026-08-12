export const MEMBERSHIP_STATUSES = [
  "none",
  "applied",
  "member",
  "declined",
  "lapsed",
] as const;

export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];
export type JourneyType = "caravan" | "open";
export type JourneyVisibility = "public" | "members";
export type JourneyStatus =
  | "draft"
  | "open"
  | "closed"
  | "departed"
  | "cancelled";
export type PublicationState =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected";
export type OriginatorType = "club" | "member" | "partner";

export interface GroupPortrait {
  /** Club-authored copy about who the journey is designed for. */
  readonly intended: string;
  /** Club-authored copy about the current group. Never generated. */
  readonly actual: string;
}

export interface JourneyRecord {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly type: JourneyType;
  readonly visibility: JourneyVisibility;
  readonly status: JourneyStatus;
  readonly publicationState: PublicationState;
  readonly groupFormedAt: Date | null;
  readonly originatorType: OriginatorType;
  readonly originatorId: string | null;
  readonly groupPortrait: GroupPortrait;
  readonly route: string;
  readonly duration: string;
  readonly cost: string;
  readonly asksOfYou: readonly string[];
  readonly story: readonly string[];
  readonly heroImage: string;
  readonly heroAlt: string;
}

export interface TravelSelfResult {
  readonly id: string;
  readonly ownerMemberId: string | null;
  readonly archetype: string;
  readonly axes: Readonly<Record<string, number>>;
  readonly createdAt: Date;
}

export interface PassportDemographics {
  readonly nationality: string | null;
  readonly gender: string | null;
  readonly ageBand: string | null;
}

/** One record per member. Pools reference this record; they never copy it. */
export interface Passport {
  readonly memberId: string;
  readonly resultId: string;
  readonly archetype: string;
  readonly axes: Readonly<Record<string, number>>;
  readonly demographics: PassportDemographics;
  readonly updatedAt: Date;
}

export interface IdentityLayer {
  readonly memberId: string;
  readonly firstName: string;
  readonly photograph: string;
}

export interface PrivateMemberLayer {
  readonly memberId: string;
  readonly fullName: string;
  readonly email: string;
  readonly contactDetails: string;
  readonly applicationContent: string;
}

export interface InterestDeclaration {
  readonly memberId: string;
  readonly journeyId: string;
  readonly declaredAt: Date;
  readonly lastConfirmedAt: Date;
}

export type RevealRequestState = "pending" | "mutual" | "void";

export interface RevealRequest {
  readonly fromMemberId: string;
  readonly toMemberId: string;
  readonly journeyId: string;
  readonly state: RevealRequestState;
  readonly createdAt: Date;
}

export interface Connection {
  readonly memberAId: string;
  readonly memberBId: string;
  readonly journeyId: string;
  readonly connectedAt: Date;
}

export interface ViewerContext {
  readonly isSignedIn: boolean;
  readonly memberId: string | null;
  readonly membershipStatus: MembershipStatus;
  readonly hasSavedTravelSelf: boolean;
  readonly declaredJourneyIds: readonly string[];
  readonly authoredJourneyIds: readonly string[];
  readonly isClubStaff: boolean;
}

export const SIGNED_OUT_VIEWER: ViewerContext = Object.freeze({
  isSignedIn: false,
  memberId: null,
  membershipStatus: "none",
  hasSavedTravelSelf: false,
  declaredJourneyIds: [],
  authoredJourneyIds: [],
  isClubStaff: false,
});

export function createJourney(
  input: Omit<JourneyRecord, "visibility" | "publicationState"> & {
    readonly visibility?: JourneyVisibility;
    readonly publicationState?: PublicationState;
  },
): JourneyRecord {
  const visibility = input.type === "caravan" ? "public" : (input.visibility ?? "members");
  const publicationState =
    input.type === "caravan" ? "approved" : (input.publicationState ?? "draft");

  if (input.originatorType === "club" && input.originatorId !== null) {
    throw new Error("Club-originated journeys must have a null originatorId.");
  }
  if (input.originatorType !== "club" && input.originatorId === null) {
    throw new Error("Member and partner originators require a real originatorId.");
  }
  if (input.type === "caravan" && input.groupFormedAt !== null) {
    throw new Error("groupFormedAt belongs to open journeys only.");
  }
  if (input.status === "open" && publicationState !== "approved") {
    throw new Error("A journey may only open after editorial approval.");
  }

  return Object.freeze({ ...input, visibility, publicationState });
}

export function editPassport(
  passport: Passport,
  update: Partial<Pick<Passport, "archetype" | "axes">> & {
    readonly demographics?: Partial<PassportDemographics>;
  },
  now: Date,
): Passport {
  return Object.freeze({
    ...passport,
    ...update,
    demographics: Object.freeze({
      ...passport.demographics,
      ...update.demographics,
    }),
    updatedAt: now,
  });
}

