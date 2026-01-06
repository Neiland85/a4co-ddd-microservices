const baseConfig = require('../../jest.config.base.cjs');

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
    '^@a4co/shared-utils$': '<rootDir>/../../packages/shared-utils/src/index.ts',
    '^@a4co/shared-utils/(.*)$': '<rootDir>/../../packages/shared-utils/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
};
