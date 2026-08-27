import { test, expect } from "@playwright/test";

test("unauthenticated /goals redirects to /login (auth guard)", async ({
  page,
}) => {
  await page.goto("/goals");
  await expect(page).toHaveURL(/\/login/);
});

test("/goals login page shows the auth form", async ({ page }) => {
  await page.goto("/goals");
  await expect(page.getByRole("heading", { name: /xush kelibsiz/i })).toBeVisible();
});
