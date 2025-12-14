# A4CO API Gateway

Servicio gateway NestJS que actúa como proxy para los microservicios de la plataforma A4CO.

## 🚀 Características

- **Proxy Routing**: Enrutamiento de peticiones a microservicios backend
- **Health Checks**: Endpoints de health para Kubernetes readiness/liveness probes
- **Swagger/OpenAPI**: Documentación automática de API
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Middleware de logging para todas las peticiones

## 📋 Servicios Proxy

| Ruta | Servicio Backend | Puerto |
|------|-----------------|--------|
| `/api/v1/auth/*` | Auth Service | 3001 |
| `/api/v1/products/*` | Product Service | 3002 |
| `/api/v1/orders/*` | Order Service | 3003 |
| `/api/v1/inventory/*` | Inventory Service | 3004 |

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

# CORS
CORS_ORIGIN=http://localhost:3000

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
INVENTORY_SERVICE_URL=http://localhost:3004

# Proxy Settings
PROXY_TIMEOUT=30000
```

## 📦 Scripts

```bash
# Desarrollo
pnpm run start:dev      # Modo watch
pnpm run start:debug    # Con debugger

# Producción
pnpm run build          # Compilar
pnpm run start:prod     # Ejecutar build

# Testing
pnpm run test           # Unit tests
pnpm run test:cov       # Coverage

# Linting
pnpm run lint           # ESLint
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
| `GET /api/v1/products` | Listar productos |
| `POST /api/v1/products` | Crear producto |
| `GET /api/v1/products/:id` | Obtener producto |
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

## 📚 Documentación API

Swagger UI disponible en: `http://localhost:3000/api/docs`

## 🏗️ Arquitectura

```
src/
├── main.ts                 # Entry point
├── app.module.ts           # Module principal
├── config/
│   └── configuration.ts    # Configuración centralizada
├── common/
│   └── middleware/
│       └── logger.middleware.ts
├── health/
│   └── health.controller.ts
└── proxy/
    ├── proxy.module.ts
    ├── proxy.service.ts     # Servicio de forwarding HTTP
    ├── proxy.middleware.ts  # http-proxy-middleware wrapper
    └── controllers/
        ├── auth-proxy.controller.ts
        ├── products-proxy.controller.ts
        ├── orders-proxy.controller.ts
        └── inventory-proxy.controller.ts
```

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origins permitidos
- **Validation Pipe**: Validación automática de DTOs
- **Error Handling**: Manejo centralizado de errores

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

## 📝 Notas

- El gateway utiliza `@nestjs/axios` para forwarding HTTP
- Las rutas wildcard usan la nueva sintaxis `*path` para `path-to-regexp` v8+
- Los headers de autenticación se propagan automáticamente a los servicios backend
