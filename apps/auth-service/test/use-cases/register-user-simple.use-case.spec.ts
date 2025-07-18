import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { UserDomainService } from '../../src/domain/services/user-domain.service';
import { User, UserStatus } from '../../src/domain/aggregates/user.aggregate';
import { RegisterUserDto } from '../../src/application/dto/user.dto';

// Mock de bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock de uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-1234'),
}));

// Mock del User.create method
jest.mock('../../src/domain/aggregates/user.aggregate', () => ({
  User: {
    create: jest.fn(),
    reconstruct: jest.fn(),
  },
  UserStatus: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
  },
}));

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let userDomainService: jest.Mocked<UserDomainService>;

  beforeEach(() => {
    // Mock del repositorio
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
    } as any;

    // Mock del servicio de dominio
    userDomainService = {
      isEmailUnique: jest.fn(),
      validateUniqueEmail: jest.fn(),
      canUserPerformAction: jest.fn(),
    } as any;

    // Crear la instancia del use case
    useCase = new RegisterUserUseCase(userRepository, userDomainService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should register a new user successfully', async () => {
    // Arrange
    const registerDto = new RegisterUserDto();
    registerDto.email = 'test@example.com';
    registerDto.name = 'Test User';
    registerDto.password = 'Password123';

    // Mock para validación de email único
    userDomainService.validateUniqueEmail.mockResolvedValue(undefined);

    // Mock del usuario creado
    const mockUser = {
      id: 'test-uuid-1234',
      email: 'test@example.com',
      name: 'Test User',
      status: UserStatus.ACTIVE,
      emailVerified: false,
      lastLoginAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      hashedPassword: 'hashed-password',
    };

    // Mock del User.create
    const MockedUser = User as jest.Mocked<typeof User>;
    MockedUser.create.mockResolvedValue(mockUser as any);

    // Mock del save del repository
    userRepository.save.mockResolvedValue(mockUser as any);

    // Act
    const result = await useCase.execute(registerDto);

    // Assert
    expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
    expect(MockedUser.create).toHaveBeenCalledWith(
      registerDto.email,
      registerDto.name,
      registerDto.password
    );
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result.email).toBe(registerDto.email);
    expect(result.name).toBe(registerDto.name);
    expect(result.id).toBe('test-uuid-1234');
    expect(result.status).toBe(UserStatus.ACTIVE);
    expect(result.emailVerified).toBe(false);
  });

  it('should throw error if email already exists', async () => {
    // Arrange
    const registerDto = new RegisterUserDto();
    registerDto.email = 'existing@example.com';
    registerDto.name = 'Test User';
    registerDto.password = 'Password123';

    userDomainService.validateUniqueEmail.mockRejectedValue(
      new Error('El email ya está registrado')
    );

    // Act & Assert
    await expect(useCase.execute(registerDto)).rejects.toThrow(
      'El email ya está registrado'
    );
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should handle repository save errors', async () => {
    // Arrange
    const registerDto = new RegisterUserDto();
    registerDto.email = 'test@example.com';
    registerDto.name = 'Test User';
    registerDto.password = 'Password123';

    userDomainService.validateUniqueEmail.mockResolvedValue(undefined);

    const mockUser = {
      id: 'test-uuid-1234',
      email: 'test@example.com',
      name: 'Test User',
      status: UserStatus.ACTIVE,
      emailVerified: false,
    };

    const MockedUser = User as jest.Mocked<typeof User>;
    MockedUser.create.mockResolvedValue(mockUser as any);

    // Mock error en save
    userRepository.save.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(useCase.execute(registerDto)).rejects.toThrow(
      'Database error'
    );
    expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
    expect(MockedUser.create).toHaveBeenCalled();
  });
});
