import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TraceContextMiddleware } from '@a4co/observability';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import { OrderModule } from './order.module.js';

const bootstrapLogger = new Logger('OrderServiceBootstrap');

async function bootstrap() {
  const logger = bootstrapLogger;

  const port = Number(process.env['PORT'] ?? 3004);
  const app = await NestFactory.create(OrderModule);

  app.enableCors({
    origin: [process.env['CORS_ORIGIN'] || 'http://localhost:3000'],
    credentials: true,
  });

  // === OBSERVABILITY: Apply trace context middleware ===
  type TraceReq = Parameters<TraceContextMiddleware['use']>[0];
  type TraceRes = Parameters<TraceContextMiddleware['use']>[1];
  type TraceNext = Parameters<TraceContextMiddleware['use']>[2];

  app.use((req: unknown, res: unknown, next: unknown) => {
    const middleware = new TraceContextMiddleware();
    middleware.use(req as TraceReq, res as TraceRes, next as TraceNext);
  });

  // === NATS Microservice (for event listening) ===
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env['NATS_URL'] || 'nats://localhost:4222'],
      queue: 'order-service-queue',
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Order Service')
    .setDescription('API for order management in A4CO platform')
    .setVersion('1.0')
    .addTag('orders')
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(
    app as unknown as Parameters<typeof SwaggerModule.createDocument>[0],
    swaggerConfig,
  );
  SwaggerModule.setup('api', app as unknown as Parameters<typeof SwaggerModule.setup>[1], document);

  // Start all microservices
  await app.startAllMicroservices();
  logger.log('🔌 NATS microservice connected and listening for events');

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
