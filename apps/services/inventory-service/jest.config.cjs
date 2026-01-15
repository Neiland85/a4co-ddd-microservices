const path = require('path');
let baseConfig;
try {
  baseConfig = require(path.resolve(__dirname, '../../jest.config.base.cjs'));
} catch (e) {
  baseConfig = require(path.resolve(__dirname, '../../../jest.config.base.cjs'));
}

module.exports = {
  ...baseConfig,
  displayName: 'inventory-service',
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/tests', '<rootDir>'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.spec.ts',
    '<rootDir>/tests/**/*.spec.ts',
    '<rootDir>/**/*.test.ts',
  ],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@a4co/shared-utils/src/(.*)$': '<rootDir>/../../packages/shared-utils/src/$1.ts',
  },
};
