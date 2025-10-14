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

<<<<<<< HEAD
  test('should validate request correctly', async() => {
=======
  test('should validate request correctly', async () => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const req = { param: 'test-value' };
    const result = await controller.handleRequest(req);
    expect(result).toBe('test-test-value');
  });

<<<<<<< HEAD
  test('should throw error for invalid request', async() => {
=======
  test('should throw error for invalid request', async () => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const req = { wrongParam: 'test-value' };
    await expect(controller.handleRequest(req)).rejects.toThrow();
  });
});
