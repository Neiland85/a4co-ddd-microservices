# 🔄 ESTRATEGIA AVANZADA DE COMUNICACIÓN ENTRE MICROSERVICIOS

**Proyecto:** A4CO DDD Marketplace Local de Jaén  
**Fecha:** Enero 2025  
**Enfoque:** Event-Driven Architecture + Domain-Driven Design + Prisma ORM

---

## 🎯 ANÁLISIS DE COMUNICACIÓN SÍNCRONA VS ASÍNCRONA

### ✅ **COMUNICACIÓN SÍNCRONA (REST APIs)**

#### Criterios para usar REST APIs

1. **Validación inmediata requerida**
2. **Datos críticos para completar operación actual**
3. **Consultas de lectura en tiempo real**
4. **Operaciones de autenticación/autorización**

#### Matriz de Interacciones Síncronas

| Servicio Origen     | Servicio Destino      | Endpoint                                      | Justificación                       | Timeout | Retry |
| ------------------- | --------------------- | --------------------------------------------- | ----------------------------------- | ------- | ----- |
| **order-service**   | **inventory-service** | `GET /api/inventory/availability/{productId}` | Validación stock antes de reserva   | 2s      | 2x    |
| **order-service**   | **payment-service**   | `POST /api/payments/validate`                 | Validación método pago crítica      | 3s      | 1x    |
| **payment-service** | **user-service**      | `GET /api/users/{userId}/payment-methods`     | Datos requeridos para procesamiento | 1s      | 3x    |
| **dashboard-web**   | **product-service**   | `GET /api/products/search`                    | UI requiere respuesta inmediata     | 1s      | 2x    |
| **dashboard-web**   | **user-service**      | `GET /api/users/profile`                      | Datos de sesión críticos            | 0.5s    | 3x    |
| **geo-service**     | **artisan-service**   | `GET /api/artisans/nearby`                    | Consulta geográfica tiempo real     | 2s      | 2x    |
| **admin-service**   | **analytics-service** | `GET /api/analytics/dashboard`                | Métricas dashboard admin            | 5s      | 1x    |
| **auth-service**    | **user-service**      | `POST /api/users/validate-token`              | Seguridad crítica                   | 1s      | 1x    |

### ⚡ **COMUNICACIÓN ASÍNCRONA (Eventos de Dominio)**

#### Criterios para usar Events

1. **Operaciones que pueden fallar y reintentarse**
2. **Notificaciones y side effects**
3. **Eventual consistency acceptable**
4. **Desacoplamiento temporal deseable**

---

## 📋 EVENTOS DE DOMINIO CLAVE POR SERVICIO

### 🛒 **Order Service - Eventos Publicados**

```typescript
// Evento: Orden creada (inicia saga de procesamiento)
export interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  createdAt: Date;
}

// Evento: Orden confirmada (todos los pasos exitosos)
export interface OrderConfirmedEvent {
  orderId: string;
  paymentReference: string;
  estimatedDelivery: Date;
  confirmedAt: Date;
}

// Evento: Orden cancelada (rollback necesario)
export interface OrderCancelledEvent {
  orderId: string;
  reason: string;
  cancelledBy: "customer" | "system" | "payment-failure";
  refundRequired: boolean;
}
```

**Suscriptores:**

- `OrderCreatedEvent` → `inventory-service`, `payment-service`, `notification-service`, `analytics-service`
- `OrderConfirmedEvent` → `notification-service`, `loyalty-service`, `artisan-service`, `analytics-service`
- `OrderCancelledEvent` → `inventory-service`, `payment-service`, `notification-service`

### 📦 **Inventory Service - Eventos Publicados**

```typescript
// Evento: Stock reservado exitosamente
export interface StockReservedEvent {
  productId: string;
  orderId: string;
  quantityReserved: number;
  remainingStock: number;
  reservationExpiry: Date;
}

// Evento: Stock liberado (orden cancelada/expirada)
export interface StockReleasedEvent {
  productId: string;
  orderId: string;
  quantityReleased: number;
  reason: "order-cancelled" | "reservation-expired";
  newStock: number;
}

// Evento: Stock bajo (alerta temprana)
export interface LowStockWarningEvent {
  productId: string;
  currentStock: number;
  threshold: number;
  artisanId: string;
  productName: string;
}

// Evento: Stock agotado (acción crítica)
export interface StockDepletedEvent {
  productId: string;
  depletedAt: Date;
  lastOrderId: string;
  artisanId: string;
}
```

**Suscriptores:**

- `StockReservedEvent` → `order-service`, `analytics-service`
- `StockReleasedEvent` → `order-service`, `product-service`, `analytics-service`
- `LowStockWarningEvent` → `artisan-service`, `notification-service`
- `StockDepletedEvent` → `artisan-service`, `notification-service`, `product-service`

### 💳 **Payment Service - Eventos Publicados**

