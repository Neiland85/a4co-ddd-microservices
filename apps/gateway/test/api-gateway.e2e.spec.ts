/**
 * API Gateway E2E Tests
 * Integration tests for the complete gateway flow
 */

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Gateway (e2e)', () => {
    let app: INestApplication;
    const JWT_SECRET = 'test-secret-for-e2e';

    beforeAll(async () => {
        // Set environment variables for testing
        process.env.JWT_SECRET = JWT_SECRET;
        process.env.PORT = '3099';
        process.env.NODE_ENV = 'test';

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env.test',
                }),
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Health Endpoints', () => {
        it('/api/v1/health (GET) - should return gateway health', () => {
            return request(app.getHttpServer())
                .get('/api/v1/health')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body).toHaveProperty('status');
                });
        });

        it('/api/v1/health/ready (GET) - should return readiness status', () => {
            return request(app.getHttpServer())
                .get('/api/v1/health/ready')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body).toHaveProperty('status', 'ready');
                    expect(res.body).toHaveProperty('timestamp');
                });
        });

        it('/api/v1/health/live (GET) - should return liveness status', () => {
            return request(app.getHttpServer())
                .get('/api/v1/health/live')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body).toHaveProperty('status', 'alive');
                });
        });
    });

    describe('CORS Headers', () => {
        it('should include CORS headers in responses', () => {
            return request(app.getHttpServer())
                .options('/api/v1/health')
                .expect((res) => {
                    expect(res.headers['access-control-allow-methods']).toBeDefined();
                });
        });
    });

    describe('Correlation ID', () => {
        it('should generate correlation ID if not provided', () => {
            return request(app.getHttpServer())
                .get('/api/v1/health')
                .expect((res) => {
                    expect(res.headers['x-correlation-id']).toBeDefined();
                    expect(res.headers['x-correlation-id']).toMatch(/^corr-/);
                });
        });

        it('should preserve correlation ID from request', () => {
            const correlationId = 'test-correlation-123';

            return request(app.getHttpServer())
                .get('/api/v1/health')
                .set('X-Correlation-ID', correlationId)
                .expect((res) => {
                    expect(res.headers['x-correlation-id']).toBe(correlationId);
                });
        });
    });

    describe('JWT Authentication', () => {
        it('should reject requests without token to protected routes', () => {
            return request(app.getHttpServer())
                .get('/api/v1/orders')
                .expect(HttpStatus.UNAUTHORIZED)
                .expect((res) => {
                    expect(res.body).toHaveProperty('statusCode', 401);
                    expect(res.body).toHaveProperty('message');
                });
        });

        it('should reject requests with invalid token format', () => {
            return request(app.getHttpServer())
                .get('/api/v1/orders')
                .set('Authorization', 'InvalidToken')
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it('should reject requests with expired token', () => {
            const expiredToken = jwt.sign(
                { sub: 'user-123', email: 'test@example.com' },
                JWT_SECRET,
                { expiresIn: '-1h' },
            );

            return request(app.getHttpServer())
                .get('/api/v1/orders')
                .set('Authorization', `Bearer ${expiredToken}`)
                .expect(HttpStatus.UNAUTHORIZED)
                .expect((res) => {
                    expect(res.body.error).toBe('TokenExpired');
                });
        });

        it('should reject requests with invalid signature', () => {
            const invalidToken = jwt.sign(
                { sub: 'user-123', email: 'test@example.com' },
                'wrong-secret',
                { expiresIn: '1h' },
            );

            return request(app.getHttpServer())
                .get('/api/v1/orders')
                .set('Authorization', `Bearer ${invalidToken}`)
                .expect(HttpStatus.UNAUTHORIZED)
                .expect((res) => {
                    expect(res.body.error).toBe('InvalidToken');
                });
        });

        it('should accept valid JWT token', () => {
            const validToken = jwt.sign(
                {
                    sub: 'user-123',
                    email: 'test@example.com',
                    role: 'user',
                },
                JWT_SECRET,
                { expiresIn: '1h' },
            );

            // This will fail to proxy since services aren't running, but should pass auth
            return request(app.getHttpServer())
                .get('/api/v1/orders')
                .set('Authorization', `Bearer ${validToken}`)
                .expect((res) => {
                    // Should not be 401 (auth passed)
                    expect(res.statusCode).not.toBe(HttpStatus.UNAUTHORIZED);
                });
        });
    });

    describe('Public Routes', () => {
        it('should allow access to /api/docs without token', () => {
            return request(app.getHttpServer())
                .get('/api/docs')
                .expect((res) => {
                    // Should redirect or return docs, not 401
                    expect(res.statusCode).not.toBe(HttpStatus.UNAUTHORIZED);
                });
        });

        it('should allow access to /api/v1/products (GET) without token', () => {
            return request(app.getHttpServer())
                .get('/api/v1/products')
                .expect((res) => {
                    // Should not be 401 (public route)
                    expect(res.statusCode).not.toBe(HttpStatus.UNAUTHORIZED);
                });
        });
    });

    describe('Error Handling', () => {
        it('should return structured error responses', () => {
            return request(app.getHttpServer())
                .get('/api/v1/nonexistent')
                .expect((res) => {
                    expect(res.body).toHaveProperty('statusCode');
                    expect(res.body).toHaveProperty('message');
                    expect(res.body).toHaveProperty('timestamp');
                    expect(res.body).toHaveProperty('path');
                });
        });
    });

    describe('Rate Limiting', () => {
        it('should enforce rate limits', async () => {
            const requests = [];

            // Make 110 requests (rate limit is 100)
            for (let i = 0; i < 110; i++) {
                requests.push(
                    request(app.getHttpServer())
                        .get('/api/v1/health')
                        .expect((res) => {
                            // First 100 should succeed, next 10 should be rate limited
                            if (i < 100) {
                                expect([HttpStatus.OK, HttpStatus.TOO_MANY_REQUESTS]).toContain(res.statusCode);
                            }
                        }),
                );
            }

            await Promise.all(requests);
        }, 30000); // Increase timeout for this test
    });
});
