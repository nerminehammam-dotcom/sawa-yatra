import type {
  Connection,
  IdentityLayer,
  InterestDeclaration,
  Passport,
  RevealRequest,
} from "./model";

export const DECLARATION_LIFETIME_MONTHS = 6;
export const MAX_OUTSTANDING_REVEALS_PER_POOL = 3;

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

export function declarationExpiresAt(declaration: InterestDeclaration): Date {
  return addMonths(declaration.lastConfirmedAt, DECLARATION_LIFETIME_MONTHS);
}

export function isDeclarationActive(
  declaration: InterestDeclaration,
  now: Date,
): boolean {
  return declarationExpiresAt(declaration).getTime() > now.getTime();
}

export interface PoolState {
  readonly declarations: readonly InterestDeclaration[];
  readonly passportsByMemberId: Readonly<Record<string, Passport>>;
  readonly reveals: readonly RevealRequest[];
  readonly connections: readonly Connection[];
}

export function emptyPoolState(): PoolState {
  return Object.freeze({
    declarations: [],
    passportsByMemberId: Object.freeze({}),
    reveals: [],
    connections: [],
  });
}

export function putPassport(state: PoolState, passport: Passport): PoolState {
  return Object.freeze({
    ...state,
    passportsByMemberId: Object.freeze({
      ...state.passportsByMemberId,
      [passport.memberId]: passport,
    }),
  });
}

export function declareInterest(
  state: PoolState,
  memberId: string,
  journeyId: string,
  now: Date,
): PoolState {
  const existing = state.declarations.find(
    (item) => item.memberId === memberId && item.journeyId === journeyId,
  );
  if (existing) return state;
  return Object.freeze({
    ...state,
    declarations: [
      ...state.declarations,
      Object.freeze({ memberId, journeyId, declaredAt: now, lastConfirmedAt: now }),
    ],
  });
}

export function confirmInterest(
  state: PoolState,
  memberId: string,
  journeyId: string,
  now: Date,
): PoolState {
  return Object.freeze({
    ...state,
    declarations: state.declarations.map((item) =>
      item.memberId === memberId && item.journeyId === journeyId
        ? Object.freeze({ ...item, lastConfirmedAt: now })
        : item,
    ),
  });
}

function voidOutstanding(
  requests: readonly RevealRequest[],
  memberId: string,
  journeyId: string,
): readonly RevealRequest[] {
  return requests.map((request) =>
    request.journeyId === journeyId &&
    request.state === "pending" &&
    (request.fromMemberId === memberId || request.toMemberId === memberId)
      ? Object.freeze({ ...request, state: "void" as const })
      : request,
  );
}

export function withdrawInterest(
  state: PoolState,
  memberId: string,
  journeyId: string,
): PoolState {
  return Object.freeze({
    ...state,
    declarations: state.declarations.filter(
      (item) => !(item.memberId === memberId && item.journeyId === journeyId),
    ),
    reveals: voidOutstanding(state.reveals, memberId, journeyId),
    // Completed connections deliberately survive.
    connections: state.connections,
  });
}

export function expireDeclarations(state: PoolState, now: Date): PoolState {
  return state.declarations.reduce(
    (next, declaration) =>
      isDeclarationActive(declaration, now)
        ? next
        : withdrawInterest(next, declaration.memberId, declaration.journeyId),
    state,
  );
}

export function activeDeclarationsForJourney(
  state: PoolState,
  journeyId: string,
  now: Date,
): readonly InterestDeclaration[] {
  return state.declarations.filter(
    (item) => item.journeyId === journeyId && isDeclarationActive(item, now),
  );
}

export function passportsForJourney(
  state: PoolState,
  journeyId: string,
  now: Date,
): readonly Passport[] {
  return activeDeclarationsForJourney(state, journeyId, now).flatMap((item) => {
    const passport = state.passportsByMemberId[item.memberId];
    return passport ? [passport] : [];
  });
}

