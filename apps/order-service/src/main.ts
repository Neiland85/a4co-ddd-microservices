import { initializeTracing, logger } from '@a4co/observability';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { OrderModule } from './order.module';

async function bootstrap() {
  // Initialize observability
  initializeTracing('order-service', {
    serviceName: 'order-service',
    serviceVersion: '1.0.0',
    environment: process.env['NODE_ENV'] || 'development',
  });

  const app = await NestFactory.create(OrderModule, {
    logger: logger,
  });

  // Use Pino HTTP middleware for request logging
  app.use(logger.pinoHttpMiddleware());

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

  // CORS configuration
  app.enableCors({
    origin: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('A4CO Order Service')
    .setDescription('Servicio de gestión de órdenes para la plataforma A4CO')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env['PORT'] || 3004;
  logger.info(`🚀 Order Service iniciado en puerto ${port}`);
  logger.info(`📚 Documentación Swagger: http://localhost:${port}/api`);

  await app.listen(port);
}

bootstrap().catch(err => {
  logger.error('Error al iniciar el servicio:', err);
  process.exit(1);
});
