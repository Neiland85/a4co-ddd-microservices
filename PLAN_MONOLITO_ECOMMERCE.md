# PLAN: MONOLITO E-COMMERCE COMPLETO

## Portal Artesanos Jaén/Andalucía + Ventas Online

**Fecha:** 8 Noviembre 2025
**Decisión:** Opción B - E-commerce Completo
**Timeline:** 240-280 horas = 6-7 semanas (1 dev) = 12-14 semanas (part-time)

---

## ✅ BUENAS NOTICIAS

**Ya tienes 5 servicios e-commerce implementados y funcionando:**

1. ✅ **order-service** (88% completo) - Gestión de pedidos + Saga Pattern
2. ✅ **payment-service** (90% completo) - Stripe integration
3. ✅ **inventory-service** (80% completo) - Control de stock
4. ✅ **transportista-service** (70% completo) - Envíos y tracking
5. ✅ **notification-service** (75% completo) - Email/SMS/Push

**Ahorro:** ~200 horas ya invertidas ✅

---

## ARQUITECTURA E-COMMERCE MONOLITO

```
┌──────────────────────────────────────────────────┐
│          FRONTEND (React + Vite)                 │
│  • Catálogo de artesanos                         │
│  • Catálogo de productos                         │
│  • Carrito de compra                             │
│  • Checkout con Stripe                           │
│  • Seguimiento de pedidos                        │
│  • Panel artesano (gestión productos/pedidos)   │
└──────────────┬───────────────────────────────────┘
               │ HTTP REST API
┌──────────────┴───────────────────────────────────┐
│        BACKEND MONOLITO (NestJS)                 │
│  ┌────────────────────────────────────────────┐  │
│  │  CORE MODULES:                             │  │
│  │  • Auth Module      (Reutilizar 95%)      │  │
│  │  • User Module      (Reutilizar 90%)      │  │
│  │  • Artisan Module   (CREAR - 50h)         │  │
│  │  • Product Module   (Reutilizar 85%)      │  │
│  │  • Geo Module       (Crear - 25h)         │  │
│  │                                            │  │
│  │  E-COMMERCE MODULES:                       │  │
│  │  • Order Module     (Reutilizar 88%)      │  │
│  │  • Payment Module   (Reutilizar 90%)      │  │
│  │  • Inventory Module (Reutilizar 80%)      │  │
│  │  • Shipping Module  (Reutilizar 70%)      │  │
│  │  • Notification Module (Reutilizar 75%)   │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  Shared:                                         │
│  • Prisma ORM                                    │
│  • JWT Auth                                      │
│  • Winston Logs                                  │
│  • Stripe SDK                                    │
│  • Email/SMS providers                           │
└──────────────┬───────────────────────────────────┘
               │
┌──────────────┴───────────────────────────────────┐
│       PostgreSQL (Single Database)               │
│  • users, artisans, products                     │
│  • orders, order_items, order_events (saga)      │
│  • payments, payment_intents                     │
│  • inventory, stock_reservations                 │
│  • shipments, tracking_events                    │
│  • notifications, notification_templates         │
└──────────────────────────────────────────────────┘
```

---

## MÓDULOS DEL MONOLITO

### 📦 CORE (5 módulos base)

#### 1. Auth Module ✅ (95% - 0h adicionales)

```
Ya funciona - Solo migrar
```

#### 2. User Module ✅ (90% - 0h adicionales)

```
Ya funciona - Solo migrar
```

#### 3. **Artisan Module** 🆕 (0% - 50h)

```
CREAR desde cero (ver PLAN_MONOLITO_SIMPLE.md)
- Domain: Artisan entity, Specialty, Location, Gallery, Rating
- Application: Create, Find, Update, Upload Images use cases
- Infrastructure: Prisma repository
- Presentation: REST API controller
```

#### 4. Product Module ✅ (85% - 10h integración)

```
Ya funciona - Ajustar para:
- Vincular a artesanos (artisanId)
- Integrar con inventory
- Stock disponible
```

#### 5. Geo Module 🆕 (30% - 25h)

```
Completar:
- Provincias de Andalucía
- Municipios
- Cálculo de tarifas de envío por zona
```

### 🛒 E-COMMERCE (5 módulos adicionales)

#### 6. Order Module ✅ (88% - 15h integración)

