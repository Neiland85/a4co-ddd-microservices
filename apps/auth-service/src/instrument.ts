import * as Sentry from '@sentry/node';
import * as uptrace from '@uptrace/node';

const environment = process.env.NODE_ENV ?? 'development';
const serviceName = process.env.SERVICE_NAME ?? 'auth-service';

// --- Sentry ---
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment,
    release: process.env.npm_package_version ?? '1.0.0',
    tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
    profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
  });
  console.log(`[Sentry] inicializado para ${serviceName}`);
}

// --- Uptrace ---
if (process.env.UPTRACE_DSN) {
  uptrace.configureOpentelemetry({
    dsn: process.env.UPTRACE_DSN,
    serviceName,
    serviceVersion: process.env.npm_package_version ?? '1.0.0',
  });
  console.log(`[Uptrace] tracing activo para ${serviceName}`);
}
