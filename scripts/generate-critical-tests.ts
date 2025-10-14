#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

interface TestTemplate {
  service: string;
  testFile: string;
  content: string;
}

// Generar tests para los servicios refactorizados con BaseService
const generateServiceTests = (): TestTemplate[] => {
  const services = ['order', 'product', 'user', 'inventory'];
  const serviceImportPaths: { [key: string]: string } = {
    order: './service',
    product: '../service',
    user: '../service',
    inventory: '../service',
  };

  return services.map(service => {
    const serviceName = service.charAt(0).toUpperCase() + service.slice(1);
    const content = `import { ${serviceName}Service } from '${serviceImportPaths[service]}';

describe('${serviceName}Service', () => {
  let service: ${serviceName}Service;

  beforeEach(() => {
    service = new ${serviceName}Service();
    // Mock console.log para evitar output en tests
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with correct service name', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(${serviceName}Service);
    });
  });

  ${generateServiceSpecificTests(service, serviceName)}

  describe('error handling', () => {
    it('should handle errors gracefully', () => {
      const invalidData = null as any;
      
      expect(() => {
        ${generateErrorTestCase(service)}
      }).toThrow();
    });
  });

  describe('logging', () => {
    it('should log operations', () => {
      ${generateLoggingTestCase(service, serviceName)}
      
      expect(console.log).toHaveBeenCalled();
    });
  });
});`;

    return {
      service: `${service}-service`,
      testFile: `apps/${service}-service/${service === 'order' ? 'service' : 'tests/service'}.test.ts`,
      content,
    };
  });
};

const generateServiceSpecificTests = (service: string, serviceName: string): string => {
  const testCases: Record<string, string> = {
    order: `describe('createOrder', () => {
    it('should create an order successfully', () => {
      const result = service.createOrder('ORD-001', ['item1', 'item2']);
      expect(result).toContain('Order created successfully');
      expect(result).toContain('ORD-001');
    });

    it('should validate order ID', () => {
      expect(() => service.createOrder('', ['item1'])).toThrow('Invalid order ID');
    });

    it('should validate items array', () => {
      expect(() => service.createOrder('ORD-001', [])).toThrow('Order must contain at least one item');
    });
  });

  describe('getOrder', () => {
    it('should retrieve an order successfully', () => {
      const result = service.getOrder('ORD-001');
      expect(result).toContain('Order retrieved successfully');
      expect(result).toContain('ORD-001');
    });

    it('should validate order ID', () => {
      expect(() => service.getOrder('')).toThrow('Invalid order ID');
    });
  })`,

    product: `describe('addProduct', () => {
    it('should add a product successfully', () => {
      const result = service.addProduct('Product A', 29.99);
      expect(result).toContain('Product created successfully');
      expect(result).toContain('Product A');
      expect(result).toContain('29.99');
    });

    it('should validate product name', () => {
      expect(() => service.addProduct('', 29.99)).toThrow('name is required');
    });

    it('should validate product price', () => {
      expect(() => service.addProduct('Product A', null as any)).toThrow('price is required');
    });
  });

  describe('getProduct', () => {
    it('should retrieve a product successfully', () => {
      const result = service.getProduct('Product A');
      expect(result).toContain('Product retrieved successfully');
      expect(result).toContain('Product A');
    });

    it('should validate product name', () => {
      expect(() => service.getProduct('')).toThrow('Invalid name');
    });
  })`,

    user: `describe('createUser', () => {
    it('should create a user successfully', () => {
      const result = service.createUser('john_doe', 'john@example.com');
      expect(result).toContain('User created successfully');
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
      expect(result).toContain('User retrieved successfully');
      expect(result).toContain('john_doe');
    });

    it('should validate username', () => {
      expect(() => service.getUser('')).toThrow('Invalid username');
    });
  })`,

    inventory: `describe('updateStock', () => {
    it('should update stock successfully', () => {
      const result = service.updateStock('PROD-001', 100);
      expect(result).toContain('Inventory updated successfully');
      expect(result).toContain('PROD-001');
      expect(result).toContain('100');
    });

    it('should validate product ID', () => {
      expect(() => service.updateStock('', 100)).toThrow('Invalid inventory ID');
    });

    it('should validate quantity', () => {
      expect(() => service.updateStock('PROD-001', null as any)).toThrow('quantity is required');
    });
  });

  describe('getStock', () => {
    it('should retrieve stock successfully', () => {
      const result = service.getStock('PROD-001');
      expect(result).toContain('Inventory retrieved successfully');
      expect(result).toContain('PROD-001');
    });

    it('should validate product ID', () => {
      expect(() => service.getStock('')).toThrow('Invalid productId');
    });
  })`,
  };

  return testCases[service] || '';
};

