# 🔗 Estrategia de Comunicación entre Microservicios - A4CO

## 📋 Resumen Ejecutivo

Este documento define la estrategia de comunicación entre los microservicios del ecosistema A4CO, estableciendo cuándo usar comunicación síncrona (REST APIs) versus asíncrona (eventos), y definiendo los eventos de dominio clave para mantener un acoplamiento débil entre servicios.

## 🏗️ Arquitectura de Comunicación

### Principios Fundamentales

1. **Acoplamiento Débil**: Los servicios deben ser independientes y autónomos
2. **Eventual Consistency**: Aceptar consistencia eventual cuando sea apropiado
3. **Resiliencia**: Fallos en un servicio no deben cascadear a otros
4. **Escalabilidad**: La comunicación debe permitir escalar servicios independientemente

## 🔄 Patrones de Comunicación

### 📡 Comunicación Síncrona (REST APIs)

**Cuándo usar:**
- Operaciones que requieren respuesta inmediata
- Consultas de lectura (queries)
- Validaciones en tiempo real
- Operaciones transaccionales críticas

**Casos de Uso:**

#### 1. Auth Service → User Service
```typescript
// Validación de credenciales durante login
GET /api/users/{userId}/profile
Authorization: Bearer {token}
```

#### 2. Order Service → Product Service
```typescript
// Verificación de disponibilidad y precio actual
GET /api/products/{productId}/availability
POST /api/products/validate-items
Body: { items: [{ productId, quantity }] }
```

#### 3. Order Service → Payment Service
```typescript
// Procesamiento de pago síncrono
POST /api/payments/process
Body: { orderId, amount, paymentMethod }
Response: { transactionId, status, timestamp }
```

#### 4. Web/Dashboard → BFF (Backend for Frontend)
```typescript
// Todas las interacciones UI son síncronas
GET /api/bff/dashboard/overview
GET /api/bff/orders/{orderId}/details
POST /api/bff/products/search
```

### 📬 Comunicación Asíncrona (Event-Driven)

**Cuándo usar:**
- Operaciones que no requieren respuesta inmediata
- Propagación de cambios de estado
- Notificaciones y alertas
- Procesos de larga duración
- Integración con sistemas externos

**Message Broker Recomendado:** RabbitMQ o NATS

**Alternativas según escala:**
- **Pequeña escala**: Redis Pub/Sub
- **Media escala**: RabbitMQ
- **Gran escala**: Apache Kafka o AWS EventBridge

## 📨 Eventos de Dominio Clave

### 🛍️ Order Service Events

```typescript
// Evento: Orden Creada
export class OrderCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderData: {
      orderId: string;
      userId: string;
      items: Array<{
        productId: string;
        quantity: number;
        price: number;
      }>;
      totalAmount: number;
      shippingAddress: Address;
      createdAt: Date;
    }
  ) {
    super(aggregateId, orderData);
  }
}

// Suscriptores:
// - Inventory Service (reservar stock)
// - Payment Service (preparar cobro)
// - Notification Service (email confirmación)
// - Analytics Service (métricas)
```

```typescript
// Evento: Orden Confirmada
export class OrderConfirmedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly confirmationData: {
      orderId: string;
      confirmedAt: Date;
      paymentId: string;
      estimatedDelivery: Date;
    }
  ) {
    super(aggregateId, confirmationData);
  }
}

// Suscriptores:
// - Notification Service (email/SMS)
// - Loyalty Service (puntos)
// - Inventory Service (confirmar reserva)
```

```typescript
// Evento: Orden Cancelada
export class OrderCancelledEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly cancellationData: {
      orderId: string;
      cancelledAt: Date;
      reason: string;
      cancelledBy: string;
      refundAmount?: number;
    }
  ) {
    super(aggregateId, cancellationData);
  }
}

// Suscriptores:
// - Payment Service (procesar reembolso)
// - Inventory Service (liberar stock)
// - Notification Service (notificar)
```

### 💳 Payment Service Events

