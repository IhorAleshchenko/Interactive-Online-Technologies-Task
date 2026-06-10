import { test, expect } from "@playwright/test"
import { DashboardPage } from "../../pages/dashboard.page";

test.use({ storageState: ".auth/user.json" });

test.describe("Todos", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard.html");
    dashboardPage = new DashboardPage(page);
    await dashboardPage.filterAll.click();
  });

  test("user can create a todo", async ({ page }) => {
    // Arrange
    const title = `Todo ${Date.now()}`;
    // Act
    await dashboardPage.createTodo(title);
    // Assert
    await expect(dashboardPage.getTodoItem(title)).toBeVisible();
  });

   test("user can delete a todo", async ({ page }) => {
    // Arrange
    const title = `Todo ${Date.now()}`;
    await dashboardPage.createTodo(title);
    // Act
    await dashboardPage.deleteTodo(title);
    // Assert
    await expect(dashboardPage.getTodoItem(title)).not.toBeVisible();
  });

  test("user can complete a todo", async ({ page }) => {
    // Arrange
    const title = `Todo ${Date.now()}`;
    await dashboardPage.createTodo(title);
    // Act
    await dashboardPage.completeTodo(title);
    await dashboardPage.filterCompleted.click();
    // Assert
    await expect(dashboardPage.getTodoItem(title)).toBeVisible();
  });

  test("completed todo is not visible in active filter", async () => {
    // Arrange
    const title = `Todo ${Date.now()}`;
    await dashboardPage.createTodo(title);
    // Act
    await dashboardPage.completeTodo(title);
    await dashboardPage.filterActive.click();
    // Assert
    await expect(dashboardPage.getTodoItem(title)).not.toBeVisible();
  });

  // Flaky due to server rate limiting — covered in tests/api/todos.api.spec.ts
  // test("user can edit a todo", ...)

  // Add button not firing when sidebar is open — covered in tests/api/todos.api.spec.ts
  // test("user can create a todo with a tag", ...)

  test("user can delete a tag", async ({ page }) => {
    // Arrange
    const tagName = `ToDelete${Date.now()}`;
    await dashboardPage.toggleTagsSidebarButton.click();
    await dashboardPage.tagNameInput.fill(tagName);
    await page.getByRole("radio", { name: "Цвет #EF4444" }).click();
    await dashboardPage.createTagButton.click();
    // Act
    await page.getByRole("button", { name: `Удалить тег ${tagName}` }).click();
    // Assert
    await expect(dashboardPage.tagsList.getByText(tagName)).not.toBeVisible();
  });
});
