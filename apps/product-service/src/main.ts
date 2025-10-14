<<<<<<< HEAD
import { initializeTracing } from '@a4co/observability';
=======
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ProductModule } from './product.module';

<<<<<<< HEAD
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
=======
async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
<<<<<<< HEAD
          defaultSrc: ['\'self\''],
          styleSrc: ['\'self\'', '\'unsafe-inline\''],
          scriptSrc: ['\'self\''],
          imgSrc: ['\'self\'', 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
=======
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
<<<<<<< HEAD
    }),
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
=======
    })
  );

  // CORS configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
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

<<<<<<< HEAD
  const port = process.env['PORT'] || 3003;
  logger.info(`🚀 Product Service iniciado en puerto ${port}`);
  logger.info(`📚 Documentación Swagger: http://localhost:${port}/api`);
=======
  const port = process.env.PORT || 3003;
  console.log(`🚀 Product Service iniciado en puerto ${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api`);
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

  await app.listen(port);
}

bootstrap().catch(err => {
<<<<<<< HEAD
  logger.error('Error al iniciar el servicio:', err);
=======
  console.error('Error al iniciar el servicio:', err);
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  process.exit(1);
});
