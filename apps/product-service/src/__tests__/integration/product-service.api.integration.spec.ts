import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductServiceModule } from '../../product-service.module';

describe('ProductService API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/product-service (GET)', () => {
    return request(app.getHttpServer())
      .get('/product-service')
      .expect(200)
      .expect((res) => {
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
