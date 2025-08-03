# A4CO Observability Package

Estrategia unificada de observabilidad para la plataforma A4CO con microservicios Node.js/TypeScript (DDD) y frontend Next.js/React 19.

## 🎯 Características Principales

### 1. **Logging Estructurado**
- **Backend**: Pino en JSON con niveles, metadata DDD (aggregate, command, event)
- **Frontend**: Instrumentación en React para capturar errores y eventos de usuario
- **Propagación**: Trace ID automático en logs y headers HTTP

### 2. **Tracing Distribuido**
- **Backend**: OpenTelemetry SDK con exporters Jaeger y Prometheus
- **Frontend**: OpenTelemetry Web para spans en navegación y API calls
- **Propagación**: Automática de Trace ID en HTTP y mensajería (NATS)
- **DDD**: Metadata específica para aggregates, commands y events

### 3. **Métricas y Dashboards**
- **Prometheus**: Métricas de latencia, errores y throughput
- **Grafana**: Dashboards con Core Web Vitals y performance de componentes UI
- **Alertas**: Configuración automática para error rates y latencias

### 4. **Design System Integration**
- **Componentes**: Tracking automático de eventos UI con metadata de props
- **Nomenclatura**: Spans y logs alineados con tokens de diseño
- **HOCs**: Wrappers automáticos para componentes críticos

## 🚀 Instalación

```bash
# Instalar el paquete
pnpm add @a4co/observability

# Para desarrollo
pnpm add -D @a4co/observability
```

## 📦 Configuración

### Backend (Microservicios)

```typescript
import { initializeObservability } from '@a4co/observability';

const observability = initializeObservability({
  serviceName: 'order-service',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  logging: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV !== 'production',
  },
  tracing: {
    enabled: true,
    jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    enableConsoleExporter: process.env.NODE_ENV === 'development',
    enableAutoInstrumentation: true,
  },
  metrics: {
    enabled: true,
    port: 9464,
    endpoint: '/metrics',
  },
});
```

### Frontend (Next.js/React)

```typescript
import { initializeFrontendObservability } from '@a4co/observability';

// En _app.tsx o layout principal
if (typeof window !== 'undefined') {
  initializeFrontendObservability({
    serviceName: 'dashboard-web',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.NEXT_PUBLIC_OTEL_ENDPOINT || 'http://localhost:4318/v1/traces',
    enableConsoleExporter: process.env.NODE_ENV === 'development',
    enableAutoInstrumentation: true,
    enableUserTracking: true,
    enablePerformanceTracking: true,
    enableErrorTracking: true,
  });
}
```

## 🔧 Uso

### 1. Logging Estructurado

```typescript
import { logger } from '@a4co/observability';

// Logging básico
logger.info('Order created successfully', { 
  orderId: 'order-123',
  customerId: 'customer-456',
  totalAmount: 99.99,
});

// Logging con metadata DDD
logger.info('Domain event emitted', {
  aggregate: 'Order',
  event: 'OrderCreated',
  aggregateId: 'order-123',
  domain: 'OrderManagement',
  boundedContext: 'Order',
});
```

### 2. Tracing Distribuido

#### Decoradores para Controladores

```typescript
import { withTracing } from '@a4co/observability';

class OrderController {
  @withTracing({
    operationName: 'createOrder',
    aggregate: 'Order',
    command: 'CreateOrder',
    domain: 'OrderManagement',
    boundedContext: 'Order',
    captureRequestBody: true,
    captureResponseBody: true,
  })
  async createOrder(req: Request, res: Response) {
    // Tu lógica aquí
  }
}
```

#### Spans Manuales con DDD

```typescript
import { createDDDSpan } from '@a4co/observability';

const result = await createDDDSpan(
  'Order.CreateOrder',
  {
    aggregate: 'Order',
    command: 'CreateOrder',
    domain: 'OrderManagement',
    boundedContext: 'Order',
  },
  async (span) => {
    // Tu lógica aquí
    span.setAttribute('order.customer_id', customerId);
    span.setAttribute('order.total_amount', totalAmount);
    
    return order;
  }
);
```

#### Propagación de Trace Context

```typescript
import { injectTraceContext } from '@a4co/observability';

const response = await fetch('http://inventory-service:3001/api/inventory/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...injectTraceContext(), // Propaga Trace ID automáticamente
  },
  body: JSON.stringify({ items }),
});
```

### 3. Frontend Observability

#### Hooks de React

```typescript
import { 
  useComponentTracking, 
  useNavigationTracking, 
  useAPITracking,
  usePerformanceTracking 
} from '@a4co/observability';

const MyComponent = () => {
  const { trackEvent, trackError } = useComponentTracking('MyComponent');
  const { trackPageView } = useNavigationTracking();
  const { trackAPICall } = useAPITracking();
  const { trackMetric } = usePerformanceTracking();

  useEffect(() => {
    trackEvent('mount');
    trackPageView('/dashboard');
  }, []);

  const handleClick = () => {
    trackEvent('click', { buttonType: 'primary' });
  };

  const handleAPI = async () => {
    const startTime = Date.now();
    const response = await fetch('/api/data');
    const duration = Date.now() - startTime;
    
    trackAPICall('GET', '/api/data', response.status, duration);
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

#### HOC para Tracking Automático

```typescript
import { withTracking } from '@a4co/observability';

const TrackedButton = withTracking(
  ({ children, ...props }) => <button {...props}>{children}</button>,
  'Button',
  {
    trackProps: true,
    trackEvents: ['click', 'hover', 'focus'],
    customAttributes: {
      'ds.category': 'interaction',
      'ds.type': 'button',
    },
  }
);
```

#### Error Boundaries

```typescript
import { ErrorBoundaryWithTracking } from '@a4co/observability';

