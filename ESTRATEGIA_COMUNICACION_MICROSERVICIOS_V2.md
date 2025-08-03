# 🔄 ESTRATEGIA DE COMUNICACIÓN ENTRE MICROSERVICIOS V2.0

**Proyecto:** A4CO DDD Microservices - Marketplace Local de Jaén  
**Fecha:** Enero 2025  
**Arquitectura:** Event-Driven Architecture + Domain-Driven Design + CQRS

---

## 🎯 RESUMEN EJECUTIVO

Esta estrategia define la comunicación entre los 18 microservicios identificados del marketplace, estableciendo patrones claros para:
- **Comunicación Síncrona**: REST APIs para consultas inmediatas y validaciones críticas
- **Comunicación Asíncrona**: Event-driven mediante NATS para bajo acoplamiento
- **Patrones de Resiliencia**: Circuit breakers, retries, y compensating transactions

### Principios Fundamentales:
1. **Asíncrono por defecto**: Los eventos de dominio son la forma principal de comunicación
2. **Síncrono solo cuando necesario**: REST únicamente para respuestas inmediatas
3. **Eventual consistency**: Aceptamos consistencia eventual entre bounded contexts
4. **Idempotencia obligatoria**: Todos los mensajes deben ser procesables múltiples veces
5. **Observabilidad total**: Cada interacción debe ser trazable y medible

---

## 🏗️ ARQUITECTURA DE COMUNICACIÓN

### Stack Tecnológico Seleccionado

#### Message Bus Principal: **NATS con JetStream**
- ✅ **Performance**: Millones de mensajes/segundo
- ✅ **Durabilidad**: JetStream para persistencia de eventos
- ✅ **Patrones**: Pub/Sub, Request/Reply, Queue Groups
- ✅ **Clustering**: Alta disponibilidad nativa
- ✅ **Lightweight**: Mínimo overhead operacional

#### Stack Complementario:
- **Redis**: Cache distribuida y pub/sub para notificaciones en tiempo real
- **Jaeger**: Distributed tracing para observabilidad
- **Prometheus + Grafana**: Métricas y dashboards
- **ELK Stack**: Logs centralizados y análisis

---

## 📊 MATRIZ DE COMUNICACIÓN DETALLADA

### 🔗 Comunicaciones SÍNCRONAS (REST APIs)

| Servicio Origen | Servicio Destino | Endpoint | Propósito | SLA |
|-----------------|------------------|----------|-----------|-----|
| **order-service** | **inventory-service** | `GET /api/inventory/availability/{productId}` | Verificar disponibilidad en tiempo real | <100ms |
| **order-service** | **payment-service** | `POST /api/payments/validate-method` | Validar método de pago antes de crear orden | <200ms |
| **payment-service** | **user-service** | `GET /api/users/{userId}/payment-methods` | Obtener métodos de pago del usuario | <50ms |
| **dashboard-web** | **product-service** | `GET /api/products/search?q={query}` | Búsqueda de productos con filtros | <150ms |
| **dashboard-web** | **user-service** | `GET /api/users/profile` | Datos del usuario autenticado | <50ms |
| **geo-service** | **artisan-service** | `GET /api/artisans/nearby?lat={lat}&lng={lng}&radius={km}` | Artesanos en radio geográfico | <200ms |
| **admin-service** | **analytics-service** | `GET /api/analytics/real-time/dashboard` | Métricas en tiempo real | <300ms |
| **auth-service** | **user-service** | `POST /api/users/validate-credentials` | Validación de credenciales | <100ms |
| **chat-service** | **user-service** | `GET /api/users/{userId}/chat-profile` | Perfil para chat | <50ms |
| **cms-service** | **artisan-service** | `GET /api/artisans/{id}/content` | Contenido del artesano | <100ms |

### 📨 Comunicaciones ASÍNCRONAS (Event-Driven)

#### 1. **Order Domain Events** 📦

