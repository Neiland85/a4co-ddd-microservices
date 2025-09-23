module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
