import { BaseController } from '../src/base/BaseController';
import { BaseService } from '../src/base/BaseService';

// Mock service for testing
class MockService extends BaseService {
  constructor() {
    super('MockService');
  }

  async testMethod(param: string): Promise<string> {
    return `test-${param}`;
  }
}

// Mock controller for testing
class MockController extends BaseController<MockService> {
  constructor() {
    super(MockService);
  }

  async handleRequest(req: any): Promise<string> {
    const validated = this.validateRequest<{ param: string }>(req, ['param']);
    return this.service.testMethod(validated.param);
  }
}

describe('BaseController', () => {
  let controller: MockController;

  beforeEach(() => {
    controller = new MockController();
  });

  test('should validate request correctly', async () => {
    const req = { param: 'test-value' };
    const result = await controller.handleRequest(req);
    expect(result).toBe('test-test-value');
  });

  test('should throw error for invalid request', async () => {
    const req = { wrongParam: 'test-value' };
    await expect(controller.handleRequest(req)).rejects.toThrow();
  });
});
