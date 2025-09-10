# 🚀 GUÍA COMPLETA DE LEVANTAMIENTO DEL PROYECTO A4CO

**Proyecto:** A4CO DDD Microservices - Mercado Local de Jaén
**Fecha:** 16 de enero de 2025
**Stack:** NestJS + Next.js + PostgreSQL + Redis + NATS

---

## 📋 REQUISITOS PREVIOS

### Software Necesario

- **Node.js** v18+ (verificar con `node --version`)
- **pnpm** v8+ (verificar con `pnpm --version`)
- **Docker** y **Docker Compose** (verificar con `docker --version` y `docker-compose --version`)
- **Git** (verificar con `git --version`)

### Instalación de pnpm (si no está instalado)


```bash
npm install -g pnpm

```


---

## 🛠️ INSTALACIÓN INICIAL

### 1. Clonar el repositorio (si es necesario)


```bash
git clone https://github.com/Neiland85/a4co-ddd-microservices.git
cd a4co-ddd-microservices

```


### 2. Instalar todas las dependencias


```bash
pnpm install

```


Este comando instalará todas las dependencias del monorepo, incluyendo:

- Dependencias del root
- Dependencias de todos los microservicios en `/apps`
- Dependencias de los paquetes compartidos en `/packages`

---

## 🐳 LEVANTAMIENTO CON DOCKER (RECOMENDADO)

### Opción 1: Levantar todo el ecosistema completo


```bash
# Levantar todos los servicios con Docker Compose
pnpm run docker:up

# O directamente
docker-compose -f docker-compose.dev.yml up -d

```


Este comando levantará:

- **Traefik** (Reverse Proxy) - http://localhost:8080 (Dashboard)
- **PostgreSQL** - Puerto 5432
- **Redis** - Puerto 6379
- **NATS** (Message Broker) - Puerto 4222
- **API Gateway** - http://api.localhost
- **Microservicios** (product-service, user-service, etc.)
- **Frontend Apps**:
  - Web Principal - http://localhost
  - Dashboard - http://dashboard.localhost
  - Design System - http://design.localhost:6006

### Ver logs de los servicios


```bash
pnpm run docker:logs

# O para un servicio específico
docker-compose -f docker-compose.dev.yml logs -f [nombre-servicio]

```


### Detener todos los servicios


```bash
pnpm run docker:down

```


---

## 💻 LEVANTAMIENTO LOCAL (SIN DOCKER)

### 1. Levantar servicios de infraestructura con Docker


```bash
# Crear red Docker si no existe
docker network create a4co-network 2>/dev/null || true

# PostgreSQL
docker run -d \
  --name a4co-postgres \
  --network a4co-network \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=a4co \
  -p 5432:5432 \
  postgres:16-alpine

# Redis
docker run -d \
  --name a4co-redis \
  --network a4co-network \
  -p 6379:6379 \
  redis:7.2-alpine

# NATS
docker run -d \
  --name a4co-nats \
  --network a4co-network \
  -p 4222:4222 \
  -p 8222:8222 \
  nats:2.10-alpine --jetstream

```


### 2. Configurar bases de datos (si es la primera vez)


```bash
# Generar Prisma Clients
pnpm run db:generate

# Ejecutar migraciones
pnpm run db:migrate

```


### 3. Levantar aplicaciones específicas

#### Dashboard del Mercado de Jaén


```bash
# Usando el script específico
./start-dashboard.sh

# O manualmente
cd apps/dashboard-web
pnpm dev --port 3001

```


Accesible en: http://localhost:3001

#### Frontend principal (a-head)


```bash
cd apps/web/v0dev/a-head
pnpm dev

```


Accesible en: http://localhost:3000

#### Design System (Storybook)


```bash
pnpm run storybook:dev

```


Accesible en: http://localhost:6006

#### Todos los servicios backend


```bash
pnpm run dev:backend

```


#### Todas las aplicaciones frontend


```bash
pnpm run dev:frontend

```


