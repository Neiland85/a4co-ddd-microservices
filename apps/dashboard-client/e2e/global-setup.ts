/**
 * Global setup for E2E tests
 * Executed once before all tests run
 * 
 * Responsibilities:
 * - Wait for services to be ready
 * - Initialize test data
 * - Setup NATS event listeners
 */

import { chromium, FullConfig } from '@playwright/test';

// Configuration constants
const MAX_RETRY_ATTEMPTS = 30;
const RETRY_DELAY_MS = 2000;

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test global setup...');

  // Projects/use may be missing in stripped configs (e.g., workflow smoke runs).
  const baseURL =
    config.projects?.[0]?.use?.baseURL ??
    process.env.BASE_URL ??
    'http://localhost:3001';
  const gatewayURL = process.env.GATEWAY_URL || 'http://localhost:8081';
  
  console.log(`📍 Dashboard URL: ${baseURL}`);
  console.log(`📍 Gateway URL: ${gatewayURL}`);

  // Wait for services to be ready
  console.log('⏳ Waiting for services to be ready...');
  
  let retries = 0;
  let servicesReady = false;

  while (retries < MAX_RETRY_ATTEMPTS && !servicesReady) {
    try {
      // Check if gateway is ready
      const gatewayResponse = await fetch(`${gatewayURL}/health`).catch(() => null);
      
      // Check if dashboard is ready
      const dashboardResponse = await fetch(baseURL).catch(() => null);
      
      if (gatewayResponse?.ok && dashboardResponse?.ok) {
        servicesReady = true;
        console.log('✅ All services are ready!');
      } else {
        retries++;
        console.log(`⏳ Services not ready yet (attempt ${retries}/${MAX_RETRY_ATTEMPTS}), waiting...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    } catch (error) {
      retries++;
      console.log(`⏳ Services not ready yet (attempt ${retries}/${MAX_RETRY_ATTEMPTS}), waiting...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  if (!servicesReady) {
    throw new Error('❌ Services did not start in time');
  }

  // Initialize browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Verify dashboard loads
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Dashboard is accessible');

    // Add any additional setup tasks here
    // e.g., seed test data, create test users, etc.
    
  } catch (error) {
    console.error('❌ Error during global setup:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed successfully!');
}

export default globalSetup;
