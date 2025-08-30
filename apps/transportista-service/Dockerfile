# Multi-stage Dockerfile para Transportista Service
FROM python:3.11-slim as base

# Variables de entorno
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Stage de desarrollo
FROM base as development

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install -r requirements.txt

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 8000

# Comando para desarrollo con hot reload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Stage de producción
FROM base as production

# Copiar requirements
COPY requirements.txt .

# Instalar solo dependencias de producción
RUN pip install --no-dev -r requirements.txt

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copiar código fuente
COPY --chown=nextjs:nodejs . .

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando para producción
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]