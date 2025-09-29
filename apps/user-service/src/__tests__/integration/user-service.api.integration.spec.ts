import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserServiceModule } from '../../user-service.module';

describe('UserService API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user-service (GET)', () => {
    return request(app.getHttpServer())
      .get('/user-service')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/user-service (POST)', () => {
    return request(app.getHttpServer())
      .post('/user-service')
      .send({ name: 'Test user-service' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
