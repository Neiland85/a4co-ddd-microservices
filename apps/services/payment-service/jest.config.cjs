const path = require('path');
let baseConfig;
try {
  baseConfig = require(path.resolve(__dirname, '../../jest.config.base.cjs'));
} catch (e) {
  baseConfig = require(path.resolve(__dirname, '../../../jest.config.base.cjs'));
}

module.exports = {
  ...baseConfig,
  displayName: 'payment-service',
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.spec.ts',
    '<rootDir>/**/*.test.ts',
    '<rootDir>/**/*.spec.ts',
  ],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
  },
};
