# ✅ CHECKLIST EJECUTABLE DESDE VS CODE
## A4CO DDD Microservices - Guía de Ejecución Práctica

**Para**: Developers trabajando en Visual Studio Code  
**Objetivo**: Acciones inmediatas para restaurar y validar el proyecto  
**Basado en**: Fase 0 del Plan de Acción

---

## 🚀 SETUP INICIAL (Primera Vez)

### 1. Verificar Prerrequisitos

```bash
# Node.js 18+
node --version
# Debe mostrar: v18.x.x o v20.x.x

# pnpm
pnpm --version
# Debe mostrar: 10.14.0 o superior

# Docker (para tests integration)
docker --version
# Docker version 20.10+ recomendado

# PostgreSQL (local o Docker)
docker ps | grep postgres
# O: pg_isready si tienes Postgres nativo
```

**Si falta pnpm**:
```bash
npm install -g pnpm@10.14.0
```

---

### 2. Clonar y Configurar Proyecto

```bash
# Ya clonado, pero si necesitas:
# git clone https://github.com/Neiland85/a4co-ddd-microservices.git
cd a4co-ddd-microservices

# Instalar dependencias
pnpm install

# Si hay errores de prisma version:
pnpm add -w prisma@6.19.0 @prisma/client@6.19.0
pnpm update prisma @prisma/client -r
```

---

### 3. Configurar Variables de Entorno

```bash
# Copiar ejemplo
cp .env.example .env.local

# Editar .env.local con tus valores
code .env.local
```

**Variables mínimas necesarias**:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/a4co_dev"

# Auth
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION="15m"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
REFRESH_TOKEN_EXPIRATION="7d"

# Services (para desarrollo local)
ORDER_SERVICE_URL="http://localhost:3004"
PAYMENT_SERVICE_URL="http://localhost:3003"
INVENTORY_SERVICE_URL="http://localhost:3002"
USER_SERVICE_URL="http://localhost:3001"

# Gateway
GATEWAY_PORT="4000"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

---

### 4. Levantar Base de Datos (Docker)

```bash
# Levantar PostgreSQL + Redis
docker-compose up -d postgres redis

# Verificar que estén corriendo
docker ps | grep -E "postgres|redis"

# Ver logs si hay problemas
docker-compose logs postgres
```

---

### 5. Generar Clientes Prisma

```bash
# Order Service
pnpm --filter @a4co/order-service prisma generate
pnpm --filter @a4co/order-service prisma migrate dev --name init

# Payment Service
pnpm --filter @a4co/payment-service prisma generate
pnpm --filter @a4co/payment-service prisma migrate dev --name init

# Inventory Service
pnpm --filter @a4co/inventory-service prisma generate
pnpm --filter @a4co/inventory-service prisma migrate dev --name init

# Verificar que se generaron correctamente
ls apps/order-service/node_modules/.prisma/client
```

---

## 🔧 FIX CRÍTICO #1: Build Roto de dashboard-client

### Problema Identificado
```
Error: Tailwind CSS class `ring-border/50` does not exist
```

### Solución Paso a Paso

#### Opción A: Agregar color faltante al preset (RÁPIDO)

1. **Abrir archivo**:
```bash
code packages/design-system/tailwind.preset.js
```

2. **Buscar sección `colors:`** (línea ~13) y **AGREGAR**:
```javascript
colors: {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  // ... otros colores existentes
  
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  
  // ✅ AGREGAR ESTA LÍNEA:
  'ring-border': 'var(--border)', // Fix para compatibilidad
},
```

3. **Guardar y validar**:
```bash
pnpm --filter dashboard-client build
```

#### Opción B: Reemplazar uso de ring-border (MEJOR, más limpio)

1. **Buscar usos**:
```bash
cd apps/dashboard-client
grep -r "ring-border" . --include="*.tsx" --include="*.ts" --include="*.jsx"
```

2. **Reemplazar manualmente** o con sed:
```bash
# Reemplazar ring-border → border
find app/ -name "*.tsx" -exec sed -i 's/ring-border/border/g' {} \;

# O reemplazar ring-border/50 → border/50 específicamente
grep -rl "ring-border/50" app/ | xargs sed -i 's/ring-border\/50/border\/50/g'
```

3. **Validar**:
```bash
pnpm build
```

### Verificación Final

```bash
# Build debe completar sin errores
pnpm --filter dashboard-client build

# Levantar en dev
pnpm --filter dashboard-client dev

# Abrir en navegador: http://localhost:3001
# Verificar que carga sin errores de Tailwind
```

