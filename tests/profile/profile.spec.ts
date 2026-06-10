import { test, expect } from "@playwright/test";
import { ProfilePage } from "../../pages/profile.page";

test.use({ storageState: ".auth/user.json" });

test.describe("Profile", () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/profile.html");
    profilePage = new ProfilePage(page);
  });

  test("user can update their name", async ({ page }) => {
    // Arrange
    const newName = `QA User ${Date.now()}`;
    // Act
    await profilePage.nameInput.fill(newName);
    await profilePage.submitButton.click();
    await page.reload();
    // Assert
    await expect(profilePage.nameInput).toHaveValue(newName);
  });

    test("user can change password successfully", async () => {
    // Arrange
    const newPassword = "NewPassword123!";
    const originalPassword = process.env.TEST_USER_PASSWORD!;
    // Act
    await profilePage.changePassword(newPassword, newPassword);
    // Assert
    await expect(profilePage.passwordModal).not.toBeVisible();
    // Cleanup — restore original password
    await profilePage.changePassword(originalPassword, originalPassword);
    await expect(profilePage.passwordModal).not.toBeVisible();
  });

  test("email field is readonly", async () => {
    // Assert
    await expect(profilePage.emailInput).toHaveAttribute("readonly");
    await expect(profilePage.emailInput).toHaveValue(process.env.TEST_USER_EMAIL!);
  });

  test("user can open and close the password modal", async () => {
    // Act
    await profilePage.openPasswordModalButton.click();
    // Assert
    await expect(profilePage.passwordModal).toBeVisible();
    // Act
    await profilePage.passwordModalClose.click();
    // Assert
    await expect(profilePage.passwordModal).not.toBeVisible();
  });

  test("user cannot change password with mismatched confirmation", async () => {
    // Act
    await profilePage.changePassword("NewPassword123", "DifferentPassword123");
    // Assert
    await expect(profilePage.passwordFormMessage).toBeVisible();
  });

  test("user can upload a profile photo", async () => {
    // Act
    await profilePage.photoInput.setInputFiles("test-data/photo.png");
    await profilePage.submitButton.click();
    // Assert
    await expect(profilePage.removePhotoButton).toBeVisible();
  });

  test("user can toggle analytics consent", async ({page}) => {
    // Arrange
    const initialState = await profilePage.analyticsConsentCheckbox.isChecked();
    // Act
    await profilePage.analyticsConsentCheckbox.click();
    await profilePage.submitButton.click();
    await page.reload();
    // Assert
    const newState = await profilePage.analyticsConsentCheckbox.isChecked();
    expect(newState).toBe(!initialState);
  });
});
