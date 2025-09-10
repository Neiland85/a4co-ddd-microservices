# 🔄 ESTRATEGIA DE COMUNICACIÓN ENTRE MICROSERVICIOS

**Proyecto:** A4CO DDD Microservices - Marketplace Local de Jaén  
**Fecha:** Julio 2025  
**Enfoque:** Event-Driven Architecture + Domain-Driven Design

---

## 🎯 RESUMEN EJECUTIVO

Esta estrategia define la comunicación entre los 15+ microservicios del marketplace, estableciendo patrones claros para
interacciones síncronas (REST) y asíncronas (eventos), garantizando bajo acoplamiento y alta cohesión.

### Principios de Comunicación

- **Asíncrono por defecto**: Los eventos de dominio son la forma principal de comunicación
- **Síncrono cuando sea necesario**: REST APIs solo para consultas inmediatas y operaciones críticas
- **Eventual consistency**: Aceptamos consistencia eventual entre agregados
- **Idempotencia**: Todos los mensajes/eventos deben ser idempotentes

---

## 🏗️ ARQUITECTURA DE COMUNICACIÓN

### Message Bus Recomendado: **NATS**

**Justificación para NATS:**

- 🚀 **Rendimiento**: Ultra-alta velocidad (millones de mensajes/segundo)
- 🔄 **Patrones**: Pub/Sub, Request/Reply, Queue Groups
- 📡 **Features**: Stream persistence, JetStream para durabilidad
- 🐳 **Deployment**: Lightweight, ideal para contenedores
- 🔧 **Operación**: Configuración mínima, clustering automático

### Configuración NATS

```yaml
# docker-compose.yml
services:
  nats:
    image: nats:latest
    command: [
        "-js", # JetStream enable
        "-sd",
        "/data", # Stream directory
        "-m",
        "8222", # Monitoring port
      ]
    ports:
      - "4222:4222" # Client connections
      - "8222:8222" # HTTP monitoring
    volumes:
      - nats_data:/data

  nats-box:
    image: natsio/nats-box:latest
    depends_on: [nats]
```

---

## 🔄 MATRIZ DE COMUNICACIÓN

### Comunicación SÍNCRONA (REST APIs)

| Servicio Origen     | Servicio Destino      | Endpoint                                  | Propósito                  | Justificación                             |
| ------------------- | --------------------- | ----------------------------------------- | -------------------------- | ----------------------------------------- |
| **order-service**   | **inventory-service** | `GET /api/inventory/check/{productId}`    | Verificar stock disponible | Validación inmediata antes de crear orden |
| **order-service**   | **payment-service**   | `POST /api/payments/validate`             | Validar método de pago     | Validación crítica en tiempo real         |
| **payment-service** | **user-service**      | `GET /api/users/{userId}/payment-methods` | Obtener métodos de pago    | Datos requeridos para procesamiento       |
| **dashboard-web**   | **product-service**   | `GET /api/products/search`                | Búsqueda de productos      | UI requiere respuesta inmediata           |
| **dashboard-web**   | **user-service**      | `GET /api/users/profile`                  | Datos del perfil           | Información de sesión crítica             |
| **geo-service**     | **artisan-service**   | `GET /api/artisans/nearby`                | Productores cercanos       | Consulta geográfica en tiempo real        |
| **admin-service**   | **analytics-service** | `GET /api/analytics/dashboard`            | Métricas en tiempo real    | Dashboard administrativo                  |
| **auth-service**    | **user-service**      | `POST /api/users/validate-token`          | Validar autenticación      | Seguridad crítica                         |

### Comunicación ASÍNCRONA (Eventos de Dominio)

#### 1. Order Domain Events

```typescript
// Eventos publicados por order-service
export class OrderCreatedEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      customerId: string;
      items: OrderItem[];
      totalAmount: number;
      deliveryAddress: Address;
      createdAt: Date;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderConfirmedEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      confirmedAt: Date;
      estimatedDelivery: Date;
      paymentReference: string;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderCancelledEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      reason: string;
      cancelledAt: Date;
      refundRequired: boolean;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderDeliveredEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      deliveredAt: Date;
      deliveryConfirmation: string;
      recipientSignature?: string;
    }
  ) {
    super(orderId, data);
  }
}
```

