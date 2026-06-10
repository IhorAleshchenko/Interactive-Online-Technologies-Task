import { test, expect } from "@playwright/test"
import path from "path";
import { RegisterPage } from "../../pages/register.page";
import { createTestUser } from "../../helpers/testData";


test.describe("Registration Tests", () => {
  let registerPage: RegisterPage;
  test.beforeEach(async ({ page }) => {
    await page.goto("/register.html");
    registerPage = new RegisterPage(page);
  });


 test("male user can register with profile photo and valid data", async ({ page }) => {
  // Arrange
  const user = createTestUser("male");
  const avatarPath = path.join(
    process.cwd(),
    "test-data",
    "photo.png"
  );
  // Act
  await registerPage.fillRegistrationForm(user);
  await registerPage.profilePhotoInput.setInputFiles(avatarPath);
  await registerPage.analyticsConsentCheckbox.click();
  await registerPage.registerButton.click();
  // Assert
  await expect(page).toHaveURL(/dashboard\.html/);
});

test("female user can register with valid data and without profile photo", async ({ page }) => {
  // Arrange
  const user = createTestUser("female");
  // Act
  await registerPage.fillRegistrationForm(user);
  await registerPage.analyticsConsentCheckbox.click();
  await registerPage.registerButton.click();
  // Assert
  await expect(page).toHaveURL(/dashboard\.html/);
});

 test("user cannot register with empty required fields", async () => {
    // Act
    await registerPage.registerButton.click();
    // Assert
    const isValueMissing = await registerPage.nameInput.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing
    );
    expect(isValueMissing).toBeTruthy();
  });

test("user cannot register with invalid email", async ({ page }) => {
  // Arrange
  await registerPage.nameInput.fill("Test User");
  await registerPage.emailInput.fill("test.userexample.com");
  // Act
  await registerPage.registerButton.click();

  // Assert
  const hasTypeMismatch = await registerPage.emailInput.evaluate(
    (input: HTMLInputElement) => input.validity.typeMismatch
  );

  expect(hasTypeMismatch).toBeTruthy();
});

 test("user cannot register with empty password field", async () => {
    // Arrange
    await registerPage.nameInput.fill("Test User");
    await registerPage.emailInput.fill("test.user@example.com");
    // Act
    await registerPage.registerButton.click();
    // Assert
    const isValueMissing = await registerPage.passwordInput.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing
    );
    expect(isValueMissing).toBeTruthy();
  });

test("user cannot register without analytics consent", async ({ page }) => {
  // Arrange
  await registerPage.nameInput.fill("Test User");
  await registerPage.emailInput.fill("test.user@example.com");
  await registerPage.passwordInput.fill("123");
  // Act
  await registerPage.registerButton.click();
  // Assert
   const isValueMissing = await registerPage.analyticsConsentCheckbox.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing
    );
    expect(isValueMissing).toBeTruthy();
});

test("user can navigate to login page from registration page", async ({ page }) => {
  //Act
  await registerPage.loginLink.click();
  //Assert
  await expect(page).toHaveURL(/index\.html/);
});
});
