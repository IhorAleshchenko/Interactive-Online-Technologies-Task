import { Locator, Page } from "@playwright/test";

export class ProfilePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly analyticsConsentCheckbox: Locator;
  readonly submitButton: Locator;
  readonly openPasswordModalButton: Locator;
  readonly passwordModal: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly passwordFormMessage: Locator;
  readonly passwordModalClose: Locator;
  readonly savePasswordButton: Locator;
  readonly photoInput: Locator;
  readonly removePhotoButton: Locator;

  constructor(page: Page) {
    this.nameInput = page.locator('[data-ui="profile-name"]');
    this.emailInput = page.locator('[data-ui="profile-email"]');
    this.genderMaleRadio = page.locator('[data-ui="profile-gender-male"]');
    this.genderFemaleRadio = page.locator('[data-ui="profile-gender-female"]');
    this.analyticsConsentCheckbox = page.locator('[data-ui="profile-analytics-consent"]');
    this.submitButton = page.locator('[data-ui="profile-submit"]');
    this.openPasswordModalButton = page.locator('[data-ui="profile-open-password-modal"]');
    this.passwordModal = page.locator('[data-ui="password-modal"]');
    this.newPasswordInput = page.locator('[data-ui="profile-new-password"]');
    this.confirmPasswordInput = page.locator('[data-ui="profile-confirm-password"]');
    this.passwordFormMessage = page.locator('[data-ui="password-form-message"]');
    this.passwordModalClose = page.locator('[data-ui="password-modal-close"]');
    this.savePasswordButton = page.locator('[data-ui="password-form"] [type="submit"]');
    this.photoInput = page.locator('[data-ui="profile-photo-input"]');
    this.removePhotoButton = page.locator('[data-ui="profile-remove-photo-button"]');
  }

  async changePassword(newPassword: string, confirmPassword: string): Promise<void> {
    await this.openPasswordModalButton.click();
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.savePasswordButton.click();
  }
}
