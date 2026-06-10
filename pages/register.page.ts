import { Locator, Page } from "@playwright/test";

type TestUser = {
  name: string;
  email: string;
  password: string;
  gender: "male" | "female";
};

export class RegisterPage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly genderSelect: Locator;
  readonly passwordInput: Locator;
  readonly profilePhotoButton: Locator;
  readonly analyticsConsentCheckbox: Locator;
  readonly registerButton: Locator;
  readonly profilePhotoInput: Locator;
  readonly loginLink: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByRole("textbox", { name: "Имя" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.genderSelect = page.getByLabel("Пол");
    this.passwordInput = page.getByRole("textbox", { name: "Пароль" });
    this.profilePhotoButton = page.getByRole("button", {name: "Фотография профиля",});
    this.analyticsConsentCheckbox = page.getByRole("checkbox");
    this.registerButton = page.getByRole("button", { name: "Зарегистрироваться",});
    this.profilePhotoInput = page.locator('[data-ui="register-photo"]');
    this.loginLink = page.getByRole("link", {name: "Уже зарегистрированы? Войти",});
  }

  async fillRegistrationForm(user: TestUser): Promise<void> {
  await this.nameInput.fill(user.name);
  await this.emailInput.fill(user.email);
  await this.genderSelect.selectOption(user.gender === "male" ? "0" : "1");
  await this.passwordInput.fill(user.password);
}
}