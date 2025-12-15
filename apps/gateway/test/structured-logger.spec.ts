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
    let consoleLogSpy: jest.SpyInstance;

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

        // Spy on console methods
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    describe('Logging', () => {
        it('should log structured JSON for successful requests', (done) => {
            middleware.use(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );

            expect(nextFunction).toHaveBeenCalled();

            // Simulate response end
            setTimeout(() => {
                (mockResponse as any).end();

                // Check that structured log was created
                expect(consoleLogSpy).toHaveBeenCalled();
                const logCall = consoleLogSpy.mock.calls[0][0];

                // Verify it contains JSON
                expect(() => JSON.parse(logCall)).not.toThrow();
                const logData = JSON.parse(logCall);

                expect(logData).toMatchObject({
                    correlationId: 'test-corr-123',
                    method: 'GET',
                    path: '/api/v1/orders/123',
                    statusCode: 200,
                    targetService: 'order-service',
                });

                expect(logData.timestamp).toBeDefined();
                expect(logData.duration).toBeGreaterThanOrEqual(0);
                expect(logData.message).toContain('successfully');

                done();
            }, 10);
        });

        it('should include user context when available', (done) => {
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

            setTimeout(() => {
                (mockResponse as any).end();

                const logCall = consoleLogSpy.mock.calls[0][0];
                const logData = JSON.parse(logCall);

                expect(logData.userId).toBe('user-456');
                expect(logData.roles).toBe('admin');

                done();
            }, 10);
        });

        it('should detect target service from path', (done) => {
            const testCases = [
                { path: '/api/v1/orders/123', expected: 'order-service' },
                { path: '/api/v1/payments/456', expected: 'payment-service' },
                { path: '/api/v1/inventory/789', expected: 'inventory-service' },
                { path: '/api/v1/products/list', expected: 'product-service' },
                { path: '/api/v1/auth/login', expected: 'auth-service' },
            ];

            let completedTests = 0;

            testCases.forEach((testCase) => {
                const req = {
                    ...mockRequest,
                    path: testCase.path,
                } as Request;

                const res = {
                    ...mockResponse,
                    end: jest.fn(),
                } as any;

                middleware.use(req, res, nextFunction);

                setTimeout(() => {
                    res.end();

                    const logCall = consoleLogSpy.mock.calls.find((call: any[]) => {
                        const logData = JSON.parse(call[0]);
                        return logData.path === testCase.path;
                    });

                    if (logCall) {
                        const logData = JSON.parse(logCall[0]);
                        expect(logData.targetService).toBe(testCase.expected);
                    }

                    completedTests++;
                    if (completedTests === testCases.length) {
                        done();
                    }
                }, 10);
            });
        });
    });
});
