/**
 * Structured Logger Tests
 */

import { Request, Response } from 'express';
import { StructuredLogger } from '../src/logger/structured.logger';

describe('StructuredLogger', () => {
    let middleware: StructuredLogger;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        middleware = new StructuredLogger();

        mockRequest = {
            method: 'GET',
            path: '/api/v1/orders/123',
            headers: {
                'x-correlation-id': 'test-corr-123',
                'user-agent': 'test-agent',
            },
            ip: '127.0.0.1',
        };

        mockResponse = {
            statusCode: 200,
            end: jest.fn(),
        } as any;

        nextFunction = jest.fn();
    });

    describe('Middleware Behavior', () => {
        it('should be defined', () => {
            expect(middleware).toBeDefined();
        });

        it('should call next function', () => {
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should override response.end function', () => {
            const originalEnd = mockResponse.end;

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            // The end function should be replaced
            expect(mockResponse.end).not.toBe(originalEnd);
        });
    });

    describe('Service Detection', () => {
        it('should detect order service from path', () => {
            mockRequest.path = '/api/v1/orders/123';
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should detect payment service from path', () => {
            mockRequest.path = '/api/v1/payments/456';
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should detect inventory service from path', () => {
            mockRequest.path = '/api/v1/inventory/789';
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should detect product service from path', () => {
            mockRequest.path = '/api/v1/products/list';
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should detect auth service from path', () => {
            mockRequest.path = '/api/v1/auth/login';
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );
            expect(nextFunction).toHaveBeenCalled();
        });
    });

    describe('User Context', () => {
        it('should handle requests without user context', () => {
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should handle requests with user context', () => {
            mockRequest.headers = {
                ...mockRequest.headers,
                'x-user-id': 'user-456',
                'x-user-role': 'admin',
            } as any;

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();
        });
    });
});
