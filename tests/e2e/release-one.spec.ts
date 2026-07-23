import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const andeanDepartureSlugs = [
  "the-andean-caravan",
  "desert-coast",
  "white-city-deep-canyon",
  "the-stone-road",
  "both-shores",
  "thin-air-cloud-forest",
  "silver-and-bone",
  "the-mirror",
  "atacama",
  "the-end-of-the-road",
] as const;

const andeanDepartureRoutes = andeanDepartureSlugs.map(
  (slug) => `/departures/${slug}` as const,
);

const publicRoutes = [
  "/",
  "/how-it-works",
  "/travel-self",
  "/departures",
  ...andeanDepartureRoutes,
  "/membership",
  "/about",
  "/sign-in",
  "/request-invitation",
  "/privacy",
  "/terms",
  "/accessibility",
  "/404",
] as const;

const publicDateNotice = "exact dates announced when the route is secured";
const internalGateDates = [
  "4 February",
  "13 February",
  "20 February",
  "28 February",
  "6 March",
  "15 March",
  "22 March",
  "29 March",
  "2 April",
  "14 April",
] as const;
const prohibitedJourneyFieldPattern =
  /passport|nationality|residence|date.?of.?birth|health|mobility|emergency|room|altitude|insurance|deposit|payment/i;

test.describe("Release 1 route contract", () => {
  for (const route of publicRoutes) {
    test(`${route} renders without horizontal overflow`, async ({ page }) => {
      const response = await page.goto(route);

      if (route === "/404") {
        expect(response?.status()).toBe(404);
      } else {
        expect(response?.ok()).toBe(true);
      }
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));

      expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
    });
  }

  test("an unknown route uses the working 404 state", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

test.describe("Andean departures scope", () => {
  test("keeps Departures as the public navigation label", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1024",
      "One desktop navigation assertion is sufficient.",
    );

    await page.goto("/departures");
    const navigation = page.getByRole("navigation", { name: "Primary" });

    await expect(
      navigation.getByRole("link", { name: "Departures", exact: true }),
    ).toBeVisible();
    await expect(
      navigation.getByRole("link", { name: "Caravans", exact: true }),
    ).toHaveCount(0);
    await expect(
      navigation.getByRole("link", { name: /open seats/i }),
    ).toHaveCount(0);
  });

  test("publishes provisional date wording without internal gate dates", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "wide-1440",
      "One complete public-copy pass is sufficient.",
    );

    for (const route of andeanDepartureRoutes) {
      await page.goto(route);
      await expect(
        page.getByText(publicDateNotice, { exact: false }).first(),
      ).toBeVisible();

      const html = await page.content();
      for (const exactDate of internalGateDates) {
        expect(html, `${route} exposed ${exactDate}`).not.toContain(exactDate);
      }
    }

    await page.goto("/departures/the-andean-caravan");
    await expect(
      page.getByText(
        /^February–April 2028 · exact dates announced when the route is secured\.?$/u,
      ).first(),
    ).toBeVisible();
  });

  test("keeps the journey enquiry non-sensitive and payment-free", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1024",
      "One rendered form contract is sufficient.",
    );

    await page.goto("/departures/the-andean-caravan");
    const fieldDescriptors = await page
      .locator("form input, form select, form textarea")
      .evaluateAll((fields) =>
        fields.flatMap((field) => {
          const control = field as
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement;

          return [
            control.name,
            control.id,
            control.autocomplete,
            ...Array.from(control.labels ?? []).map(
              (label) => label.textContent ?? "",
            ),
          ];
        }),
      );

    expect(fieldDescriptors.join(" ")).not.toMatch(
      prohibitedJourneyFieldPattern,
    );
    await expect(
      page.getByRole("button", { name: /deposit|pay|payment|checkout/i }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /deposit|pay|payment|checkout/i }),
    ).toHaveCount(0);
  });

  test("retires the three visual-manual demo slugs", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "wide-1440",
      "One stale-route pass is sufficient.",
    );

    for (const route of [
      "/departures/patagonia-slowly",
      "/departures/the-carretera-austral",
      "/departures/atacama-and-the-stars",
    ]) {
      await page.goto(route);
      await expect(
        page.getByRole("heading", { level: 1, name: "Page not found" }),
      ).toBeVisible();
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
        "content",
        /noindex/u,
      );
    }
  });
});

