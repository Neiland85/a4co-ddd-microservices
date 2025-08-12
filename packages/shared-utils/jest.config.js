const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'shared-utils',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
};