```typescript
// Publicados por: order-service
// Subject pattern: order.*

export interface OrderCreatedEvent {
  eventId: string;
  aggregateId: string; // orderId
  eventType: 'OrderCreated';
  eventVersion: '1.0';
  occurredAt: Date;
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
    deliveryAddress: {
      street: string;
      city: string;
      postalCode: string;
      coordinates?: { lat: number; lng: number; };
    };
    paymentMethodId: string;
    specialInstructions?: string;
  };
  metadata: {
    correlationId: string;
    causationId?: string;
    userId: string;
    ipAddress?: string;
  };
}

// Suscriptores:
// - inventory-service: Reservar stock
// - payment-service: Iniciar proceso de pago
// - notification-service: Notificar al artesano
// - analytics-service: Actualizar métricas
```

```typescript
export interface OrderStatusChangedEvent {
  eventType: 'OrderStatusChanged';
  data: {
    orderId: string;
    previousStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    newStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    reason?: string;
    changedBy: string;
    estimatedDelivery?: Date;
  };
}

// Suscriptores:
// - notification-service: Actualizar cliente y artesano
// - loyalty-service: Procesar puntos si es 'delivered'
// - analytics-service: Tracking de conversión
```

#### 2. **Inventory Domain Events** 📊

```typescript
// Publicados por: inventory-service
// Subject pattern: inventory.*

export interface StockReservedEvent {
  eventType: 'StockReserved';
  data: {
    reservationId: string;
    orderId: string;
    items: Array<{
      productId: string;
      quantityReserved: number;
      remainingStock: number;
      reservationExpiry: Date;
    }>;
    totalReserved: number;
  };
}

// Suscriptores:
// - order-service: Confirmar reserva de stock
// - product-service: Actualizar disponibilidad en catálogo

export interface StockAdjustedEvent {
  eventType: 'StockAdjusted';
  data: {
    productId: string;
    previousQuantity: number;
    newQuantity: number;
    adjustmentType: 'manual' | 'return' | 'damage' | 'recount';
    adjustedBy: string;
    reason: string;
  };
}

// Suscriptores:
// - product-service: Actualizar catálogo
// - analytics-service: Reportes de inventario
// - notification-service: Alertar si stock crítico
```

#### 3. **Payment Domain Events** 💳

```typescript
// Publicados por: payment-service
// Subject pattern: payment.*

export interface PaymentProcessedEvent {
  eventType: 'PaymentProcessed';
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: 'EUR';
    status: 'succeeded' | 'failed' | 'pending';
    paymentMethod: {
      type: 'card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
      last4?: string;
    };
    gateway: 'stripe' | 'paypal' | 'redsys' | 'manual';
    gatewayTransactionId?: string;
    failureReason?: string;
    processedAt: Date;
  };
}

// Suscriptores:
// - order-service: Actualizar estado de orden
// - inventory-service: Confirmar/liberar reserva
// - notification-service: Enviar recibo
// - loyalty-service: Acumular puntos

export interface RefundIssuedEvent {
  eventType: 'RefundIssued';
  data: {
    refundId: string;
    originalPaymentId: string;
    orderId: string;
    amount: number;
    reason: string;
    status: 'pending' | 'completed' | 'failed';
    issuedBy: string;
  };
}
```

#### 4. **User Domain Events** 👤

```typescript
// Publicados por: user-service
// Subject pattern: user.*

export interface UserRegisteredEvent {
  eventType: 'UserRegistered';
  data: {
    userId: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      birthDate?: Date;
    };
    preferences: {
      language: 'es' | 'en';
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
      categories: string[];
    };
    registrationSource: 'web' | 'mobile' | 'social' | 'admin';
    referralCode?: string;
  };
}

// Suscriptores:
// - notification-service: Email de bienvenida
// - loyalty-service: Crear cuenta de puntos
// - analytics-service: Métricas de adquisición
// - cms-service: Personalización de contenido
```

