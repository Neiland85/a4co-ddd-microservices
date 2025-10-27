import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ProductModule } from '../../product.module';

describe('Product API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/product-service (GET)', () => {
    return request(app.getHttpServer())
      .get('/product-service')
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/product-service (POST)', () => {
    return request(app.getHttpServer())
      .post('/product-service')
      .send({ name: 'Test product-service' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
