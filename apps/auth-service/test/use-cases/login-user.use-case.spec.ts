import { LoginUserUseCase, LoginResponse } from '../../src/application/use-cases/login-user.use-case';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { LoginUserDto } from '../../src/application/dto/user.dto';
import { User, UserStatus } from '../../src/domain/aggregates/user.aggregate';
import { JwtService } from '@nestjs/jwt';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockUser: jest.Mocked<User>;

  beforeEach(() => {
    // Create mocks
    mockUserRepository = {
      findByEmail: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    } as jest.Mocked<JwtService>;

    // Create mock user instance
    mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      status: UserStatus.ACTIVE,
      emailVerified: true,
      lastLoginAt: undefined,
      validatePassword: jest.fn(),
      recordLogin: jest.fn(),
    } as any;

    useCase = new LoginUserUseCase(mockUserRepository, mockJwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validLoginDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'SecurePass123',
    };

    it('should successfully login user with valid credentials', async () => {
      // Arrange
      const accessToken = 'access.token.here';
      const refreshToken = 'refresh.token.here';

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const expectedPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Act
      const result = await useCase.execute(validLoginDto);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(validLoginDto.password);
      expect(mockUser.recordLogin).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(1, expectedPayload, { expiresIn: '15m' });
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(2, expectedPayload, { expiresIn: '7d' });

      expect(result).toEqual({
        accessToken,
        refreshToken,
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
    });

    it('should throw error when user is not found', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(validLoginDto)).rejects.toThrow('Credenciales inválidas');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(mockUser.validatePassword).not.toHaveBeenCalled();
      expect(mockUser.recordLogin).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(validLoginDto)).rejects.toThrow('Credenciales inválidas');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(validLoginDto.password);
      expect(mockUser.recordLogin).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw error when user is inactive', async () => {
      // Arrange
      const inactiveUser = {
        ...mockUser,
        status: UserStatus.INACTIVE,
      } as any;

      mockUserRepository.findByEmail.mockResolvedValue(inactiveUser);
      mockUser.validatePassword.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(validLoginDto)).rejects.toThrow('Usuario inactivo');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(validLoginDto.password);
      expect(mockUser.recordLogin).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw error when user is suspended', async () => {
      // Arrange
      const suspendedUser = {
        ...mockUser,
        status: UserStatus.SUSPENDED,
      } as any;

      mockUserRepository.findByEmail.mockResolvedValue(suspendedUser);
      mockUser.validatePassword.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(validLoginDto)).rejects.toThrow('Usuario inactivo');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(validLoginDto.password);
      expect(mockUser.recordLogin).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle repository update failure', async () => {
      // Arrange
      const updateError = new Error('Database update failed');
      
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);
      mockUserRepository.update.mockRejectedValue(updateError);

      // Act & Assert
      await expect(useCase.execute(validLoginDto)).rejects.toThrow('Database update failed');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(validLoginDto.password);
      expect(mockUser.recordLogin).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should handle JWT signing failure', async () => {
      // Arrange
      const jwtError = new Error('JWT signing failed');
      
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockJwtService.sign.mockImplementation(() => {
        throw jwtError;
      });

      // Act & Assert
      await expect(useCase.execute(validLoginDto)).rejects.toThrow('JWT signing failed');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(validLoginDto.password);
      expect(mockUser.recordLogin).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should handle password validation failure', async () => {
      // Arrange
      const validationError = new Error('Password validation failed');
      
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockRejectedValue(validationError);

      // Act & Assert
      await expect(useCase.execute(validLoginDto)).rejects.toThrow('Password validation failed');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(validLoginDto.password);
      expect(mockUser.recordLogin).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should create correct JWT payload', async () => {
      // Arrange
      const userWithSpecialChars = {
        ...mockUser,
        id: 'user-123-456',
        email: 'user+test@example.co.uk',
        name: 'José María O\'Connor-Smith',
      } as any;

      mockUserRepository.findByEmail.mockResolvedValue(userWithSpecialChars);
      mockUser.validatePassword.mockResolvedValue(true);
      mockUserRepository.update.mockResolvedValue(userWithSpecialChars);
      mockJwtService.sign.mockReturnValue('token');

      const expectedPayload = {
        sub: 'user-123-456',
        email: 'user+test@example.co.uk',
        name: 'José María O\'Connor-Smith',
      };

      // Act
      await useCase.execute({
        email: 'user+test@example.co.uk',
        password: 'SecurePass123',
      });

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, { expiresIn: '15m' });
      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, { expiresIn: '7d' });
    });

    it('should return response with correct structure', async () => {
      // Arrange
      const accessToken = 'access.token.here';
      const refreshToken = 'refresh.token.here';

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      // Act
      const result = await useCase.execute(validLoginDto);

      // Assert
      expect(result).toHaveProperty('accessToken', accessToken);
      expect(result).toHaveProperty('refreshToken', refreshToken);
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id', 'test-user-id');
      expect(result.user).toHaveProperty('email', 'test@example.com');
      expect(result.user).toHaveProperty('name', 'Test User');
      
      // Ensure only these properties are in the user object
      expect(Object.keys(result.user)).toEqual(['id', 'email', 'name']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty email', async () => {
      // Arrange
      const emptyEmailDto: LoginUserDto = {
        email: '',
        password: 'SecurePass123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(emptyEmailDto)).rejects.toThrow('Credenciales inválidas');
      
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('');
    });

    it('should handle empty password', async () => {
      // Arrange
      const emptyPasswordDto: LoginUserDto = {
        email: 'test@example.com',
        password: '',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(emptyPasswordDto)).rejects.toThrow('Credenciales inválidas');
      
      expect(mockUser.validatePassword).toHaveBeenCalledWith('');
    });
  });
});