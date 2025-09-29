module.exports = {
  projects: [
    '<rootDir>/apps/auth-service/jest.config.js',
    '<rootDir>/apps/product-service/jest.config.js',
    '<rootDir>/apps/order-service/jest.config.js',
    '<rootDir>/apps/user-service/jest.config.js',
    '<rootDir>/apps/payment-service/jest.config.js',
    '<rootDir>/packages/shared-utils/jest.config.js',
    '<rootDir>/test/jest-e2e.config.js',
    // Add other packages here
  ],
  coverageDirectory: 'coverage',
  collectCoverage: true,
};
