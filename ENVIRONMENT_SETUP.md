# 🔐 Configuración de Variables de Entorno

## 📋 Resumen de Cambios de Seguridad

Este documento detalla cómo configurar correctamente las variables de entorno para evitar exponer secretos hardcodeados en el repositorio.

> **Última actualización**: Incluye correcciones de PR #220 y #224

## 🚨 Problemas Resueltos

Se eliminaron los siguientes secretos hardcodeados del código:

### PR #224:
1. ✅ Contraseñas de prueba en `apps/auth-service/test/test.config.ts`
2. ✅ Credenciales de PostgreSQL en `compose.dev.yaml`

### PR #220:
3. ✅ Contraseña hardcodeada en `setup-docker-secrets.sh`
4. ✅ Credenciales de PostgreSQL en `.devcontainer/docker-compose.dev.yml`
5. ✅ JWT Secret hardcodeado en `.devcontainer/docker-compose.dev.yml`
6. ✅ Contraseña de Grafana en `.devcontainer/docker-compose.dev.yml`

## � Required Environment Variables

### Database
- `DB_PASSWORD`: Database password (generate securely, do not hardcode)

### Observability
- `JAEGER_ENDPOINT`: Jaeger tracing endpoint (default: http://localhost:14268/api/traces)
- `GRAFANA_ADMIN_PASSWORD`: Grafana admin password (generate securely)
- `PROMETHEUS_ADMIN_PASSWORD`: Prometheus admin password (generate securely)

### Security Notes
- Never commit real values to `.env` or `.env.example`.
- Use GitHub Secrets for CI/CD (e.g., `${{ secrets.DB_PASSWORD }}`).
- OpenTelemetry configuration uses `process.env.JAEGER_ENDPOINT`.

## �🔧 Configuración Local

### 1. Variables para Docker Compose (compose.dev.yaml)

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_ME_IN_DOT_ENV
POSTGRES_DB=a4co_db
```

### 2. Variables para DevContainer (.devcontainer/docker-compose.dev.yml)

Crea un archivo `.env` en el directorio `.devcontainer/` con las siguientes variables:

```bash
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_ME_IN_DOT_ENV
POSTGRES_DB=a4co_dev

# JWT Secret
JWT_SECRET=CHANGE_ME_IN_DOT_ENV_MIN_32_CHARS

# Grafana Admin
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=CHANGE_ME_IN_DOT_ENV
```

**Nota**: Los archivos `.env` nunca deben ser commiteados al repositorio (están en `.gitignore`).

### 3. Variables para Tests

Opcionalmente, puedes configurar credenciales personalizadas para tests:

```bash
# Test Credentials (opcional)
TEST_USERNAME=custom_test_user
TEST_PASSWORD=custom_test_password
TEST_EMAIL=custom@test.example.com
```

**Nota**: Si no se configuran estas variables, se usarán valores mock seguros por defecto que no activarán alertas de seguridad.

### 4. Script de Docker Secrets

Para configurar secretos de Docker Swarm, usa el script `setup-docker-secrets.sh`:

```bash
# Configurar las credenciales como variables de entorno
DB_USER="readonly_user" DB_PASSWORD="CHANGE_ME_IN_DOT_ENV" ./setup-docker-secrets.sh
```

**Importante**: Este script valida que las variables de entorno estén definidas antes de ejecutarse.

---

## 🐳 Uso con Docker

### Docker Compose

Los archivos `compose.dev.yaml` y `.devcontainer/docker-compose.dev.yml` ahora leen las credenciales desde variables de entorno:

```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER:-postgres}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-CHANGE_ME_IN_ENV}
  POSTGRES_DB: ${POSTGRES_DB:-a4co_db}
```

Para ejecutar Docker Compose con tus variables:

```bash
# Opción 1: Usar archivo .env (recomendado)
docker compose -f compose.dev.yaml up -d

# Opción 2: Pasar variables directamente
POSTGRES_PASSWORD=mi_password docker compose -f compose.dev.yaml up -d
```

### Docker Secrets

El script `setup-docker-secrets.sh` configura secretos para Docker Swarm:

```bash
# Uso correcto con variables de entorno
DB_USER="readonly_user" DB_PASSWORD="tu_password_segura" ./setup-docker-secrets.sh

# O exportando las variables
export DB_USER="readonly_user"
export DB_PASSWORD="tu_password_segura"
./setup-docker-secrets.sh
```

**⚠️ IMPORTANTE**: Este script valida que las variables estén definidas antes de ejecutarse.

## 🧪 Valores de Prueba

Los valores por defecto en el código son **claramente marcados como FAKE/MOCK** para evitar detección como secretos reales:

- `FAKE_PASSWORD_FOR_TESTS_ONLY`
- `FAKE_VALID_PASSWORD_FOR_TESTS`
- `mock_test_user`

Estos valores son seguros de commitear ya que son obviamente ficticios.

## 🔒 Mejores Prácticas de Seguridad

1. ✅ **NUNCA** commits archivos `.env` al repositorio
2. ✅ **SIEMPRE** usa variables de entorno para secretos
3. ✅ Rota las credenciales regularmente
4. ✅ Usa contraseñas fuertes (mínimo 16 caracteres, caracteres especiales)
5. ✅ En producción, usa servicios de gestión de secretos (AWS Secrets Manager, etc.)
6. ✅ Limita el acceso a archivos `.env` (permisos 600 en Unix)

## 🔄 Migrando Secretos Existentes

Si ya tienes secretos expuestos en commits anteriores:

1. **Rota inmediatamente** todas las credenciales comprometidas
2. Reescribe el historial de Git (si es posible y el equipo está de acuerdo)
3. Informa al equipo de seguridad

## 📚 Referencias

- [GitGuardian Security Best Practices](https://docs.gitguardian.com/)
- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App - Config](https://12factor.net/config)

