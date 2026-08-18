export const MEMBERSHIP_STATUSES = [
  "none",
  "applied",
  "member",
  "declined",
  "lapsed",
] as const;

export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

/**
 * Journey taxonomy is split into independent dimensions. Structure describes
 * the arrangement of a road; it does not imply its setting, access, origin or
 * operator.
 */
export const JOURNEY_STRUCTURES = ["caravan", "standalone"] as const;
export type JourneyStructure = (typeof JOURNEY_STRUCTURES)[number];

export const JOURNEY_SETTINGS = ["farm"] as const;
export type JourneySetting = (typeof JOURNEY_SETTINGS)[number];

export const JOURNEY_ACCESSES = ["open-to-members", "private"] as const;
export type JourneyAccess = (typeof JOURNEY_ACCESSES)[number];

export const JOURNEY_ORIGINS = [
  "sawayatra-conceived",
  "member-proposed",
  "partner-submitted",
] as const;
export type JourneyOrigin = (typeof JOURNEY_ORIGINS)[number];

/** @deprecated Use JOURNEY_STRUCTURES and JourneyStructure for new data. */
export const JOURNEY_TYPES = ["caravan", "open"] as const;
/** @deprecated Use JourneyStructure for new data. */
export type JourneyType = (typeof JOURNEY_TYPES)[number];
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
export type CanonicalOperatorType = "sawayatra" | "partner";
/** `club` is retained for records created through the legacy API. */
export type OperatorType = CanonicalOperatorType | "club";

const ORIGINATOR_TYPE_BY_ORIGIN: Readonly<
  Record<JourneyOrigin, OriginatorType>
> = Object.freeze({
  "sawayatra-conceived": "club",
  "member-proposed": "member",
  "partner-submitted": "partner",
});

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
  readonly structure: JourneyStructure;
  /** @deprecated Read structure instead. */
  readonly type: JourneyType;
  readonly setting: JourneySetting | null;
  /** Null means the canonical access classification is not approved. */
  readonly access: JourneyAccess | null;
  /** Null means the canonical origin classification is not approved. */
  readonly origin: JourneyOrigin | null;
  readonly visibility: JourneyVisibility;
  readonly status: JourneyStatus;
  readonly publicationState: PublicationState;
  readonly groupFormedAt: Date | null;
  /** @deprecated Read origin instead. */
  readonly originatorType: OriginatorType;
  readonly originatorId: string | null;
  /** Null means no operator has been approved for publication. */
  readonly operatorType: OperatorType | null;
  /** Null when no operator is published. */
  readonly operatorId: string | null;
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

export type CreateJourneyInput = Omit<
  JourneyRecord,
  | "type"
  | "structure"
  | "setting"
  | "access"
  | "origin"
  | "originatorType"
  | "visibility"
  | "publicationState"
  | "operatorType"
  | "operatorId"
> & {
  /** Legacy input. New records should provide structure instead. */
  readonly type?: JourneyType;
  readonly structure?: JourneyStructure;
  readonly setting?: JourneySetting | null;
  readonly access?: JourneyAccess | null;
  readonly origin?: JourneyOrigin | null;
  /** Legacy input. New records derive this from origin. */
  readonly originatorType?: OriginatorType;
  readonly visibility?: JourneyVisibility;
  readonly publicationState?: PublicationState;
  readonly operatorType?: OperatorType | null;
  readonly operatorId?: string | null;
};

function legacyTypeForStructure(structure: JourneyStructure): JourneyType {
  return structure === "caravan" ? "caravan" : "open";
}

function structureForLegacyType(type: JourneyType): JourneyStructure {
  return type === "caravan" ? "caravan" : "standalone";
}

/**
 * Creates either a legacy journey record or a record using the independent
 * taxonomy axes. Supplying `type` opts into the old defaults and validation;
 * omitting it requires explicit structure, access and origin fields. Access
 * and origin may be null when those classifications are not approved. Neither
 * a legacy type nor a provenance field is converted into an approved axis.
 */
