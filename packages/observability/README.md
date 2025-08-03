# A4CO Observability Package

     cursor/implementar-observabilidad-unificada-en-monorepo-348b
Estrategia unificada de observabilidad para la plataforma A4CO con microservicios Node.js/TypeScript (DDD) y frontend Next.js/React 19.

## 🎯 Características

- **Logging estructurado** con Pino en JSON
- **Tracing distribuido** con OpenTelemetry
- **Métricas** con Prometheus
- **Integración DDD** con decoradores para agregados, comandos y eventos
- **Observabilidad frontend** con React hooks y componentes instrumentados
- **Design System** con logging automático de interacciones
- **Dashboards** predefinidos en Grafana
- **Alertas** configurables

Sistema unificado de observabilidad para la plataforma A4CO que proporciona logging estructurado, tracing distribuido y métricas integradas para aplicaciones Node.js/TypeScript y React.

## 🎯 Características

- **Logging Estructurado** con Pino en formato JSON
- **Tracing Distribuido** con OpenTelemetry y Jaeger
- **Métricas** con Prometheus
- **Instrumentación automática** para Express, Koa, NATS, Redis, MongoDB
- **Componentes React instrumentados** con tracking de eventos UI
- **Integración con DDD** para tracking de comandos y eventos
- **Dashboards preconfigurados** en Grafana
- **Alertas automatizadas** basadas en SLOs
     develop

## 📦 Instalación

```bash
   cursor/implementar-observabilidad-unificada-en-monorepo-348b
# En el workspace raíz
pnpm add @a4co/observability

# O en un microservicio específico

# Con pnpm (recomendado en monorepo)
    develop
pnpm add @a4co/observability

# Con npm
npm install @a4co/observability

# Con yarn
yarn add @a4co/observability
```

    cursor/implementar-observabilidad-unificada-en-monorepo-348b
## 🚀 Configuración Rápida

### Backend (Microservicios)

## 🚀 Inicio Rápido

### Backend (Node.js/TypeScript)
     develop

```typescript
import { quickStart } from '@a4co/observability';

    cursor/implementar-observabilidad-unificada-en-monorepo-348b
const observability = initializeObservability({
  serviceName: 'product-service',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  logging: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV === 'development',

// Inicializar observabilidad
await quickStart('my-service', {
  serviceVersion: '1.0.0',
  environment: 'production',
  tracing: {
    jaegerEndpoint: process.env.JAEGER_ENDPOINT,
  },
  metrics: {
    port: 9090,
  },
});

// Usar el logger
import { getLogger } from '@a4co/observability';
const logger = getLogger();

logger.info({ userId: '123' }, 'User logged in');
```

### Frontend (React)

```tsx
import { ObservabilityProvider } from '@a4co/observability/react';

function App() {
  return (
    <ObservabilityProvider 
      apiEndpoint="/api/observability"
      userId={currentUser?.id}
    >
      <YourApp />
    </ObservabilityProvider>
  );
}
```

## 📖 Guía Detallada

### 1. Configuración del Backend

#### Inicialización Completa

```typescript
import { initializeObservability } from '@a4co/observability';

await initializeObservability({
  serviceName: 'order-service',
  serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  
  logging: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV === 'development',
    redact: ['password', 'creditCard', 'ssn'],
      develop
  },
  
  tracing: {
    enabled: true,
     cursor/implementar-observabilidad-unificada-en-monorepo-348b
    jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    enableConsoleExporter: process.env.NODE_ENV === 'development',
    enableAutoInstrumentation: true,

    jaegerEndpoint: 'http://jaeger:14268/api/traces',
    samplingRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    develop
  },
  
  metrics: {
    enabled: true,
     cursor/implementar-observabilidad-unificada-en-monorepo-348b
    port: 9464,

    port: 9090,
     develop
    endpoint: '/metrics',
  },
});
```

    cursor/implementar-observabilidad-unificada-en-monorepo-348b
### Frontend (React)

