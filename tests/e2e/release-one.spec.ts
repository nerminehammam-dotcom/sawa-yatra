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
  "/caravans",
  "/caravans/the-andean-caravan",
  "/joining-points",
  "/how-it-works",
  "/travel-self",
  "/departures",
  "/do-it-yourself",
  ...andeanDepartureRoutes,
  "/membership",
  "/about",
  "/start-here",
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

  test("the Do It Yourself title is the sole H1 with unchanged styling", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["mobile-375", "wide-1440"].includes(testInfo.project.name),
      "The title is checked at the approved mobile and desktop widths.",
    );

    await page.goto("/do-it-yourself");
    await page.evaluate(() => document.fonts.ready);

    const heading = page.locator("h1");
    await expect(heading).toHaveCount(1);
    await expect(heading).toHaveText("Create Coming later");
    await expect(heading.locator("span")).toHaveText("Coming later");

    const appearance = await heading.evaluate((element) => {
      const style = getComputedStyle(element);

      return {
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: parseFloat(style.fontSize),
        fontWeight: style.fontWeight,
        letterSpacing: parseFloat(style.letterSpacing),
        lineHeight: parseFloat(style.lineHeight),
        maxWidth: style.maxWidth,
        viewportWidth: window.innerWidth,
      };
    });
    const expectedFontSize =
      appearance.viewportWidth <= 767
        ? Math.min(96, Math.max(64, appearance.viewportWidth * 0.2))
        : Math.min(144, Math.max(64, appearance.viewportWidth * 0.09));

    expect(appearance.color).toBe("rgb(231, 225, 214)");
    expect(appearance.fontFamily).toContain("Fraunces");
    expect(appearance.fontSize).toBeCloseTo(expectedFontSize, 1);
    expect(appearance.fontWeight).toBe("400");
    expect(appearance.letterSpacing).toBeCloseTo(
      expectedFontSize * -0.025,
      1,
    );
    expect(appearance.lineHeight).toBeCloseTo(expectedFontSize * 0.86, 1);
    expect(appearance.maxWidth).not.toBe("none");
  });
});

