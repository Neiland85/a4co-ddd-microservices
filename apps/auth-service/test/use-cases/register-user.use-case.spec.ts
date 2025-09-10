import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { UserDomainService } from '../../src/domain/services/user-domain.service';
import { UserStatus } from '../../src/domain/aggregates/user.aggregate';
import { RegisterUserDto } from '../../src/application/dto/user.dto';
import { createRegisterUserDto, createUser } from '../factories';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let userDomainService: jest.Mocked<UserDomainService>;

  beforeEach(async () => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
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
      userRepository: jest.fn(),
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

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should register a user successfully', async () => {
    // Arrange
    const registerDto = createRegisterUserDto();
    const user = createUser();

    userDomainService.validateUniqueEmail.mockResolvedValue(undefined);
    userRepository.save.mockResolvedValue(user);

    // Act
    const result = await useCase.execute(registerDto);

    // Assert
    expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(registerDto.email);
    expect(userRepository.save).toHaveBeenCalledWith(expect.any(Object));
    expect(result.email).toBe(registerDto.email);
    expect(result.name).toBe(registerDto.name);
    expect(result.id).toBeDefined();
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
    await expect(useCase.execute(registerDto)).rejects.toThrow('El email ya está registrado');
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
