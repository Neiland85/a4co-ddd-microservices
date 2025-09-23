# Complete CI/CD Setup Guide

## � Docker Hub Outage - Soluciones Implementadas

### Problema Actual
Docker Hub está experimentando un outage con el mensaje: `{"error": "Our service is temporarily unavailable. We'll be back soon!"}`

### ✅ Soluciones Implementadas

#### 1. **Resiliencia en CI Pipeline**
- ✅ Login a Docker Hub con `continue-on-error: true`
- ✅ Builds en PR con `continue-on-error: true` (no fallan por push)
- ✅ Cache local con GitHub Actions Cache (no depende de Docker Hub)

#### 2. **Workflow de Fallback con GHCR**
- ✅ Nuevo workflow: `docker-ghcr-fallback.yml`
- ✅ Usa GitHub Container Registry (ghcr.io)
- ✅ Funciona cuando Docker Hub está caído
- ✅ Mantiene todas las características (SBOM, provenance, multi-platform)

#### 3. **Alternativas para Desarrollo Local**
```bash
# Usar cache local de Docker
docker build --cache-from your-app:latest -t your-app:latest .

# O usar Docker Buildx con cache local
docker buildx build --load --cache-to type=local,dest=/tmp/cache -t your-app:latest .
```

### 🔄 Estado Actual

| Servicio | Estado | Solución |
|----------|--------|----------|
| Docker Hub | ❌ Caído | `continue-on-error` + GHCR fallback |
| GHCR | ✅ Funcional | Workflow `docker-ghcr-fallback.yml` |
| Docker Build Cloud | ✅ Funcional | No afectado por outage |

### 📋 Próximos Pasos

1. **Monitorear Docker Hub**: https://status.docker.com/
2. **Usar GHCR temporalmente**: El workflow fallback está listo
3. **Cache local**: Los builds locales no se ven afectados
4. **Script de monitoreo**: Ejecuta `./check-dockerhub.sh` para verificar cuando vuelva
5. **Reanudar normalidad**: Cuando Docker Hub vuelva, todo funcionará automáticamente

---

## �📋 Lista Completa de Secretos y Variables## 📁 Estructura del Pipeline

El proyecto incluye múltiples workflows especializados:

### Workflows Disponibles

#### 1. **CI Pipeline** (`ci.yml`) - Pipeline Principal

- ✅ `test` - Ejecuta tests unitarios
- ✅ `type-check` - Verificación de tipos TypeScript
- ✅ `code-quality` - Linting, formatting, markdown linting
- ✅ `build` - Construye paquetes e imágenes Docker (depende de anteriores)
- ✅ `security-scan` - Escaneo de vulnerabilidades con Trivy y Snyk (solo en main)
- ✅ `terraform` - Plan y apply de infraestructura (solo en main)
- ✅ `tfc-agent` - Terraform Cloud Agent para despliegues avanzados (opcional)

#### 2. **Docker Workflow** (`docker.yml`) - Construcción Docker Estándar

- ✅ **Triggers**: Push a tags, main branch y pull requests
- ✅ **Registry**: docker.io con autenticación
- ✅ **Metadata**: Etiquetas automáticas (semver, sha, edge)
- ✅ **SBOM**: Generación de Software Bill of Materials
- ✅ **Provenance**: Atribución de procedencia
- ✅ **Cache**: GitHub Actions cache optimizado
- ✅ **Load vs Push**: Load en PR, push en main/tags

### Características Mejoradas

### 🔐 Repository Secrets (Settings → Secrets and variables → Actions)

| Secreto | Descripción | Categoría | Cómo obtenerlo |
|---------|-------------|-----------|----------------|
| `DOCKER_PAT` | Personal Access Token de Docker Hub | Docker | 1. Ve a https://hub.docker.com/settings/security<br>2. Genera un nuevo Access Token<br>3. Copia el token generado |
| `REGISTRY_USER` | Usuario del registro Docker | Docker | Usuario de Docker Hub (mismo que DOCKER_USER) |
| `REGISTRY_TOKEN` | Token del registro Docker | Docker | Token de Docker Hub (mismo que DOCKER_PAT) |
| `TF_API_TOKEN` | Token de API de Terraform Cloud | Terraform | 1. Ve a https://app.terraform.io/app/settings/tokens<br>2. Crea un nuevo token de API<br>3. Copia el token generado |
| `TFC_AGENT_TOKEN` | Token para Terraform Cloud Agent | Terraform | 1. En Terraform Cloud, ve a Settings → Agents<br>2. Crea un nuevo agent token<br>3. Copia el token |
| `SNYK_TOKEN` | Token de autenticación de Snyk | Security | 1. Ve a https://app.snyk.io/account<br>2. Crea un nuevo token de API<br>3. Copia el token |
| `ORGANIZATION_TOKEN` | Token de acceso para la organización | Access | Token proporcionado por el administrador |
| `TEAM_TOKEN_OWNERS` | Token para el equipo de owners | Access | Token proporcionado por el administrador |

