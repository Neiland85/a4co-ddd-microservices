# 🔄 Estrategia de Comunicación entre Microservicios

**A4CO DDD Microservices - Marketplace Local de Jaén**

Este documento proporciona una implementación completa de comunicación asíncrona y síncrona entre microservicios usando
NATS como message bus principal.

---

## 📋 Tabla de Contenidos

- [🚀 Inicio Rápido](#-inicio-rápido)
- [🏗️ Arquitectura](#️-arquitectura)
- [📡 Comunicación Síncrona vs Asíncrona](#-comunicación-síncrona-vs-asíncrona)
- [🔄 Eventos de Dominio](#-eventos-de-dominio)
- [⚙️ Configuración](#️-configuración)
- [📖 Ejemplos de Uso](#-ejemplos-de-uso)
- [📊 Monitoreo](#-monitoreo)
- [🔧 Resolución de Problemas](#-resolución-de-problemas)

---

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
# En el directorio raíz del proyecto
pnpm install

# Instalar dependencias específicas de NATS
pnpm add nats
pnpm add -D @types/node


```

### 2. Iniciar Infraestructura

```bash
# Ejecutar script de inicio (crear primero si no existe)
chmod +x scripts/start-messaging-infrastructure.sh
./scripts/start-messaging-infrastructure.sh


```

### 3. Verificar Servicios

Una vez iniciado, verifica que los servicios estén corriendo:

- **NATS Monitoring**: http://localhost:8222
- **Grafana Dashboard**: http://localhost:3000 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **Jaeger Tracing**: http://localhost:16686

### 4. Ejecutar Ejemplo

```bash
# Compilar y ejecutar ejemplo
npx tsx examples/order-creation-saga-example.ts


```

---

## 🏗️ Arquitectura

### Componentes Principales

```


┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Order Service │    │ Payment Service │    │Inventory Service│
│                 │    │                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│    │  ┌─────────────┐│
│  │   Events    ││    │  │   Events    ││    │  │   Events    ││
│  │ Publisher/  ││    │  │ Publisher/  ││    │  │ Publisher/  ││
│  │ Subscriber  ││    │  │ Subscriber  ││    │  │ Subscriber  ││
│  └─────────────┘│    │  └─────────────┘│    │  └─────────────┘│
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │       NATS Message Bus     │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │    JetStream        │  │
                    │  │   (Persistence)     │  │
                    │  └─────────────────────┘  │
                    └───────────────────────────┘


```

### Flujo de Eventos (Saga Pattern)

```


1. Order Created
   ↓
2. Stock Reserved (Inventory Service)
   ↓
3. Payment Initiated (Payment Service)
   ↓
4a. Payment Succeeded → Order Confirmed → Email Sent
4b. Payment Failed → Order Cancelled → Stock Released


```

---

## 📡 Comunicación Síncrona vs Asíncrona

### ✅ Comunicación SÍNCRONA (REST APIs)

**Usar cuando necesites:**

- Respuesta inmediata
- Validación en tiempo real
- Datos críticos para continuar procesamiento

```typescript
// Ejemplo: Verificar stock antes de crear orden
const stockResponse = await fetch("/api/inventory/check/product_123");
const { available } = await stockResponse.json();

if (available < requestedQuantity) {
  throw new Error("Stock insuficiente");
}
```

**Casos de uso:**

- Validación de stock disponible
- Validación de métodos de pago
- Búsqueda de productos en UI
- Datos de perfil de usuario
- Autenticación y autorización

### 🔄 Comunicación ASÍNCRONA (Eventos)

**Usar para:**

- Operaciones que pueden fallar y reintentar
- Notificaciones no críticas
- Actualizaciones de estado
- Coordinación entre servicios

```typescript
// Ejemplo: Publicar evento de orden creada
const orderCreatedEvent = new OrderCreatedEvent(orderId, {
  customerId: 'customer_123',
  items: [...],
  totalAmount: 25.50
});

await eventBus.publish(EventSubjects.ORDER_CREATED, orderCreatedEvent);


```

**Casos de uso:**

- Confirmación de pedidos
- Notificaciones por email/SMS
- Actualización de inventario
- Métricas y analytics
- Puntos de lealtad

---

## 🔄 Eventos de Dominio

### Categorías de Eventos

#### 📦 Order Events

```typescript
ORDER_CREATED; // Nueva orden creada
ORDER_CONFIRMED; // Orden confirmada tras pago exitoso
ORDER_CANCELLED; // Orden cancelada
ORDER_DELIVERED; // Orden entregada
```

#### 🏪 Inventory Events

```typescript
STOCK_RESERVED; // Stock reservado para orden
STOCK_RELEASED; // Stock liberado (cancelación)
LOW_STOCK_WARNING; // Aviso de stock bajo
STOCK_UPDATED; // Actualización de inventario
```

#### 💳 Payment Events

```typescript
PAYMENT_INITIATED; // Pago iniciado
PAYMENT_SUCCEEDED; // Pago exitoso
PAYMENT_FAILED; // Pago fallido
REFUND_PROCESSED; // Reembolso procesado
```

#### 👥 User Events

```typescript
USER_REGISTERED; // Usuario registrado
USER_VERIFIED; // Usuario verificado
USER_PROFILE_UPDATED; // Perfil actualizado
```

#### 🔔 Notification Events

```typescript
EMAIL_SENT; // Email enviado
SMS_SENT; // SMS enviado
PUSH_NOTIFICATION_SENT; // Notificación push enviada
```

### Estructura de Eventos

```typescript
interface DomainEvent {
  eventId: string; // UUID único
  eventType: string; // Nombre del evento
  aggregateId: string; // ID del agregado
  eventVersion: number; // Versión del evento
  occurredOn: Date; // Timestamp
  eventData: any; // Datos específicos del evento
  metadata: EventMetadata; // Metadatos adicionales
}
```

---

## ⚙️ Configuración

### 1. Configurar Event Bus en un Servicio

```typescript
import { EventDrivenService, EventHandler } from "@shared/events/event-bus";
import { EventSubjects } from "@shared/events/subjects";

export class OrderService extends EventDrivenService {
  constructor() {
    super("order-service"); // Nombre del servicio
  }

  // Publicar evento
  async createOrder(orderData: any): Promise<string> {
    const event = new OrderCreatedEvent(orderId, orderData);
    await this.publishEvent(EventSubjects.ORDER_CREATED, event);
    return orderId;
  }

  // Suscribirse a evento
  @EventHandler(EventSubjects.PAYMENT_SUCCEEDED)
  async onPaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    // Lógica para confirmar orden
  }
}
```

### 2. Inicializar Servicio

```typescript
const orderService = new OrderService();

// Iniciar manejo de eventos
await orderService.startEventHandling();

// ... al finalizar
await orderService.stopEventHandling();
```

### 3. Variables de Entorno

```bash
# .env
NATS_URL=nats://localhost:4222
NATS_CLUSTER_NAME=a4co-marketplace
SERVICE_NAME=order-service
LOG_LEVEL=info


```

---

## 📖 Ejemplos de Uso

### Ejemplo 1: Crear una Orden (Saga Pattern)

```typescript
// 1. Crear orden
const orderId = await orderService.createOrder({
  customerId: "customer_123",
  items: [{ productId: "product_aceite", quantity: 2 }],
});

// 2. El flujo continúa automáticamente:
// - InventoryService reserva stock
// - PaymentService procesa pago
// - NotificationService envía confirmación
```

### Ejemplo 2: Manejar Stock Bajo

```typescript
export class InventoryService extends EventDrivenService {
  async updateStock(productId: string, newStock: number): Promise<void> {
    // Actualizar stock
    this.inventory.set(productId, newStock);

    // Verificar si está bajo
    if (newStock < this.getThreshold(productId)) {
      const warningEvent = new LowStockWarningEvent(productId, {
        currentStock: newStock,
        threshold: this.getThreshold(productId),
        urgencyLevel: newStock === 0 ? "critical" : "medium",
      });

      await this.publishEvent(EventSubjects.LOW_STOCK_WARNING, warningEvent);
    }
  }
}
```

### Ejemplo 3: Implementar Retry Logic

```typescript
export class PaymentService extends EventDrivenService {
  @EventHandler(EventSubjects.PAYMENT_FAILED)
  async onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    if (event.eventData.retryable) {
      // Programa un retry después de 5 minutos
      setTimeout(
        async () => {
          await this.retryPayment(event.eventData.orderId);
        },
        5 * 60 * 1000
      );
    } else {
      // Cancelar orden permanentemente
      await this.cancelOrder(event.eventData.orderId);
    }
  }
}
```

---

## 📊 Monitoreo

### NATS Monitoring Dashboard

Accede a http://localhost:8222 para ver:

- **Conexiones activas**: Servicios conectados
- **Mensajes/segundo**: Throughput en tiempo real
- **Subjects**: Topics activos y su actividad
- **Subscriptions**: Suscriptores por subject

### Grafana Dashboards

http://localhost:3000 (admin/admin123)

**Dashboards incluidos:**

- Métricas de eventos por servicio
- Latencia de procesamiento
- Errores y reintentos
- Health checks de servicios

### Métricas Clave

```typescript
// Métricas personalizadas
eventBus.on("event-published", (subject, eventType) => {
  metrics.increment("events.published", { subject, eventType });
});

eventBus.on("event-processed", (subject, eventType, duration) => {
  metrics.histogram("events.processing_time", duration, { subject, eventType });
});

eventBus.on("event-failed", (subject, eventType, error) => {
  metrics.increment("events.failed", { subject, eventType, error: error.type });
});
```

---

## 🔧 Resolución de Problemas

### Problemas Comunes

#### 1. **Servicio no se conecta a NATS**

```bash
# Verificar que NATS esté corriendo
docker ps | grep nats

# Ver logs de NATS
docker logs a4co-nats

# Verificar conectividad
telnet localhost 4222


```

#### 2. **Eventos no se procesan**

```typescript
// Verificar suscripciones
console.log("Handlers registrados:", service._eventHandlers);

// Verificar que el servicio esté conectado
console.log("Conectado:", eventBus.isConnected());

// Ver logs detallados
process.env.DEBUG = "nats:*";
```

#### 3. **Pérdida de mensajes**

```typescript
// Usar JetStream para persistencia
const jsm = await nc.jetstreamManager();
await jsm.streams.add({
  name: "ORDERS",
  subjects: ["order.*"],
  retention: RetentionPolicy.WorkQueue,
});
```

#### 4. **Alto uso de memoria**

```bash
# Monitorear uso de memoria
docker stats

# Configurar límites en docker-compose.yml
mem_limit: 512m


```

### Debug Mode

```bash
# Activar debug completo
export DEBUG=nats:*,a4co:*
export LOG_LEVEL=debug

# Ejecutar servicio
npm start


```

### Health Checks

```typescript
// Endpoint de health check
app.get("/health", async (req, res) => {
  const health = {
    service: "order-service",
    status: "ok",
    timestamp: new Date().toISOString(),
    checks: {
      nats: eventBus.isConnected(),
      database: await db.ping(),
      memory: process.memoryUsage(),
    },
  };

  res.json(health);
});
```

---

## 🔗 Enlaces Útiles

- **[Documentación NATS](https://docs.nats.io/)**
- **[Patrón Saga](https://microservices.io/patterns/data/saga.html)**
- **[Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)**
- **[Domain Events](https://martinfowler.com/eaaDev/DomainEvent.html)**

---

## 📞 Soporte

Si tienes problemas con la implementación:

1. **Revisa los logs**: `docker-compose logs -f`
2. **Verifica el estado**: http://localhost:8222
3. **Consulta documentación**: `./ESTRATEGIA_COMUNICACION_MICROSERVICIOS.md`
4. **Ejecuta ejemplo**: `npx tsx examples/order-creation-saga-example.ts`

---

**¡La infraestructura está lista para soportar el crecimiento del Marketplace Local de Jaén! 🚀**
