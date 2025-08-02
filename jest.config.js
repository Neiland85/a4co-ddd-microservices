module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/apps', '<rootDir>/packages'],
  moduleFileExtensions: ['ts', 'js'],
  testMatch: [
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/test/**/*.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    'apps/**/*.ts',
    'packages/**/*.ts',
    '!**/*.d.ts',
    '!**/*.test.ts',
    '!**/*.spec.ts',
    '!**/node_modules/**',
    '!**/test/**',
    '!**/dist/**',
    '!**/*.js.map',
    '!**/*.d.ts.map',
    '!**/v0dev/**',
    '!**/app/**/*.ts',
    '!**/lib/**',
    '!**/components/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  verbose: true,
  testTimeout: 30000,
};
