/// <reference types="node" />

import { getLogger, initializeTracing } from '@a4co/observability';
import { BracesSecurityMiddleware } from '@a4co/shared-utils';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as process from 'process';
import { PaymentModule } from './payment.module';

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

  // Configure NATS microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env['NATS_URL'] || 'nats://localhost:4222'],
      queue: 'payment_queue',
    },
  });

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
  const bracesMiddleware = new BracesSecurityMiddleware();
  app.use(bracesMiddleware.use.bind(bracesMiddleware));

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

  const port = process.env['PORT'] ? Number(process.env['PORT']) : 3006;

  // Start all microservices
  await app.startAllMicroservices();
  logger.info('🔌 NATS microservice conectado');

  // Start HTTP server
  await app.listen(port);
  logger.info(`🚀 Payment Service iniciado en puerto ${port}`);
  logger.info(`📚 Documentación Swagger: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  const logger = getLogger();
  logger.error('Error al iniciar el servicio:', err);
  process.exit(1);
});
