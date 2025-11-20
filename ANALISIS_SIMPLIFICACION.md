# ANÁLISIS DE SIMPLIFICACIÓN - Portal Artesanos Jaén/Andalucía

**Fecha:** 8 Noviembre 2025
**Contexto:** Portal para anunciar negocios artesanos de Jaén y Andalucía

---

## PROBLEMA ACTUAL

El proyecto está **sobredimensionado** para las necesidades reales de un portal de artesanos:

### Herramientas Innecesarias Actuales

1. ❌ **Jaeger** - Sistema de tracing distribuido (overkill)
2. ❌ **OpenTelemetry** completo - Observabilidad enterprise-grade
3. ❌ **Prometheus + Grafana** - Métricas avanzadas
4. ⚠️ **NATS** - Message broker (puede no ser necesario inicialmente)
5. ❌ **Patrón Saga** - Transacciones distribuidas complejas
6. ❌ **Event Sourcing** - Complejidad innecesaria

### Servicios Innecesarios

1. ❌ **admin-service** - Puede ser frontend con roles
2. ❌ **analytics-service** - Google Analytics es suficiente
3. ❌ **cms-service** - No necesario para MVP
4. ❌ **event-service** - Fuera de alcance
5. ⚠️ **chat-service** - Puede esperar (v2)
6. ⚠️ **loyalty-service** - Nice to have (v2)

---

## LO QUE REALMENTE NECESITAS

### CORE - Servicios Esenciales (MVP)

#### 1. **artisan-service** 🎯 CRÍTICO

```
Estado actual: ❌ VACÍO (0%)
Prioridad: MÁXIMA
Para qué: Perfiles de artesanos (corazón del negocio)
Funcionalidades:
  - Registro de artesanos
  - Perfil completo (nombre, especialidad, ubicación)
  - Galería de productos/trabajos
  - Información de contacto
  - Horarios y disponibilidad
  - Rating/reviews
Estimado: 40-50 horas
```

#### 2. **product-service** ✅

```
Estado actual: ✅ 85% completo
Para qué: Catálogo de productos artesanos
Funcionalidades actuales:
  - Catálogo de productos
  - Categorías (cerámica, textil, cuero, etc.)
  - Búsqueda y filtros
Falta: Integrar con artisan-service
Estimado: 5-10 horas (integración)
```

#### 3. **geo-service** ⚠️

```
Estado actual: ⚠️ 30% (solo schema)
Para qué: Filtrar por ubicación (Jaén, provincias Andalucía)
Funcionalidades:
  - Provincias de Andalucía
  - Municipios de Jaén
  - Búsqueda por proximidad
  - Mapa de artesanos
Estimado: 20-25 horas
```

#### 4. **auth-service** ✅

```
Estado actual: ✅ 95% completo
Para qué: Autenticación de usuarios y artesanos
OK - Mantener
```

#### 5. **user-service** ✅

```
Estado actual: ✅ 90% completo
Para qué: Perfiles de usuarios compradores
OK - Mantener
```

### COMPLEMENTARIOS - Si hay E-commerce

#### 6. **order-service** ✅ (solo si vendes online)

```
Estado actual: ✅ 88% completo
Para qué: Gestión de pedidos
Decisión: ¿Quieres vender online o solo mostrar catálogo?
```

#### 7. **payment-service** ✅ (solo si vendes online)

```
Estado actual: ✅ 90% completo
Para qué: Procesar pagos con Stripe
Decisión: ¿Ventas online o contacto directo?
```

#### 8. **inventory-service** ⚠️ (opcional)

```
Estado actual: ✅ 80% completo
Para qué: Control de stock
Decisión: ¿Los artesanos necesitan control de inventario?
```

### OPCIONALES - Versión 2

#### 9. **notification-service** ⚠️

```
Estado actual: ✅ 75% completo
Para qué: Notificar a artesanos de pedidos/contactos
Decisión: Puede ser email simple inicialmente
```

#### 10. **transportista-service** ⚠️

```
Estado actual: ✅ 70% completo
Para qué: Gestión de envíos
Decisión: ¿Necesario desde día 1?
```

### INNECESARIOS - Eliminar/No Desarrollar

