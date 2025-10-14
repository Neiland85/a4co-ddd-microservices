import { test, expect } from '@playwright/test';

test.describe('Button Component Visual Tests', () => {
  test.beforeEach(async({ page }) => {
    // Navegar a la historia del botón en Storybook
    await page.goto('/iframe.html?id=components-button--default');
    await page.waitForLoadState('networkidle');
  });
<<<<<<< HEAD

  test('default button appearance', async({ page }) => {
    const button = page.locator('button').first();
    await expect(button).toBeVisible();

=======

  test('default button appearance', async ({ page }) => {
    const button = page.locator('button').first();
    await expect(button).toBeVisible();

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    // Captura visual del estado por defecto
    await expect(page).toHaveScreenshot('button-default.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });
<<<<<<< HEAD

  test('button hover state', async({ page }) => {
    const button = page.locator('button').first();

=======

  test('button hover state', async ({ page }) => {
    const button = page.locator('button').first();

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    // Hover sobre el botón
    await button.hover();
    await page.waitForTimeout(100); // Esperar transición

    await expect(page).toHaveScreenshot('button-hover.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });
<<<<<<< HEAD

  test('button focus state', async({ page }) => {
    const button = page.locator('button').first();

=======

  test('button focus state', async ({ page }) => {
    const button = page.locator('button').first();

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    // Focus en el botón
    await button.focus();

    await expect(page).toHaveScreenshot('button-focus.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });
<<<<<<< HEAD

  test('button active state', async({ page }) => {
    const button = page.locator('button').first();

=======

  test('button active state', async ({ page }) => {
    const button = page.locator('button').first();

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    // Simular click mantenido
    await button.dispatchEvent('mousedown');

    await expect(page).toHaveScreenshot('button-active.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });

  test('button disabled state', async({ page }) => {
    // Navegar a la variante disabled
    await page.goto('/iframe.html?id=components-button--disabled');
    await page.waitForLoadState('networkidle');

    const button = page.locator('button').first();

    await expect(page).toHaveScreenshot('button-disabled.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });
<<<<<<< HEAD

  test('button variants', async({ page }) => {
    const variants = ['primary', 'secondary', 'danger', 'success'];

=======

  test('button variants', async ({ page }) => {
    const variants = ['primary', 'secondary', 'danger', 'success'];

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    for (const variant of variants) {
      await page.goto(`/iframe.html?id=components-button--${variant}`);
      await page.waitForLoadState('networkidle');

      const button = page.locator('button').first();
      await expect(button).toBeVisible();

      await expect(page).toHaveScreenshot(`button-${variant}.png`, {
        clip: await button.boundingBox(),
        animations: 'disabled',
      });
    }
  });
<<<<<<< HEAD

  test('button sizes', async({ page }) => {
    const sizes = ['small', 'medium', 'large'];

=======

  test('button sizes', async ({ page }) => {
    const sizes = ['small', 'medium', 'large'];

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    for (const size of sizes) {
      await page.goto(`/iframe.html?id=components-button--${size}`);
      await page.waitForLoadState('networkidle');

      const button = page.locator('button').first();
      await expect(button).toBeVisible();

      await expect(page).toHaveScreenshot(`button-${size}.png`, {
        clip: await button.boundingBox(),
        animations: 'disabled',
      });
    }
  });
<<<<<<< HEAD

  test('button with icon', async({ page }) => {
    await page.goto('/iframe.html?id=components-button--with-icon');
    await page.waitForLoadState('networkidle');

    const button = page.locator('button').first();

=======

  test('button with icon', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--with-icon');
    await page.waitForLoadState('networkidle');

    const button = page.locator('button').first();

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    await expect(page).toHaveScreenshot('button-with-icon.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });
<<<<<<< HEAD

  test('button loading state', async({ page }) => {
    await page.goto('/iframe.html?id=components-button--loading');
    await page.waitForLoadState('networkidle');

    const button = page.locator('button').first();

=======

  test('button loading state', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--loading');
    await page.waitForLoadState('networkidle');

    const button = page.locator('button').first();

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    // Esperar a que el spinner esté visible
    await page.locator('.spinner').waitFor({ state: 'visible' });

    await expect(page).toHaveScreenshot('button-loading.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });
});
