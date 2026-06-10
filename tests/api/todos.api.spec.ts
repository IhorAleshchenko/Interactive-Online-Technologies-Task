import { test, expect } from "@playwright/test";

test.describe("Todos API", () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: {
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      },
    });
    const body = await res.json();
    authToken = body.token;
  });

  test("user can edit a todo", async ({ request }) => {
    // Arrange
    const createRes = await request.post("/api/todos", {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { title: "Original title" },
    });
    expect(createRes.status()).toBe(201);
    const { todo } = await createRes.json();
    // Act
    const editRes = await request.patch(`/api/todos/${todo._id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { title: "Updated title" },
    });
    // Assert
    expect(editRes.status()).toBe(200);
    const { todo: updated } = await editRes.json();
    expect(updated.title).toBe("Updated title");
  });

  test("user can create a todo with a tag", async ({ request }) => {
    // Arrange — create a tag
    const createTagRes = await request.post("/api/tags", {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { name: `Tag${Date.now()}`, color: "#F97316" },
    });
    expect(createTagRes.status()).toBe(201);
    const { tag } = await createTagRes.json();
    // Act — create todo with the tag
    const createTodoRes = await request.post("/api/todos", {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { title: "Todo with tag", tagIds: [tag._id] },
    });
    // Assert
    expect(createTodoRes.status()).toBe(201);
    const { todo } = await createTodoRes.json();
    expect(todo.tagIds).toContain(tag._id);
  });
});
