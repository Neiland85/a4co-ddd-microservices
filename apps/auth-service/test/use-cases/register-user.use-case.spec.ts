import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { UserDomainService } from '../../src/domain/services/user-domain.service';
import { User, UserStatus } from '../../src/domain/aggregates/user.aggregate';
import { RegisterUserDto } from '../../src/application/dto/user.dto';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let userDomainService: jest.Mocked<UserDomainService>;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
    };

    const mockUserDomainService = {
      isEmailUnique: jest.fn(),
      validateUniqueEmail: jest.fn(),
      canUserPerformAction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: UserDomainService,
          useValue: mockUserDomainService,
        },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    userRepository = module.get('UserRepository');
    userDomainService = module.get<UserDomainService>(UserDomainService);
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

    userDomainService.validateUniqueEmail.mockResolvedValue(undefined);

    // Mock del usuario creado usando el método reconstruct
    const mockUser = User.reconstruct(
      'test-id',
      'test@example.com',
      'Test User',
      'hashed-password',
      UserStatus.ACTIVE,
      false,
      undefined,
      new Date(),
      new Date()
    );

    userRepository.save.mockResolvedValue(mockUser);

    // Act
    const result = await useCase.execute(registerDto);

    // Assert
    expect(userDomainService.validateUniqueEmail).toHaveBeenCalledWith(
      registerDto.email
    );
    expect(userRepository.save).toHaveBeenCalled();
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
    await expect(useCase.execute(registerDto)).rejects.toThrow(
      'El email ya está registrado'
    );
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
