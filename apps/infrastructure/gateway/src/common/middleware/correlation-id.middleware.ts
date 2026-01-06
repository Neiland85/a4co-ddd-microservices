/**
 * Correlation ID Middleware
 * Ensures every request has a unique correlation ID for distributed tracing
 */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    private readonly logger = new Logger(CorrelationIdMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        // Check if correlation ID already exists (from upstream)
        let correlationId = req.headers['x-correlation-id'] as string;

        if (!correlationId) {
            // Generate new correlation ID if not present
            correlationId = this.generateCorrelationId();
            this.logger.debug(`Generated new correlation ID: ${correlationId}`);
        }

        // Set correlation ID in request headers
        req.headers['x-correlation-id'] = correlationId;

        // Set correlation ID in response headers for traceability
        res.setHeader('X-Correlation-ID', correlationId);

        next();
    }

    private generateCorrelationId(): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `corr-${timestamp}-${random}`;
    }
}
