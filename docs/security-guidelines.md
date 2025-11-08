# Security Guidelines

## Introducción

Este documento describe las mejores prácticas para la seguridad de la base de datos,
la gestión de secretos y los workflows en CI/CD para el repositorio A4CO.

## Database Security Best Practices

- Principle of Least Privilege: las cuentas de aplicación deben tener solo los permisos necesarios.
- Evitar `GRANT ALL PRIVILEGES`; usar permisos explícitos (SELECT, INSERT, UPDATE, DELETE, USAGE, CREATE en esquema si aplica).
- No conceder `SUPERUSER`, `CREATEDB` ni `CREATEROLE` a usuarios de aplicación.
- Extensiones que requieren superuser deben ser instaladas por DBAs en entornos productivos.

## Password Management

- Nunca hardcodear contraseñas en scripts SQL o en el código.
- Usar secretos de GitHub o un vault (HashiCorp, AWS Secrets Manager, etc.).
- En CI se permiten valores por defecto no sensibles para bases de datos efímeras, pero documentados y rotados.

## Secrets Management in CI/CD

- Referenciar secretos con `${{ secrets.NAME }}`.
- Para valores usados en archivos de configuración, procesarlos con `envsubst`.
  Verificar que todas las variables han sido expandidas antes de la ejecución.
- No subir artefactos que contengan secretos.
- Establecer caducidad/retención razonable para artefactos y logs.

## SQL Script Security Checklist

- [ ] No hay contraseñas hardcodeadas.
- [ ] Uso de permisos específicos en lugar de `ALL PRIVILEGES`.
- [ ] No se concede `SUPERUSER` o `CREATEDB` a usuarios de aplicación.
- [ ] Scripts idempotentes (usar `IF NOT EXISTS`).
- [ ] Variables de entorno documentadas y validadas.
- [ ] Separar operaciones que requieren superuser en un script independiente (DBA).

## Workflow Security Guidelines

- Declarar permisos mínimos en los workflows (`contents: read`, `deployments: write` solo si necesario).
- Validar la sintaxis YAML antes de mergear (yamllint o revisión manual).
- Añadir checks de seguridad en PR templates (ver .github/PULL_REQUEST_TEMPLATE.md).

## Incident Response

- Si se detecta una credencial comprometida: rotar la credencial, invalidar tokens, y revisar el alcance del compromiso.
- Contactar al equipo de seguridad y seguir el runbook interno.

---

Documentado por: Equipo A4CO
