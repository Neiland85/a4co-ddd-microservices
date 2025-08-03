# 🔐 Guía de Configuración de Secrets - CI/CD Pipeline

Esta guía te ayudará a configurar todos los secrets necesarios para que el pipeline CI/CD funcione correctamente en tu proyecto empresarial.

## 📋 Lista de Secrets Requeridos

### 🔧 **Obligatorios** (Pipeline básico)
- `GITHUB_TOKEN` - ✅ **Automático** (GitHub lo proporciona)
- `CODECOV_TOKEN` - 📊 **Coverage reporting**

### ⚡ **Recomendados** (Optimización)
- `TURBO_TOKEN` - 🚀 **Cache remoto de Turbo**
- `TURBO_TEAM` - 🚀 **Team de Turbo**

### 🛡️ **Seguridad Avanzada** (Opcional pero recomendado)
- `SNYK_TOKEN` - 🔍 **Vulnerability scanning**
- `GITLEAKS_LICENSE` - 🔐 **Secret detection avanzado**

### 🚀 **Deployment** (Para futuro)
- `DEPLOYMENT_TOKEN` - 🌐 **Según proveedor de hosting**
- `DOCKER_USERNAME` - 🐳 **Docker registry (si usas Docker Hub)**
- `DOCKER_PASSWORD` - 🐳 **Docker registry password**

---

## 🚀 Configuración Paso a Paso

### 1. 📊 **Codecov Token** (Recomendado)

#### ¿Para qué sirve?
- Reportes de cobertura de tests visuales
- Tracking de mejoras en cobertura
- Integración con PRs

#### Configuración:

