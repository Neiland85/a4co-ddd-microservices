# 📚 ÍNDICE COMPLETO DE PROMPTS PARA AGENTES

## 🎯 Visión General

Este documento organiza todos los prompts creados para llevar el proyecto **a4co-ddd-microservices** al **máximo nivel** de calidad, escalabilidad y madurez empresarial.

---

## 📋 Estado del Proyecto

### ✅ Quick Wins Completados

- [x] NestJS v11.x estandarizado
- [x] OrderModule completo con DDD
- [x] NATS JetStream corriendo
- [x] Test E2E real funcionando
- [x] Métricas de Prometheus
- [x] Infraestructura local lista

### 🎯 Nivel Actual: **30% → Objetivo: 95%+**

---

## 🗂️ Parte 1: Prompts Core (Saga + DDD + Producción)

Estos prompts desbloquean el flujo Saga completo y preparan el proyecto para producción.

### 🟢 AGENTE #1: Order Service - Saga Orchestration

**Archivo**: [`AGENT_1_ORDER_SAGA.md`](./AGENT_1_ORDER_SAGA.md)

**Objetivo**: Completar Order Service como orquestador de la Saga Order→Payment→Inventory

**Entregables**:

- ✅ OrderSaga con compensaciones completas
- ✅ Event handlers para PaymentConfirmed, PaymentFailed
- ✅ OrderRepository con persistencia real (TypeORM/Prisma)
- ✅ Métricas detalladas de saga lifecycle
- ✅ Tests unitarios + integración

**Tiempo estimado**: 2-3 horas
**Prioridad**: 🔴 CRÍTICA

---

### 🟡 AGENTE #2: Payment Service - DDD Complete

**Archivo**: [`AGENT_2_PAYMENT_DDD.md`](./AGENT_2_PAYMENT_DDD.md)

**Objetivo**: Implementar capa de dominio completa en Payment Service

**Entregables**:

- ✅ Payment Aggregate con estados y transiciones
- ✅ PaymentRepository (interface + implementación)
- ✅ Value Objects: Money, PaymentMethod, TransactionId
- ✅ Domain Events: PaymentProcessedEvent, PaymentFailedEvent
- ✅ Use Cases: ProcessPaymentUseCase, RefundPaymentUseCase
- ✅ Event handlers para OrderCreatedEvent
- ✅ Integración con Stripe API

**Tiempo estimado**: 3-4 horas
**Prioridad**: 🔴 CRÍTICA

---

### 🟡 AGENTE #3: Inventory Service - Event-Driven

**Archivo**: [`AGENT_3_INVENTORY_EVENTS.md`](./AGENT_3_INVENTORY_EVENTS.md)

**Objetivo**: Transformar Inventory Service en servicio event-driven

**Entregables**:

- ✅ InventoryItem Aggregate con reservas
- ✅ ReservationSaga para manejar expiración de reservas
- ✅ Event handlers: PaymentConfirmedEvent, OrderCancelledEvent
- ✅ Políticas de stock (threshold alerts, auto-reorder)
- ✅ Tests de concurrencia (race conditions)

**Tiempo estimado**: 2-3 horas
**Prioridad**: 🔴 CRÍTICA

---

### 🔵 AGENTE #4: Production Dockerfiles

**Archivo**: [`AGENT_4_PRODUCTION_DOCKER.md`](./AGENT_4_PRODUCTION_DOCKER.md)

**Objetivo**: Dockerfiles optimizados para producción

**Entregables**:

- ✅ Multi-stage builds (builder + runner)
- ✅ Non-root users (uid 1001)
- ✅ .dockerignore completo
- ✅ Health checks nativos
- ✅ Imágenes <100MB (Alpine)
- ✅ Scripts de build y scan de vulnerabilidades

**Tiempo estimado**: 1-2 horas
**Prioridad**: 🟠 ALTA

---

### 🔵 AGENTE #5: CI/CD Complete

**Archivo**: [`AGENT_5_CICD_COMPLETE.md`](./AGENT_5_CICD_COMPLETE.md)

