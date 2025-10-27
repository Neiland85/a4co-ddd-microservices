"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_cryptography_adapter_1 = require("../../src/application/adapters/bcrypt-cryptography.adapter");
const in_memory_event_bus_adapter_1 = require("../../src/application/adapters/in-memory-event-bus.adapter");
const in_memory_user_repository_adapter_1 = require("../../src/application/adapters/in-memory-user-repository.adapter");
const register_user_use_case_1 = require("../../src/application/use-cases/register-user.use-case");
const user_domain_service_1 = require("../../src/domain/services/user-domain.service");
const user_dto_1 = require("../../src/application/dto/user.dto");
describe('Service Adapters Integration', () => {
    let userRepository;
    let cryptographyService;
    let eventBus;
    let userDomainService;
    let registerUserUseCase;
    beforeEach(() => {
        userRepository = new in_memory_user_repository_adapter_1.InMemoryUserRepositoryAdapter();
        cryptographyService = new bcrypt_cryptography_adapter_1.BcryptCryptographyAdapter();
        eventBus = new in_memory_event_bus_adapter_1.InMemoryEventBusAdapter();
        userDomainService = new user_domain_service_1.UserDomainService(userRepository);
        registerUserUseCase = new register_user_use_case_1.RegisterUserUseCase(userRepository, cryptographyService, eventBus, userDomainService);
    });
    afterEach(() => {
        userRepository.clear();
        eventBus.clearPublishedEvents();
    });
    describe('CryptographyService Adapter', () => {
        it('should hash password securely', async () => {
            const plainPassword = 'SecurePassword123!';
            const hashedPassword = await cryptographyService.hashPassword(plainPassword);
            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(plainPassword);
            expect(hashedPassword.length).toBeGreaterThan(50);
        });
        it('should validate password correctly', async () => {
            const plainPassword = 'SecurePassword123!';
            const hashedPassword = await cryptographyService.hashPassword(plainPassword);
            const isValid = await cryptographyService.validatePassword(plainPassword, hashedPassword);
            const isInvalid = await cryptographyService.validatePassword('WrongPassword', hashedPassword);
            expect(isValid).toBe(true);
            expect(isInvalid).toBe(false);
        });
        it('should generate secure tokens', () => {
            const token = cryptographyService.generateSecureToken(16);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.length).toBe(32);
        });
    });
    describe('UserRepository Adapter', () => {
        it('should start empty', async () => {
            const count = userRepository.count();
            const users = await userRepository.findAll();
            expect(count).toBe(0);
            expect(users).toHaveLength(0);
        });
        it('should check email existence', async () => {
            const exists = await userRepository.existsByEmail('test@example.com');
            expect(exists).toBe(false);
        });
    });
    describe('EventBus Adapter', () => {
        it('should start with no published events', () => {
            const events = eventBus.getPublishedEvents();
            expect(events).toHaveLength(0);
        });
        it('should publish events', async () => {
            const testEvent = { type: 'TestEvent', data: 'test data' };
            await eventBus.publish(testEvent);
            const events = eventBus.getPublishedEvents();
            expect(events).toHaveLength(1);
            expect(events[0]).toMatchObject(testEvent);
        });
    });
    describe('Integrated Use Case with Adapters', () => {
        it('should register user successfully using all adapters', async () => {
            const dto = new user_dto_1.RegisterUserDto();
            dto.email = 'test@example.com';
            dto.name = 'Test User';
            dto.password = 'SecurePassword123!';
            const result = await registerUserUseCase.execute(dto);
            expect(result.email).toBe(dto.email);
            expect(result.name).toBe(dto.name);
            expect(result.status).toBe('active');
            const savedUser = await userRepository.findByEmail(dto.email);
            expect(savedUser).toBeDefined();
            expect(savedUser.email).toBe(dto.email);
            const events = eventBus.getPublishedEvents();
            expect(events.length).toBeGreaterThan(0);
            expect(events.some((e) => e.type === 'UserRegisteredEvent')).toBe(true);
        });
        it('should prevent duplicate email registration', async () => {
            const dto = new user_dto_1.RegisterUserDto();
            dto.email = 'duplicate@example.com';
            dto.name = 'Test User';
            dto.password = 'SecurePassword123!';
            await registerUserUseCase.execute(dto);
            await expect(registerUserUseCase.execute(dto)).rejects.toThrow('El email ya está registrado');
        });
    });
});
//# sourceMappingURL=service-adapters.integration.spec.js.map