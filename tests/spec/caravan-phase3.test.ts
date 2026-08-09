import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import manifest from "@/content/caravan/copy-manifest.json";
import { rawAndeanCaravanModel } from "@/content/caravan/raw-model";

vi.mock("server-only", () => ({}));

describe("Phase 3 Caravan specimen governance", () => {
  it("has a unique, complete founder-copy interface with no agent-drafting status", () => {
    const founderSlots = manifest.slots.filter((slot) => slot.copy_class === "founder_copy");
    expect(founderSlots.length).toBeGreaterThanOrEqual(50);
    expect(new Set(manifest.slots.map((slot) => slot.slot_id)).size).toBe(manifest.slots.length);
    expect(JSON.stringify(manifest)).not.toContain("drafted");

    for (const slot of founderSlots) {
      expect(slot.max_length).toBeGreaterThan(0);
      expect(slot.status).toBe("needed");
      expect(slot.approved_by).toBeNull();
      expect(slot.placeholder_rendered).toBe(slot.position !== "SEO description");
    }
  });

  it("keeps preview placeholders out of the canonical public Caravan page", () => {
    const canonicalPage = readFileSync("app/(public)/caravans/andean/page.tsx", "utf8");
    expect(canonicalPage).not.toContain("FounderCopy");
    expect(canonicalPage).not.toContain("[COPY:");
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
});
