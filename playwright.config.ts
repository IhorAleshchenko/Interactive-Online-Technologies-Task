import { defineConfig, devices } from "@playwright/test";
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  timeout: process.env.CI ? 60000 : 40000,
  expect: {
    timeout: 8000,
  },
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ["list"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
     baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'X-Access-Key': process.env.ACCESS_KEY ?? ''
    },
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
