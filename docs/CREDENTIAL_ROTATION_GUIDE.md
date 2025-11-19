# 🔄 Guía de Rotación de Credenciales

## Identificación y Rotación de Credenciales Comprometidas

Esta guía proporciona procedimientos para identificar y rotar credenciales que pueden haber sido comprometidas.

### 1. 📋 Tipos de Credenciales en el Proyecto

#### JWT Secrets

- **Ubicación**: Variables de entorno `JWT_SECRET`
- **Archivos**: `.env*`, configuración de servicios
- **Uso**: Autenticación de tokens JWT

#### Database Passwords

- **Ubicación**: Variables de entorno `DATABASE_URL`, `DB_PASSWORD`
- **Archivos**: `.env*`, docker-compose files
- **Uso**: Conexión a bases de datos PostgreSQL

#### API Keys

- **Ubicación**: Variables de entorno (Stripe, AWS, etc.)
- **Archivos**: `.env*`, GitHub Secrets
- **Uso**: Servicios externos (Stripe, AWS, etc.)

#### GitHub Tokens

- **Ubicación**: GitHub Secrets, `.env*`
- **Uso**: CI/CD, deployments

### 2. 🔍 Identificación de Credenciales Comprometidas

#### Scripts de Detección

```bash
# Buscar JWT secrets en archivos
grep -r "JWT_SECRET\|jwt.*secret" --exclude-dir=node_modules .

# Buscar database URLs
grep -r "DATABASE_URL\|DB_PASSWORD" --exclude-dir=node_modules .

# Buscar API keys
grep -r "sk_\|pk_\|AKIAI\|xoxb-" --exclude-dir=node_modules .
```

#### Verificación en Git History

```bash
# Buscar commits que contengan secrets
git log --all --grep="secret\|password\|key" --oneline

# Buscar archivos con secrets en history
git log --all --full-history -- "*.env*"
```

### 3. 🚨 Procedimientos de Rotación

#### JWT Secrets

```bash
# 1. Generar nuevo secret
NEW_JWT_SECRET=$(openssl rand -base64 32)

# 2. Actualizar archivos .env
sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$NEW_JWT_SECRET/" .env*

# 3. Actualizar GitHub Secrets
gh secret set JWT_SECRET --body "$NEW_JWT_SECRET"

# 4. Invalidar tokens existentes (requiere lógica de aplicación)
# Nota: Los tokens JWT existentes seguirán siendo válidos hasta expirar
```

#### Database Passwords

```bash
# 1. Generar nueva password
NEW_DB_PASSWORD=$(openssl rand -base64 16)

# 2. Actualizar en base de datos
psql -h localhost -U postgres -c "ALTER USER myuser PASSWORD '$NEW_DB_PASSWORD';"

# 3. Actualizar archivos de configuración
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$NEW_DB_PASSWORD/" .env*

# 4. Actualizar Docker secrets
echo -n "$NEW_DB_PASSWORD" | docker secret create db_pass -

# 5. Reiniciar servicios
docker-compose restart
```

#### Stripe Keys

```bash
# 1. Generar nuevas keys en Stripe Dashboard
# https://dashboard.stripe.com/apikeys

# 2. Actualizar archivos .env
sed -i.bak "s/sk_test_.*/sk_test_XXXXXXXXXXXXXXXXXXXXXXXX/" .env*
sed -i.bak "s/pk_test_.*/pk_test_XXXXXXXXXXXXXXXXXXXXXXXX/" .env*

# 3. Actualizar GitHub Secrets
gh secret set STRIPE_SECRET_KEY --body "sk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
gh secret set STRIPE_PUBLISHABLE_KEY --body "pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
```

#### GitHub Tokens

```bash
# 1. Revocar token antiguo en GitHub Settings
# https://github.com/settings/tokens

# 2. Crear nuevo token con permisos mínimos necesarios

# 3. Actualizar GitHub Secrets
gh secret set GITHUB_TOKEN --body "ghp_XXXXXXXXXXXXXXXXXXXX"

# 4. Probar CI/CD con nuevo token
```