- ❌ **admin-service** → Usar frontend con roles admin
- ❌ **analytics-service** → Usar Google Analytics
- ❌ **cms-service** → No necesario
- ❌ **event-service** → Fuera de alcance
- ❌ **chat-service** → v2 (usar WhatsApp/email inicialmente)
- ❌ **loyalty-service** → v2 (programa de fidelización)

---

## SIMPLIFICACIÓN DE INFRAESTRUCTURA

### ELIMINAR/SIMPLIFICAR

#### 1. Observabilidad Enterprise → Logs Simples

```diff
- Jaeger (distributed tracing)
- OpenTelemetry completo
- Prometheus + Grafana
+ Console logs + Winston/Pino simple
+ Health checks básicos
+ Error tracking con Sentry (opcional)
```

#### 2. Message Queue → Requests HTTP Directos

```diff
- NATS message broker
+ HTTP REST calls directos
+ Webhooks para eventos críticos
```

#### 3. Patrón Saga → Transacciones Simples

```diff
- Saga pattern con compensaciones
+ Transacciones de base de datos simples
+ Rollback manual si falla
```

#### 4. Event Sourcing → CRUD Normal

```diff
- Event sourcing completo
+ CRUD tradicional
+ Auditoría simple si necesario
```

### MANTENER

- ✅ **PostgreSQL** - Base de datos relacional
- ✅ **Docker** - Contenedores
- ✅ **Prisma ORM** - Gestión de BD
- ✅ **NestJS** - Framework backend
- ✅ **React** - Frontend
- ⚠️ **Redis** - Cache (opcional, pero útil)

---

## ARQUITECTURA SIMPLIFICADA PROPUESTA

### Opción A: MONOLITO MODULAR (Recomendado para MVP)

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
└──────────────┬──────────────────────┘
               │ HTTP REST
┌──────────────┴──────────────────────┐
│     API Gateway (Express/Fastify)   │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│    Backend NestJS Monolito          │
│  ┌─────────────────────────────┐   │
│  │ • Auth Module               │   │
│  │ • Artisan Module (CORE)     │   │
│  │ • Product Module            │   │
│  │ • Geo Module                │   │
│  │ • User Module               │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│        PostgreSQL                   │
└─────────────────────────────────────┘
```

**Ventajas:**

- Desarrollo más rápido (40-60 horas vs 770 horas)
- Más fácil de debugear
- Menos complejidad operacional
- Suficiente para 90% de casos de uso

**Cuándo migrar a microservicios:**

- Cuando tengas >10,000 artesanos
- Cuando necesites escalar partes específicas
- Cuando tengas equipo >5 desarrolladores

### Opción B: MICROSERVICIOS SIMPLIFICADOS (Actual pero limpio)

```
Frontend → Gateway → [Auth, Artisan*, Product, Geo, User] → PostgreSQL
                       (*CORE - debe implementarse YA)
