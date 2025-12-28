// @ts-nocheck
/**
 * Root Jest Configuration for A4CO Monorepo
 * Runs tests across all apps and packages
 */
const baseConfig = require('./jest.config.base.cjs');

module.exports = {
  ...baseConfig,

  // Project-based configuration for monorepo
  projects: [
    '<rootDir>/apps/order-service',
    '<rootDir>/apps/payment-service',
    '<rootDir>/apps/inventory-service',
    '<rootDir>/apps/auth-service',
    '<rootDir>/apps/product-service',
    '<rootDir>/apps/user-service',
    '<rootDir>/apps/gateway',
  ],

  // Root-level settings
  rootDir: '.',

  // Override module mapper for root level
  moduleNameMapper: {
    '^@a4co/shared-utils$': '<rootDir>/packages/shared-utils/src/index.ts',
    '^@a4co/shared-utils/(.*)$': '<rootDir>/packages/shared-utils/src/$1',
    '^@a4co/observability$': '<rootDir>/packages/observability/src/index.ts',
    '^@a4co/observability/(.*)$': '<rootDir>/packages/observability/src/$1',
  },

  // Coverage settings for whole monorepo
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'apps/**/src/**/*.ts',
    'packages/**/src/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/prisma/**',
    '!**/*.module.ts',
    '!**/main.ts',
  ],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/.infra/', '.e2e-spec.ts'],
};
