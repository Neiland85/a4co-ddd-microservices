# Estrategia de Comunicación entre Microservicios - E-commerce DDD

## 1. Arquitectura de Comunicación

### Principios de Diseño

- **Acoplamiento débil**: Los servicios deben ser independientes
- **Consistencia eventual**: Aceptar que los datos pueden no estar
  sincronizados inmediatamente
- **Resiliencia**: Los servicios deben manejar fallos de comunicación
- **Idempotencia**: Las operaciones deben ser seguras para repetir

### Patrones de Comunicación

#### Comunicación Síncrona (REST APIs)

- Para operaciones que requieren respuesta inmediata
- Consultas de datos en tiempo real
- Validaciones críticas entre servicios

#### Comunicación Asíncrona (Event-Driven)

- Para notificar cambios de estado
- Operaciones que no requieren respuesta inmediata
- Procesos de larga duración
- Sincronización eventual de datos

## 2. Microservicios Identificados

1. **Product Service** - Gestión del catálogo de productos
2. **Order Service** - Gestión de pedidos
3. **Inventory Service** - Control de inventario
4. **Payment Service** - Procesamiento de pagos
5. **Customer Service** - Gestión de clientes
6. **Notification Service** - Envío de notificaciones
7. **Shipping Service** - Gestión de envíos

## 3. Interacciones entre Servicios

### Comunicaciones Síncronas (REST APIs)

#### Product Service


```http
GET /api/products/{id} - Obtener detalles del producto
GET /api/products/search - Buscar productos
GET /api/products/{id}/availability - Verificar disponibilidad


```


#### Order Service


```http
POST /api/orders - Crear nuevo pedido
GET /api/orders/{id} - Obtener detalles del pedido
GET /api/orders/customer/{customerId} - Pedidos por cliente


```


#### Inventory Service


```http
GET /api/inventory/{productId} - Consultar stock actual
POST /api/inventory/check-availability - Verificar disponibilidad múltiple


```


#### Customer Service


```http
GET /api/customers/{id} - Obtener datos del cliente
POST /api/customers/validate - Validar cliente para pedido


```


### Comunicaciones Asíncronas (Event-Driven)

#### Message Broker: RabbitMQ

- **Exchange Type**: Topic Exchange para routing flexible
- **Message Format**: JSON con schema validation
- **Dead Letter Queue**: Para manejo de errores

## 4. Eventos de Dominio

### Product Service Events


```typescript
// Publicados
interface ProductCreated {
  eventId: string;
  timestamp: Date;
  productId: string;
  name: string;
  category: string;
  price: number;
  initialStock: number;
}

interface ProductUpdated {
  eventId: string;
  timestamp: Date;
  productId: string;
  changes: Partial<Product>;
}

interface ProductDeleted {
  eventId: string;
  timestamp: Date;
  productId: string;
}

// Suscribe a:
// - StockUpdated (para actualizar disponibilidad)

```


### Order Service Events


```typescript
// Publicados
interface OrderCreated {
  eventId: string;
  timestamp: Date;
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
}

interface OrderConfirmed {
  eventId: string;
  timestamp: Date;
  orderId: string;
  paymentId: string;
}

interface OrderCancelled {
  eventId: string;
  timestamp: Date;
  orderId: string;
  reason: string;
}

interface OrderShipped {
  eventId: string;
  timestamp: Date;
  orderId: string;
  trackingNumber: string;
  carrier: string;
}

// Suscribe a:
// - PaymentCompleted
// - PaymentFailed
// - StockReserved
// - StockReservationFailed
// - ShipmentCreated

```


### Inventory Service Events


```typescript
// Publicados
interface StockReserved {
  eventId: string;
  timestamp: Date;
  orderId: string;
  reservations: Array<{
    productId: string;
    quantity: number;
  }>;
}

interface StockReservationFailed {
  eventId: string;
  timestamp: Date;
  orderId: string;
  reason: string;
  failedItems: Array<{
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
}

interface StockReleased {
  eventId: string;
  timestamp: Date;
  orderId: string;
  releases: Array<{
    productId: string;
    quantity: number;
  }>;
}

interface StockUpdated {
  eventId: string;
  timestamp: Date;
  productId: string;
  previousQuantity: number;
  currentQuantity: number;
  reason: string;
}

// Suscribe a:
// - OrderCreated
// - OrderCancelled
// - OrderShipped

```


### Payment Service Events


