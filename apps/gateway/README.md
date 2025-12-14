# A4CO API Gateway

API Gateway NestJS funcional que orquesta el tráfico hacia todos los microservicios de la plataforma A4CO con autenticación JWT, validación de tokens, CORS, documentación Swagger y logging estructurado.

## 🚀 Características

- ✅ **JWT Authentication**: Validación de tokens JWT con extracción de userId y roles
- ✅ **Proxy Routing**: Enrutamiento de peticiones a microservicios backend
- ✅ **Rate Limiting**: 100 requests por minuto por IP
- ✅ **Health Checks**: Endpoints de health para Kubernetes readiness/liveness probes
- ✅ **Swagger/OpenAPI**: Documentación automática de API
- ✅ **Security**: Helmet, CORS configurado
- ✅ **Logging**: Middleware de logging estructurado para todas las peticiones
- ✅ **Error Handling**: Manejo de errores con status codes consistentes

## 📋 Servicios Proxy

| Ruta | Servicio Backend | Puerto |
|------|-----------------|--------|
| `/api/v1/auth/*` | Auth Service | 3001 |
| `/api/v1/products/*` | Product Service | 3002 |
| `/api/v1/orders/*` | Order Service | 3003 |
| `/api/v1/inventory/*` | Inventory Service | 3004 |
| `/api/v1/payments/*` | Payment Service | 3005 |
| `/api/v1/sagas/*` | Saga Coordinator | 3006 |

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
