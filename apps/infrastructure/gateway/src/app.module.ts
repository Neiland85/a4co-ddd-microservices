/**
 * A4CO Gateway - App Module
 */

import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { JwtAuthMiddleware } from './common/middleware/jwt-auth.middleware';
import { configuration } from './config/configuration';
import { HealthController } from './health/health.controller';
import { StructuredLogger } from './logger/structured.logger';
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

        // Passport for JWT strategy
        PassportModule.register({ defaultStrategy: 'jwt' }),

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
        // JWT Strategy for Passport
        JwtStrategy,
        // Global HTTP exception filter
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        // Global rate limiting guard
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply correlation ID middleware first (to all routes)
        consumer.apply(CorrelationIdMiddleware).forRoutes('*');

        // Apply structured logging middleware (to all routes)
        consumer.apply(StructuredLogger).forRoutes('*');

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
