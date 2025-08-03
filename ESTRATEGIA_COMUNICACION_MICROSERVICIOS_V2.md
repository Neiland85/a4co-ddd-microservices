# 🔄 ESTRATEGIA DE COMUNICACIÓN ENTRE MICROSERVICIOS - MARKETPLACE LOCAL DE JAÉN

**Proyecto:** A4CO DDD Microservices - Marketplace Local de Jaén  
**Fecha:** Enero 2025  
**Enfoque:** Event-Driven Architecture + Domain-Driven Design + NATS  
**Versión:** 2.0 - Implementación Mejorada

---

## 🎯 RESUMEN EJECUTIVO

Esta estrategia define la comunicación entre los **18 microservicios** del marketplace local de Jaén, estableciendo patrones claros para interacciones síncronas (REST) y asíncronas (eventos), garantizando bajo acoplamiento y alta cohesión para el ecosistema de comercio local.

### 🏪 Contexto del Marketplace Local de Jaén
- **Artesanos locales**: Productores de aceite, cerámica, textiles, gastronomía
- **Comercios tradicionales**: Tiendas de barrio, mercados, cooperativas
- **Logística local**: Entrega en bicicleta, puntos de recogida, rutas optimizadas
- **Comunidad**: Eventos locales, fidelización, economía circular

### Principios de Comunicación:
- **🔄 Asíncrono por defecto**: Los eventos de dominio son la forma principal de comunicación
- **⚡ Síncrono cuando sea necesario**: REST APIs solo para consultas inmediatas y operaciones críticas
- **🕐 Eventual consistency**: Aceptamos consistencia eventual entre agregados
- **🔄 Idempotencia**: Todos los mensajes/eventos deben ser idempotentes
- **🌍 Local-first**: Optimización para operaciones locales y geográficas

---

## 🏗️ ARQUITECTURA DE COMUNICACIÓN

### Message Bus: **NATS con JetStream** ✅ (Ya configurado)

**Justificación para NATS:**
- 🚀 **Rendimiento**: Ultra-alta velocidad (millones de mensajes/segundo)
- 🔄 **Patrones**: Pub/Sub, Request/Reply, Queue Groups
- 📡 **Features**: Stream persistence, JetStream para durabilidad
- 🐳 **Deployment**: Lightweight, ideal para contenedores
- 🔧 **Operación**: Configuración mínima, clustering automático
- 🏪 **Local**: Perfecto para marketplace local con baja latencia

### Configuración NATS Mejorada:
```yaml
# docker-compose.messaging.yml (ya existente)
services:
  nats:
    image: nats:2.10-alpine
    command: [
      "--jetstream",
      "--store_dir=/data",
      "--max_file_store=10GB",
      "--max_memory_store=1GB",
      "--http_port=8222",
      "--cluster_name=a4co-marketplace-jaen",
      "--cluster=nats://0.0.0.0:6222",
      "--routes=nats-route://nats:6222"
    ]
    ports:
      - "4222:4222"   # Client connections
      - "8222:8222"   # HTTP monitoring
      - "6222:6222"   # Cluster connections
```

---

## 🔄 MATRIZ DE COMUNICACIÓN ACTUALIZADA

### Comunicación SÍNCRONA (REST APIs) - Solo cuando sea necesario

| Servicio Origen | Servicio Destino | Endpoint | Propósito | Justificación |
|-----------------|------------------|----------|-----------|---------------|
| **order-service** | **inventory-service** | `GET /api/inventory/check/{productId}` | Verificar stock disponible | Validación inmediata antes de crear orden |
| **order-service** | **payment-service** | `POST /api/payments/validate` | Validar método de pago | Validación crítica en tiempo real |
| **payment-service** | **user-service** | `GET /api/users/{userId}/payment-methods` | Obtener métodos de pago | Datos requeridos para procesamiento |
| **dashboard-web** | **product-service** | `GET /api/products/search` | Búsqueda de productos | UI requiere respuesta inmediata |
| **dashboard-web** | **user-service** | `GET /api/users/profile` | Datos del perfil | Información de sesión crítica |
| **geo-service** | **artisan-service** | `GET /api/artisans/nearby` | Productores cercanos | Consulta geográfica en tiempo real |
| **admin-service** | **analytics-service** | `GET /api/analytics/dashboard` | Métricas en tiempo real | Dashboard administrativo |
| **auth-service** | **user-service** | `POST /api/users/validate-token` | Validar autenticación | Seguridad crítica |
| **chat-service** | **user-service** | `GET /api/users/{userId}/preferences` | Preferencias de chat | Configuración de comunicación |
| **loyalty-service** | **user-service** | `GET /api/users/{userId}/loyalty-status` | Estado de fidelización | Validación de descuentos |

