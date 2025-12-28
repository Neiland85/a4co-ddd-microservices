/**
 * Global teardown for E2E tests
 * Executed once after all tests complete
 * 
 * Responsibilities:
 * - Cleanup test data
 * - Close connections
 * - Generate final reports
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E test global teardown...');

  try {
    // Add cleanup tasks here
    // e.g., remove test data, close database connections, etc.
    
    console.log('✅ Global teardown completed successfully!');
  } catch (error) {
    console.error('❌ Error during global teardown:', error);
    // Don't throw - we don't want teardown errors to fail the test suite
  }
}

export default globalTeardown;
