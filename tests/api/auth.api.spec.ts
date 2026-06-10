import { test, expect } from "@playwright/test";
import { createTestUser } from "../../helpers/testData";

const EMAIL = process.env.TEST_USER_EMAIL!;
const PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe("Auth API", () => {
  test.describe("Registration", () => {
    test("duplicate email returns 409 with error message", async ({ request }) => {
      const user = createTestUser("male");
      const payload = {
        name: user.name,
        email: user.email,
        password: user.password,
        gender: user.gender === "male" ? 0 : 1,
        internalAnalyticsConsent: true,
      };

      const first = await request.post("/api/auth/register", { data: payload });
      expect(first.ok()).toBeTruthy();

      const duplicate = await request.post("/api/auth/register", { data: payload });
      expect(duplicate.status()).toBe(409);

      const body = await duplicate.json();
      expect(body.message).toBe("User already exists");
    });
  });

  test.describe("Login", () => {
    test("valid credentials return 200", async ({ request }) => {
      const response = await request.post("/api/auth/login", {
        data: { email: EMAIL, password: PASSWORD },
      });

      expect(response.status()).toBe(200);
    });

    test("wrong password returns 400 with error message", async ({ request }) => {
      const response = await request.post("/api/auth/login", {
        data: { email: EMAIL, password: "wrongpassword" },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.message).toBe("Invalid credentials");
    });

    test("non-existent email returns 400", async ({ request }) => {
      const response = await request.post("/api/auth/login", {
        data: { email: "nobody@example.com", password: "anypassword" },
      });

      expect(response.status()).toBe(400);
    });
  });
});
