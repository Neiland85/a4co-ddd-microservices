# 🔄 DISEÑO DE COMUNICACIÓN ENTRE MICROSERVICIOS

**Proyecto:** A4CO DDD Marketplace Local de Jaén  
**Fecha:** Enero 2025  
**Versión:** 2.0 Enhanced Strategy

## 🎯 RESUMEN EJECUTIVO

Esta estrategia define patrones de comunicación robustos entre microservicios del marketplace, estableciendo claramente cuándo usar comunicación **síncrona (REST APIs)** vs **asíncrona (eventos)**, con un enfoque en bajo acoplamiento y alta cohesión siguiendo principios DDD.

### Principios Fundamentales

- **Asíncrono por defecto**: Los eventos de dominio son la forma principal de comunicación
- **Síncrono solo cuando sea crítico**: REST APIs para validaciones inmediatas y consultas en tiempo real
- **Consistencia eventual**: Aceptamos consistencia eventual entre bounded contexts
- **Idempotencia**: Todos los mensajes/eventos deben ser idempotentes
- **Resilencia**: Circuit breakers, retry policies y timeouts configurados

---

## 🔀 MATRIZ DE DECISIÓN: SÍNCRONO vs ASÍNCRONO

### Criterios para Comunicación SÍNCRONA (REST API)

✅ **Usar cuando:**

- Se necesita respuesta inmediata para continuar el flujo
- Validaciones críticas de negocio en tiempo real
- Consultas de datos requeridos para renderizar UI
- Operaciones que fallan rápido y no requieren coordinación compleja

### Criterios para Comunicación ASÍNCRONA (Eventos)

✅ **Usar cuando:**

- La operación puede ser procesada eventualmente
- Se requiere desacoplar servicios
- Operaciones que disparan múltiples acciones en otros servicios
- Procesos de negocio complejos (sagas)
- Notificaciones y actualizaciones de estado

---

## 🌐 COMUNICACIÓN SÍNCRONA (REST APIs)

### Matriz de Interacciones Síncronas

| Servicio Origen | Servicio Destino | Endpoint | Propósito | Justificación | Timeout |
|-----------------|------------------|----------|-----------|---------------|---------|
| **order-service** | **inventory-service** | `GET /api/v1/inventory/availability/{productId}` | Verificar stock disponible | Validación crítica antes de crear orden | 3s |
| **order-service** | **payment-service** | `POST /api/v1/payments/validate` | Pre-validar método de pago | Fallo rápido si método de pago inválido | 5s |
| **payment-service** | **user-service** | `GET /api/v1/users/{userId}/payment-methods` | Obtener métodos de pago activos | Datos requeridos para procesamiento | 3s |
| **dashboard-web** | **product-service** | `GET /api/v1/products/search` | Búsqueda de productos | UI requiere respuesta inmediata | 5s |
| **dashboard-web** | **user-service** | `GET /api/v1/users/profile` | Datos del perfil de usuario | Información de sesión crítica | 2s |
| **geo-service** | **artisan-service** | `GET /api/v1/artisans/nearby` | Productores cercanos por geolocalización | Consulta geográfica en tiempo real | 4s |
| **admin-service** | **analytics-service** | `GET /api/v1/analytics/dashboard` | Métricas del dashboard | Dashboard administrativo en tiempo real | 6s |
| **auth-service** | **user-service** | `POST /api/v1/users/validate-token` | Validar JWT token | Seguridad crítica para autorización | 2s |

### Patrones de Resilencia para APIs REST

```typescript
// packages/shared-utils/src/http/resilient-http-client.ts
export class ResilientHttpClient {
  private circuitBreaker: CircuitBreaker;
  private retryPolicy: RetryPolicy;

  constructor(private config: {
    baseURL: string;
    timeout: number;
    retries: number;
    circuitBreakerThreshold: number;
  }) {
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: config.circuitBreakerThreshold,
      recoveryTimeout: 30000,
    });
    
    this.retryPolicy = new RetryPolicy({
      maxRetries: config.retries,
      backoffStrategy: 'exponential',
      baseDelay: 1000,
    });
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeWithResilience(() => 
      this.httpClient.get<T>(endpoint, {
        ...options,
        timeout: this.config.timeout,
      })
    );
  }

  async post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeWithResilience(() =>
      this.httpClient.post<T>(endpoint, data, {
        ...options,
        timeout: this.config.timeout,
      })
    );
  }

  private async executeWithResilience<T>(operation: () => Promise<T>): Promise<T> {
    return this.circuitBreaker.execute(() =>
      this.retryPolicy.execute(operation)
    );
  }
}
```

