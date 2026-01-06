// apps/user-service/src/main.ts

import { getLogger, initializeTracing } from '@a4co/observability';
import {
  createApp,
  getPort,
  setupSwagger,
  createStandardSwaggerConfig,
  logServiceStartup,
  logServiceStartupError,
} from '@a4co/shared-utils';
import { UserModule } from './user.module';

async function bootstrap() {
  // === OBSERVABILIDAD ===
  initializeTracing({
    serviceName: 'user-service',
    serviceVersion: '1.0.0',
    environment: process.env['NODE_ENV'] ?? 'development',
  });

  const logger = getLogger();

  // === APP ===
  const app = await createApp(UserModule, {
    serviceName: 'User Service',
    port: 3005,
    disableLogger: false,
    enableSwagger: true,
  });

  // === SWAGGER ===
  setupSwagger(
    app,
    createStandardSwaggerConfig(
      'User Service',
      'Servicio de gestión de usuarios para la plataforma A4CO',
      '1.0',
      ['Users']
    )
  );

  // === ARRANQUE ===
  const port = getPort({ serviceName: 'User Service', port: 3005 });
  await app.listen(port);

  logServiceStartup(logger, 'User Service', port, {
    swaggerPath: 'api',
    environment: process.env['NODE_ENV'] ?? 'development',
  });
}

bootstrap().catch(err => {
  const logger = getLogger();
  logServiceStartupError(logger, 'User Service', err);
  process.exit(1);
});
