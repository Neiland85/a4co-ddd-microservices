"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.createRegisterUserDto = void 0;
const user_dto_1 = require("../src/application/dto/user.dto");
const user_aggregate_1 = require("../src/domain/aggregates/user.aggregate");
const createRegisterUserDto = (overrides = {}) => {
    const dto = new user_dto_1.RegisterUserDto();
    dto.email = overrides.email ?? 'test@example.com';
    dto.name = overrides.name ?? 'Test User';
    dto.password = overrides.password ?? 'Password123';
    return dto;
};
exports.createRegisterUserDto = createRegisterUserDto;
const createUser = (overrides = {}) => {
    const id = overrides.id ?? 'test-id';
    const email = overrides.email ?? 'test@example.com';
    const name = overrides.name ?? 'Test User';
    const hashedPassword = overrides.hashedPassword ?? 'hashed-password';
    const status = overrides.status ?? user_aggregate_1.UserStatus.ACTIVE;
    const emailVerified = overrides.emailVerified ?? false;
    const lastLoginAt = overrides.lastLoginAt ?? undefined;
    const createdAt = overrides.createdAt ?? new Date();
    const updatedAt = overrides.updatedAt ?? new Date();
    return user_aggregate_1.User.reconstruct({ id, email, name }, { hashedPassword, status, emailVerified }, { lastLoginAt, createdAt, updatedAt }, { id, email, name, hashedPassword, status, emailVerified, lastLoginAt, createdAt, updatedAt });
};
exports.createUser = createUser;
//# sourceMappingURL=factories.js.map