export function createJourney(input: CreateJourneyInput): JourneyRecord {
  const isLegacyInput = input.type !== undefined;
  const hasExplicitAccess = Object.prototype.hasOwnProperty.call(
    input,
    "access",
  );
  const hasExplicitOrigin = Object.prototype.hasOwnProperty.call(
    input,
    "origin",
  );

  if (
    !isLegacyInput &&
    (!input.structure || !hasExplicitAccess || !hasExplicitOrigin)
  ) {
    throw new Error(
      "New journey records require explicit structure, access and origin fields.",
    );
  }

  const structure =
    input.structure ?? structureForLegacyType(input.type as JourneyType);
  const type = input.type ?? legacyTypeForStructure(structure);
  if (structureForLegacyType(type) !== structure) {
    throw new Error("Legacy type and journey structure must agree.");
  }

  const setting = input.setting ?? null;
  const access = hasExplicitAccess ? (input.access ?? null) : null;
  const origin = hasExplicitOrigin ? (input.origin ?? null) : null;
  const originatorType = origin
    ? ORIGINATOR_TYPE_BY_ORIGIN[origin]
    : input.originatorType;
  if (!originatorType) {
    throw new Error(
      "An unapproved origin requires the legacy originatorType field.",
    );
  }

  if (
    origin !== null &&
    input.originatorType !== undefined &&
    input.originatorType !== originatorType
  ) {
    throw new Error("Journey origin and originatorType must agree.");
  }

  const operatorType = input.operatorType ?? null;
  const operatorId = input.operatorId ?? null;

  const visibility = isLegacyInput
    ? type === "caravan"
      ? "public"
      : (input.visibility ?? "members")
    : (input.visibility ?? "members");
  const publicationState = isLegacyInput
    ? type === "caravan"
      ? "approved"
      : (input.publicationState ?? "draft")
    : (input.publicationState ?? "draft");

  if (originatorType === "club" && input.originatorId !== null) {
    throw new Error(
      isLegacyInput
        ? "Club-originated journeys must have a null originatorId."
        : "Sawayatra-conceived journeys must have a null originatorId.",
    );
  }
  if (originatorType !== "club" && input.originatorId === null) {
    throw new Error(
      isLegacyInput
        ? "Member and partner originators require a real originatorId."
        : "Member-proposed and partner-submitted journeys require a real originatorId.",
    );
  }

  if (input.groupFormedAt !== null && access !== "open-to-members") {
    throw new Error("groupFormedAt belongs to journeys open to members only.");
  }
  if (operatorType === null && operatorId !== null) {
    throw new Error("An operatorId requires an explicit operatorType.");
  }
  if (operatorType === "partner" && !operatorId?.trim()) {
    throw new Error("A published partner operator requires a real operatorId.");
  }
  if (input.status === "open" && publicationState !== "approved") {
    throw new Error("A journey may only open after editorial approval.");
  }

  return Object.freeze({
    ...input,
    structure,
    type,
    setting,
    access,
    origin,
    visibility,
    publicationState,
    originatorType,
    operatorType,
    operatorId,
  });
}

export interface JourneyOperatorReference {
  readonly type: OperatorType;
  readonly id: string | null;
}

export function formOpenJourneyGroup(
  journey: JourneyRecord,
  author: { readonly type: Exclude<OriginatorType, "club">; readonly id: string },
  operator: JourneyOperatorReference | string | null,
  formedAt: Date,
): JourneyRecord {
  if (journey.access !== "open-to-members") {
    throw new Error("Only a journey open to members can form an open group.");
  }
  if (
    author.type !== journey.originatorType ||
    author.id !== journey.originatorId
  ) {
    throw new Error("Only the journey's author may decide that its group has formed.");
  }

  const operatorReference: JourneyOperatorReference | null =
    typeof operator === "string" ? { type: "partner", id: operator } : operator;
  if (
    operatorReference?.type === "partner" &&
    !operatorReference.id?.trim()
  ) {
    throw new Error("A published partner operator requires a real operatorId.");
  }

  return Object.freeze({
    ...journey,
    groupFormedAt: new Date(formedAt),
    operatorType: operatorReference?.type ?? null,
    operatorId: operatorReference?.id ?? null,
  });
}

/** Group portraits are always a club editorial responsibility. */
export function mayWriteGroupPortrait(viewer: ViewerContext): boolean {
  return viewer.isClubStaff;
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
