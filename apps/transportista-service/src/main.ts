import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransportistaModule } from './transportista.module.js';
import * as process from 'process';

const logger = new Logger('TransportistaServiceBootstrap');

async function bootstrap() {
  // Create HTTP application
  const app = await NestFactory.create(TransportistaModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Transportista Service API')
    .setDescription('API for managing shipments and transportistas in A4CO platform')
    .setVersion('1.0')
    .addTag('shipments')
    .addTag('health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Connect NATS microservice for event listening
  const natsUrl = process.env['NATS_URL'] || 'nats://localhost:4222';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: 'transportista-service-queue',
    },
  });

  // Start all microservices
  await app.startAllMicroservices();
  logger.log(`✅ NATS microservice connected to ${natsUrl}`);

  // Start HTTP server
  const port = parseInt(process.env['PORT'] || '3008', 10);
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Transportista Service running on port ${port}`);
  logger.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
  logger.log(`🔌 NATS connected to ${natsUrl}`);
}

bootstrap().catch((error) => {
  logger.error('❌ Failed to start Transportista Service', error);
  process.exit(1);
});
