import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('InventoryService');

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? Number(process.env.PORT) : 3003;

  const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: 'inventory-service',
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`Inventory Service en http://localhost:${port}`);
  logger.log(`Conectado a NATS en ${natsUrl}`);
}
bootstrap();
