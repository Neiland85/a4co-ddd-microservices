import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { UserRepositoryPort } from '../../src/application/ports/user-repository.port';
import { CryptographyServicePort } from '../../src/application/ports/cryptography-service.port';
import { EventBusPort } from '../../src/application/ports/event-bus.port';
import { UserDomainService } from '../../src/domain/services/user-domain.service';
import { User, UserStatus } from '../../src/domain/aggregates/user.aggregate';
import { RegisterUserDto } from '../../src/application/dto/user.dto';

// Mock the User.createWithHashedPassword method
jest.mock('../../src/domain/aggregates/user.aggregate');

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;
  let mockCryptographyService: jest.Mocked<CryptographyServicePort>;
  let mockEventBus: jest.Mocked<EventBusPort>;
  let mockUserDomainService: jest.Mocked<UserDomainService>;
  let mockUser: jest.Mocked<User>;

  beforeEach(() => {
    // Create mocks
    mockUserRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepositoryPort>;

    mockCryptographyService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    } as jest.Mocked<CryptographyServicePort>;

    mockEventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    } as jest.Mocked<EventBusPort>;

    mockUserDomainService = {
      validateUniqueEmail: jest.fn(),
    } as jest.Mocked<UserDomainService>;

    // Create mock user instance
    mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      status: UserStatus.ACTIVE,
      emailVerified: false,
      lastLoginAt: undefined,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      getUncommittedEvents: jest.fn(),
      clearEvents: jest.fn(),
    } as any;

    // Mock User.createWithHashedPassword static method
    (User.createWithHashedPassword as jest.Mock) = jest.fn().mockResolvedValue(mockUser);

    useCase = new RegisterUserUseCase(
      mockUserRepository,
      mockCryptographyService,
      mockEventBus,
      mockUserDomainService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validRegisterDto: RegisterUserDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'SecurePass123',
    };

    it('should successfully register a new user', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const domainEvents = [{ type: 'UserRegistered' }];

      mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
      mockCryptographyService.hashPassword.mockResolvedValue(hashedPassword);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockUser.getUncommittedEvents.mockReturnValue(domainEvents as any);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(validRegisterDto);

      // Assert
      expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(validRegisterDto.email);
      expect(mockCryptographyService.hashPassword).toHaveBeenCalledWith(validRegisterDto.password);
      expect(User.createWithHashedPassword).toHaveBeenCalledWith(
        validRegisterDto.email,
        validRegisterDto.name,
        hashedPassword
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(domainEvents);
      expect(mockUser.clearEvents).toHaveBeenCalled();

      expect(result).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        status: UserStatus.ACTIVE,
        emailVerified: false,
        lastLoginAt: undefined,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      });
    });

    it('should throw error when email is not unique', async () => {
      // Arrange
      const emailError = new Error('Email ya está en uso');
      mockUserDomainService.validateUniqueEmail.mockRejectedValue(emailError);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow('Email ya está en uso');

      expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(validRegisterDto.email);
      expect(mockCryptographyService.hashPassword).not.toHaveBeenCalled();
      expect(User.createWithHashedPassword).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when password hashing fails', async () => {
      // Arrange
      const hashingError = new Error('Hashing failed');
      mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
      mockCryptographyService.hashPassword.mockRejectedValue(hashingError);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow('Hashing failed');

      expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalled();
      expect(mockCryptographyService.hashPassword).toHaveBeenCalledWith(validRegisterDto.password);
      expect(User.createWithHashedPassword).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when user creation fails', async () => {
      // Arrange
      const creationError = new Error('User creation failed');
      mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
      mockCryptographyService.hashPassword.mockResolvedValue('hashedPassword');
      (User.createWithHashedPassword as jest.Mock).mockRejectedValue(creationError);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow('User creation failed');

      expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalled();
      expect(mockCryptographyService.hashPassword).toHaveBeenCalled();
      expect(User.createWithHashedPassword).toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when user saving fails', async () => {
      // Arrange
      const savingError = new Error('Database save failed');
      mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
      mockCryptographyService.hashPassword.mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockRejectedValue(savingError);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow('Database save failed');

      expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalled();
      expect(mockCryptographyService.hashPassword).toHaveBeenCalled();
      expect(User.createWithHashedPassword).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should throw error when event publishing fails', async () => {
      // Arrange
      const eventError = new Error('Event publishing failed');
      const domainEvents = [{ type: 'UserRegistered' }];

      mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
      mockCryptographyService.hashPassword.mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockUser.getUncommittedEvents.mockReturnValue(domainEvents as any);
      mockEventBus.publishAll.mockRejectedValue(eventError);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow('Event publishing failed');

      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(domainEvents);
      expect(mockUser.clearEvents).not.toHaveBeenCalled();
    });

    it('should handle empty domain events', async () => {
      // Arrange
      mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
      mockCryptographyService.hashPassword.mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockUser.getUncommittedEvents.mockReturnValue([]);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(validRegisterDto);

      // Assert
      expect(mockEventBus.publishAll).toHaveBeenCalledWith([]);
      expect(mockUser.clearEvents).toHaveBeenCalled();
      expect(result.id).toBe('test-user-id');
    });

    it('should log errors correctly', async () => {
      // Arrange
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const testError = new Error('Test error');
      mockUserDomainService.validateUniqueEmail.mockRejectedValue(testError);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow('Test error');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error en RegisterUserUseCase: Test error');
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('mapToDto', () => {
    it('should correctly map user to response DTO', async () => {
      // Arrange
      const mockUserWithData = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date('2023-01-02'),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-03'),
        getUncommittedEvents: jest.fn().mockReturnValue([]),
        clearEvents: jest.fn(),
      } as any;

      mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
      mockCryptographyService.hashPassword.mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockResolvedValue(mockUserWithData);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(validRegisterDto);

      // Assert
      expect(result).toEqual({
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date('2023-01-02'),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-03'),
      });
    });
  });
});
