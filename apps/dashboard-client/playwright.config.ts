import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E tests
 * Tests the complete order flow with microservices and NATS events
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  // Maximum time one test can run
  timeout: 60 * 1000,
  
  // Test execution settings
  fullyParallel: false, // Run tests sequentially for E2E stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : 1, // Single worker for E2E tests
  
  // Reporting
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never' 
    }],
    ['json', { 
      outputFile: 'playwright-report/results.json' 
    }],
    ['junit', { 
      outputFile: 'playwright-report/results.xml' 
    }],
    ['list']
  ],

  // Global test configuration
  use: {
    // Base URL for the dashboard client
    baseURL: process.env.DASHBOARD_URL || 'http://localhost:3001',
    
    // Trace configuration
    trace: 'retain-on-failure',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
    
    // Action timeout
    actionTimeout: 10 * 1000,
    
    // Viewport
    viewport: { width: 1280, height: 720 },
  },

  // Test projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Additional context options
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },

    // Uncomment for multi-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Web server configuration - starts services before tests
  webServer: process.env.CI ? undefined : {
    command: 'docker-compose -f ../../docker-compose.test.yml up',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Global setup/teardown
  globalSetup: process.env.CI ? undefined : require.resolve('./e2e/global-setup.ts'),
  globalTeardown: process.env.CI ? undefined : require.resolve('./e2e/global-teardown.ts'),
});
