const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'auth-service',
  testMatch: ['<rootDir>/test/**/*.spec.ts', '<rootDir>/test/**/*.test.ts', '<rootDir>/*.test.ts'],
  rootDir: '.',
  moduleNameMapper: {
    '^@a4co/shared-utils$': '<rootDir>/../../packages/shared-utils/src/index.ts',
    '^@a4co/shared-utils/(.*)$': '<rootDir>/../../packages/shared-utils/src/$1',
  },
  testEnvironment: 'node',
};