#### Todo el proyecto (frontend + backend)


```bash
pnpm run dev

```


---

## 🔧 COMANDOS ÚTILES

### Gestión del proyecto


```bash
# Limpiar cache y node_modules
pnpm run clean:all

# Reinstalar todo desde cero
pnpm run reinstall

# Formatear código
pnpm run format

# Ejecutar linters
pnpm run lint
pnpm run lint:fix

# Ejecutar tests
pnpm run test
pnpm run test:watch
pnpm run test:coverage

```


### Comandos de base de datos


```bash
# Generar cliente Prisma
pnpm run db:generate

# Push de esquema a la BD
pnpm run db:push

# Ejecutar migraciones
pnpm run db:migrate

```


---

## 📍 URLS Y ENDPOINTS PRINCIPALES

### Aplicaciones Web

- **Dashboard Mercado Jaén**: http://localhost:3001
- **Web Principal**: http://localhost:3000
- **Design System**: http://localhost:6006
- **Página de Testing**: http://localhost:3001/test-integrations

### APIs Disponibles (via Dashboard)

- **Sales Opportunities**: http://localhost:3001/api/sales-opportunities
- **Products**: http://localhost:3001/api/products
- **Artisans**: http://localhost:3001/api/artisans

### Servicios de Infraestructura

- **Traefik Dashboard**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **NATS**: localhost:4222
- **NATS Monitor**: http://localhost:8222

### Con Docker y Traefik

- **API Gateway**: http://api.localhost
- **Dashboard**: http://dashboard.localhost
- **Design System**: http://design.localhost

---

## 🐞 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: Puerto ya en uso


```bash
# Verificar qué está usando el puerto
lsof -i :PUERTO
# O en Linux
sudo netstat -tlnp | grep PUERTO

# Matar el proceso
kill -9 PID

```


### Error: No se puede conectar a PostgreSQL


```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Ver logs
docker logs a4co-postgres

# Reiniciar el contenedor
docker restart a4co-postgres

```


### Error: Dependencias no se instalan correctamente


```bash
# Limpiar cache de pnpm
pnpm store prune

# Reinstalar todo
pnpm run reinstall

```


### Error: Cambios no se reflejan (Hot Reload)


```bash
# Verificar que el sync-service esté corriendo (solo con Docker)
docker ps | grep sync

# Para desarrollo local, asegurarse de que nodemon esté configurado

```


---

## 📊 MONITOREO Y LOGS

### Ver logs en tiempo real


```bash
# Con Docker Compose
pnpm run docker:logs

# Para un servicio específico local
cd apps/[servicio]
pnpm dev

```


### Verificar estado de los servicios


```bash
# Ver contenedores Docker
docker ps

# Ver uso de recursos
docker stats

# Verificar conectividad de Redis
redis-cli ping

# Verificar NATS
curl http://localhost:8222/varz

```


---

## 🚦 VERIFICACIÓN DE QUE TODO FUNCIONA

1. **Dashboard debe mostrar**:
   - Página de inicio con el tema del Mercado de Jaén
   - Navegación funcional
   - Página de test en `/test-integrations`

2. **APIs deben responder**:

   ```bash
   # Verificar API de productos
   curl http://localhost:3001/api/products

   # Verificar API de artesanos
   curl http://localhost:3001/api/artisans
   ```

3. **Servicios de infraestructura**:

   ```bash
   # PostgreSQL
   docker exec a4co-postgres pg_isready

   # Redis
   docker exec a4co-redis redis-cli ping
   ```

---

## 📝 NOTAS ADICIONALES

- El proyecto usa **pnpm workspaces** para gestionar el monorepo
- Cada microservicio tiene su propia configuración en `/apps/[servicio]`
- Los componentes compartidos están en `/packages/shared-utils`
- El Design System está en `/packages/design-system`
- La configuración de Turbo permite ejecutar comandos en paralelo para mejor rendimiento

Para más información, consulta la documentación en el directorio `/docs`.
