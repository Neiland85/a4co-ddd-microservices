# 📊 Migración del Auth Service al Monolito

## 🔍 Análisis del Código Original

### ✅ Componentes Migrables Directamente

#### 1. **DTOs** (Application Layer)

- ✅ `RegisterUserDto` - Migrado con validaciones class-validator
- ✅ `LoginUserDto` - Migrado sin cambios
- ✅ `UserResponseDto` - Simplificado (removido fullName ambiguo)
- ✅ `LoginResponseDto` - Nuevo DTO para respuesta de login

**Cambios**: Agregados decoradores `@ApiProperty` para Swagger.

#### 2. **Value Objects** (Domain Layer)

- ✅ `Email` - Migrado, sin dependencia de shared-utils
- ✅ `Password` - Migrado con todas las validaciones
- ✅ `UserName` - Migrado con validaciones de caracteres

**Cambios**: Removida herencia de `ValueObject` base, implementado directamente.

#### 3. **Domain Events**

- ✅ `UserRegisteredEvent` - Simplificado
- ✅ `UserLoginEvent` - Simplificado
- ✅ `UserPasswordChangedEvent` - Simplificado
- ✅ `UserDeactivatedEvent` - Simplificado

**Cambios**: Removida dependencia de `DomainEvent` base. Events se almacenan en el aggregate pero **no se publican** (monolito no necesita message broker).

#### 4. **User Aggregate** (Domain Layer)

- ✅ Completamente migrado con toda la lógica de negocio
- ✅ Factory methods: `create()`, `createWithHashedPassword()`, `reconstruct()`
- ✅ Business methods: `validatePassword()`, `recordLogin()`, `changePassword()`, etc.
- ✅ Status management: `activate()`, `deactivate()`, `suspend()`

**Cambios**:

- Removida herencia de `AggregateRoot` de shared-utils
- Implementación directa de gestión de eventos internos
- Uso de `uuid` v13 (instalado como dependencia)
- Uso de `bcrypt` en lugar de `bcryptjs`

#### 5. **User Domain Service**

- ✅ `isEmailUnique()` - Migrado
- ✅ `validateUniqueEmail()` - Migrado
- ✅ `canUserPerformAction()` - Migrado

**Sin cambios significativos**.

#### 6. **Repository** (Infrastructure Layer)

- ✅ `PrismaUserRepository` - Completamente adaptado

**Cambios CRÍTICOS**:

- Ahora usa `PrismaService` centralizado del monolito via `@common/prisma`
- Adaptado al schema de Prisma del monolito (User.password en vez de hashedPassword)
- Simplificado mapeo de dominio a persistencia

#### 7. **Use Cases** (Application Layer)

- ✅ `RegisterUserUseCase` - Simplificado
- ✅ `LoginUserUseCase` - Simplificado

**Cambios IMPORTANTES**:

- ❌ **ELIMINADO**: `EventBusPort` - No se publican eventos externos
- ❌ **ELIMINADO**: `CryptographyServicePort` - Uso directo de bcrypt
- ✅ Events se almacenan pero se limpian con `clearEvents()` después de persistir
- ✅ Hash de password ahora directo en el use case

#### 8. **Controller** (Presentation Layer)

- ✅ `AuthController` - Completamente rediseñado para REST

**Cambios**:

- Endpoints REST estándar: `POST /auth/register`, `POST /auth/login`
- Decoradores Swagger completos
- Manejo de errores HTTP estándar
- Sin dependencias de NATS o messaging

#### 9. **Guards & Strategies**

- ✅ `JwtAuthGuard` - Migrado
- ✅ `JwtStrategy` - Migrado con configuración desde ConfigService

**Sin cambios significativos**.

---

## ❌ Componentes Eliminados (No Necesarios en Monolito)

### 1. **Messaging & Event Bus**

```typescript
// ❌ ELIMINADO
@Inject('EventBusPort')
private readonly eventBus: EventBusPort

await this.eventBus.publishAll(domainEvents);
```

