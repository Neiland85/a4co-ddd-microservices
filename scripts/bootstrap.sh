#!/usr/bin/env bash
set -e

echo "🚀 A4CO Bootstrap — Inicializando entorno..."

# Salimos al root del proyecto siempre
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT_DIR"

echo "📦 Limpiando node_modules y dist..."
rm -rf node_modules
rm -rf pnpm-lock.yaml
find . -type d -name "node_modules" -exec rm -rf {} +
find . -type d -name "dist" -exec rm -rf {} +
find . -type f -name ".tsbuildinfo" -exec rm -f {} +

echo "📥 Instalando dependencias..."
pnpm install --force

echo "🛠️ Compilando paquetes shared-utils..."
pnpm --filter @a4co/shared-utils build

echo "📦 Compilando product-service..."
pnpm --filter @a4co/product-service build

echo "✨ Bootstrap completado con éxito"

