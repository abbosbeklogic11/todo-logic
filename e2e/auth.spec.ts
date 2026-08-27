import { test, expect } from "@playwright/test";

test.describe("Auth navigation", () => {
  test("login page renders the form and links to register", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /xush kelibsiz/i }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Parol")).toBeVisible();

    const registerLink = page.getByRole("link", { name: /ro'yxatdan o'ting/i });
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("register page shows password strength as you type", async ({
    page,
  }) => {
    await page.goto("/register");
    const password = page.getByLabel("Parol");
    await password.fill("a");
    await expect(page.getByText(/zaif/i)).toBeVisible();
    await password.fill("Strong1!");
    await expect(page.getByText(/kuchli/i)).toBeVisible();
  });

  test("forgot-password submits and shows confirmation", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByRole("button", { name: /havola yuborish/i }).click();
    await expect(page.getByText(/havola yuborildi/i)).toBeVisible();
  });
});
