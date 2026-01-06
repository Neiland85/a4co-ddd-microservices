/**
 * Proxy Service - HTTP forwarding logic using @nestjs/axios
 */

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

export type ServiceName = 'auth' | 'products' | 'orders' | 'inventory' | 'payments' | 'sagas';

interface ProxyResponse<T = unknown> {
    data: T;
    status: number;
    headers: Record<string, string>;
}

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);
    private readonly serviceUrls: Record<ServiceName, string>;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.serviceUrls = {
            auth: this.configService.get<string>('services.auth', 'http://localhost:3001'),
            products: this.configService.get<string>('services.products', 'http://localhost:3002'),
            orders: this.configService.get<string>('services.orders', 'http://localhost:3003'),
            inventory: this.configService.get<string>('services.inventory', 'http://localhost:3004'),
            payments: this.configService.get<string>('services.payments', 'http://localhost:3005'),
            sagas: this.configService.get<string>('services.sagas', 'http://localhost:3006'),
        };

        this.logger.log('Proxy service initialized with targets:');
        Object.entries(this.serviceUrls).forEach(([name, url]) => {
            this.logger.log(`  - ${name}: ${url}`);
        });
    }

    /**
     * Forward a request to a downstream service
     */
    async forward<T = unknown>(
        service: ServiceName,
        path: string,
        req: Request,
    ): Promise<ProxyResponse<T>> {
        const targetUrl = this.buildTargetUrl(service, path);
        const requestId = req.headers['x-request-id'] as string;

        this.logger.debug(`[${requestId}] Forwarding ${req.method} ${path} -> ${targetUrl}`);

        const config: AxiosRequestConfig = {
            method: req.method as AxiosRequestConfig['method'],
            url: targetUrl,
            headers: this.buildForwardHeaders(req),
            data: req.body,
            params: req.query,
            timeout: this.configService.get<number>('proxy.timeout', 30000),
            validateStatus: () => true, // Don't throw on any status
        };

        try {
            const response = await firstValueFrom(this.httpService.request<T>(config));

            this.logger.debug(
                `[${requestId}] Response from ${service}: ${response.status}`,
            );

            return {
                data: response.data,
                status: response.status,
                headers: this.extractResponseHeaders(response.headers),
            };
        } catch (error) {
            return this.handleProxyError(error, service, requestId);
        }
    }

    /**
     * Build the target URL for a service
     */
    private buildTargetUrl(service: ServiceName, path: string): string {
        const baseUrl = this.serviceUrls[service];
        // Remove leading slash if present and add it consistently
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    }

    /**
     * Build headers to forward to downstream service
     */
    private buildForwardHeaders(req: Request): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': req.headers['content-type'] || 'application/json',
            Accept: req.headers['accept'] || 'application/json',
        };

        // Forward authentication
        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization as string;
        }

        // Forward user context (set by JWT middleware)
        const userHeaders = ['x-user-id', 'x-user-email', 'x-user-role'];
        userHeaders.forEach((header) => {
            if (req.headers[header]) {
                headers[header] = req.headers[header] as string;
            }
        });

        // Forward tracing headers
        const tracingHeaders = [
            'x-request-id',
            'x-correlation-id',
            'x-trace-id',
            'x-span-id',
            'x-b3-traceid',
            'x-b3-spanid',
            'x-b3-sampled',
        ];

        tracingHeaders.forEach((header) => {
            if (req.headers[header]) {
                headers[header] = req.headers[header] as string;
            }
        });

        // Add gateway identifier
        headers['X-Forwarded-By'] = 'a4co-gateway';
        headers['X-Forwarded-Host'] = req.headers.host || 'localhost';
        headers['X-Forwarded-Proto'] = req.protocol;

        return headers;
    }

    /**
     * Extract relevant headers from response
     */
    private extractResponseHeaders(
        headers: Record<string, unknown>,
    ): Record<string, string> {
        const allowedHeaders = [
            'content-type',
            'x-request-id',
            'x-correlation-id',
            'x-ratelimit-limit',
            'x-ratelimit-remaining',
            'x-ratelimit-reset',
            'cache-control',
            'etag',
            'last-modified',
        ];

        const result: Record<string, string> = {};

        allowedHeaders.forEach((header) => {
            if (headers[header]) {
                result[header] = String(headers[header]);
            }
        });

        return result;
    }

    /**
     * Handle proxy errors
     */
    private handleProxyError(
        error: unknown,
        service: ServiceName,
        requestId: string,
    ): never {
        if (error instanceof AxiosError) {
            const status = error.response?.status || HttpStatus.BAD_GATEWAY;
            const message = error.response?.data?.message || error.message;

            this.logger.error(
                `[${requestId}] Proxy error to ${service}: ${status} - ${message}`,
            );

            if (error.code === 'ECONNREFUSED') {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                        message: `Service ${service} is unavailable`,
                        error: 'Service Unavailable',
                        service,
                    },
                    HttpStatus.SERVICE_UNAVAILABLE,
                );
            }

            if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.GATEWAY_TIMEOUT,
                        message: `Request to ${service} timed out`,
                        error: 'Gateway Timeout',
                        service,
                    },
                    HttpStatus.GATEWAY_TIMEOUT,
                );
            }

            throw new HttpException(
                {
                    statusCode: status,
                    message,
                    error: error.response?.data?.error || 'Proxy Error',
                    service,
                },
                status,
            );
        }

        this.logger.error(`[${requestId}] Unknown proxy error to ${service}:`, error);

        throw new HttpException(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal gateway error',
                error: 'Internal Server Error',
                service,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    /**
     * Get service URL for a given service name
     */
    getServiceUrl(service: ServiceName): string {
        return this.serviceUrls[service];
    }
}
