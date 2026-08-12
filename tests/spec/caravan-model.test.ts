import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { normaliseRecoveryRole, recoveryRoleNormalisation } from "@/content/caravan/normalisation";
import { rawAndeanCaravanModel } from "@/content/caravan/raw-model";
import {
  PUBLIC_CONTENT_VISIBILITIES,
  type CaravanRouteModel,
  type SourceRecoveryRole,
} from "@/content/caravan/types";
import { validateCaravanModel } from "@/content/caravan/validate";

vi.mock("server-only", () => ({}));

describe("Phase 2 canonical Caravan model", () => {
  it("T01/T07/T08 validates the complete source model", () => {
    expect(validateCaravanModel(rawAndeanCaravanModel)).toEqual([]);
    expect(rawAndeanCaravanModel.days).toHaveLength(71);
    expect(rawAndeanCaravanModel.days.map((day) => day.day)).toEqual(
      Array.from({ length: 71 }, (_, index) => index + 1),
    );
    expect(
      rawAndeanCaravanModel.sections.map(
        (section) => section.day_end - section.day_start + 1,
      ),
    ).toEqual([23, 16, 18, 14]);
  });

  it("T09/T10/T11 gives Section 01 canonical ownership of the shared Stone Road days", async () => {
    const { getPublicCaravanSection, getPublicStoneRoad } = await import(
      "@/content/caravan/public"
    );
    const sectionOne = getPublicCaravanSection("01");
    const stoneRoad = getPublicStoneRoad();

    expect(stoneRoad.days).toHaveLength(8);
    expect(stoneRoad.days.map((day) => day.day)).toEqual([
      16, 17, 18, 19, 20, 21, 22, 23,
    ]);
    expect(stoneRoad.days[0]).toBe(
      sectionOne.days.find((day) => day.day === 16),
    );
    expect(stoneRoad.product?.canonical_for).toBe(
      "/journeys/caravans/andean-caravan/sea-to-stone",
    );
    expect(stoneRoad.product?.canonical_document_has_fragment).toBe(false);
  });

  it("T12/T13 has four unique section names and one product-stage exception", () => {
    const sectionNames = rawAndeanCaravanModel.sections.map(
      (section) => section.name,
    );
    expect(new Set(sectionNames).size).toBe(4);
    expect(
      rawAndeanCaravanModel.stages.filter((stage) => stage.product_behaviour),
    ).toEqual([
      expect.objectContaining({ id: "01-c", name: "The Stone Road" }),
    ]);
    expect(rawAndeanCaravanModel.stages.map((stage) => stage.name)).not.toContain(
      "Both Shores",
    );
    expect(rawAndeanCaravanModel.stages.map((stage) => stage.name)).not.toContain(
      "The Mirror",
    );
  });

  it("T14/T15/T16 derives five Caravan gates and keeps Cusco joining-only", async () => {
    const { getPublicCaravanMapData } = await import("@/content/caravan/public");
    const map = getPublicCaravanMapData();

    expect(map.caravanGates).toHaveLength(5);
    expect(map.shortFormJoiningGate?.gate_class).toBe(
      "short_form_joining_gate",
    );
    expect(
      rawAndeanCaravanModel.sections.some((section) => section.gate_to === "cusco"),
    ).toBe(false);
  });

  it("T18/T19/T20/T22 pins corrected altitude, capacity and flight facts", () => {
    const gate = (id: string) =>
      rawAndeanCaravanModel.gates.find((candidate) => candidate.id === id);
    expect(gate("santiago")?.altitude.display).toBe("Approx. 520 m");
    expect(gate("balmaceda")?.altitude.display).toBe("525 m");
    expect(rawAndeanCaravanModel.group_max).toBe(12);
    expect(rawAndeanCaravanModel.sections.every((section) => section.group_max === 12)).toBe(true);
    expect(rawAndeanCaravanModel.scheduled_flight_movements_total).toBe(5);
    expect(rawAndeanCaravanModel.scheduled_flight_movements_in_route).toBe(4);
    expect(rawAndeanCaravanModel.included_exit_movement).toMatchObject({
      from: "balmaceda",
      to: "santiago",
      included: true,
      outside_route_geometry: true,
    });
  });

  it("T24/T28/T30/T32/T33 carries readiness, maker and laundry controls", () => {
    const s02 = rawAndeanCaravanModel.sections.find(
      (section) => section.section_id === "02",
    );
    const s03 = rawAndeanCaravanModel.sections.find(
      (section) => section.section_id === "03",
    );

    expect(s02?.subline).toBe("Titicaca, La Paz and the cloud forest");
    expect(s02?.pre_section_progression?.nights).toBe(3);
    expect(s03?.acclimatisation_ladder).toHaveLength(11);
    expect(s03?.declared_load_exception).toMatchObject({
      day_start: 49,
      day_end: 53,
      consecutive_demanding_days: 5,
      refuge_nights: 3,
      protected_shoulders: [48, 54],
    });
    for (const stage of rawAndeanCaravanModel.stages) {
      expect(stage.makers_encounter.strategy).toBeTruthy();
      expect(stage.laundry_availability.availability).toBeTruthy();
    }
  });

  it("DD-02/T121 explicitly normalises every source recovery role", () => {
    const sourceRoles = new Set(
      rawAndeanCaravanModel.days.map((day) => day.source_recovery_role),
    );
    expect([...sourceRoles].sort()).toEqual(
      (Object.keys(recoveryRoleNormalisation) as SourceRecoveryRole[]).sort(),
    );
    for (const sourceRole of sourceRoles) {
      expect(() => normaliseRecoveryRole(sourceRole)).not.toThrow();
    }
    expect(
      rawAndeanCaravanModel.days.find((day) => day.day === 15),
    ).toMatchObject({
      source_recovery_role: "Protected",
      recovery_role: ["Protected shoulder"],
      protected_marker: true,
    });
    expect(
      rawAndeanCaravanModel.days.find((day) => day.day === 20)?.protected_marker,
    ).toBe(false);
  });

  it("T02/T04 removes internal operations, legal records and source metadata", async () => {
    const { getPublicAndeanCaravan } = await import("@/content/caravan/public");
    const json = JSON.stringify(getPublicAndeanCaravan());

    expect(PUBLIC_CONTENT_VISIBILITIES).toEqual([
      "public",
      "pre_sale_disclosure",
    ]);
    expect(json).not.toContain("internal_operations");
    expect(json).not.toContain("legal_review");
    expect(json).not.toContain("[SIGN-OFF]");
    expect(json).not.toContain("PRODUCTION NOTE");
    expect(json).not.toContain("OPERATING TARGET");
    expect(json).not.toContain("source_ids");
    expect(json).not.toContain("recheck_date");
    expect(json).toContain("Declared Load Exception");
  });

  it("T03 keeps raw content imports out of public pages and components", () => {
    const roots = ["app", "components"];
    const forbidden = [
      "@/content/caravan/raw-model",
      "@/content/caravan/raw-days",
      "content/caravan/raw-model",
      "content/caravan/raw-days",
    ];

    const walk = (directory: string): string[] => {
      return readdirSync(directory).flatMap((entry) => {
        const path = join(directory, entry);
        return statSync(path).isDirectory() ? walk(path) : [path];
      });
    };

    for (const file of roots.flatMap(walk).filter((path) => /\.(ts|tsx)$/.test(path))) {
      const source = readFileSync(file, "utf8");
      for (const specifier of forbidden) {
        expect(source, `${file} imports ${specifier}`).not.toContain(specifier);
      }
    }
  });

  it("T29 rejects a secured date-sensitive record after its recheck date", () => {
    const days = rawAndeanCaravanModel.days.map((day, index) =>
      index === 0
        ? { ...day, status: "secured" as const, recheck_date: "2026-01-01" }
        : day,
    );
    const fixture = { ...rawAndeanCaravanModel, days } as CaravanRouteModel;
    expect(
      validateCaravanModel(fixture, new Date("2026-08-10T00:00:00Z")),
    ).toEqual(expect.arrayContaining([expect.stringContaining("T29")]));
  });
});
