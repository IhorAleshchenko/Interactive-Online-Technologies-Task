export type Gender = "male" | "female";

export function createTestUser(gender: Gender = "female") {
  const id = Date.now();

  return {
    name: `QA User ${id}`,
    email: `qa.user.${id}@example.com`,
    password: "Password123!",
    gender,
  };
}