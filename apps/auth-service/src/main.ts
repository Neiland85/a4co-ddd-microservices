import '../instrument';
import { getLogger, initializeTracing } from '@a4co/observability';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AuthModule } from './auth.module';

initializeTracing({
  serviceName: 'auth-service',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV ?? 'development',
});

const logger = getLogger();

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

  const allowed = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(',').map(o => o.trim());
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowed.some(a => origin.startsWith(a))) callback(null, true);
      else callback(new Error('CORS not allowed'));
    },
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('A4CO Auth Service')
    .setDescription('Servicio de autenticación')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);
  logger.info(`Auth Service corriendo en http://localhost:${port}`);
  logger.info(`Docs: http://localhost:${port}/api/docs`);
}

bootstrap().catch(err => {
  logger.error('Error al iniciar', err);
  process.exit(1);
});
