import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as uptrace from '@uptrace/node';

const environment = process.env.NODE_ENV || 'development';
const serviceName = process.env.SERVICE_NAME || 'auth-service';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [nodeProfilingIntegration()],
  });
  console.log(`[Sentry] initialized for ${serviceName} (${environment})`);
}

// --- Uptrace ---
if (process.env.UPTRACE_DSN) {
  uptrace.configureOpentelemetry({
    dsn: process.env.UPTRACE_DSN,
    serviceName,
    serviceVersion: process.env.npm_package_version || '1.0.0',
  });
  console.log(`[Uptrace] tracing active for ${serviceName}`);
}

