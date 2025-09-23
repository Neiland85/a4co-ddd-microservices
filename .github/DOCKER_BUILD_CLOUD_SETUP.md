# Docker Build Cloud CI/CD Setup Guide

## 📋 Lista de Secretos Requeridos

Para que el pipeline funcione correctamente, necesitas configurar los siguientes
secretos y variables en tu repositorio de GitHub.

### 🔐 Repository Secrets (Settings → Secrets and variables → Actions)

| Secreto | Descripción | Cómo obtenerlo |
|---------|-------------|----------------|
| `DOCKER_PAT` | Personal Access Token de Docker Hub | 1. Ve a https://hub.docker.com/settings/security<br>2. Genera un nuevo Access Token<br>3. Copia el token generado |

### 📊 Repository Variables (Settings → Secrets and variables → Actions → Variables)

| Variable | Descripción | Valor de ejemplo |
|----------|-------------|-----------------|
| `DOCKER_USER` | Tu username de Docker Hub | `tuusuario` |

## 🚀 Configuración Paso a Paso

### 1. Configurar Docker Hub

```bash
# 1. Ve a https://hub.docker.com y crea una cuenta si no tienes
# 2. Ve a Settings → Security → New Access Token
# 3. Crea un token con permisos de read/write
# 4. Copia el token (solo se muestra una vez)
```

### 2. Configurar GitHub Secrets

```bash
# En tu repositorio de GitHub:
# 1. Ve a Settings → Secrets and variables → Actions
# 2. En "Secrets", añade:
#    - Name: DOCKER_PAT
#    - Value: [tu token de Docker Hub]
# 3. En "Variables", añade:
#    - Name: DOCKER_USER
#    - Value: [tu username de Docker Hub]
```

### 3. Verificar Docker Buildx Cloud Builder

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
- ✅ `security-scan` - Escaneo de vulnerabilidades (solo en main)

### Características Mejoradas

- 🏗️ **Docker Build Cloud** - Builds distribuidos y rápidos
- 🔄 **Multi-plataforma** - Linux AMD64 y ARM64
- 💾 **Caching inteligente** - GitHub Actions cache
- 🏷️ **Tagging automático** - Basado en branch, PR, SHA
- 🔒 **Escaneo de seguridad** - Trivy integration
- 📊 **Metadata automática** - Etiquetas y labels Docker

## 🎯 Beneficios de la Refactorización

1. **Mejor Rendimiento**: Jobs paralelos reducen tiempo total
2. **Construcción Distribuida**: Docker Build Cloud acelera builds
3. **Multi-arquitectura**: Soporte para AMD64 y ARM64
4. **Seguridad Integrada**: Escaneo automático de vulnerabilidades
5. **Mantenibilidad**: Código más limpio y documentado
6. **Flexibilidad**: Matrix strategy para múltiples servicios

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

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs del workflow en GitHub Actions
2. Verifica la configuración de secrets/variables
3. Confirma que Docker Buildx Cloud esté funcionando
4. Contacta al equipo de desarrollo si persiste el problema