```
Ya tiene:
- Create order use case
- Order aggregate con domain events
- Saga pattern para transacciones distribuidas
- Order status management
- Metrics con Prometheus

Ajustar:
- Integrar con Artisan (orders por artesano)
- Vincular con Payment
- Vincular con Shipping
- Dashboard artesano
```

#### 7. Payment Module ✅ (90% - 10h integración)

```
Ya tiene:
- Stripe integration completa
- Payment intents
- Webhook handling
- Error handling robusto

Ajustar:
- Vincular con Order
- Split payments (si múltiples artesanos en 1 order)
- Panel artesano (ver pagos recibidos)
```

#### 8. Inventory Module ✅ (80% - 15h completar)

```
Ya tiene:
- Stock tracking
- Reservations system
- Stock management

Ajustar:
- Integrar con Product
- Integrar con Order (reservar stock)
- Panel artesano (gestión de inventario)
- Alertas de stock bajo
```

#### 9. Shipping Module ✅ (70% - 20h completar)

```
Ya tiene (Python FastAPI):
- Transportistas CRUD
- Shipment management
- Tracking en tiempo real
- GPS coordinates
- Status history

Migrar a TypeScript/NestJS:
- Reescribir en TypeScript (o mantener como servicio separado)
- API de tracking
- Cálculo de tarifas
- Asignación automática de transportista
```

#### 10. Notification Module ✅ (75% - 10h integración)

```
Ya tiene:
- Multi-channel (Email, SMS, Push)
- SendGrid, Twilio, Firebase
- Provider pattern

Ajustar:
- Notificaciones de pedidos
- Notificaciones a artesanos
- Confirmaciones de pago
- Updates de envío
```

---

## FLUJO E-COMMERCE COMPLETO

### 1. Usuario Navega y Busca

```
Frontend → Artisan Module → Devuelve listado
Frontend → Product Module → Devuelve productos por artesano
Frontend → Geo Module → Filtra por ubicación
```

### 2. Usuario Agrega al Carrito (Frontend)

```
Frontend mantiene carrito en localStorage
Al checkout, envía todos los items
```

### 3. Usuario Hace Checkout

```
POST /orders
  ↓
Order Module:
  1. Validar items
  2. Verificar stock (Inventory Module)
  3. Reservar stock
  4. Calcular total
  5. Crear orden en estado PENDING
  6. Retornar orderId
```

### 4. Usuario Paga

```
POST /payments/intent { orderId }
  ↓
Payment Module:
  1. Crear Stripe Payment Intent
  2. Retornar client_secret
  ↓
Frontend:
  1. Mostrar Stripe Elements
  2. Usuario ingresa tarjeta
  3. Confirma pago
  ↓
Stripe Webhook → POST /payments/webhook
  ↓
Payment Module:
  1. Verificar webhook signature
  2. Actualizar payment status
  3. Emitir event: PaymentSucceeded
  ↓
Order Module (listener):
  1. Actualizar order status → CONFIRMED
  2. Emitir event: OrderConfirmed
  ↓
Notification Module (listener):
  1. Email a usuario: "Pedido confirmado"
  2. Email a artesano: "Nuevo pedido"
```

### 5. Artesano Prepara Pedido

```
PATCH /orders/:id/status { status: PREPARING }
  ↓
Order Module:
  1. Actualizar status
  2. Emitir event: OrderPreparing
  ↓
Notification Module:
  1. Email a usuario: "Tu pedido se está preparando"
```

### 6. Se Crea Envío

```
POST /shipments { orderId, transportistId }
  ↓
Shipping Module:
  1. Crear shipment
  2. Generar tracking number
  3. Emitir event: ShipmentCreated
  ↓
Order Module:
  1. Actualizar status → SHIPPED
  2. Agregar tracking info
  ↓
Notification Module:
  1. Email a usuario: "Tu pedido ha sido enviado"
  2. SMS con tracking number
```

### 7. Usuario Rastrea Pedido

```
GET /orders/:id
  ↓
Incluye:
  - Order details
  - Payment status
  - Shipment tracking
  - Estimated delivery
```

### 8. Pedido Entregado

```
PATCH /shipments/:id/status { status: DELIVERED }
  ↓
Shipping Module:
  1. Actualizar status
  2. Emitir event: ShipmentDelivered
  ↓
Order Module:
  1. Actualizar status → DELIVERED
  ↓
Notification Module:
  1. Email a usuario: "Pedido entregado"
  2. Solicitar review
```

