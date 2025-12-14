import { Logger } from '@nestjs/common';
import {
  createApp,
  getPort,
  setupSwagger,
  createStandardSwaggerConfig,
  logServiceStartup,
  logServiceStartupError,
} from '@a4co/shared-utils';
import { ProductModule } from './product.module';

const logger = new Logger('ProductService');

async function bootstrap() {
  // === APP (usando shared-utils) ===
  const app = await createApp(ProductModule, {
    serviceName: 'Product Service',
    port: 3003,
    enableSwagger: true,
    corsConfig: {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
  });

  // === SWAGGER ===
  setupSwagger(
    app,
    createStandardSwaggerConfig(
      'Product Service',
      'Servicio de gestión de productos para la plataforma A4CO',
      '1.0',
      ['Products']
    )
  );

  const port = getPort({ serviceName: 'Product Service', port: 3003 });
  await app.listen(port);

  logServiceStartup(logger, 'Product Service', port, {
    swaggerPath: 'api',
    environment: process.env['NODE_ENV'] ?? 'development',
  });
}

bootstrap().catch(err => {
  logServiceStartupError(logger, 'Product Service', err);
  process.exit(1);
});
