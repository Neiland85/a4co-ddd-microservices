# Informe Técnico Estructurado: Arquitectura DDD — A4CO Microservices

> **Autor:** Análisis automatizado por arquitecto senior backend (DDD)
> **Fecha:** Febrero 2026
> **Alcance:** Análisis completo del monorepo `a4co-ddd-microservices`
> **Metodología:** Inspección estática de código fuente, esquemas Prisma, manifiestos de paquetes, eventos compartidos y configuración de infraestructura

---

## Índice

1. [Mapa actual de Bounded Contexts](#1-mapa-actual-de-bounded-contexts)
2. [Lista de servicios activos en `apps/`](#2-lista-de-servicios-activos-en-apps)
3. [Dependencias reales entre servicios](#3-dependencias-reales-entre-servicios)
4. [Módulos puramente ecommerce/comercial](#4-módulos-puramente-ecommercecomercial-no-jurídicos)
5. [Reutilización para gestión de evidencias digitales](#5-reutilización-para-un-sistema-de-gestión-de-evidencias-digitales)

---

## 1. Mapa actual de Bounded Contexts

El monorepo implementa **9 Bounded Contexts** diferenciados, cada uno con su propio modelo de dominio, lenguaje ubicuo y base de datos independiente (PostgreSQL por servicio).

### 1.1 Diagrama de Bounded Contexts

```
┌──────────────────────────────────────────────────────────────────────┐
│                     PLATAFORMA A4CO                                  │
│                                                                       │
│  ┌───────────────┐   ┌───────────────┐   ┌──────────────────────┐   │
│  │  Identity &   │   │     User      │   │       Catalog        │   │
│  │  Access (IAM) │   │  Management   │   │  (Product Catalog)   │   │
│  │               │   │               │   │                       │   │
│  │  auth-service │   │  user-service │   │  product-service     │   │
│  └───────────────┘   └───────────────┘   └──────────────────────┘   │
│                                                                       │
│  ┌───────────────┐   ┌───────────────┐   ┌──────────────────────┐   │
│  │   Inventory   │   │     Order     │   │      Payment         │   │
│  │  Management   │   │   Lifecycle   │   │    Processing        │   │
│  │               │   │  (Orchestr.)  │   │                       │   │
│  │  inventory-s. │   │  order-svc    │   │  payment-service     │   │
│  └───────────────┘   └───────────────┘   └──────────────────────┘   │
│                                                                       │
│  ┌───────────────┐   ┌───────────────┐   ┌──────────────────────┐   │
│  │   Logistics   │   │ Notification  │   │  Platform / Cross-   │   │
│  │  & Shipment   │   │    Channel    │   │  Cutting (Gateway)   │   │
│  │               │   │               │   │                       │   │
│  │  transportis. │   │  notification │   │  gateway (infra)     │   │
│  └───────────────┘   └───────────────┘   └──────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Descripción de cada Bounded Context

| # | Bounded Context | Servicio | Aggregate raíz | Lenguaje ubicuo clave |
|---|----------------|---------|---------------|----------------------|
| 1 | **Identity & Access (IAM)** | `auth-service` | `User` (con `Session`, `RefreshToken`) | Usuario, Sesión, Token JWT, Credencial |
| 2 | **User Management** | `user-service` | `User` (perfil) | Usuario, Cuenta, Email, Username |
| 3 | **Product Catalog** | `product-service` | `Product` | SKU, Slug, Variante, Tipo de producto, Artesano |
| 4 | **Inventory Management** | `inventory-service` | `Product` + `StockReservation` | Stock, Reserva, Movimiento, TTL de reserva |
| 5 | **Order Lifecycle** | `order-service` | `Order` | Pedido, Línea, Estado, Importe total, Saga |
| 6 | **Payment Processing** | `payment-service` | `Payment` | Pago, Intent de Stripe, Estado de pago, Reembolso |
| 7 | **Logistics & Shipment** | `transportista-service` | `Shipment` + `Transportista` | Envío, Transportista, Recogida, Entrega, Seguimiento |
| 8 | **Notification Channel** | `notification-service` | `Notification` | Notificación, Canal, Destinatario, Plantilla |
| 9 | **Platform / API Gateway** | `gateway` | *(cross-cutting)* | Proxy, Autenticación JWT, Rate Limit, Correlación |

### 1.3 Dominio compartido (Shared Kernel)

El proyecto utiliza varios paquetes como Shared Kernel:

- **`@a4co/shared-events`** (`packages/shared-events`): Tipos de eventos versionados (`order.created.v1`, `payment.confirmed.v1`, etc.) y clase base `DomainEventBase` con `eventId`, `correlationId`, `timestamp`.
- **`@a4co/shared-utils`** (`packages/shared-utils`): Clases base `AggregateRoot`, `ValueObject`, `DomainEvent`; DTOs de respuesta/paginación/error; decoradores NestJS.
- **`@a4co/observability`** (`packages/observability`): OpenTelemetry, Prometheus, logging estructurado (Pino).
- **`@a4co/domain-order`** (`packages/domain/order`): Puerto `IOrderRepository` y tipos del dominio Order.
- **`@a4co/domain-payment`** (`packages/domain/payment`): Entidad `Payment` completa y puerto `PaymentRepository`.
- **`@a4co/domain-inventory`** (`packages/domain/inventory`): Entidades de inventario y puertos.
- **`packages/outbox-publisher`**: Patrón transactional outbox sobre NATS JetStream.

---

## 2. Lista de servicios activos en `apps/`

### 2.1 Servicios de negocio (activos y en workspace pnpm)

| Servicio | Ruta | Package | Puerto (dev) | Estado | BD |
|----------|------|---------|-------------|--------|-----|
| **Auth Service** | `apps/services/auth-service` | `@a4co/auth-service` | 4000 | ✅ Activo | PostgreSQL (schema propio) |
| **User Service** | `apps/services/user-service` | `@a4co/user-service` | — | ✅ Activo (lint frozen FASE 3) | PostgreSQL |
| **Product Service** | `apps/services/product-service` | `@a4co/product-service` | 3002 | ✅ Activo | PostgreSQL |
| **Inventory Service** | `apps/services/inventory-service` | `@a4co/inventory-service` | — | ✅ Activo | PostgreSQL (migraciones) |
| **Order Service** | `apps/services/order-service` | `@a4co/order-service` | 3000 | ✅ Activo | PostgreSQL |
| **Payment Service** | `apps/services/payment-service` | `@a4co/payment-service` | 3001 | ✅ Activo (lint frozen) | PostgreSQL |
| **Transportista Service** | `apps/transportista-service` | `@a4co/transportista-service` | — | ✅ Activo | PostgreSQL |

### 2.2 Servicios de infraestructura (activos)

| Servicio | Ruta | Package | Puerto (prod) | Función |
|----------|------|---------|--------------|---------|
| **API Gateway** | `apps/infrastructure/gateway` | `@a4co/gateway` | 8080 | Proxy HTTP/JWT, rate limiting, CORS |
| **Notification Service** | `apps/infrastructure/notification-service` | `@a4co/notification-service` | — | Email (SendGrid), SMS (Twilio), Push (Firebase) |

### 2.3 Aplicaciones frontend (activas)

| Aplicación | Ruta | Tecnología | Puerto | Propósito |
|------------|------|-----------|--------|-----------|
| **Dashboard Client** | `apps/dashboard-client` | Next.js 15, React 19 | 3000 | Panel de administración + E2E tests |
| **Dashboard Web** | `apps/dashboard-web` | Next.js 15, React 19 | — | Dashboard web alternativo |
| **Frontend** | `apps/frontend` | — | — | Aplicación frontend cliente |

### 2.4 Servicios esqueleto (excluidos del workspace pnpm — NO activos)

Los siguientes servicios existen como archivos TypeScript mínimos pero están **excluidos explícitamente** de `pnpm-workspace.yaml`:

| Servicio | Estado | Contenido actual |
|----------|--------|-----------------|
| `apps/chat-service` | ❌ Skeleton frozen | `controller.ts`, `dto.ts`, `service.ts` (sin package.json completo) |
| `apps/analytics-service` | ❌ Skeleton frozen | Ídem |
| `apps/artisan-service` | ❌ Skeleton frozen | Ídem |
| `apps/cms-service` | ❌ Skeleton frozen | Ídem |
| `apps/event-service` | ❌ Skeleton frozen | Ídem |
| `apps/geo-service` | ❌ Skeleton frozen | Con esquema Prisma mínimo |
| `apps/loyalty-service` | ❌ Skeleton frozen | Con esquema Prisma mínimo |
| `apps/admin-service` | ❌ Skeleton frozen | Ídem |
| `apps/notification-service` (raíz) | ❌ Legacy location | Duplicado excluido (`!apps/notification-service/**`) |

---

## 3. Dependencias reales entre servicios

### 3.1 Comunicación asíncrona — NATS JetStream

El patrón central es **Saga Orchestration** vía NATS JetStream. El `order-service` actúa como orquestador de la saga de pedido.

#### Flujo principal (Happy Path)

```
Cliente HTTP
     │
     ▼
┌──────────┐  POST /orders  ┌───────────────┐
│  Gateway  │──────────────▶│  Order Service │
└──────────┘                └───────┬───────┘
                                    │ NATS: order.created.v1
                           ┌────────▼────────┐
                           │Inventory Service│
                           │                 │
                           │ (reserva stock) │
                           └────────┬────────┘
                                    │ NATS: inventory.reserved.v1
                           ┌────────▼────────┐
                           │ Order Service   │
                           │ (saga step 2)   │
                           └────────┬────────┘
                                    │ NATS: payment.initiate
                           ┌────────▼────────┐
                           │ Payment Service │
                           │  (Stripe API)   │
                           └────────┬────────┘
                                    │ NATS: payment.confirmed.v1
                           ┌────────▼────────┐
                           │ Order Service   │ ──NATS: order.confirmed.v1──▶ Notification Service
                           │ (CONFIRMED)     │ ──NATS: order.confirmed.v1──▶ Transportista Service
                           └─────────────────┘
```

#### Flujo de compensación (Rollback Saga)

```
Stock insuficiente → NATS: inventory.out_of_stock.v1
                   → Order Service: compensa → NATS: order.cancelled.v1
                   → Inventory Service: libera reservas

Pago fallido      → NATS: payment.failed.v1
                  → Order Service: cancela pedido → NATS: order.cancelled.v1
                  → Inventory Service: libera stock reservado
```

### 3.2 Tabla de eventos y dependencias

| Productor | Evento NATS | Consumidores |
|-----------|------------|-------------|
| `order-service` | `order.created.v1` | `inventory-service`, `payment-service` |
| `order-service` | `order.confirmed.v1` | `notification-service`, `transportista-service` |
| `order-service` | `order.cancelled.v1` | `inventory-service`, `payment-service` |
| `inventory-service` | `inventory.reserved.v1` | `order-service` |
| `inventory-service` | `inventory.out_of_stock.v1` | `order-service` |
| `inventory-service` | `inventory.released.v1` | `order-service` |
| `payment-service` | `payment.confirmed.v1` | `order-service`, `inventory-service` |
| `payment-service` | `payment.failed.v1` | `order-service` |
| `transportista-service` | `shipment.delivered.v1` | `notification-service` |

### 3.3 Comunicación síncrona — HTTP (vía API Gateway)

```
Clientes externos
       │
       ▼
┌─────────────────────────────────────┐
│          API Gateway                │
│  (JWT validation, rate limit,       │
│   correlation-id injection)         │
│                                     │
│  /api/v1/auth/*     → auth-service  │
│  /api/v1/products/* → product-svc   │
│  /api/v1/orders/*   → order-svc     │
│  /api/v1/inventory/*→ inventory-svc │
│  /api/v1/payments/* → payment-svc   │
│  /api/v1/sagas/*    → order-svc     │
└─────────────────────────────────────┘
```

### 3.4 Dependencias de paquetes compartidos

```
Todos los servicios backend
        │
        ├── @a4co/shared-utils       (clases base DDD)
        ├── @a4co/observability      (métricas, trazas)
        └── @a4co/shared-events      (tipos de eventos versionados)

order-service       ──▶ @a4co/domain-order
payment-service     ──▶ @a4co/domain-payment
inventory-service   ──▶ @a4co/domain-inventory
```

### 3.5 Dependencias de infraestructura de datos

- **PostgreSQL**: cada servicio tiene su propia base de datos lógica (schema Prisma independiente), sin joins entre servicios.
- **NATS 2.10 JetStream**: broker de mensajes compartido para todos los eventos de dominio.
- **Redis**: caché compartida (configurada en producción para gateway y auth-service).

---

## 4. Módulos puramente ecommerce/comercial (no jurídicos)

**Todos** los módulos actuales del repositorio son de naturaleza **estrictamente comercial/ecommerce**. No existen conceptos jurídicos, legales, de compliance o de evidencia digital en ningún bounded context activo.

### 4.1 Clasificación por tipo

#### Módulos de catálogo y producto

| Módulo | Concepto central | Naturaleza comercial |
|--------|----------------|---------------------|
| `product-service` | `Product` con SKU, precio, tipo (`MADE_TO_ORDER`, `SEASONAL`), artesano | Catálogo de comercio electrónico |
| `inventory-service` | `Product` + `StockReservation` con TTL | Gestión de stock para venta online |

**Conceptos NO jurídicos:** SKU, precio, variante de producto, stock, reserva temporal.

#### Módulos de transacción comercial

| Módulo | Concepto central | Naturaleza comercial |
|--------|----------------|---------------------|
| `order-service` | `Order` con `OrderItem`, `OrderStatus` (PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED) | Ciclo de vida de pedidos de e-commerce |
| `payment-service` | `Payment` con `Stripe` integration, estados (PENDING/PROCESSING/SUCCEEDED/FAILED/REFUNDED) | Procesamiento de pagos electrónicos |

**Conceptos NO jurídicos:** carrito, importe, moneda (EUR), método de pago, reembolso, Stripe PaymentIntent.

#### Módulos de logística y entrega

| Módulo | Concepto central | Naturaleza comercial |
|--------|----------------|---------------------|
| `transportista-service` | `Shipment` + `Transportista`, estrategia de asignación aleatoria | Logística last-mile para e-commerce |

**Conceptos NO jurídicos:** envío, transportista, dirección de recogida/entrega, coste de envío (5% del pedido).

#### Módulos de identidad y usuario

| Módulo | Concepto central | Naturaleza comercial |
|--------|----------------|---------------------|
| `auth-service` | `User` con `Session`, `RefreshToken`, bcrypt, JWT | Autenticación estándar para plataforma comercial |
| `user-service` | `User` perfil básico (email, nombre) | Gestión de cuentas de clientes |

**Nota:** Aunque la autenticación puede adaptarse a otros dominios, la implementación actual no contiene roles de compliance, auditoría judicial ni gestión de certificados.

#### Módulos de comunicación y notificación

| Módulo | Concepto central | Naturaleza comercial |
|--------|----------------|---------------------|
| `notification-service` | Notificación de confirmación de pedido, envío entregado | Marketing transaccional (SendGrid, Twilio, Firebase) |
| `gateway` | Proxy HTTP, JWT validation, rate limiting | Infraestructura de API para plataforma e-commerce |

#### Módulos de UI

| Módulo | Concepto central | Naturaleza comercial |
|--------|----------------|---------------------|
| `dashboard-client` | Panel de administración (Next.js 15) | Backoffice de e-commerce |
| `dashboard-web` | Dashboard web alternativo | Monitorización de plataforma comercial |

### 4.2 Ausencia de conceptos jurídicos

El análisis confirma que **ninguno** de los siguientes conceptos aparece en el código fuente:

- ❌ Cadena de custodia / `ChainOfCustody`
- ❌ Evidencia digital / `DigitalEvidence`
- ❌ Hash de integridad de documento / `DocumentHash`
- ❌ Sellado de tiempo (RFC 3161) / `TimestampToken`
- ❌ Firma digital / `DigitalSignature`
- ❌ Retención legal / `LegalHold`
- ❌ Expediente judicial / `JudicialRecord`
- ❌ Custodio / `Custodian`
- ❌ Admisibilidad probatoria / `EvidenceAdmissibility`
- ❌ GDPR/RGPD compliance records

---

## 5. Reutilización para un sistema de gestión de evidencias digitales

Un sistema de **gestión de evidencias digitales** (Digital Evidence Management System, DEMS) comparte con A4CO varios patrones fundamentales: trazabilidad de eventos, cadena de custodia auditada, inmutabilidad de registros y flujos de trabajo multi-paso. A continuación se detalla qué partes son directamente reutilizables y cuáles requieren adaptación.

### 5.1 Componentes directamente reutilizables (sin cambios o con adaptación mínima)

#### A. `packages/shared-events` — Sistema de eventos versionados

**Reutilizabilidad: ★★★★★ (muy alta)**

La clase `DomainEventBase` y el sistema de tipos versionados son ideales para la cadena de custodia de evidencias:

```typescript
// Adaptación propuesta para DEMS
export const EvidenceEventTypes = {
  EVIDENCE_CAPTURED_V1:       'evidence.captured.v1',
  EVIDENCE_CUSTODY_TRANSFERRED_V1: 'evidence.custody.transferred.v1',
  EVIDENCE_INTEGRITY_VERIFIED_V1:  'evidence.integrity.verified.v1',
  EVIDENCE_SUBMITTED_V1:      'evidence.submitted.v1',
  EVIDENCE_ARCHIVED_V1:       'evidence.archived.v1',
} as const;
```

Cada evento lleva automáticamente: `eventId` (UUID para idempotencia), `correlationId` (trazabilidad de flujo), `timestamp` (marca temporal inmutable), `metadata` (metadatos extensibles).

#### B. `packages/shared-utils` — Clases base DDD

**Reutilizabilidad: ★★★★★ (muy alta)**

Las clases `AggregateRoot`, `ValueObject`, `DomainEvent`, `AggregateRoot.addDomainEvent()` son agnósticas al dominio y se pueden usar directamente para modelar:

- `Evidence` aggregate (con `EvidenceId`, `EvidenceHash`, `CustodyChain` VOs)
- `Custodian` entity
- `EvidenceFile` value object
- `CustodyTransfer` domain event

#### C. `packages/outbox-publisher` — Transactional Outbox

**Reutilizabilidad: ★★★★★ (muy alta — crítica para DEMS)**

El patrón transactional outbox garantiza que **ningún evento de evidencia se pierde** aunque el servicio falle entre la escritura en BD y la publicación en NATS. Esto es fundamental para la integridad de la cadena de custodia. El `OutboxPublisher` con `msgID = eventId` asegura idempotencia en JetStream.

#### D. `apps/infrastructure/gateway` — API Gateway

**Reutilizabilidad: ★★★★☆ (alta)**

El gateway implementa:
- Validación JWT con `passport-jwt`
- Rate limiting via `@nestjs/throttler`
- Inyección de `X-Correlation-ID` para trazabilidad
- `helmet` para cabeceras de seguridad
- CORS configurable

Todo esto es directamente aplicable a un DEMS con autenticación de usuarios judiciales/policiales.

#### E. `apps/services/auth-service` — Autenticación JWT

**Reutilizabilidad: ★★★★☆ (alta)**

La implementación de JWT con refresh tokens, bcrypt y sesiones es reutilizable como base de control de acceso para custodios y oficiales. Se necesitaría añadir roles (custodio, perito, juez, fiscal) y RBAC.

#### F. `packages/observability` — OpenTelemetry + Prometheus

**Reutilizabilidad: ★★★★★ (muy alta)**

Las métricas de trazabilidad distribuida son esenciales en un DEMS para auditar qué usuario accedió a qué evidencia y cuándo. El sistema actual expone:
- Histogramas de latencia HTTP
- Contadores de eventos publicados/procesados
- Trazas distribuidas con `correlationId`

#### G. Infraestructura NATS JetStream

**Reutilizabilidad: ★★★★★ (muy alta)**

NATS JetStream ofrece:
- **At-least-once delivery** garantizado
- **Persistencia de mensajes** (stream history)
- **Consumer groups** para múltiples lectores del mismo evento
- **msgID** para idempotencia

Para un DEMS, esto traduce en: ningún evento de custodia puede perderse, y todos los actores relevantes (perito, fiscal, defensa) pueden recibir notificaciones del mismo evento.

#### H. Patrón Saga (`order-service/src/application/sagas/order.saga.ts`)

**Reutilizabilidad: ★★★★☆ (alta — con adaptación)**

El `OrderSaga` implementa un flujo de trabajo con compensación transaccional que se puede adaptar a un `CustodyWorkflow`:

```
Evidencia capturada
  → Verificar integridad (hash SHA-256)
  → Registrar en cadena de custodia
  → Notificar a fiscal/juez
  → Archivar en almacenamiento seguro
  ↕ (compensación si falla)
  → Invalidar registro, alertar auditor
```

#### I. `packages/feature-flags` — Feature Flags

**Reutilizabilidad: ★★★☆☆ (media)**

El sistema de feature flags con estrategias de rollout progresivo y métricas puede usarse para activar gradualmente nuevos tipos de evidencia o nuevas jurisdicciones en el DEMS.

#### J. Convención de nombrado de eventos

**Reutilizabilidad: ★★★★★ (muy alta)**

La convención `{dominio}.{acción}.{versión}` (`order.created.v1`) se aplica directamente:

```
evidence.captured.v1
custody.transferred.v1
integrity.verified.v1
access.granted.v1
access.denied.v1
evidence.deleted.v1     # soft-delete con audit trail
```

### 5.2 Componentes que requieren adaptación significativa

| Componente | Adaptación necesaria | Esfuerzo estimado |
|-----------|---------------------|------------------|
| Prisma schemas (order/payment/inventory) | Rediseñar modelos: `Evidence`, `CustodyRecord`, `EvidenceFile` | Alto |
| `notification-service` (templates) | Adaptar plantillas de email/SMS para alertas judiciales | Bajo |
| `product-service` | No reutilizable directamente — reemplazar por `EvidenceTypeService` | Medio |
| `payment-service` | No aplicable para DEMS; reemplazar por `EvidenceSubmissionService` | — |
| `dashboard-client` | Adaptar UI para visualización de cadena de custodia y timeline de evidencias | Alto |
| Auth roles | Añadir RBAC con roles: `CUSTODIAN`, `FORENSIC_ANALYST`, `PROSECUTOR`, `JUDGE` | Medio |

### 5.3 Nuevos módulos que necesitaría un DEMS

Los siguientes bounded contexts serían **nuevos** (no existen en A4CO):

| Bounded Context | Aggregate raíz | Descripción |
|----------------|---------------|-------------|
| **Evidence Capture** | `EvidenceItem` | Captura, hash SHA-256/SHA-3, metadatos EXIF, geolocalización |
| **Chain of Custody** | `CustodyRecord` | Registro inmutable de transferencias de custodia con firma digital |
| **Integrity Verification** | `IntegrityAudit` | Verificación periódica de hashes, detección de tampering |
| **Legal Case Management** | `Case` | Expediente judicial, partes, plazos, juzgado |
| **Access Control & Audit** | `AccessLog` | Registro de quién accedió a qué evidencia y cuándo |
| **Retention Policy** | `RetentionSchedule` | Políticas de conservación y destrucción certificada |

### 5.4 Resumen: mapa de reutilización

```
A4CO → DEMS
─────────────────────────────────────────────────────
@a4co/shared-events      ──(renombrar tipos)──▶  @dems/evidence-events
@a4co/shared-utils       ──(reutilizar tal cual)──▶  @dems/domain-core
packages/outbox-publisher ──(reutilizar tal cual)──▶  garantía de eventos
packages/observability   ──(reutilizar tal cual)──▶  audit trail + metrics
apps/infrastructure/gateway ──(adaptar JWT+RBAC)──▶  secure API gateway
apps/services/auth-service ──(añadir RBAC roles)──▶  identity management
Infraestructura NATS     ──(reutilizar tal cual)──▶  event bus inmutable
Patrón Saga             ──(adaptar flujo)──────▶  custody workflow
CI/CD workflows         ──(reutilizar tal cual)──▶  pipeline seguro
Turbo + Nx monorepo     ──(reutilizar tal cual)──▶  build orchestration
```

**Porcentaje estimado de infraestructura reutilizable:** ~60–65% del código de infraestructura y plataforma.
**Porcentaje de lógica de negocio reutilizable:** ~5–10% (solo patrones abstractos).

---

## Conclusiones

1. **Arquitectura DDD sólida:** El monorepo implementa correctamente los principios DDD (Aggregates, Value Objects, Domain Events, Repository Pattern, Ports & Adapters) con separación limpia por bounded context y comunicación vía eventos versionados.

2. **9 bounded contexts activos** con modelos de dominio independientes y bases de datos separadas (sin joins cross-context).

3. **El flujo de Saga** `Order → Inventory → Payment → Notification/Logistics` está completamente implementado con compensación transaccional vía NATS JetStream.

4. **100% del dominio es comercial/ecommerce** — no existe ningún concepto jurídico, de compliance legal o de evidencia digital en el código base actual.

5. **~60-65% de la infraestructura es reutilizable** para un DEMS: especialmente el sistema de eventos versionados, el outbox publisher, la observabilidad, el API gateway, la autenticación y el broker NATS JetStream.

6. El mayor valor arquitectónico para un DEMS está en el **patrón de eventos con correlationId**, el **transactional outbox** (integridad de eventos) y la **saga con compensación** (flujos de trabajo complejos con rollback), que son exactamente los patrones necesarios para cadenas de custodia auditables e inmutables.

---

*Informe generado el 2026-02-20 mediante análisis estático del repositorio `Neiland85/a4co-ddd-microservices`.*
