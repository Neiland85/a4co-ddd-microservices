module.exports = {
  projects: [
    '<rootDir>/apps/auth-service/jest.config.js',
    '<rootDir>/apps/inventory-service/jest.config.js',
    '<rootDir>/apps/order-service/jest.config.js',
    '<rootDir>/apps/product-service/jest.config.js',
    '<rootDir>/packages/shared-utils/jest.config.js',
    '<rootDir>/packages/observability/jest.config.js',
    // Add other packages here
  ],
  coverageDirectory: 'coverage',
  collectCoverage: true,
};
