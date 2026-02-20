const path = require('path');
let baseConfig;
try {
  baseConfig = require(path.resolve(__dirname, '../../jest.config.base.cjs'));
} catch (e) {
  baseConfig = require(path.resolve(__dirname, '../../../jest.config.base.cjs'));
}

module.exports = {
  ...baseConfig,
  displayName: 'shared-utils',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.spec.ts', '<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
  },
};
