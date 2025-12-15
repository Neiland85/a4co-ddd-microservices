# A4CO API Gateway

**Reverse proxy centralizado** para la plataforma A4CO que actúa como punto de entrada único, proporcionando autenticación JWT, propagación de contexto de usuario, CORS seguro y logging estructurado.

## 🎯 Arquitectura

El API Gateway implementa una arquitectura hexagonal con:
- **Middleware JWT**: Validación de tokens y propagación de contexto de usuario
- **Correlation ID**: Trazabilidad distribuida entre microservicios
- **Structured Logging**: Logs JSON para observabilidad
- **Error Handling**: Respuestas de error consistentes
- **Health Checks**: Endpoints para Kubernetes readiness/liveness

```
                    ┌─────────────────┐
                    │   Dashboard     │
                    │   Client        │
                    └────────┬────────┘
                             │ HTTPS
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  (Port 3000)    │
                    │                 │
                    │  ┌───────────┐  │
                    │  │ JWT Auth  │  │
                    │  │ Middleware│  │
                    │  └───────────┘  │
                    │  ┌───────────┐  │
                    │  │Correlation│  │
                    │  │    ID     │  │
                    │  └───────────┘  │
                    │  ┌───────────┐  │
                    │  │ Structured│  │
                    │  │  Logger   │  │
                    │  └───────────┘  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼───┐         ┌─────▼────┐        ┌─────▼─────┐
   │ Order  │         │ Payment  │        │ Inventory │
   │Service │         │ Service  │        │  Service  │
   │ :3002  │         │  :3003   │        │   :3004   │
   └────────┘         └──────────┘        └───────────┘
```

## 🚀 Características

- ✅ **JWT Authentication**: Validación de tokens HS256 con extracción de userId, email y roles
- ✅ **User Context Propagation**: Headers `X-User-ID`, `X-User-Role` hacia servicios downstream
- ✅ **Correlation ID**: Trazabilidad distribuida con `X-Correlation-ID`
- ✅ **Proxy Routing**: Enrutamiento transparente a microservicios backend
- ✅ **Rate Limiting**: 100 requests por minuto por IP (configurable)
- ✅ **Health Checks**: `/health`, `/health/ready`, `/health/live`, `/health/services`
- ✅ **Swagger/OpenAPI**: Documentación interactiva en `/api/docs`
- ✅ **Security**: Helmet configurado, CORS restrictivo
- ✅ **Structured Logging**: Logs JSON con timestamp, duration, userId, targetService
- ✅ **Error Handling**: Respuestas consistentes (401, 403, 502, 503, 504)

## 📋 Rutas Proxy

| Ruta Gateway | Servicio Backend | Puerto | Autenticación |
|--------------|------------------|--------|---------------|
| `GET/POST/PUT/DELETE /api/v1/orders/**` | Order Service | 3002 | ✅ Requerida |
| `GET/POST/PUT/DELETE /api/v1/payments/**` | Payment Service | 3003 | ✅ Requerida |
| `GET/POST/PUT/DELETE /api/v1/inventory/**` | Inventory Service | 3004 | ✅ Requerida |
| `GET /api/v1/products/**` | Product Service | 3002 | ❌ Pública |
| `POST /api/v1/auth/**` | Auth Service | 3001 | ❌ Pública |
| `GET /api/v1/health` | Gateway Local | - | ❌ Pública |
| `GET /api/docs` | Swagger UI | - | ❌ Pública |

## 🛠️ Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar configuración de entorno
cp .env.example .env
```

## ⚙️ Configuración

Crear archivo `.env` basado en `.env.example`:

```env
# Server
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Service URLs (As per requirements)
AUTH_SERVICE_URL=http://localhost:3001
PRODUCTS_SERVICE_URL=http://localhost:3002
ORDERS_SERVICE_URL=http://localhost:3003
INVENTORY_SERVICE_URL=http://localhost:3004
PAYMENTS_SERVICE_URL=http://localhost:3005
SAGAS_SERVICE_URL=http://localhost:3006

# Proxy Settings
PROXY_TIMEOUT=30000

