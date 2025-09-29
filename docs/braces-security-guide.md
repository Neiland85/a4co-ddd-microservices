# Guía de Seguridad: Protección contra Ataques de Expansión de Braces

## 📋 Resumen Ejecutivo

Esta guía documenta el framework de seguridad implementado para proteger la plataforma A4CO contra ataques de **expansión de braces** (brace expansion attacks), una vulnerabilidad de seguridad crítica que puede causar denegación de servicio (DoS) por agotamiento de recursos.

### 🎯 Objetivo

Prevenir ataques que explotan expresiones como `{1..1000000}` o `{a,b,c}` causando expansión masiva de texto que consume CPU, memoria y puede colapsar sistemas.

## 🏗️ Arquitectura de Seguridad

### Componentes Principales

#### 1. **Validador Core** (`BracesSecurityValidator`)

```typescript
import { BracesSecurityFactory } from '@a4co/shared-utils';

const validator = BracesSecurityFactory.createValidator({
  maxExpansionSize: 1000, // Máximo elementos expandidos
  maxRangeSize: 100, // Máximo tamaño de rango {1..N}
  timeoutMs: 5000, // Timeout de procesamiento
  monitoringEnabled: true, // Habilitar monitoreo
});

// Validar expresión
const result = await validator.validateExpression('{1..100}');
if (!result.isSafe) {
  console.log('Expresión bloqueada:', result.issues);
}
```

#### 2. **Middleware Web** (`BracesSecurityMiddleware`)

```typescript
import { BracesSecurityMiddleware } from '@a4co/shared-utils';

// En main.ts de cada servicio
const bracesMiddleware = new BracesSecurityMiddleware(
  {
    maxExpansionSize: 50,
    maxRangeSize: 10,
  },
  'auth-service'
);

// Aplicar middleware
app.use(bracesMiddleware.validateRequestBody(['query', 'command']));
app.use(bracesMiddleware.validateQueryParams(['q', 'search']));
```

#### 3. **Sistema de Monitoreo** (`BracesSecurityMonitor`)

```typescript
import { BracesSecurityMonitorFactory } from '@a4co/shared-utils';

const monitor = BracesSecurityMonitorFactory.getMonitor('auth-service');

// El middleware registra automáticamente:
// - Solicitudes procesadas
// - Ataques detectados
// - Métricas de rendimiento

// Obtener métricas
const metrics = monitor.getMetrics();
console.log(`${metrics.blockedRequests} solicitudes bloqueadas`);
```

## 🚨 Tipos de Ataques Detectados

### 1. **Expansión de Rangos** (CRÍTICO)

```bash
# PELIGROSO - Crea 1 millón de elementos
{1..1000000}

# PELIGROSO - Rangos grandes
{1..10000}
```

### 2. **Expansión de Listas** (ALTO)

```bash
# PELIGROSO - Combinaciones masivas
{a,b,c,d,e,f,g,h,i,j}{1,2,3,4,5}
```

### 3. **Expansión Anidada** (ALTO)

```bash
# PELIGROSO - Anidamiento profundo
{{1..10},{a..z}}
```

## 🔧 Integración en Servicios

### Configuración Automática

Los servicios principales ya tienen el middleware integrado automáticamente:

- ✅ `auth-service`
- ✅ `user-service`
- ✅ `product-service`
- ✅ `order-service`
- ✅ `payment-service`

### Verificación de Integración

```bash
# Ejecutar script de verificación
node scripts/integrate-braces-middleware.js
```

### Configuración Manual (si es necesario)

```typescript
// En main.ts
import { BracesSecurityMiddleware } from '@a4co/shared-utils';

const bracesMiddleware = new BracesSecurityMiddleware({}, 'mi-servicio');

// Middleware de aplicación (todas las rutas)
app.use(bracesMiddleware.validateRequestBody());
app.use(bracesMiddleware.validateQueryParams());

// Middleware específico para rutas
app.post('/api/search', bracesMiddleware.validateRequestBody(['query']));
```

## 📊 Monitoreo y Alertas

### Métricas Disponibles

```typescript
const metrics = monitor.getMetrics();

console.log('Métricas de seguridad:');
console.log(`- Total requests: ${metrics.totalRequests}`);
console.log(`- Blocked requests: ${metrics.blockedRequests}`);
console.log(`- Average processing time: ${metrics.averageProcessingTime}ms`);
console.log(`- Peak memory usage: ${metrics.peakMemoryUsage}MB`);
console.log(`- Alerts triggered: ${metrics.alertsTriggered}`);
```

### Alertas Automáticas

El sistema genera alertas para:

- **CRÍTICO**: Ataques de expansión masiva detectados
- **ALTO**: Múltiples intentos de bypass
- **MEDIO**: Errores de procesamiento de seguridad
- **BAJO**: Patrones sospechosos detectados

### Dashboard de Monitoreo

