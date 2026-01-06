"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_dto_1 = require("../src/application/dto/user.dto");
const user_aggregate_1 = require("../src/domain/aggregates/user.aggregate");
const user_value_objects_1 = require("../src/domain/value-objects/user-value-objects");
describe('Auth Service - Basic Integration', () => {
    it('should create RegisterUserDto with valid data', () => {
        const dto = new user_dto_1.RegisterUserDto();
        dto.email = 'test@example.com';
        dto.name = 'Test User';
        dto.password = 'SecurePassword123';
        expect(dto.email).toBe('test@example.com');
        expect(dto.name).toBe('Test User');
        expect(dto.password).toBe('SecurePassword123');
    });
    it('should create UserResponseDto correctly', () => {
        const responseDto = new user_dto_1.UserResponseDto();
        responseDto.id = 'test-id-123';
        responseDto.email = 'test@example.com';
        responseDto.name = 'Test User';
        responseDto.status = user_aggregate_1.UserStatus.ACTIVE;
        responseDto.emailVerified = false;
        responseDto.createdAt = new Date();
        responseDto.updatedAt = new Date();
        expect(responseDto.id).toBe('test-id-123');
        expect(responseDto.email).toBe('test@example.com');
        expect(responseDto.status).toBe(user_aggregate_1.UserStatus.ACTIVE);
        expect(responseDto.emailVerified).toBe(false);
    });
    it('should create Email value object', () => {
        const email = new user_value_objects_1.Email('user@example.com');
        expect(email.value).toBe('user@example.com');
    });
    it('should create UserName value object', () => {
        const userName = new user_value_objects_1.UserName('John Doe');
        expect(userName.value).toBe('John Doe');
    });
    it('should validate UserStatus enum', () => {
        expect(user_aggregate_1.UserStatus.ACTIVE).toBe('active');
        expect(user_aggregate_1.UserStatus.INACTIVE).toBe('inactive');
        expect(user_aggregate_1.UserStatus.SUSPENDED).toBe('suspended');
    });
    it('should serialize/deserialize DTOs correctly', () => {
        const dto = new user_dto_1.RegisterUserDto();
        dto.email = 'serialize@test.com';
        dto.name = 'Serialize Test';
        dto.password = 'TestPassword123';
        const json = dto.toJSON();
        expect(json['email']).toBe('serialize@test.com');
        expect(json['name']).toBe('Serialize Test');
        expect(typeof json).toBe('object');
    });
});
//# sourceMappingURL=basic.spec.js.map