```typescript
// Evento: Pago iniciado
export interface PaymentInitiatedEvent {
  paymentId: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  customerId: string;
}

// Evento: Pago exitoso
export interface PaymentSucceededEvent {
  paymentId: string;
  orderId: string;
  transactionId: string;
  amount: number;
  processedAt: Date;
  gateway: string;
}

// Evento: Pago fallido
export interface PaymentFailedEvent {
  paymentId: string;
  orderId: string;
  errorCode: string;
  errorMessage: string;
  retryable: boolean;
  failedAt: Date;
}

// Evento: Reembolso procesado
export interface RefundProcessedEvent {
  refundId: string;
  originalPaymentId: string;
  orderId: string;
  amount: number;
  reason: string;
  processedAt: Date;
}
```

**Suscriptores:**

- `PaymentInitiatedEvent` → `order-service`, `analytics-service`
- `PaymentSucceededEvent` → `order-service`, `loyalty-service`, `notification-service`
- `PaymentFailedEvent` → `order-service`, `inventory-service`, `notification-service`
- `RefundProcessedEvent` → `order-service`, `notification-service`, `analytics-service`

### 👤 **User Service - Eventos Publicados**

```typescript
// Evento: Usuario registrado
export interface UserRegisteredEvent {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  location?: Address;
  preferences: UserPreferences;
  registeredAt: Date;
}

// Evento: Perfil actualizado
export interface UserProfileUpdatedEvent {
  userId: string;
  changedFields: string[];
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
  updatedAt: Date;
}

// Evento: Preferencias cambiadas
export interface UserPreferencesChangedEvent {
  userId: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    productCategories: string[];
    deliveryRadius: number;
  };
  updatedAt: Date;
}
```

**Suscriptores:**

- `UserRegisteredEvent` → `notification-service`, `loyalty-service`, `analytics-service`
- `UserProfileUpdatedEvent` → `notification-service`, `geo-service`
- `UserPreferencesChangedEvent` → `notification-service`, `product-service`

### 🎨 **Artisan Service - Eventos Publicados**

```typescript
// Evento: Artesano verificado
export interface ArtisanVerifiedEvent {
  artisanId: string;
  businessName: string;
  contactEmail: string;
  location: Address;
  specialties: string[];
  verifiedAt: Date;
  verifiedBy: string;
}

// Evento: Nuevo producto listado
export interface NewProductListedEvent {
  productId: string;
  artisanId: string;
  productName: string;
  category: string;
  price: number;
  initialStock: number;
  listedAt: Date;
}

// Evento: Estado artesano cambiado
export interface ArtisanStatusChangedEvent {
  artisanId: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  changedAt: Date;
}
```

**Suscriptores:**

- `ArtisanVerifiedEvent` → `notification-service`, `product-service`, `geo-service`
- `NewProductListedEvent` → `product-service`, `inventory-service`, `notification-service`
- `ArtisanStatusChangedEvent` → `product-service`, `notification-service`

---

## 🔄 PATRONES DE COMUNICACIÓN IMPLEMENTADOS

### 1. **Saga Pattern - Proceso de Orden Completa**

```typescript
// Secuencia de eventos para crear una orden
1. OrderCreatedEvent (order-service)
   ↓
2. ReserveStockCommand → StockReservedEvent (inventory-service)
   ↓
3. InitiatePaymentCommand → PaymentSucceededEvent (payment-service)
   ↓
4. OrderConfirmedEvent (order-service)
   ↓
5. NotifyCustomerCommand (notification-service)
   ↓
6. UpdateLoyaltyPointsCommand (loyalty-service)

// En caso de fallo en cualquier paso:
PaymentFailedEvent → OrderCancelledEvent → StockReleasedEvent


```

### 2. **Event Sourcing para Auditoría**

```typescript
// Ejemplo: Tracking completo de una orden
export interface EventStore {
  saveEvent(aggregateId: string, event: DomainEvent): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getEventsFromPosition(position: number): Promise<DomainEvent[]>;
}

// Reconstruir estado de orden desde eventos
const orderEvents = await eventStore.getEvents(orderId);
const order = Order.fromEvents(orderEvents);
```

### 3. **CQRS (Command Query Responsibility Segregation)**

```typescript
// Commands (modifican estado)
export interface CreateOrderCommand {
  customerId: string;
  items: OrderItem[];
  deliveryAddress: Address;
}

// Queries (solo lectura)
export interface GetOrderQuery {
  orderId: string;
  includeItems?: boolean;
  includeHistory?: boolean;
}

// Separación clara entre escritura y lectura
```

---

## 🔧 IMPLEMENTACIÓN DEL MESSAGE BUS CON NATS

### Configuración Avanzada de NATS