---

## 📨 COMUNICACIÓN ASÍNCRONA (EVENTOS DE DOMINIO)

### Tecnología Recomendada: **NATS con JetStream**

**Justificación técnica:**

- 🚀 **Ultra-alta performance**: Millones de mensajes/segundo
- 🔄 **Patrones flexibles**: Pub/Sub, Request/Reply, Queue Groups
- 📡 **Durabilidad**: JetStream para persistencia y replay de eventos
- 🐳 **Cloud-native**: Ideal para Kubernetes y contenedores
- 🔧 **Simplicidad operacional**: Configuración mínima, clustering automático

### Configuración NATS Productiva

```yaml
# docker-compose.messaging.yml (enhanced)
services:
  nats:
    image: nats:2.10-alpine
    command: [
      "--jetstream",
      "--store_dir=/data", 
      "--max_file_store=10GB",
      "--max_memory_store=1GB",
      "--max_msgs=10000000",
      "--max_bytes=1GB", 
      "--max_age=7d",
      "--replicas=1",
      "--http_port=8222",
      "--cluster_name=a4co-marketplace",
      "--auth_token=${NATS_AUTH_TOKEN}"
    ]
    volumes:
      - nats_data:/data
      - ./config/nats/server.conf:/etc/nats/server.conf
    healthcheck:
      test: ["CMD", "nats", "server", "check", "--server=nats://localhost:4222"]
      interval: 10s
      timeout: 5s
      retries: 3
```

### Eventos de Dominio Críticos

#### 1. 🛒 Order Domain Events

```typescript
// packages/shared-utils/src/events/order-events.ts
export class OrderCreatedEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      customerId: string;
      items: Array<{
        productId: string;
        artisanId: string;
        quantity: number;
        unitPrice: number;
        productName: string;
      }>;
      totalAmount: number;
      currency: string;
      deliveryAddress: {
        street: string;
        city: string;
        postalCode: string;
        coordinates?: { lat: number; lng: number };
      };
      orderType: 'delivery' | 'pickup';
      requestedDeliveryDate?: Date;
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
      estimatedDeliveryDate: Date;
      paymentReference: string;
      trackingNumber?: string;
      artisanNotified: boolean;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderCancelledEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      reason: 'customer-request' | 'payment-failed' | 'inventory-unavailable' | 'artisan-unavailable';
      cancelledAt: Date;
      refundRequired: boolean;
      refundAmount?: number;
      cancelledBy: string; // userId or 'system'
      compensationActions: string[];
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
      deliveryMethod: 'courier' | 'pickup' | 'direct';
      recipientName: string;
      recipientSignature?: string;
      deliveryPhotos?: string[];
      deliveryNotes?: string;
      qualityRating?: number;
    }
  ) {
    super(orderId, data);
  }
}
```

**Suscriptores:**

- `OrderCreatedEvent` → `inventory-service`, `payment-service`, `notification-service`, `analytics-service`, `artisan-service`
- `OrderConfirmedEvent` → `notification-service`, `loyalty-service`, `artisan-service`, `delivery-service`
- `OrderCancelledEvent` → `inventory-service`, `payment-service`, `notification-service`, `analytics-service`
- `OrderDeliveredEvent` → `loyalty-service`, `analytics-service`, `notification-service`, `review-service`

#### 2. 📦 Inventory Domain Events