# Rate Limiting (100 requests per minute)
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
```

### Variables de Entorno Requeridas

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del gateway | 3000 |
| `JWT_SECRET` | Clave secreta para validar JWT | **REQUERIDO** |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | 24h |
| `CORS_ORIGIN` | Orígenes permitidos (separados por coma) | http://localhost:3000 |
| `AUTH_SERVICE_URL` | URL del servicio de autenticación | http://localhost:3001 |
| `PRODUCTS_SERVICE_URL` | URL del servicio de productos | http://localhost:3002 |
| `ORDERS_SERVICE_URL` | URL del servicio de pedidos | http://localhost:3003 |
| `INVENTORY_SERVICE_URL` | URL del servicio de inventario | http://localhost:3004 |
| `PAYMENTS_SERVICE_URL` | URL del servicio de pagos | http://localhost:3005 |
| `SAGAS_SERVICE_URL` | URL del coordinador de sagas | http://localhost:3006 |
| `RATE_LIMIT_TTL` | TTL para rate limiting (segundos) | 60 |
| `RATE_LIMIT_MAX` | Máximo de requests por TTL | 100 |
| `LOG_LEVEL` | Nivel de logging | debug |

## 📦 Scripts

```bash
# Desarrollo
npm run start:dev      # Modo watch
npm run start:debug    # Con debugger

# Producción
npm run build          # Compilar
npm run start:prod     # Ejecutar build

# Testing
npm run test           # Unit tests (29 tests)
npm run test:cov       # Coverage
npm run test:watch     # Watch mode

# Linting
npm run lint           # ESLint
```

## 🧪 Testing

El gateway incluye 29 tests automatizados:

- **JWT Authentication Tests** (13 tests)
  - Token validation (valid, expired, invalid signature)
  - Public path authentication bypass
  - User context extraction
  
- **Proxy Service Tests** (11 tests)
  - Request forwarding
  - Header propagation
  - Error handling (service unavailable, timeout, HTTP errors)
  - Payment and Saga service integration
  
- **Rate Limiting Tests** (5 tests)
  - Configuration validation
  - Throttler guard availability

```bash
npm test
# PASS  29 tests passing
```

## 🌐 Endpoints

### Health Checks

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check básico |
| `/api/v1/health/services` | GET | Health de servicios downstream |
| `/api/v1/health/ready` | GET | Kubernetes readiness probe |
| `/api/v1/health/live` | GET | Kubernetes liveness probe |

### Auth Proxy

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/v1/auth/login` | Login de usuario |
| `POST /api/v1/auth/register` | Registro de usuario |
| `POST /api/v1/auth/logout` | Logout |
| `POST /api/v1/auth/refresh` | Refresh token |
| `GET /api/v1/auth/me` | Usuario actual |

### Products Proxy

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/v1/products` | Listar productos (público) |
| `POST /api/v1/products` | Crear producto |
| `GET /api/v1/products/:id` | Obtener producto (público) |
| `GET /api/v1/products/search` | Buscar productos |
| `GET /api/v1/products/categories` | Listar categorías |

### Orders Proxy

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/v1/orders` | Listar pedidos |
| `POST /api/v1/orders` | Crear pedido |
| `GET /api/v1/orders/:id` | Obtener pedido |
| `PUT /api/v1/orders/:id/status` | Actualizar estado |
| `POST /api/v1/orders/:id/cancel` | Cancelar pedido |

### Inventory Proxy

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/v1/inventory` | Listar inventario |
| `GET /api/v1/inventory/check` | Verificar disponibilidad |
| `POST /api/v1/inventory/reserve` | Reservar stock |
| `POST /api/v1/inventory/release` | Liberar stock |

### Payments Proxy

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/v1/payments/process` | Procesar un pago |
| `GET /api/v1/payments/:id` | Obtener detalles de pago |
| `POST /api/v1/payments/:id/confirm` | Confirmar pago |
| `POST /api/v1/payments/:id/cancel` | Cancelar pago |
| `POST /api/v1/payments/refund` | Solicitar reembolso |
| `GET /api/v1/payments/methods` | Obtener métodos de pago |

### Sagas Proxy

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/v1/sagas` | Listar sagas |
| `GET /api/v1/sagas/:id` | Obtener saga por ID |
| `GET /api/v1/sagas/:id/steps` | Obtener pasos de ejecución |
| `POST /api/v1/sagas/:id/rollback` | Rollback de una saga |
| `POST /api/v1/sagas/:id/retry` | Reintentar paso fallido |
| `GET /api/v1/sagas/transactions` | Listar transacciones |

## 📚 Documentación API

Swagger UI disponible en: `http://localhost:3000/api/docs`

## 🏗️ Arquitectura

