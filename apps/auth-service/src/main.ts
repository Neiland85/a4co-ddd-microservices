import '../instrument';
import { getLogger, initializeTracing } from '@a4co/observability';
import {
  createApp,
  getPort,
  setupSwagger,
  createStandardSwaggerConfig,
  logServiceStartup,
  logServiceStartupError,
} from '@a4co/shared-utils';
import { AuthModule } from './auth.module';

initializeTracing({
  serviceName: 'auth-service',
  serviceVersion: '1.0.0',
  environment: process.env['NODE_ENV'] ?? 'development',
});

const logger = getLogger();

async function bootstrap() {
  // === APP (usando shared-utils) ===
  const app = await createApp(AuthModule, {
    serviceName: 'Auth Service',
    port: 3001,
    globalPrefix: 'api/v1',
    enableSwagger: true,
  });

  // === SWAGGER ===
  setupSwagger(
    app,
    {
      ...createStandardSwaggerConfig('Auth Service', 'Servicio de autenticación', '1.0'),
      path: 'api/docs',
    }
  );

  const port = getPort({ serviceName: 'Auth Service', port: 3001 });
  await app.listen(port);
  
  logServiceStartup(logger, 'Auth Service', port, {
    swaggerPath: 'api/docs',
    environment: process.env['NODE_ENV'] ?? 'development',
  });
}

bootstrap().catch((err) => {
  logServiceStartupError(logger, 'Auth Service', err);
  process.exit(1);
});
