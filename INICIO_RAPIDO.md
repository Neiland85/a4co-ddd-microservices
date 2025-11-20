# 🚀 INICIO RÁPIDO - Migración a Monolito

**Decisión:** Monolito Simple para Portal de Artesanos
**Estimación:** 140-160 horas (3-4 semanas full-time, 6-8 semanas part-time)

---

## TU SITUACIÓN ACTUAL vs OBJETIVO

### ANTES (Actual - Sobredimensionado)

```
❌ 16 microservicios (8 completos + 2 parciales + 6 vacíos)
❌ Jaeger + OpenTelemetry + Prometheus + Grafana
❌ NATS + Saga + Event Sourcing
❌ 770 horas restantes
❌ Complejidad innecesaria
```

### DESPUÉS (Objetivo - Simplificado)

```
✅ 1 monolito NestJS con 5 módulos
✅ Logs simples (Winston)
✅ HTTP REST directo
✅ 140-160 horas restantes (80% menos!)
✅ Fácil de mantener
```

---

## PASO 0: DECISIÓN TOMADA ✅

Has elegido: **Opción 1 - Monolito Simple**

Escalarás a microservicios solo si:

- Tienes >10,000 artesanos
- Tienes >100,000 usuarios/mes
- El cliente lo pide y paga

---

## PASO 1: PREPARACIÓN (HOY - 30 minutos)

### 1.1 Crear rama nueva

```bash
cd /Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices

# Crear rama
git checkout -b feature/migrate-to-monolith

# Confirmar rama actual
git branch
```

### 1.2 Backup de seguridad

```bash
# Por si acaso
git tag backup-before-monolith
git push origin backup-before-monolith
```

### 1.3 Leer documentos

```bash
# Revisar estos 3 archivos:
cat PLAN_MONOLITO_SIMPLE.md          # Plan completo (6000 líneas)
cat ANALISIS_SIMPLIFICACION.md       # Por qué simplificar
cat INICIO_RAPIDO.md                 # Este archivo
```

---

## PASO 2: CREAR ESTRUCTURA (HOY - 1 hora)

### 2.1 Crear directorios

```bash
# Backend monolito
mkdir -p backend/src/modules/{auth,user,product,artisan,geo}
mkdir -p backend/src/{shared,common}
mkdir -p backend/prisma
mkdir -p backend/test

# Frontend simple
mkdir -p frontend-monolith/src/{pages,components,services,hooks}

# Confirmación
tree -L 3 backend/
```

### 2.2 Crear package.json base

```bash
cd backend

# Inicializar
cat > package.json << 'EOF'
{
  "name": "artesanos-backend",
  "version": "1.0.0",
  "description": "Portal Artesanos Jaén y Andalucía - Backend Monolito",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "test": "jest",
    "migrate": "prisma migrate dev",
    "seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "winston": "^3.10.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.0.0",
    "prisma": "^5.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "ts-node": "^10.0.0"
  }
}
EOF
```

### 2.3 Instalar dependencias

```bash
pnpm install
```

---

## PASO 3: COPIAR CÓDIGO EXISTENTE (HOY - 2 horas)

### 3.1 Copiar Auth Module

```bash
# Copiar estructura completa
cp -r ../apps/auth-service/src/domain backend/src/modules/auth/
cp -r ../apps/auth-service/src/application backend/src/modules/auth/
cp -r ../apps/auth-service/src/infrastructure backend/src/modules/auth/
cp -r ../apps/auth-service/src/presentation backend/src/modules/auth/

# Verificar
ls -la backend/src/modules/auth/
```

### 3.2 Copiar User Module

```bash
cp -r ../apps/user-service/src/domain backend/src/modules/user/
cp -r ../apps/user-service/src/application backend/src/modules/user/
cp -r ../apps/user-service/src/infrastructure backend/src/modules/user/
cp -r ../apps/user-service/src/presentation backend/src/modules/user/
```

### 3.3 Copiar Product Module

```bash
cp -r ../apps/product-service/src/domain backend/src/modules/product/
cp -r ../apps/product-service/src/application backend/src/modules/product/
cp -r ../apps/product-service/src/infrastructure backend/src/modules/product/
cp -r ../apps/product-service/src/presentation backend/src/modules/product/
```

### 3.4 Ajustar imports (IMPORTANTE)

```bash
# Cambiar imports de @a4co/shared-utils a rutas relativas
find backend/src/modules -type f -name "*.ts" -exec sed -i.bak 's/@a4co\/shared-utils/..\/..\/..\/shared/g' {} \;

# Verificar cambios
grep -r "@a4co" backend/src/modules/ || echo "✅ Imports limpios"
```

