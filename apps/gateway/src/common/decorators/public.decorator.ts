/**
 * Public Route Decorator
 * Mark routes as public to skip JWT authentication
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route as public (no authentication required)
 * @example
 * @Public()
 * @Get('products')
 * listProducts() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
