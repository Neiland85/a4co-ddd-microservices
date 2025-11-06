import { BracesSecurityMiddleware } from '@a4co/shared-utils';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as process from 'process';
import { getLogger, initializeTracing } from '../../../packages/observability/dist';
import { OrderModule } from './order.module';

async function bootstrap() {
  // Initialize observability
  initializeTracing({
    serviceName: 'order-service',
    serviceVersion: '1.0.0',
    environment: process.env['NODE_ENV'] || 'development',
  });

  // Get logger instance
  const logger = getLogger();

  const app = await NestFactory.create(OrderModule, {
    logger: false, // Disable default NestJS logger for now
  });

  // Connect microservice for NATS event patterns
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: process.env.NATS_URL || 'nats://localhost:4222',
      token: process.env.NATS_AUTH_TOKEN || '',
      name: 'order-service',
    },
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
    })
  );

  // CORS
  app.enableCors({
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Braces security middleware
  const bracesMiddleware = new BracesSecurityMiddleware(
    {
      maxExpansionSize: 50,
      maxRangeSize: 10,
      monitoringEnabled: true,
    },
    'order-service'
  );
  app.use(bracesMiddleware.validateRequestBody());
  app.use(bracesMiddleware.validateQueryParams());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('API for order management in A4CO platform')
    .setVersion('1.0')
    .addTag('orders', 'Order management endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env['PORT'] || 3004;
  logger.info(`🚀 Order Service iniciado en puerto ${port}`);
  logger.info(`📚 Documentación Swagger: http://localhost:${port}/api`);
  console.log(`🚀 Order Service iniciado en puerto ${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api`);

  await app.listen(port);
}

bootstrap().catch(err => {
  const logger = getLogger();
  logger.error('Error al iniciar el servicio:', err);
  console.error('Error al iniciar el servicio:', err);
  process.exit(1);
});
