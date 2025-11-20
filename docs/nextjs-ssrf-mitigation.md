# Mitigación de Vulnerabilidades SSRF en Next.js

## Resumen

Este documento describe las mitigaciones implementadas para la vulnerabilidad
**Improper middleware redirect → SSRF (Moderate)** en aplicaciones Next.js.

## Arquitectura de Seguridad

### 1. Validadores de Seguridad

- `URLValidator`: Valida URLs para prevenir redirecciones peligrosas
- `IPRangeBlocker`: Bloquea rangos IP internos y metadatos cloud

### 2. Utilidades de Seguridad

- `SSRFSecurityUtils`: Funciones helper para validación y sanitización
- `NextJSMiddlewareProtector`: Middleware protector para Next.js

### 3. Middleware de Protección

- Protección automática en middleware de Next.js
- Validación de headers de redirección
- Bloqueo de requests a servicios internos

## Rangos IP Bloqueados

### RFC1918 (Redes Privadas)

- `10.0.0.0/8` - Clase A privada
- `172.16.0.0/12` - Clase B privada
- `192.168.0.0/16` - Clase C privada

### Metadatos Cloud

- `169.254.169.254` - AWS IMDS
- `168.63.129.16` - Azure IMDS
- `metadata.google.internal` - GCP Metadata
- `192.0.0.192` - Oracle Cloud
- `100.100.100.200` - Alibaba Cloud

### Otros

- `127.0.0.0/8` - Loopback
- `169.254.0.0/16` - Link-local

## Uso en Código

### Middleware Next.js

```typescript
// middleware.ts
import { protectSSRF } from '@a4co/shared-utils';

export function middleware(request: NextRequest) {
  // Proteger contra SSRF
  const protection = protectSSRF(request);
  if (protection) {
    return protection; // Retorna respuesta de error si es necesario
  }

  // Continuar con la lógica normal
  return NextResponse.next();
}
```

### Validación Manual de URLs

```typescript
import { URLValidator, SSRFSecurityUtils } from '@a4co/shared-utils';

// Validar URL antes de redirigir
const validation = URLValidator.validateURL(userProvidedURL);
if (!validation.isValid) {
  throw new Error(`Invalid URL: ${validation.violations.join(', ')}`);
}

// Usar fetch seguro
const response = await SSRFSecurityUtils.safeFetch(apiURL);
```

### Headers de Seguridad

```typescript
import { SSRFSecurityUtils } from '@a4co/shared-utils';

export default function Layout({ children }) {
  return (
    <html>
      <head>
        {Object.entries(SSRFSecurityUtils.generateSecureHeaders()).map(([key, value]) => (
          <meta key={key} httpEquiv={key} content={value} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Configuración de Allowlist

### Configurar Dominios Permitidos

```typescript
import { NextJSMiddlewareProtector } from '@a4co/shared-utils';

// Configurar allowlist
NextJSMiddlewareProtector.setAllowlist(['*.miapp.com', 'api.miapp.com', 'cdn.miapp.com']);
```

## Detección y Monitoreo

### Logs de Seguridad

El sistema automáticamente registra eventos de seguridad:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "ssrf_attempt",
  "url": "http://169.254.169.254/latest/meta-data/",
  "violations": ["Blocked IP range: 169.254.169.254"],
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "severity": "HIGH"
}
```

### Métricas a Monitorear

- Número de intentos de SSRF bloqueados
- URLs más comunes en intentos de ataque
- IPs de origen de ataques
- Tipos de violaciones detectadas

## Testing

### Ejecutar Tests SSRF

```bash
pnpm run test:ssrf
```

### Tests Incluidos

- Validación de URLs seguras vs peligrosas
- Bloqueo de rangos IP internos
- Sanitización de URLs
- Validación de parámetros de query
- Headers de seguridad

## Mejores Prácticas

### 1. Validación de Input

- Siempre validar URLs antes de usarlas en redirecciones
- Usar allowlists para dominios permitidos
- Sanitizar URLs removiendo credenciales y fragments

### 2. Arquitectura de Red

- Implementar egress filtering en el nivel de red
- Usar proxies reversos con validación
- Configurar firewalls para bloquear tráfico interno

### 3. Headers de Seguridad

- Implementar Content Security Policy (CSP)
- Usar X-Frame-Options y X-Content-Type-Options
- Configurar Referrer-Policy apropiada

### 4. Monitoreo Continuo

- Logs de todas las redirecciones y requests externos
- Alertas automáticas para patrones sospechosos
- Revisión periódica de allowlists

## Casos de Uso Comunes

### Redirección Después de Login

```typescript
// ❌ INSEGURO
export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get('redirect');
  return NextResponse.redirect(redirectTo);
}

// ✅ SEGURO
export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get('redirect');

  const validation = URLValidator.validateURL(redirectTo);
  if (!validation.isValid) {
    return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 });
  }

  return NextResponse.redirect(redirectTo);
}
```

### API Calls Externos

```typescript
// ❌ INSEGURO
const response = await fetch(userProvidedURL);

// ✅ SEGURO
const safetyCheck = SSRFSecurityUtils.isSafeForFetch(userProvidedURL);
if (!safetyCheck.isSafe) {
  throw new Error(`Unsafe URL: ${safetyCheck.reason}`);
}

const response = await SSRFSecurityUtils.safeFetch(userProvidedURL);
```

## Respuesta a Incidentes

### Si se detecta SSRF

1. **Bloquear**: Agregar la URL/IP a listas de bloqueo
2. **Investigar**: Revisar logs para encontrar el vector de ataque
3. **Mitigar**: Actualizar validaciones y filtros
4. **Monitorear**: Aumentar vigilancia en endpoints similares

### Contactos de Emergencia

- Security Team: security@company.com
- DevOps: devops@company.com
- Platform Team: platform@company.com

---

_Esta documentación se actualiza automáticamente con cada cambio en el sistema de seguridad SSRF._