### Comunicación ASÍNCRONA (Eventos de Dominio) - Principal método

---

## 📨 EVENTOS DE DOMINIO CLAVE

### 1. 🛒 Order Domain Events (Orden de Compra)

```typescript
// packages/shared-utils/src/events/order-events.ts
export class OrderCreatedEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      customerId: string;
      artisanId: string;
      items: OrderItem[];
      totalAmount: number;
      deliveryAddress: Address;
      deliveryType: 'local-delivery' | 'pickup' | 'bike-delivery';
      estimatedDeliveryTime: Date;
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
      artisanConfirmation: boolean;
      deliveryRoute?: string;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderCancelledEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      reason: 'customer-cancelled' | 'artisan-cancelled' | 'payment-failed' | 'stock-unavailable';
      cancelledAt: Date;
      refundRequired: boolean;
      cancelledBy: string;
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
      deliveryRating?: number;
      deliveryNotes?: string;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderReadyForPickupEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      pickupLocation: string;
      pickupCode: string;
      readyAt: Date;
      expiryTime: Date;
    }
  ) {
    super(orderId, data);
  }
}
```

**Suscriptores:**
- `OrderCreatedEvent` → `inventory-service`, `payment-service`, `notification-service`, `analytics-service`, `loyalty-service`
- `OrderConfirmedEvent` → `notification-service`, `loyalty-service`, `artisan-service`, `geo-service`
- `OrderCancelledEvent` → `inventory-service`, `payment-service`, `notification-service`, `loyalty-service`
- `OrderDeliveredEvent` → `loyalty-service`, `analytics-service`, `notification-service`, `artisan-service`
- `OrderReadyForPickupEvent` → `notification-service`, `geo-service`

### 2. 📦 Inventory Domain Events (Inventario)

```typescript
// packages/shared-utils/src/events/inventory-events.ts
export class StockReservedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      quantityReserved: number;
      remainingStock: number;
      reservationExpiry: Date;
      artisanId: string;
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
      reason: 'order-cancelled' | 'reservation-expired' | 'payment-failed';
      newStock: number;
      artisanId: string;
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
      urgency: 'low' | 'medium' | 'high';
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
      updateReason: 'manual' | 'restock' | 'production' | 'adjustment';
      updatedBy: string;
      artisanId: string;
    }
  ) {
    super(productId, data);
  }
}

export class SeasonalProductAvailableEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      artisanId: string;
      productName: string;
      season: string;
      availableQuantity: number;
      expiryDate?: Date;
    }
  ) {
    super(productId, data);
  }
}
```

**Suscriptores:**
- `StockReservedEvent` → `order-service`, `notification-service`, `artisan-service`
- `StockReleasedEvent` → `order-service`, `product-service`, `artisan-service`
- `LowStockWarningEvent` → `artisan-service`, `notification-service`, `admin-service`
- `StockUpdatedEvent` → `product-service`, `analytics-service`, `artisan-service`
- `SeasonalProductAvailableEvent` → `product-service`, `notification-service`, `loyalty-service`

### 3. 💳 Payment Domain Events (Pagos)

