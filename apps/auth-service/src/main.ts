import { initializeTracing, logger } from '@a4co/observability';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AuthModule } from './auth.module';

type TracingConfig = {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
};

function initializeTracing(config: TracingConfig): NodeSDK {
  // Crear recurso con metadatos del servicio
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || 'development',
      [SemanticResourceAttributes.SERVICE_INSTANCE_ID]:
        process.env.HOSTNAME || `${config.serviceName}-${Date.now()}`,
      [SemanticResourceAttributes.PROCESS_PID]: process.pid,
      [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'nodejs',
      [SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: process.version,
    })
  );

  // Configurar propagadores para context propagation
  const propagators = new CompositePropagator([
    new W3CTraceContextPropagator(),
    new B3Propagator({
      injectEncoding: B3InjectEncoding.MULTI_HEADER,
    }),
  ]);

  // ...existing code...
}

async function bootstrap() {
  // Initialize observability
  initializeTracing('auth-service', {
    serviceName: 'auth-service',
    serviceVersion: '1.0.0',
    environment: process.env['NODE_ENV'] || 'development',
  });

  const app = await NestFactory.create(AuthModule, {
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
    .setTitle('A4CO Auth Service')
    .setDescription('Servicio de autenticación para la plataforma A4CO')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env['PORT'] || 3001;
  await app.listen(port);

  logger.info(`🚀 Auth Service running on: http://localhost:${port}`);
  logger.info(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
