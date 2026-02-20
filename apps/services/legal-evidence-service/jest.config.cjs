const path = require('path');
let baseConfig;
try {
  baseConfig = require(path.resolve(__dirname, '../../jest.config.base.cjs'));
} catch (e) {
  baseConfig = require(path.resolve(__dirname, '../../../jest.config.base.cjs'));
}

module.exports = {
  ...baseConfig,
  displayName: 'legal-evidence-service',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.spec.ts',
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    // Resolve ESM-style .js imports to .ts source files for Jest/CommonJS
    '^(\\.\\.?/.*)\\.js$': '$1',
  },
};