**Suscriptores:**

- `OrderCreatedEvent` → `inventory-service`, `payment-service`, `notification-service`, `analytics-service`
- `OrderConfirmedEvent` → `notification-service`, `loyalty-service`, `artisan-service`
- `OrderCancelledEvent` → `inventory-service`, `payment-service`, `notification-service`
- `OrderDeliveredEvent` → `loyalty-service`, `analytics-service`, `notification-service`

#### 2. Inventory Domain Events

```typescript
// Eventos publicados por inventory-service
export class StockReservedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      quantityReserved: number;
      remainingStock: number;
      reservationExpiry: Date;
    }
  ) {
    super(productId, data);
  }
}

export class StockReleasedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      quantityReleased: number;
      reason: "order-cancelled" | "reservation-expired" | "payment-failed";
      newStock: number;
    }
  ) {
    super(productId, data);
  }
}

export class LowStockWarningEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      currentStock: number;
      threshold: number;
      artisanId: string;
      productName: string;
    }
  ) {
    super(productId, data);
  }
}

export class StockUpdatedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      previousStock: number;
      newStock: number;
      updateReason: string;
      updatedBy: string;
    }
  ) {
    super(productId, data);
  }
}
```

**Suscriptores:**

- `StockReservedEvent` → `order-service`, `notification-service`
- `StockReleasedEvent` → `order-service`, `product-service`
- `LowStockWarningEvent` → `artisan-service`, `notification-service`
- `StockUpdatedEvent` → `product-service`, `analytics-service`

#### 3. Payment Domain Events

```typescript
// Eventos publicados por payment-service
export class PaymentInitiatedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      amount: number;
      currency: string;
      paymentMethod: string;
      customerId: string;
    }
  ) {
    super(paymentId, data);
  }
}

export class PaymentSucceededEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      transactionId: string;
      amount: number;
      processedAt: Date;
      paymentGateway: string;
    }
  ) {
    super(paymentId, data);
  }
}

export class PaymentFailedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      errorCode: string;
      errorMessage: string;
      retryable: boolean;
      failedAt: Date;
    }
  ) {
    super(paymentId, data);
  }
}

export class RefundProcessedEvent extends DomainEvent {
  constructor(
    refundId: string,
    data: {
      originalPaymentId: string;
      orderId: string;
      amount: number;
      reason: string;
      processedAt: Date;
    }
  ) {
    super(refundId, data);
  }
}
```

**Suscriptores:**

- `PaymentInitiatedEvent` → `order-service`, `analytics-service`
- `PaymentSucceededEvent` → `order-service`, `loyalty-service`, `notification-service`
- `PaymentFailedEvent` → `order-service`, `inventory-service`, `notification-service`
- `RefundProcessedEvent` → `order-service`, `notification-service`, `analytics-service`

#### 4. User Domain Events

```typescript
// Eventos publicados por user-service
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    userId: string,
    data: {
      email: string;
      firstName: string;
      lastName: string;
      registrationDate: Date;
      preferredLanguage: string;
      location?: Address;
    }
  ) {
    super(userId, data);
  }
}

export class UserProfileUpdatedEvent extends DomainEvent {
  constructor(
    userId: string,
    data: {
      changedFields: string[];
      previousValues: Record<string, any>;
      newValues: Record<string, any>;
      updatedAt: Date;
    }
  ) {
    super(userId, data);
  }
}

export class UserPreferencesChangedEvent extends DomainEvent {
  constructor(
    userId: string,
    data: {
      preferences: {
        notifications: boolean;
        newsletter: boolean;
        productCategories: string[];
        deliveryRadius: number;
      };
      updatedAt: Date;
    }
  ) {
    super(userId, data);
  }
}
```

**Suscriptores:**

- `UserRegisteredEvent` → `notification-service`, `loyalty-service`, `analytics-service`
- `UserProfileUpdatedEvent` → `notification-service`, `geo-service`
- `UserPreferencesChangedEvent` → `notification-service`, `product-service`

#### 5. Artisan Domain Events

