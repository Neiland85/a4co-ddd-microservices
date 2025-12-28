/**
 * Logger Middleware - Request/Response Logging
 */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';
        const requestId = req.get('X-Request-ID') || this.generateRequestId();

        // Add request ID to headers
        req.headers['x-request-id'] = requestId;
        res.setHeader('X-Request-ID', requestId);

        const startTime = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length') || 0;
            const duration = Date.now() - startTime;

            const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${duration}ms`;

            if (statusCode >= 500) {
                this.logger.error(`${logMessage} [${requestId}] - ${ip} - ${userAgent}`);
            } else if (statusCode >= 400) {
                this.logger.warn(`${logMessage} [${requestId}] - ${ip}`);
            } else {
                this.logger.log(`${logMessage} [${requestId}]`);
            }
        });

        next();
    }

    private generateRequestId(): string {
        return `gw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
}
