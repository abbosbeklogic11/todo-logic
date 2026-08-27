import { test, expect } from "@playwright/test";

test("unauthenticated /tasks redirects to /login (auth guard)", async ({
  page,
}) => {
  await page.goto("/tasks");
  await expect(page).toHaveURL(/\/login/);
});

test("/tasks login page shows the auth form", async ({ page }) => {
  await page.goto("/tasks");
  await expect(page.getByRole("heading", { name: /xush kelibsiz/i })).toBeVisible();
});
