import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const CLAIM_LIFETIME_DAYS = 30;

interface ClaimPayload {
  readonly resultId: string;
  readonly expiresAt: number;
  readonly nonce: string;
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function issueClaimToken(
  resultId: string,
  secret: string,
  now: Date,
): string {
  if (secret.length < 32) throw new Error("Claim-token secret must be at least 32 characters.");
  const payload: ClaimPayload = {
    resultId,
    expiresAt: now.getTime() + CLAIM_LIFETIME_DAYS * 24 * 60 * 60 * 1000,
    nonce: randomBytes(18).toString("base64url"),
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

function readPayload(token: string, secret: string): ClaimPayload {
  const [encodedPayload, presentedSignature, extra] = token.split(".");
  if (!encodedPayload || !presentedSignature || extra) {
    throw new Error("Invalid claim token.");
  }
  const expectedSignature = sign(encodedPayload, secret);
  const presented = Buffer.from(presentedSignature);
  const expected = Buffer.from(expectedSignature);
  if (presented.length !== expected.length || !timingSafeEqual(presented, expected)) {
    throw new Error("Invalid claim token.");
  }
  const parsed = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8"),
  ) as Partial<ClaimPayload>;
  if (
    typeof parsed.resultId !== "string" ||
    typeof parsed.expiresAt !== "number" ||
    typeof parsed.nonce !== "string"
  ) {
    throw new Error("Invalid claim token.");
  }
  return parsed as ClaimPayload;
}

export class ClaimRegistry {
  readonly #claimedResultIds = new Set<string>();
  readonly #usedNonces = new Set<string>();

  claim(token: string, expectedResultId: string, secret: string, now: Date): string {
    const payload = readPayload(token, secret);
    if (payload.resultId !== expectedResultId) throw new Error("Claim token does not match result.");
    if (payload.expiresAt <= now.getTime()) throw new Error("Claim token has expired.");
    if (this.#usedNonces.has(payload.nonce) || this.#claimedResultIds.has(payload.resultId)) {
      throw new Error("Travel Self result has already been claimed.");
    }
    this.#usedNonces.add(payload.nonce);
    this.#claimedResultIds.add(payload.resultId);
    return payload.resultId;
  }
}