---

## PASO 4: CREAR APP.MODULE (HOY - 30 minutos)

### 4.1 Crear main.ts

```typescript
// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { logger } from './common/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.info(`🚀 Backend monolito iniciado en http://localhost:${port}`);
  logger.info(`📚 API Docs: http://localhost:${port}/api`);
}

bootstrap();
```

### 4.2 Crear app.module.ts

```typescript
// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
// import { ArtisanModule } from './modules/artisan/artisan.module'; // TODO: Crear
// import { GeoModule } from './modules/geo/geo.module'; // TODO: Crear

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    ProductModule,
    // ArtisanModule, // TODO: Descomentar cuando esté creado
    // GeoModule, // TODO: Descomentar cuando esté creado
  ],
})
export class AppModule {}
```

### 4.3 Crear logger simple

```typescript
// backend/src/common/logger.service.ts
import * as winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
```

---

## PASO 5: CONSOLIDAR PRISMA SCHEMA (HOY - 1 hora)

### 5.1 Crear schema base

```bash
cd backend
pnpx prisma init
```

### 5.2 Copiar schema completo

Copiar el contenido de [PLAN_MONOLITO_SIMPLE.md](PLAN_MONOLITO_SIMPLE.md) sección "Consolidar Prisma Schema" a `backend/prisma/schema.prisma`

### 5.3 Generar cliente

```bash
pnpx prisma generate
```

### 5.4 Crear migración

```bash
pnpx prisma migrate dev --name init
```

---

## PASO 6: VERIFICAR QUE COMPILA (HOY - 30 minutos)

### 6.1 Compilar backend

```bash
cd backend
pnpm run build
```

### 6.2 Resolver errores de imports

Si hay errores, ajustar:

- Paths relativos (`../../../`)
- Módulos faltantes (crear stubs vacíos)
- Dependencias de shared-utils

### 6.3 Iniciar en dev

```bash
pnpm run start:dev
```

Deberías ver:

```
🚀 Backend monolito iniciado en http://localhost:3000
```

---

## PASO 7: PRÓXIMOS DÍAS (Esta semana)

### Día 2-3: Crear Artisan Module (20 horas)

```bash
# Ver PLAN_MONOLITO_SIMPLE.md Fase 3
# Crear:
- backend/src/modules/artisan/domain/
- backend/src/modules/artisan/application/
- backend/src/modules/artisan/infrastructure/
- backend/src/modules/artisan/presentation/
```

### Día 4: Crear Geo Module (8 horas)

```bash
# Ver PLAN_MONOLITO_SIMPLE.md Fase 4
# Seed data de provincias de Andalucía
```

### Día 5: Testing básico (8 horas)

```bash
# Tests e2e para artisan module
```

---

## PASO 8: PRÓXIMAS 2 SEMANAS

### Semana 2: Frontend (30 horas)

- Setup Vite + React
- API client con Axios
- Páginas: Home, ArtisanDetail, Search
- Componentes: ArtisanCard, SearchFilters, Map

### Semana 3: Deploy (15 horas)

- Docker Compose simplificado
- Deploy a VPS o Railway
- SSL + Nginx
- Testing en staging

---

## RESUMEN DE TIMELINE

| Semana | Foco | Horas | Estado |
|--------|------|-------|--------|
| 1 | Setup + Migración + Artisan Module | 50h | 🟢 Empezar HOY |
| 2 | Geo Module + Frontend básico | 55h | 🟡 Próxima semana |
| 3 | Testing + Deploy | 40h | ⚪ En 2 semanas |
| **TOTAL** | | **145h** | |

---

## CHECKLIST DIARIO

### ✅ HOY (Día 1)

- [ ] Crear rama `feature/migrate-to-monolith`
- [ ] Crear estructura de carpetas
- [ ] Copiar módulos existentes (auth, user, product)
- [ ] Ajustar imports
- [ ] Crear app.module.ts
- [ ] Consolidar Prisma schema
- [ ] Compilar y verificar que arranca
- [ ] Commit: "feat: setup monolith structure"

### Mañana (Día 2)

- [ ] Crear Artisan Domain Layer
- [ ] Crear Artisan Application Layer (use cases)
- [ ] Commit: "feat: artisan domain and application"

### Día 3

- [ ] Crear Artisan Infrastructure Layer
- [ ] Crear Artisan Presentation Layer (controller)
- [ ] Commit: "feat: artisan infrastructure and API"

### Día 4

- [ ] Crear Geo Module completo
- [ ] Seed data provincias Andalucía
- [ ] Commit: "feat: geo module with Andalusia data"

### Día 5

- [ ] Tests e2e artisan module
- [ ] Commit: "test: artisan e2e tests"

---

## COMANDOS ÚTILES

### Desarrollo

```bash
# Backend
cd backend
pnpm run start:dev          # Dev con hot reload
pnpm run build              # Compilar
pnpm run test               # Tests
pnpm run migrate            # Migraciones DB