#### 5. **Artisan Domain Events** 🎨

```typescript
// Publicados por: artisan-service
// Subject pattern: artisan.*

export interface ArtisanOnboardedEvent {
  eventType: 'ArtisanOnboarded';
  data: {
    artisanId: string;
    businessInfo: {
      name: string;
      taxId: string;
      category: string;
      description: string;
    };
    contact: {
      email: string;
      phone: string;
      website?: string;
    };
    location: {
      address: string;
      city: string;
      coordinates: { lat: number; lng: number; };
      deliveryRadius: number;
    };
    certifications: string[];
    verificationStatus: 'pending' | 'verified';
  };
}

// Suscriptores:
// - product-service: Habilitar publicación
// - geo-service: Indexar ubicación
// - notification-service: Proceso de onboarding
// - cms-service: Crear página de artesano

export interface ProductPublishedEvent {
  eventType: 'ProductPublished';
  data: {
    productId: string;
    artisanId: string;
    productInfo: {
      name: string;
      description: string;
      category: string;
      price: number;
      images: string[];
    };
    inventory: {
      initialStock: number;
      sku: string;
      trackInventory: boolean;
    };
    attributes: Record<string, any>;
    publishedAt: Date;
  };
}
```

#### 6. **Notification Domain Events** 📬

```typescript
// Publicados por: notification-service
// Subject pattern: notification.*

export interface NotificationSentEvent {
  eventType: 'NotificationSent';
  data: {
    notificationId: string;
    recipientId: string;
    channel: 'email' | 'sms' | 'push' | 'in-app';
    template: string;
    status: 'sent' | 'delivered' | 'failed' | 'bounced';
    metadata: {
      orderId?: string;
      artisanId?: string;
      campaignId?: string;
    };
    sentAt: Date;
    deliveredAt?: Date;
  };
}

// Suscriptores:
// - analytics-service: Métricas de engagement
// - user-service: Actualizar preferencias si bounced
```

#### 7. **Loyalty Domain Events** 🏆

```typescript
// Publicados por: loyalty-service
// Subject pattern: loyalty.*

export interface PointsEarnedEvent {
  eventType: 'PointsEarned';
  data: {
    userId: string;
    points: number;
    source: 'purchase' | 'referral' | 'review' | 'bonus';
    sourceReference: string; // orderId, reviewId, etc.
    newBalance: number;
    tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  };
}

export interface RewardRedeemedEvent {
  eventType: 'RewardRedeemed';
  data: {
    userId: string;
    rewardId: string;
    pointsUsed: number;
    rewardType: 'discount' | 'free_shipping' | 'gift' | 'experience';
    redemptionCode: string;
    expiresAt: Date;
  };
}
```

---

## 🔄 PATRONES DE INTEGRACIÓN

### 1. **Saga Pattern** - Transacciones Distribuidas

```typescript
// Ejemplo: Order Processing Saga
export class OrderProcessingSaga {
  private readonly steps = [
    { service: 'inventory', action: 'reserve', compensate: 'release' },
    { service: 'payment', action: 'charge', compensate: 'refund' },
    { service: 'loyalty', action: 'earn', compensate: 'reverse' },
    { service: 'notification', action: 'confirm', compensate: null }
  ];

  async execute(order: Order): Promise<void> {
    const executedSteps: ExecutedStep[] = [];
    
    try {
      for (const step of this.steps) {
        const result = await this.executeStep(step, order);
        executedSteps.push({ step, result });
      }
      
      // Saga completada exitosamente
      await this.publishSagaCompleted(order.id);
      
    } catch (error) {
      // Compensating transactions
      await this.compensate(executedSteps, order);
      await this.publishSagaFailed(order.id, error);
      throw error;
    }
  }
}
```

### 2. **CQRS Pattern** - Command Query Responsibility Segregation

