import { BracesSecurityMiddleware } from '@a4co/shared-utils';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ProductModule } from './product.module';

// Simple logger for now until observability package is fixed
import type { Request, Response, NextFunction } from 'express';

const logger = {
  log: (message: string) => console.log(`[LOG] ${message}`),
  info: (message: string) => console.log(`[INFO] ${message}`),
  warn: (message: string) => console.warn(`[WARN] ${message}`),
  error: (message: string, err?: unknown) => console.error(`[ERROR] ${message}`, err),
  debug: (message: string) => console.debug(`[DEBUG] ${message}`),
  verbose: (message: string) => console.log(`[VERBOSE] ${message}`),
  pinoHttpMiddleware: () => (req: Request, res: Response, next: NextFunction) => next(),
};

async function bootstrap() {
  const app = await NestFactory.create(ProductModule, { logger });

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
    .setTitle('A4CO Product Service')
    .setDescription('Servicio de gestión de productos para la plataforma A4CO')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Products')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env['PORT'] || 3003;
  logger.info(`🚀 Product Service iniciado en puerto ${port}`);
  logger.info(`📚 Documentación Swagger: http://localhost:${port}/api`);

  await app.listen(port);
}

bootstrap().catch(err => {
  logger.error('Error al iniciar el servicio:', err);
  console.error('Error al iniciar el servicio:', err);
  process.exit(1);
});