### 4. 🔧 Scripts Automatizados

#### Script de Rotación JWT

```bash
#!/bin/bash
# scripts/rotate-jwt-secret.sh

echo "🔄 Rotando JWT Secret..."

# Generar nuevo secret
NEW_SECRET=$(openssl rand -base64 32)
echo "Nuevo JWT Secret generado"

# Backup archivos actuales
cp .env .env.backup
cp .env.local .env.local.backup 2>/dev/null || true

# Actualizar archivos
sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$NEW_SECRET/" .env*
rm .env*.bak 2>/dev/null || true

# Actualizar GitHub si está disponible
if command -v gh &> /dev/null && gh auth status &> /dev/null; then
    gh secret set JWT_SECRET --body "$NEW_SECRET"
    echo "✅ GitHub Secret actualizado"
fi

echo "✅ JWT Secret rotado exitosamente"
echo "⚠️  Recuerda invalidar tokens existentes en la aplicación"
```

#### Script de Rotación Database

```bash
#!/bin/bash
# scripts/rotate-db-password.sh

echo "🔄 Rotando Database Password..."

# Generar nueva password
NEW_PASSWORD=$(openssl rand -base64 16)
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"

echo "Nueva password generada para usuario: $DB_USER"

# Actualizar en base de datos
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -c "ALTER USER $DB_USER PASSWORD '$NEW_PASSWORD';"

# Actualizar archivos de configuración
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$NEW_PASSWORD/" .env*
sed -i.bak "s|postgresql://.*@|postgresql://$DB_USER:$NEW_PASSWORD@|g" .env*

# Limpiar backups
rm .env*.bak 2>/dev/null || true

# Actualizar Docker si está corriendo
if docker secret ls | grep -q db_pass; then
    echo -n "$NEW_PASSWORD" | docker secret create db_pass_new -
    docker secret rm db_pass
    docker secret create db_pass < <(echo -n "$NEW_PASSWORD")
    docker secret rm db_pass_new
    echo "✅ Docker secret actualizado"
fi

echo "✅ Database password rotado exitosamente"
echo "⚠️  Reinicia los servicios para aplicar cambios"
```

### 5. 📝 Checklist de Rotación

- [ ] **Identificar** todas las ubicaciones donde se usa la credencial
- [ ] **Generar** nueva credencial segura
- [ ] **Actualizar** archivos de configuración local
- [ ] **Actualizar** GitHub Secrets/Actions
- [ ] **Actualizar** Docker secrets si aplica
- [ ] **Probar** funcionalidad con nueva credencial
- [ ] **Invalidar** credencial antigua
- [ ] **Monitorear** logs por errores de autenticación
- [ ] **Documentar** cambios realizados

### 6. 🆘 Respuesta a Compromiso

#### Inmediatamente después de detectar compromiso

1. **Detener** todos los servicios afectados
2. **Rotar** todas las credenciales comprometidas
3. **Auditar** logs de acceso reciente
4. **Notificar** a stakeholders
5. **Monitorear** actividad sospechosa

#### Monitoreo post-rotación

1. **Logs de autenticación** por fallos
2. **Alertas de seguridad** por accesos no autorizados
3. **Uso de recursos** inusual
4. **Actividad de API** sospechosa

### 7. 🔐 Mejores Prácticas

#### Generación de Credenciales

```bash
# JWT Secrets (256 bits)
openssl rand -base64 32

# Database passwords (128 bits)
openssl rand -base64 16

# API Keys (usar generadores específicos del servicio)
```

#### Almacenamiento Seguro

- **Nunca** commitear credenciales en código
- **Siempre** usar variables de entorno
- **Rotar** credenciales regularmente
- **Limitar** alcance de permisos

#### Monitoreo Continuo

- **Auditorías** periódicas de credenciales
- **Monitoreo** de uso de secrets
- **Alertas** por actividad sospechosa
- **Logs** de acceso a credenciales

---

_Esta guía debe actualizarse cuando se agreguen nuevos tipos de credenciales al proyecto._
