#!/bin/bash
# Script para validar la configuración de NGINX

set -e

echo "🔍 Validando configuración de NGINX..."

CONFIG_FILE="infra/docker/nginx.prod.conf"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Error: No se encontró el archivo $CONFIG_FILE"
    exit 1
fi

echo "✅ Archivo encontrado: $CONFIG_FILE"

# Validar sintaxis usando contenedor Docker de NGINX
echo "🔧 Validando sintaxis con nginx -t..."

docker run --rm \
    -v "$(pwd)/$CONFIG_FILE:/etc/nginx/nginx.conf:ro" \
    nginx:alpine \
    nginx -t

if [ $? -eq 0 ]; then
    echo "✅ La sintaxis de NGINX es válida!"
    echo ""
    echo "📋 Resumen de la configuración:"
    echo "   - / → frontend-prod:80 (Frontend Vite)"
    echo "   - /dashboard → dashboard-prod:3001 (Dashboard Next.js)"
    echo "   - /_next/static/* → dashboard-prod:3001 (Assets estáticos de Next.js)"
    echo ""
    echo "✅ Configuración lista para usar en producción"
else
    echo "❌ Error: La sintaxis de NGINX tiene errores"
    exit 1
fi
