import { Locator, Page } from "@playwright/test";

export class DashboardPage {
  readonly todoInput: Locator;
  readonly addTodoButton: Locator;
  readonly logoutButton: Locator;
  readonly emptyState: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;
  readonly deleteModal: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;
  readonly toggleTagsSidebarButton: Locator;
  readonly tagNameInput: Locator;
  readonly createTagButton: Locator;
  readonly tagsList: Locator;

  constructor(private readonly page: Page) {
    this.todoInput = page.locator('[data-ui="todo-input"]');
    this.addTodoButton = page.locator('[data-ui="add-todo-button"]');
    this.logoutButton = page.locator('[data-ui="logout-button"]');
    this.emptyState = page.locator('[data-ui="empty-state"]');
    this.filterAll = page.locator('[data-filter="all"]');
    this.filterActive = page.locator('[data-filter="active"]');
    this.filterCompleted = page.locator('[data-filter="completed"]');
    this.deleteModal = page.locator('[data-ui="delete-todo-modal"]');
    this.confirmDeleteButton = page.locator('[data-ui="confirm-delete-todo-button"]');
    this.cancelDeleteButton = page.locator('[data-ui="cancel-delete-todo-button"]');
    this.toggleTagsSidebarButton = page.getByRole("button", { name: "Открыть/закрыть сайдбар тегов" });
    this.tagNameInput = page.getByRole("textbox", { name: "Название тега и поиск по тегам" });
    this.createTagButton = page.getByRole("button", { name: "Создать тег" });
    this.tagsList = page.locator('[data-ui="tags-list"]');
  }

  getTodoItem(title: string): Locator {
    return this.page.locator('[data-ui="todos-list"] li').filter({ hasText: title });
  }

  async createTodo(title: string): Promise<void> {
    await this.todoInput.fill(title);
    await this.addTodoButton.click();
  }

  async completeTodo(title: string): Promise<void> {
    await this.getTodoItem(title).getByRole("checkbox").click();
  }

  async deleteTodo(title: string): Promise<void> {
    await this.getTodoItem(title).getByRole("button", { name: /удалить|delete/i }).click();
    await this.confirmDeleteButton.click();
  }

  async editTodo(originalTitle: string, newTitle: string): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.getTodoItem(originalTitle).getByText(originalTitle).dblclick();
    const editInput = this.page.getByRole("textbox", { name: "Редактирование заметки и тегов" });
    await editInput.fill(newTitle);
    await editInput.press("Enter");
  }
}
