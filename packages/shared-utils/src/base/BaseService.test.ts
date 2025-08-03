import { BaseService } from './BaseService';

class MockService extends BaseService {
  constructor() {
    super('MockService');
  }
}

describe('BaseService', () => {
  let service: MockService;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new MockService();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateId', () => {
    it('should validate non-empty ID', () => {
      const result = service['validateId']('ID-123', 'test');
      expect(result).toBe('ID-123');
    });

    it('should trim whitespace from ID', () => {
      const result = service['validateId']('  ID-123  ', 'test');
      expect(result).toBe('ID-123');
    });

    it('should throw error for empty ID', () => {
      expect(() => service['validateId']('', 'test')).toThrow('Invalid test ID');
    });

    it('should throw error for undefined ID', () => {
      expect(() => service['validateId'](undefined, 'test')).toThrow('Invalid test ID');
    });
  });

  describe('validateRequired', () => {
    it('should return value if not null or undefined', () => {
      expect(service['validateRequired']('value', 'field')).toBe('value');
      expect(service['validateRequired'](0, 'field')).toBe(0);
      expect(service['validateRequired'](false, 'field')).toBe(false);
    });

    it('should throw error for null value', () => {
      expect(() => service['validateRequired'](null, 'field')).toThrow('field is required');
    });

    it('should throw error for undefined value', () => {
      expect(() => service['validateRequired'](undefined, 'field')).toThrow('field is required');
    });
  });

  describe('log', () => {
    it('should log operation without data', () => {
      service['log']('Test operation');
      expect(consoleLogSpy).toHaveBeenCalledWith('[MockService] Test operation', '');
    });

    it('should log operation with data', () => {
      const data = { id: 123 };
      service['log']('Test operation', data);
      expect(consoleLogSpy).toHaveBeenCalledWith('[MockService] Test operation', JSON.stringify(data));
    });
  });

  describe('createSuccessMessage', () => {
    it('should create success message without details', () => {
      const result = service['createSuccessMessage']('User', 'created');
      expect(result).toBe('User created successfully.');
    });

    it('should create success message with details', () => {
      const result = service['createSuccessMessage']('User', 'created', 'john_doe');
      expect(result).toBe('User created successfully: john_doe');
    });
  });

  describe('handleServiceError', () => {
    it('should handle Error instance', () => {
      const error = new Error('Test error');
      expect(() => service['handleServiceError'](error, 'testOperation'))
        .toThrow('MockService - testOperation failed: Test error');
      expect(consoleLogSpy).toHaveBeenCalledWith('[MockService] Error in testOperation: Test error');
    });

    it('should handle unknown error', () => {
      expect(() => service['handleServiceError']('Unknown', 'testOperation'))
        .toThrow('MockService - testOperation failed: Unknown error');
    });
  });

  describe('simulateDelay', () => {
    it('should delay in development environment', async () => {
      process.env.NODE_ENV = 'development';
      const start = Date.now();
      await service['simulateDelay'](50);
      const duration = Date.now() - start;
      expect(duration).toBeGreaterThanOrEqual(45); // Allow some margin
    });

    it('should not delay in production environment', async () => {
      process.env.NODE_ENV = 'production';
      const start = Date.now();
      await service['simulateDelay'](100);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(10);
    });
  });
});