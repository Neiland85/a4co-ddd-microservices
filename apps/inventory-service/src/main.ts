import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { InventoryModule } from './inventory.module';

async function bootstrap() {
  // Create HTTP application
  const app = await NestFactory.create(InventoryModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Connect to NATS as microservice for event handling
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: process.env.NATS_URL?.split(',') || ['nats://localhost:4222'],
      name: 'inventory-service',
    },
  });

  // Security
  app.use(helmet());

  // Logging
  app.use(morgan('combined'));

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/inventory');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Inventory Service API')
    .setDescription('Gestión de inventario para a4co-ddd-microservices')
    .setVersion('1.0')
    .addTag('inventory')
    .addTag('products')
    .addTag('reservations')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/inventory/docs', app, document);

  // Start microservice listeners
  await app.startAllMicroservices();

  const port = process.env.PORT || 3006;
  await app.listen(port);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Inventory Service is running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Server:     http://localhost:${port}/api/inventory
📚 Swagger:    http://localhost:${port}/api/inventory/docs
🔍 Health:     http://localhost:${port}/api/inventory/health
📡 NATS:       ${process.env.NATS_URL || 'nats://localhost:4222'}

Environment:  ${process.env.NODE_ENV || 'development'}
Database:     ${process.env.DATABASE_URL ? '✅ Connected' : '⚠️  Not configured'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

bootstrap();

