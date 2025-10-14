export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
<<<<<<< HEAD
  testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/*.test.ts', '<rootDir>/src/**/*.test.ts'],
=======
  testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/*.test.ts'],
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