```typescript
// Eventos publicados por artisan-service
export class ArtisanVerifiedEvent extends DomainEvent {
  constructor(
    artisanId: string,
    data: {
      businessName: string;
      contactEmail: string;
      location: Address;
      specialties: string[];
      verifiedAt: Date;
      verifiedBy: string;
    }
  ) {
    super(artisanId, data);
  }
}

export class NewProductListedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      artisanId: string;
      productName: string;
      category: string;
      price: number;
      initialStock: number;
      listedAt: Date;
    }
  ) {
    super(productId, data);
  }
}

export class ArtisanStatusChangedEvent extends DomainEvent {
  constructor(
    artisanId: string,
    data: {
      previousStatus: string;
      newStatus: string;
      reason: string;
      changedAt: Date;
    }
  ) {
    super(artisanId, data);
  }
}
```

**Suscriptores:**

- `ArtisanVerifiedEvent` → `notification-service`, `product-service`, `geo-service`
- `NewProductListedEvent` → `product-service`, `inventory-service`, `notification-service`
- `ArtisanStatusChangedEvent` → `product-service`, `notification-service`

---

## 📨 IMPLEMENTACIÓN DEL MESSAGE BUS

### Estructura de Eventos en NATS

```typescript
// packages/shared-utils/src/events/event-bus.ts
import { connect, NatsConnection, Codec, StringCodec } from "nats";
import { DomainEvent } from "../domain/domain-event";

export interface IEventBus {
  publish(subject: string, event: DomainEvent): Promise<void>;
  subscribe(subject: string, handler: (event: DomainEvent) => Promise<void>): Promise<void>;
  subscribeQueue(subject: string, queue: string, handler: (event: DomainEvent) => Promise<void>): Promise<void>;
}

export class NatsEventBus implements IEventBus {
  private nc!: NatsConnection;
  private codec: Codec<string> = StringCodec();

  async connect(servers = ["nats://localhost:4222"]): Promise<void> {
    this.nc = await connect({ servers });
  }

  async publish(subject: string, event: DomainEvent): Promise<void> {
    const eventData = JSON.stringify({
      ...event,
      metadata: {
        publishedAt: new Date().toISOString(),
        version: "1.0",
      },
    });

    this.nc.publish(subject, this.codec.encode(eventData));
  }

  async subscribe(subject: string, handler: (event: DomainEvent) => Promise<void>): Promise<void> {
    const sub = this.nc.subscribe(subject);

    for await (const msg of sub) {
      try {
        const eventData = JSON.parse(this.codec.decode(msg.data));
        await handler(eventData);
      } catch (error) {
        console.error(`Error processing event on ${subject}:`, error);
        // Implement retry logic or dead letter queue
      }
    }
  }

  async subscribeQueue(subject: string, queue: string, handler: (event: DomainEvent) => Promise<void>): Promise<void> {
    const sub = this.nc.subscribe(subject, { queue });

    for await (const msg of sub) {
      try {
        const eventData = JSON.parse(this.codec.decode(msg.data));
        await handler(eventData);
      } catch (error) {
        console.error(`Error processing event on ${subject}:`, error);
      }
    }
  }
}
```

### Subjects/Topics para NATS

```typescript
// packages/shared-utils/src/events/subjects.ts
export const EventSubjects = {
  // Order Events
  ORDER_CREATED: "order.created",
  ORDER_CONFIRMED: "order.confirmed",
  ORDER_CANCELLED: "order.cancelled",
  ORDER_DELIVERED: "order.delivered",

  // Inventory Events
  STOCK_RESERVED: "inventory.stock.reserved",
  STOCK_RELEASED: "inventory.stock.released",
  LOW_STOCK_WARNING: "inventory.stock.low",
  STOCK_UPDATED: "inventory.stock.updated",

  // Payment Events
  PAYMENT_INITIATED: "payment.initiated",
  PAYMENT_SUCCEEDED: "payment.succeeded",
  PAYMENT_FAILED: "payment.failed",
  REFUND_PROCESSED: "payment.refund.processed",

  // User Events
  USER_REGISTERED: "user.registered",
  USER_PROFILE_UPDATED: "user.profile.updated",
  USER_PREFERENCES_CHANGED: "user.preferences.changed",

  // Artisan Events
  ARTISAN_VERIFIED: "artisan.verified",
  NEW_PRODUCT_LISTED: "artisan.product.listed",
  ARTISAN_STATUS_CHANGED: "artisan.status.changed",

  // Notification Events
  NOTIFICATION_SENT: "notification.sent",
  EMAIL_DELIVERED: "notification.email.delivered",
  SMS_DELIVERED: "notification.sms.delivered",
} as const;
```

