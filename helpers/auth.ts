import { APIRequestContext, Page } from "@playwright/test";
import { createTestUser } from "./testData";

type TestUser = ReturnType<typeof createTestUser>;

export async function registerUser(request: APIRequestContext, user: TestUser): Promise<void> {
  const response = await request.post("/api/auth/register", {
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
      gender: user.gender === "male" ? 0 : 1,
    },
  });
  if (!response.ok()) {
    throw new Error(`Registration failed: ${response.status()} ${await response.text()}`);
  }
}

export async function loginViaUI(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/index.html");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль" }).fill(password);
  await page.getByRole("button", { name: "Войти" }).click();
  await page.waitForURL(/dashboard\.html/);
}
