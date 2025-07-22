# Auth Service - Tests

Este directorio contiene los tests para el servicio de autenticación.

## Estructura de Tests

### 1. Tests Unitarios Básicos

#### `test/basic.spec.ts`

Test básico para verificar que la configuración de Jest funciona correctamente.

#### `test/use-cases/register-user-unit.spec.ts`

Test unitario independiente para `RegisterUserUseCase` que no depende de NestJS.

**Características:**

- No requiere inyección de dependencias compleja
- Usa mocks simples
- Verifica la lógica básica del use case
- Maneja errores de validación y repositorio

### 2. Tests de Integración

#### `test/use-cases/register-user.use-case.spec.ts`

Test de integración completo usando NestJS Testing Module.

**Características:**

- Usa inyección de dependencias de NestJS
- Mocks más completos de repositorios y servicios
- Simula el flujo completo de registro de usuario
- Prueba mapeo de DTOs

#### `test/use-cases/register-user-simple.use-case.spec.ts`

Version simplificada del test de integración con mocks directos.

## Configuración

### `jest.config.js`

Configuración de Jest específica para auth-service:

- Preset TypeScript
- Mapeo de módulos para `@shared`
- Setup de decoradores de NestJS
- Configuración de coverage

### `test/setup.ts`

Configuración global para todos los tests:

- Mocks globales para bcryptjs y uuid
- Configuración de timeouts
- Mocks para shared-utils

## Ejecutar Tests

```bash
# Desde el directorio auth-service
npm test

# Ejecutar tests específicos
npm test -- --testPathPattern=register-user

# Ejecutar con coverage
npm run test:cov

# Ejecutar en modo watch
npm run test:watch
```

## Problemas Conocidos y Soluciones

### 1. Mocking de User.create()

El método estático `User.create()` requiere mocking especial debido a:

- Dependencias de bcryptjs para hashing
- Generación de UUIDs
- Emisión de eventos de dominio

**Solución actual:** Mock completo del módulo User en cada test.

### 2. Inyección de Dependencias

Los tests usan diferentes estrategias según el nivel:

- Tests unitarios: Constructor directo
- Tests de integración: NestJS Testing Module

### 3. Shared Utils Dependencies

El módulo `@shared` se mockea en setup.ts para evitar dependencias circulares.

## Mejoras Futuras

1. **Factory de Test Data:** Crear factories para generar datos de test consistentes
2. **Builders de Mocks:** Crear builders para generar mocks complejos fácilmente
3. **Tests E2E:** Agregar tests end-to-end con base de datos real
4. **Test Containers:** Usar testcontainers para tests de integración con BD

## Estructura de Datos de Test

### RegisterUserDto de Ejemplo

```typescript
{
  email: 'test@example.com',
  name: 'Test User',
  password: 'Password123'
}
```

### User Mock Esperado

```typescript
{
  id: 'test-uuid-1234',
  email: 'test@example.com',
  name: 'Test User',
  status: UserStatus.ACTIVE,
  emailVerified: false,
  lastLoginAt: undefined,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## Casos de Test Cubiertos

### RegisterUserUseCase

#### ✅ Casos Exitosos

- Registro de usuario válido
- Mapeo correcto de DTOs
- Persistencia en repositorio

#### ✅ Casos de Error

- Email ya existente
- Errores de validación
- Errores de base de datos
- Errores de hashing de password

#### ✅ Casos Edge

- Campos opcionales
- Valores límite
- Caracteres especiales en nombres

## Comandos Útiles

```bash
# Limpiar cache de Jest
npx jest --clearCache

# Ejecutar test específico con debug
npm run test:debug -- --testNamePattern="should register"

# Ver coverage detallado
npm run test:cov -- --coverageReporters=html
```
