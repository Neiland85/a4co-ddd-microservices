// Archivo de configuración global para pruebas con Jest

// Import reflect-metadata for decorators
require('reflect-metadata');

// Configuración de entorno
process.env.NODE_ENV = 'test';

// Configuración de timeouts para tests
jest.setTimeout(10000);

// Limpieza después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});
