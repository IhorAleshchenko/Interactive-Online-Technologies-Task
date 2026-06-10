import { Locator, Page } from "@playwright/test";

export class AdminPage {
  readonly adminPanel: Locator;
  readonly logoutButton: Locator;
  readonly userSearch: Locator;
  readonly usersContainer: Locator;

  constructor(page: Page) {
    this.adminPanel = page.locator('[data-ui="admin-panel"]');
    this.logoutButton = page.locator('[data-ui="admin-logout"]');
    this.userSearch = page.locator('[data-ui="admin-user-search"]');
    this.usersContainer = page.locator('[data-ui="admin-users"]');
  }
}