---

## SCHEMA PRISMA CONSOLIDADO (E-commerce)

```prisma
// backend/prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  artisan      Artisan?
  orders       Order[]
  reviews      Review[]
  addresses    Address[]
  notifications Notification[]
}

enum Role {
  USER
  ARTISAN
  ADMIN
}

model Artisan {
  id           String   @id @default(uuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])

  businessName String
  description  String?
  specialty    String
  phone        String?
  whatsapp     String?
  website      String?

  // Location
  provinceId   String
  province     Province @relation(fields: [provinceId], references: [id])
  municipality String
  address      String?

  // Gallery
  logo         String?
  coverImage   String?
  images       String[]

  // Rating
  rating       Float    @default(0)
  reviewCount  Int      @default(0)

  // E-commerce
  stripeAccountId String? // Para split payments

  verified     Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  products     Product[]
  reviews      Review[]
  orders       Order[]

  @@index([provinceId, specialty])
  @@index([specialty])
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  images      String[]

  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])

  artisanId   String
  artisan     Artisan  @relation(fields: [artisanId], references: [id])

  // Inventory
  stockQuantity Int    @default(0)
  lowStockAlert Int    @default(5)

  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orderItems     OrderItem[]
  inventoryLogs  InventoryLog[]
  stockReservations StockReservation[]

  @@index([categoryId])
  @@index([artisanId])
}

model Category {
  id       String    @id @default(uuid())
  name     String    @unique
  slug     String    @unique
  products Product[]
}

model Province {
  id        String    @id @default(uuid())
  name      String    @unique
  code      String    @unique
  artisans  Artisan[]

  // E-commerce
  shippingZone Int @default(1) // Para calcular tarifas
}

model Address {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])

  fullName     String
  phone        String
  addressLine1 String
  addressLine2 String?
  city         String
  province     String
  postalCode   String

  isDefault    Boolean  @default(false)
  createdAt    DateTime @default(now())

  orders       Order[]

  @@index([userId])
}

model Review {
  id        String   @id @default(uuid())
  rating    Int
  comment   String?

  userId    String
  user      User     @relation(fields: [userId], references: [id])

  artisanId String
  artisan   Artisan  @relation(fields: [artisanId], references: [id])

  createdAt DateTime @default(now())

  @@unique([userId, artisanId])
  @@index([artisanId])
}

// ============================================================================
// E-COMMERCE ENTITIES
// ============================================================================

model Order {
  id            String      @id @default(uuid())
  orderNumber   String      @unique

  userId        String
  user          User        @relation(fields: [userId], references: [id])

  artisanId     String
  artisan       Artisan     @relation(fields: [artisanId], references: [id])

  addressId     String
  shippingAddress Address   @relation(fields: [addressId], references: [id])

  // Amounts
  subtotal      Float
  shippingCost  Float
  tax           Float       @default(0)
  total         Float

  // Status
  status        OrderStatus @default(PENDING)

  // Saga tracking
  sagaStatus    SagaStatus  @default(STARTED)

  // Timestamps
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  confirmedAt   DateTime?
  shippedAt     DateTime?
  deliveredAt   DateTime?
  cancelledAt   DateTime?

  // Relations
  items         OrderItem[]
  payment       Payment?
  shipment      Shipment?
  events        OrderEvent[]
  notifications Notification[]

  @@index([userId])
  @@index([artisanId])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY_TO_SHIP
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum SagaStatus {
  STARTED
  STOCK_RESERVED
  PAYMENT_PENDING
  PAYMENT_SUCCEEDED
  COMPLETED
  FAILED
  COMPENSATING
  COMPENSATED
}

model OrderItem {
  id          String  @id @default(uuid())

  orderId     String
  order       Order   @relation(fields: [orderId], references: [id])

  productId   String
  product     Product @relation(fields: [productId], references: [id])

  quantity    Int
  unitPrice   Float
  subtotal    Float

  @@index([orderId])
  @@index([productId])
}

model OrderEvent {
  id        String   @id @default(uuid())

  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])

  eventType String   // OrderCreated, PaymentSucceeded, etc.
  payload   Json

  createdAt DateTime @default(now())

  @@index([orderId])
  @@index([createdAt])
}

model Payment {
  id                String        @id @default(uuid())

  orderId           String        @unique
  order             Order         @relation(fields: [orderId], references: [id])

  amount            Float
  currency          String        @default("EUR")

  // Stripe
  stripePaymentIntentId String   @unique
  stripeClientSecret    String?

  status            PaymentStatus @default(PENDING)

  // Metadata
  paymentMethod     String?
  last4             String?

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  succeededAt       DateTime?
  failedAt          DateTime?

  @@index([status])
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  CANCELLED
  REFUNDED
}

model Shipment {
  id              String         @id @default(uuid())
  trackingNumber  String         @unique

  orderId         String         @unique
  order           Order          @relation(fields: [orderId], references: [id])

  transportistId  String?
  transportist    Transportist?  @relation(fields: [transportistId], references: [id])

  status          ShipmentStatus @default(PENDING)

  // Tracking
  pickupAddress   String
  deliveryAddress String

  estimatedDelivery DateTime?
  actualDelivery    DateTime?

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  trackingEvents  TrackingEvent[]

  @@index([status])
  @@index([trackingNumber])
}

enum ShipmentStatus {
  PENDING
  PICKED_UP
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  FAILED
  RETURNED
}

model Transportist {
  id          String     @id @default(uuid())
  name        String
  email       String     @unique
  phone       String
  rut         String?    @unique
  vehicleType String?

  active      Boolean    @default(true)
  rating      Float      @default(0)

  createdAt   DateTime   @default(now())

  shipments   Shipment[]
}

model TrackingEvent {
  id          String    @id @default(uuid())

  shipmentId  String
  shipment    Shipment  @relation(fields: [shipmentId], references: [id])

  status      String
  location    String?
  description String?

  // GPS
  latitude    Float?
  longitude   Float?

  createdAt   DateTime  @default(now())

  @@index([shipmentId])
  @@index([createdAt])
}

model InventoryLog {
  id          String   @id @default(uuid())

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  type        String   // RESTOCK, SALE, ADJUSTMENT, RETURN
  quantity    Int
  before      Int
  after       Int

  reason      String?

  createdAt   DateTime @default(now())

  @@index([productId])
  @@index([createdAt])
}

model StockReservation {
  id          String   @id @default(uuid())

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  quantity    Int
  orderId     String?  // Si es null, es reserva temporal

  expiresAt   DateTime
  createdAt   DateTime @default(now())

  released    Boolean  @default(false)

  @@index([productId])
  @@index([orderId])
  @@index([expiresAt])
}

model Notification {
  id          String            @id @default(uuid())

  userId      String?
  user        User?             @relation(fields: [userId], references: [id])

  orderId     String?
  order       Order?            @relation(fields: [orderId], references: [id])

  type        NotificationType
  channel     NotificationChannel

  recipient   String            // Email, phone, etc.
  subject     String?
  message     String

  status      NotificationStatus @default(PENDING)

  sentAt      DateTime?
  failedAt    DateTime?
  error       String?

  createdAt   DateTime          @default(now())

  @@index([userId])
  @@index([orderId])
  @@index([status])
}

enum NotificationType {
  ORDER_CONFIRMATION
  PAYMENT_SUCCEEDED
  ORDER_PREPARING
  ORDER_SHIPPED
  ORDER_DELIVERED
  ORDER_CANCELLED
  LOW_STOCK_ALERT
  NEW_ORDER_ARTISAN
}

enum NotificationChannel {
  EMAIL
  SMS
  PUSH
}

enum NotificationStatus {
  PENDING
  SENT
  FAILED
}
```

