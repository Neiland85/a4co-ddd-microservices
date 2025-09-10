# 🚀 Servicios y Endpoints - A4CO Marketplace

## 📋 Resumen de Servicios

El monorepo A4CO contiene los siguientes servicios y aplicaciones:

### 🌐 Aplicaciones Frontend

| Servicio               | Puerto | Descripción                  | URL                   |
| ---------------------- | ------ | ---------------------------- | --------------------- |
| **Frontend Principal** | 3000   | Aplicación Next.js principal | http://localhost:3000 |
| **Dashboard Web**      | 3001   | Panel de administración      | http://localhost:3001 |
| **Design System**      | 6006   | Storybook con componentes    | http://localhost:6006 |

### ⚙️ Microservicios Backend

| Servicio                 | Puerto Esperado | Descripción                  |
| ------------------------ | --------------- | ---------------------------- |
| **admin-service**        | 4001            | Gestión administrativa       |
| **analytics-service**    | 4002            | Análisis y métricas          |
| **artisan-service**      | 4003            | Gestión de artesanos         |
| **auth-service**         | 4004            | Autenticación y autorización |
| **chat-service**         | 4005            | Mensajería en tiempo real    |
| **cms-service**          | 4006            | Gestión de contenido         |
| **event-service**        | 4007            | Gestión de eventos           |
| **geo-service**          | 4008            | Servicios de geolocalización |
| **inventory-service**    | 4009            | Control de inventario        |
| **loyalty-service**      | 4010            | Programa de fidelización     |
| **notification-service** | 4011            | Notificaciones               |
| **order-service**        | 4012            | Gestión de pedidos           |
| **payment-service**      | 4013            | Procesamiento de pagos       |
| **product-service**      | 4014            | Catálogo de productos        |
| **user-service**         | 4015            | Gestión de usuarios          |

### 🐳 Infraestructura

| Servicio         | Puerto | Descripción                      |
| ---------------- | ------ | -------------------------------- |
| **PostgreSQL**   | 5432   | Base de datos principal          |
| **Redis**        | 6379   | Cache y sesiones                 |
| **NATS**         | 4222   | Message broker                   |
| **NATS Monitor** | 8222   | Monitor UI de NATS               |
| **Jaeger**       | 16686  | Tracing UI (si está configurado) |
| **Prometheus**   | 9090   | Métricas (si está configurado)   |

## 🚀 Comandos de Inicio

### Opción 1: Iniciar todos los servicios con Turbo


```bash
pnpm dev

```


### Opción 2: Usar el script personalizado


```bash
./scripts/start-dev-services.sh

```


### Opción 3: Iniciar servicios específicos

#### Solo Frontend


```bash
pnpm dev:frontend

```


#### Solo Backend


```bash
pnpm dev:backend

```


#### Solo Storybook


```bash
pnpm storybook:dev

```


### Opción 4: Docker Compose (requiere Docker)


```bash
docker compose -f docker-compose.messaging.yml up

```


## 📍 Endpoints Principales

### Frontend Principal (http://localhost:3000)

- `/` - Página de inicio
- `/products` - Catálogo de productos
- `/artisans` - Directorio de artesanos
- `/cart` - Carrito de compras
- `/checkout` - Proceso de pago

### Dashboard (http://localhost:3001)

- `/` - Dashboard principal
- `/products` - Gestión de productos
- `/orders` - Gestión de pedidos
- `/users` - Gestión de usuarios
- `/analytics` - Análisis y reportes

### API Gateway (cuando esté configurado)

- `/api/v1/products` - API de productos
- `/api/v1/users` - API de usuarios
- `/api/v1/orders` - API de pedidos
- `/api/v1/auth` - API de autenticación

### Documentación y Herramientas

- `http://localhost:6006` - Storybook (Sistema de Diseño)
- `http://localhost:8222` - NATS Monitor
- `http://localhost:16686` - Jaeger UI (si está activo)
- `http://localhost:9090` - Prometheus (si está activo)

## 🔍 Verificación de Estado

### Verificar servicios activos


```bash
# Ver todos los procesos Node.js
ps aux | grep node

# Verificar puertos en uso
netstat -tulpn | grep LISTEN
# o
lsof -i -P -n | grep LISTEN

```


### Ver logs en tiempo real


```bash
# Si usaste el script start-all-services.sh
tail -f logs/*/[servicio].log

# Si usaste pnpm dev
# Los logs aparecen en la terminal

```


## 🛠️ Solución de Problemas

### Puerto ya en uso


```bash
# Encontrar proceso usando el puerto
lsof -i :3000
# Matar el proceso
kill -9 [PID]

```


### Limpiar y reinstalar


```bash
pnpm clean:all
pnpm install
pnpm build

```


### Reiniciar todo


```bash
# Detener todos los servicios (Ctrl+C)
# Limpiar
pnpm clean
# Iniciar de nuevo
pnpm dev

```


## 📝 Notas Importantes

1. **Dependencias**: Asegúrate de tener instalado:
   - Node.js >= 18.0.0
   - pnpm >= 8.0.0
   - Docker (opcional, para infraestructura)

2. **Primera ejecución**: La primera vez puede tardar más mientras se instalan dependencias y se compilan los proyectos.

3. **Desarrollo**: Los servicios se ejecutan en modo watch, los cambios se reflejan automáticamente.

4. **Logs**: Revisa los logs si algún servicio no se inicia correctamente.

5. **Recursos**: El monorepo completo consume bastantes recursos. Si tienes problemas de rendimiento, considera levantar solo los servicios que necesites.
