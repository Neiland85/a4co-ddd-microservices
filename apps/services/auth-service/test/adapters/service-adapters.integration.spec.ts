import { BcryptCryptographyAdapter } from '../../src/application/adapters/bcrypt-cryptography.adapter';
import { InMemoryEventBusAdapter } from '../../src/application/adapters/in-memory-event-bus.adapter';
import { InMemoryUserRepositoryAdapter } from '../../src/application/adapters/in-memory-user-repository.adapter';
import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { UserDomainService } from '../../src/domain/services/user-domain.service';
import { RegisterUserDto } from '../../src/application/dto/user.dto';

describe('Service Adapters Integration', () => {
  let userRepository: InMemoryUserRepositoryAdapter;
  let cryptographyService: BcryptCryptographyAdapter;
  let eventBus: InMemoryEventBusAdapter;
  let userDomainService: UserDomainService;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    // Setup adapters
    userRepository = new InMemoryUserRepositoryAdapter();
    cryptographyService = new BcryptCryptographyAdapter();
    eventBus = new InMemoryEventBusAdapter();

    // Setup domain service with repository adapter
    userDomainService = new UserDomainService(userRepository);

    // Setup use case with all adapters
    registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      cryptographyService,
      eventBus,
      userDomainService,
    );
  });

  afterEach(() => {
    userRepository.clear();
    eventBus.clearPublishedEvents();
  });

  describe('CryptographyService Adapter', () => {
    it('should hash password securely', async() => {
      const plainPassword = 'SecurePassword123!';
      const hashedPassword = await cryptographyService.hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should validate password correctly', async() => {
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
      expect(token.length).toBe(32); // 16 bytes = 32 hex chars
    });
  });

  describe('UserRepository Adapter', () => {
    it('should start empty', async() => {
      const count = userRepository.count();
      const users = await userRepository.findAll();

      expect(count).toBe(0);
      expect(users).toHaveLength(0);
    });

    it('should check email existence', async() => {
      const exists = await userRepository.existsByEmail('test@example.com');
      expect(exists).toBe(false);
    });
  });

  describe('EventBus Adapter', () => {
    it('should start with no published events', () => {
      const events = eventBus.getPublishedEvents();
      expect(events).toHaveLength(0);
    });

    it('should publish events', async() => {
      const testEvent = { type: 'TestEvent', data: 'test data' };

      await eventBus.publish(testEvent);

      const events = eventBus.getPublishedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject(testEvent);
    });
  });

  describe('Integrated Use Case with Adapters', () => {
    it('should register user successfully using all adapters', async() => {
      const dto = new RegisterUserDto();
      dto.email = 'test@example.com';
      dto.name = 'Test User';
      dto.password = 'SecurePassword123!';

      const result = await registerUserUseCase.execute(dto);

      // Verify response
      expect(result.email).toBe(dto.email);
      expect(result.name).toBe(dto.name);
      expect(result.status).toBe('active');

      // Verify user was persisted
      const savedUser = await userRepository.findByEmail(dto.email);
      expect(savedUser).toBeDefined();
      expect(savedUser!.email).toBe(dto.email);

      // Verify events were published
      const events = eventBus.getPublishedEvents();
      expect(events.length).toBeGreaterThan(0);
      expect(events.some((e: any) => e.type === 'UserRegisteredEvent')).toBe(true);
    });

    it('should prevent duplicate email registration', async() => {
      const dto = new RegisterUserDto();
      dto.email = 'duplicate@example.com';
      dto.name = 'Test User';
      dto.password = 'SecurePassword123!';

      // First registration should succeed
      await registerUserUseCase.execute(dto);

      // Second registration should fail
      await expect(registerUserUseCase.execute(dto)).rejects.toThrow('El email ya está registrado');
    });
  });
});