---

## FASES DE IMPLEMENTACIÓN (E-commerce)

### FASE 1: SETUP Y MIGRACIÓN (15 horas)

```bash
1. Crear estructura monolito (5h)
2. Migrar módulos core (auth, user, product) (10h)
```

### FASE 2: CORE MODULES (75 horas)

```bash
1. Crear Artisan Module (50h) - Ver PLAN_MONOLITO_SIMPLE.md
2. Crear Geo Module (25h)
```

### FASE 3: E-COMMERCE MODULES (70 horas)

#### 3.1 Migrar Order Module (15h)

```typescript
// backend/src/modules/order/

Ajustes necesarios:
1. Vincular con Artisan (órdenes por artesano)
2. Integrar con Payment
3. Integrar con Shipping
4. Dashboard artesano (ver sus pedidos)
5. Simplificar Saga (remover NATS, usar eventos in-memory)
```

#### 3.2 Migrar Payment Module (10h)

```typescript
// backend/src/modules/payment/

Ajustes:
1. Vincular con Order
2. Webhook handling robusto
3. Panel artesano (ver pagos)
4. Split payments (opcional v2)
```

#### 3.3 Completar Inventory Module (15h)

```typescript
// backend/src/modules/inventory/

Completar:
1. Integrar con Product
2. Stock reservation en checkout
3. Release reservation si pago falla
4. Panel artesano (gestión inventario)
5. Alertas stock bajo
```

