# 🚀 GUÍA DE INICIO DE DESARROLLO

**Fecha:** $(date +%Y-%m-%d)
**Proyecto:** a4co-ddd-microservices

---

## ✅ Estado Actual

### Servicios de Infraestructura Corriendo

- ✅ PostgreSQL (puerto 5432)
- ✅ Redis (puerto 6379)
- ✅ NATS (puerto 4222)

### Packages Compilados

- ✅ @a4co/observability
- ✅ @a4co/shared-utils
- ✅ @a4co/design-system

---

## 🎯 Iniciar Desarrollo

### Opción 1: Todos los Servicios en una Terminal

```bash
pnpm dev
```

### Opción 2: Servicios Individuales (Recomendado)

Abre múltiples terminales:

**Terminal 1 - Auth Service:**

```bash
pnpm dev:auth
# Servicio corriendo en http://localhost:3001
# Swagger: http://localhost:3001/api/docs
```

**Terminal 2 - User Service:**

```bash
pnpm dev:user
# Servicio corriendo en http://localhost:3003
# Swagger: http://localhost:3003/api
```

**Terminal 3 - Product Service:**

```bash
pnpm dev:product
# Servicio corriendo en http://localhost:3002
# Swagger: http://localhost:3002/api
```

**Terminal 4 - Order Service:**

```bash
pnpm dev:order
# Servicio corriendo en http://localhost:3004
# Swagger: http://localhost:3004/api
```

**Terminal 5 - Payment Service:**

```bash
pnpm dev:payment
# Servicio corriendo en http://localhost:3006
```

**Terminal 6 - Frontend:**

```bash
cd apps/frontend
pnpm dev
# Frontend corriendo en http://localhost:5173
```

---

## 🔗 URLs de Desarrollo

### Microservicios Backend

| Servicio | URL                   | Documentación                  |
| -------- | --------------------- | ------------------------------ |
| Auth     | http://localhost:3001 | http://localhost:3001/api/docs |
| User     | http://localhost:3003 | http://localhost:3003/api      |
| Product  | http://localhost:3002 | http://localhost:3002/api      |
| Order    | http://localhost:3004 | http://localhost:3004/api      |
| Payment  | http://localhost:3006 | http://localhost:3006/api      |

### Frontend

| Aplicación      | URL                   |
| --------------- | --------------------- |
| Frontend (Vite) | http://localhost:5173 |

### Base de Datos

```bash
# Conectar a PostgreSQL
psql postgresql://postgres:postgres@localhost:5432/a4co_db

# Ver bases de datos
\l

# Ver tablas de un schema
\dt
```

---

## 🧪 Probar los Servicios

### Health Check

```bash
# Auth Service
curl http://localhost:3001/api/v1/health

# User Service
curl http://localhost:3003/api/health

# Product Service
curl http://localhost:3002/api/health
```

### Crear un Usuario (Auth Service)

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@a4co.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@a4co.com",
    "password": "password123"
  }'
```

---

## 🛠️ Comandos Útiles

### Desenvolvimiento

```bash
# Build todos los servicios
pnpm build

# Build servicio específico
pnpm --filter @a4co/auth-service build

# Tests
pnpm test

# Lint
pnpm lint

# Type check
pnpm type-check
```

### Base de Datos

```bash
# Generar schemas Prisma
pnpm db:generate

# Push schema a BD
pnpm db:push

# Crear migración
pnpm db:migrate

# Reset base de datos
pnpm db:reset
```

### Docker

```bash
# Ver contenedores corriendo
docker ps

# Ver logs
docker logs a4co-postgres -f

# Parar servicios
docker compose -f compose.dev.yaml down

# Reiniciar servicios
docker compose -f compose.dev.yaml restart
```

---

## 📝 Estructura del Proyecto

```
a4co-ddd-microservices/
├── apps/
│   ├── auth-service/      # Autenticación (puerto 3001)
│   ├── user-service/      # Gestión de usuarios (puerto 3003)
│   ├── product-service/   # Catálogo de productos (puerto 3002)
│   ├── order-service/     # Pedidos (puerto 3004)
│   ├── payment-service/   # Pagos (puerto 3006)
│   ├── frontend/          # Frontend React (puerto 5173)
│   └── ...
├── packages/
│   ├── observability/     # OpenTelemetry, logging
│   ├── shared-utils/      # Utilidades compartidas
│   └── design-system/     # Componentes UI
└── compose.dev.yaml       # Docker Compose para desarrollo
```

---

## 🐛 Troubleshooting

### Puerto ya en uso

```bash
# Ver qué proceso usa el puerto
lsof -i :3001

# Matar el proceso
kill -9 <PID>
```

### Error de conexión a PostgreSQL

```bash
# Verificar que contenedor esté corriendo
docker ps | grep postgres

# Ver logs
docker logs a4co-postgres

# Reiniciar
docker compose -f compose.dev.yaml restart postgres
```

### Dependencias desactualizadas

```bash
# Limpiar e instalar
pnpm clean:all
pnpm install

# Compilar packages
pnpm --filter @a4co/observability build
pnpm --filter @a4co/shared-utils build
pnpm --filter @a4co/design-system build
```

---

## 🎯 Próximos Pasos de Desarrollo

1. **Implementar endpoints en microservicios**
2. **Conectar frontend con backend**
3. **Agregar tests**
4. **Configurar observability**
5. **Implementar feature flags**

---

## 📞 Recursos

- **Documentación:** Ver `INFORME_ESTADO_MONOREPO.md`
- **Estado:** Ver `ESTADO_FINAL_SESION.md`
- **GitHub:** https://github.com/Neiland85/a4co-ddd-microservices

---

**¡Feliz desarrollo!** 🚀

---

_Generado automáticamente al iniciar desarrollo_
