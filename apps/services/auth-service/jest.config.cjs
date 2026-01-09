const path = require('path');
let baseConfig;
try {
  baseConfig = require(path.resolve(__dirname, '../../jest.config.base.cjs'));
} catch (e) {
  baseConfig = require(path.resolve(__dirname, '../../../jest.config.base.cjs'));
}

module.exports = {
  ...baseConfig,
  displayName: 'auth-service',
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  collectCoverageFrom: [...baseConfig.collectCoverageFrom, '!src/**/*.interface.ts'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