### 📊 Repository Variables (Settings → Secrets and variables → Actions → Variables)

| Variable | Descripción | Valor de ejemplo |
|----------|-------------|-----------------|
| `DOCKER_USER` | Tu username de Docker Hub | `tuusuario` |
| `SNYK_ID` | ID de Snyk para OAuth | `3599c939-9d96-4c13-a364-f678801819d9` |

## 🚀 Configuración Paso a Paso

### 1. Configurar Docker Hub

```bash
# 1. Ve a https://hub.docker.com y crea una cuenta si no tienes
# 2. Ve a Settings → Security → New Access Token
# 3. Crea un token con permisos de read/write
# 4. Copia el token (solo se muestra una vez)
```

### 2. Configurar Terraform Cloud

```bash
# 1. Ve a https://app.terraform.io y crea una cuenta/organización
# 2. Crea un workspace llamado "a4co-production"
# 3. Ve a Settings → API Tokens → Create an API token
# 4. Copia el token generado
# 5. Para el Agent Token: Settings → Agents → Create agent
```

### 3. Configurar Snyk

```bash
# 1. Ve a https://app.snyk.io y crea una cuenta
# 2. Ve a Account Settings → API Token
# 3. Crea un nuevo token de API
# 4. Copia el token y el Organization ID
```

### 4. Configurar GitHub Secrets y Variables

```bash
# En tu repositorio de GitHub:
# 1. Ve a Settings → Secrets and variables → Actions
# 2. En "Secrets", añade todos los tokens listados arriba
# 3. En "Variables", añade DOCKER_USER y SNYK_ID
```

### 5. Configurar Workflow Docker Estándar

El workflow `docker.yml` es un workflow adicional especializado en construcción Docker:

- **Cuándo usarlo**: Para builds Docker simples y estándar
- **Triggers**: Se ejecuta en push a main/tags y pull requests
- **Características**:
  - SBOM (Software Bill of Materials)
  - Provenance attestation
  - Metadata automática
  - Cache optimizado
  - Load en PR, push en main

### 6. Verificar Docker Buildx Cloud Builder

```bash
# Asegúrate de que tu builder cloud esté configurado:
docker buildx ls
# Deberías ver: cloud-neiland-a4co-cloud-builder*
```

## 📁 Estructura del Pipeline

El workflow refactorizado incluye:

### Jobs Paralelos

- ✅ `test` - Ejecuta tests unitarios
- ✅ `type-check` - Verificación de tipos TypeScript
- ✅ `code-quality` - Linting, formatting, markdown linting

### Job Secuencial

- ✅ `build` - Construye paquetes e imágenes Docker (depende de anteriores)
- ✅ `security-scan` - Escaneo de vulnerabilidades con Trivy y Snyk (solo en main)
- ✅ `terraform` - Plan y apply de infraestructura (solo en main)
- ✅ `tfc-agent` - Terraform Cloud Agent para despliegues avanzados (opcional)

### Características Mejoradas

- 🏗️ **Docker Build Cloud** - Builds distribuidos y rápidos
- 🔄 **Multi-plataforma** - Linux AMD64 y ARM64
- 💾 **Caching inteligente** - GitHub Actions cache
- 🏷️ **Tagging automático** - Basado en branch, PR, SHA
- 🔒 **Escaneo de seguridad** - Trivy + Snyk integration
- 📊 **Metadata automática** - Etiquetas y labels Docker
- 🏗️ **IaC con Terraform** - Gestión de infraestructura como código
- 🤖 **Terraform Cloud Agent** - Despliegues avanzados automatizados

## 🔄 Workflows Docker: ¿Cuál usar

### CI Pipeline (`ci.yml`) - Recomendado para Monorepos

- ✅ **Completo**: Tests, linting, builds, security, infraestructura
- ✅ **Multi-servicio**: Matrix strategy para múltiples apps/servicios
- ✅ **Cloud Builder**: Docker Buildx Cloud para builds distribuidos
- ✅ **Terraform**: Gestión de infraestructura integrada
- ✅ **Snyk + Trivy**: Escaneo de seguridad dual
- ✅ **Cuándo usarlo**: Desarrollo completo con múltiples servicios