```typescript
// packages/shared-utils/src/events/inventory-events.ts
export class StockReservedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      artisanId: string;
      quantityReserved: number;
      remainingStock: number;
      reservationExpiry: Date;
      reservationId: string;
      unitPrice: number;
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
      reservationId: string;
      quantityReleased: number;
      reason: 'order-cancelled' | 'reservation-expired' | 'payment-failed' | 'manual-release';
      newAvailableStock: number;
      releasedAt: Date;
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
      warningThreshold: number;
      criticalThreshold: number;
      artisanId: string;
      productName: string;
      category: string;
      lastRestockDate?: Date;
      averageDailySales: number;
      estimatedStockoutDate: Date;
    }
  ) {
    super(productId, data);
  }
}

export class InventoryAdjustedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      previousStock: number;
      newStock: number;
      adjustmentQuantity: number;
      adjustmentReason: 'restock' | 'damage' | 'loss' | 'correction' | 'return';
      adjustedBy: string;
      adjustedAt: Date;
      notes?: string;
      batchNumber?: string;
    }
  ) {
    super(productId, data);
  }
}
```

**Suscriptores:**

- `StockReservedEvent` → `order-service`, `notification-service`, `analytics-service`
- `StockReleasedEvent` → `order-service`, `product-service`, `analytics-service`
- `LowStockWarningEvent` → `artisan-service`, `notification-service`, `procurement-service`
- `InventoryAdjustedEvent` → `product-service`, `analytics-service`, `audit-service`

#### 3. 💳 Payment Domain Events

```typescript
// packages/shared-utils/src/events/payment-events.ts
export class PaymentInitiatedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      customerId: string;
      amount: number;
      currency: string;
      paymentMethod: 'card' | 'transfer' | 'paypal' | 'bizum' | 'cash';
      paymentGateway: string;
      merchantReference: string;
      initiatedAt: Date;
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
      gatewayTransactionId: string;
      amount: number;
      currency: string;
      processedAt: Date;
      paymentGateway: string;
      gatewayFee: number;
      marketplaceFee: number;
      artisanAmount: number; // amount after fees
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
      gatewayErrorCode?: string;
      retryable: boolean;
      failedAt: Date;
      attemptNumber: number;
      maxAttempts: number;
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
      refundAmount: number;
      refundReason: string;
      processedAt: Date;
      gatewayRefundId: string;
      refundMethod: 'original' | 'store-credit' | 'manual';
      processingTime: number; // in business days
    }
  ) {
    super(refundId, data);
  }
}
```

**Suscriptores:**

- `PaymentInitiatedEvent` → `order-service`, `analytics-service`, `fraud-service`
- `PaymentSucceededEvent` → `order-service`, `loyalty-service`, `notification-service`, `accounting-service`
- `PaymentFailedEvent` → `order-service`, `inventory-service`, `notification-service`, `analytics-service`
- `RefundProcessedEvent` → `order-service`, `notification-service`, `analytics-service`, `accounting-service`

#### 4. 👤 User Domain Events

```typescript
// packages/shared-utils/src/events/user-events.ts
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    userId: string,
    data: {
      email: string;
      firstName: string;
      lastName: string;
      registrationDate: Date;
      registrationSource: 'web' | 'mobile' | 'social' | 'referral';
      preferredLanguage: string;
      location?: {
        city: string;
        province: string;
        country: string;
        coordinates?: { lat: number; lng: number };
      };
      marketingConsent: boolean;
      referredBy?: string;
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
      updatedBy: string;
      updateReason?: string;
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
        notifications: {
          email: boolean;
          sms: boolean;
          push: boolean;
          orderUpdates: boolean;
          promotions: boolean;
          newsletter: boolean;
        };
        shopping: {
          favoriteCategories: string[];
          maxDeliveryRadius: number;
          preferredDeliveryTime: string;
          priceAlerts: boolean;
        };
        privacy: {
          shareLocation: boolean;
          sharePreferences: boolean;
          allowTracking: boolean;
        };
      };
      updatedAt: Date;
    }
  ) {
    super(userId, data);
  }
}
```

**Suscriptores:**

- `UserRegisteredEvent` → `notification-service`, `loyalty-service`, `analytics-service`, `recommendation-service`
- `UserProfileUpdatedEvent` → `notification-service`, `geo-service`, `recommendation-service`
- `UserPreferencesChangedEvent` → `notification-service`, `product-service`, `recommendation-service`

#### 5. 🎨 Artisan Domain Events

