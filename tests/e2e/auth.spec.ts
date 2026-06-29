// tests/e2e/auth.spec.ts
// Tests E2E pour l'authentification avec Playwright

import { test, expect } from "@playwright/test";

test.describe("Authentification", () => {
  test("La page d'accueil se charge correctement", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/VideoNova/);
    await expect(page.getByRole("link", { name: /connexion/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /inscription/i })).toBeVisible();
  });

  test("Navigation vers la page de connexion", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /connexion/i }).first().click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByPlaceholder(/e-mail/i)).toBeVisible();
    await expect(page.getByPlaceholder(/mot de passe/i)).toBeVisible();
  });

  test("Affiche une erreur avec des identifiants incorrects", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill('input[type="email"]', "inexistant@test.fr");
    await page.fill('input[type="password"]', "MauvaisMotDePasse");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page.getByText(/identifiants incorrects|erreur/i)).toBeVisible({ timeout: 5000 });
  });

  test("Navigation vers la page d'inscription", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("link", { name: /créer un compte/i }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test("Redirection vers le dashboard si non connecté", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe("Page d'accueil", () => {
  test("Affiche le slogan principal", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/créez des vidéos|montage vidéo/i)).toBeVisible();
  });

  test("Liens vers les fonctionnalités clés", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /créer une vidéo/i })).toBeVisible();
  });
});
