import 'reflect-metadata';

// Configuraciones globales para los tests
jest.setTimeout(30000);

// Mock básico para bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock básico para uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-1234'),
}));

// Configuración global de NestJS Testing para evitar errores de inicialización
const mockNestJS = {
  Injectable: () => (target: any) => target,
  Inject: () => (target: any, propertyKey: string, parameterIndex: number) => {},
};
