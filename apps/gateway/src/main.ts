/**
 * A4CO API Gateway - Main Entry Point
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Gateway');

    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 4000);
    const corsOrigins = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

    // Security middleware
    app.use(
        helmet({
            contentSecurityPolicy: false, // Disable for API
            crossOriginEmbedderPolicy: false,
        }),
    );

    // CORS configuration
    app.enableCors({
        origin: corsOrigins.split(',').map((o) => o.trim()),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Correlation-ID'],
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // API prefix
    app.setGlobalPrefix('api/v1');

    // Swagger documentation
    const swaggerConfig = new DocumentBuilder()
        .setTitle('A4CO API Gateway')
        .setDescription('API Gateway for A4CO Microservices Platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('health', 'Health check endpoints')
        .addTag('auth', 'Authentication service proxy')
        .addTag('products', 'Products service proxy')
        .addTag('orders', 'Orders service proxy')
        .addTag('inventory', 'Inventory service proxy')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(port);

    logger.log(`🚀 Gateway running on http://localhost:${port}`);
    logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
    logger.log(`❤️  Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();