**Razón**: En monolito, los eventos de dominio son internos. No necesitamos message broker (NATS, RabbitMQ, etc.).

### 2. **Cryptography Service Adapter**

```typescript
// ❌ ELIMINADO
@Inject('CryptographyServicePort')
private readonly cryptographyService: CryptographyServicePort

const hashedPassword = await this.cryptographyService.hashPassword(request.password);
```

**Razón**: Uso directo de `bcrypt` es más simple y no necesitamos abstracción.

### 3. **Tracing & Observability Complejo**

```typescript
// ❌ ELIMINADO del main.ts
import { initializeTracing } from '@a4co/observability';
import * as Sentry from '@sentry/node';
```

**Razón**: El monolito tiene su propia configuración de observabilidad centralizada.

### 4. **Braces Security Middleware**

```typescript
// ❌ ELIMINADO
const bracesMiddleware = new BracesSecurityMiddleware({...});
app.use(bracesMiddleware.validateRequestBody());
```

**Razón**: Seguridad centralizada en el monolito (app.module.ts o main.ts).

### 5. **NATS Microservice Transport**

```typescript
// ❌ ELIMINADO
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.NATS,
  options: {
    servers: [process.env['NATS_URL']],
    queue: 'auth_queue',
  },
});
```

**Razón**: Monolito usa HTTP REST, no necesita message queue.

### 6. **Global Prefix de Microservicio**

```typescript
// ❌ ELIMINADO
app.setGlobalPrefix('api/v1');
```

**Razón**: El monolito tiene su propia estrategia de routing.

---

## 🔧 Adaptaciones Realizadas

### 1. **Imports Centralizados**

```typescript
// ✅ NUEVO
import { PrismaService } from '@common/prisma/prisma.service';
import { PrismaModule } from '@common/prisma/prisma.module';
```

**Razón**: PrismaService es compartido por todos los módulos del monolito.

### 2. **Dependency Injection Simplificada**

```typescript
// ❌ ANTES (microservicio)
{
  provide: 'UserRepositoryPort',
  useFactory: (prismaClient: any) => {
    return new PrismaUserRepository(prismaClient);
  },
  inject: ['PrismaClient'],
}

// ✅ AHORA (monolito)
{
  provide: 'UserRepositoryPort',
  useClass: PrismaUserRepository, // NestJS inyecta PrismaService automáticamente
}
```

### 3. **JWT Configuration**

```typescript
// ✅ ADAPTADO para usar ConfigService
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET', 'super-secret-key'),
    signOptions: {
      expiresIn: '15m',
      issuer: 'artisan-portal',
      audience: 'artisan-portal-users',
    },
  }),
});
```

### 4. **Repository - Mapeo a Schema Prisma**

```typescript
// El schema del monolito usa:
// - password (en vez de hashedPassword)
// - role: Role (enum CUSTOMER/ARTISAN/ADMIN)
// - No tiene status, emailVerified, lastLoginAt

// Adaptación en PrismaUserRepository:
await this.prisma.user.create({
  data: {
    password: userData.hashedPassword, // ← Mapeo correcto
    role: 'CUSTOMER', // ← Default role
  },
});
```

---

## 📂 Estructura Final del Módulo Auth