```typescript
// Obtener métricas globales
const globalMetrics = BracesSecurityMonitorFactory.getGlobalMetrics();

// Obtener alertas recientes
const alerts = monitor.getRecentAlerts(10);

// Obtener estadísticas por severidad
const alertStats = monitor.getAlertStats();
```

## 🧪 Testing y Validación

### Tests Automáticos

```bash
# Ejecutar tests de seguridad de braces
pnpm test -- --testPathPattern=braces

# Ejecutar validación en todo el proyecto
./validate-braces.js --path .
```

### Tests Manuales

```typescript
// Test de expresiones peligrosas
const dangerousExpressions = [
  '{1..100000}', // Rango grande
  '{a,b,c}{1,2,3}', // Combinaciones
  '{{1..10}}', // Anidamiento
];

for (const expr of dangerousExpressions) {
  const result = await validator.validateExpression(expr);
  console.log(`${expr}: ${result.isSafe ? 'SAFE' : 'BLOCKED'}`);
}
```

## 🚫 Patrones Prohibidos

### ❌ NO HACER

```typescript
// NO: Procesar entrada de usuario sin validación
const userInput = req.body.query;
const result = eval(userInput); // PELIGROSO

// NO: Usar expansión de shell sin control
const command = `echo ${userInput}`; // PELIGROSO si userInput contiene braces
execSync(command);

// NO: Expansión directa en código
const items = '{1..1000}'.split(' '); // PELIGROSO
```

### ✅ HACER

```typescript
// SÍ: Validar antes de procesar
const validation = await validator.validateExpression(req.body.query);
if (!validation.isSafe) {
  return res.status(400).json({ error: 'Invalid expression' });
}

// SÍ: Usar sanitización
const sanitizer = new BracesSanitizer();
const safeExpression = await sanitizer.sanitizeExpression(userInput);

// SÍ: Arrays controlados
const safeItems = Array.from({ length: 100 }, (_, i) => i + 1);
```

## 🔧 Configuración Avanzada

### Límites Personalizados

```typescript
const strictConfig = {
  maxExpansionSize: 10, // Muy restrictivo
  maxRangeSize: 5, // Rangos pequeños
  maxBraceDepth: 1, // Sin anidamiento
  timeoutMs: 100, // Procesamiento rápido
  blockedPatterns: [
    /^\{.*\.\..*\}$/, // Bloquear todos los rangos
    /^\{.*,.*\}$/, // Bloquear todas las listas
  ],
};
```

### Patrones Permitidos

```typescript
const permissiveConfig = {
  allowedPatterns: [
    /^\{\d+\.\.\d+\}$/, // Solo rangos numéricos
    /^\{[a-zA-Z],[a-zA-Z]\}$/, // Solo letras simples
  ],
  blockedPatterns: [
    /\{.*\.\..*\}.*/, // Bloquear rangos complejos
  ],
};
```

## 📈 CI/CD Integration

### Pipeline Configuration

```yaml
# En .github/workflows/security.yml
- name: Braces Security Validation
  run: node scripts/braces-security-ci.js

- name: Security Tests
  run: pnpm test -- --testPathPattern=braces

- name: Upload Security Report
  uses: actions/upload-artifact@v3
  with:
    name: security-report
    path: security-report.json
```

### Pre-commit Hooks

```bash
# En package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "node scripts/braces-security-ci.js"
    }
  }
}
```

## 📞 Soporte y Contacto

### Equipos Responsables

- **Security Team**: Para vulnerabilidades críticas
- **DevOps Team**: Para configuración de monitoreo
- **Development Teams**: Para integración en nuevos servicios

### Reportar Incidente

1. **Crítico**: Contactar inmediatamente al equipo de seguridad
2. **Alto**: Crear issue en repositorio con etiqueta `security`
3. **Medio/Bajo**: Documentar en próximos sprint planning

### Documentación Relacionada

- [API Security Guidelines](./api-security.md)
- [Input Validation Standards](./input-validation.md)
- [Monitoring Setup](./monitoring-setup.md)

---

## 📋 Checklist de Implementación

### Para Nuevos Servicios

- [ ] Importar `BracesSecurityMiddleware`
- [ ] Configurar middleware en `main.ts`
- [ ] Verificar integración con `integrate-braces-middleware.js`
- [ ] Agregar tests de seguridad
- [ ] Configurar alertas específicas del servicio

### Para Desarrollo Diario

- [ ] Validar expresiones antes de procesar
- [ ] Usar sanitización para contenido generado por usuario
- [ ] Monitorear métricas de seguridad
- [ ] Reportar falsos positivos al equipo de seguridad

### Para Deployments

- [ ] Ejecutar validación CI/CD
- [ ] Verificar que no hay vulnerabilidades críticas
- [ ] Confirmar configuración de alertas
- [ ] Documentar cambios de seguridad

---

_Última actualización: $(date)_
