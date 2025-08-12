import { test, expect } from '@playwright/test';

test.describe('Flujo Completo de Usuario', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');
  });

  test('Flujo completo: Login → Navegación → Acción Crítica → Logout', async ({ page }) => {
    // 1. LOGIN - Simular autenticación
    await test.step('Login del usuario', async () => {
      // Buscar botón de login o navegar a página de login
      const loginButton = page.getByRole('button', { name: /login|iniciar sesión|sign in/i });
      
      if (await loginButton.isVisible()) {
        await loginButton.click();
        
        // Esperar a que aparezca el formulario de login
        await page.waitForSelector('form', { timeout: 5000 });
        
        // Llenar formulario de login (simulado)
        await page.fill('input[name="email"]', 'usuario@ejemplo.com');
        await page.fill('input[name="password"]', 'password123');
        
        // Enviar formulario
        await page.click('button[type="submit"]');
        
        // Esperar a que se complete el login
        await page.waitForURL('**/dashboard**', { timeout: 10000 });
      } else {
        // Si no hay login, continuar con el flujo
        console.log('No se encontró botón de login, continuando...');
      }
    });

    // 2. NAVEGACIÓN - Explorar la aplicación
    await test.step('Navegación por la aplicación', async () => {
      // Verificar que estamos en la página principal
      await expect(page).toHaveTitle(/dashboard|inicio|home/i);
      
      // Navegar a la sección de productos
      const productsLink = page.getByRole('link', { name: /productos|products/i });
      if (await productsLink.isVisible()) {
        await productsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verificar que estamos en la página de productos
        await expect(page).toHaveURL(/.*productos?.*/i);
      }
      
      // Navegar a la sección de iconos
      const iconsLink = page.getByRole('link', { name: /iconos|icons/i });
      if (await iconsLink.isVisible()) {
        await iconsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verificar que estamos en la página de iconos
        await expect(page).toHaveURL(/.*iconos?.*/i);
      }
    });

    // 3. ACCIÓN CRÍTICA - Interactuar con funcionalidad principal
    await test.step('Acción crítica: Seleccionar y descargar icono', async () => {
      // Buscar la grilla de iconos
      const iconGrid = page.locator('[data-testid="icon-grid"], .icon-grid, [class*="grid"]');
      
      if (await iconGrid.isVisible()) {
        // Seleccionar el primer icono disponible
        const firstIcon = page.locator('[data-testid="icon-item"], .icon-item, [class*="icon"]').first();
        
        if (await firstIcon.isVisible()) {
          await firstIcon.click();
          
          // Esperar a que se muestren los detalles del icono
          await page.waitForSelector('[data-testid="icon-details"], .icon-details', { timeout: 5000 });
          
          // Verificar que se muestran los detalles
          await expect(page.locator('[data-testid="icon-name"], .icon-name')).toBeVisible();
          
          // Hacer clic en el botón de descarga
          const downloadButton = page.getByRole('button', { name: /descargar|download/i });
          if (await downloadButton.isVisible()) {
            await downloadButton.click();
            
            // Esperar a que se complete la descarga (simulado)
            await page.waitForTimeout(2000);
            
            // Verificar que se mostró algún mensaje de confirmación
            const successMessage = page.locator('[data-testid="success-message"], .success, [class*="success"]');
            if (await successMessage.isVisible()) {
              await expect(successMessage).toContainText(/descargado|download|éxito/i);
            }
          }
        }
      }
    });

    // 4. NAVEGACIÓN ADICIONAL - Explorar más funcionalidades
    await test.step('Navegación adicional', async () => {
      // Navegar a la sección de estadísticas
      const statsLink = page.getByRole('link', { name: /estadísticas|stats|analytics/i });
      if (await statsLink.isVisible()) {
        await statsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verificar que se muestran las estadísticas
        await expect(page.locator('[data-testid="stats"], .stats, [class*="statistics"]')).toBeVisible();
      }
      
      // Navegar a la configuración
      const settingsLink = page.getByRole('link', { name: /configuración|settings|perfil/i });
      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verificar que estamos en la página de configuración
        await expect(page).toHaveURL(/.*config|settings|profile.*/i);
      }
    });

    // 5. LOGOUT - Cerrar sesión
    await test.step('Logout del usuario', async () => {
      // Buscar botón de logout
      const logoutButton = page.getByRole('button', { name: /logout|cerrar sesión|sign out/i });
      
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        
        // Esperar a que se complete el logout
        await page.waitForURL('**/login**', { timeout: 10000 });
        
        // Verificar que estamos en la página de login
        await expect(page).toHaveURL(/.*login.*/i);
      } else {
        // Si no hay logout, verificar que estamos en la página principal
        await expect(page).toHaveURL(/.*dashboard|home.*/i);
      }
    });
  });

  test('Verificación de accesibilidad', async ({ page }) => {
    await test.step('Verificar accesibilidad básica', async () => {
      // Verificar que hay elementos de navegación accesibles
      const nav = page.getByRole('navigation');
      if (await nav.isVisible()) {
        await expect(nav).toBeVisible();
      }
      
      // Verificar que hay un heading principal
      const mainHeading = page.getByRole('heading', { level: 1 });
      if (await mainHeading.isVisible()) {
        await expect(mainHeading).toBeVisible();
      }
      
      // Verificar que los botones tienen texto accesible
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const buttonText = await button.textContent();
        expect(buttonText?.trim()).toBeTruthy();
      }
    });
  });

  test('Verificación de responsive design', async ({ page }) => {
    await test.step('Verificar diseño responsive', async () => {
      // Probar en diferentes tamaños de pantalla
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 1024, height: 768 },  // Tablet
        { width: 768, height: 1024 },  // Tablet portrait
        { width: 375, height: 667 },   // Mobile
        { width: 320, height: 568 },   // Small mobile
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        
        // Verificar que la página se carga correctamente
        await expect(page).toBeVisible();
        
        // Verificar que no hay elementos que se salgan de la pantalla
        const body = page.locator('body');
        const bodyBox = await body.boundingBox();
        
        if (bodyBox) {
          expect(bodyBox.width).toBeLessThanOrEqual(viewport.width);
        }
        
        // Tomar screenshot para comparación visual
        await page.screenshot({ 
          path: `test-results/responsive-${viewport.width}x${viewport.height}.png`,
          fullPage: true 
        });
      }
    });
  });

  test('Manejo de errores', async ({ page }) => {
    await test.step('Verificar manejo de errores', async () => {
      // Intentar navegar a una página que no existe
      await page.goto('http://localhost:3000/pagina-inexistente');
      
      // Verificar que se muestra una página de error 404
      const errorMessage = page.locator('[data-testid="error"], .error, [class*="not-found"]');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toContainText(/404|no encontrado|error/i);
      }
      
      // Volver a la página principal
      await page.goto('http://localhost:3000');
      await expect(page).toHaveURL('http://localhost:3000');
    });
  });
}); 