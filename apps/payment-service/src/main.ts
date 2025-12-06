/// <reference types="node" />

import { getLogger, initializeTracing } from '@a4co/observability';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  // === OBSERVABILIDAD ===
  initializeTracing({
    serviceName: 'payment-service',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
  });

  const logger = getLogger();

  // === APP HÍBRIDA (HTTP + NATS) ===
  const app = await NestFactory.create(PaymentModule, {
    logger: false,
  });

  // === CONEXIÓN NATS ===
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
      queue: 'payment_queue',
    },
  });

  // === SEGURIDAD ===
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

  // === VALIDACIÓN GLOBAL ===
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // === BRACES MIDDLEWARE ELIMINADO (ya no existe) ===
  // Si necesitas protección contra ataques de expansión en el futuro:
  // → Usa express-braces-attack o confía en ValidationPipe + class-validator

  // === CORS ===
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // === SWAGGER ===
  const config = new DocumentBuilder()
    .setTitle('A4CO Payment Service')
    .setDescription('Servicio de procesamiento de pagos para la plataforma A4CO')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Payments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // === PUERTO Y ARRANQUE ===
  const port = process.env.PORT ? Number(process.env.PORT) : 3006;

  await app.startAllMicroservices();
  await app.listen(port);

  logger.info('NATS microservice conectado (payment_queue)');
  logger.info(`Payment Service corriendo en http://localhost:${port}`);
  logger.info(`Documentación: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  const logger = getLogger();
  logger.error('Error al iniciar Payment Service:', err);
  process.exit(1);
});
