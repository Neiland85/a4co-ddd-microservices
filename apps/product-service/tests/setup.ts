import 'reflect-metadata';

// Configuraciones globales para los tests
jest.setTimeout(30000);

// Mock global para console.log para evitar ruido en los tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Mock para servicios externos que podrían ser usados
jest.mock('../../packages/shared-utils/src/base', () => ({
  BaseService: jest.fn().mockImplementation(() => ({
    validateRequired: jest.fn((value, field) => {
      if (value === undefined || value === null || value === '') {
        throw new Error(`${field} is required`);
      }
      return value;
    }),
    validateId: jest.fn((value, field) => {
      if (value === undefined || value === null || value === '') {
        throw new Error(`${field} is required`);
      }
      return value;
    }),
    log: jest.fn(),
    createSuccessMessage: jest.fn((entity, action, details) => 
      `${entity} ${action} successfully ${details}`
    ),
    handleServiceError: jest.fn((error, method) => 
      `Error in ${method}: ${error.message}`
    ),
  })),
  BaseController: jest.fn().mockImplementation(() => ({
    validateRequest: jest.fn((req, fields) => {
      const validated: any = {};
      fields.forEach((field: string) => {
        if (req[field] === undefined || req[field] === null) {
          throw new Error(`${field} is required`);
        }
        validated[field] = req[field];
      });
      return validated;
    }),
    formatResponse: jest.fn((data) => ({ data })),
    handleError: jest.fn((error) => ({ error: error.message })),
    service: null,
  })),
}));

// Configuración global de Jest para evitar errores de inicialización
const mockNestJS = {
  Injectable: () => (target: any) => target,
  Inject: () => (target: any, propertyKey: string, parameterIndex: number) => {},
};

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
