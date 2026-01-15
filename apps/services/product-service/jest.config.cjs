const path = require('path');
let baseConfig;
try {
  baseConfig = require(path.resolve(__dirname, '../../jest.config.base.cjs'));
} catch (e) {
  baseConfig = require(path.resolve(__dirname, '../../../jest.config.base.cjs'));
}

module.exports = {
  ...baseConfig,
  displayName: 'product-service',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.spec.ts', '<rootDir>/*.test.ts'],
  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
  ],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
};
