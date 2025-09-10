"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
    testDir: './tests/visual',
    outputDir: './test-results',
    // Configuración de paralelización
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    // Configuración de reportes
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
    ],
    use: {
        // URL base de Storybook
        baseURL: process.env.STORYBOOK_URL || 'http://localhost:6006',
        // Captura de trazas en caso de fallo
        trace: 'on-first-retry',
        // Screenshots para comparación visual
        screenshot: {
            mode: 'only-on-failure',
            fullPage: true,
        },
        // Configuración de viewport por defecto
        viewport: { width: 1280, height: 720 },
    },
    // Configuración de proyectos para diferentes navegadores/dispositivos
    projects: [
        {
            name: 'chromium',
            use: { ...test_1.devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...test_1.devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...test_1.devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...test_1.devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...test_1.devices['iPhone 12'] },
        },
        {
            name: 'tablet',
            use: {
                ...test_1.devices['iPad Pro'],
                viewport: { width: 1024, height: 768 },
            },
        },
    ],
    // Servidor web para desarrollo local
    webServer: {
        command: 'pnpm storybook',
        url: 'http://localhost:6006',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
//# sourceMappingURL=playwright.config.js.map