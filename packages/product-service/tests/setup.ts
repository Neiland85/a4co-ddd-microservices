// Configuración global para tests
import { jest } from '@jest/globals';

// Mock de console.log para tests más limpios
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Configuración de timeouts
jest.setTimeout(10000);

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
}); 