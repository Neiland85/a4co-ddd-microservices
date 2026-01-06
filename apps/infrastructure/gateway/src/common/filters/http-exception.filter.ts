/**
 * HTTP Exception Filter
 * Global exception filter for consistent error responses
 */

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
    correlationId?: string;
    service?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const correlationId = request.headers['x-correlation-id'] as string;

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        let service: string | undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as Record<string, any>;
                message = responseObj.message || exception.message;
                error = responseObj.error || exception.name;
                service = responseObj.service;
            } else {
                message = exceptionResponse as string;
                error = exception.name;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;
        }

        const errorResponse: ErrorResponse = {
            statusCode: status,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        if (correlationId) {
            errorResponse.correlationId = correlationId;
        }

        if (service) {
            errorResponse.service = service;
        }

        // Log error with structured data
        this.logger.error(
            JSON.stringify({
                ...errorResponse,
                method: request.method,
                ip: request.ip,
                userAgent: request.headers['user-agent'],
            }),
        );

        response.status(status).json(errorResponse);
    }
}
