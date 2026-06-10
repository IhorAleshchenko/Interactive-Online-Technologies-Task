import { test, expect } from "@playwright/test";

const BASIC_AUTH = Buffer.from(
  `${process.env.ANALYTICS_USER}:${process.env.ANALYTICS_PASSWORD}`
).toString("base64");

test.describe("Analytics API", () => {
  test("GET /api/analytics/events returns 200 with an array", async ({ request }) => {
    // Act
    const response = await request.get("/api/analytics/events", {
      headers: { Authorization: `Basic ${BASIC_AUTH}` },
    });
    // Assert
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("events contain required fields type and timestamp", async ({ request }) => {
    // Act
    const response = await request.get("/api/analytics/events", {
      headers: { Authorization: `Basic ${BASIC_AUTH}` },
    });
    const events = await response.json();
    // Assert
    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(event).toHaveProperty("type");
      expect(event).toHaveProperty("timestamp");
      expect(event).toHaveProperty("status");
      expect(event).toHaveProperty("applicationId");

    }
  });

  test("login event is recorded with correct email", async ({ request }) => {
    // Act
    const response = await request.get("/api/analytics/events", {
      headers: { Authorization: `Basic ${BASIC_AUTH}` },
    });
    const events = await response.json();
    // Assert
    const loginEvent = events.find(
      (e: { type: string; status: string; email: string }) =>
        e.type === "login" && e.status === "success" && e.email === process.env.TEST_USER_EMAIL
    );
    expect(loginEvent).toBeDefined();
    expect(loginEvent.email).toBe(process.env.TEST_USER_EMAIL);
  });

  test("todoCreate events are recorded", async ({ request }) => {
    // Act
    const response = await request.get("/api/analytics/events", {
      headers: { Authorization: `Basic ${BASIC_AUTH}` },
    });
    const events = await response.json();
    // Assert
    const todoCreateEvents = events.filter(
      (e: { type: string }) => e.type === "todoCreate"
    );
    expect(todoCreateEvents.length).toBeGreaterThan(0);
  });
});