---

## 🔧 FIX CRÍTICO #2: CI/CD Pipeline

### Problema
Pipeline tolera errores con `|| echo "warning"`

### Solución

1. **Abrir workflow**:
```bash
code .github/workflows/ci.yml
```

2. **ELIMINAR todas las líneas** con `|| echo`:
```yaml
# ❌ BUSCAR Y ELIMINAR:
|| echo "Lint warning"
|| echo "Build warnings"
|| echo "TS warnings"

# ✅ DEJAR SOLO:
pnpm run lint
pnpm run build
pnpm run type-check
```

3. **AGREGAR validación de builds** (después del build step):
```yaml
- name: Validate builds
  run: |
    # Verificar que se generaron los builds
    test -d apps/dashboard-client/.next || exit 1
    test -d apps/order-service/dist || exit 1
    test -d apps/payment-service/dist || exit 1
    echo "✅ All builds validated"

- name: Run unit tests (critical services)
  run: |
    pnpm --filter @a4co/order-service test --passWithNoTests
    pnpm --filter @a4co/payment-service test --passWithNoTests
    pnpm --filter @a4co/inventory-service test --passWithNoTests
```

4. **Commit y push**:
```bash
git add .github/workflows/ci.yml
git commit -m "ci: remove error tolerance from pipeline"
git push
```

5. **Verificar en GitHub Actions** que el pipeline:
   - Falla si build falla (no "warnings")
   - Ejecuta tests reales

---

## 🏃 LEVANTAR SERVICIOS (Desarrollo Local)

### Opción 1: Todos los Servicios Simultáneamente

```bash
# En terminal integrada de VS Code
pnpm run dev:all

# Esto levanta:
# - order-service (port 3004)
# - payment-service (port 3003)
# - inventory-service (port 3002)
# - user-service (port 3001)
# - dashboard-web (port 3001) - si no hay conflicto
```

**Verificar**:
```bash
# En otra terminal:
curl http://localhost:3004/health  # order-service
curl http://localhost:3003/health  # payment-service
curl http://localhost:3002/health  # inventory-service
```

---

### Opción 2: Servicios Individuales (Control Fino)

#### Terminal 1: Order Service
```bash
cd apps/order-service
pnpm run start:dev

# O con filtro desde raíz:
pnpm --filter @a4co/order-service start:dev
```

#### Terminal 2: Payment Service
```bash
pnpm --filter @a4co/payment-service start:dev
```

#### Terminal 3: Inventory Service
```bash
pnpm --filter @a4co/inventory-service start:dev
```

#### Terminal 4: Dashboard Frontend
```bash
pnpm --filter dashboard-client dev
# Abre: http://localhost:3001
```

---

### Opción 3: Con Docker Compose (Más Cercano a Prod)

```bash
# Levantar todos los servicios + DB + Redis
docker-compose up

# O en modo detached:
docker-compose up -d

# Ver logs:
docker-compose logs -f order-service

# Detener:
docker-compose down
```

---

## 🧪 EJECUTAR TESTS

### Tests Unitarios

```bash
# Todos los tests
pnpm test

# Solo order-service
pnpm --filter @a4co/order-service test

# Con coverage
pnpm --filter @a4co/order-service test --coverage

# Watch mode (re-ejecuta en cambios)
pnpm --filter @a4co/order-service test --watch
```

### Tests de Integración

```bash
# Requiere Docker para Testcontainers
docker ps  # Verificar que Docker está corriendo

pnpm --filter @a4co/order-service test:integration
```

### Tests E2E (cuando estén implementados)

```bash
# Levanta todos los servicios primero
pnpm run dev:all

# En otra terminal:
pnpm run test:e2e
```

---

## 🔍 VALIDAR ARQUITECTURA DDD

### Verificar Estructura de un Servicio

```bash
# Ejemplo: order-service
tree apps/order-service/src -L 2

# Debe mostrar:
# src/
# ├── domain/
# │   ├── aggregates/
# │   ├── events/
# │   ├── repositories/
# │   └── value-objects/
# ├── application/
# │   ├── commands/
# │   ├── use-cases/
# │   └── sagas/
# ├── infrastructure/
# │   ├── repositories/
# │   └── prisma/
# └── presentation/
#     └── controllers/
```

### Verificar Domain Events

```bash
# Ver eventos definidos
code apps/order-service/src/domain/events/index.ts

# Verificar versionado
grep -r "ORDER_.*_V[0-9]" apps/order-service/src/domain/events/
# Debe mostrar: ORDER_CREATED_V1, ORDER_SHIPPED_V2, etc
```

