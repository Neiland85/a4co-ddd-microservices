"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev_server_protector_1 = require("../middleware/dev-server-protector");
const dev_server_security_utils_1 = require("../utils/dev-server-security-utils");
const dev_server_validator_1 = require("../validators/dev-server.validator");
describe('Dev Server Security', () => {
    describe('DevServerValidator', () => {
        const validator = new dev_server_validator_1.DevServerValidator();
        test('should validate secure host configuration', () => {
            expect(validator.validateHostConfig('localhost')).toBe(true);
            expect(validator.validateHostConfig('127.0.0.1')).toBe(true);
            expect(validator.validateHostConfig('0.0.0.0')).toBe(false);
        });
        test('should validate secure port configuration', () => {
            expect(validator.validatePortConfig(3000)).toBe(true);
            expect(validator.validatePortConfig(8080)).toBe(true);
            expect(validator.validatePortConfig(80)).toBe(false);
            expect(validator.validatePortConfig(443)).toBe(false);
        });
        test('should validate CORS configuration', () => {
            expect(validator.validateCorsConfig(['http://localhost:3000'])).toBe(true);
            expect(validator.validateCorsConfig(['*'])).toBe(false);
        });
    });
    describe('DevServerSecurityUtils', () => {
        const utils = new dev_server_security_utils_1.DevServerSecurityUtils();
        test('should generate secure Vite config', () => {
            const config = utils.generateSecureViteConfig();
            expect(config.server?.host).toBe('localhost');
            expect(config.server?.cors).toBeDefined();
        });
        test('should generate secure Next.js config', () => {
            const config = utils.generateSecureNextConfig();
            expect(config.headers).toBeDefined();
        });
        test('should generate secure headers', () => {
            const headers = utils.generateSecureHeaders();
            expect(headers['X-Frame-Options']).toBe('DENY');
            expect(headers['X-Content-Type-Options']).toBe('nosniff');
        });
    });
    describe('DevServerProtector', () => {
        const protector = new dev_server_protector_1.DevServerProtector();
        test('should create Express middleware', () => {
            const middleware = protector.createExpressMiddleware();
            expect(typeof middleware).toBe('function');
        });
        test('should create Koa middleware', () => {
            const middleware = protector.createKoaMiddleware();
            expect(typeof middleware).toBe('function');
        });
        test('should create Vite plugin', () => {
            const plugin = protector.createVitePlugin();
            expect(plugin.name).toBe('vite-plugin-dev-server-security');
        });
    });
});
//# sourceMappingURL=dev-server-security.test.js.map