### Docker Workflow (`docker.yml`) - Para Builds Simples

- ✅ **Estándar**: Workflow Docker oficial de GitHub
- ✅ **SBOM**: Generación de Software Bill of Materials
- ✅ **Provenance**: Atribución de procedencia
- ✅ **Metadata**: Etiquetas automáticas avanzadas
- ✅ **Cache**: Optimizado para GitHub Actions
- ✅ **Cuándo usarlo**: Builds Docker simples, proyectos individuales

### Recomendación

- **Usa `ci.yml`** para este monorepo con múltiples servicios
- **Usa `docker.yml`** para proyectos más simples o como referencia

1. **Mejor Rendimiento**: Jobs paralelos reducen tiempo total
2. **Construcción Distribuida**: Docker Build Cloud acelera builds
3. **Multi-arquitectura**: Soporte para AMD64 y ARM64
4. **Seguridad Integrada**: Escaneo automático con Trivy y Snyk
5. **Infraestructura como Código**: Gestión completa con Terraform
6. **Automatización Avanzada**: Terraform Cloud Agent para despliegues
7. **Mantenibilidad**: Código más limpio y documentado
8. **Flexibilidad**: Matrix strategy para múltiples servicios

## 🔧 Troubleshooting

### Error: "builder not found"

```bash
# Verifica que el builder esté disponible
docker buildx ls

# Si no está, crea uno nuevo
docker buildx create --name mybuilder --driver cloud \
  --driver-opt endpoint="neiland/a4co-cloud-builder"
```

### Error: "authentication failed"

- Verifica que `DOCKER_PAT` sea válido
- Asegúrate de que `DOCKER_USER` sea correcto
- El token debe tener permisos de read/write

### Error: "permission denied"

- Revisa los permisos del workflow en el job `build`
- Asegúrate de que el token tenga acceso al registry

### Error: "terraform command not found"

```bash
# Instala Terraform localmente para testing:
# macOS con Homebrew
brew install terraform

# O descarga desde: https://www.terraform.io/downloads
```

### Error: "Snyk authentication failed"

- Verifica que `SNYK_TOKEN` sea válido
- Asegúrate de que `SNYK_ID` corresponda a tu organización
- Revisa que tengas permisos en Snyk

### Error: "Terraform Cloud connection failed"

- Verifica que `TF_API_TOKEN` sea válido
- Confirma que la organización "a4co-ddd-microservices" existe
- Revisa que el workspace "a4co-production" esté creado

### Error: "TFC Agent failed to start"

- Verifica que `TFC_AGENT_TOKEN` sea válido
- Asegúrate de que Docker esté corriendo
- Revisa los logs del container: `docker logs tfc-agent`

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs del workflow en GitHub Actions
2. Verifica la configuración de secrets/variables
3. Confirma que Docker Buildx Cloud esté funcionando
4. Contacta al equipo de desarrollo si persiste el problema

---

## 🚀 Próximos Pasos

### 1. Configurar Secrets en GitHub

Ve a **Settings > Secrets and variables > Actions** y configura:

```bash
# Terraform Cloud
TF_API_TOKEN=tu_token_de_terraform_cloud
TFC_AGENT_TOKEN=tu_token_de_agente_terraform

# Snyk Security
SNYK_TOKEN=tu_token_de_snyk

# Docker Registry
REGISTRY_USER=tu_usuario_de_registry
REGISTRY_TOKEN=tu_token_de_registry

# Tokens adicionales (si aplican)
ORGANIZATION_TOKEN=token_de_organizacion
TEAM_TOKEN_OWNERS=token_de_equipo_owners
```

### 2. Configurar Terraform Cloud

1. Crear organización en [Terraform Cloud](https://app.terraform.io)
2. Crear workspace para este proyecto
3. Configurar variables de entorno en el workspace

### 3. Configurar Snyk

1. Crear cuenta en [Snyk](https://snyk.io)
2. Obtener Organization ID
3. Configurar integración con GitHub

### 4. Probar los Workflows

```bash
# Crear PR para probar
git checkout -b test-pipeline
git commit --allow-empty -m "Test pipeline"
git push origin test-pipeline

# Crear PR desde test-pipeline hacia main
```

### 5. Monitoreo

- Revisar **Actions** tab para ver ejecuciones
- Revisar **Security** tab para vulnerabilidades
- Revisar **Pull Requests** para checks automáticos

---

**🎉 ¡Configuración completa!** Tu pipeline CI/CD está listo para desarrollo profesional con Docker Build Cloud.
