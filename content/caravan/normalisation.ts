import type {
  CanonicalRecoveryRole,
  SourceRecoveryRole,
} from "./types";

interface RecoveryNormalisation {
  readonly roles: readonly CanonicalRecoveryRole[];
  readonly protectedMarker: boolean;
}

/**
 * Founder-approved DD-02 mapping. Source vocabulary is resolved here, once,
 * before any visual component receives a day record.
 */
export const recoveryRoleNormalisation = {
  "Protected arrival": {
    roles: ["Protected shoulder"],
    protectedMarker: true,
  },
  Recovery: { roles: ["Recovery"], protectedMarker: true },
  Normal: { roles: ["Normal"], protectedMarker: false },
  Watch: { roles: ["Watch"], protectedMarker: false },
  Protected: {
    roles: ["Protected shoulder"],
    protectedMarker: true,
  },
  Buffer: { roles: ["Buffer"], protectedMarker: true },
  "Normal · protects the exception": {
    roles: ["Normal", "Protected shoulder"],
    protectedMarker: true,
  },
  "Watch · exception begins": {
    roles: ["Watch"],
    protectedMarker: false,
  },
  "Watch · exception ends": {
    roles: ["Watch"],
    protectedMarker: false,
  },
  "Recovery · protects the exception": {
    roles: ["Recovery", "Protected shoulder"],
    protectedMarker: true,
  },
  "Recovery / choice": {
    roles: ["Recovery"],
    protectedMarker: true,
  },
  "Recovery / weather": {
    roles: ["Recovery"],
    protectedMarker: true,
  },
  "Weather window": {
    roles: ["Buffer"],
    protectedMarker: true,
  },
  "Recovery progression": {
    roles: ["Recovery"],
    protectedMarker: true,
  },
  "Buffer / closure": {
    roles: ["Buffer", "Closure"],
    protectedMarker: true,
  },
  "Departure / closure": {
    roles: ["Closure"],
    protectedMarker: false,
  },
} as const satisfies Record<SourceRecoveryRole, RecoveryNormalisation>;

export function normaliseRecoveryRole(
  sourceRole: SourceRecoveryRole,
): RecoveryNormalisation {
  const result = recoveryRoleNormalisation[sourceRole];
  if (!result) {
    throw new Error(`Unmapped source recovery role: ${sourceRole}`);
  }
  return result;
}
