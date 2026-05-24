import * as Sentry from '@sentry/node';
import { initializeTracing } from '@a4co/observability';

const environment = process.env['NODE_ENV'] ?? 'development';
const serviceName = process.env['SERVICE_NAME'] ?? 'auth-service';
const serviceVersion = process.env['npm_package_version'] ?? '1.0.0';

// --- Sentry ---
if (process.env['SENTRY_DSN']) {
  Sentry.init({
    dsn: process.env['SENTRY_DSN'],
    environment,
    release: serviceVersion,
    tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
    profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
  });
  console.log(`[Sentry] inicializado para ${serviceName}`);
}

// --- OpenTelemetry / A4CO Observability ---
// UPTRACE_DSN is intentionally kept as a compatibility activation flag,
// but tracing is initialized through the shared @a4co/observability package.
// Prefer OTEL_EXPORTER_OTLP_ENDPOINT for the collector endpoint.
if (process.env['UPTRACE_DSN'] || process.env['OTEL_EXPORTER_OTLP_ENDPOINT']) {
  initializeTracing({
    serviceName,
    serviceVersion,
    environment,
    otlpEndpoint: process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] || process.env['UPTRACE_DSN'],
    enableAutoInstrumentation: true,
    enableConsoleExporter: environment !== 'production',
  });
  console.log(`[OpenTelemetry] tracing activo para ${serviceName}`);
}
