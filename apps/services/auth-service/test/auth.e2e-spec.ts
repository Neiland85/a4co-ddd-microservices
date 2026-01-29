import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/health')
      .expect(200)
      .expect({ status: 'ok', service: 'auth' });
  });

  afterAll(async () => {
    await app.close();
  });
});
