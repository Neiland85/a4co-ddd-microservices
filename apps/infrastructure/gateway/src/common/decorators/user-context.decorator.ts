/**
 * User Context Decorator
 * Extract user information from authenticated request
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserContext {
    userId: string;
    email?: string;
    role?: string;
}

/**
 * Decorator to extract user context from request
 * @example
 * @Get('profile')
 * getProfile(@UserContext() user: UserContext) {
 *   return { userId: user.userId, email: user.email };
 * }
 */
export const UserContext = createParamDecorator(
    (data: keyof UserContext | undefined, ctx: ExecutionContext): UserContext | string | undefined => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return undefined;
        }

        // If a specific property is requested, return just that
        if (data) {
            return user[data];
        }

        // Return the whole user context
        return user;
    },
);
