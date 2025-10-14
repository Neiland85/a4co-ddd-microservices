<<<<<<< HEAD
'use strict';
// Setup file for Jest tests
Object.defineProperty(exports, '__esModule', { value: true });
=======
"use strict";
// Setup file for Jest tests
Object.defineProperty(exports, "__esModule", { value: true });
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
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
<<<<<<< HEAD
//# sourceMappingURL=setup.js.map
=======
//# sourceMappingURL=setup.js.map
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
