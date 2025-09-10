# 🚀 Configuración Unificada del Monorepo A4CO DDD Microservices

## 📋 Resumen de Cambios

Se ha implementado una configuración unificada que elimina duplicaciones y optimiza el uso de **pnpm** y **Turbo** en
todo el monorepo.

## 🎯 Objetivos Alcanzados

### ✅ Eliminación de Duplicaciones

- **Scripts unificados**: Todos los microservicios usan el mismo patrón de scripts
- **Dependencias compartidas**: Uso de `workspace:*` para paquetes internos
- **Configuraciones estándar**: ESLint, Prettier, Jest y TypeScript unificados

### ✅ Optimización para pnpm

- **Workspace configurado**: `pnpm-workspace.yaml` optimizado
- **Dependencias centralizadas**: Instalación y gestión unificada
- **Filtros específicos**: Comandos por servicio usando `--filter`

### ✅ Integración con Turbo

- **Tareas optimizadas**: Build, test, lint con cache inteligente
- **Dependencias correctas**: `^build` para dependencias entre servicios
- **Persistencia configurada**: Dev y test:watch como tareas persistentes

## 🏗️ Estructura Unificada

### 📁 Configuraciones Base

```bash
├── jest.config.base.js          # Configuración Jest compartida
├── tsconfig.base.json           # Configuración TypeScript base
├── .eslintrc.json               # ESLint unificado
├── .prettierrc                  # Prettier unificado
└── turbo.json                   # Turbo optimizado


```

### 📦 Scripts Unificados

```json
{
  "dev": "turbo run dev",
  "build": "turbo run build",
  "test": "turbo run test",
  "lint": "turbo run lint",
  "type-check": "turbo run type-check",
  "validate": "pnpm run lint && pnpm run format:check && pnpm run type-check"
}
```

### 🔧 Nuevas Funcionalidades

- **`type-check`**: Verificación de tipos TypeScript
- **`validate`**: Validación completa del monorepo
- **`format:check`**: Verificación de formato sin cambios
- **Husky + lint-staged**: Pre-commit hooks automáticos

## 🚀 Instalación y Configuración

### 1. Configuración Automática

```bash
# Ejecutar el script de configuración unificada
./scripts/setup-unified.sh


```

### 2. Configuración Manual

```bash
# Generar package.json faltantes
node scripts/generate-microservice-packages.js

# Instalar dependencias
pnpm install

# Construir paquetes compartidos
pnpm --filter "./packages/*" build

# Validar configuración
pnpm run validate


```

## 📱 Comandos Disponibles

### 🎯 Comandos del Monorepo

```bash
# Desarrollo
pnpm dev                    # Iniciar todos los servicios
pnpm dev:frontend          # Solo frontend
pnpm dev:backend           # Solo backend

# Construcción
pnpm build                 # Construir todo
pnpm build:all            # Construir + sincronizar design tokens

# Testing
pnpm test                  # Tests de todos los servicios
pnpm test:coverage        # Tests con cobertura
pnpm test:watch           # Tests en modo watch

# Calidad
pnpm lint                  # Linting de todo el código
pnpm format                # Formateo automático
pnpm type-check            # Verificación de tipos
pnpm validate              # Validación completa

# Base de Datos
pnpm db:generate           # Generar cliente Prisma
pnpm db:push               # Push de esquema
pnpm db:migrate            # Migraciones


```

### 🎯 Comandos por Servicio

```bash
# Comandos específicos por servicio
pnpm --filter @a4co/auth-service dev
pnpm --filter @a4co/product-service test
pnpm --filter @a4co/web build


```

## 🔄 Flujo de Trabajo Recomendado

### 1. Desarrollo Diario

```bash
# Iniciar desarrollo
pnpm dev

# En otra terminal, ejecutar tests
pnpm test:watch

# Verificar calidad
pnpm validate


```

### 2. Antes de Commit

```bash
# El pre-commit hook ejecuta automáticamente
# - ESLint con --fix
# - Prettier
# - TypeScript type-check


```

### 3. Antes de Deploy

```bash
# Validación completa
pnpm run validate

# Tests con cobertura
pnpm run test:coverage:report

# Construcción
pnpm run build


```

## 📊 Beneficios de la Configuración Unificada

### 🚀 Rendimiento

- **Cache inteligente**: Turbo cachea builds y tests
- **Paralelización**: Ejecución concurrente de tareas
- **Dependencias optimizadas**: Instalación eficiente con pnpm

### 🛠️ Mantenimiento

- **Configuración centralizada**: Un solo lugar para cambios
- **Scripts estandarizados**: Mismo patrón en todos los servicios
- **Dependencias unificadas**: Versiones consistentes

### 👥 Colaboración

- **Pre-commit hooks**: Calidad automática del código
- **Validación unificada**: Mismos estándares para todos
- **Documentación clara**: Instrucciones paso a paso

## 🔧 Personalización

### Añadir Nuevo Microservicio

1. Crear directorio en `apps/`
2. Ejecutar `node scripts/generate-microservice-packages.js`
3. Personalizar `package.json` según necesidades
4. Añadir configuración específica si es necesario

### Modificar Configuración Base

1. Editar archivos base (`.eslintrc.json`, `jest.config.base.js`, etc.)
2. Ejecutar `pnpm run validate` para verificar cambios
3. Actualizar documentación si es necesario

## 🚨 Solución de Problemas

### Error: "Command not found: pnpm"

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# O usar npx
npx pnpm install


```

### Error: "Turbo not found"

```bash
# Instalar Turbo
pnpm add -D turbo

# O usar npx
npx turbo run build


```

### Error: "Package not found"

```bash
# Regenerar package.json
node scripts/generate-microservice-packages.js

# Reinstalar dependencias
pnpm install


```

## 📚 Recursos Adicionales

- [Documentación de Turbo](https://turbo.build/repo/docs)
- [Documentación de pnpm](https://pnpm.io/)
- [Guía de Monorepos](https://monorepo.tools/)
- [Patrones DDD](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 🤝 Contribución

Para contribuir a la configuración unificada:

1. Crear issue describiendo el problema/mejora
2. Implementar cambios siguiendo los estándares
3. Ejecutar `pnpm run validate` antes del commit
4. Crear pull request con descripción clara

---

**✨ La configuración unificada está lista para usar. ¡Disfruta de un monorepo más eficiente y mantenible!**