1. **Ir a [Codecov.io](https://codecov.io/)**
2. **Hacer login con GitHub**
3. **Buscar tu repositorio**: `Neiland85/a4co-ddd-microservices`
4. **Copiar el token** desde Settings → Repository Upload Token

```bash
# El token se ve así:
CODECOV_TOKEN=12345678-1234-1234-1234-123456789abc
```

#### Agregar a GitHub:
```bash
# Ir a tu repositorio en GitHub
# Settings → Secrets and variables → Actions → New repository secret
Name: CODECOV_TOKEN
Value: [tu-token-aquí]
```

### 2. 🚀 **Turbo Cache** (Recomendado para performance)

#### ¿Para qué sirve?
- Cache remoto compartido entre CI runs
- Builds hasta 10x más rápidos
- Shared cache entre desarrolladores

#### Configuración:

1. **Ir a [Vercel.com/turbo](https://vercel.com/turbo)**
2. **Crear cuenta o hacer login**
3. **Crear un team** o usar personal
4. **Generar token** en Settings → Tokens

```bash
# Crear un token con scope: full access
TURBO_TOKEN=turbo_abc123def456ghi789
TURBO_TEAM=tu-team-name  # o tu username si es personal
```

#### Agregar a GitHub:
```bash
# Secrets requeridos:
TURBO_TOKEN=turbo_abc123def456ghi789
TURBO_TEAM=tu-team-name
```

### 3. 🛡️ **Snyk Token** (Seguridad)

#### ¿Para qué sirve?
- Análisis avanzado de vulnerabilidades
- Mejor que npm audit
- Reportes detallados de seguridad

#### Configuración:

1. **Ir a [Snyk.io](https://snyk.io/)**
2. **Crear cuenta gratuita** (hasta 200 tests/mes)
3. **Ir a Account Settings → API Token**
4. **Generar nuevo token**

```bash
# El token se ve así:
SNYK_TOKEN=12345678-1234-1234-1234-123456789abc
```

#### Agregar a GitHub:
```bash
Name: SNYK_TOKEN
Value: [tu-token-de-snyk]
```

### 4. 🔐 **GitLeaks License** (Opcional)

#### ¿Para qué sirve?
- Detección avanzada de secrets
- Análisis más profundo que la versión gratuita

#### Configuración:
```bash
# Solo si tienes licencia comercial de GitLeaks
GITLEAKS_LICENSE=tu-licencia-gitleaks
```

---

## 🛠️ Comandos Rápidos de Configuración

### Opción 1: Via GitHub CLI (Recomendado)

```bash
# Instalar GitHub CLI si no lo tienes
# macOS: brew install gh
# Linux: sudo apt install gh
# Windows: winget install GitHub.cli

# Autenticarse
gh auth login

# Configurar secrets básicos
gh secret set CODECOV_TOKEN --body "tu-codecov-token-aquí"
gh secret set TURBO_TOKEN --body "tu-turbo-token-aquí"
gh secret set TURBO_TEAM --body "tu-team-name"
gh secret set SNYK_TOKEN --body "tu-snyk-token-aquí"

# Verificar secrets configurados
gh secret list
```

### Opción 2: Via Interfaz Web de GitHub

```bash
# 1. Ir a tu repositorio en GitHub
# 2. Settings → Secrets and variables → Actions
# 3. Click "New repository secret"
# 4. Agregar cada secret uno por uno
```

---

## 🧪 Verificar Configuración

### 1. **Test Local de Secrets**

```bash
# Crear archivo .env.local para testing (NO commitear)
echo "CODECOV_TOKEN=tu-token" >> .env.local
echo "TURBO_TOKEN=tu-token" >> .env.local
echo "TURBO_TEAM=tu-team" >> .env.local
echo "SNYK_TOKEN=tu-token" >> .env.local

# Verificar que Turbo funciona
pnpm turbo login
pnpm turbo link

# Verificar que Snyk funciona
npx snyk auth tu-snyk-token
npx snyk test
```

### 2. **Test en CI**

```bash
# Hacer un pequeño cambio y push para trigger CI
echo "# Test CI setup" >> README.md
git add README.md
git commit -m "test: verificar setup de CI/CD"
git push origin develop

# Monitorear el workflow en:
# https://github.com/Neiland85/a4co-ddd-microservices/actions
```

---

## 🔒 Mejores Prácticas de Seguridad

### ✅ **DOs**
- ✅ Usar tokens con **mínimos permisos** necesarios
- ✅ **Rotar tokens** cada 6-12 meses
- ✅ **Monitorear uso** de tokens regularmente
- ✅ **Documentar** qué hace cada token
- ✅ Usar **environment-specific secrets** cuando sea posible

### ❌ **DON'Ts**
- ❌ **Nunca** commitear secrets en el código
- ❌ **No usar** secrets personales para el proyecto
- ❌ **No compartir** tokens via Slack/email
- ❌ **No reutilizar** tokens entre proyectos
- ❌ **No usar** admin tokens cuando no sea necesario

---

## 🎯 Configuración por Prioridad

### 🥇 **Configurar AHORA (Crítico)**
```bash
# Mínimo para que funcione el CI básico
CODECOV_TOKEN=xxx  # Para coverage reports
```

### 🥈 **Configurar PRONTO (Muy recomendado)**
```bash
# Para optimización de builds
TURBO_TOKEN=xxx
TURBO_TEAM=xxx

# Para seguridad avanzada
SNYK_TOKEN=xxx
```

### 🥉 **Configurar DESPUÉS (Opcional)**
```bash
# Para features avanzadas futuras
GITLEAKS_LICENSE=xxx
DEPLOYMENT_TOKEN=xxx
```

---

## 🐛 Troubleshooting

### ❌ **Error: "CODECOV_TOKEN not found"**
```bash
# Verificar que el secret existe
gh secret list | grep CODECOV

# Si no existe, agregarlo
gh secret set CODECOV_TOKEN --body "tu-token"
```

### ❌ **Error: "Turbo login failed"**
```bash
# Verificar token y team
echo $TURBO_TOKEN  # debe empezar con "turbo_"
echo $TURBO_TEAM   # debe ser tu team/username

# Re-generar token si es necesario
```

### ❌ **Error: "Snyk authentication failed"**
```bash
# Verificar token
npx snyk auth tu-token

# Re-generar token desde snyk.io si es necesario
```

### ❌ **Error: "403 Forbidden" en CI**
```bash
# Verificar permisos del token
# Asegurarse de que GITHUB_TOKEN tiene permisos suficientes
# (GitHub lo maneja automáticamente)
```

---

## 📊 Estado de Configuración

Usa esta checklist para trackear tu progreso:

```markdown
## 🔐 Secrets Configuration Status

### Core Secrets
- [ ] `CODECOV_TOKEN` - Coverage reporting
- [ ] `TURBO_TOKEN` - Build cache optimization  
- [ ] `TURBO_TEAM` - Turbo team configuration

### Security Secrets  
- [ ] `SNYK_TOKEN` - Vulnerability scanning
- [ ] `GITLEAKS_LICENSE` - Advanced secret detection (optional)

### Future Deployment
- [ ] `DEPLOYMENT_TOKEN` - Hosting provider token
- [ ] `DOCKER_USERNAME` - Container registry (if needed)
- [ ] `DOCKER_PASSWORD` - Container registry (if needed)

### Verification
- [ ] CI pipeline runs successfully
- [ ] Coverage reports appear in PRs
- [ ] Turbo cache shows speed improvements
- [ ] Security scans complete without errors
```

---

## 📞 Soporte

### 🆘 **Si tienes problemas:**

1. **Check GitHub Actions logs** primero
2. **Verificar spelling** de los secret names
3. **Regenerar tokens** si hay dudas sobre validez
4. **Crear issue** en el repo si persisten problemas

### 🔗 **Enlaces útiles:**

- **Codecov Setup**: https://docs.codecov.com/docs/quick-start
- **Turbo Cache**: https://turbo.build/repo/docs/core-concepts/remote-caching
- **Snyk Setup**: https://docs.snyk.io/snyk-cli/getting-started-with-the-cli
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

**🚀 ¡Una vez configurados los secrets, tu pipeline CI/CD estará completamente funcional!**

*Recuerda: Solo necesitas CODECOV_TOKEN para empezar. Los demás secrets optimizan y añaden funcionalidades avanzadas.*