```typescript
// packages/shared-utils/src/events/artisan-events.ts
export class ArtisanVerifiedEvent extends DomainEvent {
  constructor(
    artisanId: string,
    data: {
      businessName: string;
      contactEmail: string;
      contactPhone: string;
      businessAddress: {
        street: string;
        city: string;
        province: string;
        postalCode: string;
        coordinates: { lat: number; lng: number };
      };
      specialties: string[];
      craftingTechniques: string[];
      certifications: string[];
      verificationLevel: 'basic' | 'premium' | 'master';
      verifiedAt: Date;
      verifiedBy: string;
      backgroundCheckPassed: boolean;
      insuranceValidated: boolean;
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
      subcategory: string;
      description: string;
      price: number;
      currency: string;
      initialStock: number;
      craftingTime: number; // in hours
      materials: string[];
      dimensions?: {
        width: number;
        height: number;
        depth: number;
        weight: number;
      };
      customizable: boolean;
      sustainabilityScore?: number;
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
      previousStatus: 'pending' | 'active' | 'inactive' | 'suspended' | 'banned';
      newStatus: 'pending' | 'active' | 'inactive' | 'suspended' | 'banned';
      reason: string;
      changedAt: Date;
      changedBy: string;
      automaticReactivationDate?: Date;
      impactedProducts: string[]; // productIds affected
    }
  ) {
    super(artisanId, data);
  }
}
```

**Suscriptores:**

- `ArtisanVerifiedEvent` → `notification-service`, `product-service`, `geo-service`, `analytics-service`
- `NewProductListedEvent` → `product-service`, `inventory-service`, `notification-service`, `recommendation-service`
- `ArtisanStatusChangedEvent` → `product-service`, `inventory-service`, `notification-service`, `order-service`

---

## 🔄 IMPLEMENTACIÓN DEL EVENT BUS

### Event Bus Avanzado con NATS

