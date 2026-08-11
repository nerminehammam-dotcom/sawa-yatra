import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { routeMetadata } from "@/content/site";

const root = process.cwd();

function source(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("Caravans collection and product hierarchy", () => {
  it("keeps the collection route public instead of redirecting to one product", () => {
    expect(source("next.config.ts")).not.toMatch(
      /source:\s*["']\/caravans["']/,
    );
    expect(source("app/sitemap.ts")).not.toContain(
      'entry.path !== "/caravans"',
    );
  });

  it("gives the collection and product distinct public metadata", () => {
    const collection = routeMetadata.find((entry) => entry.path === "/caravans");
    const product = routeMetadata.find(
      (entry) => entry.path === "/caravans/andean",
    );

    expect(collection?.title).toBe("Caravans | Sawayatra");
    expect(product?.title).toBe("The Andean Caravan | Sawayatra");
    expect(collection?.title).not.toBe(product?.title);
  });

  it("keeps product detail out of the collection catalogue", () => {
    const catalogue = source("app/(public)/caravans/page.tsx");

    expect(catalogue).toContain('href="/caravans/andean"');
    expect(catalogue).not.toContain("RouteIndex");
    expect(catalogue).not.toContain("CaravanRouteMap");
  });
});