```typescript
// packages/shared-utils/src/events/payment-events.ts
export class PaymentInitiatedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      amount: number;
      currency: string;
      paymentMethod: 'card' | 'cash' | 'local-transfer' | 'loyalty-points';
      customerId: string;
      artisanId: string;
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
      commissionAmount: number;
      artisanAmount: number;
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
      customerId: string;
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
      customerId: string;
    }
  ) {
    super(refundId, data);
  }
}

export class LocalPaymentCompletedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      amount: number;
      paymentMethod: 'cash' | 'local-transfer';
      artisanId: string;
      customerId: string;
      completedAt: Date;
    }
  ) {
    super(paymentId, data);
  }
}
```

**Suscriptores:**
- `PaymentInitiatedEvent` → `order-service`, `analytics-service`, `notification-service`
- `PaymentSucceededEvent` → `order-service`, `loyalty-service`, `notification-service`, `artisan-service`
- `PaymentFailedEvent` → `order-service`, `inventory-service`, `notification-service`
- `RefundProcessedEvent` → `order-service`, `notification-service`, `analytics-service`
- `LocalPaymentCompletedEvent` → `order-service`, `loyalty-service`, `analytics-service`

### 4. 👤 User Domain Events (Usuarios)

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
      preferredLanguage: 'es' | 'en';
      location: Address;
      userType: 'customer' | 'artisan' | 'admin';
      localPreferences: {
        deliveryRadius: number;
        preferredArtisans: string[];
        dietaryRestrictions?: string[];
      };
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

export class UserLocationChangedEvent extends DomainEvent {
  constructor(
    userId: string,
    data: {
      previousLocation: Address;
      newLocation: Address;
      changedAt: Date;
      reason: 'manual' | 'gps' | 'delivery';
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
        localEvents: boolean;
        productCategories: string[];
        deliveryRadius: number;
        preferredArtisans: string[];
      };
      updatedAt: Date;
    }
  ) {
    super(userId, data);
  }
}
```

**Suscriptores:**
- `UserRegisteredEvent` → `notification-service`, `loyalty-service`, `analytics-service`, `geo-service`
- `UserProfileUpdatedEvent` → `notification-service`, `geo-service`, `loyalty-service`
- `UserLocationChangedEvent` → `geo-service`, `product-service`, `notification-service`
- `UserPreferencesChangedEvent` → `notification-service`, `product-service`, `loyalty-service`

### 5. 🏺 Artisan Domain Events (Artesanos)

```typescript
// packages/shared-utils/src/events/artisan-events.ts
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
      localCertifications: string[];
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
      localIngredients: boolean;
      seasonal: boolean;
      season?: string;
    }
  ) {
    super(productId, data);
  }
}

export class ArtisanStatusChangedEvent extends DomainEvent {
  constructor(
    artisanId: string,
    data: {
      previousStatus: 'pending' | 'active' | 'suspended' | 'inactive';
      newStatus: 'pending' | 'active' | 'suspended' | 'inactive';
      reason: string;
      changedAt: Date;
      changedBy: string;
    }
  ) {
    super(artisanId, data);
  }
}

export class ArtisanLocationUpdatedEvent extends DomainEvent {
  constructor(
    artisanId: string,
    data: {
      previousLocation: Address;
      newLocation: Address;
      updatedAt: Date;
      deliveryRadius: number;
    }
  ) {
    super(artisanId, data);
  }
}

export class SeasonalProductionStartedEvent extends DomainEvent {
  constructor(
    artisanId: string,
    data: {
      productType: string;
      season: string;
      estimatedQuantity: number;
      startDate: Date;
      endDate: Date;
    }
  ) {
    super(artisanId, data);
  }
}
```

**Suscriptores:**
- `ArtisanVerifiedEvent` → `notification-service`, `product-service`, `geo-service`, `loyalty-service`
- `NewProductListedEvent` → `product-service`, `inventory-service`, `notification-service`, `loyalty-service`
- `ArtisanStatusChangedEvent` → `product-service`, `notification-service`, `admin-service`
- `ArtisanLocationUpdatedEvent` → `geo-service`, `product-service`, `notification-service`
- `SeasonalProductionStartedEvent` → `product-service`, `notification-service`, `loyalty-service`

### 6. 🌍 Geo Domain Events (Geolocalización)

```typescript
// packages/shared-utils/src/events/geo-events.ts
export class DeliveryRouteOptimizedEvent extends DomainEvent {
  constructor(
    routeId: string,
    data: {
      orderIds: string[];
      optimizedRoute: Address[];
      estimatedDuration: number;
      distance: number;
      deliveryType: 'bike' | 'car' | 'walking';
      optimizedAt: Date;
    }
  ) {
    super(routeId, data);
  }
}

