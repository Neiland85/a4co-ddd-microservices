/**
 * Base Jest Configuration for A4CO Monorepo
 * All services should extend this configuration
 */
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 30000,

  // Transform TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: false,
        tsconfig: '<rootDir>/tsconfig.spec.json',
        diagnostics: {
          ignoreCodes: [151001, 151002], // Suppress ts-jest warnings
        },
      },
    ],
    // Transform ESM modules in node_modules
    '^.+\\.js$': 'babel-jest',
  },

  // Handle ES modules from node_modules - transform uuid and other ESM packages
  transformIgnorePatterns: ['node_modules/(?!(uuid|@nestjs|rxjs|nanoid)/)'],

  // Module resolution
  moduleNameMapper: {
    // Mock uuid with a simple CommonJS implementation (absolute path)
    '^uuid$': path.resolve(__dirname, '__mocks__/uuid.cjs'),
    // Handle @a4co/shared-utils imports (absolute paths)
    '^@a4co/shared-utils$': path.resolve(__dirname, 'packages/shared-utils/src/index.ts'),
    '^@a4co/shared-utils/(.*)$': path.resolve(__dirname, 'packages/shared-utils/src/$1'),
    // Handle @a4co/observability imports
    '^@a4co/observability$': path.resolve(__dirname, 'packages/observability/src/index.ts'),
    '^@a4co/observability/(.*)$': path.resolve(__dirname, 'packages/observability/src/$1'),
  },

  // File extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Coverage configuration
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.interface.ts',
  ],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/.infra/', '.e2e-spec.ts'],

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
};
