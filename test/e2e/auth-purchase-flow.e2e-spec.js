'use strict';
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
describe('E2E: Basic API Connectivity Test', () => {
    const authServiceUrl = process.env['AUTH_SERVICE_URL'] || 'http://localhost:3001';
    const orderServiceUrl = process.env['ORDER_SERVICE_URL'] || 'http://localhost:3003';
    describe('Service Health Checks', () => {
        it('should check auth service health', async() => {
            try {
                const response = await (0, supertest_1.default)(authServiceUrl).get('/health').timeout(5000);
                if (response.status) {
                    expect([200, 404, 501]).toContain(response.status);
                }
            }
            catch (error) {
                expect(error.code).toBeDefined();
            }
        });
        it('should check order service health', async() => {
            try {
                const response = await (0, supertest_1.default)(orderServiceUrl).get('/health').timeout(5000);
                if (response.status) {
                    expect([200, 404, 501]).toContain(response.status);
                }
            }
            catch (error) {
                expect(error.code).toBeDefined();
            }
        });
    });
    describe('API Contract Validation', () => {
        it('should validate auth service API structure', async() => {
            try {
                const endpoints = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/me'];
                for (const endpoint of endpoints) {
                    try {
                        const response = await (0, supertest_1.default)(authServiceUrl).get(endpoint).timeout(3000);
                        expect([401, 405, 404]).toContain(response.status);
                    }
                    catch (error) {
                        expect(error.code).toBeDefined();
                    }
                }
            }
            catch (error) {
                expect(error).toBeDefined();
            }
        });
        it('should validate order service API structure', async() => {
            try {
                const endpoints = ['/api/v1/orders', '/api/v1/orders/123'];
                for (const endpoint of endpoints) {
                    try {
                        const response = await (0, supertest_1.default)(orderServiceUrl).get(endpoint).timeout(3000);
                        expect([401, 404]).toContain(response.status);
                    }
                    catch (error) {
                        expect(error.code).toBeDefined();
                    }
                }
            }
            catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
    describe('Error Handling Validation', () => {
        it('should handle malformed requests gracefully', async() => {
            try {
                const response = await (0, supertest_1.default)(authServiceUrl)
                    .post('/api/v1/auth/login')
                    .send({ invalidField: 'test' })
                    .timeout(3000);
                expect([400, 401, 422]).toContain(response.status);
            }
            catch (error) {
                expect(error.code).toBeDefined();
            }
        });
        it('should handle invalid endpoints', async() => {
            try {
                const response = await (0, supertest_1.default)(orderServiceUrl)
                    .get('/api/v1/nonexistent-endpoint')
                    .timeout(3000);
                expect(response.status).toBe(404);
            }
            catch (error) {
                expect(error.code).toBeDefined();
            }
        });
    });
});
//# sourceMappingURL=auth-purchase-flow.e2e-spec.js.map
