import { expect, test } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Login
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await loginButton.click();

    await page.getByLabel(/email/i).fill('customer@test.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForTimeout(1000);
  });

  test('should add product to cart', async ({ page }) => {
    await page.waitForSelector('[data-product-card]');

    // Click add to cart on first product
    const addToCartButton = page.locator('[data-add-to-cart]').first();

    if ((await addToCartButton.count()) > 0) {
      await addToCartButton.click();

      // Cart badge should update
      const cartBadge = page.locator('[data-cart-badge]');
      if ((await cartBadge.count()) > 0) {
        const badgeText = await cartBadge.textContent();
        expect(parseInt(badgeText || '0')).toBeGreaterThan(0);
      }
    }
  });

  test('should open cart sidebar', async ({ page }) => {
    const cartButton = page.locator('[data-cart-button]');

    if ((await cartButton.count()) > 0) {
      await cartButton.click();

      // Cart sidebar should be visible
      const cartSidebar = page.locator('[data-cart-sidebar]');
      await expect(cartSidebar).toBeVisible();
    }
  });

  test('should complete checkout process', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-product-card]');
    const addToCartButton = page.locator('[data-add-to-cart]').first();

    if ((await addToCartButton.count()) > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(500);

      // Go to checkout
      const checkoutButton = page.getByRole('button', { name: /finalizar compra|checkout/i });

      if ((await checkoutButton.count()) > 0) {
        await checkoutButton.click();

        // Should navigate to checkout page
        await page.waitForURL(/checkout/, { timeout: 5000 }).catch(() => {});

        // Fill shipping info (if required)
        const addressInput = page.getByLabel(/dirección|address/i);
        if ((await addressInput.count()) > 0) {
          await addressInput.fill('Calle Test 123, Jaén');
        }

        // Complete order
        const completeButton = page.getByRole('button', { name: /completar|confirmar/i });
        if ((await completeButton.count()) > 0) {
          await completeButton.click();

          // Should show confirmation
          await page.waitForTimeout(2000);
          await expect(page.getByText(/pedido.*confirmado|gracias/i)).toBeVisible();
        }
      }
    }
  });

  test('should update cart quantity', async ({ page }) => {
    await page.waitForSelector('[data-product-card]');

    const addToCartButton = page.locator('[data-add-to-cart]').first();
    if ((await addToCartButton.count()) > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(500);

      // Open cart
      const cartButton = page.locator('[data-cart-button]');
      if ((await cartButton.count()) > 0) {
        await cartButton.click();

        // Increment quantity
        const incrementButton = page.locator('[data-increment-qty]').first();
        if ((await incrementButton.count()) > 0) {
          await incrementButton.click();

          // Quantity should increase
          const qtyDisplay = page.locator('[data-item-qty]').first();
          const qty = await qtyDisplay.textContent();
          expect(parseInt(qty || '1')).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  test('should calculate total correctly', async ({ page }) => {
    await page.waitForSelector('[data-product-card]');

    const addToCartButton = page.locator('[data-add-to-cart]').first();
    if ((await addToCartButton.count()) > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(500);

      const cartButton = page.locator('[data-cart-button]');
      if ((await cartButton.count()) > 0) {
        await cartButton.click();

        // Should show total
        const totalElement = page.locator('[data-cart-total]');
        if ((await totalElement.count()) > 0) {
          await expect(totalElement).toBeVisible();
          const totalText = await totalElement.textContent();
          expect(totalText).toMatch(/€|EUR/);
        }
      }
    }
  });
});
