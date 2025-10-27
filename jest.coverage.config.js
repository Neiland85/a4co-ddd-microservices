module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json', 'html', 'json-summary', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    './apps/': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './packages/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'apps/**/*.ts',
    'packages/**/*.ts',
    '!**/*.d.ts',
    '!**/*.config.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/*.spec.ts',
    '!**/*.test.ts',
  ],
};
