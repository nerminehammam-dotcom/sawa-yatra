import { expect, test, type Locator } from "@playwright/test";

type Rgb = readonly [number, number, number];

const palette = {
  paper: "rgb(231, 225, 214)",
  ink: "rgb(39, 35, 31)",
  signal: "rgb(240, 90, 42)",
  clay: "rgb(169, 111, 71)",
  olive: "rgb(152, 144, 79)",
} as const;

function rgbChannels(colour: string): Rgb {
  const channels = colour.match(/[\d.]+/gu)?.slice(0, 3).map(Number);

  if (!channels || channels.length !== 3) {
    throw new Error(`Expected an RGB colour, received ${colour}`);
  }

  return channels as unknown as Rgb;
}

function luminance(colour: string): number {
  const channels = rgbChannels(colour).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  const [red = 0, green = 0, blue = 0] = channels;

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

async function computedColours(locator: Locator) {
  return locator.evaluate((element) => {
    const foreground = getComputedStyle(element);
    let backgroundElement: Element | null = element;
    let background = "rgb(255, 255, 255)";

    while (backgroundElement) {
      const candidate = getComputedStyle(backgroundElement).backgroundColor;
      const alpha = candidate.match(/[\d.]+/gu)?.at(3);

      if (candidate !== "transparent" && (alpha === undefined || Number(alpha) > 0)) {
        background = candidate;
        break;
      }

      backgroundElement = backgroundElement.parentElement;
    }

    return {
      color: foreground.color,
      background,
      borderTopColor: foreground.borderTopColor,
      borderBottomColor: foreground.borderBottomColor,
      outlineColor: foreground.outlineColor,
      outlineStyle: foreground.outlineStyle,
      outlineWidth: foreground.outlineWidth,
    };
  });
}

async function surroundingBackground(locator: Locator): Promise<string> {
  return locator.evaluate((element) => {
    let backgroundElement = element.parentElement;

    while (backgroundElement) {
      const candidate = getComputedStyle(backgroundElement).backgroundColor;
      const alpha = candidate.match(/[\d.]+/gu)?.at(3);

      if (candidate !== "transparent" && (alpha === undefined || Number(alpha) > 0)) {
        return candidate;
      }

      backgroundElement = backgroundElement.parentElement;
    }

    return "rgb(255, 255, 255)";
  });
}

function expectContrast(first: string, second: string, minimum: number) {
  expect(contrastRatio(first, second)).toBeGreaterThanOrEqual(minimum);
}

test.describe("approved ordinary-site contrast corrections", () => {
  test("journey enquiry text and membership quotation pass on their locked grounds", async ({
    page,
  }) => {
    await page.goto("/departures/desert-coast");

    const eyebrow = page.getByText("Enquire", { exact: true });
    const description = page.getByText(
      "This Release 1 form records interest only. It does not reserve a place or confirm availability.",
      { exact: true },
    );

    for (const element of [eyebrow, description]) {
      const colours = await computedColours(element);
      expect(colours.color).toBe(palette.ink);
      expectContrast(colours.color, colours.background, 4.5);
    }

    await page.goto("/membership");

    const quotation = page.locator("blockquote");
    const quotationColours = await computedColours(quotation);
    expect(quotationColours.color).toBe(palette.ink);
    expect(quotationColours.background).toBe(palette.olive);
    expectContrast(quotationColours.color, quotationColours.background, 3);
  });

  test("form actions, invalid controls and the focused alert keep visible boundaries", async ({
    page,
  }) => {
    await page.goto("/request-invitation");

    const submit = page.getByRole("button", { name: "Request an invitation" });
    const defaultSubmitColours = await computedColours(submit);
    const submitSurroundingBackground = await surroundingBackground(submit);
    expect(defaultSubmitColours.borderTopColor).toBe(palette.ink);
    expectContrast(
      defaultSubmitColours.borderTopColor,
      submitSurroundingBackground,
      3,
    );
    expectContrast(defaultSubmitColours.borderTopColor, palette.olive, 3);

    await submit.hover();
    await page.waitForTimeout(200);
    const hoverColours = await computedColours(submit);
    expect(hoverColours.color).toBe(palette.paper);
    expect(hoverColours.background).toBe(palette.ink);
    expectContrast(hoverColours.color, hoverColours.background, 4.5);

    await submit.click();

    const alert = page.locator('[role="alert"][tabindex="-1"]');
    await expect(alert).toBeFocused();
    await expect(alert).toHaveAttribute("tabindex", "-1");
    const alertColours = await computedColours(alert);
    expect(alertColours.outlineColor).toBe(palette.ink);
    expect(alertColours.outlineStyle).toBe("solid");
    expect(parseFloat(alertColours.outlineWidth)).toBeGreaterThanOrEqual(3);
    expectContrast(alertColours.outlineColor, alertColours.background, 3);

    const name = page.getByLabel(/^Name/u);
    const nameColours = await computedColours(name);
    expect(nameColours.borderTopColor).toBe(palette.ink);
    expectContrast(nameColours.borderTopColor, nameColours.background, 3);

    const consent = page.getByRole("checkbox");
    const consentColours = await computedColours(consent);
    expect(consentColours.outlineColor).toBe(palette.ink);
    expectContrast(consentColours.outlineColor, consentColours.background, 3);

    await page.keyboard.press("Tab");
    await expect(name).toBeFocused();
  });

  test("shared button boundaries and disabled styling remain stable", async ({
    page,
  }) => {
    await page.goto("/membership");

    const primary = page
      .getByRole("link", { name: "Request an invitation", exact: true })
      .first();
    const primaryColours = await computedColours(primary);
    const primarySurroundingBackground = await surroundingBackground(primary);
    expect(primaryColours.borderTopColor).toBe(palette.ink);
    expectContrast(primaryColours.borderTopColor, primarySurroundingBackground, 3);
    expectContrast(primaryColours.borderTopColor, palette.olive, 3);

    const deepPrimary = page
      .getByRole("link", { name: "Request an invitation", exact: true })
      .last();
    const deepColours = await computedColours(deepPrimary);
    expect(deepColours.borderTopColor).toBe(palette.ink);
    expectContrast(
      deepColours.borderTopColor,
      await surroundingBackground(deepPrimary),
      3,
    );

    await page.goto("/travel-self");
    await page.getByRole("button", { name: "Begin" }).click();
    const disabledNext = page.getByRole("button", {
      name: "Next",
      exact: true,
    });
    await expect(disabledNext).toBeDisabled();
    const disabledColours = await computedColours(disabledNext);
    expect(disabledColours.color).toBe(palette.ink);
    expect(disabledColours.background).toBe(palette.olive);
    expect(disabledColours.borderTopColor).toBe(palette.olive);
  });

  test("navigation state indicators and representative focus rings pass", async ({
    page,
  }, testInfo) => {
    await page.goto("/membership");

    if (testInfo.project.name === "wide-1440") {
      const utility = page.getByRole("link", {
        name: "Become a Member",
        exact: true,
      });
      const utilityColours = await computedColours(utility);
      expect(utilityColours.borderBottomColor).toBe(palette.clay);
      expectContrast(
        utilityColours.borderBottomColor,
        utilityColours.background,
        3,
      );

      const primaryNavigation = page
        .getByRole("list", { name: "Primary navigation links" })
        .getByRole("link", { name: "How Sawayatra works", exact: true });
      await primaryNavigation.hover();
      const underline = await primaryNavigation.evaluate(
        (element) => getComputedStyle(element, "::after").backgroundColor,
      );
      expect(underline).toBe(palette.clay);
      expectContrast(underline, palette.paper, 3);

      await primaryNavigation.focus();
      const navigationFocus = await computedColours(primaryNavigation);
      expect(navigationFocus.outlineColor).toBe(palette.ink);
      expectContrast(navigationFocus.outlineColor, navigationFocus.background, 3);
    } else {
      await page.getByRole("button", { name: "Menu" }).click();
      const firstMobileLink = page
        .locator('a[href="/how-it-works"]:visible')
        .first();
      await expect(firstMobileLink).toBeFocused();
      const mobileFocus = await computedColours(firstMobileLink);
      expect(mobileFocus.outlineColor).toBe(mobileFocus.color);
      expectContrast(mobileFocus.outlineColor, mobileFocus.background, 3);
      await page.keyboard.press("Escape");
    }

    const privacy = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Privacy", exact: true });
    await privacy.focus();
    const deepFocus = await computedColours(privacy);
    expect(deepFocus.outlineColor).toBe(palette.paper);
    expectContrast(
      deepFocus.outlineColor,
      await surroundingBackground(privacy),
      3,
    );
  });

  test("Travel Self options and the Departures caravan path have visible focus", async ({
    page,
  }) => {
    await page.goto("/travel-self");
    await page.getByRole("button", { name: "Begin" }).click();

    const firstRadio = page.getByRole("radio").first();
    const firstOption = firstRadio.locator("..");
    await firstRadio.focus();
    const defaultOption = await computedColours(firstOption);
    expect(defaultOption.outlineColor).toBe(palette.ink);
    expectContrast(defaultOption.outlineColor, defaultOption.background, 3);

    await firstOption.click();
    await firstRadio.focus();
    const selectedOption = await computedColours(firstOption);
    expect(selectedOption.outlineColor).toBe(palette.ink);
    expect(selectedOption.background).toBe("rgb(238, 182, 196)");
    expectContrast(selectedOption.outlineColor, selectedOption.background, 3);

    await page.goto("/departures");
    const caravanPath = page.locator('a[href="/departures/the-andean-caravan"]');
    await caravanPath.focus();
    const pathFocus = await computedColours(caravanPath);
    expect(pathFocus.outlineColor).toBe(palette.ink);
    expectContrast(
      pathFocus.outlineColor,
      await surroundingBackground(caravanPath),
      3,
    );
  });

  test("both locked maps retain their approved rendered colours", async ({ page }) => {
    await page.goto("/caravans");
    const isolatedProgress = page.locator('[class*="routeProgress"]').first();
    await expect(isolatedProgress).toHaveCount(1);
    expect(await isolatedProgress.evaluate((element) => getComputedStyle(element).stroke)).toBe(
      palette.signal,
    );

    await page.goto("/departures/the-andean-caravan");
    const originalRoute = page.locator('polyline[class$="__route"]').first();
    await expect(originalRoute).toHaveCount(1);
    expect(await originalRoute.evaluate((element) => getComputedStyle(element).stroke)).toBe(
      palette.signal,
    );
  });
});
