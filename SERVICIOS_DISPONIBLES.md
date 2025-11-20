# 🚀 Servicios Disponibles - A4CO DDD Microservices

**Fecha**: 16 de noviembre de 2025  
**Estado**: Monolito operativo, microservicios requieren correcciones

---

## ✅ Servicios Actualmente Corriendo

### 1. **Monolito Principal** (Puerto 3000) ✅ OPERATIVO

- **PID**: 84402
- **Estado**: ✅ Corriendo
- **Ubicación**: `/src/main.ts` (raíz del proyecto)
- **Base de datos**: PostgreSQL - `artisan_portal` en localhost:5432

#### Endpoints Disponibles

##### **Autenticación** (`/auth`)

- `POST /auth/register` - Registrar nuevo usuario

  ```bash
  curl -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "password123",
      "name": "Usuario Test"
    }'
  ```

- `POST /auth/login` - Iniciar sesión

  ```bash
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "password123"
    }'
  ```

##### **Usuarios** (`/users`) 🔐 Requiere autenticación

- `GET /users` - Listar todos los usuarios
- `GET /users/:id` - Obtener un usuario específico
- `POST /users` - Crear nuevo usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

##### **Productos** (`/products`)

- `GET /products` - Listar todos los productos (público)
- `GET /products/:id` - Obtener un producto específico (público)
- `POST /products` - Crear nuevo producto 🔐
- `PUT /products/:id` - Actualizar producto 🔐
- `DELETE /products/:id` - Eliminar producto 🔐

##### **Órdenes** (`/orders`) 🔐 Requiere autenticación

- `GET /orders` - Listar órdenes del usuario
- `GET /orders/:id` - Obtener una orden específica
- `POST /orders` - Crear nueva orden
- `PUT /orders/:id` - Actualizar orden
- `DELETE /orders/:id` - Eliminar orden

#### Documentación

- **Swagger UI**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health (si está configurado)

---

## 🔧 Microservicios (Estado: Requieren Corrección)

### Arquitectura de Microservicios

El proyecto está diseñado con los siguientes microservicios independientes:

### 2. **Auth Service** (Puerto 3001) ⚠️ No operativo

- **Ruta**: `apps/auth-service/`
- **Función**: Autenticación y gestión de tokens JWT
- **Problema**: Requiere Node.js >= 22.0.0 (actual: v20.19.5)
- **Documentación**: http://localhost:3001/api/docs (cuando esté corriendo)
- **Comando**: `pnpm --filter @a4co/auth-service run start:dev`

### 3. **Product Service** (Puerto 3003) ⚠️ No operativo

- **Ruta**: `apps/product-service/`
- **Función**: Gestión de catálogo de productos
- **Problema**: Errores de compilación TypeScript
- **Documentación**: http://localhost:3003/api (cuando esté corriendo)
- **Comando**: `pnpm --filter @a4co/product-service run start:dev`

### 4. **Order Service** (Puerto 3004) ⚠️ No operativo

- **Ruta**: `apps/order-service/`
- **Función**: Procesamiento de pedidos
- **Problema**: Errores de compilación TypeScript
- **Documentación**: http://localhost:3004/api (cuando esté corriendo)
- **Comando**: `pnpm --filter @a4co/order-service run start:dev`

### 5. **User Service** (Puerto 3005) ⚠️ No operativo

- **Ruta**: `apps/user-service/`
- **Función**: Gestión de perfiles de usuario
- **Problemas**:
  - Error TS6059: Archivos fuera de `rootDir`
  - Error TS2307: No encuentra módulo 'uuid'
  - Error TS2307: No encuentra módulo 'jsdom'
- **Documentación**: http://localhost:3005/api (cuando esté corriendo)
- **Comando**: `pnpm --filter @a4co/user-service run start:dev`

### 6. **Payment Service** (Puerto 3006) ⚠️ No operativo

