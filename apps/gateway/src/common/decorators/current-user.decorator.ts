/**
 * Current User Decorator
 * Extract the authenticated user from the request
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../middleware/jwt-auth.middleware';

/**
 * Decorator to extract the current user from the request
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 * 
 * @Get('profile')
 * getProfile(@CurrentUser('sub') userId: string) {
 *   return userId;
 * }
 */
export const CurrentUser = createParamDecorator(
    (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const user = request.user;

        if (!user) {
            return null;
        }

        return data ? user[data] : user;
    },
);

/**
 * Decorator to extract just the userId from the request
 */
export const UserId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string | undefined => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.userId;
    },
);