**Objetivo**: Pipeline CI/CD completo con GitHub Actions

**Entregables**:

- ✅ Workflow de build + test + lint
- ✅ Build y push de imágenes Docker a GHCR
- ✅ Scan de seguridad (Trivy, GitGuardian)
- ✅ Deploy automático a Kubernetes
- ✅ Notificaciones de Slack
- ✅ Rollback automático si fallan health checks

**Tiempo estimado**: 2-3 horas
**Prioridad**: 🟠 ALTA

---

### 🟣 AGENTE #6: Event Bus Centralizado

**Archivo**: [`AGENT_6_EVENT_BUS.md`](./AGENT_6_EVENT_BUS.md)

**Objetivo**: Event Bus centralizado con NATS JetStream

**Entregables**:

- ✅ EventBus abstraction (IEventBus interface)
- ✅ NatsEventBus implementation
- ✅ Retry logic con exponential backoff
- ✅ Dead Letter Queue
- ✅ Event schema registry
- ✅ Monitoring de eventos (latency, throughput)

**Tiempo estimado**: 3-4 horas
**Prioridad**: 🟠 ALTA

---

## 🗂️ Parte 2: Prompts Cloud Native (Nivel Máximo)

Estos prompts llevan el proyecto a nivel empresarial con Kubernetes, observabilidad y escalabilidad.

### 🟢 AGENTE #7: Kubernetes + Helm

**Archivo**: [`AGENT_7_KUBERNETES_HELM.md`](./AGENT_7_KUBERNETES_HELM.md)

**Objetivo**: Despliegue Kubernetes con Helm charts

**Entregables**:

- ✅ Helm charts para cada microservicio
- ✅ ConfigMaps y Secrets
- ✅ HorizontalPodAutoscaler (HPA)
- ✅ PodDisruptionBudget (PDB)
- ✅ NetworkPolicies
- ✅ Ingress con NGINX
- ✅ Scripts de deploy multi-environment

**Tiempo estimado**: 4-5 horas
**Prioridad**: 🟡 MEDIA

---

### 🔵 AGENTE #8: Testing Avanzado

**Archivo**: [`AGENT_8_TESTING_ADVANCED.md`](./AGENT_8_TESTING_ADVANCED.md)

**Objetivo**: Suite de testing completa

**Entregables**:

- ✅ Unit tests con >80% coverage
- ✅ Integration tests con Testcontainers
- ✅ E2E tests de saga completa
- ✅ Contract tests con Pact
- ✅ Performance tests con k6
- ✅ Chaos testing con Litmus
- ✅ CI integration

**Tiempo estimado**: 5-6 horas
**Prioridad**: 🟡 MEDIA

---

### 🟣 AGENTE #9: Observability Stack

**Archivo**: [`AGENT_9_OBSERVABILITY.md`](./AGENT_9_OBSERVABILITY.md)

**Objetivo**: Observabilidad completa (Metrics, Logs, Traces)

**Entregables**:

- ✅ Prometheus + Grafana dashboards
- ✅ Loki para logs centralizados
- ✅ Jaeger para distributed tracing
- ✅ OpenTelemetry instrumentation
- ✅ Alertmanager con reglas
- ✅ SLIs/SLOs definidos

**Tiempo estimado**: 4-5 horas
**Prioridad**: 🟡 MEDIA

---

### 🟡 AGENTE #10: Event Sourcing

**Archivo**: [`AGENT_10_EVENT_SOURCING.md`](./AGENT_10_EVENT_SOURCING.md)

**Objetivo**: Implementar Event Sourcing con EventStoreDB

**Entregables**:

- ✅ EventStoreDB integration
- ✅ EventSourcedRepository
- ✅ Aggregate rehydration
- ✅ Projections para read models
- ✅ Snapshots para performance
- ✅ Event versioning strategy

**Tiempo estimado**: 6-8 horas
**Prioridad**: 🟢 BAJA (Avanzado)

---

### 🔵 AGENTE #11: Service Mesh (Istio)

**Archivo**: [`AGENT_11_SERVICE_MESH.md`](./AGENT_11_SERVICE_MESH.md)

