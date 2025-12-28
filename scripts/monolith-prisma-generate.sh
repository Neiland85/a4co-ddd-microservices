#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "❌ pnpm no está instalado o no está en el PATH." >&2
  exit 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
  echo "❌ No se encontró el directorio backend en $BACKEND_DIR." >&2
  exit 1
fi

if [ ! -f "$BACKEND_DIR/package.json" ]; then
  echo "❌ Falta backend/package.json. Ejecuta la preparación del monolito antes de generar Prisma." >&2
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ La variable de entorno DATABASE_URL no está configurada. Configúrala antes de ejecutar este script." >&2
  echo "   Ejemplo: export DATABASE_URL=\"postgresql://usuario:password@localhost:5432/base_de_datos?schema=public\"" >&2
  exit 1
fi

export DATABASE_URL
echo "ℹ️  Usando DATABASE_URL=${DATABASE_URL}"

cd "$BACKEND_DIR"

if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias locales del backend..."
  pnpm install --ignore-workspace-root-check >/dev/null
  echo "✅ Dependencias instaladas."
fi

echo "🛠️  Generando Prisma Client..."
pnpm exec prisma generate
echo "✅ Prisma Client generado en backend."

