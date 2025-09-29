# Infraestructura Simplificada - Docker Compose

Este documento explica cómo usar la infraestructura simplificada con un solo `docker-compose.yml` que levanta todos los componentes necesarios para desarrollo.

## Arquitectura

La infraestructura incluye:

- **PostgreSQL**: Base de datos principal
- **NATS**: Sistema de mensajería con JetStream
- **Redis**: Cache y almacenamiento de sesiones
- **5 Servicios Core**:
  - Auth Service (puerto 3001)
  - Product Service (puerto 3002)
  - User Service (puerto 3003)
  - Order Service (puerto 3004)
  - Payment Service (puerto 3006)

## Inicio Rápido

### 1. Levantar toda la infraestructura

```bash
docker-compose up -d
```

### 2. Verificar que todos los servicios estén corriendo

```bash
docker-compose ps
```

### 3. Ver logs de un servicio específico

```bash
docker-compose logs auth-service
docker-compose logs product-service
# etc.
```

### 4. Ver logs de todos los servicios

```bash
docker-compose logs -f
```

## Servicios y Puertos

| Servicio        | Puerto    | URL            | Descripción            |
| --------------- | --------- | -------------- | ---------------------- |
| PostgreSQL      | 5432      | localhost:5432 | Base de datos          |
| NATS            | 4222/8222 | localhost:4222 | Mensajería             |
| Redis           | 6379      | localhost:6379 | Cache                  |
| Auth Service    | 3001      | localhost:3001 | Autenticación          |
| Product Service | 3002      | localhost:3002 | Catálogo de productos  |
| User Service    | 3003      | localhost:3003 | Gestión de usuarios    |
| Order Service   | 3004      | localhost:3004 | Gestión de pedidos     |
| Payment Service | 3006      | localhost:3006 | Procesamiento de pagos |

## API Documentation

Cada servicio expone su documentación OpenAPI en:

- `http://localhost:{PUERTO}/api/docs`

## Desarrollo

### Levantar solo la base de datos y mensajería

```bash
docker-compose up postgres nats redis -d
```

### Levantar servicios individuales

```bash
# Usando pnpm scripts
pnpm run dev:auth      # Auth Service
pnpm run dev:product   # Product Service
pnpm run dev:user      # User Service
pnpm run dev:order     # Order Service
pnpm run dev:payment   # Payment Service

# O directamente con turbo
turbo run dev --filter=auth-service
```

### Reconstruir un servicio específico

```bash
docker-compose up --build auth-service
```

## Base de Datos

### Conectar a PostgreSQL

```bash
docker-compose exec postgres psql -U postgres -d a4co_platform
```

### Ver estado de la base de datos

```bash
docker-compose exec postgres pg_isready -U postgres -d a4co_platform
```

## Mensajería (NATS)

### Ver estado de NATS

```bash
curl http://localhost:8222/healthz
```

### Acceder al monitor de NATS

```
http://localhost:8222
```

## Troubleshooting

### Reiniciar todos los servicios

```bash
docker-compose down
docker-compose up -d
```

### Limpiar volúmenes (⚠️ pierde datos)

```bash
docker-compose down -v
docker-compose up -d
```

### Ver logs con timestamps

```bash
docker-compose logs --timestamps
```

### Problemas comunes

1. **Puerto ocupado**: Verifica que los puertos 3001-3006, 5432, 6379, 4222 estén libres
2. **Base de datos no inicializada**: Espera a que el healthcheck de PostgreSQL pase
3. **Servicios no conectan**: Verifica las variables de entorno en docker-compose.yml

## Configuración de Desarrollo

### Variables de entorno

Los servicios usan las siguientes variables de entorno principales:

- `DATABASE_URL`: Conexión a PostgreSQL
- `NATS_URL`: Conexión a NATS
- `REDIS_URL`: Conexión a Redis
- `JWT_SECRET`: Clave secreta para JWT (cambiar en producción)

### Healthchecks

Todos los servicios tienen healthchecks configurados para asegurar que dependencias estén listas antes de iniciar.

## Producción

Para producción, considera:

1. Usar secrets para contraseñas
2. Configurar réplicas de base de datos
3. Usar un registry de Docker privado
4. Configurar monitoring (Prometheus/Grafana)
5. Usar certificados SSL/TLS

## Comandos Útiles

```bash
# Ver estado de todos los contenedores
docker-compose ps

# Ejecutar comando en un contenedor
docker-compose exec auth-service sh

# Ver uso de recursos
docker stats

# Limpiar imágenes no utilizadas
docker image prune -f
```
