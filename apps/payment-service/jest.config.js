module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/tests/**/*.(ts|tsx|js)',
    '<rootDir>/**/*.test.(ts|tsx|js)',
    '<rootDir>/**/*.spec.(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx|js)',
    '!src/**/*.d.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};