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

# Validar entradas
if [[ ! "$SERVICE" =~ ^(auth|user|order|payment|product)$ ]]; then
  echo "Error: Servicio no válido. Opciones: auth, user, order, payment, product."
  exit 1
fi

if [[ ! "$ENV" =~ ^(dev|staging|prod)$ ]]; then
  echo "Error: Entorno no válido. Opciones: dev, staging, prod."
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

# Construir el servicio
cd apps/$SERVICE-service
pnpm run build

# Desplegar
echo "Subiendo artefactos a S3..."
aws s3 cp dist/ s3://mi-bucket/$SERVICE/$ENV/ --recursive

echo "Despliegue completado para $SERVICE en entorno $ENV."