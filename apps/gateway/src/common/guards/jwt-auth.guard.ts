/**
 * JWT Authentication Guard
 * Can be used as an alternative to middleware for route-level protection
 */

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload } from '../middleware/jwt-auth.middleware';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);
    private readonly jwtSecret: string;

    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) {
        const secret = this.configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not set. The application cannot start without a JWT secret.');
        }
        this.jwtSecret = secret;
    }

    canActivate(context: ExecutionContext): boolean {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const requestId = request.headers['x-request-id'] as string || 'unknown';

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            this.logger.warn(`[${requestId}] No token provided`);
            throw new UnauthorizedException('No authentication token provided');
        }

        try {
            const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;

            // Attach to request
            request.user = payload;
            request.userId = payload.sub;

            // Propagate to headers for downstream services
            request.headers['x-user-id'] = payload.sub;
            request.headers['x-user-email'] = payload.email || '';
            request.headers['x-user-role'] = payload.role || '';

            this.logger.debug(`[${requestId}] Authenticated user: ${payload.sub}`);

            return true;
        } catch {
            this.logger.warn(`[${requestId}] Token validation failed`);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
