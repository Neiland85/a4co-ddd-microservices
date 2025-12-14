import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Error response interface for exception filter
 */
export interface ExceptionErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  stack?: string;
}

/**
 * Global exception filter to handle all exceptions
 * Provides consistent error responses across all services
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const errorResponse = this.buildErrorResponse(exception, request, status);

    // Log the error
    this.logError(exception, request, status);

    response.status(status).json(errorResponse);
  }

  /**
   * Determines the HTTP status code from the exception
   */
  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Builds a standardized error response
   */
  private buildErrorResponse(
    exception: unknown,
    request: Request,
    status: number,
  ): ExceptionErrorResponse {
    const errorResponse: ExceptionErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: this.getErrorMessage(exception),
    };

    // Add error name for non-production environments
    if (process.env['NODE_ENV'] !== 'production') {
      errorResponse.error = this.getErrorName(exception);
      
      // Add stack trace in development
      if (process.env['NODE_ENV'] === 'development') {
        const stack = this.getErrorStack(exception);
        if (stack !== undefined) {
          errorResponse.stack = stack;
        }
      }
    }

    return errorResponse;
  }

  /**
   * Extracts the error message from the exception
   */
  private getErrorMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null && 'message' in response) {
        return (response as any).message;
      }
      return exception.message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  /**
   * Gets the error name/type
   */
  private getErrorName(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.name;
    }
    if (exception instanceof Error) {
      return exception.name;
    }
    return 'UnknownError';
  }

  /**
   * Gets the error stack trace
   */
  private getErrorStack(exception: unknown): string | undefined {
    if (exception instanceof Error) {
      return exception.stack;
    }
    return undefined;
  }

  /**
   * Logs the error with appropriate context
   */
  private logError(exception: unknown, request: Request, status: number): void {
    const message = this.getErrorMessage(exception);
    const context = {
      path: request.url,
      method: request.method,
      statusCode: status,
      user: (request as any).user?.id,
    };

    if (status >= 500) {
      this.logger.error(message, exception instanceof Error ? exception.stack : '', context);
    } else {
      this.logger.warn(message, context);
    }
  }
}
