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
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
