import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as process from 'process';
import { OrderModule } from './order.module.js';

const bootstrapLogger = new Logger('OrderServiceBootstrap');

async function bootstrap() {
  const logger = bootstrapLogger;

  const app = await NestFactory.create(OrderModule, {
    logger: false, // Disable default NestJS logger for now
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
    }),
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
    }),
  );

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

  const port = Number(process.env['PORT']) || 3004;
  logger.log(`🚀 Order Service iniciado en puerto ${port}`);
  logger.log(`📚 Documentación Swagger: http://localhost:${port}/api`);
  console.log(`🚀 Order Service iniciado en puerto ${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api`);

  await app.listen(port);
}

bootstrap().catch((err) => {
  bootstrapLogger.error('Error al iniciar el servicio:', err);
  console.error('Error al iniciar el servicio:', err);
  process.exit(1);
});
