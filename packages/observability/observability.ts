import * as Sentry from '@sentry/node';
import * as uptrace from '@uptrace/node';

export function initObservability(serviceName: string) {
  // --- SENTRY ---
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      release: `${serviceName}@${process.env.npm_package_version || '1.0.0'}`,
    });
    console.log(`[Sentry] initialized for ${serviceName}`);
  }

  // --- UPTRACE ---
  if (process.env.UPTRACE_DSN) {
    uptrace.configureOpentelemetry({
      dsn: process.env.UPTRACE_DSN,
      serviceName,
      serviceVersion: process.env.npm_package_version || '1.0.0',
    });
    console.log(`[Uptrace] tracing enabled for ${serviceName}`);
  }
}

