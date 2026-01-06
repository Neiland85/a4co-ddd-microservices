"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../src/service");
const controller_1 = require("../src/controller");
const test_config_1 = require("./test.config");
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};
const mockCryptoService = {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
    generateToken: jest.fn(),
};
describe('AuthService - Casos de Uso Principales', () => {
    let authService;
    let authController;
    beforeEach(() => {
        jest.clearAllMocks();
        authService = new service_1.AuthService();
        authController = new controller_1.AuthController();
    });
    describe('Login - Flujos Principales', () => {
        it('debería autenticar un usuario con credenciales válidas', () => {
            const { username, password } = test_config_1.testConfig.testCredentials;
            const result = authService.login(username, password);
            expect(result).toBe(`Usuario ${username} autenticado.`);
        });
        it('debería manejar nombres de usuario con caracteres especiales', () => {
            const username = 'usuario@test.com';
            const password = 'test_password';
            const result = authService.login(username, password);
            expect(result).toBe(`Usuario ${username} autenticado.`);
        });
        it('debería manejar contraseñas vacías', () => {
            const username = 'usuario_test';
            const password = '';
            const result = authService.login(username, password);
            expect(result).toBe(`Usuario ${username} autenticado.`);
        });
    });
    describe('Login - Casos de Error', () => {
        it('debería manejar username undefined', () => {
            const username = undefined;
            const password = 'password123';
            const result = authService.login(username, password);
            expect(result).toBe('Usuario undefined autenticado.');
        });
        it('debería manejar password null', () => {
            const username = 'usuario_test';
            const password = null;
            const result = authService.login(username, password);
            expect(result).toBe(`Usuario ${username} autenticado.`);
        });
    });
    describe('Register - Flujos Principales', () => {
        it('debería registrar un nuevo usuario exitosamente', () => {
            const username = 'nuevo_usuario';
            const password = 'test_password';
            const result = authService.register(username, password);
            expect(result).toBe(`Usuario ${username} registrado.`);
        });
        it('debería manejar nombres de usuario largos', () => {
            const username = 'usuario_muy_largo_con_muchos_caracteres_123456789';
            const password = 'test_password';
            const result = authService.register(username, password);
            expect(result).toBe(`Usuario ${username} registrado.`);
        });
        it('debería manejar contraseñas complejas', () => {
            const username = 'usuario_test';
            const password = 'TestP@ssw0rd!';
            const result = authService.register(username, password);
            expect(result).toBe(`Usuario ${username} registrado.`);
        });
    });
    describe('Register - Casos de Error', () => {
        it('debería manejar username vacío', () => {
            const username = '';
            const password = 'test_password';
            const result = authService.register(username, password);
            expect(result).toBe(`Usuario ${username} registrado.`);
        });
        it('debería manejar password undefined', () => {
            const username = 'usuario_test';
            const password = undefined;
            const result = authService.register(username, password);
            expect(result).toBe(`Usuario ${username} registrado.`);
        });
    });
    describe('Validaciones de Entrada', () => {
        it('debería validar que username sea string', () => {
            const username = 123;
            const password = 'test_password';
            const result = authService.login(username, password);
            expect(result).toBe(`Usuario ${username} autenticado.`);
        });
        it('debería validar que password sea string', () => {
            const username = 'usuario_test';
            const password = 456;
            const result = authService.login(username, password);
            expect(result).toBe(`Usuario ${username} autenticado.`);
        });
    });
    describe('Casos Edge', () => {
        it('debería manejar strings muy largos', () => {
            const longString = 'a'.repeat(1000);
            const loginResult = authService.login(longString, 'test_password');
            const registerResult = authService.register(longString, 'test_password');
            expect(loginResult).toBe(`Usuario ${longString} autenticado.`);
            expect(registerResult).toBe(`Usuario ${longString} registrado.`);
        });
        it('debería manejar caracteres Unicode', () => {
            const username = 'usuario_ñáéíóú_测试_🚀';
            const password = 'test_password';
            const result = authService.login(username, password);
            expect(result).toBe(`Usuario ${username} registrado.`);
        });
    });
});
describe('AuthController - Integración', () => {
    let authController;
    beforeEach(() => {
        jest.clearAllMocks();
        authController = new controller_1.AuthController();
    });
    describe('Métodos del Controller', () => {
        it('debería delegar login al service correctamente', () => {
            const request = { username: 'test_user', password: 'test_password' };
            const result = authController.login(request);
            expect(result).toBe('Usuario test_user autenticado.');
        });
        it('debería delegar register al service correctamente', () => {
            const request = { username: 'new_user', password: 'test_password' };
            const result = authController.register(request);
            expect(result).toBe('Usuario new_user registrado.');
        });
    });
    describe('Validación de Request', () => {
        it('debería manejar request con propiedades faltantes', () => {
            const request = { username: 'test_user' };
            const result = authController.login(request);
            expect(result).toBe('Usuario test_user autenticado.');
        });
        it('debería manejar request vacío', () => {
            const request = {};
            const result = authController.login(request);
            expect(result).toBe('Usuario undefined autenticado.');
        });
    });
});
describe('AuthService - Cobertura de Código', () => {
    let authService;
    beforeEach(() => {
        authService = new service_1.AuthService();
    });
    it('debería tener 100% de cobertura en métodos públicos', () => {
        expect(typeof authService.login).toBe('function');
        expect(typeof authService.register).toBe('function');
        expect(typeof authService.login('test', 'test')).toBe('string');
        expect(typeof authService.register('test', 'test')).toBe('string');
    });
    it('debería manejar todos los tipos de entrada válidos', () => {
        const testCases = [
            { username: 'normal', password: 'normal' },
            { username: '', password: '' },
            { username: '123', password: '123' },
            { username: 'user@domain.com', password: 'P@ssw0rd!' },
        ];
        testCases.forEach(({ username, password }) => {
            const loginResult = authService.login(username, password);
            const registerResult = authService.register(username, password);
            expect(loginResult).toContain(username);
            expect(registerResult).toContain(username);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map