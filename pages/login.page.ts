import { Locator, Page } from "@playwright/test";

type LoginUser = {
  email: string;
  password: string;
};

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  

  constructor(page: Page) {
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Пароль" });
    this.loginButton = page.getByRole("button", { name: "Войти" });
    this.registerLink = page.getByRole("link", { name: /зарегистрир/i });
  }

  async fillLoginForm(user: LoginUser): Promise<void> {
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
  }
}