```typescript
import { initializeFrontendObservability } from '@a4co/observability';

initializeFrontendObservability(
  {
    serviceName: 'dashboard-web',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.REACT_APP_LOG_ENDPOINT || 'http://localhost:3000/api/logs',
    level: 'info',
  },
  {
    serviceName: 'dashboard-web',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.REACT_APP_TRACE_ENDPOINT || 'http://localhost:4318/v1/traces',
    enableConsoleExporter: process.env.NODE_ENV === 'development',
  }
);
```

## 🏗️ Arquitectura DDD

### Decoradores para Agregados

```typescript
import { TraceAggregateMethod } from '@a4co/observability';

class Product {
  @TraceAggregateMethod('Product')
  async updateStock(quantity: number): Promise<void> {
    // Lógica del dominio
  }
}
```

### Decoradores para Comandos

```typescript
import { TraceCommand } from '@a4co/observability';

class ProductCommandHandler {
  @TraceCommand('CreateProduct')
  async handleCreateProduct(command: CreateProductCommand): Promise<ProductCreatedEvent> {
    // Lógica del comando
  }
}
```

### Decoradores para Eventos

```typescript
import { TraceEventHandler } from '@a4co/observability';

class ProductEventHandler {
  @TraceEventHandler('ProductCreated')
  async handleProductCreated(event: ProductCreatedEvent): Promise<void> {
    // Lógica del evento
  }
}
```

### Middleware para Contexto DDD

```typescript
import { dddContextMiddleware } from '@a4co/observability';

app.use(dddContextMiddleware());
```

## 🎨 Design System Integration

### Componentes Observables

```typescript
import { ObservableButton, ObservableInput, ObservableCard } from '@a4co/observability';

// Los componentes automáticamente registran interacciones
<ObservableButton
  variant="primary"
  size="md"
  onClick={handleClick}
>
  Crear Producto
</ObservableButton>
```

### Hooks para Observabilidad

```typescript
import { useDSObservability, useDSPerformanceTracking } from '@a4co/observability';

const MyComponent = () => {
  const { logInteraction } = useDSObservability('MyComponent');
  const { renderCount } = useDSPerformanceTracking('MyComponent');

  const handleClick = () => {
    logInteraction('button_click', { buttonType: 'primary' });
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

### HOC para Instrumentación

```typescript
import { withDSObservability } from '@a4co/observability';

const ObservableMyComponent = withDSObservability(
  MyComponent,
  'MyComponent',
  'default',
  'md'
);
```

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# Backend
SERVICE_NAME=product-service
NODE_ENV=production
JAEGER_ENDPOINT=http://jaeger:14268/api/traces
OTLP_ENDPOINT=http://jaeger:4318/v1/traces
LOG_LEVEL=info

# Frontend
REACT_APP_LOG_ENDPOINT=http://api:3000/api/logs
REACT_APP_TRACE_ENDPOINT=http://jaeger:4318/v1/traces
REACT_APP_API_BASE_URL=http://api:3000
```

### Configuración de Express

```typescript
import express from 'express';
import { initializeObservability, dddContextMiddleware } from '@a4co/observability';

const app = express();

// Inicializar observabilidad
const observability = initializeObservability(config);

// Middleware (orden importante)
app.use(dddContextMiddleware());     // 1. Contexto DDD
app.use(observability.httpLogger);   // 2. Logging HTTP
app.use(express.json());             // 3. Body parser
```

### Propagación de Contexto en NATS

```typescript
import { injectNATSTraceContext, extractNATSTraceContext } from '@a4co/observability';

// Al publicar mensaje
const headers = injectNATSTraceContext({
  'message-type': 'ProductCreated',
});

// Al consumir mensaje
extractNATSTraceContext(headers);
```

## 📊 Dashboards y Métricas

### Métricas Disponibles

- **HTTP Requests**: `http_requests_total`, `http_request_duration_seconds`
- **DDD Operations**: `ddd_command_duration_seconds`, `ddd_event_processing_duration_seconds`
- **Frontend**: `frontend_page_load_duration_seconds`, `frontend_js_errors_total`
- **Design System**: `ds_component_interactions_total`, `ds_component_render_duration_seconds`