export class LocalEventCreatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    data: {
      eventName: string;
      location: Address;
      eventDate: Date;
      organizerId: string;
      eventType: 'market' | 'festival' | 'workshop' | 'tasting';
      maxAttendees: number;
    }
  ) {
    super(eventId, data);
  }
}

export class PickupPointAddedEvent extends DomainEvent {
  constructor(
    pickupId: string,
    data: {
      location: Address;
      businessName: string;
      operatingHours: string;
      addedBy: string;
      addedAt: Date;
    }
  ) {
    super(pickupId, data);
  }
}
```

**Suscriptores:**
- `DeliveryRouteOptimizedEvent` → `order-service`, `notification-service`, `analytics-service`
- `LocalEventCreatedEvent` → `notification-service`, `loyalty-service`, `cms-service`
- `PickupPointAddedEvent` → `order-service`, `notification-service`, `cms-service`

### 7. 🎁 Loyalty Domain Events (Fidelización)

```typescript
// packages/shared-utils/src/events/loyalty-events.ts
export class PointsEarnedEvent extends DomainEvent {
  constructor(
    loyaltyId: string,
    data: {
      userId: string;
      pointsEarned: number;
      reason: 'purchase' | 'review' | 'referral' | 'local-event';
      orderId?: string;
      earnedAt: Date;
    }
  ) {
    super(loyaltyId, data);
  }
}

export class PointsRedeemedEvent extends DomainEvent {
  constructor(
    loyaltyId: string,
    data: {
      userId: string;
      pointsRedeemed: number;
      rewardType: 'discount' | 'free-delivery' | 'product' | 'local-experience';
      orderId?: string;
      redeemedAt: Date;
    }
  ) {
    super(loyaltyId, data);
  }
}

