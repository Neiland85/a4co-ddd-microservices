// Sentry y Uptrace deben inicializarse antes de NestJS
import '../instrument';

import { getLogger, initializeTracing } from '@a4co/observability';
import { BracesSecurityMiddleware } from '@a4co/shared-utils';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AuthModule } from './auth.module';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  // --- Uptrace (OpenTelemetry) ---
  initializeTracing({
    serviceName: 'auth-service',
    serviceVersion: '1.0.0',
    environment: (process.env as any)['NODE_ENV'] || 'development',
  });

  const logger = getLogger();
  const app = await NestFactory.create(AuthModule);

  // --- Sentry Handlers (after NestFactory.create) ---
  app.use(
    Sentry.setupNestErrorHandler(app, {
      catch: (exception: any, host: any) => {
        // Custom error handling logic if needed
        throw exception;
      },
    }),
  );

  // Tracing middleware - commented out as tracingIntegration may not be available
  // app.use(Sentry.tracingIntegration().middleware);

  // --- Security middleware ---
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // --- Braces security middleware ---
  const bracesMiddleware = new BracesSecurityMiddleware({
    maxExpansionSize: 50,
    maxRangeSize: 10,
    monitoringEnabled: true,
  });
  app.use(bracesMiddleware.validateRequestBody());
  app.use(bracesMiddleware.validateQueryParams());

  // --- Global validation pipe ---
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // --- CORS configuration ---
  app.enableCors({
    origin: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // --- Swagger documentation ---
  const config = new DocumentBuilder()
    .setTitle('A4CO Auth Service')
    .setDescription('Servicio de autenticación para la plataforma A4CO')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // --- Global prefix ---
  app.setGlobalPrefix('api/v1');

  // --- Sentry Error Handler (must be after routes) ---
  // Error handler is automatically added by setupNestErrorHandler

  const port = process.env['PORT'] || 3001;
  await app.listen(port);

  logger.info(`Auth Service running on: http://localhost:${port}`);
  logger.info(`API Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
