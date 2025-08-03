# 🚀 Servidor de Desarrollo Unificado A4CO

Este documento describe cómo configurar y utilizar el entorno de desarrollo unificado para el monorepo A4CO, que incluye todos los microservicios, aplicaciones frontend y el Design System.

## 📋 Requisitos Previos

- Node.js 18+ 
- pnpm 10.9.0+
- Docker y Docker Compose
- Git
- (Opcional) Vercel CLI para preview deployments

## 🏗️ Arquitectura del Entorno

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                      │
│                        (puerto 80)                          │
└─────────────┬──────────────┬──────────────┬────────────────┘
              │              │              │
              v              v              v
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │   Web App  │  │ Dashboard  │  │ Storybook  │
     │ localhost/ │  │dashboard.  │  │  design.   │
     │            │  │localhost   │  │ localhost  │
     └────────────┘  └────────────┘  └────────────┘
              │
              v
     ┌────────────────────────────────────────┐
     │           API Gateway                   │
     │  /api/auth    → Auth Service          │
     │  /api/products → Product Service      │
     │  /api/users   → User Service          │
     └────────────────────────────────────────┘
```

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/Neiland85/a4co-ddd-microservices.git
cd a4co-ddd-microservices
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones locales
```

### 4. Levantar el entorno completo
```bash
pnpm dev:all
```

Este comando iniciará:
- ✅ Todos los microservicios
- ✅ Aplicaciones frontend (Web y Dashboard)
- ✅ Storybook del Design System
- ✅ Bases de datos (PostgreSQL)
- ✅ Servicios de infraestructura (Redis, NATS)
- ✅ Herramientas de desarrollo (Mailhog, Adminer)

## 📚 Scripts Disponibles

### Desarrollo
```bash
# Iniciar todo el entorno de desarrollo
pnpm dev:all

# Iniciar solo el frontend
pnpm dev:frontend

# Iniciar solo el backend
pnpm dev:backend

# Iniciar solo el Design System con Storybook
pnpm storybook:dev

# Sincronizar tokens de diseño
pnpm design:sync
```

### Docker
```bash
# Levantar servicios con Docker Compose
pnpm docker:up

# Detener servicios
pnpm docker:down

# Ver logs
pnpm docker:logs

# Limpiar volúmenes
pnpm docker:clean
```

### Testing
```bash
# Ejecutar todos los tests
pnpm test

# Tests con watch mode
pnpm test:watch

# Tests visuales
pnpm test:visual

# Tests E2E
pnpm test:e2e
```

### Build y Deploy
```bash
# Build de producción
pnpm build

# Preview de producción local
pnpm preview

# Deploy a staging
pnpm deploy:staging

# Deploy a producción
pnpm deploy:prod
```

## 🌐 URLs del Entorno Local

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Web App | http://localhost | Aplicación principal |
| Dashboard | http://dashboard.localhost | Panel de administración |
| Storybook | http://design.localhost | Design System |
| API Gateway | http://localhost/api | Punto de entrada API |
| Mailhog | http://localhost:8025 | Interfaz de correo |
| Adminer | http://localhost:8080 | Gestión de BD |
| NATS Monitor | http://localhost:8222 | Monitor de mensajería |

## 🎨 Design System

### Importar componentes
```typescript
import { Button, Card, Input } from '@a4co/design-system';
import { colors, spacing } from '@a4co/design-system/tokens';
```

### Usar el preset de Tailwind
```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@a4co/design-system/tailwind')],
  // ... configuración específica de la app
}
```

### Tokens de diseño disponibles
- **Colores**: Paleta A4CO (olive, clay, cream)
- **Tipografía**: Inter, Manrope, JetBrains Mono
- **Espaciado**: Sistema de 4px base
- **Animaciones**: Transiciones y keyframes predefinidos
- **Sombras**: Sistema natural de sombras

## 🔄 Hot Reload y Live Sync

El entorno está configurado para hot reload automático:

1. **Frontend**: Los cambios en Next.js se reflejan instantáneamente
2. **Backend**: NestJS reinicia automáticamente con cambios
3. **Design System**: Storybook se actualiza en tiempo real
4. **Tailwind**: Los cambios en tokens se propagan a todas las apps

## 🧪 Testing Visual

### Ejecutar tests visuales localmente
```bash
# Instalar navegadores de Playwright
pnpm playwright:install

# Ejecutar tests visuales
pnpm test:visual

# Actualizar snapshots
pnpm test:visual:update
```

### Integración con CI/CD
- **Chromatic**: Se ejecuta automáticamente en PRs
- **Percy**: Capturas visuales en cada commit
- **Playwright**: Tests E2E en múltiples navegadores

## 🚨 Solución de Problemas

### Puerto en uso
```bash
# Verificar puertos en uso
lsof -i :80
lsof -i :3000
lsof -i :5432

# Matar proceso por puerto
kill -9 $(lsof -t -i:3000)
```

### Problemas con Docker
```bash
# Reiniciar Docker
docker-compose down -v
docker system prune -a
pnpm docker:up
```

### Problemas con dependencias
```bash
# Limpiar cache de pnpm
pnpm store prune
rm -rf node_modules
pnpm install --force
```

### Hot reload no funciona
```bash
# En Docker, verificar WATCHPACK_POLLING
# Debe estar en true en docker-compose.yml
```

## 🤝 Contribuir

1. Crear una rama desde `develop`
2. Hacer cambios y commits semánticos
3. Ejecutar tests localmente
4. Crear Pull Request
5. Esperar aprobación de CI/CD

## 📞 Soporte

- **Documentación**: `/docs`
- **Issues**: GitHub Issues
- **Discord**: [Enlace al Discord]
- **Email**: dev@a4co.com

## 📝 Notas Adicionales

- El Design System se publica automáticamente en npm cuando se hace merge a main
- Los preview deployments se crean automáticamente en cada PR
- Las pruebas visuales deben pasar antes de hacer merge
- Usar commits semánticos para changelog automático