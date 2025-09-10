# Product Service - Tests

## Estructura de Tests

Este directorio contiene las pruebas unitarias completas para el `ProductService` y `ProductController`.

### Archivos de Test

- **`product.service.spec.ts`** - Pruebas unitarias del servicio y controlador
- **`setup.ts`** - Configuración global de Jest y mocks
- **`README.md`** - Esta documentación

## Casos de Uso Cubiertos

### ProductService

#### Flujos Principales

- ✅ Creación de productos con datos válidos
- ✅ Obtención de información de productos
- ✅ Manejo de nombres con caracteres especiales
- ✅ Manejo de precios con decimales e enteros

#### Casos de Error

- ✅ Validación de campos requeridos
- ✅ Manejo de valores undefined/null
- ✅ Manejo de tipos de datos incorrectos
- ✅ Propagación de errores del BaseService

#### Casos Edge

- ✅ Strings muy largos
- ✅ Caracteres Unicode
- ✅ Precios extremos
- ✅ Validaciones de entrada

### ProductController

#### Integración

- ✅ Delegación correcta al service
- ✅ Validación de requests
- ✅ Manejo de errores
- ✅ Formateo de respuestas

## Ejecución de Tests

### Comando Básico


```bash
# Desde el directorio raíz del proyecto
pnpm test --filter=product-service

# O desde el directorio del servicio
cd apps/product-service
pnpm test


```


### Comando con Coverage


```bash
pnpm test:coverage --filter=product-service


```


### Comando con Watch Mode


```bash
pnpm test:watch --filter=product-service


```


### Ejecutar Tests Específicos


```bash
# Solo tests del service
pnpm test --testNamePattern="ProductService"

# Solo tests del controller
pnpm test --testNamePattern="ProductController"

# Solo tests de casos de error
pnpm test --testNamePattern="Casos de Error"


```


## Configuración de Jest

### Jest Config

- **Display Name**: `product-service`
- **Test Match**: `tests/**/*.spec.ts` y `*.test.ts`
- **Coverage**: Excluye interfaces y DTOs
- **Mocks**: Configurados en `setup.ts`

### TypeScript Config

- **Extends**: `./tsconfig.json`
- **Types**: Jest y Node
- **Strict Mode**: Deshabilitado para tests
- **Include**: Tests y archivos de test

## Mocks y Dependencias

### BaseService Mock


```typescript
validateRequired: (value, field) => {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${field} is required`);
  }
  return value;
};

```


### BaseController Mock


```typescript
validateRequest: (req, fields) => {
  // Validación de campos requeridos
};

```


## Assertions y Validaciones

### Assertions Básicos


```typescript
expect(result).toContain('Product');
expect(result).toContain('created');
expect(typeof result).toBe('string');

```


### Validaciones de Error


```typescript
expect(result).toContain('Error in addProduct');
expect(result).toContain('name is required');

```


### Validaciones de Excepción


```typescript
expect(() => controller.addProduct(invalidRequest)).toThrow();

```


## Cobertura de Código

### Métricas Objetivo

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Archivos Cubiertos

- ✅ `service.ts` - 100% cobertura
- ✅ `controller.ts` - 100% cobertura
- ❌ `dto.ts` - Excluido de coverage

## Troubleshooting

### Errores Comunes

#### Mock no encontrado


```bash
# Verificar que setup.ts esté configurado correctamente
jest.setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']


```


#### TypeScript errors


```bash
# Verificar tsconfig.spec.json
# Asegurar que types incluye "jest"


```


#### Coverage bajo


```bash
# Verificar collectCoverageFrom en jest.config.js
# Excluir archivos que no necesitan coverage


```


### Debug Tests


```bash
# Ejecutar con verbose
pnpm test --verbose

# Ejecutar test específico con debug
pnpm test --testNamePattern="should create a product" --verbose


```


## Próximos Pasos

1. **Integración con Base de Datos**: Agregar tests de integración
2. **Eventos de Dominio**: Testear publicación de eventos
3. **Validaciones Avanzadas**: Tests para reglas de negocio complejas
4. **Performance**: Tests de rendimiento y carga
5. **API Endpoints**: Tests de endpoints HTTP
