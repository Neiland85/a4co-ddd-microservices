"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
jest.setTimeout(30000);
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('test-uuid-1234'),
}));
const mockNestJS = {
    Injectable: () => (target) => target,
    Inject: () => (target, propertyKey, parameterIndex) => { },
};
//# sourceMappingURL=setup.js.map