```
src/
├── main.ts                      # Entry point con configuración de Swagger
├── app.module.ts                # Module principal con rate limiting
├── config/
│   └── configuration.ts         # Configuración centralizada
├── common/
│   ├── guards/                  # Guards (JWT, etc.)
│   ├── decorators/              # Decoradores personalizados
│   └── middleware/
│       ├── jwt-auth.middleware.ts    # Autenticación JWT
│       └── logger.middleware.ts      # Logging estructurado
├── health/
│   └── health.controller.ts     # Health checks (gateway, services, ready, live)
└── proxy/
    ├── proxy.module.ts          # Módulo de proxy
    ├── proxy.service.ts         # Servicio de forwarding HTTP con @nestjs/axios
    └── controllers/
        ├── auth-proxy.controller.ts
        ├── products-proxy.controller.ts
        ├── orders-proxy.controller.ts
        ├── inventory-proxy.controller.ts
        ├── payments-proxy.controller.ts
        └── sagas-proxy.controller.ts

test/
├── jwt-auth.middleware.spec.ts  # Tests de autenticación JWT
├── proxy.service.spec.ts        # Tests de proxy service
└── rate-limiting.spec.ts        # Tests de rate limiting
```

### Flujo de Petición

1. **Request** → Gateway (Puerto 3000)
2. **Logger Middleware** → Registra petición con request ID
3. **JWT Auth Middleware** → Valida token JWT (excepto rutas públicas)
4. **Rate Limiting Guard** → Verifica límite de requests (100/min)
5. **Proxy Controller** → Selecciona servicio destino
6. **Proxy Service** → Forwarding con headers de autenticación y contexto
7. **Downstream Service** → Procesa petición
8. **Response** → Gateway → Cliente

## 🔒 Seguridad

- **JWT Authentication**: Validación de tokens en cada request
  - Extracción de `userId` y `roles` del token
  - Headers propagados a servicios downstream: `X-User-ID`, `X-User-Email`, `X-User-Role`
  - Manejo de tokens expirados con mensajes claros
  
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origins permitidos (configurable por entorno)
- **Rate Limiting**: 100 requests por minuto por IP (configurable)
- **Validation Pipe**: Validación automática de DTOs
- **Error Handling**: Manejo centralizado de errores con status codes consistentes

### Rutas Públicas (Sin JWT)

Las siguientes rutas NO requieren autenticación:
- `/api/v1/auth/login`
- `/api/v1/auth/register`
- `/api/v1/auth/refresh`
- `/api/v1/auth/verify`
- `/api/v1/auth/password/reset`
- `/api/v1/health/*`
- `/api/docs` (Swagger)
- `/api/v1/products` (browsing público)

Todas las demás rutas requieren token JWT válido.

## 🐳 Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## 📝 Notas de Implementación

- El gateway utiliza `@nestjs/axios` para forwarding HTTP
- Las rutas wildcard usan la nueva sintaxis `*path` para `path-to-regexp` v8+
- Los headers de autenticación se propagan automáticamente a los servicios backend
- Rate limiting implementado con `@nestjs/throttler`
- JWT secret debe ser configurado como variable de entorno (requerido)
- Logging estructurado con información de request: timestamp, method, path, userId, statusCode, duration

## 🔍 Troubleshooting

### Gateway no arranca
```bash
# Verificar que JWT_SECRET esté configurado
echo $JWT_SECRET

# Verificar dependencias instaladas
npm install --legacy-peer-deps
```

### Error de autenticación
```bash
# Verificar que el token JWT sea válido
# El token debe tener el formato: Bearer <token>
# El token debe estar firmado con el mismo JWT_SECRET
```

### Servicio downstream no responde
```bash
# Verificar que el servicio esté corriendo
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Products Service
# etc...

# Verificar URLs en .env
cat .env | grep SERVICE_URL
```

## 🚀 Ejemplo de Uso

### 1. Login (Obtener Token)
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Response: { "token": "eyJhbGc..." }
```

### 2. Hacer Request Autenticado
```bash
curl -X GET http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer eyJhbGc..."
```

### 3. Health Check
```bash
curl http://localhost:3000/api/v1/health

