import { UserController } from './controller';
import { UserService } from './service';

// Mock the UserService
jest.mock('./service');

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new controller instance
    controller = new UserController();
    
    // Get the mocked service instance
    mockUserService = (controller as any).userService as jest.Mocked<UserService>;
  });

  describe('createUser', () => {
    it('should create a user with valid data', () => {
      // Arrange
      const request = { username: 'testUser', email: 'test@example.com' };
      const expectedResult = 'Usuario testUser creado con email test@example.com.';
      
      mockUserService.createUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.createUser(request);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith('testUser', 'test@example.com');
      expect(result).toBe(expectedResult);
    });

    it('should handle special characters in username', () => {
      // Arrange
      const request = { username: 'test-user_123', email: 'test@example.com' };
      const expectedResult = 'Usuario test-user_123 creado con email test@example.com.';
      
      mockUserService.createUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.createUser(request);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith('test-user_123', 'test@example.com');
      expect(result).toBe(expectedResult);
    });

    it('should handle special characters in email', () => {
      // Arrange
      const request = { username: 'testUser', email: 'test+tag@example.co.uk' };
      const expectedResult = 'Usuario testUser creado con email test+tag@example.co.uk.';
      
      mockUserService.createUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.createUser(request);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith('testUser', 'test+tag@example.co.uk');
      expect(result).toBe(expectedResult);
    });

    it('should handle empty username', () => {
      // Arrange
      const request = { username: '', email: 'test@example.com' };
      const expectedResult = 'Usuario  creado con email test@example.com.';
      
      mockUserService.createUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.createUser(request);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith('', 'test@example.com');
      expect(result).toBe(expectedResult);
    });

    it('should handle empty email', () => {
      // Arrange
      const request = { username: 'testUser', email: '' };
      const expectedResult = 'Usuario testUser creado con email .';
      
      mockUserService.createUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.createUser(request);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith('testUser', '');
      expect(result).toBe(expectedResult);
    });

    it('should propagate service errors', () => {
      // Arrange
      const request = { username: 'testUser', email: 'test@example.com' };
      const serviceError = new Error('Service error');
      
      mockUserService.createUser.mockImplementation(() => {
        throw serviceError;
      });

      // Act & Assert
      expect(() => controller.createUser(request)).toThrow('Service error');
      expect(mockUserService.createUser).toHaveBeenCalledWith('testUser', 'test@example.com');
    });

    it('should handle null/undefined in request', () => {
      // Arrange
      const request = { username: null as any, email: undefined as any };
      const expectedResult = 'Usuario null creado con email undefined.';
      
      mockUserService.createUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.createUser(request);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith(null, undefined);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getUser', () => {
    it('should get user information with valid username', () => {
      // Arrange
      const request = { username: 'testUser' };
      const expectedResult = 'Información del usuario testUser.';
      
      mockUserService.getUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.getUser(request);

      // Assert
      expect(mockUserService.getUser).toHaveBeenCalledWith('testUser');
      expect(result).toBe(expectedResult);
    });

    it('should handle special characters in username', () => {
      // Arrange
      const request = { username: 'test-user_123' };
      const expectedResult = 'Información del usuario test-user_123.';
      
      mockUserService.getUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.getUser(request);

      // Assert
      expect(mockUserService.getUser).toHaveBeenCalledWith('test-user_123');
      expect(result).toBe(expectedResult);
    });

    it('should handle unicode characters in username', () => {
      // Arrange
      const request = { username: 'José_María' };
      const expectedResult = 'Información del usuario José_María.';
      
      mockUserService.getUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.getUser(request);

      // Assert
      expect(mockUserService.getUser).toHaveBeenCalledWith('José_María');
      expect(result).toBe(expectedResult);
    });

    it('should handle empty username', () => {
      // Arrange
      const request = { username: '' };
      const expectedResult = 'Información del usuario .';
      
      mockUserService.getUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.getUser(request);

      // Assert
      expect(mockUserService.getUser).toHaveBeenCalledWith('');
      expect(result).toBe(expectedResult);
    });

    it('should handle very long username', () => {
      // Arrange
      const longUsername = 'a'.repeat(1000);
      const request = { username: longUsername };
      const expectedResult = `Información del usuario ${longUsername}.`;
      
      mockUserService.getUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.getUser(request);

      // Assert
      expect(mockUserService.getUser).toHaveBeenCalledWith(longUsername);
      expect(result).toBe(expectedResult);
    });

    it('should propagate service errors', () => {
      // Arrange
      const request = { username: 'testUser' };
      const serviceError = new Error('User not found');
      
      mockUserService.getUser.mockImplementation(() => {
        throw serviceError;
      });

      // Act & Assert
      expect(() => controller.getUser(request)).toThrow('User not found');
      expect(mockUserService.getUser).toHaveBeenCalledWith('testUser');
    });

    it('should handle null/undefined username', () => {
      // Arrange
      const request = { username: null as any };
      const expectedResult = 'Información del usuario null.';
      
      mockUserService.getUser.mockReturnValue(expectedResult);

      // Act
      const result = controller.getUser(request);

      // Assert
      expect(mockUserService.getUser).toHaveBeenCalledWith(null);
      expect(result).toBe(expectedResult);
    });
  });

  describe('Service Integration', () => {
    it('should call service methods the correct number of times', () => {
      // Arrange
      const createRequest = { username: 'user1', email: 'user1@example.com' };
      const getRequest = { username: 'user1' };
      
      mockUserService.createUser.mockReturnValue('Created');
      mockUserService.getUser.mockReturnValue('Retrieved');

      // Act
      controller.createUser(createRequest);
      controller.getUser(getRequest);
      controller.createUser(createRequest);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledTimes(2);
      expect(mockUserService.getUser).toHaveBeenCalledTimes(1);
    });

    it('should maintain independent service call parameters', () => {
      // Arrange
      const user1Create = { username: 'user1', email: 'user1@example.com' };
      const user2Create = { username: 'user2', email: 'user2@example.com' };
      const user1Get = { username: 'user1' };
      
      mockUserService.createUser.mockReturnValue('Created');
      mockUserService.getUser.mockReturnValue('Retrieved');

      // Act
      controller.createUser(user1Create);
      controller.createUser(user2Create);
      controller.getUser(user1Get);

      // Assert
      expect(mockUserService.createUser).toHaveBeenNthCalledWith(1, 'user1', 'user1@example.com');
      expect(mockUserService.createUser).toHaveBeenNthCalledWith(2, 'user2', 'user2@example.com');
      expect(mockUserService.getUser).toHaveBeenCalledWith('user1');
    });
  });

  describe('Error Handling', () => {
    it('should handle service throwing different types of errors', () => {
      // Arrange
      const request = { username: 'testUser', email: 'test@example.com' };
      
      // String error
      mockUserService.createUser.mockImplementation(() => {
        throw 'String error';
      });
      expect(() => controller.createUser(request)).toThrow('String error');

      // Error object
      mockUserService.createUser.mockImplementation(() => {
        throw new Error('Error object');
      });
      expect(() => controller.createUser(request)).toThrow('Error object');

      // Custom error
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }
      mockUserService.createUser.mockImplementation(() => {
        throw new CustomError('Custom error');
      });
      expect(() => controller.createUser(request)).toThrow('Custom error');
    });
  });

  describe('Performance and Memory', () => {
    it('should handle multiple rapid calls efficiently', () => {
      // Arrange
      mockUserService.createUser.mockReturnValue('Created');
      mockUserService.getUser.mockReturnValue('Retrieved');

      // Act - simulate rapid calls
      const startTime = Date.now();
      for (let i = 0; i < 1000; i++) {
        controller.createUser({ username: `user${i}`, email: `user${i}@example.com` });
        controller.getUser({ username: `user${i}` });
      }
      const endTime = Date.now();

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledTimes(1000);
      expect(mockUserService.getUser).toHaveBeenCalledTimes(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });
});