export class LocalRewardUnlockedEvent extends DomainEvent {
  constructor(
    rewardId: string,
    data: {
      userId: string;
      rewardName: string;
      rewardType: 'artisan-visit' | 'local-tour' | 'cooking-class' | 'tasting';
      unlockedAt: Date;
      expiryDate: Date;
    }
  ) {
    super(rewardId, data);
  }
}
```

**Suscriptores:**
- `PointsEarnedEvent` → `notification-service`, `analytics-service`, `user-service`
- `PointsRedeemedEvent` → `notification-service`, `analytics-service`, `order-service`
- `LocalRewardUnlockedEvent` → `notification-service`, `cms-service`, `analytics-service`

---

## 🔄 PATRONES DE COMUNICACIÓN ESPECÍFICOS

### 1. Saga Pattern para Transacciones Distribuidas

**Ejemplo: Proceso de Creación de Pedido Local**

```typescript
// apps/order-service/src/sagas/order-creation-saga.ts
export class OrderCreationSaga {
  private eventBus: IEventBus;
  
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    try {
      // Paso 1: Verificar disponibilidad local
      await this.eventBus.publish(EventSubjects.STOCK_RESERVED, 
        new ReserveStockCommand(event.aggregateId, event.eventData.items)
      );
      
      // Paso 2: Optimizar ruta de entrega local
      await this.eventBus.publish(EventSubjects.DELIVERY_ROUTE_OPTIMIZED,
        new OptimizeDeliveryRouteCommand(event.aggregateId, event.eventData.deliveryAddress)
      );
      
    } catch (error) {
      // Compensating transaction
      await this.eventBus.publish(EventSubjects.ORDER_CANCELLED,
        new OrderCancelledEvent(event.aggregateId, { 
          reason: 'saga-failure',
          cancelledAt: new Date(),
          refundRequired: false,
          cancelledBy: 'system'
        })
      );
    }
  }
  
  async handleStockReserved(event: StockReservedEvent): Promise<void> {
    // Continuar con el proceso de pago
    await this.eventBus.publish(EventSubjects.PAYMENT_INITIATED,
      new InitiatePaymentCommand(event.eventData.orderId)
    );
  }
  
  async handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    // Confirmar la orden y notificar al artesano
    await this.eventBus.publish(EventSubjects.ORDER_CONFIRMED,
      new OrderConfirmedEvent(event.eventData.orderId, {
        confirmedAt: new Date(),
        estimatedDelivery: this.calculateLocalDeliveryDate(),
        paymentReference: event.eventData.transactionId,
        artisanConfirmation: true
      })
    );
  }
}
```

### 2. Event Sourcing para Auditoría Local

```typescript
// packages/shared-utils/src/event-store/local-event-store.ts
export class LocalEventStore implements IEventStore {
  // Implementation using NATS JetStream for persistence
  // Permite replay de eventos y reconstrucción de estado
  // Especialmente útil para auditoría de transacciones locales
}
```

---

## 🚦 IMPLEMENTACIÓN POR MICROSERVICIO

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
  
  @EventHandler(EventSubjects.DELIVERY_ROUTE_OPTIMIZED)
  async onDeliveryRouteOptimized(event: DeliveryRouteOptimizedEvent): Promise<void> {
    // Actualizar información de entrega
    // Notificar al cliente sobre la ruta optimizada
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
  
  @EventHandler(EventSubjects.SEASONAL_PRODUCTION_STARTED)
  async onSeasonalProductionStarted(event: SeasonalProductionStartedEvent): Promise<void> {
    // Preparar inventario para productos estacionales
    // Notificar a clientes interesados
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
    // Enviar SMS con código de seguimiento local
  }
  
  @EventHandler(EventSubjects.LOW_STOCK_WARNING)
  async onLowStockWarning(event: LowStockWarningEvent): Promise<void> {
    // Notificar al artesano sobre stock bajo
    // Enviar alerta al dashboard administrativo
  }
  
  @EventHandler(EventSubjects.USER_REGISTERED)
  async onUserRegistered(event: UserRegisteredEvent): Promise<void> {
    // Enviar email de bienvenida personalizado para Jaén
    // Configurar preferencias por defecto
    // Invitar a eventos locales
  }
  
  @EventHandler(EventSubjects.LOCAL_EVENT_CREATED)
  async onLocalEventCreated(event: LocalEventCreatedEvent): Promise<void> {
    // Notificar a usuarios cercanos sobre el evento
    // Enviar recordatorios personalizados
  }
}
```

### Geo Service
```typescript
// apps/geo-service/src/events/handlers.ts
export class GeoEventHandlers {
  @EventHandler(EventSubjects.ORDER_CREATED)
  async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    // Calcular ruta de entrega optimizada
    // Publicar DeliveryRouteOptimizedEvent
  }
  
  @EventHandler(EventSubjects.USER_LOCATION_CHANGED)
  async onUserLocationChanged(event: UserLocationChangedEvent): Promise<void> {
    // Actualizar artesanos cercanos
    // Recalcular rutas de entrega
  }
  
  @EventHandler(EventSubjects.ARTISAN_LOCATION_UPDATED)
  async onArtisanLocationUpdated(event: ArtisanLocationUpdatedEvent): Promise<void> {
    // Actualizar zonas de cobertura
    // Recalcular rutas de entrega
  }
}
```

---

## 📊 MÉTRICAS Y MONITOREO ESPECÍFICOS

### Observabilidad de Eventos Locales