**Objetivo**: Service Mesh con Istio

**Entregables**:

- ✅ Istio installation
- ✅ Sidecar injection automático
- ✅ mTLS estricto
- ✅ Virtual Services + Destination Rules
- ✅ Circuit breakers configurados
- ✅ Authorization Policies
- ✅ Kiali dashboard

**Tiempo estimado**: 4-5 horas
**Prioridad**: 🟢 BAJA (Avanzado)

---

### 🟣 AGENTE #12: API Gateway (Kong)

**Archivo**: [`AGENT_12_API_GATEWAY.md`](./AGENT_12_API_GATEWAY.md)

**Objetivo**: API Gateway con Kong

**Entregables**:

- ✅ Kong deployment en Kubernetes
- ✅ JWT authentication
- ✅ Rate limiting por consumer
- ✅ Request/Response transformation
- ✅ Caching de endpoints
- ✅ Prometheus metrics
- ✅ Konga UI para administración

**Tiempo estimado**: 3-4 horas
**Prioridad**: 🟢 BAJA (Avanzado)

---

## 📊 Roadmap de Ejecución Recomendado

### 🚀 Fase 1: Core Functionality (Semana 1)

**Objetivo**: Saga Order→Payment→Inventory funcionando E2E

```bash
# Día 1-2: Completar servicios core
./execute-agent.sh AGENT_1_ORDER_SAGA.md
./execute-agent.sh AGENT_2_PAYMENT_DDD.md

# Día 3: Inventory + Event Bus
./execute-agent.sh AGENT_3_INVENTORY_EVENTS.md
./execute-agent.sh AGENT_6_EVENT_BUS.md

# Día 4: Verificación E2E
pnpm test:e2e tests/e2e/order-saga-flow.e2e.spec.ts
```

**Resultado esperado**: ✅ Saga completa funcionando con compensaciones

---

### 🏗️ Fase 2: Production Ready (Semana 2)

**Objetivo**: Proyecto desplegable en producción

```bash
# Día 5-6: Dockerfiles + CI/CD
./execute-agent.sh AGENT_4_PRODUCTION_DOCKER.md
./execute-agent.sh AGENT_5_CICD_COMPLETE.md

# Día 7: Kubernetes local (Minikube/Kind)
./execute-agent.sh AGENT_7_KUBERNETES_HELM.md

# Día 8: Testing
./execute-agent.sh AGENT_8_TESTING_ADVANCED.md
```

**Resultado esperado**: ✅ Deploy automático a Kubernetes con CI/CD

---

### 🌟 Fase 3: Enterprise Grade (Semana 3)

**Objetivo**: Nivel empresarial con observabilidad y escalabilidad

```bash
# Día 9-10: Observability
./execute-agent.sh AGENT_9_OBSERVABILITY.md

# Día 11-12: Service Mesh
./execute-agent.sh AGENT_11_SERVICE_MESH.md

# Día 13: API Gateway
./execute-agent.sh AGENT_12_API_GATEWAY.md

# Día 14 (Opcional): Event Sourcing
./execute-agent.sh AGENT_10_EVENT_SOURCING.md
```

**Resultado esperado**: ✅ Proyecto de nivel Google/Netflix

---

## 🎯 Métricas de Éxito por Fase

### Fase 1: Core Functionality

- [ ] Saga Order→Payment→Inventory con compensaciones
- [ ] Tests E2E pasando (100%)
- [ ] Métricas de Prometheus expuestas
- [ ] NATS JetStream manejando eventos
- [ ] Latencia P95 < 500ms

### Fase 2: Production Ready

- [ ] Imágenes Docker < 100MB
- [ ] CI/CD pipeline verde
- [ ] Deploy a Kubernetes funcionando
- [ ] Health checks en todos los servicios
- [ ] Zero downtime deployments

### Fase 3: Enterprise Grade

- [ ] SLOs definidos y monitoreados
- [ ] Distributed tracing end-to-end
- [ ] mTLS entre todos los servicios
- [ ] API Gateway con autenticación JWT
- [ ] Dashboards de Grafana completos

