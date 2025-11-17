# ✅ CHECKLIST FASE0 - Tareas Finales

**Objetivo:** Completar FASE0 para iniciar FASE1 (Core DDD + Sagas)  
**Documento completo:** `docs/TAREAS_FINALES_FASE0.md`

---

## 🔴 CRÍTICAS (BLOQUEANTES)

### 1. Gateway API
- [ ] Crear `apps/gateway/src/main.ts` (NestJS bootstrap)
- [ ] Crear `apps/gateway/src/gateway.module.ts`
- [ ] Implementar routing a microservicios:
  - [ ] `/api/v1/auth/*` → `auth-service:3001`
  - [ ] `/api/v1/users/*` → `user-service:3003`
  - [ ] `/api/v1/products/*` → `product-service:3002`
  - [ ] `/api/v1/orders/*` → `order-service:3004`
  - [ ] `/api/v1/payments/*` → `payment-service:3006`
- [ ] Configurar Swagger en puerto 3000
- [ ] Tests básicos de routing

**⏱️ Tiempo:** 4-6 horas

---

### 2. Integración Frontend-Backend
- [ ] Configurar `apps/frontend/api.ts` con base URL gateway
- [ ] Implementar interceptores JWT
- [ ] Conectar AuthContext a `/api/v1/auth/login`
- [ ] Conectar ProductPage a `/api/v1/products`
- [ ] Crear `apps/frontend/.env.example`

**⏱️ Tiempo:** 3-4 horas

---

### 3. NATS Configuración
- [ ] Verificar cliente NATS en `order-service`
- [ ] Verificar cliente NATS en `payment-service`
- [ ] Verificar cliente NATS en `inventory-service`
- [ ] Configurar JetStream streams
- [ ] Implementar eventos base:
  - [ ] `OrderCreated`
  - [ ] `PaymentProcessed`
  - [ ] `InventoryReserved`

**⏱️ Tiempo:** 4-5 horas

---

### 4. Prisma Migraciones
- [ ] Ejecutar migraciones en `order-service`
- [ ] Ejecutar migraciones en `payment-service`
- [ ] Ejecutar migraciones en `inventory-service`
- [ ] Verificar conexión a PostgreSQL
- [ ] Seed data básico (opcional)

**⏱️ Tiempo:** 2-3 horas

---

## 🟡 IMPORTANTES (RECOMENDADAS)

### 5. Testing Básico
- [ ] Ejecutar `pnpm test:all`
- [ ] Corregir tests fallando
- [ ] Smoke test E2E: Login → Productos → Orden
- [ ] Coverage mínimo 40% en servicios críticos

**⏱️ Tiempo:** 3-4 horas

---

### 6. Documentación APIs
- [ ] Swagger en `order-service`
- [ ] Swagger en `payment-service`
- [ ] Swagger en `inventory-service`
- [ ] Documentar contratos de eventos NATS
- [ ] Actualizar READMEs de servicios

**⏱️ Tiempo:** 2-3 horas

---

### 7. Observabilidad
- [ ] Verificar métricas Prometheus en servicios FASE1
- [ ] Endpoints `/metrics` funcionando
- [ ] Traces Jaeger configurados

**⏱️ Tiempo:** 2-3 horas

---

### 8. CI/CD
- [ ] Resolver workflows fallando
- [ ] Pipeline básico: Lint → Test → Build
- [ ] Verificar builds en CI

**⏱️ Tiempo:** 2-3 horas

---

## 🟢 OPCIONALES

### 9. Variables de Entorno
- [ ] Crear `.env.example` completo
- [ ] Documentar variables requeridas

**⏱️ Tiempo:** 1 hora

---

### 10. Scripts de Desarrollo
- [ ] `scripts/dev-start.sh` - Levantar todo
- [ ] `scripts/verify-setup.sh` - Health checks

**⏱️ Tiempo:** 1-2 horas

---

## ✅ VERIFICACIÓN FINAL

Antes de cerrar FASE0, verificar:

```bash
# 1. Servicios de infraestructura
docker ps  # PostgreSQL, Redis, NATS corriendo

# 2. Gateway
curl http://localhost:3000/api/docs  # Swagger responde

# 3. Servicios individuales
curl http://localhost:3001/api/v1/health  # auth
curl http://localhost:3002/api/v1/health  # product
curl http://localhost:3004/api/v1/health  # order

# 4. NATS
docker exec -it a4co-nats nats stream ls

# 5. Frontend
curl http://localhost:5173

# 6. Smoke test E2E
# Login → Productos → Crear orden
```

---

## 📊 PROGRESO

**Tareas Críticas:** 0/4 completadas  
**Tareas Importantes:** 0/4 completadas  
**Tareas Opcionales:** 0/2 completadas

**Total:** 0/10 completadas

---

## 🎯 CRITERIOS DE ÉXITO

FASE0 completa cuando:
- ✅ Gateway funcionando en puerto 3000
- ✅ Frontend puede hacer login y obtener productos
- ✅ NATS configurado y eventos funcionando
- ✅ Base de datos con migraciones aplicadas
- ✅ Smoke test E2E pasando
- ✅ Health checks funcionando

---

**Última actualización:** 2025-01-16