```typescript
// packages/observability/src/local-event-metrics.ts
export class LocalEventMetrics {
  // Métricas específicas para marketplace local
  trackLocalOrderCreated(artisanId: string, productType: string): void {
    // Increment counter for local orders
  }
  
  trackDeliveryTime(routeType: string, distance: number, duration: number): void {
    // Track local delivery performance
  }
  
  trackLocalEventAttendance(eventType: string, attendees: number): void {
    // Track local community engagement
  }
  
  trackArtisanActivity(artisanId: string, activityType: string): void {
    // Track local business activity
  }
}
```

### Dashboard de Monitoreo Local
- **NATS Monitoring**: http://localhost:8222
- **Métricas de eventos locales**: Prometheus + Grafana
- **Tracing distribuido**: Jaeger para seguimiento end-to-end
- **Logs estructurados**: ELK stack para análisis
- **Métricas específicas**: 
  - Tiempo de entrega local
  - Actividad de artesanos
  - Eventos comunitarios
  - Satisfacción del cliente local

---

## 🔒 SEGURIDAD Y CONFIABILIDAD LOCAL

### Autenticación de Servicios
```typescript
// packages/shared-utils/src/auth/local-service-auth.ts
export class LocalServiceAuth {
  // JWT para autenticación entre servicios
  // Certificates para comunicación segura
  // Rate limiting por servicio
  // Validación de ubicación para operaciones locales
}
```

### Retry Policies para Operaciones Locales
```typescript
// packages/shared-utils/src/resilience/local-retry-policy.ts
export class LocalRetryPolicy {
  // Exponential backoff
  // Circuit breaker pattern
  // Dead letter queue para mensajes fallidos
  // Retry específico para operaciones de entrega local
}
```

### Idempotencia
```typescript
// Cada evento debe incluir:
interface LocalEventMetadata {
  eventId: string; // UUID único
  correlationId: string; // Para tracing
  causationId?: string; // Evento que causó este evento
  retryCount?: number; // Número de reintentos
  localContext: {
    region: 'jaen';
    timestamp: string;
    location?: Address;
  };
}
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Infraestructura Base (1-2 semanas)
1. ✅ Configurar NATS con JetStream (ya hecho)
2. ✅ Implementar EventBus base en shared-utils
3. ✅ Crear clases base de eventos de dominio
4. ✅ Configurar monitoreo básico

### Fase 2: Eventos Críticos del Marketplace (2-3 semanas)
1. ✅ Implementar eventos de Order → Payment → Inventory
2. ✅ Configurar Saga de creación de pedidos locales
3. ✅ Implementar handlers básicos en cada servicio
4. ✅ Testing de flujo completo

### Fase 3: Eventos Específicos Locales (1-2 semanas)
1. ✅ User events y notificaciones locales
2. ✅ Artisan events y gestión de productos locales
3. ✅ Geo events y optimización de rutas
4. ✅ Loyalty events y fidelización local

### Fase 4: Optimización y Producción (1-2 semanas)
1. ✅ Event sourcing para auditoría local
2. ✅ Dead letter queues
3. ✅ Métricas avanzadas y alertas locales
4. ✅ Documentación y runbooks

---

## 📝 CONCLUSIONES

Esta estrategia establece:

### ✅ **Comunicación Clara para Marketplace Local**
- **Síncrona**: Solo para validaciones críticas y consultas inmediatas (10 casos)
- **Asíncrona**: Para eventos de dominio y coordinación (25+ eventos específicos)

### ✅ **Tecnología Robusta y Local**
- **NATS**: Message bus moderno y performante para operaciones locales
- **Event Sourcing**: Opcional para auditoría completa de transacciones locales
- **Saga Pattern**: Para transacciones distribuidas del marketplace

### ✅ **Observabilidad Completa**
- Métricas de rendimiento local
- Tracing distribuido
- Alertas proactivas para el ecosistema local

### ✅ **Escalabilidad Local**
- Patrón pub/sub para desacoplar servicios
- Queue groups para distribución de carga
- Eventual consistency para mejor rendimiento
- Optimización para operaciones geográficas locales

**El proyecto está preparado para manejar el crecimiento del marketplace local de Jaén con una arquitectura robusta, escalable y específicamente diseñada para el comercio local.**