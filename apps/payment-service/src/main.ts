/// <reference types="node" />

import { getLogger, initializeTracing } from '@a4co/observability';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import {
  applySecurityMiddleware,
  applyValidationPipe,
  applyCorsConfiguration,
  setupSwagger,
  createStandardSwaggerConfig,
  logServiceStartup,
  logServiceStartupError,
  getPort,
} from '@a4co/shared-utils';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  // === OBSERVABILIDAD ===
  initializeTracing({
    serviceName: 'payment-service',
    serviceVersion: '1.0.0',
    environment: process.env['NODE_ENV'] ?? 'development',
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
      servers: [process.env['NATS_URL'] ?? 'nats://localhost:4222'],
      queue: 'payment_queue',
    },
  });

  // === SEGURIDAD, VALIDACIÓN Y CORS (usando shared-utils) ===
  applySecurityMiddleware(app, { serviceName: 'Payment Service' });
  applyValidationPipe(app);
  applyCorsConfiguration(app, {
    serviceName: 'Payment Service',
    corsConfig: {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
  });

  // === SWAGGER ===
  setupSwagger(
    app,
    createStandardSwaggerConfig(
      'Payment Service',
      'Servicio de procesamiento de pagos para la plataforma A4CO',
      '1.0',
      ['Payments']
    )
  );

  // === PUERTO Y ARRANQUE ===
  const port = getPort({ serviceName: 'Payment Service', port: 3006 });

  await app.startAllMicroservices();
  await app.listen(port);

  logger.info('NATS microservice conectado (payment_queue)');
  logServiceStartup(logger, 'Payment Service', port, {
    swaggerPath: 'api',
    environment: process.env['NODE_ENV'] ?? 'development',
  });
}

bootstrap().catch(err => {
  const logger = getLogger();
  logServiceStartupError(logger, 'Payment Service', err);
  process.exit(1);
});
