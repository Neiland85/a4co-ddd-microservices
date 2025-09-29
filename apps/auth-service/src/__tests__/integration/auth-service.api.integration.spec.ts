import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthServiceModule } from '../../auth-service.module';

describe('AuthService API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth-service (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth-service')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/auth-service (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth-service')
      .send({ name: 'Test auth-service' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
