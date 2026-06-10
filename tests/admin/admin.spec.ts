import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { AdminPage } from "../../pages/admin.page";

test.describe("Admin Panel", () => {
  let adminPage: AdminPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await page.goto("/index.html");
    await loginPage.fillLoginForm({
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
    });
    await loginPage.loginButton.click();
    await page.waitForURL(/admin\.html/);
    await context.storageState({ path: ".auth/admin.json" });
    await context.close();
  });

  test.use({ storageState: ".auth/admin.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin.html");
    adminPage = new AdminPage(page);
  });

  test("admin can see the users panel after login", async () => {
    // Assert
    await expect(adminPage.adminPanel).toBeVisible();
  });

  test("admin can search user by email", async () => {
    // Act
    await adminPage.userSearch.fill(process.env.TEST_USER_EMAIL!);
    // Assert
    await expect(adminPage.usersContainer.getByText(process.env.TEST_USER_EMAIL!)).toBeVisible();
  });

  test("admin can see user todos and events", async () => {
    // Arrange
    await adminPage.userSearch.fill(process.env.TEST_USER_EMAIL!);
    // Assert
    await expect(adminPage.usersContainer.getByText("Заметки (todos)").first()).toBeVisible();
    await expect(adminPage.usersContainer.getByText("События").first()).toBeVisible();
  });

  test("admin can logout", async ({ page }) => {
    // Act
    await adminPage.logoutButton.click();
    // Assert
    await expect(page).not.toHaveURL(/admin\.html/);
  });
});
