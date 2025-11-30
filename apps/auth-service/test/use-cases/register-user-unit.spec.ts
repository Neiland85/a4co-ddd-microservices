/**
 * Test unitario independiente para RegisterUserUseCase
 * Este test no depende de NestJS y puede ejecutarse directamente con Jest
 */

import { RegisterUserDto } from '../../src/application/dto/user.dto';
import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { createRegisterUserDto, createUser } from '../factories';

describe('RegisterUserUseCase - Unit Test', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: any;
  let mockUserDomainService: any;
  let mockCryptographyService: any;
  let mockEventBus: any;

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

    mockEventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    };

    mockUserDomainService = {
      validateUniqueEmail: jest.fn().mockResolvedValue(undefined),
      isEmailUnique: jest.fn().mockResolvedValue(true),
      canUserPerformAction: jest.fn().mockResolvedValue(true),
    };

    // Crear instancia del use case con mocks simples
    useCase = new RegisterUserUseCase(
      mockUserRepository, // Mock para UserRepositoryPort
      mockCryptographyService, // Mock para CryptographyServicePort
      mockEventBus, // Mock ajustado para cumplir con EventBusPort
      mockUserDomainService, // Sustituir el mock innecesario
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create instance correctly', () => {
    expect(useCase).toBeDefined();
    expect(useCase.execute).toBeDefined();
  });

  it('should call validateUniqueEmail when executing', async () => {
    // Arrange
    const registerDto = createRegisterUserDto({
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123',
    });

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    mockCryptographyService.hashPassword.mockResolvedValue('hashed-password');

    const mockUser = createUser({
      email: 'test@example.com',
      name: 'Test User',
    });

    mockUserRepository.save.mockResolvedValue(mockUser);

    // Act - intentar ejecutar y capturar cualquier error
    const result = await useCase.execute(registerDto);

    // Assert - verificar que se llamó la validación
    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result.email).toBe(registerDto.email);
  });

  it('should throw error when email validation fails', async () => {
    // Arrange
    const registerDto = {
      email: 'existing@example.com',
      name: 'Test User',
      password: 'Password123',
    };

    const emailError = new Error('El email ya está registrado');
    mockUserDomainService.validateUniqueEmail.mockRejectedValue(emailError);

    // Act & Assert
    await expect(useCase.execute(registerDto as any)).rejects.toThrow(
      'El email ya está registrado',
    );

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should validate unique email successfully', async () => {
    // Arrange
    const registerDto = createRegisterUserDto({
      email: 'unique@example.com',
      name: 'Unique User',
      password: 'Password123',
    });

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    mockCryptographyService.hashPassword.mockResolvedValue('hashed-password');

    const mockUser = createUser({
      email: 'unique@example.com',
      name: 'Unique User',
    });

    mockUserRepository.save.mockResolvedValue(mockUser);

    // Act
    const result = await useCase.execute(registerDto);

    // Assert
    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    expect(result.email).toBe(registerDto.email);
  });

  it('should create a user successfully', async () => {
    const registerDto = createRegisterUserDto();
    const user = createUser();

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    mockCryptographyService.hashPassword.mockResolvedValue('hashed-password');
    mockUserRepository.save.mockResolvedValue(user);

    const result = await useCase.execute(registerDto);

    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result.email).toBe(registerDto.email);
  });

  it('should hash the password before saving the user', async () => {
    // Arrange
    const registerDto = createRegisterUserDto();
    const hashedPassword = 'hashed-password';

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    mockCryptographyService.hashPassword.mockResolvedValue(hashedPassword);

    const expectedUser = createUser({
      email: registerDto.email,
      name: registerDto.name ?? 'Test User',
      hashedPassword,
    });

    mockUserRepository.save.mockResolvedValue(expectedUser);

    // Act
    const result = await useCase.execute(registerDto);

    // Assert
    expect(mockCryptographyService.hashPassword).toHaveBeenCalledWith(registerDto.password);
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ hashedPassword }),
    );
    expect(result.email).toBe(registerDto.email);
  });

  it('should throw an error if hashPassword fails', async () => {
    // Arrange
    const registerDto = createRegisterUserDto();
    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    mockCryptographyService.hashPassword.mockRejectedValue(new Error('Hashing failed'));

    // Act & Assert
    await expect(useCase.execute(registerDto)).rejects.toThrow('Hashing failed');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error for invalid DTO fields', async () => {
    // Arrange
    const invalidDto = {
      email: 'invalid-email',
      name: '',
      password: '123',
    };

    // Act & Assert
    await expect(useCase.execute(invalidDto as any)).rejects.toThrow('Formato de email inválido');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should handle errors in findByEmail method', async () => {
    // Arrange
    const registerDto = createRegisterUserDto();
    mockUserDomainService.validateUniqueEmail.mockRejectedValue(new Error('Database error'));
    mockCryptographyService.hashPassword.mockResolvedValue('hashed-password');

    // Act & Assert
    await expect(useCase.execute(registerDto)).rejects.toThrow('Database error');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});

