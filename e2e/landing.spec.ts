import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero with a primary CTA and navigates to register", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toBeVisible();
    const cta = page.getByRole("link", { name: /boshlash/i }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("switches theme via the toggle", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const before = await html.getAttribute("data-theme");
    await page.getByRole("button", { name: /rejim/i }).click();
    const after = await html.getAttribute("data-theme");
    expect(after).not.toEqual(before);
  });

  test("is responsive without horizontal overflow at 375px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(overflow).toBe(true);
  });
});
