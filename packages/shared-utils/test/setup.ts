// Setup file for Jest tests

// Mock environment variables
process.env['NODE_ENV'] = 'test';
process.env['NOTIFICATION_SERVICE_URL'] = 'http://localhost:3000';

// Global test utilities
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
