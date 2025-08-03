# @a4co/observability

Paquete de observabilidad completo para microservicios con logging estructurado, tracing distribuido y métricas.

## Características

- **Logging Estructurado** con Pino en formato JSON
- **Tracing Distribuido** con OpenTelemetry
- **Métricas** con Prometheus
- **Propagación de Contexto** entre servicios
- **Correlación de Logs** con trace IDs
- **Instrumentación Automática** para Express, HTTP, MongoDB, Redis
- **Middleware** listo para usar

## Instalación

```bash
npm install @a4co/observability
```

## Uso Rápido

```typescript
import { setupObservability } from '@a4co/observability';
import express from 'express';

// Configurar observabilidad
const observability = setupObservability({
  serviceName: 'my-service',
  serviceVersion: '1.0.0',
  environment: 'production',
  logging: {
    level: 'info',
    prettyPrint: false
  },
  tracing: {
    enabled: true,
    exporterType: 'jaeger',
    jaegerEndpoint: 'http://jaeger:14268/api/traces',
    sampleRate: 0.1 // 10% de las trazas
  }
});

// Obtener herramientas
const logger = observability.getStructuredLogger();
const middleware = observability.getMiddleware();

// Configurar Express
const app = express();

// Aplicar middleware (orden importante)
app.use(middleware.observability);
app.use(middleware.logCorrelation);
app.use(middleware.httpLogging);
app.use(express.json());

// Usar en rutas
app.get('/users/:id', async (req, res, next) => {
  try {
    logger.info('Fetching user', { userId: req.params.id });
    
    // Tu lógica aquí
    const user = await getUserById(req.params.id);
    
    res.json({ data: user, traceId: req.traceId });
  } catch (error) {
    next(error);
  }
});

// Middleware de errores (al final)
app.use(middleware.errorHandling);
```

## Logging Estructurado

### Configuración

```typescript
import { createLogger, StructuredLogger } from '@a4co/observability';

const logger = createLogger({
  serviceName: 'user-service',
  environment: 'production',
  level: 'info',
  prettyPrint: false // JSON en producción
});

const structuredLogger = new StructuredLogger(logger);
```

### Uso del Logger

```typescript
// Log simple
logger.info('User created successfully');

// Log con contexto
structuredLogger.info('Processing payment', {
  userId: '123',
  amount: 99.99,
  currency: 'USD'
});

// Log de error
structuredLogger.error('Payment failed', error, {
  userId: '123',
  paymentId: '456'
});

// Log de auditoría
structuredLogger.audit('USER_LOGIN', userId, 'authentication', {
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
});

// Métricas de negocio
structuredLogger.metric('revenue', 99.99, {
  product: 'premium',
  country: 'US'
});
```

### Formato de Logs

```json
{
  "level": "info",
  "time": "2024-01-10T12:00:00.000Z",
  "pid": 1234,
  "hostname": "my-host",
  "service": "user-service",
  "environment": "production",
  "traceId": "1234567890abcdef",
  "spanId": "abcdef1234567890",
  "msg": "User created successfully",
  "userId": "123",
  "email": "user@example.com"
}
```

## Tracing Distribuido

### Configuración

```typescript
import { initializeTracing, TracingUtils, Trace } from '@a4co/observability';

const tracing = initializeTracing({
  serviceName: 'order-service',
  serviceVersion: '2.0.0',
  environment: 'production',
  exporterType: 'jaeger',
  jaegerEndpoint: 'http://jaeger:14268/api/traces',
  enableAutoInstrumentation: true,
  sampleRate: 0.1
});
```

### Instrumentación Manual

```typescript
// Usando decorador
class UserService {
  @Trace('UserService.createUser')
  async createUser(data: any) {
    // Agregar eventos
    TracingUtils.addEvent('validation.start');
    
    // Validar datos
    validateUser(data);
    
    TracingUtils.addEvent('validation.complete');
    
    // Crear span hijo
    return await TracingUtils.withSpan('db.insert', async (span) => {
      span.setAttributes({
        'db.collection': 'users',
        'db.operation': 'insert'
      });
      
      return await db.users.insert(data);
    });
  }
}

// Sin decorador
async function processOrder(orderId: string) {
  return TracingUtils.withSpan('processOrder', async (span) => {
    span.setAttributes({
      'order.id': orderId,
      'order.processing': true
    });
    
    try {
      const result = await doProcessing();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ 
        code: SpanStatusCode.ERROR,
        message: error.message 
      });
      throw error;
    }
  });
}
```

### Propagación entre Servicios

