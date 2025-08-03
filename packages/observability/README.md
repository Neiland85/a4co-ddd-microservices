# @a4co/observability

Estrategia unificada de observabilidad para la plataforma A4CO, proporcionando logging estructurado, tracing distribuido y métricas para microservicios Node.js/TypeScript y aplicaciones frontend React.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
  - [Logging Estructurado](#logging-estructurado)
  - [Tracing Distribuido](#tracing-distribuido)
  - [Integración Frontend](#integración-frontend)
  - [Design System](#design-system)
- [Despliegue](#despliegue)
- [Dashboards y Alertas](#dashboards-y-alertas)
- [Mejores Prácticas](#mejores-prácticas)

## 🚀 Características

- **Logging Estructurado**: Pino con soporte para metadata DDD (aggregate, command, event)
- **Tracing Distribuido**: OpenTelemetry con propagación automática de trace ID
- **Métricas**: Prometheus con exportadores personalizados
- **Frontend**: Instrumentación React con hooks y HOCs
- **Design System**: Componentes observables con tracking integrado
- **Dashboards**: Grafana preconfigurado con paneles para microservicios y frontend
- **Alertas**: Reglas predefinidas para latencia, errores y métricas de negocio

## 📦 Instalación

```bash
# Instalar el paquete en tu monorepo
pnpm add @a4co/observability

# Instalar dependencias peer si usas React
pnpm add react@^18.0.0 || pnpm add react@^19.0.0
```

## ⚙️ Configuración

### Backend (Node.js/TypeScript)

```typescript
// src/infrastructure/observability.ts
import { 
  createLogger, 
  initializeTracer,
  expressTracingMiddleware 
} from '@a4co/observability';

// Configurar logger
const logger = createLogger({
  service: 'order-service',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.SERVICE_VERSION || '1.0.0',
  level: 'info',
  pretty: process.env.NODE_ENV === 'development',
  redact: ['password', 'token', 'creditCard'],
});

// Inicializar tracer
const tracer = initializeTracer({
  serviceName: 'order-service',
  serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
  prometheusPort: 9090,
  logger,
});

// En tu aplicación Express
import express from 'express';

const app = express();

// Agregar middleware de tracing
app.use(expressTracingMiddleware({
  serviceName: 'order-service',
  logger,
  captureRequestBody: true,
  captureResponseBody: false,
}));

export { logger, tracer };
```

### Frontend (React)

```tsx
// src/App.tsx
import React from 'react';
import { 
  createFrontendLogger,
  initializeWebTracer,
  LoggerProvider,
  TracingProvider,
  LoggingErrorBoundary
} from '@a4co/observability';

// Configurar logger frontend
const logger = createFrontendLogger({
  service: 'web-app',
  environment: process.env.REACT_APP_ENV || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  endpoint: '/api/logs', // Endpoint para enviar logs al backend
  bufferSize: 100,
  flushInterval: 5000,
});

// Inicializar tracer web
initializeWebTracer({
  serviceName: 'web-app',
  serviceVersion: process.env.REACT_APP_VERSION || '1.0.0',
  environment: process.env.REACT_APP_ENV || 'development',
  collectorUrl: process.env.REACT_APP_OTEL_COLLECTOR_URL || 'http://localhost:4318/v1/traces',
});

function App() {
  return (
    <TracingProvider 
      serviceName="web-app"
      serviceVersion="1.0.0"
      environment="production"
    >
      <LoggerProvider logger={logger}>
        <LoggingErrorBoundary>
          {/* Tu aplicación */}
        </LoggingErrorBoundary>
      </LoggerProvider>
    </TracingProvider>
  );
}
```

## 📖 Uso

### Logging Estructurado

#### Backend - Logging con metadata DDD

```typescript
import { Trace, withSpan } from '@a4co/observability';

class OrderService {
  constructor(private logger: Logger) {}

  @Trace({ name: 'OrderService.createOrder' })
  async createOrder(command: CreateOrderCommand): Promise<Order> {
    // Log con metadata DDD
    this.logger.info('Processing order creation', {
      ddd: {
        aggregateId: command.orderId,
        aggregateType: 'Order',
        commandName: 'CreateOrderCommand',
        userId: command.userId,
        correlationId: command.correlationId,
      },
    });

    try {
      const order = await this.orderRepository.save(order);
      
      this.logger.info('Order created successfully', {
        ddd: {
          aggregateId: order.id,
          eventName: 'OrderCreatedEvent',
          eventVersion: 1,
        },
      });

      return order;
    } catch (error) {
      this.logger.error('Order creation failed', error, {
        ddd: {
          aggregateId: command.orderId,
          commandName: 'CreateOrderCommand',
        },
      });
      throw error;
    }
  }
}
```

#### Frontend - Logging con React Hooks

```tsx
import { useLogger, useComponentLogger, useApiLogger } from '@a4co/observability';

function ProductList() {
  const logger = useLogger();
  const componentLogger = useComponentLogger('ProductList');
  const { logRequest, logResponse, logError } = useApiLogger();

  const fetchProducts = async () => {
    const startTime = logRequest({
      method: 'GET',
      url: '/api/products',
    });

    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      logResponse(startTime, {
        method: 'GET',
        url: '/api/products',
      }, response);

      componentLogger.info('Products loaded', {
        custom: {
          productCount: data.length,
        },
      });

      return data;
    } catch (error) {
      logError(startTime, {
        method: 'GET',
        url: '/api/products',
      }, error);
      throw error;
    }
  };

  // ...
}
```

### Tracing Distribuido

#### Propagación de Trace ID entre servicios

```typescript
// order-service
import { TracedNatsClient } from '@a4co/observability';

const natsClient = new TracedNatsClient({
  serviceName: 'order-service',
  logger,
});

// Publicar evento con trace propagation
await natsClient.publishEvent('orders.created', {
  type: 'OrderCreated',
  aggregateId: order.id,
  data: order,
});

// payment-service
natsClient.subscribeToEvents('orders.created', async (event, span) => {
  // El span ya incluye el trace context del servicio origen
  span.setAttribute('payment.orderId', event.aggregateId);
  
  // Procesar pago...
});
```

#### HTTP Client con tracing automático

```typescript
import { createFetchWrapper } from '@a4co/observability';

const httpClient = createFetchWrapper({
  baseURL: 'https://api.a4co.com',
  logger,
  propagateTrace: true,
});

// Las llamadas HTTP incluirán automáticamente headers de tracing
const response = await httpClient.get('/products');
```

### Integración Frontend

#### Hooks para tracking de interacciones

```tsx
import { 
  useInteractionLogger, 
  useInteractionTracing,
  useRouteTracing 
} from '@a4co/observability';

function CheckoutForm() {
  const logInteraction = useInteractionLogger('checkout.form');
  const traceInteraction = useInteractionTracing('checkout', 'form');
  
  const handleSubmit = (data) => {
    logInteraction({
      action: 'submit',
      items: data.items.length,
      total: data.total,
    });
    
    traceInteraction({
      formData: data,
    });
    
    // Procesar checkout...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
    </form>
  );
}

// Tracking de navegación
function App() {
  const location = useLocation();
  useRouteTracing(location.pathname);
  
  return <Routes>{/* ... */}</Routes>;
}
```

### Design System

#### Componentes observables

```tsx
import { ObservableButton, ObservableForm } from '@a4co/observability';

function ProductActions({ product }) {
  return (
    <>
      <ObservableButton
        variant="primary"
        trackingId="add-to-cart"
        trackingMetadata={{ 
          productId: product.id,
          productName: product.name,
          price: product.price,
        }}
        onClick={() => addToCart(product)}
      >
        Agregar al carrito
      </ObservableButton>

      <ObservableForm
        formId="product-review"
        onSubmitSuccess={(data) => {
          console.log('Review submitted:', data);
        }}
      >
        <input name="rating" type="number" min="1" max="5" />
        <textarea name="comment" />
        <button type="submit">Enviar reseña</button>
      </ObservableForm>
    </>
  );
}
```

#### Plugin para componentes existentes

```typescript
import { 
  createComponentPlugin, 
  DesignTokenTracker,
  ComponentPerformanceTracker 
} from '@a4co/observability';

// Crear plugin de observabilidad
const buttonPlugin = createComponentPlugin({
  componentName: 'Button',
  trackProps: ['variant', 'size', 'disabled'],
  trackEvents: ['click', 'hover'],
  logLevel: 'debug',
});

// Tracking de design tokens
const tokenTracker = new DesignTokenTracker(logger);
tokenTracker.trackTokenUsage({
  token: 'color.primary.500',
  value: '#3B82F6',
  component: 'Button',
  variant: 'primary',
  timestamp: new Date().toISOString(),
});

// Performance tracking
const perfTracker = new ComponentPerformanceTracker(logger);
perfTracker.recordRenderTime('ProductList', 125); // 125ms
```

## 🚢 Despliegue

### Kubernetes con Helm

```bash
# Agregar repositorios necesarios
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo update

# Instalar el stack de observabilidad
helm install a4co-observability ./packages/observability/helm/a4co-observability \
  --namespace observability \
  --create-namespace \
  --set global.domain=a4co.com \
  --set grafana.adminPassword=SecurePassword123!

# Verificar instalación
kubectl get all -n observability
```

### Docker Compose (Desarrollo)

```yaml
# docker-compose.observability.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.48.0
    ports:
      - "9090:9090"
    volumes:
      - ./packages/observability/config/prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:10.2.2
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./packages/observability/config/grafana:/etc/grafana/provisioning
      - grafana_data:/var/lib/grafana

  jaeger:
    image: jaegertracing/all-in-one:1.51
    ports:
      - "16686:16686" # UI
      - "14268:14268" # HTTP collector
      - "14250:14250" # gRPC collector
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411

  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.91.0
    command: ["--config=/etc/otel/config.yaml"]
    volumes:
      - ./packages/observability/config/otel:/etc/otel
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
      - "8889:8889"   # Prometheus metrics

volumes:
  prometheus_data:
  grafana_data:
```

## 📊 Dashboards y Alertas

### Dashboards Incluidos

1. **Microservices Overview**
   - Request rate por servicio
   - Error rate global y por servicio
   - Latencia P95 y P99
   - Health summary table

2. **Frontend Performance**
   - Core Web Vitals (FCP, LCP, FID, CLS)
   - JavaScript errors por página
   - Performance trends

3. **Business Metrics**
   - Order creation rate
   - Payment success rate
   - Revenue stream

### Alertas Configuradas

- **API**: Error rate >1%, P95 latency >300ms
- **Frontend**: FCP >2.5s, TTI >5s, JS error rate >0.1/s
- **Business**: Order failure >5%, Payment failure >2%
- **Infrastructure**: CPU >80%, Memory >85%, DB connections >80%

## 🎯 Mejores Prácticas

### Nomenclatura de Spans y Logs

```typescript
// Spans
'ds.button.primary.click'
'api.orders.create'
'db.users.findById'

// Logs
'[OrderService] Order created successfully'
'[PaymentGateway] Payment processing failed'

// Métricas
'http_requests_total{service="order-service",method="POST",endpoint="/orders"}'
'ds_button_click_total{variant="primary",size="medium"}'
```

### Niveles de Log Recomendados

- **trace**: Debugging detallado, deshabilitado en producción
- **debug**: Información de debugging, habilitado en desarrollo
- **info**: Eventos importantes del negocio
- **warn**: Situaciones anormales pero recuperables
- **error**: Errores que requieren atención
- **fatal**: Errores críticos que causan terminación

### Performance

- Usar `throttle` en hooks de interacción para evitar spam
- Configurar `bufferSize` apropiado en frontend (100-500)
- Habilitar `captureRequestBody` solo cuando sea necesario
- Usar sampling en producción para reducir volumen

## 📚 Recursos Adicionales

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Pino Logger Documentation](https://getpino.io/)
- [Grafana Best Practices](https://grafana.com/docs/grafana/latest/best-practices/)
- [Prometheus Query Examples](https://prometheus.io/docs/prometheus/latest/querying/examples/)

## 📄 Licencia

MIT © A4CO