### Alertas Predefinidas

- Error rate > 1% en 5 minutos
- Latencia P95 > 300ms
- Servicios caídos
- Uso de memoria > 90%
- Uso de CPU > 80%

## 🚀 Despliegue

### Kubernetes

```bash
# Crear namespace
kubectl create namespace observability

# Desplegar componentes
kubectl apply -f k8s/jaeger.yaml
kubectl apply -f k8s/prometheus.yaml
kubectl apply -f k8s/grafana.yaml

# Verificar estado
kubectl get pods -n observability
```

### Docker Compose (Desarrollo)

```yaml
version: '3.8'
services:
  jaeger:
    image: jaegertracing/all-in-one:1.50
    ports:
      - "16686:16686"
      - "14268:14268"
      - "4318:4318"
    environment:
      - COLLECTOR_OTLP_ENABLED=true

  prometheus:
    image: prom/prometheus:v2.45.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:10.0.0
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
```

## 🔍 Monitoreo

### URLs de Acceso

- **Jaeger UI**: http://localhost:16686
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin123)

### Dashboards Disponibles

1. **A4CO Overview**: Vista general de la plataforma
2. **A4CO Services**: Métricas de microservicios
3. **A4CO Frontend**: Métricas de frontend y Design System

## 📝 Logging

### Estructura de Logs

```json
{
  "level": "info",
  "time": "2024-01-15T10:30:00.000Z",
  "pid": 1234,
  "hostname": "server-1",
  "service": "product-service",
  "version": "1.0.0",
  "environment": "production",
  "traceId": "abc123",
  "spanId": "def456",
  "correlationId": "req-789",
  "userId": "user-123",
  "message": "Product created successfully",
  "ddd": {
    "aggregate": "Product",
    "command": "CreateProduct",
    "event": "ProductCreated"
  },
  "metadata": {
    "productId": "prod-123",
    "price": 99.99
  }
}
```

### Niveles de Log

- `debug`: Información detallada para desarrollo
- `info`: Información general de operaciones
- `warn`: Advertencias que no impiden la operación
- `error`: Errores que requieren atención

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Tests en modo watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📚 Ejemplos

Ver la carpeta `examples/` para ejemplos completos:

- `microservice-example.ts`: Microservicio completo con DDD
- `frontend-example.tsx`: Aplicación React con observabilidad

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte y preguntas:

