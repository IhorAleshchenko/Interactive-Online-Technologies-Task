import { defineConfig, devices } from "@playwright/test";
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  timeout: process.env.CI ? 60000 : 30000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'X-Access-Key': process.env.ACCESS_KEY ?? ''
    },
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
