# Estrategia Unificada de Observabilidad - A4CO Platform

## 📋 Resumen Ejecutivo

Se ha implementado una estrategia completa de observabilidad unificada para la plataforma A4CO que abarca:

1. **Paquete centralizado `@a4co/observability`** con todas las herramientas necesarias
2. **Logging estructurado** con Pino en formato JSON
3. **Tracing distribuido** con OpenTelemetry y Jaeger
4. **Métricas** con Prometheus y Grafana
5. **Instrumentación automática** para microservicios y frontend
6. **Integración con arquitectura DDD** y Design System

## 🏗️ Arquitectura Implementada


```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│    NATS     │
│   (React)   │     │  (Node.js)  │     │  (Message)  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌─────────────────────────────────────────────────────┐
│              @a4co/observability                     │
│  (Logging, Tracing, Metrics, Instrumentation)       │
└──────┬───────────────────┬───────────────────┬──────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Jaeger    │     │ Prometheus  │     │   Grafana   │
│  (Tracing)  │     │  (Metrics)  │     │(Dashboards) │
└─────────────┘     └─────────────┘     └─────────────┘


```


## 🚀 Componentes Implementados

### 1. Logging Estructurado

- **Backend**: Pino con formateo JSON y metadatos DDD
- **Frontend**: Logger del navegador con envío asíncrono al backend
- **Características**:
  - Correlación automática con trace IDs
  - Redacción de datos sensibles
  - Contexto enriquecido (usuario, tenant, aggregate)
  - Pretty printing en desarrollo

### 2. Tracing Distribuido

- **OpenTelemetry SDK** configurado para Node.js
- **Propagación automática** de contexto en HTTP y NATS
- **Instrumentación automática** para:
  - Express/Koa
  - HTTP requests
  - NATS messaging
  - Redis
  - MongoDB
- **Exportadores**: Jaeger y Prometheus

### 3. Métricas

- **Métricas predefinidas**:
  - HTTP (requests, errors, latency)
  - DDD (commands, events)
  - Sistema (CPU, memoria)
- **Métricas personalizadas** con API simple
- **Dashboards Grafana** preconfigurados
- **Alertas automatizadas** basadas en SLOs

### 4. Frontend (React)

- **Provider de observabilidad** para toda la app
- **Hooks personalizados**:
  - `useObservability()`
  - `useEventTracking()`
  - `useComponentTracking()`
- **Componentes instrumentados** del Design System
- **Performance tracking** automático
- **Error boundaries** con logging

### 5. Integraciones DDD

- **Decoradores TypeScript**:
  - `@CommandHandler()`
  - `@EventHandler()`
  - `@Trace()`
  - `@Repository()`
- **Metadata tracking** de aggregates, comandos y eventos
- **Spans especializados** para operaciones DDD

## 📦 Uso del Paquete

### Instalación


```bash
pnpm add @a4co/observability


```


### Backend Setup


```typescript
import { quickStart } from '@a4co/observability';

await quickStart('my-service', {
  serviceVersion: '1.0.0',
  environment: 'production',
});

```


### Frontend Setup


```tsx
import { ObservabilityProvider } from '@a4co/observability/react';

function App() {
  return (
    <ObservabilityProvider apiEndpoint="/api/observability">
      <YourApp />
    </ObservabilityProvider>
  );
}

```


## 🐳 Despliegue en Kubernetes

### Archivos de Configuración Creados

1. **Jaeger**: `packages/observability/k8s/jaeger-values.yaml`
2. **Prometheus**: `packages/observability/k8s/prometheus-values.yaml`
3. **Alertas**: `packages/observability/k8s/prometheus-alerts.yaml`
4. **Dashboards**: `packages/observability/k8s/grafana-dashboards/`

### Comandos de Despliegue