```

**Solo 5-6 servicios esenciales:**

1. auth-service ✅
2. **artisan-service** ❌ (VACÍO - URGENTE)
3. product-service ✅
4. geo-service ⚠️
5. user-service ✅
6. gateway ❌ (sin implementar)

---

## MONITOREO SIMPLIFICADO

### En lugar de Jaeger + OpenTelemetry + Prometheus + Grafana

#### Opción 1: GRATUITA (MVP)

```
- Console.log estructurado
- Winston/Pino para logs a archivo
- Health checks (/health endpoints)
- PM2 para restart automático
- Uptime monitoring: UptimeRobot (gratis)
```

#### Opción 2: BÁSICA (~$20/mes)

```
- Sentry.io para error tracking (10k eventos/mes gratis)
- LogRocket para session replay
- Google Analytics para métricas usuario
- Health checks básicos
```

#### Opción 3: PROFESIONAL (~$50/mes)

```
- Sentry Pro
- DataDog básico (APM simple)
- Cloudflare Analytics
```

---

## ESTIMACIÓN REALISTA (Portal Artesanos)

### Opción A: MONOLITO MODULAR (RECOMENDADO)

| Tarea | Horas | Descripción |
|-------|-------|-------------|
| **Setup inicial** | 5h | Crear monolito NestJS |
| **Auth module** | Ya existe | Reusar auth-service actual |
| **Artisan module** | 40h | **CORE** - Perfiles artesanos |
| **Product module** | 10h | Integrar product-service actual |
| **Geo module** | 25h | Provincias/municipios Andalucía |
| **Frontend básico** | 30h | Listado + filtros + detalle |
| **Testing básico** | 20h | Tests críticos |
| **Deploy** | 10h | Docker + VPS simple |
| **TOTAL** | **140h** | **3-4 semanas (1 dev)** |

### Opción B: MICROSERVICIOS SIMPLIFICADOS

| Tarea | Horas | Descripción |
|-------|-------|-------------|
| **Gateway** | 30h | API Gateway básico |
| **artisan-service** | 50h | Implementar desde 0 |
| **geo-service** | 25h | Completar |
| **Frontend integración** | 40h | Conectar con APIs |
| **Eliminar monitoreo** | 10h | Quitar Jaeger/OpenTelemetry |
| **Simplificar compose** | 5h | Solo servicios esenciales |
| **Testing** | 30h | Tests básicos |
| **Deploy** | 15h | Orchestration |
| **TOTAL** | **205h** | **5-6 semanas (1 dev)** |

---

## PREGUNTAS CRÍTICAS PARA DECIDIR

Responde estas preguntas para definir alcance:

### 1. Modelo de Negocio

```
[ ] Solo catálogo/directorio (sin ventas)
[ ] E-commerce completo (ventas online)
[ ] Híbrido (catálogo + contacto directo)
```

### 2. Funcionalidades Esenciales

```
[ ] Listado de artesanos por ubicación
[ ] Búsqueda y filtros
[ ] Perfil completo de artesano
[ ] Galería de productos/trabajos
[ ] Sistema de valoraciones/reviews
[ ] Contacto directo (email/teléfono)
[ ] Carrito de compra
[ ] Pagos online
[ ] Gestión de pedidos
[ ] Sistema de envíos
```

### 3. Escala Esperada (Primer Año)

```
[ ] <100 artesanos
[ ] 100-500 artesanos
[ ] >500 artesanos

[ ] <1000 usuarios/mes
[ ] 1K-10K usuarios/mes
[ ] >10K usuarios/mes
```

### 4. Equipo de Desarrollo

```
[ ] 1 desarrollador
[ ] 2-3 desarrolladores
[ ] >3 desarrolladores
```

---

## RECOMENDACIÓN FINAL

### Para Portal de Artesanos Jaén/Andalucía

#### ✅ HACER (PRIORIDAD MÁXIMA)

1. **Implementar artisan-service** (50h) - CORE DEL NEGOCIO
2. **Completar geo-service** (25h) - Filtros por ubicación
3. **Simplificar monitoreo** (10h) - Eliminar Jaeger/OpenTelemetry
4. **Frontend básico** (40h) - Listado + búsqueda + detalle
5. **Gateway simple** (30h) - Nginx reverse proxy

**TOTAL: 155 horas = 4-5 semanas (1 dev)**

#### ⚠️ DECIDIR

- ¿Necesitas ventas online? → Mantener order/payment services
- ¿Solo catálogo? → Eliminar order/payment services

#### ❌ NO HACER (Eliminar)

- admin-service (usar frontend)
- analytics-service (Google Analytics)
- cms-service (no necesario)
- event-service (fuera de alcance)
- chat-service (v2)
- loyalty-service (v2)
- Jaeger/OpenTelemetry/Prometheus/Grafana
- NATS (usar HTTP directo)
- Patrón Saga (simplificar)
- Event Sourcing (CRUD normal)

#### 📉 AHORRO ESTIMADO

```
Horas originales:     770h
Horas simplificadas:  155h
AHORRO:              615h (80% menos trabajo!)
```

---

## PRÓXIMO PASO INMEDIATO

### Decide AHORA

**Pregunta 1:** ¿Quieres vender online o solo mostrar catálogo?

- Si SOLO CATÁLOGO → **155 horas** (1 mes)
- Si E-COMMERCE → **+80 horas** (1.5 meses)

**Pregunta 2:** ¿Prefieres monolito o microservicios?

- MONOLITO → **140 horas** (más rápido)
- MICROSERVICIOS → **205 horas** (actual pero limpio)

---

**¿Cuál es tu decisión?**
