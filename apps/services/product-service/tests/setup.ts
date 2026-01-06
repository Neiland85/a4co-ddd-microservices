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

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
