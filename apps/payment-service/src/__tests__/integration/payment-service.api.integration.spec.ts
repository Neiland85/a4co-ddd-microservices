import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PaymentServiceModule } from '../../payment-service.module';

describe('PaymentService API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PaymentServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/payment-service (GET)', () => {
    return request(app.getHttpServer())
      .get('/payment-service')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/payment-service (POST)', () => {
    return request(app.getHttpServer())
      .post('/payment-service')
      .send({ name: 'Test payment-service' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
