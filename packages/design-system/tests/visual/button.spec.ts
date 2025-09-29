import { test, expect } from '@playwright/test';

test.describe('Button Component Visual Tests', () => {
  test.beforeEach(async({ page }) => {
    // Navegar a la historia del botón en Storybook
    await page.goto('/iframe.html?id=components-button--default');
    await page.waitForLoadState('networkidle');
  });

  test('default button appearance', async({ page }) => {
    const button = page.locator('button').first();
    await expect(button).toBeVisible();

    // Captura visual del estado por defecto
    await expect(page).toHaveScreenshot('button-default.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });

  test('button hover state', async({ page }) => {
    const button = page.locator('button').first();

    // Hover sobre el botón
    await button.hover();
    await page.waitForTimeout(100); // Esperar transición

    await expect(page).toHaveScreenshot('button-hover.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });

  test('button focus state', async({ page }) => {
    const button = page.locator('button').first();

    // Focus en el botón
    await button.focus();

    await expect(page).toHaveScreenshot('button-focus.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });

  test('button active state', async({ page }) => {
    const button = page.locator('button').first();

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

  test('button variants', async({ page }) => {
    const variants = ['primary', 'secondary', 'danger', 'success'];

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

  test('button sizes', async({ page }) => {
    const sizes = ['small', 'medium', 'large'];

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

  test('button with icon', async({ page }) => {
    await page.goto('/iframe.html?id=components-button--with-icon');
    await page.waitForLoadState('networkidle');

    const button = page.locator('button').first();

    await expect(page).toHaveScreenshot('button-with-icon.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });

  test('button loading state', async({ page }) => {
    await page.goto('/iframe.html?id=components-button--loading');
    await page.waitForLoadState('networkidle');

    const button = page.locator('button').first();

    // Esperar a que el spinner esté visible
    await page.locator('.spinner').waitFor({ state: 'visible' });

    await expect(page).toHaveScreenshot('button-loading.png', {
      clip: await button.boundingBox(),
      animations: 'disabled',
    });
  });
});
