#!/usr/bin/env bash

set -euo pipefail

print_help() {
  cat <<'EOT'
Uso: generate-backend-prisma.sh [opciones]

Opciones:
  -b, --backend-dir <ruta>     Ruta al directorio del backend (por defecto: ./backend)
  -s, --schema <ruta>          Ruta al schema.prisma (por defecto: <backend>/prisma/schema.prisma)
  -u, --database-url <url>     Cadena completa de DATABASE_URL (sobrescribe valor exportado)
  -i, --install                Forzar instalación de dependencias (pnpm install --ignore-workspace)
  --skip-install               Omitir instalación incluso si no existe node_modules
  -p, --pnpm-args <args>       Argumentos adicionales para pnpm exec prisma generate (entre comillas)
  -h, --help                   Mostrar esta ayuda

Variables de entorno soportadas:
  DATABASE_URL                 Se usa si no se pasa --database-url
  PRISMA_GENERATE_SCHEMA       Ruta alternativa del schema (sobrescribe --schema si se define)

Ejemplos:
  ./scripts/generate-backend-prisma.sh
  ./scripts/generate-backend-prisma.sh -u "postgresql://user:pwd@localhost:5432/db?schema=public"
  ./scripts/generate-backend-prisma.sh -s custom/schema.prisma --skip-install
EOT
}

resolve_path() {
  python3 - "$1" <<'PY'
import os, sys
path = sys.argv[1]
print(os.path.realpath(path))
PY
}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR_DEFAULT="${ROOT_DIR}/backend"
FORCE_INSTALL=false
SKIP_INSTALL=false
EXTRA_PRISMA_ARGS=()
OVERRIDE_DB_URL=""
SCHEMA_PATH=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -b|--backend-dir)
      BACKEND_DIR_DEFAULT="$(resolve_path "$2")"
      shift 2
      ;;
    -s|--schema)
      SCHEMA_PATH="$2"
      shift 2
      ;;
    -u|--database-url)
      OVERRIDE_DB_URL="$2"
      shift 2
      ;;
    -i|--install)
      FORCE_INSTALL=true
      shift
      ;;
    --skip-install)
      SKIP_INSTALL=true
      shift
      ;;
    -p|--pnpm-args)
      EXTRA_PRISMA_ARGS+=("$2")
      shift 2
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1" >&2
      print_help
      exit 1
      ;;
  esac
done

BACKEND_DIR="${BACKEND_DIR_DEFAULT}"

if [[ ! -d "${BACKEND_DIR}" ]]; then
  echo "❌ No se encontró el directorio backend en ${BACKEND_DIR}" >&2
  exit 1
fi

if [[ -z "${SCHEMA_PATH}" ]]; then
  SCHEMA_PATH="${PRISMA_GENERATE_SCHEMA:-}"
fi

if [[ -z "${SCHEMA_PATH}" ]]; then
  SCHEMA_PATH="${BACKEND_DIR}/prisma/schema.prisma"
fi

if [[ ! -f "${SCHEMA_PATH}" ]]; then
  echo "❌ No se encontró el schema Prisma en ${SCHEMA_PATH}" >&2
  exit 1
fi

DEFAULT_DB_URL="postgresql://postgres:postgres@localhost:5432/artesanos_dev?schema=public"
if [[ -n "${OVERRIDE_DB_URL}" ]]; then
  export DATABASE_URL="${OVERRIDE_DB_URL}"
else
  export DATABASE_URL="${DATABASE_URL:-$DEFAULT_DB_URL}"
fi

printf '📦 Backend: %s\n' "${BACKEND_DIR}"
printf '📄 Schema:  %s\n' "${SCHEMA_PATH}"
printf '🔗 DATABASE_URL=%s\n' "${DATABASE_URL}"

cd "${BACKEND_DIR}"

if [[ "${SKIP_INSTALL}" == false ]]; then
  if [[ "${FORCE_INSTALL}" == true || ! -d "node_modules" ]]; then
    echo "📥 Instalando dependencias locales del backend..."
    pnpm install --ignore-workspace --frozen-lockfile || {
      echo "❌ Falló la instalación de dependencias" >&2
      exit 1
    }
  fi
else
  echo "⏭  Omitiendo instalación de dependencias (solicitado)"
fi

echo "⚙️  Generando Prisma Client..."
if [[ ${#EXTRA_PRISMA_ARGS[@]} -gt 0 ]]; then
  pnpm exec prisma generate --schema "${SCHEMA_PATH}" "${EXTRA_PRISMA_ARGS[@]}"
else
  pnpm exec prisma generate --schema "${SCHEMA_PATH}"
fi

echo "✅ Prisma Client generado correctamente."
