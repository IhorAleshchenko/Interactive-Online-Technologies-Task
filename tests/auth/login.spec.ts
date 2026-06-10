import { test, expect } from "@playwright/test"
import { LoginPage } from "../../pages/login.page";

const EMAIL = process.env.TEST_USER_EMAIL!;
const PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html");
    loginPage = new LoginPage(page);
  });

  test("user can login with valid credentials", async ({ page }) => {
    // Act
    await loginPage.fillLoginForm({ email: EMAIL, password: PASSWORD });
    await loginPage.loginButton.click();
    // Assert
    await expect(page).toHaveURL(/dashboard\.html/);
  });

  test("user cannot login with wrong password", async ({ page }) => {
    // Act
    await loginPage.fillLoginForm({ email: EMAIL, password: "wrongpassword" });
    await loginPage.loginButton.click();
    // Assert
    await expect(page).not.toHaveURL(/dashboard\.html/);
  });

  test("user cannot login with empty email field", async () => {
    // Act
    await loginPage.loginButton.click();
    // Assert
    const isValueMissing = await loginPage.emailInput.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing
    );
    expect(isValueMissing).toBeTruthy();
  });

  test("user cannot login with invalid email format", async () => {
    // Arrange
    await loginPage.emailInput.fill("notanemail");
    // Act
    await loginPage.loginButton.click();
    // Assert
    const hasTypeMismatch = await loginPage.emailInput.evaluate(
      (input: HTMLInputElement) => input.validity.typeMismatch
    );
    expect(hasTypeMismatch).toBeTruthy();
  });

  test("user cannot login with empty password field", async () => {
    // Arrange
    await loginPage.emailInput.fill(EMAIL);
    // Act
    await loginPage.loginButton.click();
    // Assert
    const isValueMissing = await loginPage.passwordInput.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing
    );
    expect(isValueMissing).toBeTruthy();
  });

  test("user can navigate to registration page from login page", async ({ page }) => {
    // Act
    await loginPage.registerLink.click();
    // Assert
    await expect(page).toHaveURL(/register\.html/);
  });

});