const generateErrorTestCase = (service: string): string => {
  const cases: Record<string, string> = {
<<<<<<< HEAD
    order: 'service.createOrder(invalidData, invalidData)',
    product: 'service.addProduct(invalidData, invalidData)',
    user: 'service.createUser(invalidData, invalidData)',
    inventory: 'service.updateStock(invalidData, invalidData)',
=======
    order: `service.createOrder(invalidData, invalidData)`,
    product: `service.addProduct(invalidData, invalidData)`,
    user: `service.createUser(invalidData, invalidData)`,
    inventory: `service.updateStock(invalidData, invalidData)`,
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  };

  return cases[service] || '';
};

const generateLoggingTestCase = (service: string, serviceName: string): string => {
  const cases: Record<string, string> = {
<<<<<<< HEAD
    order: 'service.createOrder(\'ORD-001\', [\'item1\']);',
    product: 'service.addProduct(\'Product A\', 29.99);',
    user: 'service.createUser(\'john_doe\', \'john@example.com\');',
    inventory: 'service.updateStock(\'PROD-001\', 100);',
=======
    order: `service.createOrder('ORD-001', ['item1']);`,
    product: `service.addProduct('Product A', 29.99);`,
    user: `service.createUser('john_doe', 'john@example.com');`,
    inventory: `service.updateStock('PROD-001', 100);`,
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  };

  return cases[service] || '';
};

// Generar tests para BaseController y BaseService
const generateBaseClassTests = (): TestTemplate[] => {
  return [
    {
      service: 'shared-utils',
      testFile: 'packages/shared-utils/src/base/BaseController.test.ts',
      content: `import { BaseController } from './BaseController';
import { BaseService } from './BaseService';

// Mock service para testing
class MockService extends BaseService {
  constructor() {
    super('MockService');
  }
  
  testMethod(param: string): string {
    return \`Result: \${param}\`;
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
});`,
    },
    {
      service: 'shared-utils',
      testFile: 'packages/shared-utils/src/base/BaseService.test.ts',
      content: `import { BaseService } from './BaseService';

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
});`,
    },
  ];
};

// Función principal
const generateTests = async() => {
  console.log('🧪 Generando tests para áreas críticas del dominio...\n');

  const allTests = [...generateServiceTests(), ...generateBaseClassTests()];

  let generatedCount = 0;

  for (const test of allTests) {
    const testPath = path.join(process.cwd(), test.testFile);
    const testDir = path.dirname(testPath);

    // Crear directorio si no existe
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Escribir archivo de test
    fs.writeFileSync(testPath, test.content);
    console.log(`✅ Generado: ${test.testFile}`);
    generatedCount++;
  }

  console.log(`\n📊 Total de tests generados: ${generatedCount}`);
  console.log('\n🎯 Próximos pasos:');
  console.log('1. Ejecutar: pnpm test:coverage');
  console.log('2. Verificar que la cobertura aumente significativamente');
  console.log('3. Ejecutar: pnpm sonar-scanner para actualizar métricas en SonarQube');
};

// Ejecutar
generateTests().catch(console.error);
