import { initializeTracing } from '@a4co/observability';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ProductModule } from './product.module';

// Simple logger for now until observability package is fixed
const logger = {
  log: (message: string) => console.log(`[LOG] ${message}`),
  info: (message: string) => console.log(`[INFO] ${message}`),
  warn: (message: string) => console.warn(`[WARN] ${message}`),
  error: (message: string, err?: any) => console.error(`[ERROR] ${message}`, err),
  debug: (message: string) => console.debug(`[DEBUG] ${message}`),
  verbose: (message: string) => console.log(`[VERBOSE] ${message}`),
  pinoHttpMiddleware: () => (req: any, res: any, next: any) => next(),
};

async function bootstrap() {
  // Initialize observability
  initializeTracing({
    serviceName: 'product-service',
    serviceVersion: '1.0.0',
    environment: process.env['NODE_ENV'] || 'development',
  });

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
  process.exit(1);
});
