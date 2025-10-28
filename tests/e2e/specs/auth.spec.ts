import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login modal when clicking login button', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await loginButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    await expect(page.getByText(/bienvenido de nuevo/i)).toBeVisible();
  });

  test('should be able to register new customer', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await loginButton.click();

    // Switch to register tab
    const registerTab = page.getByRole('button', { name: /registrarse/i });
    await registerTab.click();

    // Fill registration form
    await page.getByLabel(/nombre/i).fill('Test User');
    await page.getByLabel(/email/i).fill(`test-${Date.now()}@example.com`);
    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill('Test123456!');

    // Submit
    const submitButton = page.getByRole('button', { name: /crear cuenta/i });
    await submitButton.click();

    // Should close modal and show user menu
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('button', { name: /test user/i })).toBeVisible();
  });

  test('should login with existing credentials', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await loginButton.click();

    // Fill login form (using mock data or test account)
    await page.getByLabel(/email/i).fill('customer@test.com');
    await page.getByLabel(/contraseña/i).fill('password123');

    // Submit
    const submitButton = page.getByRole('button', { name: /entrar/i });
    await submitButton.click();

    // Should be logged in
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await loginButton.click();

    await page.getByLabel(/email/i).fill('customer@test.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Wait for login to complete
    await page.waitForTimeout(1000);

    // Click user menu
    const userMenu = page.locator('[data-user-menu]').first();
    await userMenu.click();

    // Click logout
    const logoutButton = page.getByRole('button', { name: /cerrar sesión/i });
    await logoutButton.click();

    // Should show login button again
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await loginButton.click();

    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/contraseña/i).fill('wrongpassword');

    const submitButton = page.getByRole('button', { name: /entrar/i });
    await submitButton.click();

    // Should show error message
    await expect(page.getByText(/credenciales inválidas|error/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await loginButton.click();

    const registerTab = page.getByRole('button', { name: /registrarse/i });
    await registerTab.click();

    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/nombre/i).fill('Test');
    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill('Pass123!');

    const submitButton = page.getByRole('button', { name: /crear cuenta/i });
    await submitButton.click();

    // Should show validation error
    await expect(page.getByText(/email.*válido/i)).toBeVisible();
  });
});
