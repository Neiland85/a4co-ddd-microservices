module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 30000,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@a4co/shared-utils$': '<rootDir>/packages/shared-utils/src/index.ts',
    '^@a4co/shared-utils/(.*)$': '<rootDir>/packages/shared-utils/src/$1',
  },
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/main.ts'],
};