#### 3.4 Migrar Shipping Module (20h)

```typescript
// backend/src/modules/shipping/

Opción A: Reescribir Python → TypeScript (20h)
Opción B: Mantener Python como microservicio separado (5h integración)

Recomendación: Opción A para simplicidad
```

#### 3.5 Migrar Notification Module (10h)

```typescript
// backend/src/modules/notification/

Ajustes:
1. Templates para e-commerce
2. Triggers automáticos (order events)
3. Queue simple con Bull (Redis)
```

### FASE 4: FRONTEND E-COMMERCE (60 horas)

#### 4.1 Catálogo y Búsqueda (15h)

```typescript
// frontend/src/pages/
- Home.tsx (listado artesanos)
- ArtisanDetail.tsx (perfil + productos)
- Products.tsx (catálogo completo)
- ProductDetail.tsx (detalle producto)
- Search.tsx (búsqueda avanzada)
```

#### 4.2 Carrito y Checkout (20h)

```typescript
// frontend/src/features/cart/
- Cart.tsx (ver carrito)
- Checkout.tsx (formulario checkout)
- PaymentForm.tsx (Stripe Elements)
- OrderConfirmation.tsx (resumen)

// Context
- CartContext.tsx (gestión carrito)
```

#### 4.3 Dashboard Usuario (10h)

```typescript
// frontend/src/pages/user/
- Orders.tsx (mis pedidos)
- OrderDetail.tsx (tracking)
- Profile.tsx (mis datos)
- Addresses.tsx (direcciones)
```

#### 4.4 Dashboard Artesano (15h)

```typescript
// frontend/src/pages/artisan/
- Dashboard.tsx (resumen)
- Products.tsx (gestión productos)
- Orders.tsx (pedidos recibidos)
- Inventory.tsx (control stock)
- Payments.tsx (pagos recibidos)
```

### FASE 5: TESTING (30 horas)

```bash
1. Unit tests módulos críticos (10h)
2. E2E flow completo (15h)
   - Buscar producto
   - Agregar al carrito
   - Checkout
   - Pagar con Stripe test
   - Verificar orden creada
   - Simular envío
   - Tracking
3. Integration tests (5h)
```

### FASE 6: DOCKER Y DEPLOY (15 horas)

```bash
1. Docker Compose simplificado (5h)
2. Deploy a VPS/Railway (5h)
3. Configurar Stripe production (2h)
4. SSL + Nginx (3h)
```

---

## RESUMEN DE HORAS

| Fase | Tarea | Horas |
|------|-------|-------|
| 1 | Setup y migración | 15 |
| 2 | Core Modules (Artisan + Geo) | 75 |
| 3 | E-commerce Modules | 70 |
| 4 | Frontend E-commerce | 60 |
| 5 | Testing | 30 |
| 6 | Docker y Deploy | 15 |
| **Buffer** | Contingencia (10%) | 25 |
| **TOTAL** | | **290h** |

**Rango realista:** 270-290 horas

---

## TIMELINE REALISTA

### Full-Time (40h/semana)

```
Semana 1:  Setup + Migración + Artisan (inicio)       [45h]
Semana 2:  Artisan (fin) + Geo                        [40h]
Semana 3:  E-commerce Modules (Order + Payment)       [40h]
Semana 4:  E-commerce Modules (Inventory + Shipping)  [40h]
Semana 5:  Notification + Frontend (inicio)           [40h]
Semana 6:  Frontend E-commerce                        [45h]
Semana 7:  Testing + Deploy                           [40h]
─────────────────────────────────────────────────────────
TOTAL:     7 semanas                                  [290h]
```

### Part-Time (20h/semana)

