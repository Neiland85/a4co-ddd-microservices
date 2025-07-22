#!/bin/bash

# Script de despliegue para servicios en el monorepo

set -e

# Variables
SERVICE=$1
ENV=$2

if [ -z "$SERVICE" ] || [ -z "$ENV" ]; then
  echo "Uso: ./deploy.sh <servicio> <entorno>"
  exit 1
fi

# Debug: Mostrar valores de las variables
echo "Servicio: $SERVICE"
echo "Entorno: $ENV"

# Verificar si el directorio existe
if [ ! -d "apps/$SERVICE-service" ]; then
  echo "Error: El directorio apps/$SERVICE-service no existe."
  exit 1
fi

# Debug: Confirmar acceso al directorio
ls -la "apps/$SERVICE-service"

# Construir el servicio
cd apps/$SERVICE-service
pnpm run build

# Desplegar
echo "Desplegando $SERVICE en entorno $ENV..."
# Aquí puedes agregar comandos específicos de despliegue, como subir artefactos a un servidor o ejecutar scripts de infraestructura

echo "Despliegue completado para $SERVICE en entorno $ENV."
