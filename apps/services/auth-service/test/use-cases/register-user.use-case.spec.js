"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_dto_1 = require("../../src/application/dto/user.dto");
const register_user_use_case_1 = require("../../src/application/use-cases/register-user.use-case");
const user_aggregate_1 = require("../../src/domain/aggregates/user.aggregate");
const factories_1 = require("../factories");
describe('RegisterUserUseCase', () => {
    let useCase;
    let userRepository;
    let userDomainService;
    beforeEach(async () => {
        userRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            existsByEmail: jest.fn(),
            findActiveUsers: jest.fn(),
            findPaginated: jest.fn(),
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
    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });
    it('should register a user successfully', async () => {
        const registerDto = (0, factories_1.createRegisterUserDto)();
        const user = (0, factories_1.createUser)();
        userDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        userRepository.save.mockResolvedValue(user);
        const result = await useCase.execute(registerDto);
        expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
        expect(userRepository.save).toHaveBeenCalledWith(expect.any(Object));
        expect(result.email).toBe(registerDto.email);
        expect(result.name).toBe(registerDto.name);
        expect(result.id).toBeDefined();
        expect(result.status).toBe(user_aggregate_1.UserStatus.ACTIVE);
        expect(result.emailVerified).toBe(false);
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
});
//# sourceMappingURL=register-user.use-case.spec.js.map