test.describe("Andean caravan scope", () => {
  test("uses the approved primary and utility navigation", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1024",
      "One desktop navigation assertion is sufficient.",
    );

    await page.goto("/");
    const navigation = page.getByRole("navigation", { name: "Primary" });
    const primaryList = navigation.getByRole("list", {
      name: "Primary navigation links",
    });
    const primaryLinks = primaryList.locator(":scope > li > a");
    const expectedPrimaryNavigation = [
      ["How it works", "/how-it-works"],
      ["Meet your Travel Self", "/travel-self"],
      ["Caravan Hop On Hop Off", "/caravans"],
      ["Do It Yourself", "/do-it-yourself"],
      ["Discover Journeys With Others", "/departures"],
      ["About", "/about"],
    ] as const;

    await expect(primaryLinks).toHaveCount(expectedPrimaryNavigation.length);
    for (const [index, [label, href]] of expectedPrimaryNavigation.entries()) {
      await expect(primaryLinks.nth(index)).toHaveText(label);
      await expect(primaryLinks.nth(index)).toHaveAttribute("href", href);
    }
    await expect(
      primaryList.getByRole("link", { name: "Membership", exact: true }),
    ).toHaveCount(0);
    const utilityActions = navigation.getByRole("group", {
      name: "Utility actions",
    });
    await expect(
      utilityActions.getByRole("link", {
        name: "Become a Member",
        exact: true,
      }),
    ).toHaveAttribute("href", "/membership");
    await expect(
      utilityActions.getByRole("link", { name: "Sign in", exact: true }),
    ).toHaveAttribute("href", "/sign-in");
    await expect(
      navigation.getByRole("link", { name: /open seats/i }),
    ).toHaveCount(0);

    const navigationGeometry = await primaryLinks.evaluateAll((links) => ({
      tops: links.map((link) => link.getBoundingClientRect().top),
      whiteSpace: links.map((link) => getComputedStyle(link).whiteSpace),
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(
      Math.max(...navigationGeometry.tops) - Math.min(...navigationGeometry.tops),
    ).toBeLessThanOrEqual(1);
    expect(navigationGeometry.whiteSpace).toEqual(
      Array(expectedPrimaryNavigation.length).fill("nowrap"),
    );
    expect(navigationGeometry.documentWidth).toBeLessThanOrEqual(
      navigationGeometry.viewportWidth,
    );
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

  test("renders the approved Flights fact exactly once", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1024",
      "One departure-facts regression pass is sufficient.",
    );

    await page.goto("/departures/the-andean-caravan");
    const completeFacts = page.locator(
      'dl[aria-label="Complete Caravan facts"]',
    );
    const completeFlights = completeFacts.locator("dt").filter({
      hasText: "Flights",
    });
    await expect(completeFlights).toHaveCount(1);
    await expect(completeFlights.locator("..").locator("dd")).toHaveText(
      "Four short flights",
    );

    for (const route of andeanDepartureRoutes.slice(1)) {
      await page.goto(route);
      const sectionFlights = page
        .locator('dl[aria-label$=" facts"] dt')
        .filter({ hasText: "Flights" });
      await expect(sectionFlights, route).toHaveCount(0);
    }
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

test.describe("Caravans map regressions", () => {
  test("keeps hydration deterministic and overflow local to the map stage", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "wide-1440",
      "One controlled viewport sweep is sufficient.",
    );

    const hydrationErrors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (
        message.type() === "error" &&
        /hydrated but some attributes|hydration mismatch|--leader-angle/iu.test(
          text,
        )
      ) {
        hydrationErrors.push(text);
      }
    });

    const expectNoRootOverflow = async (context: string) => {
      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        scrollX: window.scrollX,
      }));

      expect(dimensions.document, context).toBeLessThanOrEqual(
        dimensions.viewport,
      );
      expect(dimensions.body, context).toBeLessThanOrEqual(
        dimensions.viewport,
      );
      expect(dimensions.scrollX, context).toBe(0);
    };

    for (const width of [1440, 1280, 1024, 768, 390, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/caravans");
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(750);

      const leaderAngles = await page
        .locator("[data-route-id]")
        .evaluateAll((stops) =>
          stops.map((stop) =>
            (stop as HTMLElement).style.getPropertyValue("--leader-angle"),
          ),
        );
      expect(
        leaderAngles.every((angle) => /^-?\d+\.\d{6}deg$/u.test(angle)),
        `${width}px leader angles use fixed precision`,
      ).toBe(true);
      await expectNoRootOverflow(`${width}px initial render`);

      const zoomIn = page.getByRole("button", {
        name: "Show a closer map view",
      });
      await zoomIn.click();
      await expect(page.getByText("Closer", { exact: true })).toBeVisible();
      await zoomIn.click();
      await expect(page.getByText("Closest", { exact: true })).toBeVisible();
      await page.waitForTimeout(750);
      await expectNoRootOverflow(`${width}px maximum zoom`);

      const mapStageDimensions = await page
        .locator(
          '[aria-label^="Illustrated geographic map of the Andean Caravan"]',
        )
        .evaluate((stage) => ({
          client: stage.clientWidth,
          scroll: stage.scrollWidth,
        }));
      expect(
        mapStageDimensions.scroll,
        `${width}px map canvas remains internally zoomable`,
      ).toBeGreaterThan(mapStageDimensions.client);

      const stopThirteen = page.getByRole("button", {
        name: "Stop 13: Balmaceda (return), Chile",
      });
      await stopThirteen.focus();
      await page.keyboard.press("Enter");
      await expect(stopThirteen).toHaveAttribute("aria-pressed", "true");
      await page.waitForTimeout(80);
      await expectNoRootOverflow(`${width}px destination-card entrance`);

      const routeLog = page.getByRole("complementary", {
        name: "Selected route stop",
      });
      const destinationCard = routeLog.locator(":scope > div");
      const animation = await destinationCard.evaluate((card) => {
        const style = getComputedStyle(card);
        return {
          duration: style.animationDuration,
          name: style.animationName,
          transform: style.transform,
        };
      });
      expect(animation.name).toContain("reveal-card");
      expect(parseFloat(animation.duration)).toBeGreaterThan(0);
      expect(animation.transform).not.toBe("none");

      await page.waitForTimeout(700);
      await expectNoRootOverflow(`${width}px selected destination settled`);

      const previousStop = routeLog.getByRole("button", {
        name: "Previous stop",
      });
      const restingBackground = await previousStop.evaluate(
        (button) => getComputedStyle(button).backgroundColor,
      );
      await previousStop.focus();
      await expect(previousStop).toBeFocused();
      const focusEvidence = await previousStop.evaluate((button) => {
        const buttonRect = button.getBoundingClientRect();
        const routeLogRect = button
          .closest('aside[aria-label="Selected route stop"]')
          ?.getBoundingClientRect();
        const style = getComputedStyle(button);
        const outlineWidth = parseFloat(style.outlineWidth) || 0;

        return {
          background: style.backgroundColor,
          buttonLeft: buttonRect.left - outlineWidth,
          buttonRight: buttonRect.right + outlineWidth,
          routeLogLeft: routeLogRect?.left ?? 0,
          routeLogRight: routeLogRect?.right ?? 0,
        };
      });
      expect(focusEvidence.background).not.toBe(restingBackground);
      expect(focusEvidence.buttonLeft).toBeGreaterThanOrEqual(
        focusEvidence.routeLogLeft,
      );
      expect(focusEvidence.buttonRight).toBeLessThanOrEqual(
        focusEvidence.routeLogRight,
      );
    }

    expect(hydrationErrors).toEqual([]);
  });
});

