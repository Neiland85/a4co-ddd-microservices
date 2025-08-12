module.exports = {
  projects: [
    '<rootDir>/apps/auth-service/jest.config.js',
    '<rootDir>/packages/product-service/jest.config.js',
    '<rootDir>/packages/shared-utils/jest.config.js',
    // Add other packages here
  ],
  coverageDirectory: 'coverage',
  collectCoverage: true,
};
