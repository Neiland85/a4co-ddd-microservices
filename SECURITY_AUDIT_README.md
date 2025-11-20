# 🔐 Seguridad del Proyecto

## Configuración de Auditorías de Seguridad

Este documento explica cómo configurar y ejecutar auditorías de seguridad periódicas para el proyecto.

## 🛠️ Scripts Disponibles

### Auditorías Manuales

```bash
# Auditoría completa de seguridad
pnpm run security:audit

# Revisión de permisos del repositorio (requiere GitHub CLI)
pnpm run security:review-permissions

# Rotación de JWT secret
pnpm run security:rotate-jwt

# Rotación de database password
DB_PASSWORD="current_password" pnpm run security:rotate-db

# Auditoría programada (para uso con cron)
pnpm run security:scheduled-audit
```

## ⏰ Configuración de Auditorías Periódicas

### Opción 1: GitHub Actions (Recomendado)

El workflow `.github/workflows/security.yml` ejecuta auditorías automáticamente:

- **En cada PR**: Escaneo básico de secrets
- **En cada push**: Verificación de secrets
- **Semanalmente**: Auditoría completa los domingos a las 2 AM UTC

### Opción 2: Cron Job Local (Desarrollo)

Para configurar auditorías semanales en tu máquina local:

```bash
# Editar crontab
crontab -e

# Agregar esta línea para ejecutar los domingos a las 2 AM
0 2 * * 0 cd /path/to/project && ./scripts/scheduled-security-audit.sh
```

### Opción 3: CI/CD Pipeline

El workflow de CI (`.github/workflows/ci.yml`) incluye escaneo de secrets en cada build.

## 📊 Reportes de Seguridad

### Ubicación de Reportes

- **GitHub Actions**: Los reportes se suben como artifacts en cada ejecución
- **Local**: Los logs se almacenan en `logs/security-audit-YYYYMMDD.log`
- **Trivy**: Resultados SARIF se suben automáticamente a la pestaña Security

### Interpretación de Resultados

#### ✅ Estados Positivos

- `No se encontraron secrets hardcodeados`
- `Permisos correctos en archivos`
- `Hook de escaneo de secrets configurado`

#### ⚠️ Advertencias

- Archivos con permisos demasiado permisivos
- .gitignore incompleto
- Colaboradores con permisos excesivos

#### ❌ Estados Críticos

- Secrets hardcodeados encontrados
- Archivos sensibles sin protección
- Branch protection no configurado

## 🔧 Configuración Avanzada

### Personalización de Reglas Gitleaks

Edita `.gitleaks.toml` para:

- Agregar nuevos patrones de secrets
- Modificar listas de allowlist
- Ajustar reglas de entropía

### Configuración de Permisos

Archivos críticos deben tener permisos `600`:

```bash
chmod 600 .env* apps/*/src/config/configuration.ts
```

### Variables de Entorno Requeridas

Para rotación de credenciales:

```bash
# JWT
JWT_SECRET="current_secret"

# Database
DB_USER="postgres"
DB_PASSWORD="current_password"
DB_HOST="localhost"

# GitHub CLI
GITHUB_TOKEN="ghp_..."  # Para operaciones con API
```

## 🚨 Respuesta a Incidentes

### Detección de Secrets Comprometidos

1. **Detener** todos los servicios afectados
2. **Rotar** credenciales usando los scripts proporcionados
3. **Auditar** logs de acceso reciente
4. **Notificar** al equipo de seguridad
5. **Monitorear** actividad sospechosa

### Recuperación

1. Ejecutar auditoría completa: `pnpm run security:audit`
2. Revisar permisos: `pnpm run security:review-permissions`
3. Rotar credenciales comprometidas
4. Verificar que todos los servicios funcionen

## 📚 Documentación Relacionada

- `docs/SECURITY_ACCESS_GUIDE.md` - Guía de permisos de acceso
- `docs/CREDENTIAL_ROTATION_GUIDE.md` - Guía de rotación de credenciales
- `.gitleaks.toml` - Configuración de reglas de secrets
- `.gitignore` - Patrones de archivos ignorados

## 🤝 Mejores Prácticas

- ✅ Ejecutar auditorías antes de cada release
- ✅ Rotar credenciales cada 90 días
- ✅ Revisar permisos de colaboradores mensualmente
- ✅ Monitorear alertas de seguridad activamente
- ✅ Mantener documentación de seguridad actualizada

---

_Configura estas auditorías para mantener la seguridad del proyecto a largo plazo._