# Response: { "status": "ok", "info": { "gateway": { "status": "up" } } }
```

## 📄 Licencia

Este proyecto es parte de la plataforma A4CO DDD Microservices.

## 🔐 Flujo de Autenticación JWT

### Diagrama de Flujo

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │ Gateway  │                  │  Order   │
│          │                  │          │                  │ Service  │
└─────┬────┘                  └────┬─────┘                  └────┬─────┘
      │                            │                             │
      │ 1. POST /auth/login        │                             │
      ├──────────────────────────► │                             │
      │    email + password        │                             │
      │                            │ 2. Proxy to Auth Service    │
      │                            ├─────────────────────────────┤
      │                            │                             │
      │ 3. Return JWT token        │                             │
      │◄───────────────────────────┤                             │
      │    { accessToken: "..." }  │                             │
      │                            │                             │
      │ 4. GET /orders             │                             │
      ├──────────────────────────► │                             │
      │    Authorization: Bearer   │                             │
      │                            │ 5. Validate JWT             │
      │                            ├┐                            │
      │                            ││                            │
      │                            │├ Extract userId, role       │
      │                            ││                            │
      │                            │└                            │
      │                            │ 6. Forward with context     │
      │                            ├────────────────────────────►│
      │                            │    X-User-ID: user-123      │
      │                            │    X-User-Role: admin       │
      │                            │    X-Correlation-ID: abc    │
      │                            │                             │
      │                            │ 7. Response                 │
      │                            │◄────────────────────────────┤
      │ 8. Return to client        │                             │
      │◄───────────────────────────┤                             │
      │                            │                             │
```

### Payload JWT Esperado

```json
{
  "sub": "user-123",           // User ID (requerido)
  "email": "user@example.com", // Email (opcional)
  "role": "admin",             // Role (opcional)
  "iat": 1609459200,           // Issued at
  "exp": 1609545600            // Expiration
}
```

### Headers Propagados

El gateway añade automáticamente estos headers a cada request downstream:

| Header | Origen | Ejemplo |
|--------|--------|---------|
| `X-User-ID` | JWT payload `sub` | `user-123` |
| `X-User-Email` | JWT payload `email` | `user@example.com` |
| `X-User-Role` | JWT payload `role` | `admin` |
| `X-Correlation-ID` | Generado o heredado | `corr-1234567890-abc` |
| `X-Request-ID` | Generado | `gw-1234567890-xyz` |
| `X-Forwarded-By` | Fijo | `a4co-gateway` |
| `X-Forwarded-Host` | Header `host` | `localhost:3000` |
| `X-Forwarded-Proto` | Protocol | `http` |

## 📊 Logging Estructurado

Cada request genera un log JSON con el siguiente formato:

```json
{
  "timestamp": "2025-12-15T12:00:00.000Z",
  "correlationId": "corr-1734264000-abc123",
  "method": "GET",
  "path": "/api/v1/orders/123",
  "statusCode": 200,
  "duration": 45,
  "userId": "user-456",
  "roles": "admin",
  "targetService": "order-service",
  "message": "Request processed successfully"
}
```

### Ejemplo de Logs en Diferentes Escenarios

#### Request Exitoso (200)
```json
{
  "timestamp": "2025-12-15T12:00:00.000Z",
  "correlationId": "corr-123",
  "method": "POST",
  "path": "/api/v1/orders",
  "statusCode": 201,
  "duration": 152,
  "userId": "user-456",
  "roles": "user",
  "targetService": "order-service",
  "message": "Request processed successfully"
}
```

#### Error de Autenticación (401)
```json
{
  "timestamp": "2025-12-15T12:00:00.000Z",
  "correlationId": "corr-124",
  "method": "GET",
  "path": "/api/v1/orders",
  "statusCode": 401,
  "duration": 2,
  "message": "Request processed with errors",
  "userAgent": "curl/7.68.0",
  "ip": "127.0.0.1"
}
```

#### Servicio No Disponible (503)
```json
{
  "timestamp": "2025-12-15T12:00:00.000Z",
  "correlationId": "corr-125",
  "method": "GET",
  "path": "/api/v1/orders/123",
  "statusCode": 503,
  "duration": 30002,
  "userId": "user-456",
  "targetService": "order-service",
  "message": "Request processed with errors",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.100"
}
```

## 🧪 Ejemplos de Uso Avanzados

### 1. Login y Almacenar Token

```bash
# Bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@a4co.com", "password": "securepass"}' \
  | jq -r '.accessToken')

echo "Token: $TOKEN"
```

### 2. Crear Pedido con Autenticación

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: custom-corr-123" \
  -d '{
    "items": [
      {"productId": "prod-1", "quantity": 2},
      {"productId": "prod-2", "quantity": 1}
    ],
    "shippingAddress": {
      "street": "Calle Mayor 1",
      "city": "Sevilla",
      "postalCode": "41001"
    }
  }'
```

### 3. Consultar Estado de Pedido

```bash
curl -X GET http://localhost:3000/api/v1/orders/order-123 \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Procesar Pago