---

## 🔄 PATRONES DE COMUNICACIÓN

### 1. Saga Pattern para Transacciones Distribuidas

**Ejemplo: Proceso de Creación de Pedido**

```typescript
// order-service/src/sagas/order-creation-saga.ts
export class OrderCreationSaga {
  private eventBus: IEventBus;

  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    try {
      // Paso 1: Reservar stock
      await this.eventBus.publish(
        EventSubjects.STOCK_RESERVED,
        new ReserveStockCommand(event.aggregateId, event.eventData.items)
      );

      // Paso 2: Procesar pago (después de confirmación de stock)
      // Esto se manejará en el handler de StockReservedEvent
    } catch (error) {
      // Compensating transaction
      await this.eventBus.publish(
        EventSubjects.ORDER_CANCELLED,
        new OrderCancelledEvent(event.aggregateId, {
          reason: "saga-failure",
          cancelledAt: new Date(),
          refundRequired: false,
        })
      );
    }
  }

  async handleStockReserved(event: StockReservedEvent): Promise<void> {
    // Continuar con el proceso de pago
    await this.eventBus.publish(EventSubjects.PAYMENT_INITIATED, new InitiatePaymentCommand(event.eventData.orderId));
  }

  async handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    // Confirmar la orden
    await this.eventBus.publish(
      EventSubjects.ORDER_CONFIRMED,
      new OrderConfirmedEvent(event.eventData.orderId, {
        confirmedAt: new Date(),
        estimatedDelivery: this.calculateDeliveryDate(),
        paymentReference: event.eventData.transactionId,
      })
    );
  }
}
```

### 2. Event Sourcing Pattern (Opcional)

```typescript
// packages/shared-utils/src/event-store/event-store.ts
export interface IEventStore {
  saveEvents(aggregateId: string, events: DomainEvent[], expectedVersion: number): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;
  getAllEvents(fromPosition?: number): Promise<DomainEvent[]>;
}

export class NatsEventStore implements IEventStore {
  // Implementation using NATS JetStream for persistence
  // Permite replay de eventos y reconstrucción de estado
}
```

---

## 🚦 CONFIGURACIÓN POR MICROSERVICIO

### Order Service

```typescript
// apps/order-service/src/events/handlers.ts
export class OrderEventHandlers {
  @EventHandler(EventSubjects.STOCK_RESERVED)
  async onStockReserved(event: StockReservedEvent): Promise<void> {
    // Actualizar estado interno de la orden
    // Continuar con el saga de creación
  }

  @EventHandler(EventSubjects.PAYMENT_SUCCEEDED)
  async onPaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    // Confirmar la orden
    // Publicar OrderConfirmedEvent
  }

  @EventHandler(EventSubjects.PAYMENT_FAILED)
  async onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    // Cancelar orden
    // Liberar stock reservado
  }
}
```

### Inventory Service

```typescript
// apps/inventory-service/src/events/handlers.ts
export class InventoryEventHandlers {
  @EventHandler(EventSubjects.ORDER_CREATED)
  async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    // Intentar reservar stock para todos los items
    // Publicar StockReservedEvent o StockNotAvailableEvent
  }

  @EventHandler(EventSubjects.ORDER_CANCELLED)
  async onOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    // Liberar stock reservado
    // Publicar StockReleasedEvent
  }
}
```

### Notification Service

