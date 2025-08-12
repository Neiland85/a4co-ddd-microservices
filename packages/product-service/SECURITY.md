# 🔒 Seguridad del Product Service

## Resumen de Seguridad

El Product Service implementa múltiples capas de seguridad para proteger contra ataques comunes y garantizar la integridad de los datos.

## 🛡️ Capas de Seguridad Implementadas

### 1. Rate Limiting (Limitación de Peticiones)

#### Configuración por Tipo de Endpoint:

- **Endpoints Públicos** (GET): 60 peticiones/minuto
  - `/products` - Listado de productos
  - `/products/:id` - Obtener producto específico
  - `/health` - Health check
  - `/docs` - Documentación

- **Endpoints Críticos** (POST/PUT/DELETE): 10 peticiones/minuto
  - `/products` - Crear producto
  - `/products/:id` - Actualizar/eliminar producto

- **Rate Limiting General**: 100 peticiones/15 minutos

#### Headers de Respuesta:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640995200
Retry-After: 60
```

### 2. Validación de Entrada

#### Sanitización Automática:
- Eliminación de caracteres peligrosos (`<`, `>`)
- Trim de espacios en blanco
- Validación de tipos de datos

#### Reglas de Validación:
```typescript
name: 1-100 caracteres (requerido)
category: 1-50 caracteres (requerido)
price: número positivo (requerido)
description: máximo 500 caracteres (opcional)
```

### 3. Headers de Seguridad

#### Headers Implementados:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: default-src 'self'
```

### 4. Detección de Ataques

#### Patrones Detectados:
- Inyección de scripts (`<script>`, `javascript:`)
- Event handlers maliciosos (`onclick`, `onload`)
- Inyección SQL básica (`UNION SELECT`, `DROP TABLE`)
- XSS básico

#### Respuesta a Ataques:
```json
{
  "error": "Forbidden",
  "message": "Request blocked for security reasons"
}
```

### 5. Logging de Seguridad

#### Eventos Registrados:
- Peticiones que exceden rate limits
- Intentos de ataque detectados
- Errores de validación
- Peticiones sospechosas (>5 segundos)

#### Formato de Log:
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "method": "POST",
  "path": "/products",
  "statusCode": 429,
  "duration": "150ms",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "contentLength": "1024"
}
```

## 🔧 Configuración de Seguridad

### Variables de Entorno:
```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS

# Seguridad
NODE_ENV=production
LOG_LEVEL=info
```

### Middleware de Seguridad:
1. **Helmet**: Headers de seguridad HTTP
2. **CORS**: Control de acceso cross-origin
3. **Compression**: Compresión de respuestas
4. **Morgan**: Logging de peticiones
5. **Express Validator**: Validación de entrada
6. **Rate Limiting**: Limitación de peticiones

## 📊 Monitoreo de Seguridad

### Métricas a Monitorear:
- Número de peticiones bloqueadas por rate limiting
- Intentos de ataque detectados
- Tiempo de respuesta promedio
- Errores de validación
- Uso de memoria y CPU

### Alertas Recomendadas:
- Más de 100 peticiones bloqueadas por hora
- Múltiples intentos de ataque desde la misma IP
- Tiempo de respuesta > 5 segundos
- Errores de validación > 10% de las peticiones

## 🚨 Respuesta a Incidentes

### Escalación de Seguridad:
1. **Nivel 1**: Rate limiting excedido
   - Log automático
   - Respuesta 429

2. **Nivel 2**: Ataque detectado
   - Log de seguridad
   - Bloqueo temporal de IP
   - Notificación al equipo

3. **Nivel 3**: Ataque masivo
   - Bloqueo de IP
   - Escalación inmediata
   - Análisis forense

### Comandos de Emergencia:
```bash
# Ver logs de seguridad
grep "Security warning" /var/log/product-service.log

# Bloquear IP específica
iptables -A INPUT -s IP_ADDRESS -j DROP

# Reiniciar servicio
pm2 restart product-service
```

## 🔄 Actualizaciones de Seguridad

### Proceso de Actualización:
1. Revisar dependencias vulnerables: `npm audit`
2. Actualizar dependencias: `npm update`
3. Ejecutar tests de seguridad
4. Desplegar en ambiente de staging
5. Monitorear comportamiento
6. Desplegar en producción

### Dependencias de Seguridad:
- `express-rate-limit`: Rate limiting
- `helmet`: Headers de seguridad
- `express-validator`: Validación
- `cors`: Control CORS
- `compression`: Compresión segura

## 📚 Recursos Adicionales

### Documentación:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
- [Rate Limiting Strategies](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)

### Herramientas de Testing:
- [OWASP ZAP](https://owasp.org/www-project-zap/)
- [Burp Suite](https://portswigger.net/burp)
- [Nmap](https://nmap.org/)

---

**Última actualización**: Enero 2024  
**Versión**: 1.0.0  
**Responsable**: Equipo de Seguridad A4CO 