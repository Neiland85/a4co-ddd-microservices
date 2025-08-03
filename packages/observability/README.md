# @a4co/observability

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

## 📦 Instalación

```bash
# Con pnpm (recomendado en monorepo)
pnpm add @a4co/observability

# Con npm
npm install @a4co/observability

# Con yarn
yarn add @a4co/observability
```

## 🚀 Inicio Rápido

### Backend (Node.js/TypeScript)

```typescript
import { quickStart } from '@a4co/observability';

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
  },
  
  tracing: {
    enabled: true,
    jaegerEndpoint: 'http://jaeger:14268/api/traces',
    samplingRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  },
  
  metrics: {
    enabled: true,
    port: 9090,
    endpoint: '/metrics',
  },
});
```

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