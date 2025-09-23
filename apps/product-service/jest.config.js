const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'product-service',
  testMatch: ['<rootDir>/tests/**/*.spec.ts', '<rootDir>/tests/**/*.test.ts', '<rootDir>/*.test.ts'],
  rootDir: '.',
  moduleNameMapper: {
    '^@a4co/shared-utils$': '<rootDir>/../../packages/shared-utils/src/index.ts',
    '^@a4co/shared-utils/(.*)$': '<rootDir>/../../packages/shared-utils/src/$1',
  },
  testEnvironment: 'node',
};