```
Semanas 1-2:   Setup + Artisan                    [45h]
Semanas 3-4:   Geo + Order + Payment              [50h]
Semanas 5-6:   Inventory + Shipping + Notification [45h]
Semanas 7-10:  Frontend completo                  [80h]
Semanas 11-12: Testing + Deploy                   [45h]
Semanas 13-14: Buffer                             [25h]
──────────────────────────────────────────────────────
TOTAL:         14 semanas                         [290h]
```

---

## SERVICIOS QUE MANTIENES (E-commerce)

### ✅ REUTILIZAS (ya funcionan)

| Servicio | Estado | Horas adicionales | Uso |
|----------|--------|-------------------|-----|
| **order-service** | 88% | 15h | Gestión pedidos + Saga |
| **payment-service** | 90% | 10h | Stripe integration |
| **inventory-service** | 80% | 15h | Control stock |
| **transportista-service** | 70% | 20h | Envíos y tracking |
| **notification-service** | 75% | 10h | Email/SMS/Push |

**Total ahorro:** ~200 horas ya invertidas

---

## SERVICIOS QUE ELIMINAS

### ❌ NO NECESARIOS (incluso con e-commerce)

1. **admin-service** → Frontend con roles
2. **analytics-service** → Google Analytics
3. **cms-service** → No necesario
4. **event-service** → Fuera de alcance
5. **chat-service** → v2 (WhatsApp suficiente)
6. **loyalty-service** → v2

**Ahorro:** ~210 horas

---

## INFRAESTRUCTURA SIMPLIFICADA

### Docker Compose E-commerce

```yaml
# docker-compose.ecommerce.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/artesanos_ecommerce
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    environment:
      - VITE_API_URL=http://localhost:3000
      - VITE_STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: artesanos_ecommerce
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

**Total: 4 servicios** (vs 16 originales)

---

## MONITOREO (E-commerce)

### Simple pero efectivo

```typescript
// backend/src/common/logger.service.ts
import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'orders.log', level: 'info' }),
  ],
});

// Logs específicos e-commerce
export function logOrder(event: string, orderId: string, data: any) {
  logger.info('ORDER_EVENT', { event, orderId, ...data });
}

export function logPayment(event: string, paymentId: string, data: any) {
  logger.info('PAYMENT_EVENT', { event, paymentId, ...data });
}
```

### Opcional (si creces)

- Sentry.io para errores ($0-29/mes)
- LogRocket para session replay ($99/mes)
- Uptime monitoring: UptimeRobot (gratis)

**NO NECESITAS:** Jaeger, OpenTelemetry, Prometheus, Grafana

---

## COSTOS ESTIMADOS (E-commerce)

### Desarrollo

| Concepto | Horas | Rate €50/h | Rate €100/h |
|----------|-------|-----------|-------------|
| **Monolito E-commerce** | 290h | €14,500 | €29,000 |
| Microservicios original | 770h | €38,500 | €77,000 |
| **AHORRO** | **480h** | **€24,000** | **€48,000** |

### Infraestructura Mensual

| Servicio | Costo |
|----------|-------|
| VPS (4GB RAM, 2 CPU) | $20-40 |
| PostgreSQL managed (opcional) | $0-15 |
| Redis managed (opcional) | $0-10 |
| Stripe fees | 1.4% + €0.25/transacción |
| SendGrid (email) | $0-15 (hasta 100 emails/día gratis) |
| Twilio (SMS) | $0-20 |
| **TOTAL/mes** | **$20-100** |

**vs Microservicios:** $250-450/mes = **Ahorro 60-80%**

---

## INTEGRACIONES EXTERNAS

### Stripe (Pagos)

```bash
# Test keys (desarrollo)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Production keys
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### SendGrid (Emails)

```bash
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@artesanosjaen.com
```

### Twilio (SMS)

```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+34...
```

---

## PRÓXIMOS PASOS INMEDIATOS

### HOY (1 hora)

```bash
1. Revisar este plan completo
2. Confirmar que quieres e-commerce completo
3. Verificar que tienes:
   - Cuenta Stripe (test mode)
   - SendGrid account (opcional)
   - Twilio account (opcional)
4. Crear rama: git checkout -b feature/monolith-ecommerce
```

### ESTA SEMANA (40 horas)

```bash
1. Setup monolito (5h)
2. Migrar módulos core (10h)
3. Comenzar Artisan Module (25h)
```