```typescript
// packages/shared-utils/src/events/enhanced-event-bus.ts
import { connect, NatsConnection, Codec, StringCodec, JetStreamManager, JetStreamClient } from 'nats';
import { DomainEvent } from '../domain/domain-event';
import { Logger } from '../utils/logger';
import { MetricsCollector } from '../observability/metrics-collector';

export interface EventBusConfig {
  servers: string[];
  maxReconnectAttempts: number;
  reconnectWait: number;
  authToken?: string;
  enableJetStream: boolean;
  streams: StreamConfig[];
}

export interface StreamConfig {
  name: string;
  subjects: string[];
  retention: 'limits' | 'interest' | 'workqueue';
  maxAge: number; // nanoseconds
  maxMsgs: number;
  storage: 'file' | 'memory';
}

export class EnhancedEventBus {
  private nc!: NatsConnection;
  private js!: JetStreamClient;
  private jsm!: JetStreamManager;
  private codec: Codec<string> = StringCodec();
  private logger = new Logger('EventBus');
  private metrics = new MetricsCollector();

  constructor(private config: EventBusConfig) {}

  async connect(): Promise<void> {
    try {
      this.nc = await connect({
        servers: this.config.servers,
        maxReconnectAttempts: this.config.maxReconnectAttempts,
        reconnectWait: this.config.reconnectWait,
        token: this.config.authToken,
      });

      if (this.config.enableJetStream) {
        this.js = this.nc.jetstream();
        this.jsm = await this.nc.jetstreamManager();
        await this.setupStreams();
      }

      this.logger.info('EventBus connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to NATS', error);
      throw error;
    }
  }

  async publishDomainEvent(subject: string, event: DomainEvent): Promise<void> {
    const startTime = Date.now();
    
    try {
      const eventPayload = {
        ...event,
        metadata: {
          publishedAt: new Date().toISOString(),
          version: '1.0',
          correlationId: event.eventId,
          causationId: event.aggregateId,
        }
      };

      const message = this.codec.encode(JSON.stringify(eventPayload));

      if (this.config.enableJetStream) {
        await this.js.publish(subject, message, {
          msgID: event.eventId,
          headers: {
            'Event-Type': event.eventType,
            'Aggregate-Id': event.aggregateId,
            'Event-Version': event.eventVersion.toString(),
          }
        });
      } else {
        this.nc.publish(subject, message);
      }

      this.metrics.recordEventPublished(subject, event.eventType, Date.now() - startTime);
      this.logger.debug(`Event published: ${event.eventType} to ${subject}`);

    } catch (error) {
      this.metrics.recordEventPublishFailed(subject, event.eventType, error as Error);
      this.logger.error(`Failed to publish event ${event.eventType}`, error);
      throw error;
    }
  }

  async subscribeToEvents(
    subject: string,
    handler: (event: DomainEvent) => Promise<void>,
    options: {
      durableName?: string;
      queue?: string;
      deliverPolicy?: 'all' | 'last' | 'new' | 'by_start_sequence' | 'by_start_time';
      ackPolicy?: 'none' | 'all' | 'explicit';
      maxDeliver?: number;
      ackWait?: number;
    } = {}
  ): Promise<void> {
    try {
      if (this.config.enableJetStream && options.durableName) {
        // Durable subscription for guaranteed delivery
        const subscription = await this.js.subscribe(subject, {
          durable: options.durableName,
          deliver_policy: options.deliverPolicy || 'new',
          ack_policy: options.ackPolicy || 'explicit',
          max_deliver: options.maxDeliver || 3,
          ack_wait: options.ackWait || 30000, // 30 seconds
        });

        for await (const msg of subscription) {
          const startTime = Date.now();
          try {
            const eventData = JSON.parse(this.codec.decode(msg.data));
            await handler(eventData);
            msg.ack();
            
            this.metrics.recordEventProcessed(subject, eventData.eventType, Date.now() - startTime);
          } catch (error) {
            this.metrics.recordEventProcessingFailed(subject, 'unknown', error as Error);
            this.logger.error(`Error processing event on ${subject}`, error);
            msg.nak();
          }
        }
      } else {
        // Regular subscription
        const subscription = this.nc.subscribe(subject, { queue: options.queue });
        
        for await (const msg of subscription) {
          const startTime = Date.now();
          try {
            const eventData = JSON.parse(this.codec.decode(msg.data));
            await handler(eventData);
            
            this.metrics.recordEventProcessed(subject, eventData.eventType, Date.now() - startTime);
          } catch (error) {
            this.metrics.recordEventProcessingFailed(subject, 'unknown', error as Error);
            this.logger.error(`Error processing event on ${subject}`, error);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to subscribe to ${subject}`, error);
      throw error;
    }
  }

  private async setupStreams(): Promise<void> {
    for (const streamConfig of this.config.streams) {
      try {
        await this.jsm.streams.add({
          name: streamConfig.name,
          subjects: streamConfig.subjects,
          retention: streamConfig.retention,
          max_age: streamConfig.maxAge,
          max_msgs: streamConfig.maxMsgs,
          storage: streamConfig.storage,
        });
        
        this.logger.info(`Stream ${streamConfig.name} configured successfully`);
      } catch (error) {
        this.logger.warn(`Stream ${streamConfig.name} already exists or failed to create`, error);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.nc.close();
    this.logger.info('EventBus disconnected');
  }
}
```

### Configuración de Streams para Dominios

```typescript
// config/nats-streams.ts
export const marketplaceStreams: StreamConfig[] = [
  {
    name: 'ORDERS',
    subjects: ['order.*'],
    retention: 'limits',
    maxAge: 7 * 24 * 60 * 60 * 1000000000, // 7 days in nanoseconds
    maxMsgs: 1000000,
    storage: 'file',
  },
  {
    name: 'INVENTORY',
    subjects: ['inventory.*'],
    retention: 'limits',
    maxAge: 30 * 24 * 60 * 60 * 1000000000, // 30 days
    maxMsgs: 5000000,
    storage: 'file',
  },
  {
    name: 'PAYMENTS',
    subjects: ['payment.*'],
    retention: 'limits',
    maxAge: 365 * 24 * 60 * 60 * 1000000000, // 1 year for compliance
    maxMsgs: 10000000,
    storage: 'file',
  },
  {
    name: 'USERS',
    subjects: ['user.*'],
    retention: 'limits',
    maxAge: 90 * 24 * 60 * 60 * 1000000000, // 90 days
    maxMsgs: 1000000,
    storage: 'file',
  },
  {
    name: 'ARTISANS',
    subjects: ['artisan.*'],
    retention: 'limits',
    maxAge: 180 * 24 * 60 * 60 * 1000000000, // 6 months
    maxMsgs: 500000,
    storage: 'file',
  },
];
```

---

## 🔄 PATRONES DE ORQUESTACIÓN

### Saga Pattern para Procesos Complejos

```typescript
// packages/shared-utils/src/sagas/order-fulfillment-saga.ts
export class OrderFulfillmentSaga {
  constructor(
    private eventBus: EnhancedEventBus,
    private sagaStore: SagaStateStore,
    private logger: Logger
  ) {}

  // Orchestrator que maneja el flujo completo de un pedido
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const sagaId = `order-fulfillment-${event.aggregateId}`;
    
    try {
      // 1. Inicializar estado de la saga
      await this.sagaStore.initializeSaga(sagaId, {
        orderId: event.aggregateId,
        status: 'stock-check-pending',
        steps: ['stock-check', 'payment-processing', 'order-confirmation'],
        currentStep: 0,
        startedAt: new Date(),
        eventHistory: [event],
      });

      // 2. Verificar stock para todos los productos
      for (const item of event.eventData.items) {
        await this.eventBus.publishDomainEvent('inventory.stock.check', 
          new StockCheckRequestedEvent(item.productId, {
            orderId: event.aggregateId,
            quantityRequested: item.quantity,
            sagaId,
          })
        );
      }

      this.logger.info(`Order fulfillment saga started for order ${event.aggregateId}`);

    } catch (error) {
      await this.handleSagaFailure(sagaId, 'stock-check-failed', error);
    }
  }

  async handleStockReserved(event: StockReservedEvent): Promise<void> {
    const sagaId = `order-fulfillment-${event.eventData.orderId}`;
    const sagaState = await this.sagaStore.getSagaState(sagaId);

    if (!sagaState || sagaState.status !== 'stock-check-pending') {
      this.logger.warn(`Unexpected stock reserved event for saga ${sagaId}`);
      return;
    }

    try {
      // Actualizar estado de la saga
      sagaState.reservedItems = sagaState.reservedItems || [];
      sagaState.reservedItems.push({
        productId: event.aggregateId,
        reservationId: event.eventData.reservationId,
        quantity: event.eventData.quantityReserved,
      });

      // Verificar si todos los items están reservados
      const order = await this.getOrderDetails(event.eventData.orderId);
      const allItemsReserved = order.items.every(item =>
        sagaState.reservedItems.some(reserved => 
          reserved.productId === item.productId && 
          reserved.quantity >= item.quantity
        )
      );

      if (allItemsReserved) {
        // Proceder al pago
        sagaState.status = 'payment-processing';
        sagaState.currentStep = 1;
        await this.sagaStore.updateSagaState(sagaId, sagaState);

        await this.eventBus.publishDomainEvent('payment.process',
          new PaymentProcessRequestedEvent(uuidv4(), {
            orderId: event.eventData.orderId,
            amount: order.totalAmount,
            currency: order.currency,
            paymentMethod: order.paymentMethodId,
            sagaId,
          })
        );
      } else {
        await this.sagaStore.updateSagaState(sagaId, sagaState);
      }

    } catch (error) {
      await this.handleSagaFailure(sagaId, 'stock-reservation-processing-failed', error);
    }
  }

  async handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    const sagaId = `order-fulfillment-${event.eventData.orderId}`;
    const sagaState = await this.sagaStore.getSagaState(sagaId);

    if (!sagaState || sagaState.status !== 'payment-processing') {
      this.logger.warn(`Unexpected payment succeeded event for saga ${sagaId}`);
      return;
    }

    try {
      // Confirmar pedido
      sagaState.status = 'order-confirmation';
      sagaState.currentStep = 2;
      sagaState.paymentReference = event.eventData.transactionId;
      await this.sagaStore.updateSagaState(sagaId, sagaState);

      await this.eventBus.publishDomainEvent('order.confirm',
        new OrderConfirmRequestedEvent(event.eventData.orderId, {
          paymentReference: event.eventData.transactionId,
          confirmedAt: new Date(),
          sagaId,
        })
      );

    } catch (error) {
      await this.handleSagaFailure(sagaId, 'order-confirmation-failed', error);
    }
  }

  async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {
    const sagaId = `order-fulfillment-${event.eventData.orderId}`;
    
    // Compensating actions: liberar stock reservado
    await this.compensateStockReservations(sagaId, event.eventData.orderId);
    
    // Cancelar pedido
    await this.eventBus.publishDomainEvent('order.cancel',
      new OrderCancelRequestedEvent(event.eventData.orderId, {
        reason: 'payment-failed',
        cancelledAt: new Date(),
        sagaId,
      })
    );

    await this.sagaStore.completeSaga(sagaId, 'failed', 'payment-failed');
  }

  private async compensateStockReservations(sagaId: string, orderId: string): Promise<void> {
    const sagaState = await this.sagaStore.getSagaState(sagaId);
    
    if (sagaState?.reservedItems) {
      for (const reserved of sagaState.reservedItems) {
        await this.eventBus.publishDomainEvent('inventory.stock.release',
          new StockReleaseRequestedEvent(reserved.productId, {
            orderId,
            reservationId: reserved.reservationId,
            reason: 'payment-failed',
            sagaId,
          })
        );
      }
    }
  }

  private async handleSagaFailure(sagaId: string, reason: string, error: any): Promise<void> {
    this.logger.error(`Saga ${sagaId} failed: ${reason}`, error);
    await this.sagaStore.completeSaga(sagaId, 'failed', reason);
    
    // Implement compensation logic based on failure point
    // ...
  }
}
```

---

## 📊 OBSERVABILIDAD Y MONITOREO

### Métricas de Comunicación

```typescript
// packages/observability/src/communication-metrics.ts
export class CommunicationMetrics {
  private prometheusRegistry: Registry;

