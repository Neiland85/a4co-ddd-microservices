import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../apps/dashboard-web/src/app.module';

describe('Full Application Flow (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should complete full user journey', async () => {
    // 1. User registration
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
      .expect(201);

    const userId = registerResponse.body.id;

    // 2. User login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200);

    const token = loginResponse.body.token;

    // 3. Create product
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

    // 4. Create order
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

    // 5. Process payment
    await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderId: orderResponse.body.id,
        amount: 59.98,
        paymentMethod: 'credit_card'
      })
      .expect(201);

    // 6. Verify order status
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
