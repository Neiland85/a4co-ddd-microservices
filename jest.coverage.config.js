module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
<<<<<<< HEAD
  collectCoverage: true,
=======
  roots: ['<rootDir>/src', '<rootDir>/test', '<rootDir>/apps', '<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'apps/**/src/**/*.{js,jsx,ts,tsx}',
    'packages/**/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/test/**',
    '!**/__tests__/**',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*.spec.{js,jsx,ts,tsx}',
  ],
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'json',
    'html',
    'json-summary',
    'cobertura'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    },
    './apps/': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    './packages/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
<<<<<<< HEAD
  collectCoverageFrom: [
    'apps/**/*.ts',
    'packages/**/*.ts',
    '!**/*.d.ts',
    '!**/*.config.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/*.spec.ts',
    '!**/*.test.ts'
  ],
=======
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/packages/shared-utils/src/$1',
  },
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
};
