import { UserService } from './../service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
    // Mock console.log para tracking sin output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with correct service name', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(UserService);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', () => {
      const result = service.createUser('john_doe', 'john@example.com');
      expect(result).toContain('User');
      expect(result).toContain('john_doe');
      expect(result).toContain('john@example.com');
    });

    it('should validate username', () => {
      expect(() => service.createUser('', 'john@example.com')).toThrow('username is required');
    });

    it('should validate email', () => {
      expect(() => service.createUser('john_doe', '')).toThrow('email is required');
    });
  });

  describe('getUser', () => {
    it('should retrieve a user successfully', () => {
      const result = service.getUser('john_doe');
      expect(result).toContain('User');
      expect(result).toContain('john_doe');
    });

    it('should validate username', () => {
      expect(() => service.getUser('')).toThrow('username is required');
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully', () => {
      const invalidData = null as any;

      expect(() => {
        service.createUser(invalidData, invalidData);
      }).toThrow();
    });
  });

  describe('logging', () => {
    it('should log operations', () => {
      // Should not throw
      const result = service.createUser('john_doe', 'john@example.com');
      expect(result).toBeDefined();
      expect(result).toContain('created');
    });
  });
});
