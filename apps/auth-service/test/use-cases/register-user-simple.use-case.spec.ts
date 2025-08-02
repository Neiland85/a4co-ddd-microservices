import { UserDomainService } from '../../src/domain/services/user-domain.service';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { RegisterUserDto } from '../../src/application/dto/user.dto';
import { createRegisterUserDto, createUser } from '../factories';

// Mock de bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock de uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-1234'),
}));

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let userDomainService: jest.Mocked<UserDomainService>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn().mockResolvedValue(createUser()),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      existsByEmail: jest.fn(),
      findActiveUsers: jest.fn(),
      findPaginated: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userDomainService = {
      isEmailUnique: jest.fn(),
      validateUniqueEmail: jest.fn(),
      canUserPerformAction: jest.fn(),
      userRepository: jest.fn(), // Agregar propiedad faltante
    } as unknown as jest.Mocked<UserDomainService>;

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

    useCase = new RegisterUserUseCase(
      userRepository,
      mockCryptographyService,
      mockEventBus,
      userDomainService
    );
  });

  it('should register a user successfully', async () => {
    const registerDto: RegisterUserDto = createRegisterUserDto();
    // Ajustar el objeto user para cumplir con el tipo User
    const user = createUser({
      id: 'test-uuid-1234',
      email: registerDto.email,
      name: registerDto.name,
      hashedPassword: 'hashed-password',
    });

    userDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    // Ajustar userRepository.save para usar el objeto user
    userRepository.save.mockResolvedValue(user);

    const result = await useCase.execute(registerDto);

    expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
    expect(userRepository.save).toHaveBeenCalledWith(expect.any(Object));
    expect(result.email).toBe(registerDto.email);
  });

  it('should throw error if email already exists', async () => {
    // Arrange
    const registerDto = new RegisterUserDto();
    registerDto.email = process.env.TEST_EMAIL || 'test@example.com';
    registerDto.name = 'Test User';
    registerDto.password = process.env.TEST_PASSWORD || 'Password123';

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
    registerDto.email = process.env.TEST_EMAIL || 'test@example.com';
    registerDto.name = 'Test User';
    registerDto.password = process.env.TEST_PASSWORD || 'Password123';

    userDomainService.validateUniqueEmail.mockResolvedValue(undefined);

    // Mock error en save
    userRepository.save.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(useCase.execute(registerDto)).rejects.toThrow(
      'Database error'
    );
    expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
  });
});