const App = () => (
  <ErrorBoundaryWithTracking componentName="App">
    <YourApp />
  </ErrorBoundaryWithTracking>
);
```

### 4. Design System Integration

#### Componentes con Tracking Integrado

```typescript
import { 
  TrackedButton, 
  TrackedInput, 
  TrackedCard,
  useDSPlugin 
} from '@a4co/observability';

// Usar componentes pre-trackeados
const MyForm = () => (
  <TrackedCard variant="elevated">
    <TrackedInput
      name="email"
      placeholder="Email"
      variant="outlined"
      size="md"
    />
    <TrackedButton
      type="submit"
      variant="primary"
      size="lg"
    >
      Submit
    </TrackedButton>
  </TrackedCard>
);

// O usar el hook directamente
const CustomComponent = () => {
  const { trackEvent, trackError } = useDSPlugin('CustomComponent', {
    trackProps: true,
    trackEvents: ['click', 'hover'],
  });

  return <div onClick={() => trackEvent('click')}>Custom Component</div>;
};
```

#### Tracking de Eventos de Formulario

```typescript
import { trackFormEvent } from '@a4co/observability';

const handleSubmit = async (formData) => {
  try {
    const response = await submitForm(formData);
    
    trackFormEvent('user-registration', 'success', {
      userId: response.userId,
      email: formData.email,
    });
  } catch (error) {
    trackFormEvent('user-registration', 'validation_error', {
      error: error.message,
      field: error.field,
    });
  }
};
```

## 🏗️ Infraestructura

### Docker Compose

```bash
# Levantar infraestructura de observabilidad
cd packages/observability
docker-compose -f docker-compose.observability.yml up -d
```

### Servicios Disponibles

- **Grafana**: http://localhost:3000 (admin/a4co-admin-2024)
- **Prometheus**: http://localhost:9090
- **Jaeger**: http://localhost:16686
- **Alertmanager**: http://localhost:9093

### Dashboards

El dashboard principal incluye:

1. **Service Overview**: Estado de todos los microservicios
2. **Request Rate**: Tasa de requests por servicio y endpoint
3. **Response Time (P95)**: Latencia P95 por endpoint
4. **Error Rate**: Tasa de errores por servicio
5. **Frontend Performance**: Core Web Vitals (FCP, LCP, FID)
6. **Design System Events**: Eventos de componentes UI
7. **Database Performance**: Performance de queries
8. **DDD Events**: Eventos de dominio por aggregate
9. **System Resources**: CPU y memoria por servicio

### Alertas Configuradas

- **ServiceDown**: Servicio no disponible
- **HighLatency**: Latencia P95 > 300ms
- **HighErrorRate**: Error rate > 1%
- **OrdersCreateHighErrorRate**: Error rate específico en orders.create
- **FrontendSlowFCP**: FCP > 1.8s
- **FrontendSlowLCP**: LCP > 2.5s
- **FrontendHighFID**: FID > 100ms
- **HighMemoryUsage**: Memoria > 1GB
- **HighCPUUsage**: CPU > 80%
- **DatabaseSlowQueries**: Queries > 1s
- **DDDEventProcessingDelay**: Procesamiento de eventos > 5s
- **DSComponentHighErrorRate**: Error rate en componentes > 5%

## 📊 Métricas y Nomenclatura

### Backend Metrics

```
# HTTP Requests
http_requests_total{service_name="order-service", method="POST", route="/api/orders", status="201"}

# Response Time
http_request_duration_seconds_bucket{service_name="order-service", method="POST", route="/api/orders"}

# Database Queries
database_query_duration_seconds_bucket{service_name="order-service", query_type="select"}

# DDD Events
ddd_events_total{aggregate="Order", event_type="OrderCreated", service_name="order-service"}
```

### Frontend Metrics

```
# Core Web Vitals
frontend_fcp_seconds
frontend_lcp_seconds
frontend_fid_seconds

# Design System Events
ds_component_events_total{component_name="Button", event_type="click"}
ds_component_errors_total{component_name="Button"}

# API Calls
frontend_api_requests_total{method="POST", url="/api/orders", status="201"}
frontend_api_duration_seconds{method="POST", url="/api/orders"}
```

### Nomenclatura de Spans

```
# Backend
service_name.operation_name
order-service.createOrder

# DDD Operations
aggregate.command
Order.CreateOrder

# Frontend
component.event
Button.click

# Design System
ds-component.event
ds-button.primary.click
```

## 🔍 Troubleshooting

### Verificar Configuración

```typescript
// Verificar que la observabilidad esté inicializada
console.log('Observability initialized:', !!observability);

// Verificar tracer
const tracer = getTracer('test');
console.log('Tracer available:', !!tracer);
```

### Debug Mode

```typescript
// Habilitar logs detallados
const observability = initializeObservability({
  // ... otras configuraciones
  logging: {
    level: 'debug',
    prettyPrint: true,
  },
  tracing: {
    enableConsoleExporter: true,
  },
});
```

### Verificar Endpoints

```bash
# Verificar Prometheus
curl http://localhost:9090/api/v1/status/targets

# Verificar Jaeger
curl http://localhost:16686/api/services

# Verificar Grafana
curl http://localhost:3000/api/health
```

## 📚 Ejemplos

Ver la carpeta `examples/` para ejemplos completos:

- `order-service-example.ts`: Microservicio completo con observabilidad
- `frontend-example.tsx`: Aplicación React con tracking completo

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:

1. Revisa la documentación en este README
2. Consulta los ejemplos en la carpeta `examples/`
3. Abre un issue en el repositorio
4. Contacta al equipo de desarrollo

---

**A4CO Observability Package** - Estrategia unificada de observabilidad para microservicios y frontend 🚀