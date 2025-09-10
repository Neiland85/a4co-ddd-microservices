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
    return user_aggregate_1.User.reconstruct(overrides.id ?? 'test-id', overrides.email ?? 'test@example.com', overrides.name ?? 'Test User', overrides.hashedPassword ?? 'hashed-password', overrides.status ?? user_aggregate_1.UserStatus.ACTIVE, overrides.emailVerified ?? false, overrides.lastLoginAt ?? undefined, overrides.createdAt ?? new Date(), overrides.updatedAt ?? new Date(), {});
};
exports.createUser = createUser;
//# sourceMappingURL=factories.js.map