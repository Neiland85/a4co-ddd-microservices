const baseConfig = require('../../jest.config.base.cjs');

module.exports = {
    ...baseConfig,
    displayName: 'gateway',
    rootDir: '.',
    roots: ['<rootDir>/src'],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.spec.ts',
        '<rootDir>/src/**/*.spec.ts',
        '<rootDir>/**/*.test.ts',
    ],
    moduleNameMapper: {
        ...baseConfig.moduleNameMapper,
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};
