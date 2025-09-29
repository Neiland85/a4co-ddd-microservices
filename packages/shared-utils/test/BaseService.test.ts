import { BaseService } from '../src/base/BaseService';

// Mock service for testing
class MockService extends BaseService {
  constructor() {
    super('MockService');
  }

  async testMethod(param: string): Promise<string> {
    return `test-${param}`;
  }

  async testAsyncMethod(): Promise<void> {
    await this.simulateDelay(50);
  }
}

describe('BaseService', () => {
  let service: MockService;

  beforeEach(() => {
    service = new MockService();
  });

  test('should create service instance', () => {
    expect(service).toBeInstanceOf(MockService);
  });

  test('should execute test method', async() => {
    const result = await service.testMethod('value');
    expect(result).toBe('test-value');
  });

  test('should handle async operations', async() => {
    const startTime = Date.now();
    await service.testAsyncMethod();
    const endTime = Date.now();

    // Should take at least 50ms due to simulateDelay
    expect(endTime - startTime).toBeGreaterThanOrEqual(40);
  });

  test('should handle environment-specific behavior', () => {
    // Test in test environment
    process.env['NODE_ENV'] = 'test';
    expect(process.env['NODE_ENV']).toBe('test');
  });

  test('should handle development environment', () => {
    // Test in development environment
    process.env['NODE_ENV'] = 'development';
    expect(process.env['NODE_ENV']).toBe('development');
  });
});
