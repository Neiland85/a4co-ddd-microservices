/**
 * JWT Authentication Middleware Tests
 */

import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtAuthMiddleware } from '../src/common/middleware/jwt-auth.middleware';

describe('JwtAuthMiddleware', () => {
    let middleware: JwtAuthMiddleware;
    let configService: ConfigService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    const JWT_SECRET = 'test-secret-key';

    beforeEach(() => {
        // Mock ConfigService
        configService = {
            get: jest.fn((key: string) => {
                if (key === 'JWT_SECRET') return JWT_SECRET;
                return undefined;
            }),
        } as any;

        middleware = new JwtAuthMiddleware(configService);

        // Mock Express objects
        mockRequest = {
            path: '/api/v1/orders',
            headers: {
                'x-request-id': 'test-123',
            },
        };

        mockResponse = {
            setHeader: jest.fn(),
        };

        nextFunction = jest.fn();
    });

    describe('Constructor', () => {
        it('should throw error if JWT_SECRET is not set', () => {
            const badConfig = {
                get: jest.fn(() => undefined),
            } as any;

            expect(() => new JwtAuthMiddleware(badConfig)).toThrow(
                'JWT_SECRET environment variable must be set',
            );
        });
    });

    describe('Public Paths', () => {
        it('should skip auth for /api/v1/auth/login', () => {
            mockRequest.path = '/api/v1/auth/login';

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should skip auth for /api/v1/auth/register', () => {
            mockRequest.path = '/api/v1/auth/register';

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should skip auth for /api/v1/health', () => {
            mockRequest.path = '/api/v1/health';

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should skip auth for /api/docs', () => {
            mockRequest.path = '/api/docs';

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should skip auth for /api/v1/products (public browsing)', () => {
            mockRequest.path = '/api/v1/products';

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();
        });
    });

    describe('Missing Authorization Header', () => {
        it('should throw UnauthorizedException when Authorization header is missing', () => {
            expect(() => {
                middleware.use(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction,
                );
            }).toThrow(UnauthorizedException);
        });
    });

    describe('Invalid Token Format', () => {
        it('should throw UnauthorizedException for missing Bearer prefix', () => {
            mockRequest.headers = {
                ...mockRequest.headers,
                authorization: 'InvalidTokenFormat',
            };

            expect(() => {
                middleware.use(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction,
                );
            }).toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for Bearer without token', () => {
            mockRequest.headers = {
                ...mockRequest.headers,
                authorization: 'Bearer ',
            };

            expect(() => {
                middleware.use(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction,
                );
            }).toThrow(UnauthorizedException);
        });
    });

    describe('Valid JWT Token', () => {
        it('should validate token and attach user info to request', () => {
            const payload = {
                sub: 'user-123',
                email: 'test@example.com',
                role: 'user',
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            mockRequest.headers = {
                ...mockRequest.headers,
                authorization: `Bearer ${token}`,
            };

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(mockRequest.user).toBeDefined();
            expect(mockRequest.userId).toBe('user-123');
            expect(mockRequest.headers['x-user-id']).toBe('user-123');
            expect(mockRequest.headers['x-user-email']).toBe('test@example.com');
            expect(mockRequest.headers['x-user-role']).toBe('user');
            expect(nextFunction).toHaveBeenCalled();
        });
    });

    describe('Expired Token', () => {
        it('should throw UnauthorizedException for expired token', () => {
            const payload = {
                sub: 'user-123',
                email: 'test@example.com',
            };

            // Create token that's already expired
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1h' });

            mockRequest.headers = {
                ...mockRequest.headers,
                authorization: `Bearer ${token}`,
            };

            expect(() => {
                middleware.use(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction,
                );
            }).toThrow(UnauthorizedException);
        });
    });

    describe('Invalid Token', () => {
        it('should throw UnauthorizedException for invalid signature', () => {
            const payload = {
                sub: 'user-123',
                email: 'test@example.com',
            };

            // Sign with different secret
            const token = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });

            mockRequest.headers = {
                ...mockRequest.headers,
                authorization: `Bearer ${token}`,
            };

            expect(() => {
                middleware.use(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction,
                );
            }).toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for malformed token', () => {
            mockRequest.headers = {
                ...mockRequest.headers,
                authorization: 'Bearer invalid.token.format',
            };

            expect(() => {
                middleware.use(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction,
                );
            }).toThrow(UnauthorizedException);
        });
    });
});
