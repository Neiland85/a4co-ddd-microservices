import { BaseController } from './BaseController';
import { BaseService } from './BaseService';

// Mock service para testing
class MockService extends BaseService {
  constructor() {
    super('MockService');
  }
  
  testMethod(param: string): string {
    return `Result: ${param}`;
  }
}

// Mock controller para testing
class MockController extends BaseController<MockService> {
  constructor() {
    super(MockService);
  }
  
  testEndpoint(req: { param: string }): string {
    const validated = this.validateRequest<{ param: string }>(req, ['param']);
    return this.service.testMethod(validated.param);
  }
}

describe('BaseController', () => {
  let controller: MockController;

  beforeEach(() => {
    controller = new MockController();
  });

  describe('validateRequest', () => {
    it('should validate request with required fields', () => {
      const req = { param: 'test' };
      const result = controller.testEndpoint(req);
      expect(result).toBe('Result: test');
    });

    it('should throw error for missing required fields', () => {
      const req = {};
      expect(() => controller.testEndpoint(req as any)).toThrow('Missing required field: param');
    });

    it('should throw error for invalid request format', () => {
      expect(() => controller.testEndpoint(null as any)).toThrow('Invalid request format');
    });
  });

  describe('handleError', () => {
    it('should handle Error instances', () => {
      const error = new Error('Test error');
      const result = (controller as any).handleError(error);
      expect(result).toEqual({ error: 'Test error', code: 400 });
    });

    it('should handle unknown errors', () => {
      const result = (controller as any).handleError('Unknown error');
      expect(result).toEqual({ error: 'Internal server error', code: 500 });
    });
  });

  describe('formatResponse', () => {
    it('should format response with default status', () => {
      const data = { result: 'test' };
      const response = (controller as any).formatResponse(data);
      expect(response.status).toBe('success');
      expect(response.data).toEqual(data);
      expect(response.timestamp).toBeDefined();
    });

    it('should format response with custom status', () => {
      const data = { result: 'test' };
      const response = (controller as any).formatResponse(data, 'error');
      expect(response.status).toBe('error');
    });
  });
});