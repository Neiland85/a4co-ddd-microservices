#!/usr/bin/env bash
#
# Script de inicialización para trabajar con a4co-ddd-microservices
#

# --- 1. Definir la shell (forzamos bash/zsh según prefieras)
export SHELL=/bin/bash

# --- 2. Ruta a tu clave SSH
KEY_PATH="$HOME/.ssh/a4co-ssh-key"

# --- 3. Iniciar ssh-agent si no está corriendo
if ! pgrep -u "$USER" ssh-agent > /dev/null; then
  echo "[INFO] Iniciando ssh-agent..."
  eval "$(ssh-agent -s)"
fi

# --- 4. Añadir clave si no está cargada
if ! ssh-add -l | grep -q "$KEY_PATH"; then
  echo "[INFO] Añadiendo clave SSH $KEY_PATH ..."
  ssh-add "$KEY_PATH"
else
  echo "[INFO] Clave SSH ya cargada en el agente."
fi

# --- 5. Carpeta raíz para proyectos
PROJECTS_DIR="$HOME/projects"
mkdir -p "$PROJECTS_DIR"
cd "$PROJECTS_DIR" || exit 1

# --- 6. Clonar el repo si no existe
if [ ! -d "$PROJECTS_DIR/a4co-ddd-microservices" ]; then
  echo "[INFO] Clonando repositorio vía SSH..."
  git clone git@github.com:Neiland85/a4co-ddd-microservices.git
else
  echo "[INFO] Repositorio ya existe, entrando en carpeta."
fi

cd a4co-ddd-microservices || exit 1

# --- 7. Comprobación final
echo "[INFO] Shell: $SHELL"
echo "[INFO] Directorio actual: $(pwd)"
git remote -v

