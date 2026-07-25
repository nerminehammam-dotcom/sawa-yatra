import { defineConfig, devices } from "@playwright/test";

const localBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 4,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  use: {
    baseURL: localBaseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --hostname localhost",
        url: localBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "mobile-375",
      testMatch: [/release-one\.spec\.ts/, /contrast\.spec\.ts/],
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "tablet-768",
      testMatch: /release-one\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "desktop-1024",
      testMatch: /release-one\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 1024, height: 900 },
      },
    },
    {
      name: "wide-1440",
      testMatch: [/release-one\.spec\.ts/, /contrast\.spec\.ts/],
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "firefox-1440",
      testMatch: /cross-browser\.spec\.ts/,
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "webkit-768",
      testMatch: /cross-browser\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 768, height: 1024 },
      },
    },
  ],
});