# Frontend (cuando esté listo)
cd frontend-monolith
pnpm run dev                # Dev server
pnpm run build              # Build producción
```

### Database

```bash
# Ver DB
pnpx prisma studio

# Reset DB
pnpx prisma migrate reset

# Seed data
pnpm run seed
```

### Git

```bash
# Commits frecuentes
git add .
git commit -m "feat: descripción"
git push origin feature/migrate-to-monolith
```

---

## MÉTRICAS DE PROGRESO

### ¿Cómo saber que vas bien

#### Día 1 (HOY)

- [ ] Backend compila sin errores
- [ ] Backend arranca en `http://localhost:3000`
- [ ] Endpoints existentes funcionan: `/auth/login`, `/products`

#### Día 3

- [ ] Endpoint `/artisans` devuelve 200
- [ ] POST `/artisans` crea artesano
- [ ] GET `/artisans?provinceId=1` filtra correctamente

#### Semana 1

- [ ] Artisan Module 100% funcional
- [ ] Tests e2e passing
- [ ] Swagger docs disponible en `/api`

#### Semana 2

- [ ] Frontend muestra listado de artesanos
- [ ] Búsqueda por ubicación funciona
- [ ] Detalle de artesano se renderiza

#### Semana 3

- [ ] Deploy en staging
- [ ] URL pública accesible
- [ ] Tests e2e en staging passing

---

## PROBLEMAS COMUNES Y SOLUCIONES

### Error: "Cannot find module '@a4co/shared-utils'"

```bash
# Solución: Ajustar imports
find backend/src -name "*.ts" -exec sed -i 's/@a4co\/shared-utils/..\/..\/..\/shared/g' {} \;
```

### Error: "Module not found: AuthModule"

```bash
# Solución: Verificar que copiaste correctamente
ls -la backend/src/modules/auth/
# Debe tener: domain/, application/, infrastructure/, presentation/
```

### Error: Prisma client not generated

```bash
# Solución: Regenerar
cd backend
pnpx prisma generate
```

### Backend no arranca

```bash
# Solución: Verificar logs
cd backend
pnpm run start:dev

# Si falla compilación, revisar:
pnpm run build
# Ver errores de TypeScript
```

---

## SOPORTE Y AYUDA

### Archivos de referencia

1. [PLAN_MONOLITO_SIMPLE.md](PLAN_MONOLITO_SIMPLE.md) - Plan completo detallado
2. [ANALISIS_SIMPLIFICACION.md](ANALISIS_SIMPLIFICACION.md) - Por qué simplificar
3. Este archivo - Guía paso a paso

### Próximos pasos cuando termines

1. Crear PR: `feature/migrate-to-monolith` → `main`
2. Review y merge
3. Deploy a staging
4. Mostrar al cliente
5. Iterar según feedback

---

## MOTIVACIÓN 💪

### Recuerda

- ✅ Estás simplificando de 770h → 145h (80% menos!)
- ✅ Monolito es MÁS RÁPIDO de desarrollar
- ✅ Monolito es MÁS FÁCIL de mantener
- ✅ Puedes escalar cuando el negocio lo justifique
- ✅ KISS: Keep It Simple, Stupid

### Portal de artesanos NO necesita

- ❌ Jaeger (tracing distribuido)
- ❌ Prometheus + Grafana (métricas enterprise)
- ❌ NATS (message broker)
- ❌ 16 microservicios
- ❌ Saga pattern
- ❌ Event sourcing

### Portal de artesanos SÍ necesita

- ✅ Listado de artesanos con filtros
- ✅ Búsqueda por ubicación (Jaén/Andalucía)
- ✅ Perfiles completos con galería
- ✅ Contacto directo
- ✅ Sistema simple y mantenible

---

## ¿LISTO? 🚀

**Siguiente paso:** Ejecutar "PASO 1" de este documento.

Abre una terminal y empieza:

```bash
cd /Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices
git checkout -b feature/migrate-to-monolith
mkdir -p backend/src/modules/{auth,user,product,artisan,geo}
```

**¡Vamos! 💪**