  private syncRequestsTotal = new Counter({
    name: 'microservices_sync_requests_total',
    help: 'Total number of synchronous requests between microservices',
    labelNames: ['source_service', 'target_service', 'endpoint', 'status'],
  });

  private syncRequestDuration = new Histogram({
    name: 'microservices_sync_request_duration_seconds',
    help: 'Duration of synchronous requests between microservices',
    labelNames: ['source_service', 'target_service', 'endpoint'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  });

  private asyncEventsPublished = new Counter({
    name: 'microservices_events_published_total',
    help: 'Total number of domain events published',
    labelNames: ['service', 'event_type', 'subject'],
  });

  private asyncEventsProcessed = new Counter({
    name: 'microservices_events_processed_total',
    help: 'Total number of domain events processed',
    labelNames: ['service', 'event_type', 'subject', 'status'],
  });

  private eventProcessingDuration = new Histogram({
    name: 'microservices_event_processing_duration_seconds',
    help: 'Duration of event processing',
    labelNames: ['service', 'event_type', 'subject'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  });

  recordSyncRequest(sourceService: string, targetService: string, endpoint: string, duration: number, status: string): void {
    this.syncRequestsTotal.labels(sourceService, targetService, endpoint, status).inc();
    this.syncRequestDuration.labels(sourceService, targetService, endpoint).observe(duration);
  }

  recordEventPublished(service: string, eventType: string, subject: string): void {
    this.asyncEventsPublished.labels(service, eventType, subject).inc();
  }

  recordEventProcessed(service: string, eventType: string, subject: string, duration: number, status: string): void {
    this.asyncEventsProcessed.labels(service, eventType, subject, status).inc();
    this.eventProcessingDuration.labels(service, eventType, subject).observe(duration);
  }
}
```

### Dashboard de Monitoreo (Grafana)

```json
{
  "dashboard": {
    "title": "Microservices Communication Dashboard",
    "panels": [
      {
        "title": "Synchronous Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(microservices_sync_requests_total[5m])",
            "legendFormat": "{{source_service}} -> {{target_service}}"
          }
        ]
      },
      {
        "title": "Event Publishing Rate",
        "type": "graph", 
        "targets": [
          {
            "expr": "rate(microservices_events_published_total[5m])",
            "legendFormat": "{{service}}: {{event_type}}"
          }
        ]
      },
      {
        "title": "Event Processing Latency",
        "type": "heatmap",
        "targets": [
          {
            "expr": "rate(microservices_event_processing_duration_seconds_bucket[5m])",
            "format": "heatmap"
          }
        ]
      },
      {
        "title": "Failed Requests & Events",
        "type": "stat",
        "targets": [
          {
            "expr": "microservices_sync_requests_total{status!='200'}",
            "legendFormat": "Failed Sync Requests"
          },
          {
            "expr": "microservices_events_processed_total{status='failed'}",
            "legendFormat": "Failed Event Processing"
          }
        ]
      }
    ]
  }
}
```

---

## 🔒 SEGURIDAD EN COMUNICACIONES

### Autenticación entre Servicios

```typescript
// packages/shared-utils/src/security/service-auth.ts
export class ServiceAuthenticationManager {
  private jwtSecret: string;
  private tokenExpiration: number = 3600; // 1 hour