```typescript
// packages/shared-utils/src/events/enhanced-event-bus.ts
export class EnhancedNatsEventBus implements IEventBus {
  private nc?: NatsConnection;
  private js?: JetStreamManager;
  private streams: Map<string, StreamConfig> = new Map();

  async setupStreams(): Promise<void> {
    // Stream para eventos de orden
    await this.js?.addStream({
      name: "ORDERS",
      subjects: ["order.*"],
      storage: StorageType.File,
      retention: RetentionPolicy.Workqueue,
      max_age: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // Stream para eventos de inventario
    await this.js?.addStream({
      name: "INVENTORY",
      subjects: ["inventory.*"],
      storage: StorageType.File,
      retention: RetentionPolicy.Interest,
    });

    // Stream para eventos de pago
    await this.js?.addStream({
      name: "PAYMENTS",
      subjects: ["payment.*"],
      storage: StorageType.File,
      retention: RetentionPolicy.Limits,
    });
  }

  async publishWithAck(subject: string, event: DomainEvent): Promise<PubAck> {
    const enhancedEvent = this.enhanceEvent(event);
    return await this.js?.publish(subject, JSON.stringify(enhancedEvent));
  }

  private enhanceEvent(event: DomainEvent): EnhancedDomainEvent {
    return {
      ...event,
      metadata: {
        eventId: crypto.randomUUID(),
        correlationId: event.correlationId || crypto.randomUUID(),
        publishedAt: new Date().toISOString(),
        version: "1.0",
        source: this.serviceName,
      },
    };
  }
}
```

### Dead Letter Queue Pattern

```typescript
// Manejo de eventos fallidos
export class DeadLetterHandler {
  async handleFailedEvent(event: DomainEvent, error: Error, attempts: number): Promise<void> {
    if (attempts >= MAX_RETRY_ATTEMPTS) {
      await this.sendToDeadLetter(event, error);
      await this.notifyOperationsTeam(event, error);
    } else {
      await this.scheduleRetry(event, attempts + 1);
    }
  }

  private async sendToDeadLetter(event: DomainEvent, error: Error): Promise<void> {
    await this.eventBus.publish("dead-letter.events", {
      originalEvent: event,
      error: error.message,
      failedAt: new Date(),
      attempts: MAX_RETRY_ATTEMPTS,
    });
  }
}
```

---

## 📊 MONITOREO Y OBSERVABILIDAD

### Métricas Clave

```typescript
// Métricas de eventos por servicio
export interface EventMetrics {
  eventsPublished: number;
  eventsConsumed: number;
  averageProcessingTime: number;
  failureRate: number;
  retryCount: number;
  deadLetterCount: number;
}

// Dashboard de salud del sistema
export interface SystemHealth {
  natsConnectionStatus: "connected" | "disconnected" | "reconnecting";
  activeSubscriptions: number;
  messageBacklog: number;
  serviceLatency: Record<string, number>;
  errorRate: number;
}
```

### Alertas Críticas

1. **Evento no procesado en > 30 segundos**
2. **Más de 10 eventos en dead letter queue**
3. **Tasa de error > 5% en cualquier servicio**
4. **NATS desconectado por > 10 segundos**
5. **Backlog de mensajes > 1000**

---

## 🔒 SEGURIDAD Y CONFIABILIDAD

### Autenticación Inter-Servicios

```typescript
// JWT para comunicación entre servicios
export interface ServiceCredentials {
  serviceId: string;
  secret: string;
  permissions: string[];
}

// Validación de tokens entre servicios
export class ServiceAuthMiddleware {
  async validateServiceToken(token: string): Promise<ServiceCredentials> {
    // Validar JWT y permisos
    // Verificar que el servicio puede publicar/suscribirse a topics específicos
  }
}
```

### Idempotencia y Deduplicación

```typescript
// Garantizar que eventos duplicados no causen problemas
export class EventDeduplicator {
  private processedEvents: Set<string> = new Set();

  async isEventProcessed(eventId: string): Promise<boolean> {
    return this.processedEvents.has(eventId);
  }

  async markEventAsProcessed(eventId: string): Promise<void> {
    this.processedEvents.add(eventId);
    // Persistir en Redis con TTL
  }
}
```

---

## 🎯 CONCLUSIONES Y RECOMENDACIONES

### ✅ **Patrón de Comunicación Recomendado**

1. **Síncrono (REST)**: 20% de las interacciones
   - Validaciones críticas
   - Consultas de UI en tiempo real
   - Autenticación/autorización

2. **Asíncrono (Events)**: 80% de las interacciones
   - Coordinación entre dominios
   - Side effects y notificaciones
   - Procesamiento de background

### ✅ **Tecnologías Clave**

- **Message Bus**: NATS con JetStream
- **Event Store**: NATS Streaming (opcional)
- **Monitoreo**: Prometheus + Grafana
- **Tracing**: Jaeger para seguimiento distribuido
- **Logging**: ELK Stack para análisis

### ✅ **Beneficios de esta Estrategia**

1. **Escalabilidad**: Servicios independientes y desacoplados
2. **Resiliencia**: Patrones de retry y circuit breaker
3. **Observabilidad**: Métricas completas y alertas proactivas
4. **Mantenibilidad**: Contratos claros de eventos
5. **Performance**: Comunicación asíncrona por defecto

**Esta estrategia posiciona al marketplace para manejar crecimiento exponencial mientras mantiene la calidad del
servicio.**