```typescript
// Commands (Write Side)
export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public readonly deliveryAddress: Address
  ) {}
}

// Queries (Read Side)
export class GetOrdersByCustomerQuery {
  constructor(
    public readonly customerId: string,
    public readonly status?: OrderStatus,
    public readonly dateFrom?: Date,
    public readonly dateTo?: Date
  ) {}
}

// Proyecciones para Read Models
export class OrderProjection {
  @EventHandler(OrderCreatedEvent)
  async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.orderReadModel.create({
      orderId: event.aggregateId,
      customerId: event.data.customerId,
      totalAmount: event.data.totalAmount,
      status: 'pending',
      createdAt: event.occurredAt
    });
  }
}
```

### 3. **Event Sourcing** (Opcional para auditoría)

```typescript
export class EventStore {
  async append(
    streamId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    // Guardar en NATS JetStream
    const stream = await this.js.streams.get(`orders-${streamId}`);
    
    for (const event of events) {
      await stream.publish({
        subject: `order.${event.eventType}`,
        data: JSON.stringify(event),
        headers: {
          'Nats-Msg-Id': event.eventId,
          'Event-Version': event.eventVersion
        }
      });
    }
  }
  
  async getEvents(streamId: string, fromVersion = 0): Promise<DomainEvent[]> {
    // Reproducir eventos desde JetStream
    const events: DomainEvent[] = [];
    const consumer = await this.js.consumers.get(
      `orders-${streamId}`,
      `replay-${Date.now()}`
    );
    
    const messages = await consumer.fetch({ max_messages: 1000 });
    for await (const msg of messages) {
      events.push(JSON.parse(msg.data));
    }
    
    return events;
  }
}
```

---

## 🛡️ RESILIENCIA Y CONFIABILIDAD

### Circuit Breaker Pattern

```typescript
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: Date;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private readonly threshold = 5,
    private readonly timeout = 60000, // 1 minuto
    private readonly resetTimeout = 30000 // 30 segundos
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime!.getTime() > this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

### Retry Policy con Exponential Backoff

```typescript
export class RetryPolicy {
  async execute<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      initialDelay?: number;
      maxDelay?: number;
      factor?: number;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      factor = 2
    } = options;
    
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          break;
        }
        
        const delay = Math.min(
          initialDelay * Math.pow(factor, attempt - 1),
          maxDelay
        );
        
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }
}
```

### Dead Letter Queue

```typescript
export class DeadLetterQueue {
  constructor(
    private readonly nats: NatsConnection,
    private readonly maxRetries = 3
  ) {}
  
  async handleFailedMessage(
    subject: string,
    event: DomainEvent,
    error: Error,
    retryCount: number
  ): Promise<void> {
    if (retryCount >= this.maxRetries) {
      // Enviar a DLQ
      await this.nats.publish(`dlq.${subject}`, {
        originalSubject: subject,
        event,
        error: {
          message: error.message,
          stack: error.stack
        },
        failedAt: new Date(),
        retryCount
      });
      
      // Alertar al equipo de operaciones
      await this.alertOps(subject, event, error);
    } else {
      // Reintentar con delay exponencial
      const delay = Math.pow(2, retryCount) * 1000;
      setTimeout(() => {
        this.nats.publish(subject, {
          ...event,
          metadata: {
            ...event.metadata,
            retryCount: retryCount + 1
          }
        });
      }, delay);
    }
  }
}
```

---

## 📊 MONITOREO Y OBSERVABILIDAD

### Métricas Clave

```typescript
export class EventMetrics {
  private readonly registry = new Registry();
  
  private readonly eventPublishedCounter = new Counter({
    name: 'events_published_total',
    help: 'Total number of events published',
    labelNames: ['service', 'event_type', 'subject'],
    registers: [this.registry]
  });
  
