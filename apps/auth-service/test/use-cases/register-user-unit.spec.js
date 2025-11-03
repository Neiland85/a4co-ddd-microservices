"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_user_use_case_1 = require("../../src/application/use-cases/register-user.use-case");
const user_domain_service_1 = require("../../src/domain/services/user-domain.service");
const user_dto_1 = require("../../src/application/dto/user.dto");
const factories_1 = require("../factories");
describe('RegisterUserUseCase - Unit Test', () => {
    let useCase;
    let mockUserRepository;
    let mockUserDomainService;
    let mockCryptographyService;
    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            existsByEmail: jest.fn(),
        };
        mockCryptographyService = {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
            validatePassword: jest.fn(),
            generateSecureToken: jest.fn(),
        };
        const mockEventBus = {
            publish: jest.fn(),
            publishAll: jest.fn(),
        };
        mockUserDomainService = {
            validateUniqueEmail: jest.fn(),
            isEmailUnique: jest.fn(),
            canUserPerformAction: jest.fn(),
        };
        useCase = new register_user_use_case_1.RegisterUserUseCase(mockUserRepository, mockCryptographyService, mockEventBus, mockUserDomainService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should create instance correctly', () => {
        expect(useCase).toBeDefined();
        expect(useCase.execute).toBeDefined();
    });
    it('should call validateUniqueEmail when executing', async () => {
        const registerDto = {
            email: 'test@example.com',
            name: 'Test User',
            password: 'Password123',
        };
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        const mockUser = {
            id: 'test-id',
            email: 'test@example.com',
            name: 'Test User',
            status: 'ACTIVE',
            emailVerified: false,
            lastLoginAt: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockUserRepository.save.mockResolvedValue(mockUser);
        jest.doMock('../../src/domain/aggregates/user.aggregate', () => ({
            User: {
                createWithHashedPassword: jest.fn().mockResolvedValue(mockUser),
            },
        }));
        await useCase.execute(registerDto);
        expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    });
    it('should throw error when email validation fails', async () => {
        const registerDto = {
            email: 'existing@example.com',
            name: 'Test User',
            password: 'Password123',
        };
        const emailError = new Error('El email ya está registrado');
        mockUserDomainService.validateUniqueEmail.mockRejectedValue(emailError);
        await expect(useCase.execute(registerDto)).rejects.toThrow('El email ya está registrado');
        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
    it('should validate unique email successfully', async () => {
        const registerDto = {
            email: 'unique@example.com',
            name: 'Unique User',
            password: 'Password123',
        };
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        await useCase.execute(registerDto);
        expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    });
    it('should create a user successfully', async () => {
        const registerDto = (0, factories_1.createRegisterUserDto)();
        const user = (0, factories_1.createUser)();
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        mockUserRepository.save.mockResolvedValue(user);
        const result = await useCase.execute(registerDto);
        expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
        expect(mockUserRepository.save).toHaveBeenCalledWith(user);
        expect(result.email).toBe(registerDto.email);
    });
    it('should hash the password before saving the user', async () => {
        const registerDto = (0, factories_1.createRegisterUserDto)();
        const hashedPassword = 'hashed-password';
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        mockCryptographyService.hashPassword.mockResolvedValue(hashedPassword);
        const expectedUser = (0, factories_1.createUser)({
            email: registerDto.email,
            name: registerDto.name,
            hashedPassword,
        });
        mockUserRepository.save.mockResolvedValue(expectedUser);
        const result = await useCase.execute(registerDto);
        expect(mockCryptographyService.hashPassword).toHaveBeenCalledWith(registerDto.password);
        expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({ hashedPassword }));
        expect(result.email).toBe(registerDto.email);
    });
    it('should throw an error if hashPassword fails', async () => {
        const registerDto = (0, factories_1.createRegisterUserDto)();
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        mockCryptographyService.hashPassword.mockRejectedValue(new Error('Hashing failed'));
        await expect(useCase.execute(registerDto)).rejects.toThrow('Hashing failed');
        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
    it('should throw an error for invalid DTO fields', async () => {
        const invalidDto = {
            email: 'invalid-email',
            name: '',
            password: '123',
        };
        await expect(useCase.execute(invalidDto)).rejects.toThrow('Invalid input data');
        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
    it('should handle errors in findByEmail method', async () => {
        const registerDto = (0, factories_1.createRegisterUserDto)();
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        mockUserRepository.findByEmail.mockRejectedValue(new Error('Database error'));
        await expect(useCase.execute(registerDto)).rejects.toThrow('Database error');
        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
});
describe('RegisterUserUseCase - Integration Test', () => {
    let useCase;
    let mockUserRepository;
    let mockUserDomainService;
    let mockCryptographyService;
    beforeEach(() => {
        mockUserRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
        };
        mockUserDomainService = new user_domain_service_1.UserDomainService(mockUserRepository);
        const mockEventBus = {
            publish: jest.fn(),
            publishAll: jest.fn(),
        };
        mockCryptographyService = {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
            validatePassword: jest.fn(),
            generateSecureToken: jest.fn(),
        };
        jest.doMock('../../src/domain/aggregates/user.aggregate', () => ({
            User: {
                createWithHashedPassword: jest.fn().mockResolvedValue({
                    id: 'test-id',
                    email: 'test@example.com',
                    name: 'Test User',
                    status: 'ACTIVE',
                    emailVerified: false,
                    lastLoginAt: undefined,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    getUncommittedEvents: jest.fn().mockReturnValue(['UserRegisteredEvent']),
                    clearEvents: jest.fn(),
                }),
            },
        }));
        useCase = new register_user_use_case_1.RegisterUserUseCase(mockUserRepository, mockCryptographyService, mockEventBus, mockUserDomainService);
    });
    it('should handle successful user registration flow', async () => {
        const registerDto = {
            email: 'newuser@example.com',
            name: 'New User',
            password: 'SecurePassword123',
        };
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        const expectedUser = {
            id: 'generated-id',
            email: registerDto.email,
            name: registerDto.name,
            status: 'ACTIVE',
            emailVerified: false,
            lastLoginAt: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockUserRepository.save.mockResolvedValue(expectedUser);
        const result = await useCase.execute(registerDto);
        expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(result.email).toBe(registerDto.email);
        expect(result.name).toBe(registerDto.name);
    });
    it('should handle repository save errors', async () => {
        const registerDto = {
            email: 'test@example.com',
            name: 'Test User',
            password: 'Password123',
        };
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        mockUserRepository.save.mockRejectedValue(new Error('Database connection failed'));
        await expect(useCase.execute(registerDto)).rejects.toThrow('Database connection failed');
        expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    });
});
describe('RegisterUserUseCase - Event Publication', () => {
    let useCase;
    let mockUserRepository;
    let mockUserDomainService;
    let mockEventBus;
    let mockCryptographyService;
    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
        };
        mockUserDomainService = {
            validateUniqueEmail: jest.fn(),
        };
        mockEventBus = {
            publishAll: jest.fn(),
        };
        mockCryptographyService = {
            hashPassword: jest.fn().mockResolvedValue('hashed-password'),
        };
        useCase = new register_user_use_case_1.RegisterUserUseCase(mockUserRepository, mockUserDomainService, mockEventBus, mockCryptographyService);
    });
    it('should publish domain events after successful user registration', async () => {
        const registerDto = new user_dto_1.RegisterUserDto();
        registerDto.email = 'newuser@example.com';
        registerDto.name = 'New User';
        registerDto.password = 'SecurePassword123';
        const mockUser = {
            id: 'test-id',
            email: registerDto.email,
            name: registerDto.name,
            status: 'ACTIVE',
            emailVerified: false,
            lastLoginAt: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            getUncommittedEvents: jest.fn().mockReturnValue(['UserRegisteredEvent']),
            clearEvents: jest.fn(),
        };
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        mockUserRepository.save.mockResolvedValue(mockUser);
        await useCase.execute(registerDto);
        expect(mockEventBus.publishAll).toHaveBeenCalledWith(['UserRegisteredEvent']);
        expect(mockUser.clearEvents).toHaveBeenCalled();
    });
    it('should not publish events if user registration fails', async () => {
        const registerDto = new user_dto_1.RegisterUserDto();
        registerDto.email = 'existing@example.com';
        registerDto.name = 'Existing User';
        registerDto.password = 'Password123';
        mockUserDomainService.validateUniqueEmail.mockRejectedValue(new Error('El email ya está registrado'));
        await expect(useCase.execute(registerDto)).rejects.toThrow('El email ya está registrado');
        expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });
    it('should publish events with correct data', async () => {
        const registerDto = (0, factories_1.createRegisterUserDto)();
        const mockUser = {
            id: 'test-id',
            email: registerDto.email,
            name: registerDto.name,
            status: 'ACTIVE',
            emailVerified: false,
            lastLoginAt: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            getUncommittedEvents: jest.fn().mockReturnValue(['UserRegisteredEvent']),
            clearEvents: jest.fn(),
        };
        mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
        mockUserRepository.save.mockResolvedValue(mockUser);
        await useCase.execute(registerDto);
        expect(mockEventBus.publishAll).toHaveBeenCalledWith(['UserRegisteredEvent']);
        expect(mockUser.getUncommittedEvents).toHaveBeenCalled();
    });
});
//# sourceMappingURL=register-user-unit.spec.js.map