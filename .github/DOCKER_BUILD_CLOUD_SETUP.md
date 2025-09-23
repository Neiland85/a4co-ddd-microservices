# Complete CI/CD Setup Guide

## 📋 Lista Completa de Secretos y Variables Requeridos

Para que el pipeline funcione correctamente, necesitas configurar los siguientes
secretos y variables en tu repositorio de GitHub.

### 🔐 Repository Secrets (Settings → Secrets and variables → Actions)

| Secreto | Descripción | Categoría | Cómo obtenerlo |
|---------|-------------|-----------|----------------|
| `DOCKER_PAT` | Personal Access Token de Docker Hub | Docker | 1. Ve a https://hub.docker.com/settings/security<br>2. Genera un nuevo Access Token<br>3. Copia el token generado |
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

### 5. Verificar Docker Buildx Cloud Builder

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

## 🎯 Beneficios de la Refactorización

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
