import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  createApp,
  getPort,
  setupSwagger,
  createStandardSwaggerConfig,
} from '@a4co/shared-utils';
import { InventoryModule } from './inventory.module';

const logger = new Logger('InventoryService');

async function bootstrap() {
  // === APP (usando shared-utils) ===
  const app = await createApp(InventoryModule, {
    serviceName: 'Inventory Service',
    port: 3006,
    globalPrefix: 'api/inventory',
    enableSwagger: true,
  });

  // === NATS Microservice (for event listening) ===
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env['NATS_URL'] || 'nats://localhost:4222'],
      queue: 'inventory-service-queue',
    },
  });

  // === SWAGGER ===
  setupSwagger(
    app,
    {
      ...createStandardSwaggerConfig(
        'Inventory Service',
        'Gestión de inventario para a4co-ddd-microservices',
        '1.0',
        ['inventory', 'products', 'reservations']
      ),
      path: 'api/inventory/docs',
    }
  );

  // Start all microservices
  await app.startAllMicroservices();
  logger.log('🔌 NATS microservice connected and listening for events');

  const port = getPort({ serviceName: 'Inventory Service', port: 3006 });
  await app.listen(port);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Inventory Service is running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Server:     http://localhost:${port}/api/inventory
📚 Swagger:    http://localhost:${port}/api/inventory/docs
🔍 Health:     http://localhost:${port}/api/inventory/health

  Environment:  ${process.env['NODE_ENV'] || 'development'}
  Database:     ${process.env['DATABASE_URL'] ? '✅ Connected' : '⚠️  Not configured'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

bootstrap().catch((err) => {
  logger.error('Error al iniciar Inventory Service:', err);
  process.exit(1);
});

