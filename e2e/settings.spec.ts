import { test, expect } from "@playwright/test";

test.describe("settings page", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/login/);
  });
});