  constructor() {
    this.jwtSecret = process.env.SERVICE_JWT_SECRET || 'fallback-secret';
  }

  generateServiceToken(serviceId: string, permissions: string[]): string {
    const payload = {
      serviceId,
      permissions,
      type: 'service-to-service',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.tokenExpiration,
    };

    return jwt.sign(payload, this.jwtSecret);
  }

  validateServiceToken(token: string): { serviceId: string; permissions: string[] } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      if (decoded.type !== 'service-to-service') {
        throw new Error('Invalid token type');
      }

      return {
        serviceId: decoded.serviceId,
        permissions: decoded.permissions,
      };
    } catch (error) {
      throw new Error('Invalid service token');
    }
  }

  createAuthenticatedHttpClient(serviceId: string, permissions: string[]): ResilientHttpClient {
    const token = this.generateServiceToken(serviceId, permissions);
    
    return new ResilientHttpClient({
      defaultHeaders: {
        'Authorization': `Bearer ${token}`,
        'X-Service-ID': serviceId,
      },
    });
  }
}
```

---

## 🎯 PLAN DE IMPLEMENTACIÓN

### Fase 1: Infraestructura Base (Semana 1-2)

- ✅ Configurar NATS con JetStream en entorno dev/staging
- ✅ Implementar EventBus avanzado con métricas
- ✅ Configurar streams para cada dominio  
- ✅ Implementar autenticación entre servicios
- ✅ Setup básico de observabilidad (Prometheus + Grafana)

### Fase 2: Eventos Críticos (Semana 3-4)

- ✅ Implementar eventos de Order, Payment, Inventory
- ✅ Configurar saga de Order Fulfillment
- ✅ Implementar handlers en order-service, payment-service, inventory-service
- ✅ Testing end-to-end del flujo crítico de pedidos

### Fase 3: APIs Síncronas Críticas (Semana 4-5)

- ✅ Implementar cliente HTTP resiliente con circuit breakers
- ✅ Configurar endpoints síncronos críticos (stock check, payment validation)
- ✅ Implementar timeouts y retry policies
- ✅ Testing de resilencia y failover

### Fase 4: Eventos Secundarios (Semana 5-6)

- ✅ Eventos de User, Artisan, Notification
- ✅ Handlers para analytics, recommendation, geo-services
- ✅ Implementar eventos de auditoría y compliance

### Fase 5: Optimización y Producción (Semana 7-8)

- ✅ Optimizar streams y retention policies
- ✅ Implementar dead letter queues
- ✅ Configurar alertas proactivas
- ✅ Documentación operacional y runbooks
- ✅ Load testing y tuning de performance

---

## 📋 CONCLUSIONES

### ✅ **Estrategia Balanceada**

- **8 interacciones síncronas** para validaciones críticas y consultas en tiempo real
- **20+ eventos asíncronos** para coordinación entre dominios y desacoplamiento
- **NATS + JetStream** como tecnología principal para messaging robusto

### ✅ **Patrones Robustos**

- **Saga Pattern** para transacciones distribuidas complejas
- **Circuit Breaker + Retry** para resilencia en comunicaciones síncronas
- **Event Sourcing compatible** para auditoría y debugging

### ✅ **Observabilidad Completa**

- Métricas detalladas de rendimiento y errores
- Tracing distribuido para debugging
- Dashboards proactivos para operaciones

### ✅ **Seguridad by Design**

- Autenticación JWT para comunicaciones entre servicios
- Autorización granular por permisos
- Encryption en tránsito y at rest

**Esta estrategia posiciona el marketplace para escalar efectivamente manteniendo bajo acoplamiento, alta cohesión y excelente observabilidad operacional.**
