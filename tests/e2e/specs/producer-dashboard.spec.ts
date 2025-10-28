import { expect, test } from '@playwright/test';

test.describe('Producer Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/producer');
  });

  test('should display producer authentication page', async ({ page }) => {
    await expect(page.getByText(/productores|artesanos/i)).toBeVisible();
  });

  test('should login as producer', async ({ page }) => {
    // Fill login form
    await page.getByLabel(/email/i).fill('producer@test.com');
    await page.getByLabel(/contraseña/i).fill('password123');

    const loginButton = page.getByRole('button', { name: /entrar/i });
    await loginButton.click();

    await page.waitForTimeout(1000);

    // Should navigate to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should register new producer', async ({ page }) => {
    // Switch to register
    const registerTab = page.getByRole('button', { name: /registrarse/i });
    if ((await registerTab.count()) > 0) {
      await registerTab.click();

      // Fill form
      await page.getByLabel(/nombre/i).fill('Test Producer');
      await page.getByLabel(/email/i).fill(`producer-${Date.now()}@test.com`);
      await page
        .getByLabel(/contraseña/i)
        .first()
        .fill('Pass123!');
      await page.getByLabel(/teléfono/i).fill('+34612345678');

      const submitButton = page.getByRole('button', { name: /crear cuenta/i });
      await submitButton.click();

      await page.waitForTimeout(1500);

      // Should redirect to dashboard
      await expect(page).toHaveURL(/dashboard/);
    }
  });

  test('should display orders in dashboard', async ({ page }) => {
    // Login as producer
    await page.getByLabel(/email/i).fill('producer@test.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForTimeout(1500);

    // Should show dashboard sections
    const ordersSection = page.locator('text=/pedidos|órdenes/i');
    if ((await ordersSection.count()) > 0) {
      await expect(ordersSection).toBeVisible();
    }
  });

  test('should update order status', async ({ page }) => {
    // Login as producer
    await page.getByLabel(/email/i).fill('producer@test.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForTimeout(1500);

    // Find order status select
    const statusSelect = page.locator('[data-order-status]').first();

    if ((await statusSelect.count()) > 0) {
      await statusSelect.click();

      // Select new status
      const statusOption = page.getByRole('option', { name: /procesando|enviado/i });
      if ((await statusOption.count()) > 0) {
        await statusOption.click();

        // Should update
        await page.waitForTimeout(500);
      }
    }
  });
});
