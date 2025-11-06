/// <reference types="node" />

import { getLogger, initializeTracing } from '@a4co/observability';
import { BracesSecurityMiddleware } from '@a4co/shared-utils';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as process from 'process';
import { PaymentModule } from './payment.module';
import { NATS_CONFIG } from './infrastructure/nats/nats.constants';

async function bootstrap() {
  // Initialize observability
  initializeTracing({
    serviceName: 'payment-service',
    serviceVersion: '1.0.0',
    environment: process.env['NODE_ENV'] || 'development',
  });

  // Get logger instance
  const logger = getLogger();

  const app = await NestFactory.create(PaymentModule, {
    logger: false, // Disable default NestJS logger
  });

  // Connect microservice for NATS event handlers
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: NATS_CONFIG,
  });

  await app.startAllMicroservices();

  // Security middleware
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
    })
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Braces security middleware
  const bracesMiddleware = new BracesSecurityMiddleware({
    maxExpansionSize: 50,
    maxRangeSize: 10,
    monitoringEnabled: true,
  });
  app.use(bracesMiddleware.validateRequestBody());
  app.use(bracesMiddleware.validateQueryParams());

  // CORS configuration
  app.enableCors({
    origin: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('A4CO Payment Service')
    .setDescription('Servicio de procesamiento de pagos para la plataforma A4CO')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Payments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env['PORT'] || 3006;
  logger.info(`🚀 Payment Service iniciado en puerto ${port}`);
  logger.info(`📚 Documentación Swagger: http://localhost:${port}/api`);

  await app.listen(port);
}

bootstrap().catch(err => {
  const logger = getLogger();
  logger.error('Error al iniciar el servicio:', err);
  process.exit(1);
});
