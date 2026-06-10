import { chromium } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function globalSetup() {
  fs.mkdirSync(".auth", { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      "X-Access-Key": process.env.ACCESS_KEY ?? "",
    },
  });
  const page = await context.newPage();

  await page.goto("/index.html");
  await page.getByRole("textbox", { name: "Email" }).fill(process.env.TEST_USER_EMAIL!);
  await page.getByRole("textbox", { name: "Пароль" }).fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole("button", { name: "Войти" }).click();
  await page.waitForURL(/dashboard\.html/);

  await context.storageState({ path: ".auth/user.json" });
  await browser.close();
}

export default globalSetup;
