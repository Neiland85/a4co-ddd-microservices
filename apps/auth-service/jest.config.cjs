const baseConfig = require('../../jest.config.base.cjs');

module.exports = {
  ...baseConfig,
  displayName: 'auth-service',
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  collectCoverageFrom: [...baseConfig.collectCoverageFrom, '!src/**/*.interface.ts'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@a4co/shared-utils$': '<rootDir>/../../packages/shared-utils/src/index.ts',
    '^@a4co/shared-utils/(.*)$': '<rootDir>/../../packages/shared-utils/src/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
