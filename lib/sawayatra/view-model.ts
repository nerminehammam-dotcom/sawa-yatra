import type {
  IdentityLayer,
  JourneyRecord,
  MembershipStatus,
  Passport,
  ViewerContext,
} from "./model";

export type JourneyViewLevel = "public" | "fit" | "pool";
export type GroupPortraitMode = "intended" | "actual";

export interface PassportDTO {
  readonly memberId: string;
  readonly archetype: string;
  readonly axes: Readonly<Record<string, number>>;
  readonly demographics: {
    readonly nationality?: string;
    readonly gender?: string;
    readonly ageBand?: string;
  };
}

export interface RevealedIdentityDTO {
  readonly memberId: string;
  readonly firstName: string;
  readonly photograph: string;
}

export interface JourneyViewModel {
  readonly journey: JourneyRecord;
  readonly isMember: boolean;
  readonly canViewJourney: boolean;
  readonly viewLevel: JourneyViewLevel;
  readonly showsFitLayer: boolean;
  readonly showsMatchLayer: boolean;
  readonly canDeclareInterest: boolean;
  readonly poolSize: number;
  readonly matchablePoolSize: number;
  readonly portraitMode: GroupPortraitMode;
  readonly portrait: string;
  readonly passports: readonly PassportDTO[];
  readonly revealedIdentities: readonly RevealedIdentityDTO[];
  readonly needsTravelSelfPrompt: boolean;
  readonly isAuthor: boolean;
}

export interface JourneyViewInput {
  readonly viewer: ViewerContext;
  readonly journey: JourneyRecord;
  readonly poolSize: number;
  readonly poolPassports: readonly Passport[];
  readonly revealedIdentities?: readonly IdentityLayer[];
}

export function isMemberStatus(status: MembershipStatus): boolean {
  return status === "member";
}

export function mayRouteJourney(
  journey: JourneyRecord,
  viewer: ViewerContext,
): boolean {
  const isAuthor = viewer.authoredJourneyIds.includes(journey.id);
  if (journey.publicationState !== "approved") {
    return isAuthor || viewer.isClubStaff;
  }
  if (journey.status === "draft") return isAuthor || viewer.isClubStaff;
  if (journey.visibility === "members") return isMemberStatus(viewer.membershipStatus);
  return true;
}

export function toPassportDTO(passport: Passport): PassportDTO {
  const demographics: {
    nationality?: string;
    gender?: string;
    ageBand?: string;
  } = {};
  if (passport.demographics.nationality) {
    demographics.nationality = passport.demographics.nationality;
  }
  if (passport.demographics.gender) {
    demographics.gender = passport.demographics.gender;
  }
  if (passport.demographics.ageBand) {
    demographics.ageBand = passport.demographics.ageBand;
  }
  return Object.freeze({
    memberId: passport.memberId,
    archetype: passport.archetype,
    axes: passport.axes,
    demographics: Object.freeze(demographics),
  });
}

export function computeJourneyViewModel(input: JourneyViewInput): JourneyViewModel {
  const { viewer, journey } = input;
  const isMember = isMemberStatus(viewer.membershipStatus);
  const hasDeclaredInterest = viewer.declaredJourneyIds.includes(journey.id);
  const isAuthor = viewer.authoredJourneyIds.includes(journey.id);
  const canViewJourney = mayRouteJourney(journey, viewer);
  const viewLevel: JourneyViewLevel = !isMember
    ? "public"
    : hasDeclaredInterest
      ? "pool"
      : "fit";
  const showsFitLayer =
    (viewLevel === "fit" || viewLevel === "pool") && viewer.hasSavedTravelSelf;
  const showsMatchLayer = viewLevel === "pool" && viewer.hasSavedTravelSelf;
  const matchablePoolSize = input.poolPassports.length;
  const portraitMode: GroupPortraitMode =
    matchablePoolSize < 5 ? "intended" : "actual";
  const statusAllowsDeclaration = journey.status === "open";

  return Object.freeze({
    journey,
    isMember,
    canViewJourney,
    viewLevel,
    showsFitLayer,
    showsMatchLayer,
    canDeclareInterest:
      canViewJourney && isMember && !hasDeclaredInterest && statusAllowsDeclaration,
    poolSize: input.poolSize,
    matchablePoolSize,
    portraitMode,
    portrait: journey.groupPortrait[portraitMode],
    passports: showsMatchLayer ? input.poolPassports.map(toPassportDTO) : [],
    revealedIdentities: showsMatchLayer
      ? (input.revealedIdentities ?? []).map(({ memberId, firstName, photograph }) =>
          Object.freeze({ memberId, firstName, photograph }),
        )
      : [],
    needsTravelSelfPrompt: isMember && !viewer.hasSavedTravelSelf,
    isAuthor,
  });
}

export function canViewPoolRoute(
  journeyId: string,
  viewer: ViewerContext,
): boolean {
  return (
    viewer.membershipStatus === "member" &&
    viewer.declaredJourneyIds.includes(journeyId)
  );
}