```bash
# Namespace
kubectl create namespace a4co-monitoring

# Jaeger
helm install jaeger jaegertracing/jaeger \
  -f packages/observability/k8s/jaeger-values.yaml \
  -n a4co-monitoring

# Prometheus + Grafana
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -f packages/observability/k8s/prometheus-values.yaml \
  -n a4co-monitoring

# Alertas
kubectl apply -f packages/observability/k8s/prometheus-alerts.yaml


```


## 📊 Dashboards y Alertas

### Dashboards Grafana

1. **Microservices Overview**: Métricas generales de todos los servicios
2. **DDD Metrics**: Comandos y eventos por aggregate
3. **Frontend Performance**: Core Web Vitals y eventos UI

### Alertas Configuradas

- **Error Rate > 1%**: Alerta crítica
- **Latencia P95 > 300ms**: Alerta de warning
- **Service Down**: Alerta crítica después de 2 minutos
- **CPU/Memory > 90%**: Alerta de warning
- **Command Failure Rate > 5%**: Alerta de warning
- **Event Processing Lag > 100**: Alerta de warning

## 🔧 Variables de Entorno

### Backend


```bash
NODE_ENV=production
SERVICE_NAME=order-service
SERVICE_VERSION=1.0.0
JAEGER_ENDPOINT=http://jaeger:14268/api/traces
METRICS_PORT=9090
LOG_LEVEL=info


```


### Frontend


```bash
REACT_APP_OBSERVABILITY_ENDPOINT=https://api.a4co.com/observability


```


## 📈 Beneficios Logrados

1. **Visibilidad completa** de cada petición desde el frontend hasta la base de datos
2. **Debugging mejorado** con trace IDs correlacionados
3. **Detección proactiva** de problemas con alertas automatizadas
4. **Métricas de negocio** integradas (comandos DDD, eventos)
5. **Performance tracking** en frontend y backend
6. **Análisis de comportamiento** de usuarios con eventos UI

## 🔍 Ejemplos de Uso

### Rastrear una Petición Completa

1. Usuario hace click en botón (frontend)
2. Se genera trace ID y se envía con la petición
3. Backend recibe trace ID y lo propaga
4. NATS messages incluyen trace ID
5. Todos los logs incluyen trace ID
6. En Jaeger se ve la traza completa

### Debugging con Logs Correlacionados


```json
{
  "level": "info",
  "time": "2024-01-15T10:30:45.123Z",
  "service": "order-service",
  "traceId": "abc123def456",
  "spanId": "789ghi012",
  "correlationId": "order-2024-001",
  "ddd": {
    "aggregate": { "name": "Order", "id": "123" },
    "command": "CreateOrder"
  },
  "msg": "Processing CreateOrder command"
}

```


## 📚 Documentación Adicional

- **README completo**: `packages/observability/README.md`
- **Ejemplos backend**: `packages/observability/examples/microservice-setup.ts`
- **Ejemplos frontend**: `packages/observability/examples/react-app-setup.tsx`

## ✅ Checklist de Implementación

- [x] Paquete @a4co/observability creado
- [x] Logging con Pino configurado
- [x] Tracing con OpenTelemetry implementado
- [x] Métricas con Prometheus configuradas
- [x] Middleware para Express/Koa
- [x] Instrumentación de NATS
- [x] Componentes React instrumentados
- [x] Integración con Design System
- [x] Dashboards de Grafana
- [x] Alertas de Prometheus
- [x] Configuración Helm/K8s
- [x] Documentación completa
- [x] Ejemplos de implementación

## 🎯 Próximos Pasos Recomendados

1. **Integrar con CI/CD** para métricas de deployment
2. **Añadir Loki** para agregación de logs
3. **Implementar SLOs** específicos por servicio
4. **Crear runbooks** para cada alerta
5. **Añadir distributed tracing** para GraphQL
6. **Implementar custom dashboards** por equipo

La estrategia de observabilidad está completamente implementada y lista para usar en todos los microservicios y aplicaciones frontend de la plataforma A4CO.
