"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_dto_1 = require("../../src/application/dto/user.dto");
const register_user_use_case_1 = require("../../src/application/use-cases/register-user.use-case");
const factories_1 = require("../factories");
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('test-uuid-1234'),
}));
describe('RegisterUserUseCase', () => {
    let useCase;
    let userRepository;
    let userDomainService;
    beforeEach(() => {
        userRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn().mockResolvedValue((0, factories_1.createUser)()),
            update: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
            existsByEmail: jest.fn(),
            findActiveUsers: jest.fn(),
            findPaginated: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
        };
        userDomainService = {
            isEmailUnique: jest.fn(),
            validateUniqueEmail: jest.fn(),
            canUserPerformAction: jest.fn(),
            userRepository: jest.fn(),
        };
        const mockEventBus = {
            publish: jest.fn(),
            publishAll: jest.fn(),
        };
        const mockCryptographyService = {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
            validatePassword: jest.fn(),
            generateSecureToken: jest.fn(),
        };
        useCase = new register_user_use_case_1.RegisterUserUseCase(userRepository, mockCryptographyService, mockEventBus, userDomainService);
    });
    it('should register a user successfully', async () => {
        const registerDto = (0, factories_1.createRegisterUserDto)();
        const user = (0, factories_1.createUser)({
            id: 'test-uuid-1234',
            email: registerDto.email,
            name: registerDto.name,
            hashedPassword: 'hashed-password',
        });
        userDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        userRepository.save.mockResolvedValue(user);
        const result = await useCase.execute(registerDto);
        expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
        expect(userRepository.save).toHaveBeenCalledWith(expect.any(Object));
        expect(result.email).toBe(registerDto.email);
    });
    it('should throw error if email already exists', async () => {
        const registerDto = new user_dto_1.RegisterUserDto();
        registerDto.email = 'existing@example.com';
        registerDto.name = 'Test User';
        registerDto.password = 'Password123';
        userDomainService.validateUniqueEmail.mockRejectedValue(new Error('El email ya está registrado'));
        await expect(useCase.execute(registerDto)).rejects.toThrow('El email ya está registrado');
        expect(userRepository.save).not.toHaveBeenCalled();
    });
    it('should handle repository save errors', async () => {
        const registerDto = new user_dto_1.RegisterUserDto();
        registerDto.email = 'test@example.com';
        registerDto.name = 'Test User';
        registerDto.password = 'Password123';
        userDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        userRepository.save.mockRejectedValue(new Error('Database error'));
        await expect(useCase.execute(registerDto)).rejects.toThrow('Database error');
        expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    });
});
//# sourceMappingURL=register-user-simple.use-case.spec.js.map