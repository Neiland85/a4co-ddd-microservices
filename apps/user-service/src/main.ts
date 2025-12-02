// apps/user-service/src/main.ts

import { getLogger, initializeTracing } from '@a4co/observability';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { UserModule } from './user.module';

async function bootstrap() {
  // === OBSERVABILIDAD ===
  initializeTracing({
    serviceName: 'user-service',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
  });

  const logger = getLogger();

  // === APP ===
  const app = await NestFactory.create(UserModule, { logger: false });

  // === SEGURIDAD ===
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // === VALIDACIÓN ===
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

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
  });

  // === SWAGGER ===
  const config = new DocumentBuilder()
    .setTitle('A4CO User Service')
    .setDescription('Servicio de gestión de usuarios para la plataforma A4CO')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // === ARRANQUE ===
  const port = process.env.PORT ? Number(process.env.PORT) : 3005;
  await app.listen(port);

  logger.info(`User Service corriendo en http://localhost:${port}`);
  logger.info(`Documentación: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  const logger = getLogger();
  logger.error('Error al iniciar User Service:', err);
  process.exit(1);
});
