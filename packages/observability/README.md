# @a4co/observability

Paquete de observabilidad para microservicios A4CO con logging estructurado, tracing distribuido y métricas.

## Descripción

Este paquete proporciona una configuración unificada para:
- **Logging estructurado** con Pino en formato JSON
- **Tracing distribuido** con OpenTelemetry y exportación a Jaeger
- **Métricas** con Prometheus
- Correlación automática de logs con trace IDs

## Instalación

```bash
pnpm add @a4co/observability
```

## Uso Rápido

### Inicialización completa

```typescript
import { initializeObservability } from '@a4co/observability';

const observability = initializeObservability({
  serviceName: 'user-service',
  serviceVersion: '1.0.0',
  environment: 'production',
  logging: {
    level: 'info',
    prettyPrint: false
  },
  tracing: {
    enabled: true,
    jaegerEndpoint: 'http://localhost:14268/api/traces'
  },
  metrics: {
    enabled: true,
    port: 9464
  }
});

const { logger, httpLogger } = observability;
```

### Uso con Express

```typescript
import express from 'express';
import { initializeObservability } from '@a4co/observability';

const app = express();
const { logger, httpLogger, getTracer } = initializeObservability({
  serviceName: 'api-gateway',
  environment: process.env.NODE_ENV
});

// Middleware de logging HTTP
app.use(httpLogger);

// Ruta de ejemplo
app.get('/users/:id', async (req, res) => {
  const tracer = getTracer('user-controller');
  const span = tracer.startSpan('getUser');
  
  try {
    logger.info('Fetching user', { userId: req.params.id });
    
    // Tu lógica aquí
    const user = await fetchUser(req.params.id);
    
    span.setStatus({ code: 0 });
    res.json(user);
  } catch (error) {
    logger.error('Error fetching user', error);
    span.recordException(error);
    span.setStatus({ code: 2 });
    res.status(500).json({ error: 'Internal error' });
  } finally {
    span.end();
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('# Metrics endpoint');
});

app.listen(3000);
```

### Uso con Next.js

```typescript
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { logger, getTracer } from '@a4co/observability';

// Inicializar una vez en otro archivo o al inicio
// initializeObservability({ serviceName: 'nextjs-app' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tracer = getTracer('api-handler');
  const span = tracer.startSpan('hello-endpoint');
  
  try {
    logger.info('Hello endpoint called', { 
      method: req.method,
      query: req.query 
    });
    
    res.status(200).json({ message: 'Hello World' });
  } finally {
    span.end();
  }
}
```

### Uso del logger standalone

```typescript
import { logger } from '@a4co/observability';

// El logger se auto-configura con valores por defecto
logger.info('Application started');
logger.error('Something went wrong', { error: new Error('Oops') });
logger.debug('Debug information', { data: { foo: 'bar' } });
```

## Desarrollo

### Compilar

```bash
pnpm build
```

### Modo desarrollo (watch)

```bash
pnpm dev
```

### Ejecutar tests

```bash
pnpm test
```

## Configuración

### Variables de entorno

```bash
# Servicio
SERVICE_NAME=my-service
NODE_ENV=production

# Logging
LOG_LEVEL=info

# Tracing
JAEGER_ENDPOINT=http://jaeger:14268/api/traces

# Metrics
METRICS_PORT=9464
```

### Opciones de configuración

```typescript
interface ObservabilityConfig {
  serviceName: string;              // Nombre del servicio (requerido)
  serviceVersion?: string;          // Versión del servicio
  environment?: string;             // Ambiente (development, production)
  
  logging?: {
    level?: string;                 // debug, info, warn, error
    prettyPrint?: boolean;          // Pretty print en desarrollo
  };
  
  tracing?: {
    enabled?: boolean;              // Habilitar tracing
    jaegerEndpoint?: string;        // URL de Jaeger
    enableConsoleExporter?: boolean; // Exportar a consola
    enableAutoInstrumentation?: boolean; // Auto-instrumentación
  };
  
  metrics?: {
    enabled?: boolean;              // Habilitar métricas
    port?: number;                  // Puerto para /metrics
    endpoint?: string;              // Ruta del endpoint
  };
}
```

## Ejemplos de logs

### Formato desarrollo (pretty)
```
[12:34:56] INFO (user-service/1234): User created successfully
    traceId: "1234567890abcdef"
    spanId: "abcdef1234"
    userId: "usr_123"
```

### Formato producción (JSON)
```json
{
  "level": "info",
  "time": "2024-01-10T12:34:56.789Z",
  "pid": 1234,
  "hostname": "api-server-1",
  "service": "user-service",
  "version": "1.0.0",
  "environment": "production",
  "traceId": "1234567890abcdef",
  "spanId": "abcdef1234",
  "msg": "User created successfully",
  "userId": "usr_123"
}
```

## Integración con infraestructura

### Docker Compose

```yaml
services:
  my-service:
    build: .
    environment:
      - SERVICE_NAME=my-service
      - NODE_ENV=production
      - JAEGER_ENDPOINT=http://jaeger:14268/api/traces
    ports:
      - "3000:3000"
      - "9464:9464"  # Metrics
  
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"  # UI
      - "14268:14268"  # Collector
```

### Ver trazas en Jaeger

1. Acceder a http://localhost:16686
2. Seleccionar el servicio en el dropdown
3. Buscar trazas por tiempo o trace ID

## Contribuir

Ver [CONTRIBUTING.md](../../CONTRIBUTING.md) en el repositorio principal.

## Licencia

MIT