- **Ruta**: `apps/payment-service/`
- **Función**: Procesamiento de pagos con integración NATS
- **Problema**: Requiere NATS corriendo (nats://localhost:4222)
- **Documentación**: http://localhost:3006/api (cuando esté corriendo)
- **Comando**: `pnpm --filter @a4co/payment-service run start:dev`

### 7. **Inventory Service** (Puerto 3006) ⚠️ Conflicto de puerto

- **Ruta**: `apps/inventory-service/`
- **Función**: Gestión de inventario
- **Problema**: Comparte puerto 3006 con Payment Service
- **Solución**: Cambiar a puerto 3008 en main.ts
- **Documentación**: http://localhost:3006/api/inventory/docs (cuando esté corriendo)
- **Comando**: `pnpm --filter @a4co/inventory-service run start:dev`

### 8. **Notification Service** (Puerto 3007) ⚠️ No operativo

- **Ruta**: `apps/notification-service/`
- **Función**: Notificaciones multi-canal (Email, SMS, Push)
- **Canales**:
  - 📧 Email: SendGrid (mock si no hay API key)
  - 📱 SMS: Twilio (mock si no hay credenciales)
  - 🔔 Push: Firebase (mock si no está configurado)
- **Documentación**: http://localhost:3007/api/notifications/docs (cuando esté corriendo)
- **Comando**: `pnpm --filter @a4co/notification-service run start:dev`

---

## 🌐 Frontend (Estado: Disponible pero no corriendo)

### 9. **Frontend React + Vite** (Puerto 5173) 📱 No corriendo

- **Ruta**: `apps/frontend/`
- **Tecnologías**: React 19, Vite 6, Tailwind CSS
- **Comando**:

  ```bash
  cd apps/frontend
  pnpm run dev
  ```

- **URL**: http://localhost:5173 (cuando esté corriendo)

---

## 🗄️ Infraestructura

### PostgreSQL ✅ Corriendo

- **Puerto**: 5432
- **Host**: localhost
- **Base de datos**: `artisan_portal`
- **Usuario**: `postgres` (configuración por defecto)
- **Modelos**:
  - `User` (roles: CUSTOMER, ARTISAN, ADMIN)
  - `Product` (con relación a artesano)
  - `Order` (con items)
  - `OrderItem`

### Prisma Studio (Disponible)

```bash
pnpm run db:studio
```

Abre interfaz web para explorar la base de datos

---

## 📊 Resumen de Estado

| Servicio             | Puerto | Estado          | Problema                 |
| -------------------- | ------ | --------------- | ------------------------ |
| **Monolito**         | 3000   | ✅ Operativo    | Ninguno                  |
| PostgreSQL           | 5432   | ✅ Operativo    | Ninguno                  |
| Auth Service         | 3001   | ⚠️ No corriendo | Node.js versión baja     |
| Product Service      | 3003   | ⚠️ No corriendo | Errores TypeScript       |
| Order Service        | 3004   | ⚠️ No corriendo | Errores TypeScript       |
| User Service         | 3005   | ⚠️ No corriendo | Dependencias faltantes   |
| Payment Service      | 3006   | ⚠️ No corriendo | Requiere NATS            |
| Inventory Service    | 3006   | ⚠️ Conflicto    | Mismo puerto que Payment |
| Notification Service | 3007   | ⚠️ No corriendo | Errores TypeScript       |
| Frontend             | 5173   | ⚠️ No corriendo | No iniciado              |

---

## 🛠️ Acciones Recomendadas

### Opción 1: Usar el Monolito (Recomendado para desarrollo rápido)

El monolito en puerto 3000 tiene **todas las funcionalidades principales**:

- ✅ Autenticación con JWT
- ✅ Gestión de usuarios
- ✅ Catálogo de productos
- ✅ Procesamiento de órdenes
- ✅ Swagger documentation en `/api`

**Ventaja**: Todo funciona en un solo proceso, fácil de depurar.

### Opción 2: Arreglar Microservicios

Para levantar los microservicios independientes, necesitas:

1. **Actualizar Node.js a v22+**:

   ```bash
   nvm install 22
   nvm use 22
   ```

2. **Instalar dependencias faltantes**:

   ```bash
   pnpm add -D uuid jsdom --filter @a4co/user-service
   pnpm add -D @types/uuid @types/jsdom --filter @a4co/user-service
   ```

3. **Arreglar conflictos de puerto**:
   - Editar `apps/inventory-service/src/main.ts`
   - Cambiar `PORT` de 3006 a 3008

4. **Configurar NATS** (para Payment Service):

   ```bash
   docker run -d --name nats -p 4222:4222 nats:latest
   ```

5. **Levantar todos con Turbo**:

   ```bash
   pnpm turbo run dev --concurrency=10
   ```

---

## 📖 Guía Rápida de Uso

### Probar el Monolito

1. **Registrar un usuario**:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artesano@example.com",
    "password": "securepass123",
    "name": "Juan Artesano"
  }'
```

1. **Hacer login y obtener token**:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artesano@example.com",
    "password": "securepass123"
  }' | jq -r '.access_token')
```

1. **Crear un producto** (requiere token):

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Cerámica Artesanal",
    "description": "Pieza única hecha a mano",
    "price": 45.99,
    "stock": 10
  }'
```

1. **Listar productos**:

```bash
curl http://localhost:3000/products
```

---

## 🔍 Explorar con Swagger

La forma más fácil de explorar y probar los endpoints:

1. Abrir navegador en: **http://localhost:3000/api**
2. Explorar todos los endpoints disponibles
3. Probar directamente desde la interfaz

---

## 📞 Soporte

Si necesitas ayuda con:

- Configuración de microservicios
- Problemas de compilación
- Configuración de base de datos
- Integración de servicios externos

Consulta los logs de cada servicio o revisa la documentación en `/docs`.

---

**Estado del informe**: Actualizado el 16 de noviembre de 2025 a las 19:20
