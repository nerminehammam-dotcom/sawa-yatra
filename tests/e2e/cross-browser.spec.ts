import { expect, test } from "@playwright/test";

const publicDateNotice = "exact dates announced when the route is secured";

const crossBrowserRoutes = [
  "/",
  "/caravans",
  "/caravans/the-andean-caravan",
  "/joining-points",
  "/how-it-works",
  "/travel-self",
  "/departures",
  "/departures/the-andean-caravan",
  "/departures/the-mirror",
  "/membership",
  "/about",
  "/contact",
  "/sign-in",
  "/request-invitation",
  "/privacy",
  "/terms",
  "/accessibility",
] as const;

for (const route of crossBrowserRoutes) {
  test(`${route} renders in the secondary browser engine`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.ok()).toBe(true);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);

    const renderingContract = await page.evaluate(() => ({
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      cssVariables: getComputedStyle(document.documentElement)
        .getPropertyValue("--cream")
        .trim(),
      grid: CSS.supports("display", "grid"),
    }));

    expect(renderingContract.scrollWidth).toBeLessThanOrEqual(
      renderingContract.viewport,
    );
    expect(renderingContract.cssVariables).toBe("#e7e1d6");
    expect(renderingContract.grid).toBe(true);

    if (route.startsWith("/departures/")) {
      await expect(
        page.getByText(publicDateNotice, { exact: false }).first(),
      ).toBeVisible();
    }
  });
}

test("the tablet drawer and form controls remain operable", async ({ page }) => {
  await page.goto("/");

  if ((await page.viewportSize())?.width === 768) {
    const menu = page.getByRole("button", { name: "Menu" });
    await menu.click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
  } else {
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  }

  await page.goto("/request-invitation");
  await expect(page.getByLabel(/^Email/u)).toBeEditable();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
});
