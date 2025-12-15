/**
 * Structured Logger - JSON formatted logging
 * Provides consistent structured logs for all requests
 */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export interface StructuredLogData {
    timestamp: string;
    correlationId: string;
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    userId?: string;
    roles?: string;
    targetService?: string;
    message: string;
    userAgent?: string;
    ip?: string;
    error?: string;
}

@Injectable()
export class StructuredLogger implements NestMiddleware {
    private readonly logger = new Logger('StructuredLogger');

    use(req: Request, res: Response, next: NextFunction) {
        const startTime = Date.now();

        // Capture original end function
        const originalEnd = res.end;

        // Override end function to log after response
        res.end = function (chunk?: any, encoding?: any, callback?: any) {
            // Restore original end
            res.end = originalEnd;

            // Calculate duration
            const duration = Date.now() - startTime;

            // Extract user context
            const userId = req.headers['x-user-id'] as string;
            const roles = req.headers['x-user-role'] as string;
            const correlationId = req.headers['x-correlation-id'] as string || 'unknown';

            // Determine target service from path
            const targetService = extractTargetService(req.path);

            // Build structured log data
            const logData: StructuredLogData = {
                timestamp: new Date().toISOString(),
                correlationId,
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration,
                message: `Request processed ${res.statusCode >= 400 ? 'with errors' : 'successfully'}`,
            };

            // Add optional fields
            if (userId) logData.userId = userId;
            if (roles) logData.roles = roles;
            if (targetService) logData.targetService = targetService;

            // Add request metadata for debug/error levels
            if (res.statusCode >= 400) {
                logData.userAgent = req.headers['user-agent'];
                logData.ip = req.ip || req.socket.remoteAddress;
            }

            // Log based on status code
            const logMessage = JSON.stringify(logData);

            if (res.statusCode >= 500) {
                Logger.error(logMessage, 'HTTP');
            } else if (res.statusCode >= 400) {
                Logger.warn(logMessage, 'HTTP');
            } else {
                Logger.log(logMessage, 'HTTP');
            }

            // Call original end
            return res.end.call(res, chunk, encoding, callback);
        } as typeof res.end;

        next();
    }
}

/**
 * Extract target service from request path
 */
function extractTargetService(path: string): string | undefined {
    const serviceMap: Record<string, string> = {
        '/api/v1/orders': 'order-service',
        '/api/v1/payments': 'payment-service',
        '/api/v1/inventory': 'inventory-service',
        '/api/v1/products': 'product-service',
        '/api/v1/auth': 'auth-service',
        '/api/v1/sagas': 'saga-service',
    };

    for (const [prefix, service] of Object.entries(serviceMap)) {
        if (path.startsWith(prefix)) {
            return service;
        }
    }

    return undefined;
}
