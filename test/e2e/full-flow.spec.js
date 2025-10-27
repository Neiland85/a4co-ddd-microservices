"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = __importStar(require("supertest"));
const app_module_1 = require("../../apps/dashboard-web/src/app.module");
describe('Full Application Flow (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('should complete full user journey', async () => {
        const registerResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        })
            .expect(201);
        const userId = registerResponse.body.id;
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password123'
        })
            .expect(200);
        const token = loginResponse.body.token;
        const productResponse = await request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
            name: 'Test Product',
            price: 29.99,
            description: 'A test product'
        })
            .expect(201);
        const productId = productResponse.body.id;
        const orderResponse = await request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
            userId,
            items: [{
                    productId,
                    quantity: 2
                }]
        })
            .expect(201);
        await request(app.getHttpServer())
            .post('/payments')
            .set('Authorization', `Bearer ${token}`)
            .send({
            orderId: orderResponse.body.id,
            amount: 59.98,
            paymentMethod: 'credit_card'
        })
            .expect(201);
        const finalOrder = await request(app.getHttpServer())
            .get(`/orders/${orderResponse.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(finalOrder.body.status).toBe('paid');
    });
    afterAll(async () => {
        await app.close();
    });
});
//# sourceMappingURL=full-flow.spec.js.map