```typescript
// apps/notification-service/src/events/handlers.ts
export class NotificationEventHandlers {
  @EventHandler(EventSubjects.ORDER_CONFIRMED)
  async onOrderConfirmed(event: OrderConfirmedEvent): Promise<void> {
    // Enviar email de confirmación al cliente
    // Notificar al artesano sobre nuevo pedido
  }

  @EventHandler(EventSubjects.LOW_STOCK_WARNING)
  async onLowStockWarning(event: LowStockWarningEvent): Promise<void> {
    // Notificar al artesano sobre stock bajo
    // Enviar alerta al dashboard administrativo
  }

  @EventHandler(EventSubjects.USER_REGISTERED)
  async onUserRegistered(event: UserRegisteredEvent): Promise<void> {
    // Enviar email de bienvenida
    // Configurar preferencias por defecto
  }
}
```

---

## 📊 MÉTRICAS Y MONITOREO

### Observabilidad de Eventos

```typescript
// packages/observability/src/event-metrics.ts
export class EventMetrics {
  // Métricas de eventos publicados/consumidos
  // Latencia de procesamiento
  // Eventos fallidos
  // Dead letter queue metrics

  trackEventPublished(subject: string, eventType: string): void {
    // Increment counter
  }

  trackEventProcessed(subject: string, eventType: string, duration: number): void {
    // Track processing time
  }

  trackEventFailed(subject: string, eventType: string, error: Error): void {
    // Track failures for alerting
  }
}
```

### Dashboard de Monitoreo

- **NATS Monitoring**: http://localhost:8222
- **Métricas de eventos**: Prometheus + Grafana
- **Tracing distribuido**: Jaeger para seguimiento end-to-end
- **Logs estructurados**: ELK stack para análisis

---

## 🔒 SEGURIDAD Y CONFIABILIDAD

### Autenticación de Servicios

```typescript
// packages/shared-utils/src/auth/service-auth.ts
export class ServiceAuth {
  // JWT para autenticación entre servicios
  // Certificates para comunicación segura
  // Rate limiting por servicio
}
```

### Retry Policies

```typescript
// packages/shared-utils/src/resilience/retry-policy.ts
export class RetryPolicy {
  // Exponential backoff
  // Circuit breaker pattern
  // Dead letter queue para mensajes fallidos
}
```

### Idempotencia

```typescript
// Cada evento debe incluir:
interface EventMetadata {
  eventId: string; // UUID único
  correlationId: string; // Para tracing
  causationId?: string; // Evento que causó este evento
  retryCount?: number; // Número de reintentos
}
```

---

## 🚀 IMPLEMENTACIÓN RECOMENDADA

### Fase 1: Infraestructura Base (1-2 semanas)

1. ✅ Configurar NATS con JetStream
2. ✅ Implementar EventBus base en shared-utils
3. ✅ Crear clases base de eventos de dominio
4. ✅ Configurar monitoreo básico

### Fase 2: Eventos Críticos (2-3 semanas)

1. ✅ Implementar eventos de Order → Payment → Inventory
2. ✅ Configurar Saga de creación de pedidos
3. ✅ Implementar handlers básicos en cada servicio
4. ✅ Testing de flujo completo

### Fase 3: Eventos Secundarios (1-2 semanas)

1. ✅ User events y notificaciones
2. ✅ Artisan events y gestión de productos
3. ✅ Analytics y métricas
4. ✅ Geolocalización y eventos de ubicación

### Fase 4: Optimización y Producción (1-2 semanas)

1. ✅ Event sourcing (opcional)
2. ✅ Dead letter queues
3. ✅ Métricas avanzadas y alertas
4. ✅ Documentación y runbooks

---

## 📝 CONCLUSIONES

Esta estrategia establece:

### ✅ **Comunicación Clara**

- **Síncrona**: Solo para validaciones críticas y consultas inmediatas (8 casos)
- **Asíncrona**: Para eventos de dominio y coordinación (20+ eventos)

### ✅ **Tecnología Robusta**

- **NATS**: Message bus moderno y performante
- **Event Sourcing**: Opcional para auditoría completa
- **Saga Pattern**: Para transacciones distribuidas

### ✅ **Observabilidad Completa**

- Métricas de rendimiento
- Tracing distribuido
- Alertas proactivas

### ✅ **Escalabilidad**

- Patrón pub/sub para desacoplar servicios
- Queue groups para distribución de carga
- Eventual consistency para mejor rendimiento

**El proyecto está preparado para manejar el crecimiento del marketplace local de Jaén con una arquitectura robusta y
escalable.**
