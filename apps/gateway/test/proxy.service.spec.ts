/**
 * Proxy Service Tests
 */

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Request } from 'express';
import { of, throwError } from 'rxjs';
import { ProxyService } from '../src/proxy/proxy.service';

describe('ProxyService', () => {
    let service: ProxyService;
    let httpService: HttpService;
    let configService: ConfigService;

    const mockRequest: Partial<Request> = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'x-request-id': 'test-123',
            'authorization': 'Bearer test-token',
        },
        body: {},
        query: {},
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProxyService,
                {
                    provide: HttpService,
                    useValue: {
                        request: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string, defaultValue?: any) => {
                            const config: Record<string, any> = {
                                'services.auth': 'http://localhost:3001',
                                'services.products': 'http://localhost:3002',
                                'services.orders': 'http://localhost:3003',
                                'services.inventory': 'http://localhost:3004',
                                'services.payments': 'http://localhost:3005',
                                'services.sagas': 'http://localhost:3006',
                                'proxy.timeout': 30000,
                            };
                            return config[key] || defaultValue;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<ProxyService>(ProxyService);
        httpService = module.get<HttpService>(HttpService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Service Initialization', () => {
        it('should initialize with correct service URLs', () => {
            expect(service.getServiceUrl('auth')).toBe('http://localhost:3001');
            expect(service.getServiceUrl('products')).toBe('http://localhost:3002');
            expect(service.getServiceUrl('orders')).toBe('http://localhost:3003');
            expect(service.getServiceUrl('inventory')).toBe('http://localhost:3004');
            expect(service.getServiceUrl('payments')).toBe('http://localhost:3005');
            expect(service.getServiceUrl('sagas')).toBe('http://localhost:3006');
        });
    });

    describe('Forward Request', () => {
        it('should forward request successfully', async () => {
            const mockResponse: AxiosResponse = {
                data: { success: true },
                status: 200,
                statusText: 'OK',
                headers: {
                    'content-type': 'application/json',
                    'x-request-id': 'test-123',
                },
                config: {} as any,
            };

            jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

            const result = await service.forward('auth', '/login', mockRequest as Request);

            expect(result.data).toEqual({ success: true });
            expect(result.status).toBe(200);
            expect(httpService.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: 'GET',
                    url: 'http://localhost:3001/login',
                }),
            );
        });

        it('should build target URL correctly with leading slash', async () => {
            const mockResponse: AxiosResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any,
            };

            jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

            await service.forward('orders', '/123', mockRequest as Request);

            expect(httpService.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: 'http://localhost:3003/123',
                }),
            );
        });

        it('should forward authentication headers', async () => {
            const mockResponse: AxiosResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any,
            };

            jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

            await service.forward('orders', '/list', mockRequest as Request);

            expect(httpService.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-token',
                    }),
                }),
            );
        });

        it('should forward user context headers', async () => {
            const mockResponse: AxiosResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any,
            };

            const reqWithUser: Partial<Request> = {
                ...mockRequest,
                headers: {
                    ...mockRequest.headers,
                    'x-user-id': 'user-123',
                    'x-user-email': 'test@example.com',
                    'x-user-role': 'admin',
                } as any,
            };

            jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

            await service.forward('orders', '/list', reqWithUser as Request);

            expect(httpService.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'x-user-id': 'user-123',
                        'x-user-email': 'test@example.com',
                        'x-user-role': 'admin',
                    }),
                }),
            );
        });
    });

    describe('Error Handling', () => {
        it('should handle service unavailable error', async () => {
            const error = new axios.AxiosError(
                'Connection refused',
                'ECONNREFUSED',
                {} as any,
                {} as any,
                undefined,
            );

            jest.spyOn(httpService, 'request').mockReturnValue(
                throwError(() => error),
            );

            await expect(
                service.forward('auth', '/login', mockRequest as Request),
            ).rejects.toThrow('Service auth is unavailable');
        });

        it('should handle timeout error', async () => {
            const error = new axios.AxiosError(
                'Request timeout',
                'ETIMEDOUT',
                {} as any,
                {} as any,
                undefined,
            );

            jest.spyOn(httpService, 'request').mockReturnValue(
                throwError(() => error),
            );

            await expect(
                service.forward('orders', '/123', mockRequest as Request),
            ).rejects.toThrow('Request to orders timed out');
        });

        it('should handle HTTP error responses', async () => {
            const error = new axios.AxiosError(
                'Request failed with status code 404',
                'ERR_BAD_REQUEST',
                {} as any,
                {} as any,
                {
                    status: 404,
                    statusText: 'Not Found',
                    data: { message: 'Order not found' },
                    headers: {},
                    config: {} as any,
                },
            );

            jest.spyOn(httpService, 'request').mockReturnValue(
                throwError(() => error),
            );

            await expect(
                service.forward('orders', '/999', mockRequest as Request),
            ).rejects.toThrow();
        });
    });

    describe('Payment Service Integration', () => {
        it('should forward to payment service correctly', async () => {
            const mockResponse: AxiosResponse = {
                data: { paymentId: 'pay-123', status: 'success' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any,
            };

            jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

            const result = await service.forward('payments', '/process', mockRequest as Request);

            expect(result.data).toEqual({ paymentId: 'pay-123', status: 'success' });
            expect(httpService.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: 'http://localhost:3005/process',
                }),
            );
        });
    });

    describe('Saga Service Integration', () => {
        it('should forward to saga coordinator correctly', async () => {
            const mockResponse: AxiosResponse = {
                data: { sagaId: 'saga-123', status: 'completed' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any,
            };

            jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

            const result = await service.forward('sagas', '/transactions', mockRequest as Request);

            expect(result.data).toEqual({ sagaId: 'saga-123', status: 'completed' });
            expect(httpService.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: 'http://localhost:3006/transactions',
                }),
            );
        });
    });
});