test.describe("keyboard interaction", () => {
  test("the illustrated Caravan map can be explored without a pointer", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1024", "One keyboard map flow is sufficient.");

    await page.goto("/departures/the-andean-caravan#caravan-route-map-heading");
    await expect(
      page.getByRole("heading", { level: 3, name: "Follow the Andes south." }),
    ).toBeVisible();
    const routeOverview = page.locator(
      'dl[aria-label="Complete Caravan route overview"]',
    );
    await expect(routeOverview).not.toContainText("Puno");
    await expect(routeOverview).toContainText("Balmaceda Airport (arrival)");
    await expect(routeOverview).toContainText(
      "Carretera Austral to Villa O’Higgins",
    );
    await expect(routeOverview).toContainText("Balmaceda (return)");

    const uyuni = page.getByRole("button", {
      name: "Stop 7: Uyuni, Bolivia",
    });
    await uyuni.click();
    const destinationCard = page.getByRole("complementary", {
      name: "Selected route stop",
    });
    await expect(destinationCard).toContainText("3,656 m");
    await expect(destinationCard).toContainText("29.7k");
    await expect(destinationCard).toContainText("08 · Atacama");
    await expect(
      destinationCard.getByRole("img", {
        name: "A shallow high-altitude lagoon reflects the mountains near Uyuni.",
      }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Show a closer map view" }).click();
    await expect(page.getByText("Closer", { exact: true })).toBeVisible();

    const balmaceda = page.getByRole("button", {
      name: "Stop 13: Balmaceda (return), Chile",
    });
    await balmaceda.focus();
    await page.keyboard.press("Enter");
    await expect(balmaceda).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("complementary", { name: "Selected route stop" }),
    ).toContainText("Balmaceda");
    await expect(
      page.getByRole("progressbar", {
        name: "Progress along the illustrated route",
      }),
    ).toHaveAttribute("aria-valuenow", "100");
  });

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
    const mobilePrimaryLinks = dialog
      .getByRole("list", { name: "Primary navigation links" })
      .locator(":scope > li > a:first-child");
    await expect(mobilePrimaryLinks).toHaveCount(6);
    await expect(mobilePrimaryLinks).toHaveText([
      "How it works",
      "Meet your Travel Self",
      "Caravan Hop On Hop Off",
      "Do It Yourself",
      "Discover Journeys With Others",
      "About",
    ]);
    const mobileUtilities = dialog.getByRole("group", {
      name: "Utility actions",
    });
    await expect(
      mobileUtilities.getByRole("link", { name: "Become a Member" }),
    ).toHaveAttribute("href", "/membership");
    await expect(
      mobileUtilities.getByRole("link", { name: "Sign in" }),
    ).toHaveAttribute("href", "/sign-in");
    const mobileGeometry = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(mobileGeometry.documentWidth).toBeLessThanOrEqual(
      mobileGeometry.viewportWidth,
    );

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

  test("the Caravan entry and departure cards work by keyboard", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1024", "One keyboard flow is sufficient.");

    await page.goto("/departures");
    const caravanEntry = page.locator(
      'a[href="/departures/the-andean-caravan"]',
    );

    await expect(caravanEntry).toHaveCount(1);
    await caravanEntry.focus();
    await Promise.all([
      page.waitForURL(/\/departures\/the-andean-caravan$/u),
      page.keyboard.press("Enter"),
    ]);

    const desertCoastCard = page.getByRole("link", {
      name: /Caravan section Desert Coast/u,
    });

    await expect(desertCoastCard).toContainText("Desert Coast");
    await expect(desertCoastCard).toContainText("Lima");
    await expect(desertCoastCard).toContainText("Arequipa");
    await desertCoastCard.focus();
    await Promise.all([
      page.waitForURL(/\/departures\/desert-coast$/u),
      page.keyboard.press("Enter"),
    ]);
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
  test("invalid submission focuses the shared alert on every form surface", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1024",
      "One keyboard focus pass across all form surfaces is sufficient.",
    );

    const surfaces = [
      {
        route: "/request-invitation",
        action: "Request an invitation",
      },
      {
        route: "/start-here",
        action: "Ask to join this table",
      },
      {
        route: "/departures/desert-coast",
        action: "Ask to join this table",
      },
      {
        route: "/sign-in",
        action: "Record interest in member access",
      },
    ] as const;

    for (const surface of surfaces) {
      await page.goto(surface.route);
      const form = page.locator("form");
      await expect(form, surface.route).toHaveCount(1);
      const submit = form.getByRole("button", { name: surface.action });
      await submit.focus();
      await page.keyboard.press("Enter");

      const alert = form
        .getByRole("alert")
        .filter({ hasText: "Check the form" });
      await expect(alert, surface.route).toBeFocused();
      await expect(alert).toHaveAttribute("aria-live", "assertive");
      await expect(alert).toHaveAttribute("aria-atomic", "true");
      await expect(alert).toHaveAttribute("tabindex", "-1");

      const invalidControls = form.locator('[aria-invalid="true"]');
      const invalidCount = await invalidControls.count();
      expect(invalidCount, surface.route).toBeGreaterThan(0);
      const firstInvalid = invalidControls.first();
      await expect(firstInvalid).toHaveAttribute("aria-describedby", /.+/u);

      await page.keyboard.press("Tab");
      await expect(firstInvalid, surface.route).toBeFocused();
    }
  });

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

    await page.goto("/do-it-yourself");
    await expect(page).toHaveTitle("Do It Yourself | Sawayatra");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Create your own Sawayatra journey. The Do It Yourself experience is coming later.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/do-it-yourself$/u,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex, nofollow/u,
    );
    await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute(
      "content",
      /noindex, nofollow/u,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Do It Yourself | Sawayatra",
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute(
      "content",
      "Create your own Sawayatra journey. The Do It Yourself experience is coming later.",
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      /\/do-it-yourself$/u,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      "Do It Yourself | Sawayatra",
    );
    await expect(
      page.locator('meta[name="twitter:description"]'),
    ).toHaveAttribute(
      "content",
      "Create your own Sawayatra journey. The Do It Yourself experience is coming later.",
    );

    const sitemapResponse = await page.request.get("/sitemap.xml");
    expect(await sitemapResponse.text()).not.toContain("/do-it-yourself");
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
