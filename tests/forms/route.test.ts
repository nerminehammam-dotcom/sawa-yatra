// @vitest-environment node

import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/forms/[kind]/route";

function routeContext(kind: string) {
  return { params: Promise.resolve({ kind }) };
}

describe("mock form route", () => {
  it("explicitly acknowledges a valid request without sending or storing it", async () => {
    const request = new Request(
      "http://localhost/api/forms/invitation-request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "A Traveller",
          email: "traveller@example.com",
          country: "Egypt",
          travelInterest: "A small-group journey.",
          consent: true,
        }),
      },
    );

    const response = await POST(request, routeContext("invitation-request"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(body).toMatchObject({
      ok: true,
      mode: "development-mock",
      kind: "invitation-request",
      sent: false,
      storedOnServer: false,
    });
  });

  it("validates the request again on the server", async () => {
    const request = new Request(
      "http://localhost/api/forms/journey-interest",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "A Traveller",
          email: "not-an-email",
          journey: "sample-journey",
          travelSelfResult: "not-completed",
          shortNote: "I am interested in this journey.",
          consent: false,
        }),
      },
    );

    const response = await POST(request, routeContext("journey-interest"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      mode: "development-mock",
      code: "validation-error",
      sent: false,
      storedOnServer: false,
    });
    expect(body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "email" }),
        expect.objectContaining({ path: "consent" }),
      ]),
    );
  });

  it("rejects unknown form kinds", async () => {
    const request = new Request("http://localhost/api/forms/not-a-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    const response = await POST(request, routeContext("not-a-form"));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      code: "invalid-form-kind",
      mode: "development-mock",
      sent: false,
      storedOnServer: false,
    });
  });

  it("rejects journey and Travel Self identifiers outside typed content", async () => {
    const request = new Request(
      "http://localhost/api/forms/journey-interest",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "A Traveller",
          email: "traveller@example.com",
          journey: "invented-journey",
          travelSelfResult: "invented-archetype",
          shortNote: "I am interested in this journey.",
          consent: true,
        }),
      },
    );

    const response = await POST(request, routeContext("journey-interest"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "journey" }),
        expect.objectContaining({ path: "travelSelfResult" }),
      ]),
    );
  });
});