function hasActiveDeclaration(
  state: PoolState,
  memberId: string,
  journeyId: string,
  now: Date,
): boolean {
  return activeDeclarationsForJourney(state, journeyId, now).some(
    (item) => item.memberId === memberId,
  );
}

export interface RevealOutcome {
  readonly state: PoolState;
  readonly becameMutual: boolean;
}

export function requestReveal(
  state: PoolState,
  fromMemberId: string,
  toMemberId: string,
  journeyId: string,
  now: Date,
): RevealOutcome {
  if (fromMemberId === toMemberId) throw new Error("A member cannot reveal to themself.");
  for (const memberId of [fromMemberId, toMemberId]) {
    if (!hasActiveDeclaration(state, memberId, journeyId, now)) {
      throw new Error("Reveal is limited to active members of the same journey pool.");
    }
    if (!state.passportsByMemberId[memberId]) {
      throw new Error("Reveal requires reciprocity in the matching layer.");
    }
  }

  const duplicate = state.reveals.find(
    (item) =>
      item.fromMemberId === fromMemberId &&
      item.toMemberId === toMemberId &&
      item.journeyId === journeyId &&
      item.state !== "void",
  );
  if (duplicate) return { state, becameMutual: duplicate.state === "mutual" };

  const reciprocalIndex = state.reveals.findIndex(
    (item) =>
      item.fromMemberId === toMemberId &&
      item.toMemberId === fromMemberId &&
      item.journeyId === journeyId &&
      item.state === "pending",
  );

  if (reciprocalIndex >= 0) {
    const reveals = state.reveals.map((item, index) =>
      index === reciprocalIndex
        ? Object.freeze({ ...item, state: "mutual" as const })
        : item,
    );
    reveals.push(
      Object.freeze({
        fromMemberId,
        toMemberId,
        journeyId,
        state: "mutual" as const,
        createdAt: now,
      }),
    );
    const connection: Connection = Object.freeze({
      memberAId: fromMemberId,
      memberBId: toMemberId,
      journeyId,
      connectedAt: now,
    });
    return {
      becameMutual: true,
      state: Object.freeze({
        ...state,
        reveals,
        connections: [...state.connections, connection],
      }),
    };
  }

  const outstanding = state.reveals.filter(
    (item) =>
      item.fromMemberId === fromMemberId &&
      item.journeyId === journeyId &&
      item.state === "pending",
  ).length;
  if (outstanding >= MAX_OUTSTANDING_REVEALS_PER_POOL) {
    throw new Error("A member may hold at most 3 unanswered requests in one pool.");
  }

  return {
    becameMutual: false,
    state: Object.freeze({
      ...state,
      reveals: [
        ...state.reveals,
        Object.freeze({
          fromMemberId,
          toMemberId,
          journeyId,
          state: "pending" as const,
          createdAt: now,
        }),
      ],
    }),
  };
}

/** A one-way request intentionally has no recipient-visible representation. */
export function revealStateVisibleToRecipient(
  state: PoolState,
  recipientId: string,
  journeyId: string,
): readonly RevealRequest[] {
  return state.reveals.filter(
    (item) =>
      item.journeyId === journeyId &&
      item.state === "mutual" &&
      (item.fromMemberId === recipientId || item.toMemberId === recipientId),
  );
}

export function identitiesForConnections(
  state: PoolState,
  viewerId: string,
  journeyId: string,
  identities: Readonly<Record<string, IdentityLayer>>,
): readonly IdentityLayer[] {
  return state.connections
    .filter(
      (connection) =>
        connection.journeyId === journeyId &&
        (connection.memberAId === viewerId || connection.memberBId === viewerId),
    )
    .flatMap((connection) => {
      const otherId =
        connection.memberAId === viewerId
          ? connection.memberBId
          : connection.memberAId;
      const identity = identities[otherId];
      return identity ? [identity] : [];
    });
}

