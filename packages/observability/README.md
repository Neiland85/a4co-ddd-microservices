# A4CO Observability Package

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

## 📦 Instalación

```bash
# En el workspace raíz
pnpm add @a4co/observability

# O en un microservicio específico
pnpm add @a4co/observability
```

## 🚀 Configuración Rápida

### Backend (Microservicios)

```typescript
import { initializeObservability } from '@a4co/observability';

const observability = initializeObservability({
  serviceName: 'product-service',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  logging: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV === 'development',
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