# Mitigaciones de Seguridad - tar-fs Symlink Validation Bypass

## 🚨 Vulnerabilidad Identificada

**CVE**: tar-fs Symlink validation bypass (High)
**Vector**: Extracción de tarballs maliciosos con symlinks que apuntan fuera del directorio objetivo
**Impacto**: Sobrescritura de archivos críticos, leak de credenciales, posible RCE

## 🛡️ Mitigaciones Implementadas

### 1. **Utilidad de Seguridad Principal** (`packages/shared-utils/src/security/tar-security.ts`)

#### `SecureTarHandler` - Clase principal de validación y extracción segura

```typescript
import { secureTarHandler } from '@a4co/shared-utils';

// Validar archivo tar antes de extraer
const validation = await secureTarHandler.validateTarFile('archivo.tar');
if (!validation.isValid) {
  throw new Error(`Archivo no seguro: ${validation.errors.join(', ')}`);
}

// Extraer de forma segura
const result = await secureTarHandler.extractSecurely('archivo.tar', '/tmp/safe', {
  createSandbox: true,
  validateChecksum: true,
  checksumFile: 'archivo.tar.sha256',
});
```

#### Características de Seguridad:

- ✅ **Validación de extensiones**: Solo archivos `.tar`, `.tar.gz`, `.tgz`, etc.
- ✅ **Límite de tamaño**: Máximo 100MB por defecto
- ✅ **Detección de symlinks peligrosos**: Bloquea symlinks que apunten a rutas críticas
- ✅ **Prevención de directory traversal**: Detecta y bloquea `../` en paths
- ✅ **Validación de caracteres peligrosos**: Bloquea caracteres de control y especiales
- ✅ **Extracción en sandbox**: Opcional, crea directorio aislado
- ✅ **Validación de checksum**: Verificación de integridad opcional
- ✅ **Monitoreo de cambios**: Detección de modificaciones en archivos sensibles

### 2. **Middleware de Seguridad** (`TarSecurityMiddleware`)

```typescript
import { tarSecurityMiddleware } from '@a4co/shared-utils';

// Hooks para interceptar operaciones
await tarSecurityMiddleware.beforeExtract(tarPath, targetDir);
await tarSecurityMiddleware.afterExtract(extractedFiles);
```

### 3. **Scripts de Línea de Comandos**

#### Validación de archivos tar:

```bash
# Validar archivo tar
node scripts/validate-tar.js archivo.tar

# Salida esperada:
🔍 Validando archivo tar: archivo.tar
==================================================
✅ Archivo tar VALIDADO - Seguro para extraer
```

#### Extracción segura:

```bash
# Extraer con sandbox
node scripts/extract-tar-secure.js archivo.tar /tmp/destino --sandbox

# Salida esperada:
🔒 Extrayendo archivo tar de forma segura:
   Origen: archivo.tar
   Destino: /tmp/destino
   Sandbox: SÍ
============================================================
✅ Extracción completada exitosamente
📁 Archivos extraídos: 15
```

## 🔧 Configuración del Sistema

### Variables de Entorno para Monitoreo:

```bash
# Archivos a monitorear después de extracción
export TAR_SECURITY_WATCH_PATHS="/etc/passwd,/app/.env,/app/config"
```

### Configuración de Límites:

```typescript
const secureHandler = new SecureTarHandler();
// Personalizar límites
secureHandler.maxFileSize = 50 * 1024 * 1024; // 50MB
secureHandler.maxPathLength = 200; // Paths más cortos
```

## 📋 Checklist de Seguridad

### Antes de Extraer:

- [ ] Validar con `secureTarHandler.validateTarFile()`
- [ ] Verificar checksum si disponible
- [ ] Usar sandbox para extracciones no confiables
- [ ] Monitorear cambios en archivos sensibles

### Durante Extracción:

- [ ] Usar opciones de seguridad de tar (`--no-same-owner`, `--no-overwrite-dir`)
- [ ] Ejecutar con usuario no privilegiado
- [ ] Extraer en directorio temporal primero

### Después de Extracción:

- [ ] Verificar integridad de archivos críticos
- [ ] Escanear por malware/backdoors
- [ ] Limpiar archivos temporales
- [ ] Loggear operación para auditoría

## 🚦 Estados de Riesgo

| Nivel          | Descripción                            | Acción Requerida    |
| -------------- | -------------------------------------- | ------------------- |
| 🔴 **CRÍTICO** | Symlinks a `/etc`, `/root`, `/usr/bin` | BLOQUEAR EXTRACTION |
| 🟠 **ALTO**    | Symlinks a `/app/.env`, `/app/config`  | EXTRAER EN SANDBOX  |
| 🟡 **MEDIO**   | Paths absolutos o con `../`            | REVISAR MANUALMENTE |
| 🟢 **BAJO**    | Archivos normales sin symlinks         | EXTRAER NORMALMENTE |

## 🔍 Detección y Monitoreo

### Logs a Monitorear:

```
# Symlinks peligrosos detectados
# Directory traversal attempts
# Extracciones de archivos grandes
# Cambios en archivos sensibles post-extracción
```

### Métricas a Recopilar:

- Número de archivos tar procesados
- Tasa de archivos bloqueados por seguridad
- Tipos de vulnerabilidades detectadas
- Tiempo de procesamiento de validaciones

## 🧪 Testing

### Tests Unitarios:

```typescript
describe('SecureTarHandler', () => {
  it('should block dangerous symlinks', async () => {
    // Test con tar que contiene symlink a /etc/passwd
  });

  it('should allow safe extractions', async () => {
    // Test con tar normal
  });
});
```

### Tests de Integración:

```bash
# Crear tar malicioso para testing
echo "malicious content" > /tmp/malicious.txt
tar -cf test.tar --transform 's|.*/||' /tmp/malicious.txt
ln -s /etc/passwd malicious_link
tar -rf test.tar malicious_link

# Probar detección
node scripts/validate-tar.js test.tar
# Debería fallar con "Symlink peligroso detectado"
```

## 📚 Referencias

- [NIST CVE Database](https://nvd.nist.gov/vuln/detail/CVE-XXXX-XXXX)
- [OWASP Archive Extraction](https://owasp.org/www-community/vulnerabilities/Archive_Extraction)
- [Node.js tar-fs Security](https://github.com/npm/node-tar/security)

---

_Implementación completa de mitigaciones para vulnerabilidad tar-fs symlink bypass_
