"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRepositoryMock = {
    existsByEmail: jest.fn().mockResolvedValue(false),
    findActiveUsers: jest.fn().mockResolvedValue([]),
    findPaginated: jest.fn().mockResolvedValue([]),
    // Otros métodos...
};
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
};
//# sourceMappingURL=userRepositoryMock.js.map