test.describe("keyboard interaction", () => {
  test("the collapsed navigation traps focus and closes with Escape", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["mobile-375", "tablet-768"].includes(testInfo.project.name),
      "Collapsed navigation is used below 1024px.",
    );

    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "Menu" });
    await menuButton.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(
      dialog.getByRole("link", { name: "How it works" }),
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("the six-question taster works entirely by keyboard", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-375", "One keyboard flow is sufficient.");

    await page.goto("/travel-self");
    const start = page.getByRole("button", { name: "Begin the taster" });
    await start.focus();
    await page.keyboard.press("Enter");

    for (let question = 1; question <= 6; question += 1) {
      await expect(page.getByText(`${question} of 6`)).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: /^Meet your Travel Self:/u,
        }),
      ).toBeFocused();
      const firstChoice = page.locator('input[type="radio"]').first();
      await firstChoice.focus();
      await page.keyboard.press("Space");
      const next = page.getByRole("button", {
        name:
          question === 6
            ? "Reveal my draft Travel Self"
            : "Next question",
      });
      await next.focus();
      await page.keyboard.press("Enter");
    }

    await expect(page.locator("#travel-self-result")).toBeVisible();
    await expect(page.getByText(/not validated/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Restart the draft taster" }),
    ).toBeVisible();
  });

  test("Andean departure cards expose their route and work by keyboard", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1024", "One keyboard flow is sufficient.");

    await page.goto("/departures");
    const desertCoastCard = page.getByRole("link", {
      name: "Explore Desert Coast",
      exact: true,
    });

    await expect(desertCoastCard).toContainText("Desert Coast");
    await expect(desertCoastCard).toContainText("Lima");
    await expect(desertCoastCard).toContainText("Arequipa");
    await desertCoastCard.press("Enter");

    await expect(page).toHaveURL(/\/departures\/desert-coast$/u);
  });

  test("membership FAQ exposes its expanded state", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1024", "One keyboard flow is sufficient.");

    await page.goto("/membership");
    const faq = page.getByRole("heading", {
      level: 2,
      name: "Questions, answered",
    }).locator("..");
    const firstQuestion = faq.locator("button[aria-controls]").first();
    await firstQuestion.focus();
    await page.keyboard.press("Enter");
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.locator(`#${await firstQuestion.getAttribute("aria-controls")}`),
    ).toBeVisible();
  });
});

test.describe("forms and holding states", () => {
  test("invitation request shows validation, success and duplicate states", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1024", "One complete form flow is sufficient.");

    await page.goto("/request-invitation");
    await page.evaluate(() => window.localStorage.clear());
    const submit = page.getByRole("button", { name: "Request an invitation" });
    await submit.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("alert").filter({ hasText: "Check the form" }),
    ).toBeVisible();

    await page.getByLabel(/^Name/u).fill("Release One Test");
    await page.getByLabel(/^Email/u).fill("release-one@example.com");
    await page.getByLabel(/^Country/u).fill("Egypt");
    await page
      .getByLabel(/^Travel interest/u)
      .fill("A non-sensitive interest in slow, small-group travel.");
    const consent = page.getByRole("checkbox");
    await consent.focus();
    await page.keyboard.press("Space");
    await submit.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("status")).toContainText(
      "Development mock complete",
    );
    await submit.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toContainText(
      "Duplicate mock request",
    );
  });

  test("the holding page never renders authentication fields", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1024", "One route check is sufficient.");

    await page.goto("/sign-in");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Member access is opening in stages.",
      }),
    ).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.getByText("Authentication is not active in Release 1.")).toBeVisible();
  });
});

test.describe("links, metadata and accessibility", () => {
  test("every rendered CTA has a real internal destination", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "wide-1440", "One link crawl is sufficient.");

    const destinations = new Set<string>();

    for (const route of publicRoutes) {
      await page.goto(route);
      const hrefs = await page.locator("a[href]").evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      );

      for (const href of hrefs) {
        expect(href).not.toBe("");
        if (href.startsWith("#")) {
          expect(href).toBe("#main-content");
          continue;
        }
        expect(href).not.toContain("javascript:");
        if (href.startsWith("/")) destinations.add(href);
      }
    }

    for (const href of destinations) {
      const response = await page.request.get(new URL(href, baseURL).toString());
      expect(response.status(), href).toBeLessThan(400);
    }
  });

  test("route metadata has canonical and social fallbacks", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "wide-1440", "One metadata pass is sufficient.");

    await page.goto("/about");
    await expect(page).toHaveTitle("About | Sawayatra");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /PLACEHOLDER/u,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/about$/u,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /social-sawayatra-r1\.webp$/u,
    );

    await page.goto("/sign-in");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/u,
    );
  });

  for (const route of publicRoutes) {
    test(`${route} has no serious axe violations`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop-1024", "One complete axe pass is sufficient.");

      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const serious = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );

      expect(serious).toEqual([]);
    });
  }
});