```bash
curl -X POST http://localhost:3000/api/v1/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-123",
    "amount": 59.99,
    "currency": "EUR",
    "paymentMethod": "card",
    "cardToken": "tok_visa_4242"
  }'
```

### 5. Verificar Inventario

```bash
curl -X GET "http://localhost:3000/api/v1/inventory?productId=prod-1" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Health Check de Todos los Servicios

```bash
curl http://localhost:3000/api/v1/health/services | jq
```

## 🐳 Docker Compose

El gateway está incluido en `docker-compose.yml`:

```yaml
api-gateway:
  build:
    context: ./apps/gateway
  ports:
    - "3000:3000"
  environment:
    - JWT_SECRET=${JWT_SECRET}
    - ORDERS_SERVICE_URL=http://order-service:3000
    - PAYMENTS_SERVICE_URL=http://payment-service:3001
    - INVENTORY_SERVICE_URL=http://inventory-service:3002
  depends_on:
    - order-service
    - payment-service
    - inventory-service
```

### Iniciar con Docker Compose

```bash
# Iniciar todo el stack
docker-compose up -d

# Ver logs del gateway
docker-compose logs -f api-gateway

# Verificar health
curl http://localhost:3000/api/v1/health

# Parar servicios
docker-compose down
```

## 🔒 Seguridad

### Mejores Prácticas

1. **JWT_SECRET**: Usar una clave fuerte (mínimo 256 bits)
   ```bash
   # Generar clave segura
   openssl rand -base64 64
   ```

2. **CORS**: Restringir orígenes permitidos
   ```env
   # Producción
   CORS_ORIGIN=https://app.a4co.com,https://admin.a4co.com
   
   # Desarrollo
   CORS_ORIGIN=http://localhost:3000,http://localhost:4200
   ```

3. **Rate Limiting**: Ajustar según capacidad
   ```env
   # Producción: más restrictivo
   RATE_LIMIT_TTL=60
   RATE_LIMIT_MAX=50
   
   # Desarrollo: más permisivo
   RATE_LIMIT_TTL=60
   RATE_LIMIT_MAX=1000
   ```

4. **Timeouts**: Configurar timeouts apropiados
   ```env
   # Para operaciones rápidas
   PROXY_TIMEOUT=5000
   
   # Para operaciones lentas (pagos, uploads)
   PROXY_TIMEOUT=30000
   ```

### Headers de Seguridad (Helmet)

El gateway aplica automáticamente estos headers:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## 📈 Monitoreo y Observabilidad

### Métricas Disponibles

El gateway expone métricas vía endpoints de health:

```bash
# Health básico
curl http://localhost:3000/api/v1/health

# Health de servicios downstream
curl http://localhost:3000/api/v1/health/services

# Readiness (K8s)
curl http://localhost:3000/api/v1/health/ready

# Liveness (K8s)
curl http://localhost:3000/api/v1/health/live
```

### Integración con Observabilidad

Los logs estructurados JSON son compatibles con:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Grafana Loki**
- **CloudWatch**
- **Datadog**

Ejemplo de query en Kibana:
```
correlationId:"corr-123" AND statusCode:>=400
```

## 🧩 Extensibilidad

### Añadir Nuevo Servicio Proxy

1. **Agregar configuración**:
```typescript
// src/config/configuration.ts
services: {
  // ... existing services
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
}
```

2. **Crear controller**:
```typescript
// src/proxy/controllers/notification-proxy.controller.ts
@Controller('notifications')
export class NotificationProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const response = await this.proxyService.forward('notification', req.path, req);
    return res.status(response.status).json(response.data);
  }
}
```

3. **Registrar en módulo**:
```typescript
// src/proxy/proxy.module.ts
controllers: [
  // ... existing controllers
  NotificationProxyController,
]
```

## 🤝 Contribución

Este proyecto sigue arquitectura hexagonal:

```
src/
├── auth/              # Estrategias JWT, DTOs
├── common/            # Decorators, guards, filters
├── config/            # Configuración centralizada
├── health/            # Health checks
├── logger/            # Structured logging
└── proxy/             # Servicios proxy y controllers
```

### Convenciones

- **Middleware**: `*.middleware.ts`
- **Guards**: `*.guard.ts`
- **Filters**: `*.filter.ts`
- **DTOs**: `*.dto.ts`
- **Tests**: `*.spec.ts` (unit), `*.e2e.spec.ts` (integration)