---

## 🛠️ Herramientas Necesarias

### Locales

```bash
node --version       # v24.10.0+
pnpm --version       # 10.14.0+
docker --version     # 28.5.1+
kubectl version      # v1.30+
helm version         # v3.15+
```

### Cluster Kubernetes

- **Opción 1**: Minikube (local)
- **Opción 2**: Kind (local)
- **Opción 3**: GKE/EKS/AKS (cloud)

### Servicios Externos

- **NATS**: JetStream habilitado
- **PostgreSQL**: v16+
- **Redis**: v7+
- **EventStoreDB**: v23+ (solo para Agent #10)

---

## 📚 Recursos Adicionales

### Documentación de Referencia

- [Quick Wins README](../../QUICK_WINS_README.md)
- [Auditoría Manual](../AUDIT_MANUAL.md)
- [Auth Service](../../apps/auth-service/README.md) - Referencia DDD completa

### Conceptos DDD

- **Aggregates**: Raíz de consistencia
- **Value Objects**: Inmutables, sin identidad
- **Domain Events**: Hechos del pasado
- **Repositories**: Abstracción de persistencia
- **Use Cases**: Orquestación de lógica de aplicación

### Patrones de Arquitectura

- **Saga Pattern**: Transacciones distribuidas
- **CQRS**: Separación Command/Query
- **Event Sourcing**: Estado derivado de eventos
- **API Gateway**: Punto de entrada único
- **Service Mesh**: Service-to-service communication

---

## 🎓 Orden de Aprendizaje Recomendado

Si eres nuevo en estos conceptos, sigue este orden:

1. **DDD Basics** → Ejecuta Agent #2 (Payment DDD)
2. **Event-Driven** → Ejecuta Agent #6 (Event Bus)
3. **Saga Pattern** → Ejecuta Agent #1 (Order Saga)
4. **Kubernetes** → Ejecuta Agent #7 (K8s + Helm)
5. **Observability** → Ejecuta Agent #9 (Prometheus + Grafana)
6. **Advanced** → Agents #10, #11, #12

---

## 🤝 Contribuir

Si quieres añadir más prompts:

1. Crea archivo `AGENT_XX_NOMBRE.md` en `docs/prompts/`
2. Sigue la estructura de prompts existentes
3. Añade entrada en este índice
4. Actualiza roadmap si aplica

---

## 📞 Soporte

- **Issues**: GitHub Issues
- **Discusiones**: GitHub Discussions
- **Docs**: Este directorio (`docs/prompts/`)

---

## ✅ Checklist Final

Antes de considerar el proyecto "completo":

### Core (CRÍTICO)

- [ ] Agent #1: Order Saga ejecutado
- [ ] Agent #2: Payment DDD ejecutado
- [ ] Agent #3: Inventory Events ejecutado
- [ ] Test E2E completo pasando

### Production (REQUERIDO)

- [ ] Agent #4: Dockerfiles optimizados
- [ ] Agent #5: CI/CD pipeline verde
- [ ] Agent #6: Event Bus centralizado
- [ ] Agent #7: Kubernetes deployment funcionando

### Enterprise (OPCIONAL pero RECOMENDADO)

- [ ] Agent #8: Suite de tests completa (>80% coverage)
- [ ] Agent #9: Observability stack desplegado
- [ ] Agent #11: Service Mesh con mTLS
- [ ] Agent #12: API Gateway con autenticación

### Avanzado (NICE TO HAVE)

- [ ] Agent #10: Event Sourcing implementado
- [ ] Canary deployments configurados
- [ ] Multi-region setup
- [ ] Disaster recovery plan

---

**Estado actual del proyecto**: 30% → **Objetivo**: 95%+ 🚀

**Próximo paso recomendado**: Ejecutar **Agent #1** (Order Saga) para completar el flujo crítico.

```bash
# Comenzar con Agent #1
cd /Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices
open docs/prompts/AGENT_1_ORDER_SAGA.md
```

---

**Creado**: 2025-01-07
**Última actualización**: 2025-01-07
**Versión**: 1.0.0
