import { Logger } from '@nestjs/common';
import {
  createApp,
  getPort,
  setupSwagger,
  createStandardSwaggerConfig,
} from '@a4co/shared-utils';
import * as process from 'process';
import { OrderModule } from './order.module.js';

const bootstrapLogger = new Logger('OrderServiceBootstrap');

async function bootstrap() {
  const logger = bootstrapLogger;

  // === APP (usando shared-utils) ===
  const app = await createApp(OrderModule, {
    serviceName: 'Order Service',
    port: 3004,
    disableLogger: false,
    enableSwagger: true,
    allowedOrigins: [process.env['CORS_ORIGIN'] || 'http://localhost:3000'],
  });

  // === SWAGGER ===
  setupSwagger(
    app,
    createStandardSwaggerConfig(
      'Order Service',
      'API for order management in A4CO platform',
      '1.0',
      ['orders', 'health']
    )
  );

  const port = getPort({ serviceName: 'Order Service', port: 3004 });
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
