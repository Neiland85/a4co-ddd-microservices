/**
 * Correlation ID Middleware Tests
 */

import { Request, Response } from 'express';
import { CorrelationIdMiddleware } from '../src/common/middleware/correlation-id.middleware';

describe('CorrelationIdMiddleware', () => {
    let middleware: CorrelationIdMiddleware;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        middleware = new CorrelationIdMiddleware();

        mockRequest = {
            headers: {},
        };

        mockResponse = {
            setHeader: jest.fn(),
        };

        nextFunction = jest.fn();
    });

    describe('Correlation ID Generation', () => {
        it('should generate a new correlation ID if not present', () => {
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(mockRequest.headers['x-correlation-id']).toBeDefined();
            expect(mockRequest.headers['x-correlation-id']).toMatch(/^corr-\d+-[a-z0-9]+$/);
            expect(mockResponse.setHeader).toHaveBeenCalledWith(
                'X-Correlation-ID',
                mockRequest.headers['x-correlation-id'],
            );
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should preserve existing correlation ID from upstream', () => {
            const existingId = 'upstream-correlation-123';
            mockRequest.headers = {
                'x-correlation-id': existingId,
            };

            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(mockRequest.headers['x-correlation-id']).toBe(existingId);
            expect(mockResponse.setHeader).toHaveBeenCalledWith(
                'X-Correlation-ID',
                existingId,
            );
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should generate unique correlation IDs for different requests', () => {
            const ids = new Set<string>();

            for (let i = 0; i < 10; i++) {
                const req = { headers: {} } as Request;
                const res = { setHeader: jest.fn() } as unknown as Response;
                const next = jest.fn();

                middleware.use(req, res, next);
                ids.add(req.headers['x-correlation-id'] as string);
            }

            expect(ids.size).toBe(10); // All IDs should be unique
        });
    });

    describe('Response Headers', () => {
        it('should always set correlation ID in response headers', () => {
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(mockResponse.setHeader).toHaveBeenCalledWith(
                'X-Correlation-ID',
                expect.any(String),
            );
        });
    });
});
