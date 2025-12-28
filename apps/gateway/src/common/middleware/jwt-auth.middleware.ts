/**
 * JWT Authentication Middleware
 * Validates incoming JWT tokens and propagates userId to downstream services
 */

import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
    sub: string;        // userId
    email?: string;
    role?: string;
    iat?: number;
    exp?: number;
}

// Extend Express Request to include user info
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace Express {
        interface User extends JwtPayload {}
        interface Request {
            userId?: string;
        }
    }
}
/* eslint-enable @typescript-eslint/no-namespace */

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger(JwtAuthMiddleware.name);
    private readonly jwtSecret: string;
    private readonly skipPaths: string[];

    constructor(private readonly configService: ConfigService) {
        const secret = this.configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET environment variable must be set');
        }
        this.jwtSecret = secret;

        // Paths that don't require authentication
        this.skipPaths = [
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/auth/refresh',
            '/api/v1/auth/verify',
            '/api/v1/auth/password/reset',
            '/api/v1/health',
            '/api/v1/health/live',
            '/api/v1/health/ready',
            '/api/v1/health/services',
            '/api/docs',
        ];
    }

    use(req: Request, res: Response, next: NextFunction): void {
        const requestId = req.headers['x-request-id'] as string || 'unknown';

        // Skip authentication for public paths
        if (this.shouldSkipAuth(req.path)) {
            this.logger.debug(`[${requestId}] Skipping auth for public path: ${req.path}`);
            return next();
        }

        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            this.logger.warn(`[${requestId}] Missing Authorization header for ${req.path}`);
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Missing authorization header',
                error: 'Unauthorized',
            });
        }

        // Validate Bearer token format
        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            this.logger.warn(`[${requestId}] Invalid token format for ${req.path}`);
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Invalid authorization header format. Expected: Bearer <token>',
                error: 'Unauthorized',
            });
        }

        try {
            // Verify and decode the JWT
            const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;

            // Attach user info to request
            req.user = payload;
            req.userId = payload.sub;

            // Add user info to headers for downstream services
            req.headers['x-user-id'] = payload.sub;
            req.headers['x-user-email'] = payload.email || '';
            req.headers['x-user-role'] = payload.role || '';

            this.logger.debug(
                `[${requestId}] JWT validated for user: ${payload.sub} (${payload.email})`,
            );

            next();
        } catch (error) {
            this.handleJwtError(error, requestId);
        }
    }

    /**
     * Check if the path should skip authentication
     */
    private shouldSkipAuth(path: string): boolean {
        // Exact match
        if (this.skipPaths.includes(path)) {
            return true;
        }

        // Prefix match for certain paths
        const skipPrefixes = [
            '/api/docs',
            '/api/v1/products', // Products are public for browsing
        ];

        return skipPrefixes.some(prefix => path.startsWith(prefix));
    }

    /**
     * Handle JWT verification errors
     */
    private handleJwtError(error: unknown, requestId: string): never {
        if (error instanceof jwt.TokenExpiredError) {
            this.logger.warn(`[${requestId}] Token expired`);
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Token has expired',
                error: 'TokenExpired',
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            this.logger.warn(`[${requestId}] Invalid token: ${error.message}`);
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Invalid token',
                error: 'InvalidToken',
            });
        }

        if (error instanceof jwt.NotBeforeError) {
            this.logger.warn(`[${requestId}] Token not yet valid`);
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Token is not yet valid',
                error: 'TokenNotActive',
            });
        }

        this.logger.error(`[${requestId}] Unknown JWT error:`, error);
        throw new UnauthorizedException({
            statusCode: 401,
            message: 'Authentication failed',
            error: 'Unauthorized',
        });
    }
}
