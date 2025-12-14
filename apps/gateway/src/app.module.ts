/**
 * A4CO Gateway - App Module
 */

import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { JwtAuthMiddleware } from './common/middleware/jwt-auth.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { configuration } from './config/configuration';
import { HealthController } from './health/health.controller';
import { ProxyModule } from './proxy/proxy.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: ['.env', '.env.local'],
        }),

        // HTTP Client for health checks
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                timeout: config.get<number>('proxy.timeout', 5000),
                maxRedirects: 5,
            }),
        }),

        // Health checks
        TerminusModule,

        // Rate limiting (100 requests per minute)
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => [
                {
                    ttl: config.get<number>('rateLimit.ttl', 60) * 1000, // Convert to ms
                    limit: config.get<number>('rateLimit.max', 100),
                },
            ],
        }),

        // Proxy module
        ProxyModule,
    ],
    controllers: [HealthController],
    providers: [
        // Global rate limiting guard
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        // Global JWT Guard (alternative to middleware)
        // Uncomment to use guard-based auth instead of middleware
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtAuthGuard,
        // },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply logging middleware to all routes
        consumer.apply(LoggerMiddleware).forRoutes('*');

        // Apply JWT auth middleware to protected routes
        consumer
            .apply(JwtAuthMiddleware)
            .exclude(
                // Public endpoints
                { path: 'api/v1/health', method: RequestMethod.GET },
                { path: 'api/v1/health/(.*)', method: RequestMethod.ALL },
                { path: 'api/docs', method: RequestMethod.GET },
                { path: 'api/docs/(.*)', method: RequestMethod.ALL },
                // Auth endpoints (login, register don't need auth)
                { path: 'api/v1/auth/login', method: RequestMethod.POST },
                { path: 'api/v1/auth/register', method: RequestMethod.POST },
                { path: 'api/v1/auth/refresh', method: RequestMethod.POST },
                { path: 'api/v1/auth/verify', method: RequestMethod.POST },
                { path: 'api/v1/auth/password/reset', method: RequestMethod.POST },
                // Products are public for browsing
                { path: 'api/v1/products', method: RequestMethod.GET },
                { path: 'api/v1/products/(.*)', method: RequestMethod.GET },
            )
            .forRoutes('*');
    }
}
