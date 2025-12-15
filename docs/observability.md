# 🔍 Observabilidad Distribuida con OpenTelemetry - A4CO DDD Microservices

## Tabla de Contenidos

- [Introducción](#introducción)
- [Arquitectura](#arquitectura)
- [Stack de Tecnologías](#stack-de-tecnologías)
- [Configuración Rápida](#configuración-rápida)
- [Instrumentación de Servicios](#instrumentación-de-servicios)
- [Dashboards Grafana](#dashboards-grafana)
- [Guía de Uso](#guía-de-uso)
- [Troubleshooting](#troubleshooting)
- [Mejores Prácticas](#mejores-prácticas)
- [Referencias](#referencias)

---

## Introducción

La observabilidad distribuida es fundamental para sistemas de microservicios modernos. Este documento describe la implementación completa de OpenTelemetry en la plataforma A4CO, proporcionando:

- **Trazado Distribuido**: Seguimiento de solicitudes a través de múltiples servicios
- **Métricas de Rendimiento**: Latencia, throughput, tasas de error
- **Logging Estructurado**: Logs correlacionados con trazas
- **Dashboards de Negocio**: Métricas específicas del dominio

### ¿Por qué OpenTelemetry?

- **Estándar de la Industria**: Proyecto CNCF con amplio soporte
- **Vendor-neutral**: No dependencia de proveedores específicos
- **Auto-instrumentación**: Instrumentación automática de frameworks
- **Extensible**: Fácil agregar instrumentación personalizada

---

## Arquitectura

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                       Microservicios A4CO                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Order   │  │ Payment  │  │Inventory │  │   Auth   │        │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       │ OTLP/HTTP   │ OTLP/HTTP   │ OTLP/HTTP   │ OTLP/HTTP     │
│       └─────────────┴─────────────┴─────────────┘               │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  OpenTelemetry Collector     │
              │  • OTLP Receiver (gRPC/HTTP) │
              │  • Batch Processing          │
              │  • Sampling (10%/100%)       │
              │  • Resource Detection        │
              └──────────────┬───────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌───────────────────┐     ┌─────────────────┐
    │      Jaeger       │     │   Prometheus    │
    │  (Traces Storage) │     │ (Metrics Export)│
    └─────────┬─────────┘     └────────┬────────┘
              │                         │
              └──────────┬──────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │      Grafana         │
              │  • Dashboards        │
              │  • Queries           │
              │  • Alertas           │
              └──────────────────────┘
```

### Componentes Clave

#### 1. OpenTelemetry SDK (en cada servicio)
- Inicialización del tracer
- Auto-instrumentación de HTTP, Express, Prisma
- Propagación de contexto (W3C TraceContext)
- Exportación OTLP

#### 2. OpenTelemetry Collector
- **Puerto 4317**: OTLP gRPC receiver
- **Puerto 4318**: OTLP HTTP receiver
- **Puerto 8888**: Métricas del collector (Prometheus)
- **Puerto 13133**: Health check

#### 3. Jaeger
- **Puerto 16686**: UI de trazas
- **Puerto 14268**: Jaeger collector
- **Puerto 9411**: Zipkin compatible endpoint

#### 4. Grafana
- **Puerto 3000**: UI y dashboards
- Datasources: Prometheus, Loki, Jaeger (futuro)

---

## Stack de Tecnologías

### Observabilidad

| Componente | Versión | Propósito |
|-----------|---------|-----------|
| **OpenTelemetry Collector** | 0.91.0 | Procesamiento y exportación de telemetría |
| **Jaeger** | 1.52 | Almacenamiento y visualización de trazas |
| **Prometheus** | 2.48.1 | Almacenamiento de métricas time-series |
| **Grafana** | 10.2.3 | Visualización y dashboards |
| **Loki** | 2.9.3 | Agregación de logs |
| **Promtail** | 2.9.3 | Colector de logs |

### Instrumentación (Node.js)

```json
{
  "@opentelemetry/api": "^1.9.0",
  "@opentelemetry/sdk-node": "^0.205.0",
  "@opentelemetry/auto-instrumentations-node": "^0.67.0",
  "@opentelemetry/exporter-trace-otlp-http": "^0.205.0",
  "@opentelemetry/instrumentation-http": "^0.208.0",
  "@opentelemetry/instrumentation-express": "^0.57.0"
}
```

---

## Configuración Rápida

### 1. Iniciar el Stack de Observabilidad

```bash
# Desde la raíz del proyecto
docker-compose -f docker-compose.observability.yml up -d

# Verificar servicios
docker-compose -f docker-compose.observability.yml ps

# Ver logs
docker-compose -f docker-compose.observability.yml logs -f
```

### 2. Verificar Servicios

```bash
# Grafana
curl http://localhost:3000/api/health
# Expected: {"commit":"...","database":"ok","version":"..."}

# Prometheus
curl http://localhost:9090/-/healthy
# Expected: Prometheus is Healthy.

# Jaeger
curl http://localhost:16686/
# Expected: Jaeger UI HTML

# OpenTelemetry Collector
curl http://localhost:13133/
# Expected: {"status":"Server available",...}
```

### 3. Acceder a las UIs

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Jaeger**: http://localhost:16686
- **AlertManager**: http://localhost:9093

---

## Instrumentación de Servicios

### Configuración Básica (NestJS)

#### 1. Variables de Entorno

Crear `.env` en cada servicio:

```env
# OpenTelemetry Configuration
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=order-service
OTEL_SERVICE_VERSION=1.0.0
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=1.0  # 100% en dev, 0.1 en prod
OTEL_RESOURCE_ATTRIBUTES=environment=development,cluster=a4co-local
```

#### 2. Inicializar OpenTelemetry

En `main.ts` de cada servicio:

```typescript
import { initializeTracing } from '@a4co/observability';

// Inicializar tracing ANTES de crear la app
initializeTracing({
  serviceName: process.env.OTEL_SERVICE_NAME || 'order-service',
  serviceVersion: process.env.OTEL_SERVICE_VERSION || '1.0.0',
  environment: process.env.ENVIRONMENT || 'development',
  jaegerEndpoint: process.env.JAEGER_ENDPOINT,
  enableAutoInstrumentation: true,
  enableConsoleExporter: process.env.NODE_ENV === 'development',
});

// Crear la aplicación
const app = await createApp(OrderModule, {
  serviceName: 'Order Service',
  port: 3004,
});

// Aplicar middleware de trace context
app.use((req, res, next) => {
  const middleware = new TraceContextMiddleware();
  middleware.use(req, res, next);
});
```

#### 3. Usar el Logger con Context

```typescript
import { getLogger } from '@a4co/observability';

export class OrderService {
  private readonly logger = getLogger();

  async createOrder(dto: CreateOrderDto) {
    // Logger automáticamente incluye traceId y spanId
    this.logger.info('Creating order', { 
      userId: dto.userId, 
      items: dto.items.length 
    });

    try {
      const order = await this.orderRepository.create(dto);
      this.logger.info('Order created successfully', { orderId: order.id });
      return order;
    } catch (error) {
      this.logger.error('Failed to create order', { 
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }
}
```

#### 4. Instrumentación Personalizada

```typescript
import { getTracer, startActiveSpan } from '@a4co/observability';

export class OrderService {
  private readonly tracer = getTracer();

  async processOrder(orderId: string) {
    return startActiveSpan('order.process', async (span) => {
      // Agregar atributos al span
      span.setAttributes({
        'order.id': orderId,
        'order.version': '2.0',
      });

      try {
        // Tu lógica de negocio aquí
        const result = await this.performProcessing(orderId);
        
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.recordException(error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        throw error;
      }
    });
  }
}
```

### Instrumentación Automática

El paquete `@a4co/observability` incluye auto-instrumentación para:

- ✅ **HTTP/HTTPS**: Requests y responses
- ✅ **Express**: Rutas y middleware
- ✅ **Prisma**: Queries de base de datos (vía instrumentación custom)
- ✅ **NATS**: Mensajería (vía instrumentación custom)

### Propagación de Contexto

#### Headers W3C TraceContext

El middleware `TraceContextMiddleware` automáticamente:

1. **Extrae** `traceparent` de headers entrantes
2. **Genera** nuevo `traceId` si no existe
3. **Inyecta** headers en responses:
   - `x-trace-id`: Trace ID
   - `x-span-id`: Span ID actual
   - `traceparent`: W3C formato

#### Propagación entre Servicios

```typescript
// En el cliente HTTP
import { injectContext } from '@a4co/observability';

const headers = {
  'Content-Type': 'application/json',
};

// Inyectar contexto de tracing
injectContext(headers);

await axios.post('http://payment-service/process', data, { headers });
```

```typescript
// En el receptor (automático con middleware)
// El TraceContextMiddleware extrae y restaura el contexto
```

---

## Dashboards Grafana

### 1. Order Flow Dashboard

**UID**: `a4co-order-flow`  
**Ruta**: `/d/a4co-order-flow/a4co-order-flow`

**Paneles**:
- Latencia por servicio (Order, Payment, Inventory)
- Tasa de éxito por servicio
- Request rate
- Logs de errores del flujo

**Queries de Ejemplo**:

```promql
# Latencia P95 del Order Service
histogram_quantile(0.95, 
  sum(rate(http_request_duration_seconds_bucket{service="order-service"}[5m])) by (le)
) * 1000

# Tasa de éxito
sum(rate(http_requests_total{service="order-service",status=~"2.."}[5m])) 
/ 
sum(rate(http_requests_total{service="order-service"}[5m]))
```

### 2. Errors Dashboard

**UID**: `a4co-errors`  
**Ruta**: `/d/a4co-errors/a4co-errors`

**Paneles**:
- Error rate por servicio
- TOP 10 errores (última hora)
- Error rate por status code
- Logs de error con stack traces

**Queries de Ejemplo**:

```promql
# Error rate por servicio
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)

# Top 10 errores
topk(10, 
  sum(increase(http_requests_total{status=~"5.."}[1h])) by (service, route, method)
)
```

### 3. Performance Dashboard

**UID**: `a4co-performance`  
**Ruta**: `/d/a4co-performance/a4co-performance`

**Paneles**:
- Latencia P50/P95/P99 por servicio
- Throughput por servicio y endpoint
- Database query latency
- Conexiones DB activas
- CPU y memoria por servicio

**Queries de Ejemplo**:

```promql
# Throughput por servicio
sum(rate(http_requests_total[5m])) by (service)

# DB query latency P95
histogram_quantile(0.95, 
  sum(rate(prisma_query_duration_seconds_bucket[5m])) by (service, operation, le)
) * 1000

# Conexiones DB activas
sum(db_connections_active) by (service)
```

### 4. Business Metrics Dashboard

**UID**: `a4co-business-metrics`  
**Ruta**: `/d/a4co-business-metrics/a4co-business-metrics`

**Paneles**:
- Órdenes creadas/completadas/fallidas
- Tasa de éxito de órdenes
- Órdenes por estado
- Tiempo de procesamiento de órdenes
- Pagos por estado
- Operaciones de inventario
- Top 10 categorías de productos

**Queries de Ejemplo**:

```promql
# Órdenes creadas (última hora)
sum(increase(orders_created_total[1h]))

# Tasa de éxito de órdenes
sum(increase(orders_completed_total[1h])) 
/ 
sum(increase(orders_created_total[1h]))

# Tiempo de procesamiento P95
histogram_quantile(0.95, 
  sum(rate(order_processing_duration_seconds_bucket[5m])) by (le)
) * 1000
```

---

## Guía de Uso

### Buscar Trazas en Jaeger

1. Abrir http://localhost:16686
2. Seleccionar servicio (ej: `order-service`)
3. Filtrar por:
   - Tags: `http.status_code=500`
   - Duration: `>1s`
   - Operación: `POST /orders`
4. Click en traza para ver detalles

### Correlacionar Logs y Trazas

#### En Loki (via Grafana)

```logql
# Buscar logs por trace ID
{service="order-service"} | json | traceId="4bf92f3577b34da6a3ce929d0e0e4736"

# Buscar errores con trace ID
{level="error"} | json | traceId != ""
```

#### En Application Logs

```typescript
// Los logs automáticamente incluyen traceId
this.logger.error('Payment failed', { 
  orderId: '123',
  error: 'Insufficient funds'
});

// Output JSON:
// {
//   "level": "error",
//   "message": "Payment failed",
//   "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
//   "spanId": "00f067aa0ba902b7",
//   "orderId": "123",
//   "error": "Insufficient funds",
//   "timestamp": "2025-12-15T20:00:00.000Z"
// }
```

### Crear Alertas

#### En Prometheus

Editar `infra/observability/prometheus/alerts.yml`:

```yaml
groups:
  - name: order_service_alerts
    interval: 30s
    rules:
      - alert: HighOrderFailureRate
        expr: |
          (
            sum(rate(orders_failed_total[5m]))
            /
            sum(rate(orders_created_total[5m]))
          ) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High order failure rate"
          description: "Order failure rate is {{ $value | humanizePercentage }}"
```

#### En Grafana

1. Abrir dashboard
2. Editar panel
3. Tab "Alert"
4. Configurar condición y notificación

---

## Troubleshooting

### Problema: No aparecen trazas en Jaeger

**Diagnóstico**:

```bash
# 1. Verificar OpenTelemetry Collector está recibiendo trazas
curl http://localhost:8888/metrics | grep otelcol_receiver

# 2. Verificar logs del collector
docker logs a4co-otel-collector

# 3. Verificar Jaeger está funcionando
curl http://localhost:16686/api/services
```

**Soluciones**:

1. Verificar `OTEL_EXPORTER_OTLP_ENDPOINT` en servicios
2. Verificar network connectivity entre servicio y collector
3. Aumentar sampling a 100% temporalmente
4. Revisar logs del servicio para errores de exportación

### Problema: Latencia alta en trazas

**Diagnóstico**:

```bash
# Verificar overhead del collector
docker stats a4co-otel-collector

# Verificar batch processor settings
curl http://localhost:8888/metrics | grep batch
```

**Soluciones**:

1. Ajustar `batch.timeout` en `otel-collector-config.yaml`
2. Aumentar `batch.send_batch_size`
3. Reducir sampling percentage en producción
4. Usar async exporters

### Problema: Grafana no muestra datos

**Diagnóstico**:

```bash
# Verificar datasources
curl -u admin:admin http://localhost:3000/api/datasources

# Verificar Prometheus tiene datos
curl http://localhost:9090/api/v1/query?query=up

# Verificar Loki tiene logs
curl http://localhost:3100/loki/api/v1/labels
```

**Soluciones**:

1. Verificar datasources configurados en Grafana
2. Recargar dashboards desde `infra/observability/grafana/dashboards/`
3. Verificar servicios exponen `/metrics` endpoint
4. Reiniciar Grafana: `docker-compose -f docker-compose.observability.yml restart grafana`

### Problema: Correlación de Trace ID incorrecta

**Diagnóstico**:

```typescript
// Agregar logging en middleware
console.log('Incoming headers:', req.headers);
console.log('Extracted traceId:', traceId);
```

**Soluciones**:

1. Verificar `TraceContextMiddleware` está aplicado
2. Verificar propagación de headers en HTTP clients
3. Usar `injectContext()` al hacer requests entre servicios
4. Verificar formato de `traceparent` header (W3C spec)

---

## Mejores Prácticas

### 1. Naming Conventions

#### Spans

```typescript
// ✅ BIEN: Descriptivo y jerárquico
startActiveSpan('order.create')
startActiveSpan('order.validate.items')
startActiveSpan('payment.process.card')

// ❌ MAL: Genérico o sin contexto
startActiveSpan('function1')
startActiveSpan('doSomething')
```

#### Atributos

```typescript
// ✅ BIEN: Namespaced y descriptivo
span.setAttributes({
  'order.id': orderId,
  'order.total.amount': total,
  'user.id': userId,
  'http.method': 'POST',
});

// ❌ MAL: Sin namespace
span.setAttributes({
  'id': orderId,
  'total': total,
});
```

### 2. Sampling Strategy

```yaml
# Desarrollo: 100% sampling
OTEL_TRACES_SAMPLER_ARG=1.0

# Staging: 50% sampling
OTEL_TRACES_SAMPLER_ARG=0.5

# Producción: 10% sampling (head-based)
OTEL_TRACES_SAMPLER_ARG=0.1

# Producción crítico: 100% sampling con filtros
# Usar tail-based sampling en collector para:
# - Todas las trazas con errores
# - Trazas lentas (>2s)
# - Muestra aleatoria del resto
```

### 3. Seguridad

```typescript
// ❌ NO HACER: Loguear datos sensibles
span.setAttributes({
  'user.password': password,  // ❌
  'credit.card.number': ccNumber,  // ❌
});

// ✅ HACER: Usar identificadores, redactar datos sensibles
span.setAttributes({
  'user.id': userId,  // ✅
  'payment.method': 'card',  // ✅
  'card.last4': last4Digits,  // ✅
});
```

### 4. Performance

```typescript
// ✅ BIEN: Usar async exporters con batching
// Configurado por defecto en otel-collector-config.yaml

// ✅ BIEN: Span granularidad apropiada
// Crear spans para:
// - Endpoints HTTP
// - Operaciones DB
// - Llamadas a servicios externos
// - Procesamiento de eventos

// ❌ MAL: Span por cada línea de código
// No crear spans para loops internos o operaciones triviales
```

### 5. Manejo de Errores

```typescript
// ✅ BIEN: Siempre cerrar spans y registrar excepciones
try {
  await operation();
  span.setStatus({ code: SpanStatusCode.OK });
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

// Mejor aún: usar wrapper helper
await withSpan('operation.name', async () => {
  await operation();
  // Auto-maneja span.end() y errores
});
```

---

## Referencias

### Documentación Oficial

- **OpenTelemetry**: https://opentelemetry.io/docs/
- **OpenTelemetry JS**: https://opentelemetry.io/docs/instrumentation/js/
- **Jaeger**: https://www.jaegertracing.io/docs/
- **Prometheus**: https://prometheus.io/docs/
- **Grafana**: https://grafana.com/docs/

### Especificaciones

- **W3C Trace Context**: https://www.w3.org/TR/trace-context/
- **OTLP Protocol**: https://opentelemetry.io/docs/specs/otlp/
- **Semantic Conventions**: https://opentelemetry.io/docs/specs/semconv/

### A4CO Específico

- **Observability Package**: `packages/observability/README.md`
- **Infrastructure Setup**: `infra/observability/README.md`
- **ADRs**: `docs/adr/` (Architecture Decision Records)

### Queries de Ejemplo

Ver más queries en:
- `infra/observability/grafana/dashboards/*.json`
- `infra/observability/prometheus/recording-rules.yml`

---

## Apéndice: Métricas Expuestas

### HTTP Metrics

```
http_requests_total{service, method, route, status}
http_request_duration_seconds_bucket{service, method, route, le}
```

### Event Metrics

```
event_published_total{service, event_type}
event_consumed_total{service, event_type, consumer}
event_processing_errors_total{service, event_type}
event_processing_duration_seconds_bucket{service, event_type, le}
```

### Business Metrics

```
orders_created_total{service, status}
orders_completed_total{service}
orders_failed_total{service, reason}
payments_processed_total{service, status}
inventory_operations_total{service, operation}
```

### Database Metrics

```
db_connections_active{service}
db_connections_idle{service}
prisma_query_duration_seconds_bucket{service, operation, le}
```

---

**Versión**: 1.0.0  
**Última Actualización**: 2025-12-15  
**Autor**: A4CO Platform Team  
**Mantenedor**: @a4co/observability
