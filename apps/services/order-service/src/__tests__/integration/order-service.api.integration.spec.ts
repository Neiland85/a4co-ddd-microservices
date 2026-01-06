import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OrderServiceModule } from '../../order-service.module';

describe('OrderService API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/order-service (GET)', () => {
    return request(app.getHttpServer())
      .get('/order-service')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/order-service (POST)', () => {
    return request(app.getHttpServer())
      .post('/order-service')
      .send({ name: 'Test order-service' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