```
src/modules/auth/
├── domain/
│   ├── aggregates/
│   │   ├── user.aggregate.ts         ✅ Migrado (sin AggregateRoot base)
│   │   └── index.ts
│   ├── value-objects/
│   │   ├── email.vo.ts               ✅ Migrado
│   │   ├── password.vo.ts            ✅ Migrado
│   │   ├── user-name.vo.ts           ✅ Migrado
│   │   └── index.ts
│   ├── events/
│   │   ├── user.events.ts            ✅ Migrado (simplificados)
│   │   └── index.ts
│   └── services/
│       ├── user-domain.service.ts    ✅ Migrado
│       └── index.ts
├── application/
│   ├── dto/
│   │   ├── user.dto.ts               ✅ Migrado (con Swagger)
│   │   └── index.ts
│   ├── ports/
│   │   ├── user-repository.port.ts   ✅ Migrado
│   │   └── index.ts
│   └── use-cases/
│       ├── register-user.use-case.ts ✅ Simplificado
│       ├── login-user.use-case.ts    ✅ Simplificado
│       └── index.ts
├── infrastructure/
│   └── repositories/
│       ├── prisma-user.repository.ts ✅ Adaptado a PrismaService
│       └── index.ts
├── presentation/
│   ├── controllers/
│   │   ├── auth.controller.ts        ✅ Nuevo REST controller
│   │   └── index.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts         ✅ Migrado
│   │   └── index.ts
│   └── strategies/
│       ├── jwt.strategy.ts           ✅ Migrado
│       └── index.ts
├── auth.module.ts                     ✅ Reescrito para monolito
└── index.ts                           ✅ Exports públicos
```

---

## 🎯 Módulo Final: auth.module.ts

```typescript
@Module({
  imports: [
    PrismaModule,          // ← Prisma centralizado
    PassportModule,
    JwtModule.registerAsync({...}),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepositoryPort',
      useClass: PrismaUserRepository,
    },
    UserDomainService,
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtStrategy,
  ],
  exports: [
    JwtModule,
    PassportModule,
    'UserRepositoryPort',
    UserDomainService,
  ],
})
export class AuthModule {}
```

### Características del Nuevo Módulo

✅ **Sin dependencias de microservicios**  
✅ **Sin message brokers**  
✅ **Sin tracing distribuido**  
✅ **Prisma centralizado**  
✅ **Arquitectura hexagonal completa**  
✅ **Listo para integrar en app.module.ts**

---

## 🚀 Próximos Pasos

### Para Integrar en el Monolito:

1. **Actualizar app.module.ts**:

```typescript
import { AuthModule } from '@modules/auth';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule, // ← Agregar aquí
    // ... otros módulos
  ],
})
export class AppModule {}
```

2. **Actualizar Prisma Schema** (si es necesario):

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String   // Hasheado
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  CUSTOMER
  ARTISAN
  ADMIN
}
```

3. **Probar endpoints**:

```bash
# Registro
POST http://localhost:3000/auth/register
{
  "email": "test@example.com",
  "password": "Password123",
  "name": "Test User"
}

# Login
POST http://localhost:3000/auth/login
{
  "email": "test@example.com",
  "password": "Password123"
}
```

---

## 📝 Notas Importantes

### Dependencias Instaladas

```json
{
  "dependencies": {
    "uuid": "^13.0.0" // ← Agregado para User Aggregate
  }
}
```

### Configuración Requerida (.env)

```env
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://postgres@localhost:5432/artisan_portal
```

---

## ✅ Resumen de Migración

| Componente        | Estado          | Cambios                                 |
| ----------------- | --------------- | --------------------------------------- |
| Value Objects     | ✅ Migrado      | Removida herencia de shared-utils       |
| Domain Events     | ✅ Migrado      | Simplificados, sin publicación externa  |
| User Aggregate    | ✅ Migrado      | Removida AggregateRoot base             |
| Domain Service    | ✅ Migrado      | Sin cambios                             |
| DTOs              | ✅ Migrado      | Agregados decoradores Swagger           |
| Repository Port   | ✅ Migrado      | Sin cambios                             |
| Prisma Repository | ✅ Adaptado     | Usa PrismaService centralizado          |
| Use Cases         | ✅ Simplificado | Removido EventBus y CryptographyService |
| Controller        | ✅ Rediseñado   | REST puro, sin NATS                     |
| Guards            | ✅ Migrado      | Sin cambios                             |
| Strategies        | ✅ Migrado      | ConfigService para JWT                  |
| Module            | ✅ Reescrito    | Dependency injection simplificada       |

**Total: 100% migrado y adaptado al monolito** ✅

---

## NEXT_MODULE: ¿Deseas que migre ahora **user-service** o **product-service**?