```typescript
// Publicados
interface PaymentInitiated {
  eventId: string;
  timestamp: Date;
  paymentId: string;
  orderId: string;
  amount: number;
  method: string;
}

interface PaymentCompleted {
  eventId: string;
  timestamp: Date;
  paymentId: string;
  orderId: string;
  transactionId: string;
}

interface PaymentFailed {
  eventId: string;
  timestamp: Date;
  paymentId: string;
  orderId: string;
  reason: string;
}

interface PaymentRefunded {
  eventId: string;
  timestamp: Date;
  paymentId: string;
  orderId: string;
  amount: number;
}

// Suscribe a:
// - OrderCreated
// - OrderCancelled

```


### Customer Service Events


```typescript
// Publicados
interface CustomerRegistered {
  eventId: string;
  timestamp: Date;
  customerId: string;
  email: string;
  name: string;
}

interface CustomerUpdated {
  eventId: string;
  timestamp: Date;
  customerId: string;
  changes: Partial<Customer>;
}

interface CustomerAddressAdded {
  eventId: string;
  timestamp: Date;
  customerId: string;
  addressId: string;
  address: Address;
}

// Suscribe a:
// - OrderCreated (para actualizar estadísticas)
// - OrderCompleted

```


### Notification Service Events


```typescript
// Publicados
interface NotificationSent {
  eventId: string;
  timestamp: Date;
  notificationId: string;
  recipient: string;
  type: string;
  status: 'sent' | 'failed';
}

// Suscribe a:
// - OrderCreated
// - OrderConfirmed
// - OrderShipped
// - PaymentCompleted
// - PaymentFailed
// - CustomerRegistered

```


### Shipping Service Events


```typescript
// Publicados
interface ShipmentCreated {
  eventId: string;
  timestamp: Date;
  shipmentId: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: Date;
}

interface ShipmentStatusUpdated {
  eventId: string;
  timestamp: Date;
  shipmentId: string;
  status: string;
  location: string;
}

interface ShipmentDelivered {
  eventId: string;
  timestamp: Date;
  shipmentId: string;
  orderId: string;
  deliveredAt: Date;
}

// Suscribe a:
// - OrderConfirmed
// - OrderCancelled

```


## 5. Patrones de Integración

### Saga Pattern para Transacciones Distribuidas

#### Order Creation Saga

1. **OrderCreated** → Inventory Service
2. Inventory Service → **StockReserved/StockReservationFailed**
3. Si StockReserved → Payment Service
4. Payment Service → **PaymentCompleted/PaymentFailed**
5. Si PaymentCompleted → **OrderConfirmed**
6. Si falla en cualquier paso → Compensación

### API Gateway Pattern

- Punto único de entrada para clientes
- Agregación de respuestas de múltiples servicios
- Rate limiting y autenticación centralizada

### Circuit Breaker Pattern

- Protección contra cascada de fallos
- Timeouts configurables por servicio
- Fallback responses

## 6. Decisiones de Diseño

### ¿Cuándo usar REST

- Consultas de catálogo de productos
- Validación de disponibilidad inmediata
- Consulta de estado de pedidos
- Autenticación y autorización

### ¿Cuándo usar Eventos

- Actualización de inventario
- Procesamiento de pagos
- Envío de notificaciones
- Sincronización de datos entre servicios
- Auditoría y logging

## 7. Configuración de RabbitMQ

### Exchanges


```javascript
// Topic exchanges para cada dominio
const exchanges = {
  'product.events': { type: 'topic', durable: true },
  'order.events': { type: 'topic', durable: true },
  'inventory.events': { type: 'topic', durable: true },
  'payment.events': { type: 'topic', durable: true },
  'customer.events': { type: 'topic', durable: true },
  'notification.events': { type: 'topic', durable: true },
  'shipping.events': { type: 'topic', durable: true },
};

```


### Routing Keys


```bash
product.created
product.updated
product.deleted

order.created
order.confirmed
order.cancelled
order.shipped

inventory.reserved
inventory.reservation.failed
inventory.released
inventory.updated

payment.initiated
payment.completed
payment.failed
payment.refunded


```


## 8. Manejo de Errores y Resiliencia

### Estrategias de Retry

- Exponential backoff para llamadas REST
- Dead letter queues para mensajes fallidos
- Compensación automática en sagas

### Monitoreo

- Distributed tracing con OpenTelemetry
- Métricas de latencia y throughput
- Alertas por acumulación en colas

## 9. Seguridad

### Entre Servicios

- mTLS para comunicación REST
- JWT tokens para autenticación
- API keys para servicios externos

### Message Bus

- Autenticación con certificados
- Encriptación de mensajes sensibles
- Auditoría de todos los eventos