### Verificar Aggregates

```bash
# Abrir aggregate principal
code apps/order-service/src/domain/aggregates/order.aggregate.ts

# Checklist mental:
# ✅ Extiende AggregateRoot
# ✅ Emite DomainEvents
# ✅ Encapsula lógica de negocio
# ✅ No depende de infrastructure
```

---

## 🐛 DEBUGGING

### Ver Logs de un Servicio

```bash
# Con pnpm dev:
# Los logs aparecen en consola directamente

# Con Docker:
docker-compose logs -f order-service

# Filtrar errores:
docker-compose logs order-service | grep ERROR
```

### Conectar Debugger de VS Code

1. **Crear `.vscode/launch.json`**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Order Service",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/apps/order-service",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

2. **Poner breakpoints** en archivos `.ts`

3. **Presionar F5** para iniciar debugger

### Inspeccionar Base de Datos

```bash
# Prisma Studio (GUI)
pnpm --filter @a4co/order-service prisma studio
# Abre en http://localhost:5555

# O con psql:
docker exec -it a4co-postgres psql -U postgres -d a4co_dev
# Luego: SELECT * FROM orders LIMIT 10;
```

---

## 📊 MÉTRICAS Y OBSERVABILIDAD

### Ver Métricas de Prometheus

```bash
# Order service expone métricas en:
curl http://localhost:3004/orders/metrics

# Ejemplo de output:
# saga_execution_total{status="success"} 42
# saga_execution_total{status="failed"} 3
```

### Ver Traces (OpenTelemetry)

```bash
# Si Jaeger está configurado:
# Abrir: http://localhost:16686

# Ver traces de un request específico
# Buscar por service: "order-service"
# Buscar por operation: "POST /orders"
```

---

## 🔐 VERIFICAR SEGURIDAD

### Buscar Secrets Hardcoded

```bash
# Buscar API keys, passwords, tokens
grep -r "sk_test" apps/ --include="*.ts" --include="*.js"
grep -r "password.*=" apps/ --include="*.ts" | grep -v ".env"
grep -r "secret.*=" apps/ --include="*.ts" | grep -v ".env"

# NO debería encontrar nada fuera de .env.example
```

### Verificar .env no está en Git

```bash
git status --ignored | grep ".env"
# Solo debe aparecer .env.example, NO .env o .env.local
```

### Scan de Vulnerabilidades

```bash
# pnpm audit
pnpm audit

# Vulnerabilidades high/critical
pnpm audit --audit-level high

# Fix automático (con cuidado)
pnpm audit --fix
```

---

## 📝 CHECKLIST DE VALIDACIÓN DIARIA

Antes de hacer commit, ejecutar:

```bash
# 1. Linting
pnpm run lint
# ✅ 0 errors

# 2. Type checking
pnpm run type-check
# ✅ 0 TypeScript errors

# 3. Build
pnpm run build
# ✅ Todos los servicios compilan

# 4. Tests unitarios
pnpm test
# ✅ Tests pasan

# 5. Verificar que no hay secretos
grep -r "sk_test" apps/ --include="*.ts"
# ✅ No resultados (o solo en .env.example)
```

---

## 🆘 TROUBLESHOOTING COMÚN

### "Module not found" al importar

```bash
# Limpiar y reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Regenerar Prisma clients
pnpm --filter @a4co/order-service prisma generate
```

### "Port already in use"

```bash
# Encontrar proceso usando puerto 3004:
lsof -i :3004

# Matar proceso:
kill -9 <PID>

# O cambiar puerto en .env
```

### Build de dashboard-client falla

```bash
# Limpiar cache de Next.js
rm -rf apps/dashboard-client/.next
rm -rf apps/dashboard-client/out

# Rebuild
pnpm --filter dashboard-client build
```

### Prisma errors

```bash
# Regenerar client
pnpm --filter @a4co/order-service prisma generate

# Reset database (CUIDADO: borra datos)
pnpm --filter @a4co/order-service prisma migrate reset

# Ver estado de migraciones
pnpm --filter @a4co/order-service prisma migrate status
```

---

## 🎯 PRÓXIMOS PASOS

Después de completar este checklist:

1. ✅ Lee `PLAN_ACCION_EJECUTABLE.md` - Fase 1
2. ✅ Comienza implementación del API Gateway
3. ✅ Configura Event Bus (NATS)
4. ✅ Crea tests faltantes

---

**Última Actualización**: 7 Diciembre 2025  
**Mantenido por**: Equipo A4CO DevOps