/**
 * Test de integración con mocks más completos
 */
describe('RegisterUserUseCase - Integration Test', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: any;
  let mockUserDomainService: any;
  let mockCryptographyService: any;
  let mockEventBus: any;

  beforeEach(() => {
    // Mocks más completos
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

    mockUserDomainService = {
      validateUniqueEmail: jest.fn().mockResolvedValue(undefined),
      isEmailUnique: jest.fn().mockResolvedValue(true),
      canUserPerformAction: jest.fn().mockResolvedValue(true),
    };

    mockEventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    };

    mockCryptographyService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
      validatePassword: jest.fn(),
      generateSecureToken: jest.fn(),
    };

    // Crear instancia del use case
    useCase = new RegisterUserUseCase(
      mockUserRepository, // Mock para UserRepositoryPort
      mockCryptographyService, // Mock para CryptographyServicePort
      mockEventBus, // Mock para EventBusPort
      mockUserDomainService, // Mock para UserDomainService
    );
  });

  it('should handle successful user registration flow', async () => {
    // Arrange
    const registerDto = createRegisterUserDto({
      email: 'newuser@example.com',
      name: 'New User',
      password: 'SecurePassword123',
    });

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    mockCryptographyService.hashPassword.mockResolvedValue('hashed-password');

    const mockUser = createUser({
      email: registerDto.email,
      name: registerDto.name || 'New User',
    });

    mockUserRepository.save.mockResolvedValue(mockUser);

    // Act
    const result = await useCase.execute(registerDto);

    // Assert
    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result.email).toBe(registerDto.email);
    expect(result.name).toBe(registerDto.name || 'New User');
  });

  it('should handle repository save errors', async () => {
    // Arrange
    const registerDto = createRegisterUserDto({
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123',
    });

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    mockCryptographyService.hashPassword.mockResolvedValue('hashed-password');
    mockUserRepository.save.mockRejectedValue(new Error('Database connection failed'));

    // Act & Assert
    await expect(useCase.execute(registerDto)).rejects.toThrow('Database connection failed');

    // Verificar que se intentó la validación antes del error de BD
    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
  });
});

/**
 * Test para la publicación de eventos de dominio
 */
describe('RegisterUserUseCase - Event Publication', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: any;
  let mockUserDomainService: any;
  let mockEventBus: any;
  let mockCryptographyService: any;

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
    };

    mockUserDomainService = {
      validateUniqueEmail: jest.fn().mockResolvedValue(undefined),
    };

    mockEventBus = {
      publishAll: jest.fn(),
    };

    mockCryptographyService = {
      hashPassword: jest.fn().mockResolvedValue('hashed-password'),
    };

    useCase = new RegisterUserUseCase(
      mockUserRepository,
      mockCryptographyService,
      mockEventBus,
      mockUserDomainService,
    );
  });

  it('should publish domain events after successful user registration', async () => {
    const registerDto = new RegisterUserDto();
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
    const registerDto = new RegisterUserDto();
    registerDto.email = 'existing@example.com';
    registerDto.name = 'Existing User';
    registerDto.password = 'Password123';

    mockUserDomainService.validateUniqueEmail.mockRejectedValue(
      new Error('El email ya está registrado'),
    );

    await expect(useCase.execute(registerDto)).rejects.toThrow('El email ya está registrado');

    expect(mockEventBus.publishAll).not.toHaveBeenCalled();
  });

  it('should publish events with correct data', async () => {
    // Arrange
    const registerDto = createRegisterUserDto();
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

    // Act
    await useCase.execute(registerDto);

    // Assert
    expect(mockEventBus.publishAll).toHaveBeenCalledWith(['UserRegisteredEvent']);
    expect(mockUser.getUncommittedEvents).toHaveBeenCalled();
  });
});