```typescript
// Evento: Pago Procesado
export class PaymentProcessedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly paymentData: {
      paymentId: string;
      orderId: string;
      amount: number;
      currency: string;
      method: PaymentMethod;
      status: 'success' | 'failed';
      processedAt: Date;
      transactionRef?: string;
    }
  ) {
    super(aggregateId, paymentData);
  }
}

// Suscriptores:
// - Order Service (actualizar estado)
// - Notification Service (recibo)
// - Analytics Service (revenue tracking)
```

```typescript
// Evento: Reembolso Iniciado
export class RefundInitiatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly refundData: {
      refundId: string;
      originalPaymentId: string;
      orderId: string;
      amount: number;
      reason: string;
      initiatedAt: Date;
    }
  ) {
    super(aggregateId, refundData);
  }
}
```

### 📦 Inventory Service Events

```typescript
// Evento: Stock Reservado
export class StockReservedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly reservationData: {
      reservationId: string;
      orderId: string;
      items: Array<{
        productId: string;
        quantity: number;
        warehouseId: string;
      }>;
      expiresAt: Date;
    }
  ) {
    super(aggregateId, reservationData);
  }
}

// Suscriptores:
// - Order Service (continuar proceso)
// - Product Service (actualizar disponibilidad)
```

```typescript
// Evento: Stock Bajo
export class LowStockEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly stockData: {
      productId: string;
      currentStock: number;
      threshold: number;
      warehouseId: string;
    }
  ) {
    super(aggregateId, stockData);
  }
}

// Suscriptores:
// - Notification Service (alertar admin)
// - Product Service (marcar como "pocas unidades")
// - Analytics Service (predicción demanda)
```

### 🎁 Product Service Events

```typescript
// Evento: Producto Creado
export class ProductCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly productData: {
      productId: string;
      name: string;
      category: string;
      price: number;
      artisanId: string;
      createdAt: Date;
    }
  ) {
    super(aggregateId, productData);
  }
}

// Suscriptores:
// - CMS Service (actualizar catálogo)
// - Search Service (indexar)
// - Notification Service (notificar seguidores)
```

```typescript
// Evento: Precio Actualizado
export class PriceUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly priceData: {
      productId: string;
      oldPrice: number;
      newPrice: number;
      effectiveDate: Date;
      updatedBy: string;
    }
  ) {
    super(aggregateId, priceData);
  }
}
```

### 👤 User Service Events

```typescript
// Evento: Perfil Artesano Verificado
export class ArtisanVerifiedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly verificationData: {
      artisanId: string;
      verifiedAt: Date;
      verificationLevel: 'basic' | 'premium';
      documents: string[];
    }
  ) {
    super(aggregateId, verificationData);
  }
}

// Suscriptores:
// - Product Service (habilitar funciones)
// - Notification Service (badge/email)
// - Analytics Service (conversion tracking)
```

### 🏆 Loyalty Service Events

```typescript
// Evento: Puntos Otorgados
export class PointsAwardedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly pointsData: {
      userId: string;
      points: number;
      reason: string;
      orderId?: string;
      expiresAt?: Date;
    }
  ) {
    super(aggregateId, pointsData);
  }
}

// Suscriptores:
// - Notification Service (notificar usuario)
// - Analytics Service (engagement metrics)
```

## 🔧 Implementación Técnica

### Message Bus Configuration

```typescript
// config/rabbitmq.config.ts
export const RabbitMQConfig = {
  exchanges: {
    orders: {
      name: 'orders.topic',
      type: 'topic',
      durable: true
    },
    payments: {
      name: 'payments.topic',
      type: 'topic',
      durable: true
    },
    inventory: {
      name: 'inventory.topic',
      type: 'topic',
      durable: true
    }
  },
  
  queues: {
    orderNotifications: {
      name: 'notification.orders',
      durable: true,
      bindings: [
        { exchange: 'orders.topic', pattern: 'order.*' }
      ]
    },
    inventoryOrders: {
      name: 'inventory.orders',
      durable: true,
      bindings: [
        { exchange: 'orders.topic', pattern: 'order.created' },
        { exchange: 'orders.topic', pattern: 'order.cancelled' }
      ]
    }
  }
};
```

