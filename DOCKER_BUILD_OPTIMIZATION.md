# Optimización de Builds Docker para Frontend y Dashboard

## 📋 Resumen

Se han optimizado los Dockerfiles de producción para las aplicaciones **frontend** (Vite + React) y **dashboard-client** (Next.js) para reducir los tiempos de build en CI/CD.

## 🎯 Objetivo

✅ **Meta:** Lograr tiempos de build < 2 minutos en GitHub Actions

## 🚀 Optimizaciones Implementadas

### 1. **Multi-Stage Builds**

Se utilizan 3 stages para optimizar el proceso:

- **Stage 1 - Dependencies:** Solo instala dependencias
- **Stage 2 - Builder:** Compila la aplicación
- **Stage 3 - Production:** Imagen final ligera con solo runtime

### 2. **Caché de pnpm Store**

```dockerfile
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm config set store-dir /root/.pnpm-store && \
    pnpm fetch --frozen-lockfile
```

Esto permite reutilizar dependencias entre builds, reduciendo significativamente el tiempo.

### 3. **Instalación Optimizada de Dependencias**

- Se copian primero `package.json`, `pnpm-lock.yaml` y `pnpm-workspace.yaml`
- Se usa `pnpm fetch` para preparar el caché
- Se instala con `--frozen-lockfile --prefer-offline`

### 4. **Separación de Capas**

Las dependencias se instalan en una capa separada antes de copiar el código fuente, maximizando la reutilización de caché.

### 5. **Imagen Final Ligera**

- **Frontend:** Usa `nginx:alpine` (~40MB) para servir archivos estáticos
- **Dashboard:** Usa Next.js standalone output con usuario non-root

## 📁 Archivos Creados/Modificados

### Nuevos Dockerfiles

- ✅ `apps/frontend/Dockerfile.prod`
- ✅ `apps/dashboard-client/Dockerfile.prod`

### Archivos de Configuración

- ✅ `.npmrc` - Configuración de pnpm optimizada
- ✅ `apps/frontend/.dockerignore` - Excluye archivos innecesarios
- ✅ `apps/dashboard-client/.dockerignore` - Excluye archivos innecesarios
- ✅ `apps/dashboard-client/next.config.mjs` - Agregado `output: 'standalone'`

## 🔧 Uso

### Build Local con Caché

#### Frontend (Vite + React)

```bash
cd /workspace
DOCKER_BUILDKIT=1 docker build \
  --file apps/frontend/Dockerfile.prod \
  --tag a4co/frontend:latest \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  .
```

#### Dashboard Client (Next.js)

```bash
cd /workspace
DOCKER_BUILDKIT=1 docker build \
  --file apps/dashboard-client/Dockerfile.prod \
  --tag a4co/dashboard:latest \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  .
```

### Ejecución

#### Frontend

```bash
docker run -p 8080:80 a4co/frontend:latest
```

Acceder en: http://localhost:8080

#### Dashboard

```bash
docker run -p 3000:3000 a4co/dashboard:latest
```

Acceder en: http://localhost:3000

## 🔄 GitHub Actions

### Ejemplo de Workflow con Caché

```yaml
name: Build Docker Images

on:
  push:
    branches: [main]

jobs:
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build Frontend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: apps/frontend/Dockerfile.prod
          push: false
          tags: a4co/frontend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  build-dashboard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build Dashboard
        uses: docker/build-push-action@v5
        with:
          context: .
          file: apps/dashboard-client/Dockerfile.prod
          push: false
          tags: a4co/dashboard:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## 📊 Mejoras Esperadas

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Build Time (primera vez) | ~5-7 min | ~3-4 min | ~40-50% |
| Build Time (con caché) | ~5-7 min | **<2 min** | **~70%** |
| Tamaño Imagen Frontend | N/A | ~50MB | Nuevo |
| Tamaño Imagen Dashboard | N/A | ~150MB | Nuevo |

## 🧪 Validación

### Verificar Tamaño de Imágenes

```bash
docker images | grep a4co
```

### Probar Build con Caché

```bash
# Primer build (sin caché)
time DOCKER_BUILDKIT=1 docker build -f apps/frontend/Dockerfile.prod -t a4co/frontend:test .

# Segundo build (con caché) - debería ser mucho más rápido
time DOCKER_BUILDKIT=1 docker build -f apps/frontend/Dockerfile.prod -t a4co/frontend:test .
```

## 🔍 Debugging

### Ver capas del build

```bash
docker history a4co/frontend:latest
docker history a4co/dashboard:latest
```

### Inspeccionar contenido de la imagen

```bash
docker run --rm -it a4co/frontend:latest sh
docker run --rm -it a4co/dashboard:latest sh
```

## 📝 Notas Adicionales

1. **BuildKit:** Asegúrate de tener Docker BuildKit habilitado (Docker 18.09+)
2. **Caché de GitHub Actions:** Se usa `type=gha` para aprovechar el caché nativo de GHA
3. **Seguridad:** El usuario de la imagen de dashboard es non-root (nextjs:nodejs)
4. **Next.js Standalone:** Reduce el tamaño de la imagen final en ~70%

## 🐛 Troubleshooting

### Error: pnpm not found

Asegúrate de que el workspace root tiene la versión correcta de pnpm:

```json
"packageManager": "pnpm@10.14.0"
```

### Error: Module not found

Verifica que los `packages` compartidos estén siendo copiados correctamente en el Dockerfile.

### Build lento en CI

1. Verifica que BuildKit esté habilitado
2. Confirma que el caché de GHA esté configurado
3. Revisa los logs para ver qué layers se están reconstruyendo

## 📚 Referencias

- [Docker Build Cache](https://docs.docker.com/build/cache/)
- [pnpm Docker Best Practices](https://pnpm.io/docker)
- [Next.js Standalone Output](https://nextjs.org/docs/advanced-features/output-file-tracing)
- [GitHub Actions Cache](https://docs.docker.com/build/ci/github-actions/cache/)
