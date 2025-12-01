// @ts-nocheck
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps', '<rootDir>/packages'],
  testMatch: [
    '**/__tests__/**/*.spec.ts',
    '**/?(*.)+(spec|test).ts',
    '!**/dist/**',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/prisma/**',
    '!**/*.e2e-spec.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '.infra', '.e2e'],
  collectCoverageFrom: [
    'apps/**/*.ts',
    'packages/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/prisma/**',
  ],
  moduleNameMapper: {
    '^@a4co/(.*)$': '<rootDir>/packages/$1/src',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },
};
