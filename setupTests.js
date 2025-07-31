// Archivo de configuración global para pruebas con Jest

// Configuración de Jest para inicializar pruebas
import '@testing-library/jest-dom';

// Mock de funciones globales si es necesario
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Configuración de entorno
process.env.NODE_ENV = 'test';

// Limpieza después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});