### Event Publisher Implementation

```typescript
// infrastructure/event-bus/rabbitmq-event-bus.adapter.ts
import { EventBusPort } from '@/application/ports/event-bus.port';
import { Connection, Channel } from 'amqplib';

export class RabbitMQEventBusAdapter implements EventBusPort {
  private channel: Channel;
  
  constructor(private connection: Connection) {}
  
  async publish(event: DomainEvent): Promise<void> {
    const exchange = this.getExchangeForEvent(event);
    const routingKey = this.getRoutingKey(event);
    
    await this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify({
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        occurredOn: event.occurredOn,
        data: event.eventData,
        metadata: {
          correlationId: event.correlationId,
          causationId: event.causationId
        }
      })),
      {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now()
      }
    );
  }
  
  async publishAll(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map(event => this.publish(event)));
  }
}
```

## 📊 Matriz de Comunicación

| Origen | Destino | Tipo | Método | Justificación |
|--------|---------|------|---------|---------------|
| Order Service | Payment Service | Sync | REST | Respuesta inmediata para UX |
| Order Service | Inventory Service | Async | Event | Reserva puede ser eventual |
| Payment Service | Order Service | Async | Event | Notificación de resultado |
| Order Service | Notification Service | Async | Event | No crítico para el flujo |
| Product Service | Search Service | Async | Event | Indexación en background |
| User Service | Auth Service | Sync | REST | Validación inmediata |
| Inventory Service | Product Service | Async | Event | Actualización disponibilidad |
| Order Service | User Service | Sync | REST | Validar datos usuario |
| Loyalty Service | User Service | Async | Event | Actualización de puntos |

## 🛡️ Manejo de Errores y Resiliencia

### Circuit Breaker para Llamadas Síncronas

```typescript
// infrastructure/resilience/circuit-breaker.ts
export class CircuitBreaker {
  private failures = 0;
  private lastFailTime: Date;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minuto
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime.getTime() > this.timeout) {
        this.state = 'HALF_OPEN';
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

### Retry Logic para Eventos

```typescript
// infrastructure/event-bus/retry-policy.ts
export class RetryPolicy {
  constructor(
    private maxRetries = 3,
    private backoffMs = 1000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= this.maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < this.maxRetries) {
          await this.delay(this.backoffMs * Math.pow(2, i));
        }
      }
    }
    
    throw lastError;
  }
}
```

## 📈 Monitoreo y Observabilidad

### Métricas Clave

1. **Latencia de APIs REST**
   - P50, P95, P99 por endpoint
   - Tiempo de respuesta por servicio

2. **Throughput de Eventos**
   - Eventos publicados/segundo
   - Eventos procesados/segundo
   - Queue depth

3. **Tasa de Error**
   - Fallos en llamadas síncronas
   - Eventos no procesados
   - Dead letter queue size

### Trazabilidad

```typescript
// Propagación de contexto en eventos
export interface EventMetadata {
  correlationId: string;  // ID único para toda la transacción
  causationId: string;    // ID del evento que causó este
  userId?: string;        // Usuario que inició la acción
  traceId?: string;       // Para integración con OpenTelemetry
}
```

## 🚀 Roadmap de Implementación

### Fase 1: Fundación (Semanas 1-2)
- [ ] Configurar RabbitMQ/NATS
- [ ] Implementar EventBusPort adapter
- [ ] Crear eventos base de dominio
- [ ] Setup monitoring básico

### Fase 2: Migración Core (Semanas 3-4)
- [ ] Migrar Order-Inventory a eventos
- [ ] Migrar Order-Payment parcialmente
- [ ] Implementar circuit breakers
- [ ] Dead letter queue handling

### Fase 3: Expansión (Semanas 5-6)
- [ ] Eventos de Product Service
- [ ] Eventos de User Service
- [ ] Notification Service completo
- [ ] Event sourcing para audit

### Fase 4: Optimización (Semanas 7-8)
- [ ] Performance tuning
- [ ] Implementar event replay
- [ ] Disaster recovery
- [ ] Documentación completa

## 📚 Referencias y Recursos

- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
- [CQRS Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)