```typescript
import { TracedHttpClient } from '@a4co/observability';

const httpClient = new TracedHttpClient({
  baseURL: 'http://api.internal',
  timeout: 5000
});

// Las llamadas propagan automáticamente el contexto
const response = await httpClient.post('/orders', {
  userId: '123',
  items: [...]
});
```

## Métricas

### Configuración

```typescript
import { initializeMetrics, CommonMetrics } from '@a4co/observability';

// Inicializar Prometheus
initializeMetrics({
  serviceName: 'payment-service',
  port: 9464,
  endpoint: '/metrics'
});

// Crear métricas comunes
const metrics = new CommonMetrics('payment-service');

// Aplicar middleware de métricas
app.use(metricsMiddleware(metrics));
```

### Métricas Personalizadas

```typescript
import { CustomMetrics } from '@a4co/observability';

const metrics = new CustomMetrics('business-metrics');

// Contador
metrics.incrementCounter('payments_processed', 1, {
  method: 'credit_card',
  status: 'success'
});

// Histograma
metrics.recordDuration('payment_duration', 1.234, {
  method: 'credit_card'
});

// Gauge
metrics.updateGauge('active_subscriptions', 1, {
  plan: 'premium'
});
```

### Métricas Predefinidas

```typescript
// HTTP
metrics.recordHttpRequest('POST', '/api/users', 201, 145);

// Base de datos
metrics.recordDatabaseQuery('find', 'users', 23, true);

// Cache
metrics.recordCacheOperation('hit', 2);

// Colas
metrics.recordQueueOperation('emails', 'process', true, 1500);

// Memoria
metrics.recordMemoryUsage();
```

## Middleware

### Orden Recomendado

```typescript
const app = express();

// 1. Contexto de tracing (debe ir primero)
app.use(middleware.observability);

// 2. Correlación de logs
app.use(middleware.logCorrelation);

// 3. Métricas
app.use(metricsMiddleware(metrics));

// 4. Logging HTTP
app.use(middleware.httpLogging);

// 5. Body parsers y otros middleware
app.use(express.json());

// ... tus rutas ...

// Último: manejo de errores
app.use(middleware.errorHandling);
```

## Configuración con Docker

### docker-compose.yml

```yaml
version: '3.8'

services:
  my-service:
    build: .
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
      - TRACE_EXPORTER=jaeger
      - JAEGER_ENDPOINT=http://jaeger:14268/api/traces
      - TRACE_SAMPLE_RATE=0.1
    depends_on:
      - jaeger
      - prometheus

  jaeger:
    image: jaegertracing/all-in-one:1.52
    ports:
      - "16686:16686"
      - "14268:14268"

  prometheus:
    image: prom/prometheus:v2.48.1
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

## Variables de Entorno

```bash
# Logging
LOG_LEVEL=info                    # debug, info, warn, error
NODE_ENV=production              # development, production

# Tracing
TRACE_EXPORTER=jaeger            # jaeger, otlp, console
JAEGER_ENDPOINT=http://localhost:14268/api/traces
OTLP_ENDPOINT=http://localhost:4318/v1/traces
TRACE_SAMPLE_RATE=1.0           # 0.0 a 1.0

# Métricas
METRICS_PORT=9464
METRICS_ENDPOINT=/metrics
```

## Mejores Prácticas

### 1. Logging

- Usa niveles apropiados (debug, info, warn, error)
- Incluye contexto relevante pero evita información sensible
- Usa logging estructurado para facilitar búsquedas
- Correlaciona logs con trace IDs

### 2. Tracing

- Instrumenta operaciones críticas
- Usa nombres descriptivos para spans
- Agrega atributos relevantes
- No traces información sensible
- Ajusta el sample rate según el volumen

### 3. Métricas

- Define SLIs (Service Level Indicators)
- Usa labels consistentes
- Evita alta cardinalidad en labels
- Monitorea métricas de negocio

### 4. Performance

- El tracing agrega overhead (~1-5%)
- Ajusta sample rates en producción
- Usa batch processing para exportar datos
- Monitorea el uso de memoria

## Ejemplo Completo

Ver `examples/microservice-example.ts` para un ejemplo completo de integración.

## Troubleshooting

### Logs no muestran trace ID

Asegúrate de que el middleware de observabilidad esté antes que otros middleware:

```typescript
app.use(middleware.observability); // Primero
app.use(middleware.logCorrelation); // Después
```

### Trazas no se exportan

Verifica:
- El endpoint del exportador es accesible
- El servicio tiene permisos de red
- El sample rate no es 0
- Hay suficiente memoria para el buffer

### Métricas no aparecen

- Verifica que Prometheus esté scrapeando el endpoint correcto
- Asegúrate de que el puerto de métricas esté expuesto
- Revisa los logs del exportador

## Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

MIT