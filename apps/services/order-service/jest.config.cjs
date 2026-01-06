const baseConfig = require('../../jest.config.base.cjs');

module.exports = {
  ...baseConfig,
  displayName: 'order-service',
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.spec.ts',
    '<rootDir>/tests/**/*.spec.ts',
    '<rootDir>/**/*.test.ts',
  ],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
  },
};

