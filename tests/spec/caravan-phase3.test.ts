import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { completeCopyManifest as manifest } from "@/content/caravan/copy-manifest";
import { rawAndeanCaravanModel } from "@/content/caravan/raw-model";

vi.mock("server-only", () => ({}));

describe("Phase 3 content-only governance", () => {
  it("has a unique, complete founder-copy interface with no agent-drafting status", () => {
    const founderSlots = manifest.slots.filter((slot) => slot.copy_class === "founder_copy");
    expect(founderSlots.length).toBeGreaterThanOrEqual(50);
    expect(manifest.slots.length).toBeGreaterThan(250);
    expect(new Set(manifest.slots.map((slot) => slot.slot_id)).size).toBe(manifest.slots.length);
    expect(JSON.stringify(manifest)).not.toContain("drafted");

    for (const slot of founderSlots) {
      expect(slot.max_length).toBeGreaterThan(0);
      expect(slot.status).toBe("needed");
      expect(slot.approved_by).toBeNull();
      expect(slot.placeholder_rendered).toBe(slot.position !== "SEO description");
    }

    expect(manifest.slots.some((slot) => slot.copy_class === "derived_label")).toBe(true);
    expect(manifest.slots.some((slot) => slot.copy_class === "fixed_phrase")).toBe(true);
    expect(manifest.slots.some((slot) => slot.slot_id === "model.caravan.days.day-01.description")).toBe(true);
  });

  it("keeps preview placeholders out of the canonical public Caravan page", () => {
    const canonicalPage = readFileSync("app/(public)/caravans/andean/page.tsx", "utf8");
    expect(canonicalPage).not.toContain("FounderCopy");
    expect(canonicalPage).not.toContain("[COPY:");
  });

  it("contains no Phase 3 specimen or migration-created visual component", () => {
    expect(existsSync("app/(public)/caravans/andean/phase-3-preview/page.tsx")).toBe(false);
    expect(existsSync("components/caravan/FounderCopy.tsx")).toBe(false);
    expect(existsSync("components/caravan/CaravanOverviewMap.tsx")).toBe(false);
    expect(existsSync("content/caravan/specimen.ts")).toBe(false);
  });

  it("records the superseding two-file authority and no-design status", () => {
    expect(manifest.design_status).toBe("not_started_by_instruction");
    expect(manifest.authority.route_master.sha256).toBe(
      "15d8b91c11778c18a090dcca4285121cc18d42068516e5b25a2c2277a2cca88e",
    );
    expect(manifest.authority.migration_prompt.sha256).toBe(
      "a19d2d5362f0bb73c15b4fd25509246e7785cd5a361419c7e22a93afeecdaff0",
    );
    expect(JSON.stringify(manifest)).not.toContain("experience-brief-fixed-phrase");
    expect(JSON.stringify(manifest)).not.toContain("founder-review specimen");
  });

  it("carries known sleeping altitudes while preserving honest contract gaps", () => {
    const section = rawAndeanCaravanModel.sections.find((item) => item.section_id === "03");
    const known = section?.sleep_altitudes.filter((altitude) => altitude.metres !== null) ?? [];
    const pending = section?.sleep_altitudes.filter((altitude) => altitude.metres === null) ?? [];
    expect(known.length).toBeGreaterThan(10);
    expect(pending.length).toBeGreaterThan(0);
    expect(rawAndeanCaravanModel.days.find((day) => day.day === 50)?.sleep_altitude.metres).toBe(4100);
    expect(rawAndeanCaravanModel.days.find((day) => day.day === 47)?.sleep_altitude.qualifier).toBe("pending_contract");
  });

  it("keeps the Puno joiner progression at the locked three nights", () => {
    const section = rawAndeanCaravanModel.sections.find((item) => item.section_id === "02");
    expect(section?.pre_section_progression?.nights).toBe(3);
    expect(section?.pre_section_progression?.sleeping_altitudes).toHaveLength(3);
    expect(section?.pre_section_progression?.sleeping_altitudes.map((night) => night.display)).toEqual([
      "3,400 m · Cusco · night 1",
      "3,400 m · Cusco · night 2",
      "3,400 m · Cusco · night 3",
    ]);
  });
});
