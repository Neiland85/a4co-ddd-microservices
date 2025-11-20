# Mitigación de Vulnerabilidades en Dev Servers

## Resumen

Este documento describe las mitigaciones implementadas para la vulnerabilidad **esbuild — Dev server accepts arbitrary requests and leaks responses (Moderate)**.

## Arquitectura de Seguridad

### 1. Validadores de Seguridad

- `DevServerValidator`: Valida configuraciones de host, puerto y CORS
- `DevServerSecurityUtils`: Utilidades para generar configuraciones seguras
- `DevServerProtector`: Middleware de protección para diferentes frameworks

### 2. Configuraciones Seguras Generadas

- **Vite**: Configuración con host 127.0.0.1 y CORS restrictivo
- **Next.js**: Headers de seguridad y configuración de desarrollo segura
- **esbuild**: Servidor con logging de requests externos

### 3. Middleware de Protección

- Bloqueo automático de requests desde IPs externas en desarrollo
- Headers de seguridad aplicados automáticamente
- Logging de eventos de seguridad

## Configuraciones Inseguras Detectadas

### Host Configuration

- `host: '0.0.0.0'`: Permite conexiones desde cualquier interfaz
- Host no especificado: Puede usar configuración por defecto insegura
- IPs públicas: Accesibles desde internet

### CORS Configuration

- `origin: '*'`: Permite requests desde cualquier dominio
- `credentials: true`: Permite envío de cookies/autenticación

### Puertos de Desarrollo

Puertos comunes que representan alto riesgo si son accesibles externamente:

- 3000, 3001 (Next.js, Vite)
- 4000, 5000 (Create React App)
- 8000, 8080 (Django, otros)
- 9000, 9090 (Vite, otros)

## Uso en Código

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { createVitePlugin } from '@a4co/shared-utils';

export default defineConfig({
  plugins: [createVitePlugin()],
  server: {
    host: '127.0.0.1', // ✅ Seguro
    port: 3000,
    cors: false // ✅ Deshabilitar CORS en desarrollo
  }
});
```

### Next.js Configuration

```typescript
// next.config.js
import { generateSecureNextConfig } from '@a4co/shared-utils';

/** @type {import('next').NextConfig} */
const nextConfig = generateSecureNextConfig();

export default nextConfig;
```

### Express.js Middleware

```typescript
import express from 'express';
import { DevServerProtector } from '@a4co/shared-utils';

const app = express();

// Agregar protección de dev server
app.use(DevServerProtector.createExpressMiddleware());

app.listen(3000, '127.0.0.1'); // ✅ Solo localhost
```

### esbuild Configuration

```typescript
import * as esbuild from 'esbuild';
import { generateSecureEsbuildConfig } from '@a4co/shared-utils';

const config = generateSecureEsbuildConfig();
await esbuild.build(config);
```

## Verificación de Seguridad

### Ejecutar Verificación Automática

```bash
pnpm run check:dev-security
```

### Ejecutar Tests de Seguridad

```bash
pnpm run test:dev-security
```

### Verificación Manual

```bash
# Verificar procesos en puertos de desarrollo
netstat -tulpn | grep -E ':(3000|3001|4000|5000|8000|8080|9000|9090) '

# Verificar configuraciones
grep -r "host.*0\.0\.0\.0" .
grep -r "origin.*\*" .
```

## Detección y Monitoreo

### Logs de Seguridad

Los eventos de seguridad se registran automáticamente:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "dev_server_security",
  "event": "unauthorized_dev_access",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "url": "/api/config",
  "severity": "HIGH",
  "details": {
    "method": "GET",
    "headers": {
      "host": "localhost:3000",
      "user-agent": "[REDACTED SENSITIVE INFO]"
    }
  }
}
```

### Métricas a Monitorear

- Número de requests bloqueados desde IPs externas
- IPs de origen de requests no autorizados
- URLs más accedidas por requests externos
- Tipos de user agents detectados

## Mejores Prácticas

### 1. Configuración de Desarrollo

- **Host**: Siempre usar `127.0.0.1` o `localhost`
- **Puerto**: Usar puertos no estándar para desarrollo
- **CORS**: Deshabilitar o configurar restrictivamente
- **HTTPS**: Considerar HTTPS local para desarrollo

### 2. Arquitectura de Red

- **Firewall**: Bloquear puertos de desarrollo en nivel de red
- **VPN/Túnel**: Usar SSH port forwarding para acceso remoto
- **Contenedores**: Aislar dev servers en contenedores con networking restringido

### 3. Gestión de Secrets

- **Variables de entorno**: Nunca hardcodear secrets
- **Archivos .env**: No commitear archivos con secrets reales
- **Separación**: Entornos de desarrollo sin acceso a secrets de producción

### 4. Monitoreo Continuo

- **Logs**: Monitorear requests a dev servers
- **Alertas**: Notificaciones automáticas para acceso no autorizado
- **Auditoría**: Revisión periódica de configuraciones

## Casos de Uso Comunes

### Desarrollo Local Seguro

```typescript
// ✅ SEGURO: Configuración recomendada
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3000,
    cors: false,
    open: false
  },
  plugins: [devServerSecurityPlugin()]
});
```

### Acceso Remoto Seguro (SSH Tunnel)

```bash
# En máquina local
ssh -L 3000:localhost:3000 user@remote-server

# En servidor remoto (desarrollo)
npm run dev -- --host 127.0.0.1 --port 3000
```

### Contenedores de Desarrollo

```dockerfile
# Dockerfile.dev
FROM node:18
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# docker-compose.dev.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "127.0.0.1:3000:3000"  # ✅ Solo localhost
    networks:
      - dev-network

networks:
  dev-network:
    driver: bridge
    internal: true  # ✅ Red interna
```

## Respuesta a Incidentes

### Si se detecta acceso no autorizado

1. **Bloquear**: Agregar IP a lista negra temporal
2. **Investigar**: Revisar logs para entender el vector de ataque
3. **Mitigar**: Cambiar configuración a modo seguro
4. **Notificar**: Alertar al equipo de desarrollo

### Contactos de Emergencia

- Security Team: security@company.com
- DevOps: devops@company.com
- Platform Team: platform@company.com

---

_Esta documentación se actualiza automáticamente con cada cambio en el sistema de seguridad de dev servers._