  private readonly eventProcessingDuration = new Histogram({
    name: 'event_processing_duration_seconds',
    help: 'Duration of event processing',
    labelNames: ['service', 'event_type', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
    registers: [this.registry]
  });
  
  private readonly eventQueueDepth = new Gauge({
    name: 'event_queue_depth',
    help: 'Current depth of event queue',
    labelNames: ['service', 'queue'],
    registers: [this.registry]
  });
}
```

### Distributed Tracing

```typescript
export class TracingInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    const span = this.tracer.startSpan('event.process', {
      attributes: {
        'event.type': context.getEventType(),
        'event.id': context.getEventId(),
        'service.name': context.getServiceName()
      }
    });
    
    return next.handle().pipe(
      tap({
        next: () => span.setStatus({ code: SpanStatusCode.OK }),
        error: (error) => {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
        },
        complete: () => span.end()
      })
    );
  }
}
```

### Health Checks

```typescript
export class MessagingHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Verificar NATS
      const natsHealthy = await this.checkNats();
      
      // Verificar Redis
      const redisHealthy = await this.checkRedis();
      
      // Verificar latencia de eventos
      const eventLatency = await this.checkEventLatency();
      
      return this.getStatus(key, true, {
        nats: natsHealthy,
        redis: redisHealthy,
        eventLatency: `${eventLatency}ms`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return this.getStatus(key, false, { error: error.message });
    }
  }
}
```

---

## 🚀 GUÍA DE IMPLEMENTACIÓN

### Fase 1: Infraestructura Base (Semana 1)
- [x] Configurar NATS con JetStream
- [x] Implementar EventBus en shared-utils
- [x] Configurar Redis para cache
- [x] Setup de Jaeger y Prometheus
- [ ] Crear tipos base de eventos

### Fase 2: Eventos Críticos (Semanas 2-3)
- [ ] Implementar Order → Payment → Inventory flow
- [ ] Configurar Saga de procesamiento de órdenes
- [ ] Implementar Circuit Breakers
- [ ] Testing E2E del flujo principal

### Fase 3: Eventos Secundarios (Semana 4)
- [ ] User registration y profile events
- [ ] Artisan onboarding flow
- [ ] Loyalty points accumulation
- [ ] Notification delivery tracking

### Fase 4: Optimización (Semana 5)
- [ ] Event sourcing para órdenes
- [ ] Performance tuning
- [ ] Monitoring dashboards
- [ ] Documentación y runbooks

### Fase 5: Producción (Semana 6)
- [ ] Load testing
- [ ] Chaos engineering
- [ ] Disaster recovery procedures
- [ ] Go-live checklist

---

## 📋 CHECKLIST DE PRODUCCIÓN

### Antes del Deploy
- [ ] Todos los eventos son idempotentes
- [ ] Dead letter queues configuradas
- [ ] Circuit breakers en todas las llamadas síncronas
- [ ] Retry policies definidas
- [ ] Métricas y alertas configuradas
- [ ] Distributed tracing funcionando
- [ ] Health checks implementados
- [ ] Logs estructurados con correlation IDs

### Monitoreo Post-Deploy
- [ ] Latencia de eventos < 100ms p99
- [ ] Error rate < 0.1%
- [ ] Queue depth estable
- [ ] No mensajes en DLQ
- [ ] CPU/Memory dentro de límites
- [ ] Tracing sin gaps

---

## 🎯 CONCLUSIONES

Esta estrategia proporciona:

✅ **Arquitectura Robusta**
- Event-driven para bajo acoplamiento
- CQRS para optimización de lecturas
- Sagas para transacciones distribuidas

✅ **Alta Disponibilidad**
- Circuit breakers para fallos
- Retry policies inteligentes
- Dead letter queues

✅ **Observabilidad Total**
- Distributed tracing end-to-end
- Métricas en tiempo real
- Logs centralizados

✅ **Escalabilidad**
- Horizontal scaling nativo
- Event sourcing opcional
- Cache distribuida

El marketplace de Jaén está preparado para crecer con una arquitectura que soporta miles de transacciones por segundo manteniendo la consistencia eventual y la resiliencia ante fallos.