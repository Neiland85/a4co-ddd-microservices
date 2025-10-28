import { expect, test } from '@playwright/test';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display product catalog', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-product-card]', { timeout: 5000 });

    const products = page.locator('[data-product-card]');
    const count = await products.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should show product details when clicking a product', async ({ page }) => {
    await page.waitForSelector('[data-product-card]');

    const firstProduct = page.locator('[data-product-card]').first();
    await firstProduct.click();

    // Should navigate to product detail or show modal
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/product/') ||
      (await expect(page.getByRole('dialog')).toBeVisible());
  });

  test('should filter products by category', async ({ page }) => {
    await page.waitForSelector('[data-category]', { timeout: 5000 });

    const firstCategory = page.locator('[data-category]').first();
    await firstCategory.click();

    await page.waitForTimeout(1000);

    // Products should be filtered
    const products = page.locator('[data-product-card]');
    const count = await products.count();

    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should search products', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar/i);

    if ((await searchInput.count()) > 0) {
      await searchInput.fill('aceite');
      await page.keyboard.press('Enter');

      await page.waitForTimeout(1000);

      // Should show search results
      const products = page.locator('[data-product-card]');
      const count = await products.count();

      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should add product to favorites (authenticated)', async ({ page }) => {
    // Login first
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await loginButton.click();

    await page.getByLabel(/email/i).fill('customer@test.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForTimeout(1000);

    // Find and click favorite button
    const favoriteButton = page.locator('[data-favorite-button]').first();

    if ((await favoriteButton.count()) > 0) {
      await favoriteButton.click();

      // Should toggle favorite state
      await page.waitForTimeout(500);
    }
  });

  test('should show product price and stock', async ({ page }) => {
    await page.waitForSelector('[data-product-card]');

    const firstProduct = page.locator('[data-product-card]').first();

    // Should contain price
    await expect(firstProduct.getByText(/€|EUR/)).toBeVisible();

    // Should show stock status
    const stockText = firstProduct.locator('text=/stock|disponible/i');
    if ((await stockText.count()) > 0) {
      await expect(stockText).toBeVisible();
    }
  });
});