- 📧 Email: support@a4co.com
- 📖 Documentación: [docs.a4co.com](https://docs.a4co.com)
- 🐛 Issues: [GitHub Issues](https://github.com/a4co/observability/issues)

#### Middleware para Express

```typescript
import express from 'express';
import { expressObservabilityMiddleware, expressErrorHandler } from '@a4co/observability';

const app = express();

// Agregar middleware de observabilidad
app.use(expressObservabilityMiddleware({
  ignorePaths: ['/health', '/metrics'],
  includeRequestBody: true,
  customAttributes: (req) => ({
    tenantId: req.headers['x-tenant-id'],
  }),
}));

// Tus rutas aquí...

// Error handler al final
app.use(expressErrorHandler());
```

#### Middleware para Koa

```typescript
import Koa from 'koa';
import { koaObservabilityMiddleware, koaErrorHandler } from '@a4co/observability';

const app = new Koa();

// Error handler primero en Koa
app.use(koaErrorHandler());

// Middleware de observabilidad
app.use(koaObservabilityMiddleware({
  ignorePaths: ['/health', '/metrics'],
}));
```

### 2. Logging Estructurado

#### Logger con Contexto

```typescript
import { getLogger } from '@a4co/observability';

const logger = getLogger();

// Logger con contexto
const userLogger = logger.withContext({
  userId: '123',
  tenantId: 'abc',
  correlationId: 'xyz-456',
});

userLogger.info({ action: 'checkout' }, 'User initiated checkout');
```

#### Logger DDD

```typescript
const dddLogger = logger.withDDD({
  aggregateName: 'Order',
  aggregateId: 'order-123',
  commandName: 'CreateOrder',
});

dddLogger.info('Processing CreateOrder command');
```

### 3. Tracing Distribuido

#### Crear Spans Manuales

```typescript
import { getTracer, SpanStatusCode } from '@a4co/observability';

const tracer = getTracer('order-service');

async function processOrder(orderId: string) {
  const span = tracer.startSpan('processOrder', {
    attributes: {
      'order.id': orderId,
      'order.status': 'pending',
    },
  });

  try {
    // Tu lógica aquí
    const result = await doSomething();
    
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ 
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
    throw error;
  } finally {
    span.end();
  }
}
```

#### Usar Decoradores

```typescript
import { Trace, CommandHandler, Repository } from '@a4co/observability';

@Repository('Order')
class OrderRepository {
  @Trace({ recordResult: true })
  async findById(id: string): Promise<Order> {
    // Automáticamente crea span y logs
    return this.db.orders.findOne({ id });
  }
}

class OrderCommandHandler {
  @CommandHandler('CreateOrder', 'Order')
  async handle(command: CreateOrderCommand): Promise<void> {
    // Automáticamente trackea comando, crea spans y métricas
    await this.orderRepo.save(order);
  }
}
```

### 4. Métricas

#### Usar Métricas Predefinidas

```typescript
import { recordHttpRequest, recordCommandExecution } from '@a4co/observability';

// Registrar petición HTTP
recordHttpRequest('POST', '/api/orders', 201, 145); // método, ruta, status, duración

// Registrar ejecución de comando
recordCommandExecution('CreateOrder', 'Order', true, 230); // comando, agregado, éxito, duración
```

#### Crear Métricas Personalizadas

```typescript
import { createCustomCounter, createCustomHistogram } from '@a4co/observability';

// Contador personalizado
const orderCounter = createCustomCounter('orders_created_total', 'Total orders created');
orderCounter.add(1, { region: 'us-east', paymentMethod: 'credit_card' });

// Histograma personalizado
const paymentDuration = createCustomHistogram(
  'payment_processing_duration_ms',
  'Payment processing duration',
  'ms'
);
paymentDuration.record(1250, { provider: 'stripe' });
```

### 5. Instrumentación de Servicios

#### NATS

```typescript
import { connect } from 'nats';
import { instrumentNatsClient } from '@a4co/observability';

const nc = await connect({ servers: 'nats://localhost:4222' });
const instrumentedNc = instrumentNatsClient(nc);

// Publicar con tracing automático
instrumentedNc.publish('orders.created', orderData);

// Suscribir con tracing automático
instrumentedNc.subscribe('orders.*', (msg) => {
  // El span se propaga automáticamente
  console.log('Received:', msg);
});
```

#### Redis

```typescript
import Redis from 'ioredis';
import { instrumentRedisClient } from '@a4co/observability';

const redis = new Redis();
const instrumentedRedis = instrumentRedisClient(redis);

// Todas las operaciones son instrumentadas
await instrumentedRedis.set('key', 'value');
const value = await instrumentedRedis.get('key');
```

### 6. Frontend (React)

#### Hooks de Observabilidad

```tsx
import { useObservability, useEventTracking, useComponentTracking } from '@a4co/observability/react';

function CheckoutButton() {
  const { trackClick } = useEventTracking();
  
  // Track automático del ciclo de vida del componente
  useComponentTracking('CheckoutButton', {
    trackProps: ['variant', 'disabled'],
  });

  const handleClick = () => {
    trackClick('CheckoutButton', {
      cartValue: cart.total,
      itemCount: cart.items.length,
    });
    
    // Tu lógica aquí
  };

  return <button onClick={handleClick}>Checkout</button>;
}
```

#### Componentes del Design System

```tsx
import { TrackedButton, TrackedInput, TrackedModal } from '@a4co/observability/react';

function MyForm() {
  return (
    <form>
      <TrackedInput
        label="Email"
        type="email"
        trackingName="email-input"
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <TrackedButton
        variant="primary"
        trackingName="submit-button"
        trackingMetadata={{ formType: 'registration' }}
      >
        Submit
      </TrackedButton>
    </form>
  );
}
```

#### Performance Tracking

```tsx
import { PerformanceTracker, measurePerformance } from '@a4co/observability/react';

function ExpensiveComponent() {
  const { measurePerformance } = useObservability();

  useEffect(() => {
    measurePerformance('ExpensiveComponent.render', async () => {
      await loadData();
      await processData();
    });
  }, []);

  return <PerformanceTracker name="ExpensiveComponent.children">
    {() => <ComplexVisualization data={data} />}
  </PerformanceTracker>;
}
```

### 7. Contexto y Propagación

#### Propagación Manual de Contexto

```typescript
import { injectContextToHeaders, extractContextFromHeaders } from '@a4co/observability';

// Cliente HTTP
const headers = injectContextToHeaders({
  traceId: span.spanContext().traceId,
  correlationId: 'abc-123',
  userId: 'user-456',
});

await axios.post('/api/orders', data, { headers });

// Servidor
app.post('/api/orders', (req, res) => {
  const context = extractContextFromHeaders(req.headers);
  // context contiene traceId, correlationId, userId
});
```

### 8. Utilidades

#### Circuit Breaker

```typescript
import { CircuitBreaker } from '@a4co/observability';

const paymentBreaker = new CircuitBreaker(
  async () => await paymentProvider.charge(amount),
  {
    failureThreshold: 5,
    resetTimeout: 60000,
    onStateChange: (state) => {
      logger.warn({ state }, 'Circuit breaker state changed');
    },
  }
);

try {
  await paymentBreaker.execute();
} catch (error) {
  // Manejar falla o circuito abierto
}
```

#### Retry con Backoff

```typescript
import { retryWithBackoff } from '@a4co/observability';

const result = await retryWithBackoff(
  async () => await unstableService.call(),
  {
    maxRetries: 3,
    initialDelay: 1000,
    factor: 2,
    onRetry: (error, attempt) => {
      logger.warn({ error, attempt }, 'Retrying operation');
    },
  }
);
```

## 🐳 Despliegue con Kubernetes

### Instalar Jaeger

```bash
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm install jaeger jaegertracing/jaeger \
  -f packages/observability/k8s/jaeger-values.yaml \
  -n a4co-monitoring
```

### Instalar Prometheus + Grafana

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -f packages/observability/k8s/prometheus-values.yaml \
  -n a4co-monitoring
```

### Aplicar Reglas de Alertas

```bash
kubectl apply -f packages/observability/k8s/prometheus-alerts.yaml
```

## 📊 Dashboards

Los dashboards preconfigurados están en `k8s/grafana-dashboards/`:

- **microservices-dashboard.json**: Vista general de todos los microservicios
- **frontend-performance.json**: Métricas de rendimiento del frontend
- **ddd-metrics.json**: Métricas específicas de DDD (comandos, eventos)

## 🔧 Variables de Entorno

```bash
# Backend
NODE_ENV=production
SERVICE_NAME=order-service
SERVICE_VERSION=1.0.0
JAEGER_ENDPOINT=http://jaeger:14268/api/traces
METRICS_PORT=9090

# Frontend
REACT_APP_OBSERVABILITY_ENDPOINT=https://api.a4co.com/observability
```

## 🏗️ Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│    NATS     │
│   (React)   │     │  (Node.js)  │     │  (Message)  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │                   │                    │
       ▼                   ▼                    ▼
┌─────────────────────────────────────────────────────┐
│              OpenTelemetry Collector                 │
└──────┬───────────────────┬───────────────────┬──────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Jaeger    │     │ Prometheus  │     │    Loki     │
│  (Tracing)  │     │  (Metrics)  │     │   (Logs)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌─────────────┐
                    │   Grafana   │
                    │(Dashboards) │
                    └─────────────┘
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea tu feature branch (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](../../LICENSE) para más detalles.
      develop
