# ======================================================
# 🧩 A4CO DDD Microservices - Dev Container Environment
# ======================================================

FROM mcr.microsoft.com/devcontainers/base:jammy

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV DEBIAN_FRONTEND=noninteractive

# ------------------------------------------------------
# 🧱 Instalar dependencias básicas
# ------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git zsh python3-pip postgresql-client redis-tools \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------
# 🟢 Instalar Node.js y pnpm global
# ------------------------------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && npm install -g pnpm@9

# ------------------------------------------------------
# 👤 Crear usuario 'vscode' si no existe
# ------------------------------------------------------
RUN id -u vscode 2>/dev/null || useradd -ms /bin/bash vscode
USER vscode

WORKDIR /workspace

# ------------------------------------------------------
# 📂 Copiar scripts de inicialización correctamente
# (usando contexto raíz del proyecto)
# ------------------------------------------------------
COPY --chown=vscode:vscode .devcontainer/init-scripts /workspace/.devcontainer/init-scripts

# ------------------------------------------------------
# ⚙️ Configurar entorno Docker
# ------------------------------------------------------
ENV DOCKER_BUILDKIT=1
ENV COMPOSE_DOCKER_CLI_BUILD=1

# ------------------------------------------------------
# ✅ Mensaje de éxito al build
# ------------------------------------------------------
RUN echo "✅ DevContainer listo para A4CO microservices"