### PRÓXIMAS 2 SEMANAS (80 horas)

```bash
1. Completar Artisan Module (25h)
2. Crear Geo Module (25h)
3. Migrar Order Module (15h)
4. Migrar Payment Module (10h)
```

### SEMANAS 3-4 (80 horas)

```bash
1. Inventory Module (15h)
2. Shipping Module (20h)
3. Notification Module (10h)
4. Frontend catálogo (20h)
5. Frontend carrito (15h)
```

### SEMANAS 5-6 (80 horas)

```bash
1. Frontend checkout (20h)
2. Dashboard usuario (10h)
3. Dashboard artesano (15h)
4. Testing completo (30h)
5. Deploy (5h)
```

---

## CRITERIOS DE ÉXITO (E-commerce)

### MVP E-commerce listo cuando

#### Funcionalidades Usuario

- [ ] Buscar artesanos por ubicación/especialidad
- [ ] Ver catálogo de productos
- [ ] Agregar productos al carrito
- [ ] Checkout con dirección de envío
- [ ] Pagar con Stripe (tarjeta de crédito/débito)
- [ ] Recibir email de confirmación
- [ ] Ver estado de pedido
- [ ] Tracking de envío

#### Funcionalidades Artesano

- [ ] Ver pedidos recibidos
- [ ] Actualizar estado de pedido
- [ ] Gestionar productos (CRUD)
- [ ] Gestionar inventario
- [ ] Ver pagos recibidos

#### Técnicas

- [ ] Order flow completo funciona
- [ ] Stripe webhooks configurados
- [ ] Notifications se envían
- [ ] Tests e2e passing
- [ ] Deploy en staging
- [ ] API response time <300ms
- [ ] Frontend load time <3s

---

## SIMPLIFICACIONES vs Microservicios

### ✅ MANTIENES

- Toda la funcionalidad e-commerce
- Stripe integration
- Order management
- Inventory tracking
- Shipping
- Notifications

### ❌ ELIMINAS

- NATS message broker → Eventos in-memory
- Saga distribuido → Saga local simplificado
- Jaeger/OpenTelemetry → Winston logs
- 16 servicios → 1 monolito
- Docker orchestration complejo → docker-compose simple

### 📉 RESULTADO

- **Mismo features, 62% menos código**
- **Mismo features, 70% menos tiempo**
- **Mismo features, 80% menos costo infraestructura**

---

## MIGRACIÓN FUTURA A MICROSERVICIOS

### Cuándo considerar

#### Señales técnicas

- [ ] >50,000 pedidos/mes
- [ ] >100,000 usuarios activos
- [ ] Latencia consistente >500ms
- [ ] Need to scale Order module independently

#### Estrategia de migración

```
1. Extraer Payment Module primero (más crítico)
2. Extraer Order Module
3. Extraer Inventory Module
4. Mantener resto en monolito

Total tiempo migración: ~80-100 horas
```

**Por ahora:** Monolito es suficiente para 99% de casos

---

## RESUMEN EJECUTIVO

### Decisión: E-commerce Completo ✅

**Incluye:**

- Portal de artesanos
- Catálogo de productos
- Carrito de compra
- Checkout con Stripe
- Gestión de pedidos
- Control de inventario
- Envíos y tracking
- Notificaciones automáticas
- Dashboard artesano

**Arquitectura:** Monolito NestJS con 10 módulos

**Horas:** 270-290 horas (vs 770 original = 62% menos)

**Timeline:** 7 semanas full-time o 14 semanas part-time

**Ahorro:** €24,000-48,000 en desarrollo + $2,000-4,000/año en infraestructura

**Reutilización:** 5 servicios e-commerce ya implementados (~200h ahorro)

---

## PRÓXIMO PASO

Abre [INICIO_RAPIDO.md](INICIO_RAPIDO.md) y adapta para incluir módulos e-commerce.

O ejecuta directamente:

```bash
cd /Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices
git checkout -b feature/monolith-ecommerce
mkdir -p backend/src/modules/{auth,user,artisan,product,geo,order,payment,inventory,shipping,notification}
```

**¿Listo para empezar? 🚀**

---

**Creado:** 8 Noviembre 2025
**Decisión:** Monolito E-commerce Completo ✅
**Timeline:** 7 semanas (290 horas)
