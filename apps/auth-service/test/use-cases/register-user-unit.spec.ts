/**
 * Test unitario independiente para RegisterUserUseCase
 * Este test no depende de NestJS y puede ejecutarse directamente con Jest
 */

import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { UserDomainService } from '../../src/domain/services/user-domain.service';
import { RegisterUserDto } from '../../src/application/dto/user.dto';

describe('RegisterUserUseCase - Unit Test', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: any;
  let mockUserDomainService: any;

  beforeEach(() => {
    // Mock simple del repositorio
    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      existsByEmail: jest.fn(),
    };

    const mockCryptographyService = {
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

    // Crear instancia del use case con mocks simples
    useCase = new RegisterUserUseCase(
      mockUserRepository, // Mock para UserRepositoryPort
      mockCryptographyService, // Mock para CryptographyServicePort
      mockEventBus, // Mock ajustado para cumplir con EventBusPort
      mockUserDomainService // Sustituir el mock innecesario
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
    const registerDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123',
    };

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);

    // Mock User.create - esto necesitará ser implementado diferente
    // Por ahora vamos a mockear el comportamiento completo
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

    // Para este test, vamos a hacer un mock más simple
    // simulando que el User.create funciona
    jest.doMock('../../src/domain/aggregates/user.aggregate', () => ({
      User: {
        createWithHashedPassword: jest.fn().mockResolvedValue(mockUser),
      },
    }));

    // Act - intentar ejecutar y capturar cualquier error
    await useCase.execute(registerDto as any);
    // Assert - verificar que se llamó la validación
    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
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
      'El email ya está registrado'
    );

    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should validate unique email successfully', async () => {
    // Arrange
    const registerDto = {
      email: 'unique@example.com',
      name: 'Unique User',
      password: 'Password123',
    };

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);

    // Act
    await useCase.execute(registerDto as any);

    // Assert
    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
  });
});

/**
 * Test de integración con mocks más completos
 */
describe('RegisterUserUseCase - Integration Test', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: any;
  let mockUserDomainService: any;

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

    mockUserDomainService = new UserDomainService(mockUserRepository);

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

    // Mock de User.create
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
          getUncommittedEvents: jest
            .fn()
            .mockReturnValue(['UserRegisteredEvent']),
          clearEvents: jest.fn(),
        }),
      },
    }));

    // Crear instancia del use case
    useCase = new RegisterUserUseCase(
      mockUserRepository, // Mock para UserRepositoryPort
      mockCryptographyService, // Mock para CryptographyServicePort
      mockEventBus, // Mock para EventBusPort
      mockUserDomainService // Mock para UserDomainService
    );
  });

  it('should handle successful user registration flow', async () => {
    // Arrange
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

    // Act
    const result = await useCase.execute(registerDto as any);

    // Assert
    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result.email).toBe(registerDto.email);
    expect(result.name).toBe(registerDto.name);
  });

  it('should handle repository save errors', async () => {
    // Arrange
    const registerDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123',
    };

    mockUserDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    mockUserRepository.save.mockRejectedValue(
      new Error('Database connection failed')
    );

    // Act & Assert
    await expect(useCase.execute(registerDto as any)).rejects.toThrow(
      'Database connection failed'
    );

    // Verificar que se intentó la validación antes del error de BD
    expect(mockUserDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
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
      validateUniqueEmail: jest.fn(),
    };

    mockEventBus = {
      publishAll: jest.fn(),
    };

    mockCryptographyService = {
      hashPassword: jest.fn().mockResolvedValue('hashed-password'),
    };

    useCase = new RegisterUserUseCase(
      mockUserRepository,
      mockUserDomainService,
      mockEventBus,
      mockCryptographyService
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

    expect(mockEventBus.publishAll).toHaveBeenCalledWith([
      'UserRegisteredEvent',
    ]);
    expect(mockUser.clearEvents).toHaveBeenCalled();
  });

  it('should not publish events if user registration fails', async () => {
    const registerDto = new RegisterUserDto();
    registerDto.email = 'existing@example.com';
    registerDto.name = 'Existing User';
    registerDto.password = 'Password123';

    mockUserDomainService.validateUniqueEmail.mockRejectedValue(
      new Error('El email ya está registrado')
    );

    await expect(useCase.execute(registerDto)).rejects.toThrow(
      'El email ya está registrado'
    );

    expect(mockEventBus.publishAll).not.toHaveBeenCalled();
  });
});
