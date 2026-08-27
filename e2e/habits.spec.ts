import { test, expect } from "@playwright/test";

test("unauthenticated /habits redirects to /login (auth guard)", async ({
  page,
}) => {
  await page.goto("/habits");
  await expect(page).toHaveURL(/\/login/);
});

test("/habits login page shows the auth form", async ({ page }) => {
  await page.goto("/habits");
  await expect(page.getByRole("heading", { name: /xush kelibsiz/i })).toBeVisible();
});
